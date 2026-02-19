# Design Document: Device User Persistence Fix

## Overview

This design addresses the critical issue where users added directly to the AI06 biometric device randomly disappear after a few minutes. The root cause is that three sync services (machineSyncService, directMachineSync, aasRealtimeSync) operate independently and treat device-only users as orphaned data, potentially causing data loss.

The solution implements a comprehensive two-way sync architecture with:
- A device user buffer table to stage unmapped users
- Read-only sync operations that never delete device users
- Distributed locking to prevent sync conflicts
- Comprehensive logging and monitoring
- Admin interfaces for user mapping and conflict resolution

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AI06 Device (192.168.1.201)             │
│                     - User Storage                           │
│                     - Attendance Logs                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Read-Only Sync (HTTP/ZKLib)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Sync Coordinator Service                    │
│  - Distributed Lock Manager                                  │
│  - Sync Operation Orchestrator                               │
│  - User Discovery Engine                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────────┐ ┌────────────┐ ┌────────────────┐
│ machineSyncSvc │ │ directSync │ │ aasRealtimeSync│
└────────┬───────┘ └─────┬──────┘ └────────┬───────┘
         │               │                  │
         └───────────────┼──────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────────┐  ┌──────────────────────────────────┐│
│  │ device_user_     │  │ user_machine_mapping             ││
│  │ buffer           │  │ - machine_user_id                ││
│  │ - device_user_id │  │ - person_id                      ││
│  │ - name           │  │ - person_type                    ││
│  │ - discovered_at  │  └──────────────────────────────────┘│
│  │ - last_seen_at   │                                       │
│  │ - mapping_status │  ┌──────────────────────────────────┐│
│  └──────────────────┘  │ sync_locks                       ││
│                        │ - lock_key                        ││
│  ┌──────────────────┐  │ - acquired_by                    ││
│  │ user_conflicts   │  │ - acquired_at                    ││
│  │ - device_user_id │  │ - expires_at                     ││
│  │ - conflict_type  │  └──────────────────────────────────┘│
│  │ - device_data    │                                       │
│  │ - database_data  │  ┌──────────────────────────────────┐│
│  │ - resolved       │  │ device_user_audit_log            ││
│  └──────────────────┘  │ - operation_type                 ││
│                        │ - device_user_id                  ││
│                        │ - performed_by                    ││
│                        │ - details                         ││
│                        │ - timestamp                       ││
│                        └──────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **Sync Initiation**: Sync service requests lock from coordinator
2. **Lock Acquisition**: Coordinator grants lock if available
3. **User Discovery**: Service reads all users from AI06 device
4. **Buffer Update**: Unmapped users are added/updated in device_user_buffer
5. **Attendance Sync**: Attendance records are synced (existing functionality)
6. **Lock Release**: Service releases lock after completion
7. **Monitoring**: Background service monitors user count changes

## Components and Interfaces

### 1. Sync Coordinator Service

**Purpose**: Orchestrates sync operations and prevents conflicts between multiple sync services.

**Interface**:
```javascript
class SyncCoordinator {
  /**
   * Acquire a distributed lock for sync operation
   * @param {string} serviceName - Name of the requesting service
   * @param {number} timeoutSeconds - Lock timeout (default: 300)
   * @returns {Promise<{success: boolean, lockId: string}>}
   */
  async acquireLock(serviceName, timeoutSeconds = 300);

  /**
   * Release a distributed lock
   * @param {string} lockId - Lock identifier
   * @returns {Promise<{success: boolean}>}
   */
  async releaseLock(lockId);

  /**
   * Check if a lock is currently held
   * @returns {Promise<{isLocked: boolean, heldBy: string}>}
   */
  async checkLockStatus();

  /**
   * Clean up expired locks
   * @returns {Promise<{cleaned: number}>}
   */
  async cleanupExpiredLocks();
}
```

**Database Schema**:
```sql
CREATE TABLE sync_locks (
  id SERIAL PRIMARY KEY,
  lock_key VARCHAR(100) UNIQUE NOT NULL,
  acquired_by VARCHAR(100) NOT NULL,
  acquired_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_locks_key ON sync_locks(lock_key);
CREATE INDEX idx_sync_locks_expires ON sync_locks(expires_at);
```

### 2. Device User Buffer Service

**Purpose**: Manages the staging area for unmapped device users.

**Interface**:
```javascript
class DeviceUserBufferService {
  /**
   * Add or update a device user in the buffer
   * @param {Object} deviceUser - User data from device
   * @returns {Promise<{success: boolean, bufferId: number}>}
   */
  async upsertDeviceUser(deviceUser);

  /**
   * Get all unmapped users from buffer
   * @param {Object} filters - Optional filters (status, dateRange)
   * @returns {Promise<Array<Object>>}
   */
  async getUnmappedUsers(filters = {});

  /**
   * Mark a buffer user as mapped
   * @param {number} deviceUserId - Device user ID
   * @param {number} personId - Database person ID
   * @returns {Promise<{success: boolean}>}
   */
  async markAsMapped(deviceUserId, personId);

  /**
   * Get buffer statistics
   * @returns {Promise<{total: number, unmapped: number, mapped: number}>}
   */
  async getStatistics();
}
```

**Database Schema**:
```sql
CREATE TABLE device_user_buffer (
  id SERIAL PRIMARY KEY,
  device_user_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(255),
  card_number VARCHAR(50),
  privilege INTEGER,
  password VARCHAR(50),
  group_id INTEGER,
  timezone_id INTEGER,
  discovered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMP NOT NULL DEFAULT NOW(),
  mapping_status VARCHAR(20) NOT NULL DEFAULT 'unmapped',
  mapped_to_person_id INTEGER,
  mapped_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_user_buffer_status ON device_user_buffer(mapping_status);
CREATE INDEX idx_device_user_buffer_last_seen ON device_user_buffer(last_seen_at);
CREATE INDEX idx_device_user_buffer_device_id ON device_user_buffer(device_user_id);
```

### 3. Enhanced Sync Services

**Purpose**: Modified sync services that operate in read-only mode and populate the buffer.

**Modified Interface** (applies to all three sync services):
```javascript
class EnhancedSyncService {
  /**
   * Sync users and attendance from device (read-only)
   * @returns {Promise<Object>} Sync result with statistics
   */
  async syncFromDevice();

  /**
   * Discover and buffer unmapped users
   * @returns {Promise<{discovered: number, buffered: number}>}
   */
  async discoverUnmappedUsers();

  /**
   * Get all users from device (read-only)
   * @returns {Promise<Array<Object>>}
   */
  async getDeviceUsers();

  /**
   * Sync attendance records only (existing functionality)
   * @returns {Promise<Object>}
   */
  async syncAttendanceRecords();
}
```

### 4. User Conflict Resolution Service

**Purpose**: Detects and manages conflicts between device and database users.

**Interface**:
```javascript
class ConflictResolutionService {
  /**
   * Detect conflicts between device and database
   * @returns {Promise<Array<Object>>} List of conflicts
   */
  async detectConflicts();

  /**
   * Log a conflict
   * @param {Object} conflict - Conflict details
   * @returns {Promise<{conflictId: number}>}
   */
  async logConflict(conflict);

  /**
   * Get all unresolved conflicts
   * @returns {Promise<Array<Object>>}
   */
  async getUnresolvedConflicts();

  /**
   * Resolve a conflict
   * @param {number} conflictId - Conflict ID
   * @param {string} resolution - Resolution strategy ('use_device', 'use_database', 'merge')
   * @param {string} adminId - Administrator ID
   * @returns {Promise<{success: boolean}>}
   */
  async resolveConflict(conflictId, resolution, adminId);
}
```

**Database Schema**:
```sql
CREATE TABLE user_conflicts (
  id SERIAL PRIMARY KEY,
  device_user_id INTEGER NOT NULL,
  conflict_type VARCHAR(50) NOT NULL,
  device_data JSONB NOT NULL,
  database_data JSONB,
  detected_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(100),
  resolution_strategy VARCHAR(50),
  resolution_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_conflicts_resolved ON user_conflicts(resolved);
CREATE INDEX idx_user_conflicts_device_id ON user_conflicts(device_user_id);
```

### 5. Device User Monitoring Service

**Purpose**: Monitors device user count and detects disappearances in real-time.

**Interface**:
```javascript
class DeviceUserMonitoringService {
  /**
   * Start monitoring service
   * @param {number} intervalMinutes - Polling interval (default: 5)
   */
  startMonitoring(intervalMinutes = 5);

  /**
   * Stop monitoring service
   */
  stopMonitoring();

  /**
   * Get current device user count
   * @returns {Promise<{count: number, timestamp: Date}>}
   */
  async getCurrentUserCount();

  /**
   * Get user count history
   * @param {number} hours - Hours of history to retrieve
   * @returns {Promise<Array<Object>>}
   */
  async getUserCountHistory(hours = 24);

  /**
   * Check for missing users
   * @returns {Promise<{missing: Array<number>, count: number}>}
   */
  async checkForMissingUsers();
}
```

**Database Schema**:
```sql
CREATE TABLE device_user_count_history (
  id SERIAL PRIMARY KEY,
  user_count INTEGER NOT NULL,
  user_ids JSONB NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_user_count_timestamp ON device_user_count_history(timestamp);
```

### 6. Device User Audit Log Service

**Purpose**: Comprehensive logging of all user-related operations.

**Interface**:
```javascript
class DeviceUserAuditService {
  /**
   * Log a user operation
   * @param {Object} operation - Operation details
   * @returns {Promise<{logId: number}>}
   */
  async logOperation(operation);

  /**
   * Query audit logs
   * @param {Object} filters - Query filters
   * @returns {Promise<Array<Object>>}
   */
  async queryLogs(filters);

  /**
   * Get logs for a specific user
   * @param {number} deviceUserId - Device user ID
   * @returns {Promise<Array<Object>>}
   */
  async getUserLogs(deviceUserId);
}
```

**Database Schema**:
```sql
CREATE TABLE device_user_audit_log (
  id SERIAL PRIMARY KEY,
  operation_type VARCHAR(50) NOT NULL,
  device_user_id INTEGER,
  device_user_name VARCHAR(255),
  performed_by VARCHAR(100) NOT NULL,
  service_name VARCHAR(100),
  details JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_user_audit_operation ON device_user_audit_log(operation_type);
CREATE INDEX idx_device_user_audit_device_id ON device_user_audit_log(device_user_id);
CREATE INDEX idx_device_user_audit_timestamp ON device_user_audit_log(timestamp);
```

### 7. Backup and Restore Service

**Purpose**: Automatic backup and restore of device users.

**Interface**:
```javascript
class BackupRestoreService {
  /**
   * Backup all device users
   * @returns {Promise<{success: boolean, backupFile: string, userCount: number}>}
   */
  async backupDeviceUsers();

  /**
   * List available backups
   * @returns {Promise<Array<Object>>}
   */
  async listBackups();

  /**
   * Restore users from backup
   * @param {string} backupFile - Backup filename
   * @param {boolean} dryRun - Preview without applying
   * @returns {Promise<{success: boolean, restored: number, failed: number}>}
   */
  async restoreFromBackup(backupFile, dryRun = false);

  /**
   * Start automatic backup schedule
   * @param {number} intervalHours - Backup interval (default: 6)
   */
  startAutoBackup(intervalHours = 6);

  /**
   * Stop automatic backup schedule
   */
  stopAutoBackup();
}
```

## Data Models

### Device User Model
```javascript
{
  deviceUserId: number,      // Unique ID on device
  name: string,              // User name
  cardNumber: string,        // Card/badge number
  privilege: number,         // User privilege level
  password: string,          // User password (if any)
  groupId: number,           // Group assignment
  timezoneId: number,        // Timezone assignment
  fingerprints: Array,       // Fingerprint templates
  faces: Array               // Face templates
}
```

### Buffer User Model
```javascript
{
  id: number,                // Buffer record ID
  deviceUserId: number,      // Device user ID
  name: string,              // User name
  cardNumber: string,        // Card number
  discoveredAt: Date,        // First discovery time
  lastSeenAt: Date,          // Last seen time
  mappingStatus: string,     // 'unmapped', 'mapped', 'conflict'
  mappedToPersonId: number,  // Linked person ID (if mapped)
  mappedAt: Date,            // Mapping timestamp
  notes: string              // Admin notes
}
```

### Conflict Model
```javascript
{
  id: number,                // Conflict ID
  deviceUserId: number,      // Device user ID
  conflictType: string,      // 'attribute_mismatch', 'duplicate_id', etc.
  deviceData: Object,        // User data from device
  databaseData: Object,      // User data from database
  detectedAt: Date,          // Detection timestamp
  resolved: boolean,         // Resolution status
  resolvedBy: string,        // Admin who resolved
  resolutionStrategy: string // Resolution method
}
```

### Audit Log Model
```javascript
{
  id: number,                // Log ID
  operationType: string,     // 'user_discovered', 'user_buffered', 'user_deleted', etc.
  deviceUserId: number,      // Device user ID
  deviceUserName: string,    // User name
  performedBy: string,       // User/service that performed operation
  serviceName: string,       // Sync service name
  details: Object,           // Additional details
  timestamp: Date            // Operation timestamp
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified the following redundancies and consolidations:

**Redundancy Group 1: User Preservation**
- Properties 1.3, 3.1, and 3.2 all test that sync operations don't delete device users
- **Consolidation**: Combine into a single comprehensive property about read-only sync operations

**Redundancy Group 2: Buffer Upsert**
- Properties 1.2 and 2.2 both test that unmapped users get added to the buffer
- **Consolidation**: Combine into one property about unmapped user buffering

**Redundancy Group 3: Logging Properties**
- Properties 5.1, 5.2, 5.3, and 5.4 all test that operations are logged
- **Consolidation**: Combine into a single property about comprehensive operation logging

**Redundancy Group 4: Lock Management**
- Properties 7.1 and 7.2 test lock acquisition and release
- **Consolidation**: Combine into one property about lock lifecycle

**Redundancy Group 5: Mapping Status Updates**
- Properties 2.4 and 6.5 both test that mapping creation updates buffer status
- **Consolidation**: Single property about mapping status updates

After reflection, we have 35 unique properties instead of 50, eliminating 15 redundant tests while maintaining complete coverage.

### Correctness Properties

Property 1: Complete User Retrieval
*For any* sync operation, the list of users retrieved from the AI06_Device should equal the complete user list returned by a direct device API query
**Validates: Requirements 1.1**

Property 2: Unmapped User Buffering
*For any* device user that does not exist in user_machine_mapping, running a sync operation should result in that user being present in device_user_buffer
**Validates: Requirements 1.2, 2.2**

Property 3: Read-Only Sync Operations
*For any* sync operation, the set of device users before the sync should equal the set of device users after the sync (no deletions or modifications)
**Validates: Requirements 1.3, 3.1, 3.2**

Property 4: Comprehensive Operation Logging
*For any* user-related operation (discovery, buffering, deletion, mapping), an audit log entry should exist with operation_type, device_user_id, performed_by, and timestamp
**Validates: Requirements 1.4, 5.1, 5.2, 5.3, 5.4**

Property 5: Admin-Only Deletions
*For any* user deletion from the device, the operation should only succeed if initiated through the admin API with valid authentication, and normal sync operations should never delete users
**Validates: Requirements 1.5, 3.4, 3.5**

Property 6: Buffer Timestamp Updates
*For any* device user that appears in multiple sync operations, the last_seen_at timestamp in device_user_buffer should be updated to reflect the most recent sync time
**Validates: Requirements 2.3**

Property 7: Mapping Status Transitions
*For any* unmapped user in device_user_buffer, creating a user_machine_mapping should update the buffer record's mapping_status to 'mapped' and set mapped_at timestamp
**Validates: Requirements 2.4, 6.5**

Property 8: Buffer Retention Policy
*For any* record in device_user_buffer where last_seen_at is within 90 days of the current date, the record should not be deleted
**Validates: Requirements 2.5**

Property 9: Database Deletion Isolation
*For any* user deleted from the staff table, the corresponding device user (if it exists) should remain on the AI06_Device after sync operations
**Validates: Requirements 3.3**

Property 10: Conflict Detection
*For any* device user where device_user_id matches a user_machine_mapping but attributes differ, a record should exist in user_conflicts with both device_data and database_data
**Validates: Requirements 4.1**

Property 11: Conflict Preservation
*For any* detected conflict, both the device user data and database user data should remain unchanged until an administrator explicitly resolves the conflict
**Validates: Requirements 4.2**

Property 12: Conflict Resolution Synchronization
*For any* resolved conflict, applying the resolution should result in the device user and database user having matching attributes according to the resolution strategy
**Validates: Requirements 4.4**

Property 13: Conflict Resolution Audit
*For any* conflict resolution, an audit log entry should exist with the conflict_id, resolved_by admin identity, resolution_strategy, and timestamp
**Validates: Requirements 4.5**

Property 14: Audit Log Query Completeness
*For any* combination of device_user_id, date range, and operation_type filters, the query results should include all audit log entries matching those criteria
**Validates: Requirements 5.5**

Property 15: Buffer API Response Completeness
*For any* record retrieved from the device_user_buffer API, the response should include device_user_id, name, discovered_at, last_seen_at, and mapping_status fields
**Validates: Requirements 6.2**

Property 16: Mapping Validation
*For any* attempt to create a user_machine_mapping with a person_id that does not exist in the staff table, the operation should fail with a validation error
**Validates: Requirements 6.4**

Property 17: Distributed Lock Lifecycle
*For any* sync operation, a lock should be acquired before the operation starts and released after the operation completes, with both events logged
**Validates: Requirements 7.1, 7.2, 7.4**

Property 18: Lock Retry Behavior
*For any* sync operation that cannot acquire a lock, the service should retry up to 3 times before failing
**Validates: Requirements 7.3**

Property 19: Lock Timeout Enforcement
*For any* lock held for more than 5 minutes, the system should automatically release the lock and log a warning
**Validates: Requirements 7.5**

Property 20: Backup File Naming
*For any* backup created, the filename should contain a timestamp in ISO 8601 format
**Validates: Requirements 8.2**

Property 21: Backup Retention Policy
*For any* backup file where the creation date is within 30 days of the current date, the file should not be deleted
**Validates: Requirements 8.3**

Property 22: Monitoring Poll Frequency
*For any* 5-minute time window, the monitoring service should poll the device for the user list at least once
**Validates: Requirements 9.1**

Property 23: User Disappearance Detection
*For any* monitoring poll where the user count decreases, a warning should be logged with the list of missing device_user_ids
**Validates: Requirements 9.2**

Property 24: Disappearance Notification
*For any* detected user disappearance, a notification should be sent to administrators within 1 minute of detection
**Validates: Requirements 9.3**

Property 25: User Count History Tracking
*For any* change in device user count, a record should be inserted into device_user_count_history with the new count, user_ids array, and timestamp
**Validates: Requirements 9.4**

Property 26: Migration Completeness
*For any* execution of the migration script, all device users from the AI06_Device should be retrieved and processed
**Validates: Requirements 10.2**

Property 27: Migration Unmapped User Identification
*For any* device user retrieved during migration, if no matching user_machine_mapping exists, the user should be identified as unmapped
**Validates: Requirements 10.3**

Property 28: Migration Buffer Population
*For any* unmapped user identified during migration, a record should be inserted into device_user_buffer
**Validates: Requirements 10.4**

Property 29: Migration Idempotence
*For any* device user, running the migration script multiple times should result in the same device_user_buffer state as running it once
**Validates: Requirements 10.5**

Property 30: Backup Schedule Adherence
*For any* 6-hour time window, the backup service should create at least one backup of device users
**Validates: Requirements 8.1**

## Error Handling

### Error Categories

1. **Device Connection Errors**
   - Timeout connecting to AI06 device
   - Network unreachable
   - Device offline or unresponsive
   - **Handling**: Retry with exponential backoff (3 attempts), log error, send alert if all retries fail

2. **Database Errors**
   - Connection pool exhausted
   - Query timeout
   - Constraint violations
   - **Handling**: Rollback transaction, log error with full context, retry transient errors

3. **Lock Acquisition Errors**
   - Lock already held by another service
   - Lock timeout
   - **Handling**: Retry up to 3 times with delays, log contention, fail gracefully if unable to acquire

4. **Data Validation Errors**
   - Invalid device user data
   - Missing required fields
   - Invalid person_id for mapping
   - **Handling**: Log validation error with details, skip invalid record, continue processing remaining records

5. **Backup/Restore Errors**
   - Backup file not found
   - Corrupted backup data
   - Insufficient disk space
   - **Handling**: Log error, send alert, maintain previous backup, prevent data loss

### Error Recovery Strategies

**Sync Operation Failures**:
- Partial success: Commit successfully processed records, log failures
- Complete failure: Rollback all changes, maintain last known good state
- Always release locks even on failure

**Device Communication Failures**:
- Use circuit breaker pattern: After 5 consecutive failures, pause sync for 10 minutes
- Send alert to administrators after 3 consecutive failures
- Maintain local cache of last known device state

**Database Transaction Failures**:
- Use savepoints for batch operations
- Rollback to savepoint on individual record failure
- Continue processing remaining records

**Conflict Resolution Failures**:
- Never automatically resolve conflicts
- Preserve both versions until admin intervention
- Log all conflict detection failures

## Testing Strategy

### Dual Testing Approach

This system requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
- Test specific device connection scenarios (timeout, refused, success)
- Test specific conflict types (name mismatch, attribute mismatch)
- Test API endpoint responses and error codes
- Test database schema and constraints
- Test backup file format and restoration

**Property-Based Tests**: Verify universal properties across all inputs
- Generate random device users and verify buffering behavior
- Generate random sync scenarios and verify no deletions occur
- Generate random lock acquisition patterns and verify coordination
- Generate random conflict scenarios and verify preservation
- Test with minimum 100 iterations per property

### Property Test Configuration

All property-based tests should:
- Run minimum 100 iterations (due to randomization)
- Use fast-check library for JavaScript/TypeScript
- Tag each test with format: **Feature: device-user-persistence-fix, Property {number}: {property_text}**
- Each correctness property must be implemented by a SINGLE property-based test

### Test Coverage Requirements

**Critical Paths** (must have both unit and property tests):
1. Sync operation flow (lock → read → buffer → release)
2. User buffering and mapping
3. Conflict detection and resolution
4. Audit logging
5. Backup and restore

**Integration Tests**:
- End-to-end sync with real device (test environment)
- Multi-service coordination with concurrent syncs
- Database transaction rollback scenarios
- Backup creation and restoration flow

**Performance Tests**:
- Sync with 1000+ device users
- Concurrent sync attempts from multiple services
- Buffer query performance with 10,000+ records
- Audit log query performance

### Test Data Generation

For property-based tests, generate:
- Random device users with valid and invalid attributes
- Random mapping states (mapped, unmapped, conflicted)
- Random sync timing patterns
- Random lock acquisition sequences
- Random conflict scenarios

## Implementation Notes

### Migration Path

1. **Phase 1: Add Buffer Infrastructure**
   - Create device_user_buffer table
   - Create sync_locks table
   - Create user_conflicts table
   - Create device_user_audit_log table
   - Create device_user_count_history table

2. **Phase 2: Modify Sync Services**
   - Add lock acquisition/release to all sync services
   - Add user discovery and buffering logic
   - Remove any user deletion code
   - Add comprehensive logging

3. **Phase 3: Add Monitoring**
   - Implement device user monitoring service
   - Set up alerting for user disappearances
   - Implement backup schedule

4. **Phase 4: Add Admin Interfaces**
   - Create API endpoints for buffer management
   - Create API endpoints for conflict resolution
   - Create API endpoints for backup/restore

5. **Phase 5: Run Migration**
   - Execute migration script to populate buffer
   - Verify all unmapped users are captured
   - Enable monitoring and backups

### Performance Considerations

- **Sync Operations**: Should complete within 30 seconds for typical device (100-500 users)
- **Lock Timeout**: 5 minutes is sufficient for normal operations
- **Buffer Queries**: Index on mapping_status and last_seen_at for fast filtering
- **Audit Log**: Partition by month for query performance
- **Monitoring**: 5-minute polling interval balances detection speed with device load

### Security Considerations

- **Admin API**: Require JWT authentication with admin role
- **Audit Logs**: Immutable, append-only
- **Device Communication**: Use HTTPS if device supports it
- **Backup Files**: Store in secure location with restricted access
- **Lock Table**: Prevent SQL injection in lock_key values

### Deployment Considerations

- **Zero Downtime**: New tables can be added without service interruption
- **Rollback Plan**: Keep old sync service code available for quick rollback
- **Monitoring**: Set up alerts before enabling new sync behavior
- **Testing**: Test in staging environment with production data copy
- **Documentation**: Update runbooks with new troubleshooting procedures

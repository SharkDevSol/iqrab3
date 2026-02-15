# Design Document: Dual-Mode Attendance System

## Overview

The Dual-Mode Attendance System extends the existing School Management System to support two distinct methods of recording attendance: manual entry through the web interface and automatic synchronization from AI06 Face Recognition Machines. The system is built on a React frontend, Node.js backend, and PostgreSQL database.

The design emphasizes clear separation between manual and machine-sourced data, robust User ID mapping to ensure correct attribution, and conflict handling when both sources record attendance for the same person on the same day. The system uses the node-zklib library to communicate with ZKTeco devices via TCP/IP.

Key design principles:
- **Source transparency**: Every attendance record clearly indicates its origin (manual or machine)
- **On-demand synchronization**: Machine connection is not required 24/7; sync operations are triggered manually
- **Conflict awareness**: The system detects and flags conflicts rather than silently overwriting data
- **Extensibility**: Support for multiple machines with unique identifiers

## Architecture

The system follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Manual Entry    │         │  Machine Sync    │         │
│  │  Component       │         │  Component       │         │
│  └──────────────────┘         └──────────────────┘         │
│           │                            │                    │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
            │      HTTP/REST API         │
            ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Node.js Backend                          │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  Manual Entry    │         │  Machine Sync    │         │
│  │  Service         │         │  Service         │         │
│  └──────────────────┘         └────────┬─────────┘         │
│           │                            │                    │
│           │                    ┌───────▼─────────┐         │
│           │                    │   node-zklib    │         │
│           │                    │   Client        │         │
│           │                    └───────┬─────────┘         │
└───────────┼────────────────────────────┼────────────────────┘
            │                            │
            │      PostgreSQL            │  TCP/IP (Port 4370)
            ▼                            ▼
┌──────────────────────┐      ┌──────────────────────┐
│   PostgreSQL DB      │      │  AI06 Face           │
│   - attendance       │      │  Recognition         │
│   - students         │      │  Machine             │
│   - staff            │      │  (ZKTeco)            │
│   - sync_logs        │      └──────────────────────┘
└──────────────────────┘
```

### Component Responsibilities

**Frontend (React)**:
- Render manual entry interface with checkboxes/radio buttons for status selection
- Provide "Sync Now" button and display sync progress
- Display attendance records with visual indicators (icons/badges) for source type
- Handle filtering by date, class, department, and source type
- Show conflict warnings when both manual and machine records exist

**Backend (Node.js)**:
- Expose REST API endpoints for manual entry and machine sync
- Validate and sanitize all input data
- Implement business logic for User ID mapping
- Manage TCP/IP connections to AI06 Machines using node-zklib
- Handle conflict detection and resolution
- Maintain audit logs for all operations

**Database (PostgreSQL)**:
- Store attendance records with source tracking
- Maintain User ID mappings between database and machine
- Enforce referential integrity and constraints
- Provide efficient querying with appropriate indexes

**AI06 Machine (ZKTeco)**:
- Capture face recognition check-ins
- Store logs locally until retrieved by backend
- Respond to TCP/IP requests for log retrieval

## Components and Interfaces

### 1. Frontend Components

#### ManualAttendanceEntry Component
```typescript
interface ManualAttendanceEntryProps {
  personType: 'student' | 'staff';
  classOrDepartmentId: string;
  date: Date;
  onSave: (records: AttendanceRecord[]) => Promise<void>;
}

interface AttendanceRecord {
  personId: string;
  status: 'present' | 'absent' | 'late';
}
```

Responsibilities:
- Display list of students or staff for the selected class/department
- Provide UI controls (checkboxes/radio buttons) for status selection
- Validate that at least one status is selected before saving
- Call backend API to save manual attendance records

#### MachineSyncComponent
```typescript
interface MachineSyncComponentProps {
  machineId: string;
  onSyncComplete: (result: SyncResult) => void;
}

interface SyncResult {
  success: boolean;
  recordsRetrieved: number;
  recordsSaved: number;
  unmatchedUserIds: number[];
  errors: string[];
}
```

Responsibilities:
- Display "Sync Now" button and sync progress indicator
- Call backend API to initiate sync operation
- Display sync results including number of records and any errors
- Show list of unmapped User IDs if any

#### AttendanceListView Component
```typescript
interface AttendanceListViewProps {
  personType: 'student' | 'staff';
  filters: AttendanceFilters;
  onFilterChange: (filters: AttendanceFilters) => void;
}

interface AttendanceFilters {
  dateFrom: Date;
  dateTo: Date;
  classOrDepartmentId?: string;
  sourceType?: 'manual' | 'machine' | 'all';
  status?: 'present' | 'absent' | 'late' | 'all';
}

interface AttendanceDisplayRecord {
  id: string;
  personName: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  sourceType: 'manual' | 'machine';
  sourceDetails: string; // User name for manual, Machine IP for machine
  timestamp: Date;
  hasConflict: boolean;
}
```

Responsibilities:
- Fetch and display attendance records based on filters
- Show visual indicators (👤 for manual, 🤖 for machine)
- Highlight conflicting records
- Support sorting and pagination

### 2. Backend Services

#### ManualAttendanceService
```typescript
interface ManualAttendanceService {
  saveManualAttendance(
    records: ManualAttendanceInput[],
    enteredBy: string
  ): Promise<SaveResult>;
  
  updateAttendanceStatus(
    recordId: string,
    newStatus: AttendanceStatus,
    updatedBy: string
  ): Promise<void>;
}

interface ManualAttendanceInput {
  personId: string;
  personType: 'student' | 'staff';
  date: Date;
  status: 'present' | 'absent' | 'late';
}

interface SaveResult {
  success: boolean;
  recordsSaved: number;
  duplicates: number;
  errors: string[];
}
```

Responsibilities:
- Validate manual attendance input
- Check for duplicate entries (same person, same date, source_type='manual')
- Store records in database with source_type='manual'
- Record the user who performed the entry
- Return detailed results including any errors

#### MachineSyncService
```typescript
interface MachineSyncService {
  syncFromMachine(machineId: string): Promise<SyncResult>;
  
  testConnection(machineId: string): Promise<ConnectionTestResult>;
  
  getUnmappedUserIds(): Promise<UnmappedUserIdReport>;
}

interface MachineConfig {
  id: string;
  ipAddress: string;
  port: number;
  name: string;
}

interface ConnectionTestResult {
  success: boolean;
  message: string;
  machineInfo?: {
    serialNumber: string;
    firmwareVersion: string;
  };
}

interface UnmappedUserIdReport {
  unmappedIds: Array<{
    userId: number;
    lastSeen: Date;
    occurrences: number;
  }>;
}
```

Responsibilities:
- Establish TCP/IP connection to AI06 Machine using node-zklib
- Retrieve attendance logs since last successful sync
- Map machine User IDs to database Student/Staff IDs
- Store records with source_type='machine' and machine IP
- Handle connection failures with retry logic (up to 3 attempts)
- Log unmapped User IDs for admin review
- Record sync operation in audit log

#### UserMappingService
```typescript
interface UserMappingService {
  setMachineUserId(
    personId: string,
    personType: 'student' | 'staff',
    machineUserId: number
  ): Promise<void>;
  
  getMachineUserId(
    personId: string,
    personType: 'student' | 'staff'
  ): Promise<number | null>;
  
  getPersonByMachineUserId(
    machineUserId: number
  ): Promise<PersonMapping | null>;
  
  validateUniqueMachineUserId(
    machineUserId: number,
    excludePersonId?: string
  ): Promise<boolean>;
}

interface PersonMapping {
  personId: string;
  personType: 'student' | 'staff';
  personName: string;
  machineUserId: number;
}
```

Responsibilities:
- Maintain bidirectional mapping between database IDs and machine User IDs
- Validate uniqueness of machine User IDs across all students and staff
- Provide lookup functions for both directions (DB→Machine, Machine→DB)
- Support bulk import/export of mappings

#### ConflictDetectionService
```typescript
interface ConflictDetectionService {
  detectConflicts(
    personId: string,
    date: Date
  ): Promise<ConflictInfo | null>;
  
  resolveConflict(
    conflictId: string,
    authoritativeRecordId: string,
    resolvedBy: string
  ): Promise<void>;
  
  getUnresolvedConflicts(): Promise<ConflictInfo[]>;
}

interface ConflictInfo {
  conflictId: string;
  personId: string;
  personName: string;
  date: Date;
  manualRecord: AttendanceRecordDetail;
  machineRecord: AttendanceRecordDetail;
  resolved: boolean;
  authoritativeRecordId?: string;
}

interface AttendanceRecordDetail {
  id: string;
  status: 'present' | 'absent' | 'late';
  timestamp: Date;
  sourceDetails: string;
}
```

Responsibilities:
- Detect when both manual and machine records exist for same person and date
- Create conflict records in database
- Allow admins to mark one record as authoritative
- Maintain both records even after resolution
- Provide list of unresolved conflicts for admin review

### 3. Backend API Endpoints

#### POST /api/attendance/manual
Request:
```json
{
  "records": [
    {
      "personId": "student-123",
      "personType": "student",
      "date": "2024-01-15",
      "status": "present"
    }
  ],
  "enteredBy": "teacher-456"
}
```

Response:
```json
{
  "success": true,
  "recordsSaved": 25,
  "duplicates": 0,
  "errors": []
}
```

#### POST /api/attendance/sync
Request:
```json
{
  "machineId": "machine-001"
}
```

Response:
```json
{
  "success": true,
  "recordsRetrieved": 150,
  "recordsSaved": 145,
  "unmatchedUserIds": [999, 1001],
  "errors": []
}
```

#### GET /api/attendance/list
Query Parameters:
- `personType`: student | staff
- `dateFrom`: ISO date string
- `dateTo`: ISO date string
- `classOrDepartmentId`: optional
- `sourceType`: manual | machine | all
- `status`: present | absent | late | all
- `page`: number
- `limit`: number

Response:
```json
{
  "records": [
    {
      "id": "att-001",
      "personName": "John Doe",
      "date": "2024-01-15",
      "status": "present",
      "sourceType": "machine",
      "sourceDetails": "192.168.43.50",
      "timestamp": "2024-01-15T08:30:00Z",
      "hasConflict": false
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 50
}
```

#### POST /api/attendance/machine/test-connection
Request:
```json
{
  "machineId": "machine-001"
}
```

Response:
```json
{
  "success": true,
  "message": "Connection successful",
  "machineInfo": {
    "serialNumber": "ABC123456",
    "firmwareVersion": "6.60"
  }
}
```

#### GET /api/attendance/conflicts
Response:
```json
{
  "conflicts": [
    {
      "conflictId": "conf-001",
      "personId": "student-123",
      "personName": "Jane Smith",
      "date": "2024-01-15",
      "manualRecord": {
        "id": "att-100",
        "status": "absent",
        "timestamp": "2024-01-15T09:00:00Z",
        "sourceDetails": "Teacher John"
      },
      "machineRecord": {
        "id": "att-101",
        "status": "present",
        "timestamp": "2024-01-15T08:30:00Z",
        "sourceDetails": "192.168.43.50"
      },
      "resolved": false
    }
  ]
}
```

## Data Models

### Attendance Table
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id VARCHAR(50) NOT NULL,
  person_type VARCHAR(10) NOT NULL CHECK (person_type IN ('student', 'staff')),
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  source_type VARCHAR(10) NOT NULL CHECK (source_type IN ('manual', 'machine')),
  source_user_id VARCHAR(50), -- User ID who entered manual record
  source_machine_ip VARCHAR(45), -- IP address of machine for machine records
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_person_student FOREIGN KEY (person_id) 
    REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_person_staff FOREIGN KEY (person_id) 
    REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT fk_source_user FOREIGN KEY (source_user_id) 
    REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_attendance_person_date ON attendance(person_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_source_type ON attendance(source_type);
CREATE INDEX idx_attendance_person_type ON attendance(person_type);
```

### User Mapping Table
```sql
CREATE TABLE user_machine_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id VARCHAR(50) NOT NULL,
  person_type VARCHAR(10) NOT NULL CHECK (person_type IN ('student', 'staff')),
  machine_user_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_person_student FOREIGN KEY (person_id) 
    REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_person_staff FOREIGN KEY (person_id) 
    REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT unique_machine_user_id UNIQUE (machine_user_id),
  CONSTRAINT unique_person UNIQUE (person_id, person_type)
);

CREATE INDEX idx_mapping_machine_user_id ON user_machine_mapping(machine_user_id);
CREATE INDEX idx_mapping_person ON user_machine_mapping(person_id, person_type);
```

### Machine Configuration Table
```sql
CREATE TABLE machine_config (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  port INTEGER NOT NULL DEFAULT 4370,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Sync Log Table
```sql
CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id VARCHAR(50) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  success BOOLEAN NOT NULL,
  records_retrieved INTEGER DEFAULT 0,
  records_saved INTEGER DEFAULT 0,
  error_message TEXT,
  
  CONSTRAINT fk_machine FOREIGN KEY (machine_id) 
    REFERENCES machine_config(id) ON DELETE CASCADE
);

CREATE INDEX idx_sync_log_machine ON sync_log(machine_id);
CREATE INDEX idx_sync_log_started_at ON sync_log(started_at DESC);
```

### Conflict Table
```sql
CREATE TABLE attendance_conflict (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id VARCHAR(50) NOT NULL,
  person_type VARCHAR(10) NOT NULL CHECK (person_type IN ('student', 'staff')),
  date DATE NOT NULL,
  manual_record_id UUID NOT NULL,
  machine_record_id UUID NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  authoritative_record_id UUID,
  resolved_by VARCHAR(50),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT fk_manual_record FOREIGN KEY (manual_record_id) 
    REFERENCES attendance(id) ON DELETE CASCADE,
  CONSTRAINT fk_machine_record FOREIGN KEY (machine_record_id) 
    REFERENCES attendance(id) ON DELETE CASCADE,
  CONSTRAINT fk_resolved_by FOREIGN KEY (resolved_by) 
    REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT unique_conflict UNIQUE (person_id, date)
);

CREATE INDEX idx_conflict_unresolved ON attendance_conflict(resolved) WHERE resolved = false;
```

### Audit Log Table
```sql
CREATE TABLE attendance_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('manual_entry', 'machine_sync', 'status_update', 'conflict_resolution')),
  performed_by VARCHAR(50),
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  details JSONB,
  
  CONSTRAINT fk_performed_by FOREIGN KEY (performed_by) 
    REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_timestamp ON attendance_audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_operation ON attendance_audit_log(operation_type);
```



## Correctness Properties

This section defines formal correctness properties that the Dual-Mode Attendance System must satisfy. These properties will be validated using Property-Based Testing (PBT).

### Property 1: Source Type Preservation
**Validates: Requirements 1.3, 2.4, 4.1**

For any attendance record saved through the system:
- IF the record is created via manual entry API, THEN source_type MUST equal 'manual'
- IF the record is created via machine sync, THEN source_type MUST equal 'machine'
- The source_type value MUST NOT change after initial creation

**Test Strategy:**
Generate random attendance records with both manual and machine sources, save them, and verify that retrieved records maintain their original source_type.

### Property 2: User ID Mapping Uniqueness
**Validates: Requirements 3.4**

For any machine_user_id in the user_machine_mapping table:
- The machine_user_id MUST be unique across all students and staff
- No two person records (regardless of person_type) can share the same machine_user_id
- Attempting to assign a duplicate machine_user_id MUST fail with an error

**Test Strategy:**
Generate random person records and machine_user_ids, attempt to create mappings with duplicates, and verify that the system rejects duplicates while accepting unique values.

### Property 3: Conflict Detection Accuracy
**Validates: Requirements 5.1, 5.2, 5.3**

For any person and date combination:
- IF both a manual record AND a machine record exist for the same person_id and date, THEN a conflict record MUST exist in attendance_conflict table
- IF only one source type exists for a person_id and date, THEN no conflict record should exist
- The conflict record MUST reference both the manual_record_id and machine_record_id correctly

**Test Strategy:**
Generate various combinations of manual and machine records for the same and different person/date pairs, and verify that conflicts are detected only when both sources exist for the same person and date.

### Property 4: Sync Idempotency
**Validates: Requirements 2.2, 2.3**

For any machine sync operation:
- IF the same machine logs are synced multiple times, THEN duplicate attendance records MUST NOT be created
- The number of attendance records after N sync operations with identical logs MUST equal the number after 1 sync operation
- Each unique machine log entry (identified by deviceUserId + recordTime) should result in exactly one attendance record

**Test Strategy:**
Generate machine logs, sync them multiple times, and verify that the database contains exactly one record per unique log entry regardless of sync count.

### Property 5: Timestamp Ordering
**Validates: Requirements 1.4, 2.4**

For any attendance record:
- The timestamp field MUST represent when the record was created in the system
- For manual records, timestamp MUST be >= the time when the save operation was initiated
- For machine records, timestamp MUST be >= the time when the sync operation was initiated
- Timestamps MUST be monotonically increasing for records created in sequence

**Test Strategy:**
Create sequences of attendance records with known timing, and verify that timestamps follow the expected ordering and are within acceptable time bounds.

### Property 6: Referential Integrity
**Validates: Requirements 10.3, 10.5**

For any attendance record:
- The person_id MUST reference an existing student or staff record based on person_type
- IF person_type is 'student', THEN person_id MUST exist in students table
- IF person_type is 'staff', THEN person_id MUST exist in staff table
- IF a person record is deleted, THEN all associated attendance records MUST be deleted (CASCADE)

**Test Strategy:**
Generate attendance records with valid and invalid person_ids, verify that invalid references are rejected, and test cascade deletion behavior.

### Property 7: Status Type Validity
**Validates: Requirements 8.1, 8.2, 8.3**

For any attendance record:
- The status field MUST be one of: 'present', 'absent', 'late'
- Manual records MAY have any of the three status values
- Machine records MUST initially have status = 'present'
- Any other status value MUST be rejected by the system

**Test Strategy:**
Generate attendance records with valid and invalid status values, and verify that only valid values are accepted and machine records default to 'present'.

### Property 8: Machine Connection Retry Logic
**Validates: Requirements 11.4**

For any machine sync operation that encounters a connection failure:
- The system MUST attempt to reconnect up to 3 times
- IF all 3 retry attempts fail, THEN the sync operation MUST report failure
- IF any retry attempt succeeds, THEN the sync operation MUST proceed normally
- The number of connection attempts MUST NOT exceed 3 for a single sync operation

**Test Strategy:**
Simulate connection failures with varying success on retry attempts, and verify that the system retries the correct number of times and reports appropriate results.

### Property 9: Audit Log Completeness
**Validates: Requirements 12.1, 12.2, 12.3**

For any operation that modifies attendance data:
- A corresponding audit log entry MUST be created
- Manual entry operations MUST create an audit log with operation_type = 'manual_entry'
- Machine sync operations MUST create an audit log with operation_type = 'machine_sync'
- The audit log MUST include timestamp, performed_by (if applicable), and operation details

**Test Strategy:**
Perform various attendance operations (manual entry, sync, updates), and verify that each operation creates exactly one audit log entry with correct details.

### Property 10: Filter Consistency
**Validates: Requirements 9.5**

For any attendance list query with filters:
- IF sourceType filter is 'manual', THEN all returned records MUST have source_type = 'manual'
- IF sourceType filter is 'machine', THEN all returned records MUST have source_type = 'machine'
- IF date range filter is applied, THEN all returned records MUST have date within [dateFrom, dateTo]
- IF status filter is applied, THEN all returned records MUST have the specified status
- Combining multiple filters MUST return records that satisfy ALL filter conditions (AND logic)

**Test Strategy:**
Generate diverse attendance records, apply various filter combinations, and verify that returned results match all specified filter criteria.

### Property 11: Conflict Resolution Preservation
**Validates: Requirements 5.4, 5.5**

For any resolved conflict:
- BOTH the manual record AND machine record MUST remain in the attendance table after resolution
- The conflict record MUST have resolved = true
- The authoritative_record_id MUST reference one of the two conflicting records
- Deleting the non-authoritative record MUST NOT be allowed by the system

**Test Strategy:**
Create conflicts, resolve them by marking one record as authoritative, and verify that both records persist and the conflict is properly marked as resolved.

### Property 12: Machine IP Tracking
**Validates: Requirements 2.6**

For any machine-sourced attendance record:
- The source_machine_ip field MUST contain the IP address of the machine that provided the log
- IF multiple machines are configured, THEN records from different machines MUST have different source_machine_ip values
- Manual records MUST have source_machine_ip = NULL

**Test Strategy:**
Sync from multiple machines with different IP addresses, and verify that each record correctly identifies its source machine IP.

## Testing Framework

The system will use **fast-check** (for JavaScript/TypeScript) as the property-based testing framework. Fast-check integrates well with Jest and provides powerful generators for creating test data.

### Example Property Test Structure

```typescript
import fc from 'fast-check';
import { saveManualAttendance, getAttendanceById } from './attendanceService';

describe('Property 1: Source Type Preservation', () => {
  it('manual records must maintain source_type as manual', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          personId: fc.string(),
          personType: fc.constantFrom('student', 'staff'),
          date: fc.date(),
          status: fc.constantFrom('present', 'absent', 'late')
        })),
        async (records) => {
          const result = await saveManualAttendance(records, 'test-user');
          
          for (const savedId of result.savedIds) {
            const retrieved = await getAttendanceById(savedId);
            expect(retrieved.source_type).toBe('manual');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

## Implementation Notes

### Machine Communication Details

The system uses the **node-zklib** library to communicate with ZKTeco devices. Key implementation considerations:

1. **Connection Management**: 
   - Create a new connection for each sync operation
   - Always close connections properly in finally blocks
   - Implement timeout of 10 seconds for connection attempts

2. **Log Retrieval**:
   - Use `getAttendances()` method to retrieve logs
   - Filter logs by timestamp to get only new entries since last sync
   - Handle pagination if the device returns logs in batches

3. **Error Handling**:
   - Network errors: Retry up to 3 times with exponential backoff
   - Device busy errors: Wait and retry
   - Invalid data errors: Log and skip the problematic record

### User ID Mapping Best Practices

1. **Initial Setup**: Provide a bulk import feature for admins to upload CSV files mapping database IDs to machine User IDs
2. **Validation**: When registering a face on the machine, display a warning if the User ID is not mapped in the database
3. **Reporting**: Generate weekly reports of unmapped User IDs found during sync operations
4. **UI Guidance**: In the student/staff creation form, include a field for machine User ID with validation

### Conflict Resolution Workflow

1. **Detection**: Run conflict detection after each sync operation
2. **Notification**: Send notifications to admins when new conflicts are detected
3. **Review Interface**: Provide a dedicated UI for reviewing conflicts side-by-side
4. **Resolution**: Allow admins to mark one record as authoritative or create a new corrected record
5. **Audit**: Log all conflict resolutions with justification notes

### Performance Considerations

1. **Indexing**: Ensure indexes exist on frequently queried columns (person_id, date, source_type)
2. **Batch Operations**: Use batch inserts for machine sync to improve performance
3. **Caching**: Cache machine configuration to avoid repeated database queries
4. **Pagination**: Implement cursor-based pagination for large attendance lists
5. **Background Jobs**: Consider running sync operations as background jobs for large datasets

### Security Considerations

1. **Authentication**: Require authentication for all API endpoints
2. **Authorization**: Implement role-based access control (teachers can only mark attendance for their classes)
3. **Input Validation**: Validate all input data to prevent SQL injection and XSS attacks
4. **Audit Logging**: Log all attendance modifications for accountability
5. **Machine Access**: Restrict machine sync operations to admin users only
6. **Network Security**: Use VPN or secure network for machine communication in production

## Deployment Considerations

### Database Migration

1. Add new columns to existing attendance table if it exists
2. Create new tables (user_machine_mapping, machine_config, sync_log, attendance_conflict, attendance_audit_log)
3. Create indexes for performance
4. Migrate existing attendance data to include source_type='manual' as default

### Dependencies

Add to package.json:
```json
{
  "dependencies": {
    "node-zklib": "^1.0.0"
  },
  "devDependencies": {
    "fast-check": "^3.0.0"
  }
}
```

### Environment Configuration

Add to .env:
```
# Machine Configuration
DEFAULT_MACHINE_IP=192.168.43.50
DEFAULT_MACHINE_PORT=4370
MACHINE_CONNECTION_TIMEOUT=10000
MACHINE_RETRY_ATTEMPTS=3

# Sync Configuration
SYNC_BATCH_SIZE=100
SYNC_LOG_RETENTION_DAYS=90
```

### Frontend Build

1. Update React components to include new attendance features
2. Add icons for manual (👤) and machine (🤖) indicators
3. Implement responsive design for mobile access
4. Add loading states and error handling for sync operations

### Testing Strategy

1. **Unit Tests**: Test individual services and functions
2. **Property-Based Tests**: Validate correctness properties with fast-check
3. **Integration Tests**: Test API endpoints with real database
4. **E2E Tests**: Test complete workflows from frontend to database
5. **Machine Integration Tests**: Test with actual ZKTeco device or simulator

## Future Enhancements

1. **Real-time Sync**: Implement WebSocket connection for real-time attendance updates
2. **Mobile App**: Develop mobile app for teachers to mark attendance on-the-go
3. **Biometric Alternatives**: Support fingerprint and card-based attendance devices
4. **Analytics Dashboard**: Provide attendance analytics and trends
5. **Automated Notifications**: Send alerts for absences or late arrivals
6. **Schedule Integration**: Automatically create attendance records based on class schedules
7. **Geofencing**: Verify that manual attendance is marked from within school premises
8. **Offline Mode**: Support offline attendance marking with sync when connection is restored

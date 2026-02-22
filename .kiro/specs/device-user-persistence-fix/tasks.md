# Implementation Plan: Device User Persistence Fix

## Overview

This implementation plan addresses the critical issue where users added directly to the AI06 biometric device randomly disappear. The solution implements a comprehensive two-way sync architecture with device user buffering, distributed locking, conflict resolution, and comprehensive monitoring.

The implementation is structured in 5 phases to ensure safe, incremental deployment with minimal risk of data loss.

## Tasks

- [x] 1. Create database schema for buffer and audit infrastructure
  - Create device_user_buffer table with indexes
  - Create sync_locks table with indexes
  - Create user_conflicts table with indexes
  - Create device_user_audit_log table with indexes
  - Create device_user_count_history table with indexes
  - _Requirements: 2.1, 2.5, 7.1, 4.1, 5.1, 9.4_

- [ ] 2. Implement Sync Coordinator Service
  - [x] 2.1 Create SyncCoordinator class with lock management
    - Implement acquireLock() method with database-backed distributed locking
    - Implement releaseLock() method
    - Implement checkLockStatus() method
    - Implement cleanupExpiredLocks() method
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ]* 2.2 Write property test for lock lifecycle
    - **Property 17: Distributed Lock Lifecycle**
    - **Validates: Requirements 7.1, 7.2, 7.4**

  - [ ]* 2.3 Write property test for lock retry behavior
    - **Property 18: Lock Retry Behavior**
    - **Validates: Requirements 7.3**

  - [ ]* 2.4 Write property test for lock timeout enforcement
    - **Property 19: Lock Timeout Enforcement**
    - **Validates: Requirements 7.5**

- [ ] 3. Implement Device User Buffer Service
  - [x] 3.1 Create DeviceUserBufferService class
    - Implement upsertDeviceUser() method with timestamp updates
    - Implement getUnmappedUsers() method with filtering
    - Implement markAsMapped() method
    - Implement getStatistics() method
    - _Requirements: 2.2, 2.3, 2.4, 6.1, 6.2_

  - [ ]* 3.2 Write property test for unmapped user buffering
    - **Property 2: Unmapped User Buffering**
    - **Validates: Requirements 1.2, 2.2**

  - [ ]* 3.3 Write property test for buffer timestamp updates
    - **Property 6: Buffer Timestamp Updates**
    - **Validates: Requirements 2.3**

  - [ ]* 3.4 Write property test for mapping status transitions
    - **Property 7: Mapping Status Transitions**
    - **Validates: Requirements 2.4, 6.5**

  - [ ]* 3.5 Write property test for buffer retention policy
    - **Property 8: Buffer Retention Policy**
    - **Validates: Requirements 2.5**

- [ ] 4. Implement Device User Audit Service
  - [x] 4.1 Create DeviceUserAuditService class
    - Implement logOperation() method
    - Implement queryLogs() method with filtering
    - Implement getUserLogs() method
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 4.2 Write property test for comprehensive operation logging
    - **Property 4: Comprehensive Operation Logging**
    - **Validates: Requirements 1.4, 5.1, 5.2, 5.3, 5.4**

  - [ ]* 4.3 Write property test for audit log query completeness
    - **Property 14: Audit Log Query Completeness**
    - **Validates: Requirements 5.5**

- [ ] 5. Checkpoint - Ensure infrastructure tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Modify machineSyncService for read-only operations
  - [x] 6.1 Add lock acquisition before sync operations
    - Integrate SyncCoordinator.acquireLock() at start of syncFromMachine()
    - Add lock release in finally block
    - Add retry logic for lock acquisition failures
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 6.2 Add user discovery and buffering logic
    - Implement getDeviceUsers() method to retrieve all users from device
    - Add logic to identify unmapped users
    - Call DeviceUserBufferService.upsertDeviceUser() for each unmapped user
    - _Requirements: 1.1, 1.2, 2.2_

  - [x] 6.3 Remove user deletion code and add safety checks
    - Remove any code that deletes users from device
    - Add read-only mode verification
    - Add audit logging for all operations
    - _Requirements: 1.3, 1.5, 3.1, 3.4_

  - [ ]* 6.4 Write property test for complete user retrieval
    - **Property 1: Complete User Retrieval**
    - **Validates: Requirements 1.1**

  - [ ]* 6.5 Write property test for read-only sync operations
    - **Property 3: Read-Only Sync Operations**
    - **Validates: Requirements 1.3, 3.1, 3.2**

- [ ] 7. Modify directMachineSync for read-only operations
  - [x] 7.1 Add lock acquisition and user buffering
    - Integrate SyncCoordinator for lock management
    - Add user discovery and buffering logic
    - Remove user deletion code
    - _Requirements: 7.1, 7.2, 1.2, 1.5_

  - [ ]* 7.2 Write property test for database deletion isolation
    - **Property 9: Database Deletion Isolation**
    - **Validates: Requirements 3.3**

- [ ] 8. Modify aasRealtimeSync for read-only operations
  - [x] 8.1 Add lock acquisition and user buffering
    - Integrate SyncCoordinator for lock management
    - Add user discovery and buffering logic
    - Remove user deletion code
    - _Requirements: 7.1, 7.2, 1.2, 1.5_

  - [ ]* 8.2 Write property test for admin-only deletions
    - **Property 5: Admin-Only Deletions**
    - **Validates: Requirements 1.5, 3.4, 3.5**

- [ ] 9. Checkpoint - Ensure sync service tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement Conflict Resolution Service
  - [x] 10.1 Create ConflictResolutionService class
    - Implement detectConflicts() method
    - Implement logConflict() method
    - Implement getUnresolvedConflicts() method
    - Implement resolveConflict() method with strategies (use_device, use_database, merge)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 10.2 Write property test for conflict detection
    - **Property 10: Conflict Detection**
    - **Validates: Requirements 4.1**

  - [ ]* 10.3 Write property test for conflict preservation
    - **Property 11: Conflict Preservation**
    - **Validates: Requirements 4.2**

  - [ ]* 10.4 Write property test for conflict resolution synchronization
    - **Property 12: Conflict Resolution Synchronization**
    - **Validates: Requirements 4.4**

  - [ ]* 10.5 Write property test for conflict resolution audit
    - **Property 13: Conflict Resolution Audit**
    - **Validates: Requirements 4.5**

- [ ] 11. Implement Device User Monitoring Service
  - [x] 11.1 Create DeviceUserMonitoringService class
    - Implement startMonitoring() method with 5-minute polling
    - Implement stopMonitoring() method
    - Implement getCurrentUserCount() method
    - Implement getUserCountHistory() method
    - Implement checkForMissingUsers() method
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 11.2 Write property test for monitoring poll frequency
    - **Property 22: Monitoring Poll Frequency**
    - **Validates: Requirements 9.1**

  - [ ]* 11.3 Write property test for user disappearance detection
    - **Property 23: User Disappearance Detection**
    - **Validates: Requirements 9.2**

  - [ ]* 11.4 Write property test for disappearance notification
    - **Property 24: Disappearance Notification**
    - **Validates: Requirements 9.3**

  - [ ]* 11.5 Write property test for user count history tracking
    - **Property 25: User Count History Tracking**
    - **Validates: Requirements 9.4**

- [ ] 12. Implement Backup and Restore Service
  - [x] 12.1 Create BackupRestoreService class
    - Implement backupDeviceUsers() method
    - Implement listBackups() method
    - Implement restoreFromBackup() method with dry-run support
    - Implement startAutoBackup() method with 6-hour schedule
    - Implement stopAutoBackup() method
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 12.2 Write property test for backup file naming
    - **Property 20: Backup File Naming**
    - **Validates: Requirements 8.2**

  - [ ]* 12.3 Write property test for backup retention policy
    - **Property 21: Backup Retention Policy**
    - **Validates: Requirements 8.3**

  - [ ]* 12.4 Write property test for backup schedule adherence
    - **Property 30: Backup Schedule Adherence**
    - **Validates: Requirements 8.1**

- [ ] 13. Checkpoint - Ensure monitoring and backup tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Create Admin API endpoints for buffer management
  - [x] 14.1 Create /api/device-users/buffer endpoint
    - GET endpoint to retrieve all buffer records with filtering
    - Add authentication middleware (admin only)
    - Add pagination support
    - _Requirements: 6.1, 6.2_

  - [x] 14.2 Create /api/device-users/buffer/:id/map endpoint
    - POST endpoint to create user_machine_mapping
    - Add validation for person_id existence
    - Update buffer record mapping_status
    - _Requirements: 6.3, 6.4, 6.5_

  - [ ]* 14.3 Write property test for buffer API response completeness
    - **Property 15: Buffer API Response Completeness**
    - **Validates: Requirements 6.2**

  - [ ]* 14.4 Write property test for mapping validation
    - **Property 16: Mapping Validation**
    - **Validates: Requirements 6.4**

- [ ] 15. Create Admin API endpoints for conflict resolution
  - [x] 15.1 Create /api/device-users/conflicts endpoint
    - GET endpoint to retrieve unresolved conflicts
    - Add authentication middleware (admin only)
    - _Requirements: 4.3_

  - [x] 15.2 Create /api/device-users/conflicts/:id/resolve endpoint
    - POST endpoint to resolve conflicts
    - Support resolution strategies: use_device, use_database, merge
    - Add authentication and audit logging
    - _Requirements: 4.4, 4.5_

- [ ] 16. Create Admin API endpoints for backup/restore
  - [x] 16.1 Create /api/device-users/backups endpoint
    - GET endpoint to list available backups
    - Add authentication middleware (admin only)
    - _Requirements: 8.4_

  - [x] 16.2 Create /api/device-users/backups/:filename/restore endpoint
    - POST endpoint to restore from backup
    - Support dry-run parameter
    - Add authentication and audit logging
    - _Requirements: 8.5_

- [ ] 17. Create Admin API endpoints for monitoring
  - [x] 17.1 Create /api/device-users/monitoring/status endpoint
    - GET endpoint to retrieve current user count and status
    - Add authentication middleware (admin only)
    - _Requirements: 9.5_

  - [x] 17.2 Create /api/device-users/monitoring/history endpoint
    - GET endpoint to retrieve user count history
    - Support time range filtering
    - _Requirements: 9.5_

- [ ] 18. Create migration script for initial buffer population
  - [x] 18.1 Create migrate-device-users-to-buffer.js script
    - Connect to AI06 device and retrieve all users
    - Identify unmapped users
    - Insert unmapped users into device_user_buffer
    - Make script idempotent
    - Add comprehensive logging
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 18.2 Write property test for migration completeness
    - **Property 26: Migration Completeness**
    - **Validates: Requirements 10.2**

  - [ ]* 18.3 Write property test for migration unmapped user identification
    - **Property 27: Migration Unmapped User Identification**
    - **Validates: Requirements 10.3**

  - [ ]* 18.4 Write property test for migration buffer population
    - **Property 28: Migration Buffer Population**
    - **Validates: Requirements 10.4**

  - [ ]* 18.5 Write property test for migration idempotence
    - **Property 29: Migration Idempotence**
    - **Validates: Requirements 10.5**

- [ ] 19. Checkpoint - Ensure API and migration tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Integration and startup configuration
  - [x] 20.1 Update server.js to initialize services
    - Start SyncCoordinator cleanup task
    - Start DeviceUserMonitoringService
    - Start BackupRestoreService auto-backup
    - Register all new API routes
    - _Requirements: 7.5, 9.1, 8.1_

  - [x] 20.2 Create configuration file for service settings
    - Add configuration for lock timeout (default: 5 minutes)
    - Add configuration for monitoring interval (default: 5 minutes)
    - Add configuration for backup interval (default: 6 hours)
    - Add configuration for buffer retention (default: 90 days)
    - _Requirements: 7.5, 9.1, 8.1, 2.5_

  - [ ]* 20.3 Write integration tests for end-to-end sync flow
    - Test complete sync operation with lock acquisition, user buffering, and release
    - Test concurrent sync attempts from multiple services
    - Test conflict detection and resolution flow
    - _Requirements: 1.1, 1.2, 7.1, 7.2, 4.1, 4.4_

- [ ] 21. Create deployment documentation
  - [x] 21.1 Create DEPLOYMENT.md with step-by-step instructions
    - Document database migration steps
    - Document configuration changes
    - Document service restart procedure
    - Document rollback procedure
    - _Requirements: All_

  - [x] 21.2 Create TROUBLESHOOTING.md with common issues
    - Document how to check buffer status
    - Document how to resolve conflicts
    - Document how to restore from backup
    - Document how to check sync service status
    - _Requirements: 6.1, 4.3, 8.5, 7.1_

- [ ] 22. Final checkpoint - Ensure all tests pass and documentation is complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- All sync services must be modified to use the new read-only architecture
- Migration script should be run after all services are deployed
- Monitoring and backup services should be started after migration completes

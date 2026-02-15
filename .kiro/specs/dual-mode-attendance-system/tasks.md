# Implementation Tasks: Dual-Mode Attendance System

## Task Breakdown

### Phase 1: Database Setup

- [ ] 1.1 Create database migration for attendance table modifications
  - Add source_type column with CHECK constraint
  - Add source_user_id column with foreign key
  - Add source_machine_ip column
  - Create indexes on person_id, date, source_type

- [ ] 1.2 Create user_machine_mapping table
  - Define table schema with person_id, person_type, machine_user_id
  - Add unique constraints on machine_user_id and person_id
  - Create indexes for efficient lookups

- [ ] 1.3 Create machine_config table
  - Define table schema for storing machine connection details
  - Add fields for id, name, ip_address, port, enabled, last_sync_at

- [ ] 1.4 Create sync_log table
  - Define table schema for tracking sync operations
  - Add fields for machine_id, timestamps, success status, record counts

- [ ] 1.5 Create attendance_conflict table
  - Define table schema for tracking conflicts
  - Add foreign keys to manual and machine attendance records
  - Add resolution tracking fields

- [ ] 1.6 Create attendance_audit_log table
  - Define table schema for audit trail
  - Add operation_type, performed_by, timestamp, details fields
  - Create indexes on timestamp and operation_type

- [ ] 1.7 Run database migrations
  - Execute all migration scripts in correct order
  - Verify table creation and constraints
  - Seed initial machine configuration if needed

### Phase 2: Backend - Core Services

- [ ] 2.1 Implement UserMappingService
  - Create setMachineUserId function with uniqueness validation
  - Create getMachineUserId function for lookup
  - Create getPersonByMachineUserId function for reverse lookup
  - Create validateUniqueMachineUserId function
  - Add error handling for constraint violations

- [ ] 2.2 Implement ManualAttendanceService
  - Create saveManualAttendance function
  - Validate input data (person_id, date, status)
  - Check for duplicate manual entries
  - Store records with source_type='manual'
  - Record the user who performed the entry
  - Return detailed save results

- [ ] 2.3 Implement MachineSyncService - Connection Management
  - Install and configure node-zklib dependency
  - Create connection establishment function
  - Implement connection test function
  - Add retry logic with exponential backoff (up to 3 attempts)
  - Implement proper connection cleanup in finally blocks

- [ ] 2.4 Implement MachineSyncService - Log Retrieval
  - Create syncFromMachine function
  - Retrieve attendance logs using node-zklib
  - Filter logs by timestamp (since last successful sync)
  - Handle pagination if device returns batched logs
  - Parse log data into standardized format

- [ ] 2.5 Implement MachineSyncService - Data Processing
  - Map machine User IDs to database person IDs
  - Create attendance records with source_type='machine'
  - Store machine IP address with each record
  - Track unmapped User IDs for reporting
  - Handle errors gracefully and continue processing

- [ ] 2.6 Implement ConflictDetectionService
  - Create detectConflicts function to find duplicate person/date entries
  - Create conflict records when both manual and machine entries exist
  - Implement resolveConflict function for admin resolution
  - Create getUnresolvedConflicts function for UI display
  - Ensure both records are preserved after resolution

- [ ] 2.7 Implement AuditLoggingService
  - Create logManualEntry function
  - Create logMachineSync function
  - Create logStatusUpdate function
  - Create logConflictResolution function
  - Store operation details in JSONB format

### Phase 3: Backend - API Endpoints

- [ ] 3.1 Create POST /api/attendance/manual endpoint
  - Define request/response schemas
  - Validate authentication and authorization
  - Call ManualAttendanceService
  - Return save results with error details
  - Log operation in audit log

- [ ] 3.2 Create POST /api/attendance/sync endpoint
  - Define request/response schemas
  - Validate admin authorization
  - Call MachineSyncService
  - Return sync results including unmapped User IDs
  - Log operation in sync_log and audit_log

- [ ] 3.3 Create GET /api/attendance/list endpoint
  - Define query parameters for filtering
  - Implement filtering by date range, person type, source type, status
  - Add pagination support
  - Return attendance records with source details
  - Include conflict flags in response

- [ ] 3.4 Create POST /api/attendance/machine/test-connection endpoint
  - Validate admin authorization
  - Call MachineSyncService.testConnection
  - Return connection status and machine info
  - Handle connection errors gracefully

- [ ] 3.5 Create GET /api/attendance/conflicts endpoint
  - Validate admin authorization
  - Call ConflictDetectionService.getUnresolvedConflicts
  - Return list of conflicts with details
  - Support filtering by date range

- [ ] 3.6 Create POST /api/attendance/conflicts/:id/resolve endpoint
  - Validate admin authorization
  - Call ConflictDetectionService.resolveConflict
  - Return success status
  - Log resolution in audit log

- [ ] 3.7 Create GET /api/attendance/unmapped-users endpoint
  - Validate admin authorization
  - Return list of unmapped machine User IDs
  - Include last seen date and occurrence count

- [ ] 3.8 Create POST /api/attendance/user-mapping endpoint
  - Validate admin authorization
  - Call UserMappingService.setMachineUserId
  - Handle uniqueness validation errors
  - Return success or error response

### Phase 4: Frontend - Components

- [ ] 4.1 Create ManualAttendanceEntry component
  - Design UI with person list and status checkboxes
  - Implement date selector
  - Add class/department filter
  - Implement save functionality calling API
  - Show success/error messages
  - Display loading state during save

- [ ] 4.2 Create MachineSyncComponent
  - Design UI with "Sync Now" button
  - Add machine selector dropdown
  - Implement progress indicator during sync
  - Display sync results (records retrieved, saved, errors)
  - Show unmapped User IDs with warning
  - Add connection test button

- [ ] 4.3 Create AttendanceListView component
  - Design table layout for attendance records
  - Implement filter controls (date, source type, status)
  - Add visual indicators (👤 for manual, 🤖 for machine)
  - Highlight conflicting records
  - Implement pagination
  - Add sorting functionality

- [ ] 4.4 Create ConflictReviewComponent
  - Design side-by-side comparison view
  - Show details of both manual and machine records
  - Add resolution buttons (mark as authoritative)
  - Display resolution history
  - Filter by resolved/unresolved status

- [ ] 4.5 Create UserMappingComponent
  - Design UI for viewing current mappings
  - Add form for creating new mappings
  - Implement bulk import from CSV
  - Show validation errors for duplicate User IDs
  - Display unmapped User IDs with assignment option

- [ ] 4.6 Create MachineConfigComponent
  - Design UI for managing machine configurations
  - Add form for adding/editing machines
  - Implement connection test button
  - Show last sync timestamp
  - Add enable/disable toggle

- [ ] 4.7 Integrate components into main attendance page
  - Create tab or toggle interface for manual vs machine modes
  - Add navigation between different views
  - Implement responsive design for mobile
  - Add breadcrumb navigation
  - Ensure consistent styling with existing app

### Phase 5: Property-Based Testing

- [ ] 5.1 Set up fast-check testing framework
  - Install fast-check dependency
  - Configure Jest to work with fast-check
  - Create test utilities and generators

- [ ] 5.2 Write property test for Source Type Preservation (Property 1)
  - Generate random attendance records
  - Test manual entry preserves source_type='manual'
  - Test machine sync preserves source_type='machine'
  - Verify source_type doesn't change after creation

- [ ] 5.3 Write property test for User ID Mapping Uniqueness (Property 2)
  - Generate random person records and machine User IDs
  - Test that duplicate machine_user_id is rejected
  - Test that unique machine_user_id is accepted
  - Verify uniqueness across both students and staff

- [ ] 5.4 Write property test for Conflict Detection Accuracy (Property 3)
  - Generate combinations of manual and machine records
  - Test that conflicts are detected when both sources exist
  - Test that no conflict exists when only one source exists
  - Verify conflict records reference correct attendance records

- [ ] 5.5 Write property test for Sync Idempotency (Property 4)
  - Generate machine logs
  - Sync same logs multiple times
  - Verify no duplicate attendance records are created
  - Test that record count remains constant after repeated syncs

- [ ] 5.6 Write property test for Timestamp Ordering (Property 5)
  - Create sequences of attendance records
  - Verify timestamps are monotonically increasing
  - Test that timestamps are within acceptable bounds
  - Verify manual and machine records have appropriate timestamps

- [ ] 5.7 Write property test for Referential Integrity (Property 6)
  - Generate attendance records with valid and invalid person_ids
  - Test that invalid references are rejected
  - Test cascade deletion behavior
  - Verify person_type matches referenced table

- [ ] 5.8 Write property test for Status Type Validity (Property 7)
  - Generate attendance records with valid and invalid status values
  - Test that only valid status values are accepted
  - Verify machine records default to 'present'
  - Test manual records can have any valid status

- [ ] 5.9 Write property test for Machine Connection Retry Logic (Property 8)
  - Simulate connection failures
  - Verify system retries up to 3 times
  - Test that successful retry proceeds normally
  - Verify failure after 3 failed attempts

- [ ] 5.10 Write property test for Audit Log Completeness (Property 9)
  - Perform various attendance operations
  - Verify each operation creates audit log entry
  - Test that audit logs contain correct operation_type
  - Verify audit logs include all required details

- [ ] 5.11 Write property test for Filter Consistency (Property 10)
  - Generate diverse attendance records
  - Apply various filter combinations
  - Verify returned results match all filter criteria
  - Test AND logic for multiple filters

- [ ] 5.12 Write property test for Conflict Resolution Preservation (Property 11)
  - Create and resolve conflicts
  - Verify both records remain after resolution
  - Test that conflict is marked as resolved
  - Verify authoritative_record_id is set correctly

- [ ] 5.13 Write property test for Machine IP Tracking (Property 12)
  - Sync from multiple machines
  - Verify each record has correct source_machine_ip
  - Test that manual records have NULL machine IP
  - Verify different machines have different IPs

### Phase 6: Integration and Testing

- [ ] 6.1 Write integration tests for manual attendance flow
  - Test complete flow from API call to database
  - Verify audit logging
  - Test error handling for invalid data

- [ ] 6.2 Write integration tests for machine sync flow
  - Test complete flow from machine connection to database
  - Verify conflict detection
  - Test unmapped User ID handling

- [ ] 6.3 Write integration tests for conflict resolution
  - Test conflict detection after sync
  - Test resolution workflow
  - Verify both records are preserved

- [ ] 6.4 Test with actual ZKTeco device or simulator
  - Set up test machine or simulator
  - Test connection establishment
  - Test log retrieval
  - Verify data accuracy

- [ ] 6.5 Perform end-to-end testing
  - Test complete user workflows from frontend
  - Verify all features work together
  - Test error scenarios and edge cases

- [ ] 6.6 Conduct performance testing
  - Test with large datasets (1000+ records)
  - Measure sync operation performance
  - Verify pagination works efficiently
  - Test concurrent operations

### Phase 7: Documentation and Deployment

- [ ] 7.1 Write API documentation
  - Document all endpoints with request/response examples
  - Include authentication requirements
  - Document error codes and messages

- [ ] 7.2 Write user guide for manual attendance
  - Create step-by-step instructions
  - Include screenshots
  - Document common issues and solutions

- [ ] 7.3 Write user guide for machine setup
  - Document machine configuration process
  - Explain User ID mapping requirements
  - Provide troubleshooting guide

- [ ] 7.4 Write admin guide for conflict resolution
  - Explain conflict detection logic
  - Provide resolution workflow
  - Document best practices

- [ ] 7.5 Create deployment checklist
  - List all database migrations
  - Document environment variables
  - Include dependency installation steps

- [ ] 7.6 Deploy to staging environment
  - Run database migrations
  - Deploy backend code
  - Deploy frontend code
  - Verify all features work

- [ ] 7.7 Conduct user acceptance testing
  - Train users on new features
  - Gather feedback
  - Fix any issues found

- [ ] 7.8 Deploy to production
  - Schedule maintenance window
  - Run database migrations
  - Deploy code
  - Monitor for errors
  - Verify system stability

## Task Dependencies

- Phase 1 must be completed before Phase 2
- Phase 2 must be completed before Phase 3
- Phase 3 must be completed before Phase 4
- Phase 5 can be done in parallel with Phase 4 (after Phase 2 is complete)
- Phase 6 requires Phase 3 and Phase 4 to be complete
- Phase 7 can begin after Phase 6 is complete

## Estimated Timeline

- Phase 1: 2-3 days
- Phase 2: 5-7 days
- Phase 3: 3-4 days
- Phase 4: 5-7 days
- Phase 5: 4-5 days
- Phase 6: 3-4 days
- Phase 7: 2-3 days

**Total Estimated Time: 24-33 days**

## Notes

- All property-based tests should run with at least 100 iterations
- Manual testing with actual ZKTeco device is critical before production deployment
- User ID mapping must be carefully managed to avoid attendance attribution errors
- Consider implementing feature flags for gradual rollout
- Monitor system performance closely after deployment

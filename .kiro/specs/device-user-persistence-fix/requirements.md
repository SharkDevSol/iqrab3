# Requirements Document: Device User Persistence Fix

## Introduction

This document specifies requirements for fixing the biometric device user persistence issue where users added directly to an AI06 biometric device randomly disappear after a few minutes. The root cause is that multiple sync services (machineSyncService, directMachineSync, aasRealtimeSync) pull data from the device, and when users are added directly to the device without being registered in the local database first, the sync services may treat them as orphaned/unmapped users and handle them incorrectly, causing data loss.

The system must implement a proper two-way sync mechanism that preserves users added directly to the device, creates a staging/buffer system for device-only users until they can be mapped to database records, and adds safeguards to prevent sync services from removing users that exist on the device.

## Glossary

- **AI06_Device**: The biometric device at IP 192.168.1.201 that stores user data and attendance records
- **Sync_Service**: Any of the three services (machineSyncService, directMachineSync, aasRealtimeSync) that synchronize data between the device and database
- **Device_User**: A user record that exists on the AI06 biometric device
- **Database_User**: A user record that exists in the PostgreSQL staff table
- **Unmapped_User**: A user that exists on the device but has no corresponding entry in the user_machine_mapping table
- **User_Machine_Mapping**: The database table that links device user IDs to database person records
- **Device_User_Buffer**: A staging table that temporarily stores device-only users until they can be mapped
- **Sync_Operation**: The process of reading data from the device and updating the database
- **User_Deletion_Event**: An operation that removes a user from the device

## Requirements

### Requirement 1: Device User Discovery and Preservation

**User Story:** As a system administrator, I want all users on the device to be discovered and preserved, so that users never disappear due to sync operations.

#### Acceptance Criteria

1. WHEN a Sync_Service reads users from the AI06_Device, THE Sync_Service SHALL retrieve the complete list of Device_Users
2. WHEN a Device_User is not found in User_Machine_Mapping, THE Sync_Service SHALL add the user to Device_User_Buffer
3. WHEN a Device_User exists in Device_User_Buffer, THE Sync_Service SHALL NOT remove the user from the AI06_Device
4. WHEN a Sync_Operation completes, THE Sync_Service SHALL log all discovered Unmapped_Users with timestamps
5. THE Sync_Service SHALL never delete Device_Users unless explicitly requested by an administrator

### Requirement 2: Device User Buffer Management

**User Story:** As a system administrator, I want device-only users to be stored in a buffer table, so that I can review and map them to database records without losing data.

#### Acceptance Criteria

1. THE System SHALL create a Device_User_Buffer table with columns for device_user_id, name, discovered_at, last_seen_at, and mapping_status
2. WHEN an Unmapped_User is discovered, THE System SHALL insert or update the record in Device_User_Buffer
3. WHEN a Device_User appears in multiple sync operations, THE System SHALL update the last_seen_at timestamp
4. WHEN an Unmapped_User is mapped to a Database_User, THE System SHALL update the mapping_status to 'mapped'
5. THE Device_User_Buffer SHALL retain records for at least 90 days after last_seen_at

### Requirement 3: Sync Service Safety Guarantees

**User Story:** As a system administrator, I want sync services to only add users and never delete them, so that data loss is prevented.

#### Acceptance Criteria

1. THE Sync_Service SHALL operate in read-only mode when accessing Device_Users on the AI06_Device
2. WHEN a Sync_Service detects a Device_User that is not in the database, THE Sync_Service SHALL preserve the user on the device
3. IF a Database_User is deleted, THEN THE Sync_Service SHALL NOT remove the corresponding Device_User from the AI06_Device
4. THE Sync_Service SHALL only perform User_Deletion_Events when explicitly requested through an admin API endpoint
5. WHEN a User_Deletion_Event is requested, THE System SHALL require administrator authentication and log the operation with the admin's identity

### Requirement 4: Conflict Resolution and Reconciliation

**User Story:** As a system administrator, I want the system to handle conflicts between device and database users, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN a Device_User has the same ID as a Database_User but different attributes, THE System SHALL log the conflict in a conflicts table
2. WHEN a conflict is detected, THE System SHALL preserve both the device and database versions without modification
3. THE System SHALL provide an admin interface to view and resolve conflicts
4. WHEN an administrator resolves a conflict, THE System SHALL update both the device and database to match the resolution
5. THE System SHALL log all conflict resolutions with administrator identity and timestamp

### Requirement 5: Comprehensive Logging and Monitoring

**User Story:** As a system administrator, I want detailed logs of all user additions and removals, so that I can track when and why users disappear.

#### Acceptance Criteria

1. WHEN a Device_User is discovered, THE System SHALL log the discovery with device_user_id, name, and timestamp
2. WHEN a Device_User is added to Device_User_Buffer, THE System SHALL log the operation with all user attributes
3. WHEN a Sync_Operation completes, THE System SHALL log the count of users discovered, mapped, and unmapped
4. WHEN a User_Deletion_Event occurs, THE System SHALL log the operation with device_user_id, admin identity, reason, and timestamp
5. THE System SHALL provide a query interface to search logs by device_user_id, date range, and operation type

### Requirement 6: Admin Interface for Unmapped Users

**User Story:** As a system administrator, I want to view and map unmapped device users, so that I can resolve user persistence issues.

#### Acceptance Criteria

1. THE System SHALL provide an API endpoint to retrieve all records from Device_User_Buffer
2. WHEN displaying Device_User_Buffer records, THE System SHALL show device_user_id, name, discovered_at, last_seen_at, and mapping_status
3. THE System SHALL provide an API endpoint to create a User_Machine_Mapping for an Unmapped_User
4. WHEN a mapping is created, THE System SHALL validate that the Database_User exists in the staff table
5. WHEN a mapping is created, THE System SHALL update the Device_User_Buffer record mapping_status to 'mapped'

### Requirement 7: Sync Service Coordination

**User Story:** As a system administrator, I want sync services to coordinate with each other, so that they don't interfere with each other's operations.

#### Acceptance Criteria

1. WHEN a Sync_Service starts a Sync_Operation, THE Sync_Service SHALL acquire a distributed lock
2. WHEN a Sync_Service completes a Sync_Operation, THE Sync_Service SHALL release the distributed lock
3. IF a Sync_Service cannot acquire the lock, THEN THE Sync_Service SHALL wait and retry up to 3 times
4. THE System SHALL log all lock acquisition and release events with service name and timestamp
5. WHEN a lock is held for more than 5 minutes, THE System SHALL automatically release the lock and log a warning

### Requirement 8: Device User Backup and Restore

**User Story:** As a system administrator, I want automatic backups of device users, so that I can restore users if they are accidentally deleted.

#### Acceptance Criteria

1. THE System SHALL automatically backup all Device_Users from the AI06_Device every 6 hours
2. WHEN a backup is created, THE System SHALL store the backup with a timestamp in the filename
3. THE System SHALL retain backups for at least 30 days
4. THE System SHALL provide an API endpoint to list available backups
5. THE System SHALL provide an API endpoint to restore users from a specific backup file

### Requirement 9: Real-time User Monitoring

**User Story:** As a system administrator, I want to monitor device users in real-time, so that I can detect when users disappear.

#### Acceptance Criteria

1. THE System SHALL poll the AI06_Device for the user list every 5 minutes
2. WHEN the user count decreases, THE System SHALL immediately log a warning with the missing user IDs
3. WHEN a Device_User disappears, THE System SHALL send a notification to administrators
4. THE System SHALL maintain a history of user count changes with timestamps
5. THE System SHALL provide an API endpoint to retrieve the current device user count and historical trends

### Requirement 10: Migration and Initialization

**User Story:** As a system administrator, I want to migrate existing unmapped users to the buffer table, so that the system starts with a complete view of all device users.

#### Acceptance Criteria

1. THE System SHALL provide a migration script to populate Device_User_Buffer from current AI06_Device users
2. WHEN the migration runs, THE System SHALL retrieve all Device_Users from the AI06_Device
3. WHEN the migration runs, THE System SHALL identify all Unmapped_Users
4. WHEN the migration runs, THE System SHALL insert all Unmapped_Users into Device_User_Buffer
5. THE migration script SHALL be idempotent and safe to run multiple times

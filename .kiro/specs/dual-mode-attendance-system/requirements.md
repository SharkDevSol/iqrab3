# Requirements Document: Dual-Mode Attendance System

## Introduction

This document specifies the requirements for a dual-mode attendance tracking system that supports both manual entry by administrators/teachers and automatic synchronization from AI06 Face Recognition Machines. The system will track attendance for both students and staff, maintaining clear records of how each attendance entry was captured.

## Glossary

- **Attendance_System**: The dual-mode attendance tracking feature within the School Management System
- **Manual_Mode**: Attendance recording method where administrators or teachers manually mark attendance through the web interface
- **Machine_Mode**: Attendance recording method where attendance is automatically synchronized from AI06 Face Recognition Machines
- **AI06_Machine**: ZKTeco face recognition device that captures check-in logs via facial recognition
- **User_ID**: Unique identifier that maps between database records (Student/Staff) and machine user records
- **Attendance_Record**: A single entry recording presence, absence, or lateness for a person on a specific date
- **Source_Type**: Flag indicating whether an attendance record originated from manual entry or machine synchronization
- **Sync_Operation**: Process of pulling attendance logs from the AI06 Machine and storing them in the database
- **Admin**: User with permissions to manage attendance records and system configuration
- **Teacher**: User with permissions to mark attendance for their assigned classes
- **Status_Type**: Classification of attendance as Present, Absent, or Late

## Requirements

### Requirement 1: Manual Attendance Entry

**User Story:** As a teacher or admin, I want to manually mark attendance for students and staff, so that I can record attendance when the machine is unavailable or for manual verification.

#### Acceptance Criteria

1. WHEN an admin or teacher accesses the attendance interface, THE Attendance_System SHALL display a list of students or staff members for the selected class or department
2. WHEN an admin or teacher selects a status (Present, Absent, or Late) for a person, THE Attendance_System SHALL allow the selection to be changed before saving
3. WHEN an admin or teacher clicks the save button, THE Attendance_System SHALL store all attendance records with source_type set to "manual"
4. WHEN manual attendance is saved, THE Attendance_System SHALL record the timestamp and the user who performed the entry
5. THE Attendance_System SHALL prevent duplicate manual entries for the same person on the same date

### Requirement 2: Machine Attendance Synchronization

**User Story:** As an admin, I want the system to automatically pull attendance logs from the AI06 Face Recognition Machine, so that attendance is recorded without manual intervention.

#### Acceptance Criteria

1. WHEN an admin initiates a sync operation, THE Attendance_System SHALL connect to the AI06_Machine via TCP/IP using the configured IP address and port 4370
2. WHEN the connection is established, THE Attendance_System SHALL retrieve all new check-in logs from the AI06_Machine
3. WHEN processing machine logs, THE Attendance_System SHALL match the machine User_ID with the corresponding Student or Staff database ID
4. WHEN a match is found, THE Attendance_System SHALL create an Attendance_Record with source_type set to "machine"
5. WHEN a machine User_ID cannot be matched to a database record, THE Attendance_System SHALL log the unmatched entry and continue processing remaining logs
6. THE Attendance_System SHALL record the machine IP address with each machine-sourced attendance record

### Requirement 3: User ID Mapping

**User Story:** As an admin, I want to ensure that User IDs on the machine correspond to the correct students and staff in the database, so that attendance is attributed to the right people.

#### Acceptance Criteria

1. THE Attendance_System SHALL maintain a mapping between database Student IDs and machine User IDs
2. THE Attendance_System SHALL maintain a mapping between database Staff IDs and machine User IDs
3. WHEN creating or updating a student or staff record, THE Attendance_System SHALL allow specification of the corresponding machine User_ID
4. WHEN a machine User_ID is assigned, THE Attendance_System SHALL validate that the User_ID is unique across all students and staff
5. THE Attendance_System SHALL provide a report of unmapped User IDs found during synchronization

### Requirement 4: Attendance Source Tracking

**User Story:** As an admin or teacher, I want to see how each attendance record was captured, so that I can verify the reliability and source of attendance data.

#### Acceptance Criteria

1. WHEN displaying attendance records, THE Attendance_System SHALL show a visual indicator distinguishing manual entries from machine entries
2. WHEN an attendance record is from manual entry, THE Attendance_System SHALL display the name of the user who entered it
3. WHEN an attendance record is from machine synchronization, THE Attendance_System SHALL display the machine IP address and sync timestamp
4. THE Attendance_System SHALL allow filtering attendance records by source_type (manual or machine)

### Requirement 5: Conflict Resolution

**User Story:** As an admin, I want the system to handle cases where the same person has both manual and machine attendance records for the same day, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN a manual attendance record exists for a person on a specific date, THE Attendance_System SHALL allow a machine-sourced record to be created for the same date
2. WHEN both manual and machine records exist for the same person and date, THE Attendance_System SHALL flag the record as having a conflict
3. WHEN displaying conflicting records, THE Attendance_System SHALL show both entries with their respective sources and timestamps
4. WHEN an admin reviews a conflict, THE Attendance_System SHALL allow the admin to mark one record as authoritative
5. THE Attendance_System SHALL maintain both records in the database even after conflict resolution

### Requirement 6: Machine Connection Management

**User Story:** As an admin, I want to configure and test the connection to AI06 Face Recognition Machines, so that I can ensure the system can communicate with the devices.

#### Acceptance Criteria

1. THE Attendance_System SHALL allow admins to configure the IP address and port for each AI06_Machine
2. WHEN an admin initiates a connection test, THE Attendance_System SHALL attempt to connect to the AI06_Machine and report success or failure
3. WHEN a connection fails, THE Attendance_System SHALL provide a descriptive error message indicating the failure reason
4. THE Attendance_System SHALL support configuration of multiple AI06_Machine devices with unique identifiers
5. WHEN multiple machines are configured, THE Attendance_System SHALL allow selection of which machine to sync from

### Requirement 7: Sync Operation Control

**User Story:** As an admin, I want to manually trigger synchronization with the AI06 Machine, so that I can pull the latest attendance logs on demand.

#### Acceptance Criteria

1. THE Attendance_System SHALL provide a "Sync Now" button in the attendance interface
2. WHEN an admin clicks "Sync Now", THE Attendance_System SHALL initiate a sync operation with the configured AI06_Machine
3. WHEN a sync operation is in progress, THE Attendance_System SHALL display a progress indicator
4. WHEN a sync operation completes, THE Attendance_System SHALL display the number of new records synchronized
5. WHEN a sync operation fails, THE Attendance_System SHALL display an error message and allow retry

### Requirement 8: Attendance Status Types

**User Story:** As a teacher or admin, I want to record different attendance statuses (Present, Absent, Late), so that I can accurately reflect each person's attendance situation.

#### Acceptance Criteria

1. THE Attendance_System SHALL support three status types: Present, Absent, and Late
2. WHEN marking manual attendance, THE Attendance_System SHALL allow selection of any of the three status types
3. WHEN processing machine logs, THE Attendance_System SHALL mark all machine-sourced records as Present
4. WHEN displaying attendance records, THE Attendance_System SHALL clearly indicate the status type with visual differentiation
5. THE Attendance_System SHALL allow admins to change the status of machine-sourced records from Present to Late if needed

### Requirement 9: Frontend Display and Interaction

**User Story:** As a teacher or admin, I want an intuitive interface for viewing and managing attendance, so that I can efficiently perform attendance-related tasks.

#### Acceptance Criteria

1. THE Attendance_System SHALL provide a toggle or tab interface to switch between manual entry mode and machine sync mode
2. WHEN in manual entry mode, THE Attendance_System SHALL display checkboxes or radio buttons for each person with status options
3. WHEN in machine sync mode, THE Attendance_System SHALL display the sync controls and a list of recently synchronized records
4. THE Attendance_System SHALL use distinct icons to represent manual entries (user icon) and machine entries (robot icon)
5. WHEN displaying attendance lists, THE Attendance_System SHALL support filtering by date, class, department, and source type

### Requirement 10: Data Persistence and Integrity

**User Story:** As a system administrator, I want attendance data to be reliably stored and protected from data loss, so that historical records are preserved.

#### Acceptance Criteria

1. THE Attendance_System SHALL store all attendance records in the PostgreSQL database with appropriate indexes
2. WHEN storing an attendance record, THE Attendance_System SHALL include person_id, date, status_type, source_type, timestamp, and source_user_or_machine
3. THE Attendance_System SHALL enforce database constraints to prevent invalid data entry
4. WHEN a database error occurs during save, THE Attendance_System SHALL rollback the transaction and report the error
5. THE Attendance_System SHALL maintain referential integrity between attendance records and student/staff records

### Requirement 11: Machine Communication Protocol

**User Story:** As a system administrator, I want the system to correctly communicate with ZKTeco devices using the appropriate protocol, so that attendance logs can be reliably retrieved.

#### Acceptance Criteria

1. THE Attendance_System SHALL use the node-zklib library to communicate with AI06_Machine devices
2. WHEN establishing a connection, THE Attendance_System SHALL use TCP/IP protocol on the configured port (default 4370)
3. WHEN retrieving attendance logs, THE Attendance_System SHALL request all logs since the last successful sync timestamp
4. WHEN the connection is interrupted, THE Attendance_System SHALL attempt to reconnect up to three times before reporting failure
5. THE Attendance_System SHALL close the connection properly after each sync operation completes

### Requirement 12: Audit Trail and Logging

**User Story:** As an admin, I want to see a history of sync operations and manual entries, so that I can audit attendance data and troubleshoot issues.

#### Acceptance Criteria

1. THE Attendance_System SHALL log each sync operation with timestamp, machine IP, number of records retrieved, and success/failure status
2. THE Attendance_System SHALL log each manual attendance entry with timestamp, user who performed the entry, and number of records saved
3. WHEN an error occurs during sync or manual entry, THE Attendance_System SHALL log the error details
4. THE Attendance_System SHALL provide an audit log view accessible to admins
5. THE Attendance_System SHALL retain audit logs for at least 90 days

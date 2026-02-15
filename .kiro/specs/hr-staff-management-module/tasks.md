# Implementation Plan: HR & Staff Management Module

## Overview

This implementation plan breaks down the HR & Staff Management Module into discrete, incremental tasks. The module is built using React frontend, Node.js/Express backend, Prisma ORM, and PostgreSQL database. Each task builds on previous work, with property-based tests integrated throughout to validate correctness early. The implementation follows a layered approach: database schema → backend services → API endpoints → frontend components.

## Tasks

- [ ] 1. Database Schema and Core Infrastructure Setup
  - [ ] 1.1 Design and implement Prisma schema for all core entities
    - Create schema for Campus, Role, Permission, OrganizationUnit, StaffMember, StaffRole
    - Create schema for JobPosting, Candidate, ATSStage, Interview, Contract
    - Create schema for FormDefinition, FormField, FormSubmission, Document
    - Create schema for AttendanceRecord, WorkShift, AttendanceRule, BiometricDevice
    - Create schema for LeaveType, LeavePolicy, LeaveBalance, LeaveRequest
    - Create schema for SalaryStructure, PayrollRun, Payslip, PayrollRule
    - Create schema for KPI, AppraisalCycle, Evaluation, AppraisalResult
    - Create schema for DisciplinaryIncident, DisciplinaryAction, PolicyDocument
    - Create schema for TrainingCourse, TrainingRequest, TrainingRecord
    - Create schema for Resignation, ClearanceChecklist, ExitInterview, FinalSettlement
    - Create schema for WorkflowDefinition, WorkflowInstance, NotificationTemplate, AuditLog
    - Include proper relationships, indexes, and constraints
    - Run Prisma migrations to create database tables
    - _Requirements: 1.1-1.10, 2.1-2.12, 3.1-3.11, 4.1-4.11, 5.1-5.13, 6.1-6.11, 7.1-7.12, 8.1-8.11, 9.1-9.10, 10.1-10.10, 11.1-11.11, 12.1-12.11, 13.1-13.11, 14.1-14.12, 15.1-15.10, 16.1-16.8_
  
  - [ ] 1.2 Set up authentication and authorization middleware
    - Implement JWT token generation and validation
    - Create role-based access control (RBAC) middleware
    - Implement permission checking logic
    - Set up session management with Redis
    - _Requirements: 13.1, 13.2, 13.3, 13.10_
  
  - [ ] 1.3 Implement audit logging service
    - Create AuditService for logging all CRUD operations
    - Implement cryptographic hashing for audit log integrity
    - Create middleware to automatically log API requests
    - _Requirements: 1.10, 4.10, 5.12, 9.9, 11.11, 13.4, 13.5, 13.6_
  
  - [ ]* 1.4 Write property test for audit logging
    - **Property 5: Comprehensive Audit Logging**
    - **Validates: Requirements 1.10, 4.10, 5.12, 9.9, 11.11, 13.4, 13.5**

- [ ] 2. Role & Organization Management Module
  - [ ] 2.1 Implement RoleService and OrganizationService
    - Create CRUD operations for roles with permission assignment
    - Create CRUD operations for organization units with hierarchy
    - Implement role hierarchy validation (senior/junior)
    - Implement organization unit parent-child validation
    - Implement cascade update logic for role/org changes
    - Implement deletion prevention for assigned roles/units
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 1.8, 1.9_
  
  - [ ]* 2.2 Write property tests for role and organization management
    - **Property 1: Role Creation and Assignment**
    - **Property 2: Organizational Hierarchy Integrity**
    - **Property 3: Cascading Updates**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.5, 1.8, 1.9**
  
  - [ ] 2.3 Implement StaffRole assignment service
    - Create service for assigning multiple roles to staff
    - Implement effective date range validation
    - Create API endpoints for role assignment
    - _Requirements: 1.3_
  
  - [ ] 2.4 Create React components for role and organization management
    - Build role creation and editing forms
    - Build organization unit tree view with drag-and-drop
    - Build permission assignment interface
    - Build staff role assignment interface
    - _Requirements: 1.1-1.6_

- [ ] 3. Multi-Campus Support and Data Isolation
  - [ ] 3.1 Implement Campus management service
    - Create CRUD operations for Campus entities
    - Implement campus-specific configuration storage
    - _Requirements: 1.7, 15.1_
  
  - [ ] 3.2 Implement data isolation middleware
    - Create middleware to filter queries by campusId
    - Implement cross-campus access prevention
    - Implement shared resource handling (CV_Pool)
    - _Requirements: 15.8, 15.9_
  
  - [ ]* 3.3 Write property test for multi-campus isolation
    - **Property 4: Multi-Campus Data Isolation**
    - **Validates: Requirements 1.7, 15.8, 15.9**
  
  - [ ] 3.4 Create React components for campus management
    - Build campus selection interface
    - Build campus configuration forms
    - Build cross-campus reporting views
    - _Requirements: 15.1, 15.6, 15.10_

- [ ] 4. Checkpoint - Core Infrastructure Complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Recruitment & CV Management Module
  - [ ] 5.1 Implement RecruitmentService
    - Create CRUD operations for job postings
    - Implement CV submission and storage
    - Implement CV search and filtering by skills, experience, education
    - Create CV categorization logic
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 5.2 Write property test for CV storage and search
    - **Property 6: CV Storage and Categorization**
    - **Validates: Requirements 2.3, 2.4**
  
  - [ ] 5.3 Implement ATS (Application Tracking System)
    - Create customizable recruitment stages
    - Implement drag-and-drop stage ordering
    - Create candidate stage transition logic with history tracking
    - _Requirements: 2.5, 2.6_
  
  - [ ]* 5.4 Write property test for ATS stage tracking
    - **Property 7: ATS Stage Transition Tracking**
    - **Validates: Requirements 2.6**
  
  - [ ] 5.5 Implement InterviewService
    - Create interview scheduling functionality
    - Implement interview score and feedback recording
    - Create interview notification logic
    - _Requirements: 2.7, 2.8_
  
  - [ ] 5.6 Implement ContractService
    - Create contract template management
    - Implement contract generation from templates
    - Implement contract versioning
    - Create digital approval workflow integration
    - _Requirements: 2.9, 2.10, 2.11_
  
  - [ ]* 5.7 Write property test for contract versioning
    - **Property 8: Contract Versioning**
    - **Validates: Requirements 2.11**
  
  - [ ] 5.8 Create React components for recruitment
    - Build job posting creation and management interface
    - Build public CV submission portal
    - Build CV search and filtering interface
    - Build ATS kanban board with drag-and-drop
    - Build interview scheduling calendar
    - Build contract generation and approval interface
    - _Requirements: 2.1-2.11_

- [ ] 6. Dynamic Form Builder and Onboarding Module
  - [ ] 6.1 Implement FormBuilderService
    - Create form definition CRUD operations
    - Implement support for all field types (text, number, dropdown, file, date, checkbox, radio)
    - Implement conditional field logic evaluation
    - Implement validation rule engine
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 6.2 Write property tests for form builder
    - **Property 9: Form Field Type Support**
    - **Property 10: Conditional Field Logic**
    - **Property 11: Mandatory Field Validation**
    - **Validates: Requirements 3.2, 3.4, 3.10**

  
  - [ ] 6.3 Implement OnboardingService
    - Create form assignment to roles/organization units
    - Implement form submission handling
    - Implement form version history tracking
    - _Requirements: 3.5, 3.6, 3.11_
  
  - [ ] 6.4 Implement DocumentService
    - Create document upload and storage
    - Implement document metadata tracking (type, expiry date)
    - Create document expiry tracking and reporting
    - _Requirements: 3.7, 3.8_
  
  - [ ]* 6.5 Write property test for document expiry tracking
    - **Property 12: Document Expiry Tracking**
    - **Validates: Requirements 3.8**
  
  - [ ] 6.6 Create React components for form builder
    - Build drag-and-drop form builder interface
    - Build field configuration panels for all field types
    - Build conditional logic builder
    - Build form preview mode
    - Build form assignment interface
    - _Requirements: 3.1-3.5_
  
  - [ ] 6.7 Create React components for form submission
    - Build dynamic form renderer based on form definition
    - Build file upload component with progress tracking
    - Build form validation and error display
    - Build document management interface
    - _Requirements: 3.6, 3.7, 3.10_

- [ ] 7. Staff Master Record Module
  - [ ] 7.1 Implement StaffService
    - Create CRUD operations for staff master records
    - Implement staff search and filtering
    - Implement role-based access control for staff data
    - _Requirements: 4.1, 4.11_
  
  - [ ] 7.2 Implement StaffHistoryService
    - Create employment history tracking
    - Create education and certification tracking
    - Implement position change recording
    - _Requirements: 4.2, 4.3_
  
  - [ ]* 7.3 Write property test for role-based access control
    - **Property 13: Role-Based Access Control**
    - **Validates: Requirements 4.11, 9.10, 13.1**
  
  - [ ] 7.4 Create React components for staff management
    - Build staff profile 360-degree view
    - Build staff creation and editing forms
    - Build employment history timeline
    - Build education and certification management
    - Build staff search and filtering interface
    - _Requirements: 4.1-4.9_

- [ ] 8. Checkpoint - Core Modules Complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Attendance Management Module
  - [ ] 9.1 Implement AttendanceService
    - Create attendance record CRUD operations
    - Implement attendance from multiple sources (biometric, RFID, QR, mobile)
    - Implement duplicate prevention logic
    - Implement manual attendance correction with approval workflow
    - _Requirements: 5.1, 5.2, 5.9, 5.11, 5.13_
  
  - [ ]* 9.2 Write property test for attendance duplicate prevention
    - **Property 14: Attendance Duplicate Prevention**
    - **Validates: Requirements 5.13**
  
  - [ ] 9.3 Implement BiometricAdapter
    - Create device registration and management
    - Implement device communication protocols (SOAP/REST/SDK)
    - Implement offline queue and synchronization logic
    - _Requirements: 5.1, 5.3_
  
  - [ ]* 9.4 Write property test for offline synchronization
    - **Property 17: Offline Attendance Synchronization**
    - **Validates: Requirements 5.3**
  
  - [ ] 9.5 Implement AttendanceRuleEngine
    - Create work shift configuration
    - Implement late/early departure rule evaluation
    - Implement grace period logic
    - Implement overtime calculation
    - Implement weekend and holiday rules
    - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.8_
  
  - [ ] 9.6 Implement AttendanceSummaryService
    - Create daily attendance summary generation
    - Create monthly attendance summary generation
    - Implement work hours and overtime aggregation
    - _Requirements: 5.10_
  
  - [ ]* 9.7 Write property test for attendance summary calculation
    - **Property 15: Attendance Summary Calculation**
    - **Validates: Requirements 5.10**
  
  - [ ] 9.8 Implement mobile attendance with geo-fencing
    - Create GPS coordinate validation
    - Implement geo-fence boundary checking
    - _Requirements: 5.2_
  
  - [ ]* 9.9 Write property test for geo-fencing validation
    - **Property 16: Geo-Fencing Validation**
    - **Validates: Requirements 5.2**
  
  - [ ] 9.10 Create React components for attendance management
    - Build attendance dashboard with real-time logs
    - Build work shift configuration interface
    - Build attendance rule configuration interface
    - Build manual attendance correction interface
    - Build attendance summary reports
    - Build biometric device management interface
    - _Requirements: 5.4-5.11_

- [ ] 10. Leave Management Module
  - [ ] 10.1 Implement LeaveService
    - Create leave type and policy CRUD operations
    - Implement leave request submission and validation
    - Implement leave approval workflow routing
    - Implement leave balance adjustment with approval
    - _Requirements: 6.1, 6.2, 6.5, 6.6, 6.9_
  
  - [ ] 10.2 Implement LeaveBalanceCalculator
    - Create automatic leave balance calculation based on accrual rules
    - Implement carry-forward logic
    - Implement employment duration-based accrual
    - _Requirements: 6.4_
  
  - [ ]* 10.3 Write property tests for leave management
    - **Property 18: Leave Balance Calculation**
    - **Property 19: Leave Request Validation**
    - **Property 20: Leave Balance Deduction**
    - **Property 21: Leave Conflict Detection**
    - **Validates: Requirements 6.4, 6.5, 6.7, 6.11**
  
  - [ ] 10.4 Create React components for leave management
    - Build leave type and policy configuration interface
    - Build leave request submission form
    - Build leave approval workflow interface
    - Build leave balance dashboard
    - Build leave calendar view
    - _Requirements: 6.1-6.10_

- [ ] 11. Payroll Integration Module
  - [ ] 11.1 Implement SalaryStructureService
    - Create salary structure builder
    - Implement salary component configuration (allowances, deductions, bonuses)
    - Implement role-specific and individual salary structures
    - _Requirements: 7.1, 7.2_
  
  - [ ] 11.2 Implement SalaryCalculator
    - Create payable days calculation from attendance
    - Implement overtime pay calculation
    - Implement absence penalty calculation
    - Implement late penalty calculation
    - Implement unpaid leave deduction
    - Calculate gross and net salary
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [ ]* 11.3 Write property test for payroll calculation
    - **Property 22: Payroll Calculation Accuracy**
    - **Validates: Requirements 7.3, 7.4, 7.5, 7.6, 7.7**
  
  - [ ] 11.4 Implement PayrollService
    - Create monthly payroll run processing
    - Implement payroll approval workflow
    - Implement payslip generation
    - Implement payroll report generation
    - Implement payroll history and versioning
    - _Requirements: 7.8, 7.9, 7.10, 7.12_
  
  - [ ]* 11.5 Write property test for payslip generation
    - **Property 23: Payslip Generation**
    - **Validates: Requirements 7.9**
  
  - [ ] 11.6 Implement Finance module integration
    - Create API client for Finance module
    - Implement payroll expense posting
    - Handle integration errors and retries
    - _Requirements: 7.11_
  
  - [ ]* 11.7 Write property test for payroll-finance integration
    - **Property 24: Payroll-Finance Integration**
    - **Validates: Requirements 7.11**
  
  - [ ] 11.8 Create React components for payroll
    - Build salary structure builder interface
    - Build payroll processing dashboard
    - Build payroll approval interface
    - Build payslip viewer and download
    - Build payroll reports
    - _Requirements: 7.1-7.10_

- [ ] 12. Checkpoint - Attendance, Leave, and Payroll Complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Performance & Appraisal Module
  - [ ] 13.1 Implement KPIService
    - Create KPI CRUD operations
    - Implement KPI assignment to roles with weightage
    - Support academic and non-academic KPI categories
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 13.2 Implement AppraisalService
    - Create appraisal cycle management
    - Implement self-evaluation submission
    - Implement supervisor evaluation submission
    - Implement optional peer review
    - _Requirements: 8.4, 8.5, 8.6, 8.7_
  
  - [ ] 13.3 Implement EvaluationEngine
    - Create score aggregation with weighted average
    - Generate performance reports
    - Implement probation review logic
    - Maintain performance history
    - _Requirements: 8.8, 8.9, 8.10, 8.11_
  
  - [ ]* 13.4 Write property test for appraisal score aggregation
    - **Property 25: Appraisal Score Aggregation**
    - **Validates: Requirements 8.8**
  
  - [ ] 13.5 Create React components for performance management
    - Build KPI configuration interface
    - Build appraisal cycle management inter
# Implementation Plan: Property/Asset Management Module

## Overview

This implementation plan breaks down the Property/Asset Management Module into discrete, incremental coding tasks. The module will be built using React (TypeScript) for the frontend and Node.js with Prisma ORM for the backend. Each task builds on previous tasks, with checkpoints to ensure quality and integration.

## Tasks

- [ ] 1. Set up database schema and core models
  - Create Prisma schema for all asset management models (Asset, Assignment, Maintenance, Audit, Disposal, etc.)
  - Define enums for AssetCategory, AssetStatus, DepreciationMethod, AssigneeType, Priority, RequestStatus, AuditStatus, ApprovalStatus
  - Set up database indexes for performance
  - Run Prisma migrations to create database tables
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 4.1, 5.1, 5.6, 6.1_

- [ ]* 1.1 Write property test for database schema
  - **Property 1: Complete Data Capture**
  - **Validates: Requirements 1.1, 1.4, 1.5, 1.7, 2.2, 2.6, 4.1, 4.3, 4.4, 5.1, 5.2, 6.1**

- [ ] 2. Implement Asset Service and registration
  - [ ] 2.1 Create AssetService class with registerAsset method
    - Implement asset registration with all required fields
    - Generate unique asset identifier
    - Validate required fields and asset category
    - Store audit fields (createdAt, createdBy)
    - _Requirements: 1.1, 1.2, 1.7_
  
  - [ ]* 2.2 Write property test for asset registration
    - **Property 1: Complete Data Capture**
    - **Property 4: Duplicate Identifier Prevention**
    - **Property 5: Category and Status Support**
    - **Validates: Requirements 1.1, 1.2, 1.6, 1.7**
  
  - [ ] 2.3 Implement supplier and warranty information storage
    - Add supplier linking functionality
    - Store warranty details (start date, end date, terms)
    - _Requirements: 1.4, 1.5_
  
  - [ ]* 2.4 Write unit tests for supplier and warranty storage
    - Test warranty data storage
    - Test supplier linking
    - _Requirements: 1.4, 1.5_

- [ ] 3. Implement Asset Tag Service
  - [ ] 3.1 Create AssetTagService class
    - Implement generateAssetTag method
    - Implement generateQRCode method using qrcode library
    - Implement generateBarcode method using jsbarcode library
    - Ensure tag uniqueness across system
    - _Requirements: 1.3, 10.1, 10.2_
  
  - [ ]* 3.2 Write property test for asset tag generation
    - **Property 2: Asset Tag Uniqueness**
    - **Property 3: Asset Tag Round-Trip**
    - **Property 36: Asset Tag Format Generation**
    - **Validates: Requirements 1.3, 10.1, 10.2, 10.3, 10.4**
  
  - [ ] 3.3 Implement tag scanning and label printing
    - Implement scanAssetTag method to decode tags
    - Implement printAssetLabel method
    - Implement bulkPrintLabels method
    - Include QR code, barcode, asset name, and category in labels
    - _Requirements: 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 3.4 Write property test for tag scanning and printing
    - **Property 37: Asset Label Content**
    - **Property 38: Bulk Label Printing**
    - **Property 39: Invalid Tag Error Handling**
    - **Validates: Requirements 10.5, 10.6, 10.7**

- [ ] 4. Checkpoint - Ensure asset registration and tagging work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Asset Assignment Service
  - [ ] 5.1 Add assignment methods to AssetService
    - Implement assignAsset method
    - Support all assignee types (Staff, Classroom, Lab, Office)
    - Record assignment date, reason, and creator
    - Prevent assignment of already-assigned assets
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [ ]* 5.2 Write property test for asset assignment
    - **Property 6: Assignment Type Support**
    - **Property 8: Assignment State Integrity**
    - **Validates: Requirements 2.1, 2.2, 2.4**
  
  - [ ] 5.3 Implement asset transfer and unassignment
    - Implement transferAsset method
    - Implement unassignAsset method
    - Preserve complete assignment history
    - Record unassignment date and reason
    - _Requirements: 2.3, 2.5, 2.6_
  
  - [ ]* 5.4 Write property test for assignment history
    - **Property 7: Assignment History Preservation**
    - **Validates: Requirements 2.3, 2.5, 2.6**

- [ ] 6. Implement Depreciation Service
  - [ ] 6.1 Create DepreciationService class
    - Implement configureDepreciation method
    - Support Straight_Line and Declining_Balance methods
    - Store depreciation configuration (method, useful life, salvage value, rate)
    - _Requirements: 3.1, 3.2_
  
  - [ ]* 6.2 Write property test for depreciation configuration
    - **Property 9: Depreciation Method Support**
    - **Validates: Requirements 3.1, 3.2**
  
  - [ ] 6.3 Implement straight-line depreciation calculation
    - Implement calculateDepreciation for Straight_Line method
    - Formula: (Purchase Cost - Salvage Value) / Useful Life
    - Calculate accumulated depreciation and book value
    - Prevent depreciation below salvage value
    - _Requirements: 3.3, 3.5, 3.6_
  
  - [ ]* 6.4 Write property test for straight-line depreciation
    - **Property 10: Straight-Line Depreciation Calculation**
    - **Property 12: Book Value Calculation**
    - **Property 13: Depreciation Floor**
    - **Validates: Requirements 3.3, 3.5, 3.6**
  
  - [ ] 6.5 Implement declining balance depreciation calculation
    - Implement calculateDepreciation for Declining_Balance method
    - Formula: Book Value × Depreciation Rate
    - Calculate accumulated depreciation and book value
    - Prevent depreciation below salvage value
    - _Requirements: 3.4, 3.5, 3.6_
  
  - [ ]* 6.6 Write property test for declining balance depreciation
    - **Property 11: Declining Balance Depreciation Calculation**
    - **Property 12: Book Value Calculation**
    - **Property 13: Depreciation Floor**
    - **Validates: Requirements 3.4, 3.5, 3.6**
  
  - [ ] 6.7 Implement bulk depreciation calculation
    - Implement calculateBulkDepreciation method
    - Implement getDepreciationSchedule method
    - _Requirements: 3.3, 3.4, 3.5_

- [ ] 7. Checkpoint - Ensure depreciation calculations work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement Maintenance Service
  - [ ] 8.1 Create MaintenanceService class
    - Implement createMaintenanceSchedule method
    - Capture maintenance type, frequency, next due date, vendor
    - _Requirements: 4.1_
  
  - [ ] 8.2 Implement maintenance logging and repair requests
    - Implement logMaintenance method
    - Implement createRepairRequest method
    - Record all required fields (date, cost, vendor, work performed, status)
    - Link maintenance records to assets
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [ ]* 8.3 Write property test for maintenance data capture
    - **Property 1: Complete Data Capture**
    - **Property 40: Maintenance History Linkage**
    - **Validates: Requirements 4.1, 4.3, 4.4, 4.5**
  
  - [ ] 8.4 Implement maintenance task notifications and cost calculation
    - Implement getDueMaintenanceTasks method
    - Implement calculateMaintenanceCost method (sum of all costs)
    - Update next due date when maintenance is completed
    - _Requirements: 4.2, 4.6, 4.7_
  
  - [ ]* 8.5 Write property test for maintenance calculations
    - **Property 14: Maintenance Cost Aggregation**
    - **Property 15: Maintenance Schedule Update**
    - **Property 16: Maintenance Task Notification**
    - **Validates: Requirements 4.2, 4.6, 4.7**

- [ ] 9. Implement Audit Service
  - [ ] 9.1 Create AuditService class
    - Implement initiateAuditCycle method
    - Capture cycle name, dates, assigned auditors
    - _Requirements: 5.1_
  
  - [ ] 9.2 Implement asset verification
    - Implement verifyAsset method
    - Record verification date, physical condition, location verification, notes
    - _Requirements: 5.2_
  
  - [ ] 9.3 Implement asset status updates
    - Implement markAssetMissing method
    - Implement markAssetDamaged method
    - Update asset status and record discovery/damage information
    - _Requirements: 5.3, 5.4_
  
  - [ ]* 9.4 Write property test for audit operations
    - **Property 17: Asset Status Updates**
    - **Validates: Requirements 5.3, 5.4**
  
  - [ ] 9.5 Implement audit completion and reporting
    - Implement completeAuditCycle method
    - Generate audit report with verified, missing, damaged assets, and discrepancies
    - Implement uploadComplianceDocument method
    - Associate documents with assets and audit cycles
    - _Requirements: 5.5, 5.7_
  
  - [ ]* 9.6 Write property test for audit reporting
    - **Property 18: Audit Report Completeness**
    - **Property 19: Document Association**
    - **Validates: Requirements 5.5, 5.7**

- [ ] 10. Checkpoint - Ensure maintenance and audit functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement Disposal Service
  - [ ] 11.1 Add disposal methods to AssetService
    - Implement disposeAsset method
    - Capture disposal reason, date, method, value
    - Require approval from Finance_Officer or School_Administrator
    - Prevent disposal of assigned assets
    - _Requirements: 6.1, 6.2, 6.6_
  
  - [ ]* 11.2 Write property test for disposal workflow
    - **Property 20: Disposal Approval Requirement**
    - **Property 23: Assigned Asset Disposal Prevention**
    - **Validates: Requirements 6.2, 6.6**
  
  - [ ] 11.3 Implement disposal approval and finalization
    - Update asset status to Disposed on approval
    - Record approval date and approver
    - Calculate disposal gain/loss (disposal value - book value)
    - _Requirements: 6.3, 6.4_
  
  - [ ]* 11.4 Write property test for disposal calculations
    - **Property 21: Disposal Status Update**
    - **Property 22: Disposal Gain/Loss Calculation**
    - **Validates: Requirements 6.3, 6.4**

- [ ] 12. Implement Finance Integration Service
  - [ ] 12.1 Create FinanceIntegrationService class
    - Implement postAssetCapitalization method
    - Implement postDepreciation method
    - Implement postDisposal method
    - Implement postMaintenanceCost method
    - Post entries to Finance_Module with appropriate accounts
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 3.7, 6.5_
  
  - [ ]* 12.2 Write property test for finance integration
    - **Property 32: Finance Integration Posting**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 3.7, 6.5**
  
  - [ ] 12.3 Implement finance validation and error handling
    - Implement validateFinanceAccounts method
    - Log errors and notify Finance_Officer on posting failures
    - Store Finance_Module transaction references
    - _Requirements: 9.5, 9.6, 9.7_
  
  - [ ]* 12.4 Write property test for finance validation
    - **Property 33: Finance Account Validation**
    - **Property 34: Finance Posting Error Handling**
    - **Property 35: Finance Transaction Reference Storage**
    - **Validates: Requirements 9.5, 9.6, 9.7**

- [ ] 13. Implement Role-Based Access Control
  - [ ] 13.1 Create authorization middleware
    - Verify user has authorized role (Asset_Controller, Finance_Officer, School_Administrator)
    - Prevent unauthorized access
    - _Requirements: 7.1, 7.5_
  
  - [ ] 13.2 Implement role-specific permissions
    - Asset_Controller: asset registration, assignment, maintenance, audit
    - Finance_Officer: depreciation config, disposal approval, financial reports
    - School_Administrator: all functions
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [ ]* 13.3 Write property test for authorization
    - **Property 24: Role-Based Authorization**
    - **Property 25: Role Permission Enforcement**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  
  - [ ] 13.4 Implement audit trail logging
    - Log all operations with user identity, timestamp, operation type, affected assets
    - _Requirements: 7.6_
  
  - [ ]* 13.5 Write property test for audit trail
    - **Property 26: Audit Trail Logging**
    - **Validates: Requirements 7.6**

- [ ] 14. Checkpoint - Ensure disposal, finance integration, and security work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement Search and Query functionality
  - [ ] 15.1 Add searchAssets method to AssetService
    - Support search by asset tag, category, location, assignee, status, purchase date range
    - Return results with asset tag, category, location, assignee, status, book value
    - _Requirements: 8.1, 8.2_
  
  - [ ]* 15.2 Write property test for search functionality
    - **Property 27: Search Criteria Support**
    - **Property 28: Search Result Completeness**
    - **Validates: Requirements 8.1, 8.2**
  
  - [ ] 15.3 Implement getAssetDetails method
    - Return complete asset information
    - Include registration details, assignment history, depreciation schedule, maintenance records, audit history
    - _Requirements: 8.7_

- [ ] 16. Implement Report Service
  - [ ] 16.1 Create ReportService class
    - Implement generateAssetRegister method
    - Implement generateDepreciationSchedule method
    - Implement generateMaintenanceReport method
    - Implement generateDisposalRegister method
    - _Requirements: 8.3, 6.7_
  
  - [ ]* 16.2 Write property test for report generation
    - **Property 29: Report Type Support**
    - **Property 41: Disposal Report Content**
    - **Validates: Requirements 8.3, 6.7**
  
  - [ ] 16.3 Implement report content and export
    - Ensure depreciation reports show asset details, cost, accumulated depreciation, book value
    - Ensure maintenance reports show asset details, history, total cost, upcoming maintenance
    - Implement exportToPDF method
    - Implement exportToExcel method
    - _Requirements: 8.4, 8.5, 8.6_
  
  - [ ]* 16.4 Write property test for report content and export
    - **Property 30: Report Content Completeness**
    - **Property 31: Report Export Support**
    - **Validates: Requirements 8.4, 8.5, 8.6, 8.7**

- [ ] 17. Implement Backend API Routes
  - [ ] 17.1 Create asset management API endpoints
    - POST /api/assets - Register asset
    - GET /api/assets - Search assets
    - GET /api/assets/:id - Get asset details
    - POST /api/assets/:id/assign - Assign asset
    - POST /api/assets/:id/transfer - Transfer asset
    - POST /api/assets/:id/unassign - Unassign asset
    - POST /api/assets/:id/dispose - Dispose asset
    - _Requirements: 1.1, 2.1, 2.3, 2.6, 6.1, 8.1, 8.7_
  
  - [ ] 17.2 Create depreciation API endpoints
    - POST /api/assets/:id/depreciation/configure - Configure depreciation
    - GET /api/assets/:id/depreciation - Get depreciation schedule
    - POST /api/depreciation/calculate - Calculate bulk depreciation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 17.3 Create maintenance API endpoints
    - POST /api/assets/:id/maintenance/schedule - Create maintenance schedule
    - POST /api/assets/:id/maintenance - Log maintenance
    - POST /api/assets/:id/repairs - Create repair request
    - GET /api/maintenance/due - Get due maintenance tasks
    - GET /api/assets/:id/maintenance/history - Get maintenance history
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 17.4 Create audit API endpoints
    - POST /api/audits - Initiate audit cycle
    - POST /api/audits/:cycleId/verify/:assetId - Verify asset
    - POST /api/assets/:id/mark-missing - Mark asset missing
    - POST /api/assets/:id/mark-damaged - Mark asset damaged
    - POST /api/audits/:cycleId/complete - Complete audit cycle
    - POST /api/assets/:id/documents - Upload compliance document
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7_
  
  - [ ] 17.5 Create report API endpoints
    - GET /api/reports/asset-register - Generate asset register
    - GET /api/reports/depreciation - Generate depreciation schedule
    - GET /api/reports/maintenance - Generate maintenance report
    - GET /api/reports/disposal - Generate disposal register
    - GET /api/reports/:id/export/pdf - Export report to PDF
    - GET /api/reports/:id/export/excel - Export report to Excel
    - _Requirements: 8.3, 8.4, 8.5, 8.6, 6.7_
  
  - [ ] 17.6 Create asset tag API endpoints
    - GET /api/assets/:id/tag/qr - Generate QR code
    - GET /api/assets/:id/tag/barcode - Generate barcode
    - POST /api/assets/scan - Scan asset tag
    - GET /api/assets/:id/label - Print asset label
    - POST /api/assets/labels/bulk - Bulk print labels
    - _Requirements: 10.1, 10.3, 10.4, 10.5, 10.6_

- [ ]* 17.7 Write integration tests for API endpoints
  - Test all API endpoints with valid and invalid inputs
  - Test authorization for each endpoint
  - Test error responses
  - _Requirements: All_

- [ ] 18. Checkpoint - Ensure all backend APIs work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement Frontend Components - Asset Registration
  - [ ] 19.1 Create AssetRegistrationForm component
    - Form fields for all asset details (name, category, purchase date, cost, warranty, supplier)
    - Category dropdown with all supported categories
    - Supplier lookup/selection
    - Form validation
    - Call registerAsset API on submit
    - Display generated asset tag after registration
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ] 19.2 Create AssetTagDisplay component
    - Display QR code and barcode
    - Print label button
    - _Requirements: 10.1, 10.5_

- [ ] 20. Implement Frontend Components - Asset Management
  - [ ] 20.1 Create AssetList component
    - Display list of assets with search/filter
    - Search by tag, category, location, assignee, status, date range
    - Display asset tag, category, location, assignee, status, book value
    - Click to view asset details
    - _Requirements: 8.1, 8.2_
  
  - [ ] 20.2 Create AssetDetails component
    - Display complete asset information
    - Tabs for: Overview, Assignment History, Depreciation, Maintenance, Audit History
    - Actions: Assign, Transfer, Unassign, Dispose
    - _Requirements: 8.7_
  
  - [ ] 20.3 Create AssetAssignmentForm component
    - Assignee type selection (Staff, Classroom, Lab, Office)
    - Assignee lookup/selection
    - Assignment reason field
    - Call assignAsset or transferAsset API
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 21. Implement Frontend Components - Depreciation
  - [ ] 21.1 Create DepreciationConfigForm component
    - Depreciation method selection (Straight_Line, Declining_Balance)
    - Useful life input
    - Salvage value input
    - Depreciation rate input (for Declining_Balance)
    - Call configureDepreciation API
    - _Requirements: 3.1, 3.2_
  
  - [ ] 21.2 Create DepreciationSchedule component
    - Display depreciation schedule table
    - Show year, depreciation amount, accumulated depreciation, book value
    - Calculate button to run bulk depreciation
    - _Requirements: 3.3, 3.4, 3.5_

- [ ] 22. Implement Frontend Components - Maintenance
  - [ ] 22.1 Create MaintenanceScheduleForm component
    - Maintenance type input
    - Frequency selection
    - Next due date picker
    - Vendor selection
    - Call createMaintenanceSchedule API
    - _Requirements: 4.1_
  
  - [ ] 22.2 Create MaintenanceLogForm component
    - Maintenance date picker
    - Work performed textarea
    - Cost input
    - Vendor selection
    - Completion status selection
    - Call logMaintenance API
    - _Requirements: 4.3_
  
  - [ ] 22.3 Create RepairRequestForm component
    - Issue description textarea
    - Priority selection
    - Call createRepairRequest API
    - _Requirements: 4.4_
  
  - [ ] 22.4 Create MaintenanceTaskList component
    - Display due maintenance tasks
    - Filter by date
    - Link to asset details
    - _Requirements: 4.2_

- [ ] 23. Implement Frontend Components - Audit
  - [ ] 23.1 Create AuditCycleForm component
    - Cycle name input
    - Start and end date pickers
    - Auditor selection (multi-select)
    - Call initiateAuditCycle API
    - _Requirements: 5.1_
  
  - [ ] 23.2 Create AssetVerificationForm component
    - Physical condition input
    - Location verification checkbox
    - Auditor notes textarea
    - Mark as Missing button
    - Mark as Damaged button
    - Call verifyAsset, markAssetMissing, or markAssetDamaged APIs
    - _Requirements: 5.2, 5.3, 5.4_
  
  - [ ] 23.3 Create AuditReport component
    - Display audit cycle summary
    - Tabs for: Verified Assets, Missing Assets, Damaged Assets, Discrepancies
    - Complete audit button
    - _Requirements: 5.5_
  
  - [ ] 23.4 Create ComplianceDocumentUpload component
    - File upload input
    - Document type selection
    - Call uploadComplianceDocument API
    - _Requirements: 5.7_

- [ ] 24. Implement Frontend Components - Disposal
  - [ ] 24.1 Create AssetDisposalForm component
    - Disposal reason textarea
    - Disposal date picker
    - Disposal method input
    - Disposal value input
    - Display calculated gain/loss
    - Submit for approval button
    - Call disposeAsset API
    - _Requirements: 6.1, 6.4_
  
  - [ ] 24.2 Create DisposalApprovalList component
    - Display pending disposal requests
    - Approve/Reject buttons (Finance_Officer, School_Administrator only)
    - _Requirements: 6.2, 6.3_

- [ ] 25. Implement Frontend Components - Reports
  - [ ] 25.1 Create ReportGenerator component
    - Report type selection (Asset Register, Depreciation Schedule, Maintenance Report, Disposal Register)
    - Filter options (date range, category, status)
    - Generate button
    - Export to PDF button
    - Export to Excel button
    - Call report generation and export APIs
    - _Requirements: 8.3, 8.4, 8.5, 8.6, 6.7_
  
  - [ ] 25.2 Create ReportViewer component
    - Display generated report
    - Format based on report type
    - _Requirements: 8.3, 8.4, 8.5_

- [ ] 26. Implement Frontend Components - Asset Tag Scanner
  - [ ] 26.1 Create AssetTagScanner component
    - QR code scanner using device camera
    - Barcode scanner
    - Manual tag input option
    - Call scanAssetTag API
    - Navigate to asset details on successful scan
    - Display error message for invalid tags
    - _Requirements: 10.3, 10.4, 10.7_

- [ ] 27. Checkpoint - Ensure all frontend components work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 28. Implement Navigation and Integration
  - [ ] 28.1 Add Asset Management to main navigation
    - Add menu items for: Assets, Maintenance, Audits, Reports
    - Implement role-based menu visibility
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 28.2 Wire all components together
    - Set up routing for all asset management pages
    - Connect forms to API endpoints
    - Implement loading states and error handling
    - Implement success notifications
    - _Requirements: All_

- [ ] 29. Final Testing and Validation
  - [ ]* 29.1 Run all property-based tests
    - Verify all 41 properties pass with 100+ iterations
    - _Requirements: All_
  
  - [ ]* 29.2 Run all unit tests
    - Verify all unit tests pass
    - _Requirements: All_
  
  - [ ]* 29.3 Run integration tests
    - Test complete workflows end-to-end
    - Test Finance Module integration
    - Test Inventory Module integration
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 30. Final checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: database → services → API → frontend
- Finance Module integration is critical and should be tested thoroughly
- Role-based access control should be enforced at both API and UI levels

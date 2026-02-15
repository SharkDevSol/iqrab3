# Design Document: Property/Asset Management Module

## Overview

The Property/Asset Management Module manages the complete lifecycle of fixed assets within a School Management System. The module provides functionality for asset registration, assignment tracking, depreciation calculation, maintenance management, audit compliance, and disposal management.

### Key Design Principles

1. **Separation of Concerns**: Clear separation between asset operations, financial calculations, and integration logic
2. **Audit Trail**: Complete tracking of all asset operations for compliance and accountability
3. **Integration-Ready**: Clean interfaces for Finance and Inventory module integration
4. **Role-Based Security**: Strict access control based on user roles
5. **Scalability**: Support for thousands of assets with efficient querying and reporting

### Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **File Storage**: Local filesystem or cloud storage for asset documents
- **QR/Barcode Generation**: qrcode and jsbarcode libraries

## Architecture

### System Architecture

The module follows a layered architecture with clear separation between presentation, API, business logic, and data access layers.

### Integration Architecture

The Asset Management Module integrates with:
- **Finance Module**: Asset capitalization, depreciation posting, disposal write-offs, maintenance costs
- **Inventory Module**: Differentiation between fixed assets and consumables, vendor information sharing


## Components and Interfaces

### Core Components

#### 1. Asset Service
Handles all asset lifecycle operations including registration, assignment, and disposal.

Key Methods:
- registerAsset(data): Creates new asset with tag generation
- assignAsset(assetId, assignment): Assigns asset to staff/location
- transferAsset(assetId, transfer): Transfers asset to new assignee
- unassignAsset(assetId, reason): Removes current assignment
- disposeAsset(assetId, disposal): Initiates disposal workflow
- searchAssets(criteria): Searches assets by various criteria
- getAssetDetails(assetId): Retrieves complete asset information

#### 2. Depreciation Service
Calculates and manages asset depreciation using various methods.

Key Methods:
- configureDepreciation(assetId, config): Sets depreciation parameters
- calculateDepreciation(assetId, asOfDate): Calculates current depreciation
- calculateBulkDepreciation(assetIds, asOfDate): Batch depreciation calculation
- getDepreciationSchedule(assetId): Returns depreciation schedule
- postDepreciationToFinance(results): Posts to Finance Module

Depreciation Calculation Logic:

Straight-Line Method:
```
Annual Depreciation = (Purchase Cost - Salvage Value) / Useful Life
Accumulated Depreciation = Annual Depreciation × Years Elapsed
Book Value = Purchase Cost - Accumulated Depreciation
```

Declining Balance Method:
```
Depreciation Rate = (1 / Useful Life) × Multiplier
Annual Depreciation = Book Value × Depreciation Rate
Book Value = Purchase Cost - Accumulated Depreciation
```

#### 3. Maintenance Service
Manages preventive maintenance schedules and repair tracking.

Key Methods:
- createMaintenanceSchedule(assetId, schedule): Creates maintenance schedule
- logMaintenance(assetId, maintenance): Records completed maintenance
- createRepairRequest(assetId, request): Logs repair request
- getDueMaintenanceTasks(date): Returns due maintenance tasks
- getMaintenanceHistory(assetId): Returns maintenance history
- calculateMaintenanceCost(assetId): Calculates total maintenance cost

#### 4. Audit Service
Handles asset audits, verification, and compliance tracking.

Key Methods:
- initiateAuditCycle(cycle): Starts new audit cycle
- verifyAsset(assetId, verification): Records asset verification
- markAssetMissing(assetId, discoveryDate, notes): Marks asset as missing
- markAssetDamaged(assetId, damageDescription): Marks asset as damaged
- completeAuditCycle(cycleId): Completes audit and generates report
- uploadComplianceDocument(assetId, document): Uploads compliance docs

#### 5. Asset Tag Service
Generates and manages QR codes and barcodes for physical asset tracking.

Key Methods:
- generateAssetTag(assetId): Generates unique asset tag
- generateQRCode(assetId): Creates QR code image
- generateBarcode(assetId): Creates barcode image
- scanAssetTag(tagData): Decodes tag and retrieves asset
- printAssetLabel(assetId): Generates printable label
- bulkPrintLabels(assetIds): Generates multiple labels

#### 6. Finance Integration Service
Handles all financial postings to the Finance Module.

Key Methods:
- postAssetCapitalization(asset): Posts asset purchase entry
- postDepreciation(depreciation): Posts depreciation entry
- postDisposal(disposal, bookValue): Posts disposal entry
- postMaintenanceCost(maintenance): Posts maintenance expense
- validateFinanceAccounts(): Validates account configuration

#### 7. Report Service
Generates various asset reports and exports.

Key Methods:
- generateAssetRegister(filters): Generates asset register report
- generateDepreciationSchedule(filters): Generates depreciation report
- generateMaintenanceReport(filters): Generates maintenance report
- generateDisposalRegister(filters): Generates disposal report
- exportToPDF(report): Exports report to PDF
- exportToExcel(report): Exports report to Excel


## Data Models

### Core Entities

#### Asset
- id: Unique identifier
- assetTag: Unique tag (QR/Barcode)
- assetName: Asset name
- category: BUILDING | FURNITURE | IT_EQUIPMENT | LAB_EQUIPMENT | VEHICLE
- purchaseDate: Date of purchase
- purchaseCost: Original cost
- salvageValue: Residual value
- warrantyStartDate, warrantyEndDate, warrantyTerms: Warranty information
- supplierId: Reference to supplier
- status: ACTIVE | MISSING | DAMAGED | UNDER_MAINTENANCE | DISPOSED
- depreciationMethod: STRAIGHT_LINE | DECLINING_BALANCE
- usefulLifeYears: Asset lifespan
- depreciationRate: Rate for declining balance
- createdAt, createdBy, updatedAt, updatedBy: Audit fields

#### Assignment
- id: Unique identifier
- assetId: Reference to asset
- assigneeType: STAFF | CLASSROOM | LAB | OFFICE
- assigneeId: ID of assignee
- assigneeName: Name of assignee
- assignmentDate: Date assigned
- assignmentReason: Reason for assignment
- unassignmentDate: Date unassigned (if applicable)
- unassignmentReason: Reason for unassignment
- isActive: Current assignment flag
- createdAt, createdBy: Audit fields

#### MaintenanceSchedule
- id: Unique identifier
- assetId: Reference to asset
- maintenanceType: Type of maintenance
- frequency: Maintenance frequency
- nextDueDate: Next scheduled date
- vendorId: Assigned vendor
- createdAt, createdBy: Audit fields

#### Maintenance
- id: Unique identifier
- assetId: Reference to asset
- maintenanceDate: Date performed
- maintenanceType: Type of maintenance
- workPerformed: Description of work
- maintenanceCost: Cost incurred
- vendorId, vendorName: Vendor information
- completionStatus: Status of work
- createdAt, createdBy: Audit fields

#### RepairRequest
- id: Unique identifier
- assetId: Reference to asset
- issueDescription: Description of issue
- priority: LOW | MEDIUM | HIGH | CRITICAL
- reportedDate: Date reported
- reportedBy: Person who reported
- status: PENDING | IN_PROGRESS | COMPLETED | CANCELLED
- resolvedDate: Date resolved
- createdAt: Audit field

#### AuditCycle
- id: Unique identifier
- cycleName: Name of audit cycle
- startDate, endDate: Audit period
- assignedAuditors: List of auditors
- status: IN_PROGRESS | COMPLETED
- createdAt, createdBy: Audit fields

#### AuditRecord
- id: Unique identifier
- auditCycleId: Reference to audit cycle
- assetId: Reference to asset
- verificationDate: Date verified
- physicalCondition: Condition description
- locationVerified: Location match flag
- auditorNotes: Additional notes
- createdAt, createdBy: Audit fields

#### Disposal
- id: Unique identifier
- assetId: Reference to asset
- disposalReason: Reason for disposal
- disposalDate: Date of disposal
- disposalMethod: Method used
- disposalValue: Value received
- bookValue: Current book value
- gainLoss: Calculated gain/loss
- approvalStatus: PENDING | APPROVED | REJECTED
- approvedBy, approvalDate: Approval information
- createdAt, createdBy: Audit fields

#### Document
- id: Unique identifier
- assetId: Reference to asset
- documentType: Type of document
- documentName: Document name
- filePath: Storage path
- uploadDate: Date uploaded
- uploadedBy: Uploader


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Complete Data Capture
*For any* asset registration, assignment, maintenance record, repair request, audit cycle, audit record, or disposal, all required fields specified in the requirements SHALL be captured and stored in the system.
**Validates: Requirements 1.1, 1.4, 1.5, 1.7, 2.2, 2.6, 4.1, 4.3, 4.4, 5.1, 5.2, 6.1**

### Property 2: Asset Tag Uniqueness
*For any* set of assets in the system, all generated asset tags SHALL be unique across the entire system.
**Validates: Requirements 1.3, 10.2**

### Property 3: Asset Tag Round-Trip
*For any* asset, generating an asset tag and then scanning that tag SHALL retrieve the original asset identifier.
**Validates: Requirements 10.3, 10.4**

### Property 4: Duplicate Identifier Prevention
*For any* attempt to register an asset with an identifier that already exists in the system, the registration SHALL fail.
**Validates: Requirements 1.6**

### Property 5: Category and Status Support
*For any* asset category (Building, Furniture, IT_Equipment, Lab_Equipment, Vehicle) and asset status (Active, Missing, Damaged, Under_Maintenance, Disposed), the system SHALL support creating and tracking assets with those categories and statuses.
**Validates: Requirements 1.2, 5.6**

### Property 6: Assignment Type Support
*For any* assignment type (Staff, Classroom, Lab, Office), the system SHALL support assigning assets to that type.
**Validates: Requirements 2.1**

### Property 7: Assignment History Preservation
*For any* sequence of asset assignments and transfers, the complete assignment history SHALL be preserved and retrievable, including the current assignee.
**Validates: Requirements 2.3, 2.5**

### Property 8: Assignment State Integrity
*For any* asset that is currently assigned, attempting to assign it again without first unassigning SHALL fail.
**Validates: Requirements 2.4**

### Property 9: Depreciation Method Support
*For any* asset, the system SHALL support configuring depreciation using either Straight_Line or Declining_Balance methods with the required parameters (useful life, salvage value, depreciation rate).
**Validates: Requirements 3.1, 3.2**

### Property 10: Straight-Line Depreciation Calculation
*For any* asset configured with Straight_Line depreciation, the annual depreciation SHALL equal (purchase cost minus salvage value) divided by useful life.
**Validates: Requirements 3.3**

### Property 11: Declining Balance Depreciation Calculation
*For any* asset configured with Declining_Balance depreciation, the annual depreciation SHALL equal the current book value multiplied by the depreciation rate.
**Validates: Requirements 3.4**

### Property 12: Book Value Calculation
*For any* asset with depreciation, the current book value SHALL equal the purchase cost minus accumulated depreciation.
**Validates: Requirements 3.5**

### Property 13: Depreciation Floor
*For any* asset, depreciation calculation SHALL not reduce the book value below the salvage value.
**Validates: Requirements 3.6**

### Property 14: Maintenance Cost Aggregation
*For any* asset with maintenance records, the total maintenance cost SHALL equal the sum of all individual maintenance costs for that asset.
**Validates: Requirements 4.6**

### Property 15: Maintenance Schedule Update
*For any* completed maintenance with a recurring schedule, the next due date SHALL be updated based on the maintenance frequency.
**Validates: Requirements 4.7**

### Property 16: Maintenance Task Notification
*For any* maintenance schedule where the next due date is on or before the current date, a maintenance task notification SHALL be generated.
**Validates: Requirements 4.2**

### Property 17: Asset Status Updates
*For any* asset marked as missing during audit, the status SHALL be updated to Missing with the discovery date recorded; for any asset marked as damaged, the status SHALL be updated to Damaged with the damage description recorded.
**Validates: Requirements 5.3, 5.4**

### Property 18: Audit Report Completeness
*For any* completed audit cycle, the generated audit report SHALL include verified assets, missing assets, damaged assets, and discrepancies.
**Validates: Requirements 5.5**

### Property 19: Document Association
*For any* uploaded compliance document, the document SHALL be associated with the relevant asset and audit cycle (if applicable).
**Validates: Requirements 5.7**

### Property 20: Disposal Approval Requirement
*For any* disposal request, the disposal SHALL require approval from a Finance_Officer or School_Administrator before being finalized.
**Validates: Requirements 6.2**

### Property 21: Disposal Status Update
*For any* approved disposal, the asset status SHALL be changed to Disposed and the approval date and approver SHALL be recorded.
**Validates: Requirements 6.3**

### Property 22: Disposal Gain/Loss Calculation
*For any* asset disposal, the gain or loss SHALL equal the disposal value minus the current book value.
**Validates: Requirements 6.4**

### Property 23: Assigned Asset Disposal Prevention
*For any* asset that is currently assigned, attempting to dispose it without first unassigning SHALL fail.
**Validates: Requirements 6.6**

### Property 24: Role-Based Authorization
*For any* user attempting to access asset management functions, access SHALL be granted only if the user has one of the authorized roles (Asset_Controller, Finance_Officer, School_Administrator).
**Validates: Requirements 7.1, 7.5**

### Property 25: Role Permission Enforcement
*For any* user with Asset_Controller role, the system SHALL allow asset registration, assignment, maintenance scheduling, and audit operations; for any user with Finance_Officer role, the system SHALL allow depreciation configuration, disposal approval, and financial report access; for any user with School_Administrator role, the system SHALL allow all asset management functions.
**Validates: Requirements 7.2, 7.3, 7.4**

### Property 26: Audit Trail Logging
*For any* operation performed by a user, an audit trail entry SHALL be created with user identity, timestamp, operation type, and affected assets.
**Validates: Requirements 7.6**

### Property 27: Search Criteria Support
*For any* search by asset tag, category, location, assignee, status, or purchase date range, the system SHALL return matching assets.
**Validates: Requirements 8.1**

### Property 28: Search Result Completeness
*For any* search results, each result SHALL display asset tag, category, current location, current assignee, status, and book value.
**Validates: Requirements 8.2**

### Property 29: Report Type Support
*For any* report request, the system SHALL support generating asset register, depreciation schedule, maintenance history, and disposal register reports.
**Validates: Requirements 8.3**

### Property 30: Report Content Completeness
*For any* depreciation report, it SHALL show asset details, original cost, accumulated depreciation, and current book value; for any maintenance report, it SHALL show asset details, maintenance history, total maintenance cost, and upcoming maintenance; for any asset detail view, it SHALL display registration details, assignment history, depreciation schedule, maintenance records, and audit history.
**Validates: Requirements 8.4, 8.5, 8.7**

### Property 31: Report Export Support
*For any* generated report, the system SHALL support exporting it in both PDF and Excel formats.
**Validates: Requirements 8.6**

### Property 32: Finance Integration Posting
*For any* asset registration, the system SHALL post capitalization entries to the Finance_Module; for any depreciation calculation, it SHALL post depreciation expense entries; for any asset disposal, it SHALL post disposal entries including asset removal, accumulated depreciation reversal, and gain/loss recognition; for any maintenance cost recording, it SHALL post maintenance expense entries.
**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 3.7, 6.5**

### Property 33: Finance Account Validation
*For any* attempt to post financial transactions, the system SHALL validate that Finance_Module accounts are configured before posting.
**Validates: Requirements 9.5**

### Property 34: Finance Posting Error Handling
*For any* failed financial posting, the system SHALL log the error and notify the Finance_Officer.
**Validates: Requirements 9.6**

### Property 35: Finance Transaction Reference Storage
*For any* successful financial posting, the system SHALL store the Finance_Module transaction reference for reconciliation.
**Validates: Requirements 9.7**

### Property 36: Asset Tag Format Generation
*For any* registered asset, the system SHALL generate an asset tag in both QR code and barcode formats.
**Validates: Requirements 10.1**

### Property 37: Asset Label Content
*For any* printed asset label, it SHALL include the QR code, barcode, asset name, and asset category.
**Validates: Requirements 10.5**

### Property 38: Bulk Label Printing
*For any* set of multiple assets, the system SHALL support printing labels for all assets in a single operation.
**Validates: Requirements 10.6**

### Property 39: Invalid Tag Error Handling
*For any* invalid or unrecognized asset tag scan, the system SHALL display an error message.
**Validates: Requirements 10.7**

### Property 40: Maintenance History Linkage
*For any* maintenance cost recorded, it SHALL be linked to the asset's maintenance history.
**Validates: Requirements 4.5**

### Property 41: Disposal Report Content
*For any* disposal report query, the generated report SHALL show disposed assets, disposal reasons, and financial impact.
**Validates: Requirements 6.7**


## Error Handling

### Validation Errors
- Invalid asset category or status
- Missing required fields during registration
- Invalid depreciation configuration (e.g., useful life <= 0)
- Invalid date ranges (e.g., warranty end before start)
- Duplicate asset identifiers

### Business Rule Violations
- Assigning an already-assigned asset
- Disposing an assigned asset
- Depreciation below salvage value
- Unauthorized role access
- Missing approval for disposal

### Integration Errors
- Finance Module unavailable
- Finance account not configured
- Failed financial posting
- Supplier not found in Inventory Module

### System Errors
- Database connection failures
- File storage errors for documents
- QR/Barcode generation failures
- Report generation failures

### Error Response Format
All errors should return structured responses:
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### Error Logging
- All errors logged with timestamp, user, operation, and error details
- Critical errors (integration failures, data corruption) trigger notifications
- Error logs retained for audit and troubleshooting


## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing as complementary approaches:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Library Selection**: fast-check for TypeScript/JavaScript

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test references its design document property
- Tag format: **Feature: property-asset-management-module, Property {number}: {property_text}**
- Each correctness property implemented by a SINGLE property-based test

**Property Test Coverage**:
- Data capture completeness (Property 1)
- Asset tag uniqueness and round-trip (Properties 2, 3)
- Depreciation calculations (Properties 10, 11, 12, 13)
- Assignment history and state integrity (Properties 7, 8)
- Role-based authorization (Properties 24, 25)
- Finance integration posting (Property 32)
- Search and report functionality (Properties 27-31)

### Unit Testing

**Focus Areas**:
- Specific examples demonstrating correct behavior
- Edge cases (empty data, boundary values, null handling)
- Error conditions (invalid inputs, business rule violations)
- Integration points between components
- API endpoint validation

**Unit Test Coverage**:
- Asset registration with various categories
- Assignment workflows (assign, transfer, unassign)
- Maintenance scheduling and completion
- Audit cycle workflows
- Disposal approval workflows
- Report generation for each type
- Finance integration error scenarios

### Integration Testing

**Integration Points**:
- Finance Module integration (capitalization, depreciation, disposal)
- Inventory Module integration (supplier lookup)
- Database operations (CRUD, transactions)
- File storage (document uploads, label generation)
- QR/Barcode generation and scanning

### Test Data Generation

**Generators for Property Tests**:
- Random assets with all categories
- Random assignments with all types
- Random depreciation configurations
- Random maintenance schedules
- Random audit cycles
- Random disposals

**Test Data Constraints**:
- Valid date ranges
- Positive costs and values
- Valid enum values
- Realistic useful life ranges (1-50 years)
- Valid depreciation rates (0-1)

### Performance Testing

**Performance Targets**:
- Asset search: < 500ms for 10,000 assets
- Bulk depreciation calculation: < 5s for 1,000 assets
- Report generation: < 3s for standard reports
- Bulk label printing: < 10s for 100 labels

### Security Testing

**Security Test Cases**:
- Unauthorized access attempts
- Role permission boundaries
- SQL injection prevention
- XSS prevention in asset names/descriptions
- File upload validation


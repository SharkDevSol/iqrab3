# Requirements Document: Property/Asset Management Module

## Introduction

The Property/Asset Management Module is a comprehensive system for managing fixed assets and infrastructure within a School Management System. This module handles the complete lifecycle of assets from registration through disposal, including assignment, depreciation, maintenance, and audit compliance. It integrates with existing Finance and Inventory modules to provide a unified asset management solution.

## Glossary

- **Asset_Management_System**: The Property/Asset Management Module that manages fixed assets and infrastructure
- **Asset**: A fixed asset or infrastructure item owned by the school (buildings, furniture, IT equipment, lab equipment, vehicles)
- **Asset_Controller**: User role responsible for managing asset operations and assignments
- **Finance_Officer**: User role responsible for financial aspects of asset management
- **School_Administrator**: User role with full access to all asset management functions
- **Asset_Tag**: A unique QR code or barcode identifier assigned to each physical asset
- **Depreciation**: The systematic allocation of an asset's cost over its useful life
- **Maintenance_Schedule**: A planned schedule for preventive maintenance activities
- **Asset_Assignment**: The allocation of an asset to a specific person, location, or department
- **Asset_Audit**: A verification process to confirm physical existence and condition of assets
- **Asset_Disposal**: The process of retiring and removing an asset from active inventory
- **Finance_Module**: The existing financial management system that handles accounting transactions
- **Inventory_Module**: The existing inventory system that manages consumable items

## Requirements

### Requirement 1: Asset Registration

**User Story:** As an Asset Controller, I want to register new assets with comprehensive details, so that I can maintain accurate records of all school property.

#### Acceptance Criteria

1. WHEN an Asset Controller creates a new asset record, THE Asset_Management_System SHALL capture asset category, unique identifier, purchase date, purchase cost, warranty details, and supplier information
2. THE Asset_Management_System SHALL support asset categories including Building, Furniture, IT_Equipment, Lab_Equipment, and Vehicle
3. WHEN an asset is registered, THE Asset_Management_System SHALL generate a unique Asset_Tag with QR code and barcode representation
4. WHEN an asset has warranty information, THE Asset_Management_System SHALL store warranty start date, warranty end date, and warranty terms
5. WHEN supplier information is provided, THE Asset_Management_System SHALL link the asset to the supplier record in the system
6. THE Asset_Management_System SHALL prevent registration of assets with duplicate unique identifiers
7. WHEN an asset is registered, THE Asset_Management_System SHALL record the registration timestamp and the user who registered it

### Requirement 2: Asset Assignment and Tracking

**User Story:** As an Asset Controller, I want to assign assets to staff, classrooms, labs, or offices, so that I can track asset location and responsibility.

#### Acceptance Criteria

1. WHEN an Asset Controller assigns an asset, THE Asset_Management_System SHALL support assignment to Staff, Classroom, Lab, or Office locations
2. WHEN an asset is assigned, THE Asset_Management_System SHALL record the assignee, assignment date, assignment reason, and the user who made the assignment
3. WHEN an asset is transferred to a new assignee, THE Asset_Management_System SHALL create a transfer record preserving the complete assignment history
4. THE Asset_Management_System SHALL prevent assignment of an asset that is already assigned without first unassigning it
5. WHEN an asset assignment is queried, THE Asset_Management_System SHALL return the current assignee and complete transfer history
6. WHEN an asset is unassigned, THE Asset_Management_System SHALL record the unassignment date and reason

### Requirement 3: Asset Depreciation Calculation

**User Story:** As a Finance Officer, I want the system to automatically calculate asset depreciation, so that I can maintain accurate financial records and comply with accounting standards.

#### Acceptance Criteria

1. THE Asset_Management_System SHALL support Straight_Line and Declining_Balance depreciation methods
2. WHEN an asset is registered, THE Asset_Management_System SHALL allow configuration of depreciation method, useful life in years, and salvage value
3. WHEN depreciation is calculated using Straight_Line method, THE Asset_Management_System SHALL compute annual depreciation as (purchase cost minus salvage value) divided by useful life
4. WHEN depreciation is calculated using Declining_Balance method, THE Asset_Management_System SHALL compute depreciation using the declining balance formula with configurable rate
5. WHEN depreciation is calculated, THE Asset_Management_System SHALL compute accumulated depreciation and current book value
6. THE Asset_Management_System SHALL prevent depreciation calculation for assets with book value below salvage value
7. WHEN depreciation is calculated, THE Asset_Management_System SHALL post depreciation entries to the Finance_Module

### Requirement 4: Maintenance Management

**User Story:** As an Asset Controller, I want to schedule preventive maintenance and track repairs, so that I can ensure assets remain in good working condition and minimize downtime.

#### Acceptance Criteria

1. WHEN an Asset Controller creates a maintenance schedule, THE Asset_Management_System SHALL capture maintenance type, frequency, next due date, and assigned vendor
2. WHEN a maintenance schedule is due, THE Asset_Management_System SHALL generate a maintenance task notification
3. WHEN maintenance is performed, THE Asset_Management_System SHALL record maintenance date, maintenance cost, vendor, work performed, and completion status
4. WHEN a repair request is logged, THE Asset_Management_System SHALL capture issue description, priority level, reported date, and reporter
5. WHEN maintenance cost is recorded, THE Asset_Management_System SHALL link the cost to the asset's maintenance history
6. THE Asset_Management_System SHALL calculate total maintenance cost per asset across all maintenance records
7. WHEN maintenance is completed, THE Asset_Management_System SHALL update the next due date based on the maintenance frequency

### Requirement 5: Asset Audit and Compliance

**User Story:** As a School Administrator, I want to conduct asset audits and track compliance, so that I can verify physical existence of assets and maintain accountability.

#### Acceptance Criteria

1. WHEN a School Administrator initiates an asset audit, THE Asset_Management_System SHALL create an audit cycle with start date, end date, and assigned auditors
2. WHEN an auditor verifies an asset, THE Asset_Management_System SHALL record verification date, physical condition, location verification, and auditor notes
3. WHEN an asset is found missing during audit, THE Asset_Management_System SHALL mark the asset status as Missing and record the discovery date
4. WHEN an asset is found damaged during audit, THE Asset_Management_System SHALL mark the asset status as Damaged and record damage description
5. WHEN an audit cycle is completed, THE Asset_Management_System SHALL generate an audit report showing verified assets, missing assets, damaged assets, and discrepancies
6. THE Asset_Management_System SHALL track asset status including Active, Missing, Damaged, Under_Maintenance, and Disposed
7. WHEN compliance documentation is uploaded, THE Asset_Management_System SHALL associate the document with the relevant asset and audit cycle

### Requirement 6: Asset Disposal Management

**User Story:** As a Finance Officer, I want to manage asset disposal with proper approval workflow, so that I can maintain accurate records and comply with financial regulations.

#### Acceptance Criteria

1. WHEN an Asset Controller initiates asset disposal, THE Asset_Management_System SHALL capture disposal reason, disposal date, disposal method, and disposal value
2. WHEN a disposal request is created, THE Asset_Management_System SHALL require approval from a Finance_Officer or School_Administrator
3. WHEN a disposal is approved, THE Asset_Management_System SHALL change asset status to Disposed and record approval date and approver
4. WHEN an asset is disposed, THE Asset_Management_System SHALL calculate the disposal gain or loss as disposal value minus current book value
5. WHEN an asset disposal is finalized, THE Asset_Management_System SHALL post write-off entries to the Finance_Module
6. THE Asset_Management_System SHALL prevent disposal of assets that are currently assigned without first unassigning them
7. WHEN disposal records are queried, THE Asset_Management_System SHALL generate disposal reports showing disposed assets, disposal reasons, and financial impact

### Requirement 7: Role-Based Access Control

**User Story:** As a School Administrator, I want to control access to asset management functions based on user roles, so that I can maintain security and proper segregation of duties.

#### Acceptance Criteria

1. WHEN a user attempts to access asset management functions, THE Asset_Management_System SHALL verify the user has one of the authorized roles: Asset_Controller, Finance_Officer, or School_Administrator
2. WHEN an Asset_Controller performs operations, THE Asset_Management_System SHALL allow asset registration, assignment, maintenance scheduling, and audit operations
3. WHEN a Finance_Officer performs operations, THE Asset_Management_System SHALL allow depreciation configuration, disposal approval, and financial report access
4. WHEN a School_Administrator performs operations, THE Asset_Management_System SHALL allow all asset management functions including role management
5. THE Asset_Management_System SHALL prevent unauthorized users from accessing asset management functions
6. WHEN a user performs any operation, THE Asset_Management_System SHALL log the operation in an audit trail with user identity, timestamp, operation type, and affected assets

### Requirement 8: Asset Search and Reporting

**User Story:** As an Asset Controller, I want to search for assets and generate reports, so that I can quickly find asset information and analyze asset data.

#### Acceptance Criteria

1. WHEN a user searches for assets, THE Asset_Management_System SHALL support search by asset tag, category, location, assignee, status, and purchase date range
2. WHEN search results are returned, THE Asset_Management_System SHALL display asset tag, category, current location, current assignee, status, and book value
3. WHEN a user requests an asset report, THE Asset_Management_System SHALL generate reports including asset register, depreciation schedule, maintenance history, and disposal register
4. WHEN a depreciation report is generated, THE Asset_Management_System SHALL show asset details, original cost, accumulated depreciation, and current book value
5. WHEN a maintenance report is generated, THE Asset_Management_System SHALL show asset details, maintenance history, total maintenance cost, and upcoming maintenance
6. THE Asset_Management_System SHALL support export of reports in PDF and Excel formats
7. WHEN a user views asset details, THE Asset_Management_System SHALL display complete asset information including registration details, assignment history, depreciation schedule, maintenance records, and audit history

### Requirement 9: Integration with Finance Module

**User Story:** As a Finance Officer, I want asset transactions to automatically post to the Finance Module, so that I can maintain synchronized financial records.

#### Acceptance Criteria

1. WHEN an asset is registered, THE Asset_Management_System SHALL post an asset capitalization entry to the Finance_Module with asset account and corresponding credit account
2. WHEN depreciation is calculated, THE Asset_Management_System SHALL post depreciation expense entries to the Finance_Module with depreciation expense account and accumulated depreciation account
3. WHEN an asset is disposed, THE Asset_Management_System SHALL post disposal entries to the Finance_Module including asset removal, accumulated depreciation reversal, and gain or loss recognition
4. WHEN maintenance cost is recorded, THE Asset_Management_System SHALL post maintenance expense entries to the Finance_Module
5. THE Asset_Management_System SHALL validate that Finance_Module accounts are configured before posting transactions
6. WHEN a financial posting fails, THE Asset_Management_System SHALL log the error and notify the Finance_Officer
7. WHEN financial entries are posted, THE Asset_Management_System SHALL store the Finance_Module transaction reference for reconciliation

### Requirement 10: Asset Tag Generation and Scanning

**User Story:** As an Asset Controller, I want to generate and scan asset tags, so that I can efficiently track and verify physical assets.

#### Acceptance Criteria

1. WHEN an asset is registered, THE Asset_Management_System SHALL generate a unique Asset_Tag in both QR code and barcode formats
2. THE Asset_Management_System SHALL ensure Asset_Tag uniqueness across all assets in the system
3. WHEN an Asset_Tag is generated, THE Asset_Management_System SHALL encode the asset unique identifier in the tag
4. WHEN a user scans an Asset_Tag, THE Asset_Management_System SHALL decode the tag and retrieve the corresponding asset record
5. WHEN an Asset_Tag is printed, THE Asset_Management_System SHALL generate a printable label including the QR code, barcode, asset name, and asset category
6. THE Asset_Management_System SHALL support bulk printing of Asset_Tags for multiple assets
7. WHEN an Asset_Tag scan fails, THE Asset_Management_System SHALL display an error message indicating invalid or unrecognized tag

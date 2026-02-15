# Implementation Plan: Inventory Management Module

## Overview

This implementation plan breaks down the Inventory Management Module into discrete, incremental coding tasks. Each task builds on previous work, with property-based tests integrated throughout to catch errors early. The plan follows a bottom-up approach: database schema → core services → API layer → integration → frontend components.

## Tasks

- [ ] 1. Set up database schema and Prisma models
  - Create Prisma schema file with all inventory models (Item, Category, Store, Vendor, PurchaseRequest, PurchaseOrder, GRN, StockLevel, Batch, StockIssue, StockTransfer, StockAdjustment, Alert, AuditLog, CostLayer, FinanceTransactionQueue)
  - Define relationships between models
  - Configure indexes for performance optimization
  - Run Prisma migration to create database tables
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 14.1, 15.1_

- [ ] 2. Implement Item Master Service
  - [ ] 2.1 Create ItemMasterService with CRUD operations
    - Implement createItem, updateItem, getItem, listItems, deleteItem methods
    - Add validation for required fields (name, category, unit of measure)
    - Implement item code generation logic
    - Add barcode/QR code assignment methods
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  
  - [ ] 2.2 Write property test for item creation validation
    - **Property 1: Item Creation Validation**
    - **Validates: Requirements 1.1**
  
  - [ ] 2.3 Write property test for unique identifier generation
    - **Property 2: Unique Identifier Generation**
    - **Validates: Requirements 1.4**
  
  - [ ] 2.4 Write property test for item deletion protection
    - **Property 3: Item Deletion Protection**
    - **Validates: Requirements 1.7**
  
  - [ ] 2.5 Write property test for barcode assignment round trip
    - **Property 5: Barcode Assignment Round Trip**
    - **Validates: Requirements 1.5**


- [ ] 3. Implement Category and Vendor Management
  - [ ] 3.1 Create CategoryService for category and sub-category management
    - Implement CRUD operations for categories and sub-categories
    - Add validation for unique category names
    - _Requirements: 1.1_
  
  - [ ] 3.2 Create VendorService for vendor management
    - Implement CRUD operations for vendors
    - Add vendor-item association methods
    - Implement vendor performance tracking
    - Add inactive vendor validation
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ] 3.3 Write property test for inactive vendor purchase prevention
    - **Property 6: Inactive Vendor Purchase Prevention**
    - **Validates: Requirements 2.3**

- [ ] 4. Implement Store and Stock Level Management
  - [ ] 4.1 Create StoreService for store/warehouse management
    - Implement CRUD operations for stores
    - Add store code generation
    - Implement user-store assignment methods
    - _Requirements: 12.1, 12.3_
  
  - [ ] 4.2 Create StockLevelService for stock tracking
    - Implement methods to query stock levels by store and item
    - Add stock availability checking
    - Implement stock level update methods (internal use)
    - _Requirements: 12.2_
  
  - [ ] 4.3 Write property test for store-specific stock isolation
    - **Property 33: Store-Specific Stock Isolation**
    - **Validates: Requirements 12.2, 12.4**
  
  - [ ] 4.4 Write property test for non-negative stock invariant
    - **Property 60: Non-Negative Stock Invariant**
    - **Validates: Requirements 18.6**

- [ ] 5. Implement Batch Tracking Service
  - [ ] 5.1 Create BatchTrackingService
    - Implement createBatch method with batch number generation
    - Implement allocateBatch method with FIFO strategy
    - Add getBatchStock and getExpiringBatches methods
    - Implement batch movement tracking
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ] 5.2 Write property test for batch FIFO allocation
    - **Property 17: Batch FIFO Allocation**
    - **Validates: Requirements 6.5, 11.2, 11.6**
  
  - [ ] 5.3 Write property test for batch movement history completeness
    - **Property 30: Batch Movement History Completeness**
    - **Validates: Requirements 11.3**
  
  - [ ] 5.4 Write property test for batch stock query breakdown
    - **Property 31: Batch Stock Query Breakdown**
    - **Validates: Requirements 11.4**

- [ ] 6. Implement Procurement Service
  - [ ] 6.1 Create ProcurementService for purchase requests
    - Implement createPurchaseRequest with validation
    - Add request number generation
    - Implement approvePurchaseRequest and rejectPurchaseRequest methods
    - Add status tracking and querying
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6_
  
  - [ ] 6.2 Implement purchase order management
    - Implement createPurchaseOrder with vendor and delivery date validation
    - Add order number generation
    - Implement convertToOrder method (PR to PO conversion)
    - Add PO status tracking and update methods
    - Implement PO version history tracking
    - _Requirements: 4.2, 4.3, 4.4, 4.7, 4.8_
  
  - [ ] 6.3 Write property test for purchase request multi-item support
    - **Property 8: Purchase Request Multi-Item Support**
    - **Validates: Requirements 3.3**
  
  - [ ] 6.4 Write property test for purchase request status tracking
    - **Property 9: Purchase Request Status Tracking**
    - **Validates: Requirements 3.5, 4.7**
  
  - [ ] 6.5 Write property test for PO version history
    - **Property 11: Purchase Order Version History**
    - **Validates: Requirements 4.8**

- [ ] 7. Implement Finance Integration Service
  - [ ] 7.1 Create FinanceIntegrationService
    - Implement postPurchaseCost method
    - Implement postConsumptionCost method
    - Implement postAdjustmentCost method
    - Implement verifyBudget method with Finance Module API calls
    - Add retry logic with exponential backoff
    - Implement transaction queue management
    - Add reconciliation report generation
    - _Requirements: 4.5, 4.6, 5.6, 6.8, 9.4, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_
  
  - [ ] 7.2 Write property test for budget verification before purchase order
    - **Property 10: Budget Verification Before Purchase Order**
    - **Validates: Requirements 4.5, 4.6, 15.6**
  
  - [ ] 7.3 Write property test for finance integration posting
    - **Property 42: Finance Integration Posting**
    - **Validates: Requirements 5.6, 6.8, 9.4, 15.1, 15.2, 15.3**
  
  - [ ] 7.4 Write property test for finance integration failure resilience
    - **Property 43: Finance Integration Failure Resilience**
    - **Validates: Requirements 15.4**

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 9. Implement Stock Transaction Service - Goods Receipt
  - [ ] 9.1 Create StockTransactionService with GRN processing
    - Implement receiveGoods method
    - Add GRN number generation
    - Implement validation for batch-tracked and perishable items
    - Add stock level increase logic
    - Integrate with BatchTrackingService for batch creation
    - Add damaged item handling
    - Implement PO status update after GRN
    - Queue finance posting for purchase cost
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_
  
  - [ ] 9.2 Write property test for GRN stock level increase invariant
    - **Property 12: GRN Stock Level Increase Invariant**
    - **Validates: Requirements 5.5**
  
  - [ ] 9.3 Write property test for partial receipt support
    - **Property 13: Partial Receipt Support**
    - **Validates: Requirements 5.2, 5.8**
  
  - [ ] 9.4 Write property test for batch tracking requirement enforcement
    - **Property 14: Batch Tracking Requirement Enforcement**
    - **Validates: Requirements 5.3, 11.1**

- [ ] 10. Implement Stock Transaction Service - Stock Issue
  - [ ] 10.1 Implement stock issuing functionality
    - Implement issueStock method with validation
    - Add stock availability checking
    - Implement stock level decrease logic
    - Integrate with BatchTrackingService for FIFO allocation
    - Add issue number generation
    - Queue finance posting for consumption cost
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.8_
  
  - [ ] 10.2 Implement stock return functionality
    - Implement returnStock method
    - Add return number generation
    - Implement stock level increase logic for returns
    - Add reason code validation
    - _Requirements: 6.7_
  
  - [ ] 10.3 Write property test for stock issue availability check
    - **Property 15: Stock Issue Availability Check**
    - **Validates: Requirements 6.2, 6.3**
  
  - [ ] 10.4 Write property test for stock issue decrease invariant
    - **Property 16: Stock Issue Decrease Invariant**
    - **Validates: Requirements 6.4**
  
  - [ ] 10.5 Write property test for stock return increase invariant
    - **Property 18: Stock Return Increase Invariant**
    - **Validates: Requirements 6.7**

- [ ] 11. Implement Stock Transaction Service - Transfers and Adjustments
  - [ ] 11.1 Implement inter-store transfer functionality
    - Implement transferStock method with source/destination validation
    - Add transfer number generation
    - Implement source stock decrease and destination stock increase
    - Add transfer status tracking (Initiated, In Transit, Received)
    - Implement receiveTransfer method
    - Preserve batch information during transfers
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  
  - [ ] 11.2 Implement stock adjustment functionality
    - Implement adjustStock method for damaged/lost/expired items
    - Add adjustment number generation
    - Implement stock level decrease logic
    - Add approval workflow for significant adjustments
    - Queue finance posting for adjustment cost
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ] 11.3 Write property test for inter-store transfer stock conservation
    - **Property 19: Inter-Store Transfer Stock Conservation**
    - **Validates: Requirements 7.4, 7.5**
  
  - [ ] 11.4 Write property test for transfer batch preservation
    - **Property 20: Transfer Batch Preservation**
    - **Validates: Requirements 7.7**
  
  - [ ] 11.5 Write property test for stock adjustment decrease invariant
    - **Property 24: Stock Adjustment Decrease Invariant**
    - **Validates: Requirements 9.3**
  
  - [ ] 11.6 Write property test for significant adjustment approval requirement
    - **Property 25: Significant Adjustment Approval Requirement**
    - **Validates: Requirements 9.6**

- [ ] 12. Implement Inventory Valuation Service
  - [ ] 12.1 Create ValuationService with cost calculation methods
    - Implement FIFO valuation logic with cost layer management
    - Implement LIFO valuation logic with cost layer management
    - Implement Weighted Average valuation logic
    - Add calculateStockValue method
    - Add getIssueCost method that uses configured valuation method
    - Implement updateCostLayers method (called during GRN)
    - Add valuation method configuration management
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  
  - [ ] 12.2 Write property test for FIFO valuation correctness
    - **Property 26: FIFO Valuation Correctness**
    - **Validates: Requirements 10.1, 10.5**
  
  - [ ] 12.3 Write property test for LIFO valuation correctness
    - **Property 27: LIFO Valuation Correctness**
    - **Validates: Requirements 10.2, 10.5**
  
  - [ ] 12.4 Write property test for weighted average valuation correctness
    - **Property 28: Weighted Average Valuation Correctness**
    - **Validates: Requirements 10.3, 10.5**
  
  - [ ] 12.5 Write property test for valuation method consistency
    - **Property 29: Valuation Method Consistency**
    - **Validates: Requirements 10.4**

- [ ] 13. Implement Alert Service
  - [ ] 13.1 Create AlertService for monitoring and alerts
    - Implement checkLowStock method to scan all items below minimum
    - Implement checkExpiringItems method to scan batches near expiry
    - Implement generateAlert method with alert type and severity
    - Add getActiveAlerts method for dashboard
    - Implement acknowledgeAlert method
    - Add scheduled job integration for automatic alert checking
    - _Requirements: 3.2, 8.1, 8.2, 8.3, 8.4, 8.6_
  
  - [ ] 13.2 Write property test for automatic reorder alert generation
    - **Property 7: Automatic Reorder Alert Generation**
    - **Validates: Requirements 3.2, 8.1**
  
  - [ ] 13.3 Write property test for expiry alert generation
    - **Property 21: Expiry Alert Generation**
    - **Validates: Requirements 8.2**
  
  - [ ] 13.4 Write property test for expired item issue prevention
    - **Property 22: Expired Item Issue Prevention**
    - **Validates: Requirements 8.3**
  
  - [ ] 13.5 Write property test for alert acknowledgment state change
    - **Property 23: Alert Acknowledgment State Change**
    - **Validates: Requirements 8.6**

- [ ] 14. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 15. Implement Audit Service
  - [ ] 15.1 Create AuditService for transaction logging
    - Implement logTransaction method to create immutable audit entries
    - Add getAuditTrail method with filtering support
    - Implement getItemHistory method
    - Implement getUserActivity method
    - Add flagCriticalTransaction method
    - Integrate audit logging into all transaction services
    - _Requirements: 1.6, 2.5, 7.8, 9.5, 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 15.2 Write property test for comprehensive transaction audit logging
    - **Property 37: Comprehensive Transaction Audit Logging**
    - **Validates: Requirements 1.6, 2.5, 7.8, 9.5, 14.1**
  
  - [ ] 15.3 Write property test for audit log immutability
    - **Property 38: Audit Log Immutability**
    - **Validates: Requirements 14.2**
  
  - [ ] 15.4 Write property test for audit trail query filtering
    - **Property 39: Audit Trail Query Filtering**
    - **Validates: Requirements 14.3**
  
  - [ ] 15.5 Write property test for item transaction history completeness
    - **Property 40: Item Transaction History Completeness**
    - **Validates: Requirements 14.4**

- [ ] 16. Implement Report Service
  - [ ] 16.1 Create ReportService for inventory reporting
    - Implement generateStockStatusReport method
    - Implement generateMovementReport method with date range filtering
    - Implement generateConsumptionReport method with department aggregation
    - Implement generateVendorPerformanceReport method
    - Implement generateValuationReport method
    - Implement generateExpiryReport method
    - Add report filtering support (date range, store, category, department)
    - Implement exportReport method for PDF and Excel formats
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9_
  
  - [ ] 16.2 Write property test for stock status report completeness
    - **Property 44: Stock Status Report Completeness**
    - **Validates: Requirements 16.1**
  
  - [ ] 16.3 Write property test for movement report date range filtering
    - **Property 45: Movement Report Date Range Filtering**
    - **Validates: Requirements 16.2**
  
  - [ ] 16.4 Write property test for consumption report department aggregation
    - **Property 46: Consumption Report Department Aggregation**
    - **Validates: Requirements 16.3**
  
  - [ ] 16.5 Write property test for low stock report accuracy
    - **Property 47: Low Stock Report Accuracy**
    - **Validates: Requirements 16.4**
  
  - [ ] 16.6 Write property test for stock valuation report calculation
    - **Property 49: Stock Valuation Report Calculation**
    - **Validates: Requirements 16.6**

- [ ] 17. Implement Authorization and Role-Based Access Control
  - [ ] 17.1 Create AuthorizationService for permission checking
    - Implement role definitions (Store_Manager, Finance_Officer, School_Administrator)
    - Add permission checking methods for each operation
    - Implement role assignment methods (admin only)
    - Add authorization middleware for API routes
    - Integrate authorization checks into all services
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [ ] 17.2 Write property test for role-based permission enforcement
    - **Property 35: Role-Based Permission Enforcement**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**
  
  - [ ] 17.3 Write property test for role assignment authorization
    - **Property 36: Role Assignment Authorization**
    - **Validates: Requirements 13.6**

- [ ] 18. Implement Validation Service
  - [ ] 18.1 Create ValidationService for input validation
    - Implement validatePositiveQuantity method
    - Implement validateFutureDate method for expiry dates
    - Implement validateActiveItem method
    - Implement validateRequiredFields method
    - Add validation middleware for API routes
    - _Requirements: 18.1, 18.2, 18.3, 18.5_
  
  - [ ] 18.2 Write property test for positive quantity validation
    - **Property 56: Positive Quantity Validation**
    - **Validates: Requirements 18.1**
  
  - [ ] 18.3 Write property test for future expiry date validation
    - **Property 57: Future Expiry Date Validation**
    - **Validates: Requirements 18.2**
  
  - [ ] 18.4 Write property test for active item validation
    - **Property 58: Active Item Validation**
    - **Validates: Requirements 18.3**
  
  - [ ] 18.5 Write property test for transaction atomicity
    - **Property 61: Transaction Atomicity**
    - **Validates: Requirements 18.7**

- [ ] 19. Implement Barcode Service
  - [ ] 19.1 Create BarcodeService for barcode operations
    - Implement generateBarcode method for standard formats
    - Implement scanBarcode method for item lookup
    - Implement validateBarcodeFormat method
    - Add support for EAN-13, UPC, and Code 128 formats
    - Implement batch scanning support
    - _Requirements: 17.1, 17.2, 17.4, 17.5, 17.6, 17.7_
  
  - [ ] 19.2 Write property test for barcode lookup accuracy
    - **Property 52: Barcode Lookup Accuracy**
    - **Validates: Requirements 17.1, 17.2**
  
  - [ ] 19.3 Write property test for invalid code error handling
    - **Property 53: Invalid Code Error Handling**
    - **Validates: Requirements 17.4**
  
  - [ ] 19.4 Write property test for batch scanning processing
    - **Property 55: Batch Scanning Processing**
    - **Validates: Requirements 17.7**

- [ ] 20. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 21. Implement API Layer - Item Master and Categories
  - [ ] 21.1 Create Express routes for Item Master APIs
    - Implement POST /api/inventory/items (create item)
    - Implement GET /api/inventory/items (list items with filters)
    - Implement GET /api/inventory/items/:id (get item details)
    - Implement PUT /api/inventory/items/:id (update item)
    - Implement DELETE /api/inventory/items/:id (delete item)
    - Implement POST /api/inventory/items/:id/barcode (generate/assign barcode)
    - Add request validation middleware
    - Add authorization middleware
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.7_
  
  - [ ] 21.2 Create Express routes for Category APIs
    - Implement CRUD endpoints for categories and sub-categories
    - Add validation and authorization
    - _Requirements: 1.1_

- [ ] 22. Implement API Layer - Vendors and Procurement
  - [ ] 22.1 Create Express routes for Vendor APIs
    - Implement CRUD endpoints for vendors
    - Add vendor-item association endpoints
    - Add validation and authorization
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 22.2 Create Express routes for Purchase Request APIs
    - Implement POST /api/inventory/purchase-requests (create PR)
    - Implement GET /api/inventory/purchase-requests (list PRs)
    - Implement GET /api/inventory/purchase-requests/:id (get PR details)
    - Implement PUT /api/inventory/purchase-requests/:id/approve (approve PR)
    - Implement PUT /api/inventory/purchase-requests/:id/reject (reject PR)
    - Implement POST /api/inventory/purchase-requests/:id/convert (convert to PO)
    - Add validation and authorization
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 4.1, 4.2_
  
  - [ ] 22.3 Create Express routes for Purchase Order APIs
    - Implement POST /api/inventory/purchase-orders (create PO)
    - Implement GET /api/inventory/purchase-orders (list POs)
    - Implement GET /api/inventory/purchase-orders/:id (get PO details)
    - Implement PUT /api/inventory/purchase-orders/:id (update PO)
    - Add validation and authorization
    - _Requirements: 4.3, 4.4, 4.7, 4.8_

- [ ] 23. Implement API Layer - Stock Transactions
  - [ ] 23.1 Create Express routes for GRN APIs
    - Implement POST /api/inventory/grn (create GRN)
    - Implement GET /api/inventory/grn (list GRNs)
    - Implement GET /api/inventory/grn/:id (get GRN details)
    - Add validation and authorization
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 23.2 Create Express routes for Stock Issue APIs
    - Implement POST /api/inventory/issues (issue stock)
    - Implement GET /api/inventory/issues (list issues)
    - Implement GET /api/inventory/issues/:id (get issue details)
    - Add validation and authorization
    - _Requirements: 6.1, 6.2, 6.4, 6.5_
  
  - [ ] 23.3 Create Express routes for Stock Transfer APIs
    - Implement POST /api/inventory/transfers (create transfer)
    - Implement GET /api/inventory/transfers (list transfers)
    - Implement PUT /api/inventory/transfers/:id/receive (receive transfer)
    - Add validation and authorization
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6_
  
  - [ ] 23.4 Create Express routes for Stock Adjustment APIs
    - Implement POST /api/inventory/adjustments (create adjustment)
    - Implement GET /api/inventory/adjustments (list adjustments)
    - Add validation and authorization
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [ ] 23.5 Create Express routes for Stock Return APIs
    - Implement POST /api/inventory/returns (create return)
    - Implement GET /api/inventory/returns (list returns)
    - Add validation and authorization
    - _Requirements: 6.7_

- [ ] 24. Implement API Layer - Stock Queries and Alerts
  - [ ] 24.1 Create Express routes for Stock Query APIs
    - Implement GET /api/inventory/stock (get current stock levels)
    - Implement GET /api/inventory/stock/:itemId (get item stock details)
    - Implement GET /api/inventory/stock/:itemId/batches (get batch-wise stock)
    - Add filtering support (store, category)
    - Add authorization
    - _Requirements: 11.4, 12.2_
  
  - [ ] 24.2 Create Express routes for Alert APIs
    - Implement GET /api/inventory/alerts (get active alerts)
    - Implement PUT /api/inventory/alerts/:id/acknowledge (acknowledge alert)
    - Add authorization
    - _Requirements: 8.4, 8.6_

- [ ] 25. Implement API Layer - Reports
  - [ ] 25.1 Create Express routes for Report APIs
    - Implement GET /api/inventory/reports/stock-status (stock status report)
    - Implement GET /api/inventory/reports/movement (movement report)
    - Implement GET /api/inventory/reports/consumption (consumption report)
    - Implement GET /api/inventory/reports/vendor-performance (vendor performance)
    - Implement GET /api/inventory/reports/valuation (valuation report)
    - Implement GET /api/inventory/reports/expiry (expiry report)
    - Implement POST /api/inventory/reports/:id/export (export report)
    - Add filtering support for all reports
    - Add authorization
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9_

- [ ] 26. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 27. Implement Frontend - Item Master Components
  - [ ] 27.1 Create ItemMaster page component
    - Build item list view with search and filtering
    - Add pagination support
    - Implement item creation form modal
    - Implement item edit form modal
    - Add barcode generation button
    - Integrate with Item Master APIs
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  
  - [ ] 27.2 Create Category management component
    - Build category and sub-category list view
    - Add category creation and editing forms
    - Integrate with Category APIs
    - _Requirements: 1.1_

- [ ] 28. Implement Frontend - Vendor and Procurement Components
  - [ ] 28.1 Create Vendor management page
    - Build vendor list view with search
    - Add vendor creation and editing forms
    - Implement vendor-item association interface
    - Integrate with Vendor APIs
    - _Requirements: 2.1, 2.2_
  
  - [ ] 28.2 Create Purchase Request page
    - Build PR list view with status filtering
    - Add PR creation form with multi-item support
    - Implement approval/rejection interface
    - Add convert to PO functionality
    - Integrate with Purchase Request APIs
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 4.1, 4.2_
  
  - [ ] 28.3 Create Purchase Order page
    - Build PO list view with status filtering
    - Add PO creation form
    - Implement PO details view with version history
    - Integrate with Purchase Order APIs
    - _Requirements: 4.3, 4.4, 4.7, 4.8_

- [ ] 29. Implement Frontend - Stock Transaction Components
  - [ ] 29.1 Create Goods Receipt page
    - Build GRN creation form linked to PO
    - Add batch and expiry date input fields
    - Implement partial receipt support
    - Add damaged item recording
    - Integrate with GRN APIs
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7_
  
  - [ ] 29.2 Create Stock Issue page
    - Build stock issue form with department selection
    - Add stock availability checking
    - Implement barcode scanning support
    - Integrate with Stock Issue APIs
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ] 29.3 Create Stock Transfer page
    - Build transfer creation form with source/destination stores
    - Add transfer status tracking view
    - Implement receive transfer interface
    - Integrate with Stock Transfer APIs
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6_
  
  - [ ] 29.4 Create Stock Adjustment page
    - Build adjustment form with reason codes
    - Add approval workflow interface for significant adjustments
    - Integrate with Stock Adjustment APIs
    - _Requirements: 9.1, 9.2, 9.3, 9.6_
  
  - [ ] 29.5 Create Stock Return page
    - Build return form with reason codes
    - Integrate with Stock Return APIs
    - _Requirements: 6.7_

- [ ] 30. Implement Frontend - Stock Monitoring and Alerts
  - [ ] 30.1 Create Stock Status Dashboard
    - Build current stock levels view by store
    - Add low stock highlighting
    - Implement batch-wise stock breakdown
    - Add filtering by category and store
    - Integrate with Stock Query APIs
    - _Requirements: 8.1, 11.4, 12.2_
  
  - [ ] 30.2 Create Alerts Dashboard
    - Build active alerts view with severity indicators
    - Add alert acknowledgment functionality
    - Implement alert filtering by type
    - Integrate with Alert APIs
    - _Requirements: 8.1, 8.2, 8.4, 8.6_

- [ ] 31. Implement Frontend - Reports and Analytics
  - [ ] 31.1 Create Reports page
    - Build report selection interface
    - Add date range picker for time-based reports
    - Implement filter controls (store, category, department)
    - Add report preview functionality
    - Implement PDF and Excel export buttons
    - Integrate with Report APIs
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9_
  
  - [ ] 31.2 Create Stock Valuation page
    - Build valuation method configuration interface
    - Add stock valuation report view
    - Implement cost layer visualization
    - Integrate with Valuation APIs
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.6_

- [ ] 32. Implement Frontend - Administration Components
  - [ ] 32.1 Create Store Management page
    - Build store list view
    - Add store creation and editing forms
    - Implement user-store assignment interface
    - Integrate with Store APIs
    - _Requirements: 12.1, 12.3_
  
  - [ ] 32.2 Create Audit Trail page
    - Build audit log viewer with filtering
    - Add item transaction history view
    - Implement user activity tracking view
    - Add critical transaction flagging view
    - Integrate with Audit APIs
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 32.3 Create Role Management page
    - Build role assignment interface (admin only)
    - Add permission matrix view
    - Integrate with Authorization APIs
    - _Requirements: 13.1, 13.2, 13.3, 13.6_

- [ ] 33. Implement Barcode Scanning Integration
  - [ ] 33.1 Add barcode scanning support to frontend
    - Integrate barcode scanner library (e.g., QuaggaJS)
    - Add barcode scanning UI component
    - Implement barcode lookup in transaction forms
    - Add batch scanning support for GRN
    - _Requirements: 17.1, 17.2, 17.4, 17.7_

- [ ] 34. Implement Background Jobs and Scheduled Tasks
  - [ ] 34.1 Create scheduled job for alert checking
    - Implement job to run checkLowStock periodically
    - Implement job to run checkExpiringItems periodically
    - Configure job scheduling (e.g., every hour)
    - _Requirements: 8.1, 8.2_
  
  - [ ] 34.2 Create scheduled job for finance transaction retry
    - Implement job to retry failed finance postings
    - Configure retry schedule with exponential backoff
    - _Requirements: 15.4_

- [ ] 35. Integration Testing and End-to-End Flows
  - [ ] 35.1 Write integration tests for procurement flow
    - Test complete flow: PR creation → approval → PO creation → GRN → stock update → finance posting
    - _Requirements: 3.1, 4.2, 5.1, 5.5, 5.6_
  
  - [ ] 35.2 Write integration tests for stock issue flow
    - Test complete flow: stock issue → batch allocation → stock decrease → finance posting
    - _Requirements: 6.1, 6.4, 6.5, 6.8_
  
  - [ ] 35.3 Write integration tests for transfer flow
    - Test complete flow: transfer initiation → source decrease → transfer receive → destination increase
    - _Requirements: 7.1, 7.4, 7.5_
  
  - [ ] 35.4 Write integration tests for alert generation
    - Test alert generation when stock falls below minimum
    - Test alert generation for expiring items
    - _Requirements: 8.1, 8.2_

- [ ] 36. Final Checkpoint - Complete System Testing
  - Run all unit tests, property tests, and integration tests
  - Verify all 61 correctness properties pass
  - Test all API endpoints with Postman/Insomnia
  - Perform manual testing of critical user flows
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 37. Documentation and Deployment Preparation
  - [ ] 37.1 Create API documentation
    - Document all API endpoints with request/response examples
    - Add authentication and authorization requirements
    - Create Postman collection for API testing
  
  - [ ] 37.2 Create user documentation
    - Write user guide for Store Managers
    - Write user guide for Finance Officers
    - Write user guide for School Administrators
    - Document common workflows and troubleshooting
  
  - [ ] 37.3 Prepare deployment configuration
    - Configure environment variables for production
    - Set up database migration scripts
    - Configure scheduled jobs for production
    - Set up monitoring and logging

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows
- All services use Prisma transactions to ensure atomicity
- Finance Module integration uses queue-based retry for resilience
- Audit logging is integrated into all transaction services
- Authorization checks are enforced at both service and API layers


# Fee Type Management Guide

## Overview
The Fee Type Management system allows you to create and manage different types of fees (tuition, books, phone, etc.) and track them in the payment system.

## Features

### 1. Predefined Fee Types
The system comes with 10 built-in fee types:
- 📚 **Tuition** - Regular tuition fees
- 🚌 **Transport** - Transportation fees
- 📖 **Library** - Library fees
- 🔬 **Laboratory** - Lab fees
- ⚽ **Sports** - Sports and athletics fees
- 📝 **Examination** - Exam fees
- 📕 **Books** - Textbook and material fees
- 📱 **Phone** - Phone or communication fees
- 👔 **Uniform** - Uniform fees
- 🍽️ **Meals** - Meal or cafeteria fees

### 2. Custom Fee Types
You can create unlimited custom fee types for any specific needs:
- Art Supplies
- Computer Lab Fee
- Field Trip Fee
- Music Lessons
- After School Program
- Any other custom fee

## How to Use

### Creating a Fee Structure with Custom Types

1. **Navigate to Fee Management**
   - Go to Finance → Fee Management
   - Click "Add Fee Structure"

2. **Fill in Basic Information**
   - Fee Name: e.g., "Grade 1 Books Fee"
   - Class: e.g., "Grade 1"
   - Academic Year: e.g., "2024"
   - Term: Optional

3. **Select Fee Type**
   - Choose from predefined types (Tuition, Transport, etc.)
   - OR select "Custom/Other" to create a new type

4. **For Custom Fee Types**
   - Select "Custom/Other" from the dropdown
   - Enter your custom fee name in the "Custom Fee Name" field
   - Example: "Computer Lab Fee", "Art Supplies", etc.

5. **Set Amount and Options**
   - Enter the fee amount
   - Set due date (optional)
   - Mark as recurring if needed

6. **Save**
   - Click "Save Fee Structure"
   - Your custom fee type is now available for tracking

### Viewing Fee Types

1. **Navigate to Fee Types**
   - Go to Finance → Fee Types
   - View all predefined and custom fee types

2. **Fee Type Display**
   - Predefined types show with their icons and colors
   - Custom types are automatically detected from fee structures
   - Each type shows its ID and description

### Tracking Payments by Fee Type

1. **Navigate to Payment Management**
   - Go to Finance → Payments
   - View all payments with their associated fee types

2. **Payment Table Columns**
   - Receipt Number
   - Student ID
   - Payment Date
   - Amount
   - **Fee Type** - Shows which fee type was paid
   - Payment Method
   - Reference
   - Status

3. **Fee Type Display in Payments**
   - Shows the fee type name for each payment
   - For custom types, shows the custom name
   - Multiple fee types shown if payment covers multiple fees

## Backend Implementation

### Database Schema
The system uses flexible string fields for fee categories:
- `FeeStructureItem.feeCategory` - Stores any fee type name
- `Invoice.metadata` - Stores fee type information in JSON format

### API Endpoints

#### Fee Structures
```
POST   /api/finance/fee-structures
GET    /api/finance/fee-structures
GET    /api/finance/fee-structures/:id
PUT    /api/finance/fee-structures/:id
DELETE /api/finance/fee-structures/:id
```

#### Payments
```
POST   /api/finance/payments
GET    /api/finance/payments
GET    /api/finance/payments/:id
GET    /api/finance/payments/invoice/:invoiceId
```

### Fee Type Validation
- No strict validation on fee category names
- Any string value is accepted for maximum flexibility
- Predefined types are suggestions, not requirements

## Examples

### Example 1: Adding Books Fee
```
Fee Name: Grade 5 Books Fee
Class: Grade 5
Academic Year: 2024
Term: Term 1
Fee Type: BOOKS
Amount: 500.00
```

### Example 2: Adding Custom Phone Fee
```
Fee Name: Student Phone Service
Class: All Classes
Academic Year: 2024
Fee Type: CUSTOM
Custom Fee Name: Phone Service
Amount: 50.00
Recurring: Yes
```

### Example 3: Adding Art Supplies Fee
```
Fee Name: Art Class Supplies
Class: Grade 3
Academic Year: 2024
Fee Type: CUSTOM
Custom Fee Name: Art Supplies
Amount: 150.00
```

## Payment Tracking

When a payment is recorded:
1. The system links it to the invoice
2. The invoice contains fee type information
3. Payment list shows the fee type for each payment
4. You can filter and search payments by fee type

## Benefits

1. **Flexibility** - Create any fee type you need
2. **Tracking** - See exactly what fees are being paid
3. **Reporting** - Generate reports by fee type
4. **Organization** - Keep different fee types separate
5. **Transparency** - Students and parents see clear fee breakdowns

## Tips

1. **Use Predefined Types When Possible**
   - They have nice icons and colors
   - Easier to recognize at a glance

2. **Create Custom Types for Specific Needs**
   - Use descriptive names
   - Be consistent with naming

3. **Track Everything**
   - Every fee should have a type
   - Makes reporting much easier

4. **Review Regularly**
   - Check which fee types are being used
   - Remove or consolidate unused types

## Troubleshooting

### Custom Fee Type Not Showing
- Custom types appear automatically when used in fee structures
- Create a fee structure with the custom type first

### Payment Not Showing Fee Type
- Ensure the invoice has fee type metadata
- Check that payment is properly allocated to invoice

### Cannot Edit Fee Type
- Fee types are defined in fee structures
- Edit the fee structure to change the type

## Next Steps

1. Create your fee structures with appropriate types
2. Generate invoices based on fee structures
3. Record payments and track by fee type
4. Generate reports to analyze fee collection

## Support

For questions or issues:
- Check the Finance Dashboard for overview
- Review fee structures for configuration
- Contact system administrator for technical support

# Iqra Report Card - Quick Start Guide 🚀

## What's New?

A brand new report card design specifically for Iqra Academy has been created! This is a separate component from your existing report card, so both designs are available.

## Files Created

1. **Component**: `APP/src/PAGE/CreateMarklist/ReportCard/IqraReportCard.jsx`
2. **Styles**: `APP/src/PAGE/CreateMarklist/ReportCard/IqraReportCard.module.css`
3. **Documentation**: `IQRA_REPORT_CARD_NEW_DESIGN.md`

## What Was Updated

1. **Routing** (`APP/src/App.jsx`):
   - Added import for IqraReportCard component
   - Added route: `/iqra-report-card`

2. **Menu** (`APP/src/config/adminPermissions.js`):
   - Added "Iqra Report Card" menu item under Academic section
   - Permission key: `iqra_report_card`

## How to Access

### Option 1: Direct URL
Navigate to: `http://localhost:3000/iqra-report-card`

### Option 2: Through Menu
1. Login to your admin panel
2. Go to **Academic** section in the sidebar
3. Click on **"Iqra Report Card"**

### Option 3: Grant Permission to Sub-Admins
1. Go to **Admin Sub-Accounts**
2. Edit a sub-admin account
3. Check the **"Iqra Report Card"** permission under Academic
4. Save

## How to Use

### Step 1: Select Class
- Choose a class from the dropdown
- The system will load all students in that class

### Step 2: Select Student
- Choose a student from the dropdown
- Students are shown with their rank (e.g., "Ahmed Ali (#1)")

### Step 3: Preview
- The report card will display automatically
- Shows both front and back pages
- Front page: Student info, grading scale, signatures
- Back page: Marks table, character traits

### Step 4: Print or Export
- **Print Single**: Print the selected student's report card
- **Print All**: Print report cards for all students in the class
- **PDF**: Download as PDF file

## Print Settings

For best print quality:
- **Paper Size**: A5 (148mm × 210mm)
- **Orientation**: Portrait
- **Margins**: None (0mm)
- **Background Graphics**: Enabled
- **Scale**: 100%

## Key Features

### Design Elements
✅ Orange/gold Iqra branding
✅ Decorative corner gradient
✅ Student photo placeholder
✅ Iqra logo (circular with orange border)
✅ Multi-language school names
✅ Professional layout matching PDF design

### Academic Features
✅ 12 Iqra subjects
✅ 1st and 2nd semester marks
✅ Automatic average calculation
✅ Student ranking
✅ Grading scale (A, B, C, D, F)

### Character Traits
✅ 7 character traits section
✅ Grading legend (XC, G, SI, NI)
✅ 1st and 2nd semester columns

### Signatures
✅ Teacher signature with date
✅ Principal signature with date
✅ Parent/Guardian signature with date

## Differences from Old Report Card

| Feature | Old Report Card | New Iqra Report Card |
|---------|----------------|---------------------|
| URL | `/report-card` | `/iqra-report-card` |
| Design | Generic green theme | Iqra orange/gold theme |
| Subjects | 13 subjects | 12 subjects (Iqra curriculum) |
| Grading | 6-tier system | 5-tier system |
| Branding | Generic | Iqra-specific |

## Troubleshooting

### Issue: Menu item not showing
**Solution**: 
1. Check if you have the `iqra_report_card` permission
2. If you're a sub-admin, ask the main admin to grant you access
3. Refresh the page after permission is granted

### Issue: No data showing
**Solution**:
1. Ensure marks are entered for the selected class
2. Check that marks exist for Term 1 or Term 2
3. Go to "Create Mark List" to enter marks if needed

### Issue: Print layout broken
**Solution**:
1. Use Chrome or Edge browser for best results
2. Check print settings (A5, Portrait, No margins)
3. Enable "Background graphics" in print dialog

### Issue: Logo not showing
**Solution**:
1. Go to Settings > Branding
2. Upload your school logo
3. Refresh the report card page

## Next Steps

### Immediate Actions
1. ✅ Access the new report card at `/iqra-report-card`
2. ✅ Test with a sample class and student
3. ✅ Try printing to verify layout
4. ✅ Grant permissions to teachers/admins who need access

### Optional Enhancements
1. **Add Student Photos**: Upload photos in student registration
2. **Add Demographics**: Add sex, age, address fields to students
3. **Character Trait Grading**: Create system for teachers to grade traits
4. **Digital Signatures**: Allow teachers/principals to sign digitally
5. **Email Reports**: Send report cards to parents via email

## Support

### Need Help?
- Check the full documentation: `IQRA_REPORT_CARD_NEW_DESIGN.md`
- Review the integration guide: `IQRA_REPORT_CARD_INTEGRATION_COMPLETE.md`

### Want to Customize?
- Edit subjects: Modify `IQRA_SUBJECTS` array in `IqraReportCard.jsx`
- Change colors: Edit CSS variables in `IqraReportCard.module.css`
- Modify layout: Update component structure in `IqraReportCard.jsx`

## Quick Reference

### URLs
- Old Report Card: `http://localhost:3000/report-card`
- New Iqra Report Card: `http://localhost:3000/iqra-report-card`

### API Endpoints Used
- `GET /api/mark-list/classes` - Get all classes
- `GET /api/mark-list/comprehensive-ranking/:className/:term` - Get student marks
- `GET /api/admin/branding` - Get school branding

### Permissions
- Permission Key: `iqra_report_card`
- Category: Academic
- Label: "Iqra Report Card"

---

**Status**: ✅ Ready to Use
**Created**: February 15, 2026
**Version**: 1.0.0

Enjoy your new Iqra Report Card! 🎉

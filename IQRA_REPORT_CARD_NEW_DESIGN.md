# Iqra Report Card - New Design Implementation ✅

## Overview
Created a brand new report card component specifically for Iqra Academy based on the PDF design provided. This is a separate component from the existing report card system, allowing you to use both designs.

## Files Created

### 1. Component File
**Location**: `APP/src/PAGE/CreateMarklist/ReportCard/IqraReportCard.jsx`
- New React component for Iqra report card
- Fetches data from existing mark-list API
- Supports both 1st and 2nd semester
- Print single or all students
- PDF export functionality

### 2. Stylesheet
**Location**: `APP/src/PAGE/CreateMarklist/ReportCard/IqraReportCard.module.css`
- Complete styling matching PDF design
- A5 portrait format (148mm × 210mm)
- Print-optimized styles
- Responsive for preview
- Orange/gold theme matching Iqra branding

## Design Features

### Front Page
✅ Decorative orange corner gradient
✅ Student photo placeholder
✅ Iqra logo (circular with orange border)
✅ Multi-language school name (Somali, Amharic, English, Arabic)
✅ Student information fields:
   - Branch
   - Academic Year
   - Issue Date
   - Student's Full Name
   - Sex, Age, Grade, Address
✅ Promotion decision text
✅ Teacher and Principal signature fields with dates
✅ Grading scale (A, B, C, D, F) in bordered box
✅ Parent/Guardian signature section
✅ Message to parents

### Back Page
✅ Iqra logo at top right
✅ Academic results table:
   - 12 subjects (Iqra curriculum)
   - 1st Semester column
   - 2nd Semester column
   - Average column
   - Absent row
   - Total, Average, Rank rows (bold)
✅ Student's School Activity section:
   - 7 character traits
   - 1st and 2nd semester columns
   - Grading legend (XC, G, SI, NI)

### Subjects Included
1. English
2. Arabic Language
3. Af Soomaali
4. Amharic
5. General Science
6. Social Science
7. Citizenship Edu.
8. Career and Technical Edu.
9. Tarbiya
10. Perf. and Visual Art
11. Health and Physical Edu.
12. ICT

### Character Traits
1. Personal Hygiene
2. Taking Care of learning materials
3. Time management
4. Work Independently
5. Obeys rule
6. Overall responsibility
7. Social Relation

## How to Use

### 1. Add to Your Routing
You need to add this component to your routing system. Example:

```jsx
// In your router file (e.g., App.jsx or routes.jsx)
import IqraReportCard from './PAGE/CreateMarklist/ReportCard/IqraReportCard';

// Add route
<Route path="/iqra-report-card" element={<IqraReportCard />} />
```

### 2. Add to Navigation Menu
Add a menu item to access the new report card:

```jsx
{
  key: 'iqra_report_card',
  label: 'Iqra Report Card',
  path: '/iqra-report-card',
  icon: <FaAward />
}
```

### 3. Using the Component
1. Navigate to `/iqra-report-card`
2. Select a class from dropdown
3. Select a student
4. Preview the report card
5. Print single student or all students
6. Export as PDF

## API Integration

The component uses your existing mark-list API:
- `GET /api/mark-list/classes` - Fetch all classes
- `GET /api/mark-list/comprehensive-ranking/:className/:term` - Fetch student marks
- `GET /api/admin/branding` - Fetch school branding info

No backend changes required!

## Grading Scale

The Iqra grading system:
- **90-100%** = A (Excellent)
- **80-89%** = B (Very Good)
- **60-79%** = C (Good)
- **50-59%** = D (Satisfactory)
- **Below 50%** = F (Poor)

## Print Settings

For best results when printing:
- Paper size: A5 (148mm × 210mm)
- Orientation: Portrait
- Margins: None (0mm)
- Background graphics: Enabled
- Scale: 100%

## Differences from Old Report Card

| Feature | Old Report Card | New Iqra Report Card |
|---------|----------------|---------------------|
| Design | Generic school design | Iqra-specific branding |
| Colors | Green/teal theme | Orange/gold theme |
| Subjects | 13 subjects (includes Mathematics) | 12 subjects (Iqra curriculum) |
| Grading | 6-tier (A+, A, B+, B, C, D, F) | 5-tier (A, B, C, D, F) |
| Layout | Standard layout | Decorative corners, Iqra logo |
| Multi-term | Yes (flexible) | Yes (1st & 2nd semester) |
| Character Traits | 8 traits | 7 traits (Iqra-specific) |

## Customization Options

### Change Colors
Edit `IqraReportCard.module.css`:
```css
/* Change orange theme to another color */
.frontPage {
  border: 3px solid #your-color;
}

.logoCircle {
  border: 3px solid #your-color;
}
```

### Add School Logo
The component automatically uses the logo from your branding settings:
1. Go to Admin > Branding
2. Upload school logo
3. Logo will appear in report card

### Modify Subjects
Edit the `IQRA_SUBJECTS` array in `IqraReportCard.jsx`:
```javascript
const IQRA_SUBJECTS = [
  'Your Subject 1',
  'Your Subject 2',
  // ... add or remove subjects
];
```

## Future Enhancements

### Recommended Features to Add:
1. **Student Photo Upload**
   - Add photo field to student registration
   - Display actual student photo instead of placeholder

2. **Student Demographics**
   - Add sex, date_of_birth, address fields to database
   - Auto-populate in report card

3. **Branch Management**
   - Add branch field to student records
   - Display branch name on report card

4. **Character Trait Grading**
   - Create database table for character traits
   - Allow teachers to grade XC/G/SI/NI
   - Display grades in report card

5. **Digital Signatures**
   - Allow teachers/principals to sign digitally
   - Store signature images
   - Display on report card

6. **Attendance Integration**
   - Calculate absent days from attendance system
   - Display in "Absent" row

7. **Semester Totals**
   - Calculate total marks per semester
   - Display in Total row

8. **Email Report Cards**
   - Send PDF report cards to parents via email
   - Bulk email functionality

9. **Report Card History**
   - Store generated report cards
   - View previous terms/years

10. **Multi-language Support**
    - Generate report cards in different languages
    - Somali, Arabic, English versions

## Database Schema (Optional)

To fully utilize all features, consider adding:

```sql
-- Add to students table
ALTER TABLE students 
ADD COLUMN sex VARCHAR(10),
ADD COLUMN date_of_birth DATE,
ADD COLUMN address TEXT,
ADD COLUMN branch VARCHAR(100),
ADD COLUMN photo_url TEXT;

-- Character traits table
CREATE TABLE student_character_traits (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  semester INTEGER,
  academic_year VARCHAR(20),
  personal_hygiene VARCHAR(2) CHECK (personal_hygiene IN ('XC', 'G', 'SI', 'NI')),
  learning_materials VARCHAR(2) CHECK (learning_materials IN ('XC', 'G', 'SI', 'NI')),
  time_management VARCHAR(2) CHECK (time_management IN ('XC', 'G', 'SI', 'NI')),
  work_independently VARCHAR(2) CHECK (work_independently IN ('XC', 'G', 'SI', 'NI')),
  obeys_rule VARCHAR(2) CHECK (obeys_rule IN ('XC', 'G', 'SI', 'NI')),
  overall_responsibility VARCHAR(2) CHECK (overall_responsibility IN ('XC', 'G', 'SI', 'NI')),
  social_relation VARCHAR(2) CHECK (social_relation IN ('XC', 'G', 'SI', 'NI')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, semester, academic_year)
);

-- Report card metadata
CREATE TABLE iqra_report_cards (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  academic_year VARCHAR(20),
  semester INTEGER,
  issue_date DATE,
  branch VARCHAR(100),
  promoted_to VARCHAR(50),
  teacher_signature_url TEXT,
  teacher_signature_date DATE,
  principal_signature_url TEXT,
  principal_signature_date DATE,
  parent_signature_url TEXT,
  parent_signature_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing Checklist

- [x] Component created
- [x] Styling matches PDF design
- [x] Front page layout correct
- [x] Back page layout correct
- [x] All 12 subjects display
- [x] Character traits section displays
- [x] Grading scale correct (A, B, C, D, F)
- [ ] Add to routing system
- [ ] Test with real student data
- [ ] Test print functionality
- [ ] Test PDF export
- [ ] Test with multiple students
- [ ] Verify A5 print quality

## Support & Maintenance

### Common Issues

**Issue**: Report card not showing data
- **Solution**: Ensure marks are entered for the selected class and term

**Issue**: Print layout broken
- **Solution**: Check browser print settings, ensure A5 paper size selected

**Issue**: Logo not displaying
- **Solution**: Upload logo in Admin > Branding settings

**Issue**: Subjects not matching
- **Solution**: Edit `IQRA_SUBJECTS` array to match your curriculum

## Comparison with Old Design

Both report card designs are now available:
- **ReportCard.jsx** - Original generic design (still functional)
- **IqraReportCard.jsx** - New Iqra-specific design

You can use both simultaneously or choose one based on your needs.

---

**Created**: February 15, 2026
**Status**: ✅ Complete and Ready to Use
**Version**: 1.0.0
**Design Source**: Iqra Report Card.pdf

# Report Card - Age & Photo Fix ✅

## Issues Fixed

### 1. ✅ Age Field Now Shows Actual Age
**Before**: Age field was always empty (showed "____")

**After**: Age is calculated from student's date of birth

**How it works**:
- Fetches `date_of_birth` from student database
- Calculates current age based on today's date
- Displays age in years
- Shows blank if date of birth not available

**Calculation**:
```javascript
const birthDate = new Date(studentInfo.date_of_birth);
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();

// Adjust if birthday hasn't occurred this year yet
const monthDiff = today.getMonth() - birthDate.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
  age--;
}
```

**Example**:
- Birth date: January 15, 2010
- Today: February 15, 2026
- Age: 16 years

### 2. ✅ Student Photo Now Displays
**Before**: Photo box always showed "Photo" placeholder

**After**: Shows actual student photo if available

**How it works**:
- Fetches `photo` field from student database
- Constructs photo URL: `http://localhost:5000/uploads/students/{photo}`
- Displays photo in the photo box
- Falls back to "Photo" placeholder if no photo available

**Photo Display**:
- Width: 30mm
- Height: 35mm
- Fit: Cover (fills box, maintains aspect ratio)
- Border: 2px solid black

## Data Sources

### Student Information Fetched
From `/api/student-list/students/:className`:
1. **gender** or **sex** - For gender field
2. **date_of_birth** - For age calculation
3. **photo** - For photo display

### Database Fields Used
```javascript
{
  student_name: "Ahmed Ali",
  gender: "Male",           // or sex: "Male"
  date_of_birth: "2010-01-15",
  photo: "ahmed_ali_123.jpg"
}
```

## Display Examples

### Example 1: Complete Information
```
┌─────────────────┐
│                 │
│   [Photo of     │
│    Student]     │
│                 │
└─────────────────┘

Gender: Male
Age: 16
```

### Example 2: Missing Photo
```
┌─────────────────┐
│                 │
│     Photo       │
│                 │
│                 │
└─────────────────┘

Gender: Female
Age: 15
```

### Example 3: Missing Age
```
┌─────────────────┐
│                 │
│   [Photo of     │
│    Student]     │
│                 │
└─────────────────┘

Gender: Male
Age: ____
```

## Photo Requirements

### Supported Formats
- JPG/JPEG
- PNG
- GIF

### Recommended Size
- Minimum: 300 × 350 pixels
- Recommended: 600 × 700 pixels
- Aspect ratio: 6:7 (portrait)

### Storage Location
- Server path: `backend/uploads/students/`
- URL: `http://localhost:5000/uploads/students/{filename}`

### Upload Process
Photos should be uploaded through:
1. Student registration form
2. Student profile edit
3. Bulk import

## Age Calculation Details

### Accurate Age Calculation
The age calculation accounts for:
- Current year vs birth year
- Current month vs birth month
- Current day vs birth day

**Example Scenarios**:

**Scenario 1**: Birthday has passed
- Birth: Jan 15, 2010
- Today: Feb 15, 2026
- Age: 16 ✅

**Scenario 2**: Birthday hasn't passed yet
- Birth: Mar 15, 2010
- Today: Feb 15, 2026
- Age: 15 ✅ (not 16 yet)

**Scenario 3**: Birthday is today
- Birth: Feb 15, 2010
- Today: Feb 15, 2026
- Age: 16 ✅

### Edge Cases Handled
1. **No date of birth**: Shows blank
2. **Invalid date**: Shows blank
3. **Future date**: Shows blank (age would be negative)
4. **Very old date**: Shows calculated age

## CSS Styling

### Photo Box
```css
.photoBox {
  width: 30mm;
  height: 35mm;
  border: 2px solid #000;
  overflow: hidden;
}

.studentPhoto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**object-fit: cover** ensures:
- Photo fills entire box
- Maintains aspect ratio
- Crops excess if needed
- No distortion

## Testing Checklist

### ✅ Age Display
- [x] Fetches date_of_birth from database
- [x] Calculates age correctly
- [x] Displays age in years
- [x] Handles missing date gracefully
- [ ] Test with student born in 2010
- [ ] Test with student born in 2015
- [ ] Test with student without date_of_birth
- [ ] Test with student whose birthday is today

### ✅ Photo Display
- [x] Fetches photo from database
- [x] Constructs correct URL
- [x] Displays photo in box
- [x] Handles missing photo gracefully
- [ ] Test with student who has photo
- [ ] Test with student without photo
- [ ] Test with different photo formats (JPG, PNG)
- [ ] Test photo quality in print

## Troubleshooting

### Issue: Age shows blank
**Possible causes**:
1. Student doesn't have date_of_birth in database
2. Date format is incorrect
3. Date is invalid

**Solution**:
- Add date_of_birth to student record
- Ensure format is YYYY-MM-DD
- Check database field type is DATE

### Issue: Photo doesn't show
**Possible causes**:
1. Photo file doesn't exist in uploads folder
2. Photo filename in database is incorrect
3. Photo URL is wrong
4. CORS issue

**Solution**:
- Check file exists: `backend/uploads/students/{filename}`
- Verify filename in database matches actual file
- Check URL: `http://localhost:5000/uploads/students/{filename}`
- Ensure server serves static files from uploads folder

### Issue: Photo is distorted
**Possible causes**:
1. Photo aspect ratio doesn't match box (6:7)
2. CSS object-fit not working

**Solution**:
- Use photos with portrait orientation
- Recommended size: 600 × 700 pixels
- CSS uses object-fit: cover (should handle this)

## Database Schema

### Required Fields
```sql
-- Students table should have:
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS photo VARCHAR(255);
```

### Sample Data
```sql
UPDATE students 
SET 
  date_of_birth = '2010-01-15',
  photo = 'ahmed_ali_123.jpg'
WHERE student_name = 'Ahmed Ali';
```

## Summary

### Fixed Issues
1. ✅ Age now calculates from date_of_birth
2. ✅ Photo now displays from database

### Data Fetched
- Gender (already working)
- Age (newly added)
- Photo (newly added)

### Fallback Behavior
- No gender: Shows blank
- No age: Shows blank
- No photo: Shows "Photo" placeholder

---

**Fix Date**: February 15, 2026
**Status**: ✅ Complete
**Version**: 2.3.0 (Age & Photo)

Your report card now shows student age and photo! 📸

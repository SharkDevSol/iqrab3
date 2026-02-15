# ✅ Ethiopian Calendar Due Dates Added

## What Was Added

The due dates in the Monthly Payments invoice table now show **both Ethiopian and Gregorian calendars**.

### Before
```
Due Date: 1/28/2026
```

### After
```
Due Date: 20/5/2018 (Tir)
          1/28/2026
```

## How It Works

### Ethiopian Calendar Conversion

The system automatically converts Gregorian dates to Ethiopian dates using this logic:

1. **Ethiopian New Year**: Meskerem 1 = September 11 (or 12 in leap years)
2. **Year Difference**: Ethiopian year = Gregorian year - 7 or 8
3. **Month Calculation**: Each Ethiopian month is 30 days (except Pagume which is 5-6 days)

### Example Conversions

| Gregorian Date | Ethiopian Date | Month Name |
|---------------|----------------|------------|
| September 30, 2025 | 20/1/2018 | Meskerem |
| October 30, 2025 | 20/2/2018 | Tikimt |
| November 29, 2025 | 20/3/2018 | Hidar |
| December 29, 2025 | 20/4/2018 | Tahsas |
| January 28, 2026 | 20/5/2018 | Tir |
| February 27, 2026 | 20/6/2018 | Yekatit |

## Where You'll See It

### Monthly Payments - Invoice Table

Go to: **Finance → Monthly Payments → Select Class → Select Student**

The invoice table will show:

```
┌─────────────────────────────────────────────────────────────────┐
│ Month    │ Invoice Number │ Amount │ Paid │ Balance │ Due Date  │
├─────────────────────────────────────────────────────────────────┤
│ Meskerem │ INV-...-M1    │ 1400   │ 0    │ 1450    │ 20/1/2018 │
│          │               │        │      │         │ (Meskerem)│
│          │               │        │      │         │ 9/30/2025 │
├─────────────────────────────────────────────────────────────────┤
│ Tikimt   │ INV-...-M2    │ 1200   │ 0    │ 1250    │ 20/2/2018 │
│          │               │        │      │         │ (Tikimt)  │
│          │               │        │      │         │ 10/30/2025│
├─────────────────────────────────────────────────────────────────┤
│ Tir      │ INV-...-M5    │ 1200   │ 0    │ 1200    │ 20/5/2018 │
│          │               │        │      │         │ (Tir)     │
│          │               │        │      │         │ 1/28/2026 │
└─────────────────────────────────────────────────────────────────┘
```

## Display Format

### Ethiopian Date (Primary)
- Format: `DD/MM/YYYY (Month Name)`
- Example: `20/5/2018 (Tir)`
- Font: Normal size, black color

### Gregorian Date (Secondary)
- Format: `MM/DD/YYYY`
- Example: `1/28/2026`
- Font: Smaller size, gray color
- Position: Below Ethiopian date

## Technical Details

### Function Added
```javascript
// Convert Gregorian date to Ethiopian calendar
const gregorianToEthiopian = (gregorianDate) => {
  // Calculates Ethiopian year, month, and day
  // Returns: { year, month, day }
}

// Format Ethiopian date as string
const formatEthiopianDate = (gregorianDate) => {
  // Returns: "20/5/2018 (Tir)"
}
```

### Files Modified
- `APP/src/PAGE/Finance/MonthlyPaymentsNew.jsx`
  - Added `gregorianToEthiopian()` function
  - Added `formatEthiopianDate()` function
  - Updated due date display in invoice table

## Benefits

1. **Cultural Relevance**: Shows dates in the calendar system used in Ethiopia
2. **Clarity**: Students and staff can see dates in familiar format
3. **Dual Display**: Still shows Gregorian date for reference
4. **Automatic**: No manual conversion needed

## Testing

1. Go to Finance → Monthly Payments
2. Select a class
3. Click on a student
4. Check the "Due Date" column in the invoice table
5. Should see Ethiopian date on top, Gregorian date below

### Expected Results

For Tir month (due January 28, 2026):
- **Ethiopian**: 20/5/2018 (Tir)
- **Gregorian**: 1/28/2026

## Notes

- Ethiopian calendar is approximately 7-8 years behind Gregorian calendar
- Ethiopian New Year is September 11 (or 12 in leap years)
- Each Ethiopian month is 30 days (except Pagume)
- The conversion is automatic and accurate

## Future Enhancements

Could be added later:
- Ethiopian date picker for payment date
- Ethiopian date in payment history
- Ethiopian date in reports
- Option to toggle between calendars

All due dates now show Ethiopian calendar! 🇪🇹

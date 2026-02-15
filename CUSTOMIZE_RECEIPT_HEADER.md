# Customize Receipt Header - Quick Guide

## 📝 What Changed

The receipt now has a professional header with school information that you can customize.

## Current Receipt Header

```
┌─────────────────────────────────────┐
│         SCHOOL NAME                 │
│    School Address Line 1            │
│    City, State, ZIP Code            │
│  Phone: (123) 456-7890              │
│  Email: info@school.com             │
├─────────────────────────────────────┤
│      PAYMENT RECEIPT                │
│      RCP-202602-0001                │
│      [✅ FULLY PAID]                │
└─────────────────────────────────────┘
```

## How to Customize

### Step 1: Open the File

Open: `APP/src/PAGE/Finance/FeePaymentManagement.jsx`

### Step 2: Find the School Header Section

Look for this code (around line 420):

```javascript
{/* School Header */}
<div style={{
  textAlign: 'center',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '2px solid #333'
}}>
  <h1 style={{ 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    margin: '0 0 8px 0',
    color: '#333'
  }}>
    SCHOOL NAME
  </h1>
```

### Step 3: Replace with Your School Info

Change these lines:

```javascript
// Line 1: School Name
SCHOOL NAME
→ YOUR SCHOOL NAME HERE

// Line 2: Address Line 1
School Address Line 1
→ 123 Main Street

// Line 3: City, State, ZIP
City, State, ZIP Code
→ New York, NY 10001

// Line 4: Phone & Email
Phone: (123) 456-7890 | Email: info@school.com
→ Phone: (555) 123-4567 | Email: contact@yourschool.edu
```

### Step 4: Complete Example

Here's a complete example with real school info:

```javascript
{/* School Header */}
<div style={{
  textAlign: 'center',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '2px solid #333'
}}>
  <h1 style={{ 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    margin: '0 0 8px 0',
    color: '#333'
  }}>
    GREENWOOD HIGH SCHOOL
  </h1>
  <p style={{ 
    fontSize: '0.85rem', 
    margin: '4px 0',
    color: '#666'
  }}>
    456 Education Boulevard
  </p>
  <p style={{ 
    fontSize: '0.85rem', 
    margin: '4px 0',
    color: '#666'
  }}>
    Springfield, IL 62701
  </p>
  <p style={{ 
    fontSize: '0.85rem', 
    margin: '4px 0',
    color: '#666'
  }}>
    Phone: (217) 555-1234 | Email: admin@greenwood.edu
  </p>
</div>
```

## Example Receipts

### Example 1: Simple School

```
┌─────────────────────────────────────┐
│      RIVERSIDE ACADEMY              │
│      789 River Road                 │
│      Portland, OR 97201             │
│      Phone: (503) 555-9876          │
│      Email: info@riverside.edu      │
└─────────────────────────────────────┘
```

### Example 2: School with Motto

```
┌─────────────────────────────────────┐
│   ST. MARY'S CATHOLIC SCHOOL        │
│   "Excellence in Education"         │
│   321 Church Street                 │
│   Boston, MA 02101                  │
│   Phone: (617) 555-4321             │
│   Email: office@stmarys.edu         │
└─────────────────────────────────────┘
```

### Example 3: International School

```
┌─────────────────────────────────────┐
│  INTERNATIONAL SCHOOL OF LONDON     │
│  123 Oxford Street                  │
│  London, UK W1D 2HG                 │
│  Phone: +44 20 1234 5678            │
│  Email: admissions@isl.ac.uk        │
└─────────────────────────────────────┘
```

## Optional: Add School Logo

If you want to add a logo, add this code before the school name:

```javascript
<img 
  src="/path/to/your/logo.png" 
  alt="School Logo"
  style={{
    width: '60px',
    height: '60px',
    marginBottom: '10px'
  }}
/>
```

Complete example with logo:

```javascript
{/* School Header */}
<div style={{
  textAlign: 'center',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '2px solid #333'
}}>
  <img 
    src="/uploads/branding/school-logo.png" 
    alt="School Logo"
    style={{
      width: '60px',
      height: '60px',
      marginBottom: '10px',
      display: 'block',
      margin: '0 auto 10px auto'
    }}
  />
  <h1 style={{ 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    margin: '0 0 8px 0',
    color: '#333'
  }}>
    YOUR SCHOOL NAME
  </h1>
  {/* ... rest of the header ... */}
</div>
```

## Optional: Add Website

Add a website line:

```javascript
<p style={{ 
  fontSize: '0.85rem', 
  margin: '4px 0',
  color: '#666'
}}>
  Website: www.yourschool.edu
</p>
```

## Optional: Add Registration Number

For schools that need to show registration:

```javascript
<p style={{ 
  fontSize: '0.75rem', 
  margin: '8px 0 0 0',
  color: '#999'
}}>
  Registration No: 12345678 | Tax ID: 98-7654321
</p>
```

## Full Customization Example

Here's a complete, fully customized header:

```javascript
{/* School Header */}
<div style={{
  textAlign: 'center',
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '2px solid #333'
}}>
  <img 
    src="/uploads/branding/school-logo.png" 
    alt="School Logo"
    style={{
      width: '60px',
      height: '60px',
      display: 'block',
      margin: '0 auto 10px auto'
    }}
  />
  <h1 style={{ 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    margin: '0 0 4px 0',
    color: '#333'
  }}>
    EXCELLENCE INTERNATIONAL SCHOOL
  </h1>
  <p style={{ 
    fontSize: '0.8rem', 
    margin: '4px 0',
    color: '#667eea',
    fontStyle: 'italic'
  }}>
    "Inspiring Excellence, Building Future"
  </p>
  <p style={{ 
    fontSize: '0.85rem', 
    margin: '6px 0 4px 0',
    color: '#666'
  }}>
    123 Education Avenue, Building A
  </p>
  <p style={{ 
    fontSize: '0.85rem', 
    margin: '4px 0',
    color: '#666'
  }}>
    New York, NY 10001, United States
  </p>
  <p style={{ 
    fontSize: '0.85rem', 
    margin: '4px 0',
    color: '#666'
  }}>
    Phone: +1 (212) 555-1234 | Fax: +1 (212) 555-1235
  </p>
  <p style={{ 
    fontSize: '0.85rem', 
    margin: '4px 0',
    color: '#666'
  }}>
    Email: finance@excellence.edu | Web: www.excellence.edu
  </p>
  <p style={{ 
    fontSize: '0.75rem', 
    margin: '8px 0 0 0',
    color: '#999'
  }}>
    School Registration No: EDU-2024-12345 | Tax ID: 98-7654321
  </p>
</div>
```

## After Customization

1. Save the file
2. Refresh your browser (Ctrl+R or Cmd+R)
3. Open any payment details
4. Click "Print Receipt"
5. Your custom header will appear!

## Tips

1. **Keep it concise**: A6 paper is small, don't add too much info
2. **Test print**: Always test print after changes
3. **Font sizes**: Don't make text too small (minimum 0.75rem)
4. **Logo size**: Keep logo around 60px for A6 receipts
5. **Colors**: Use dark colors (#333, #666) for better printing

## Common Customizations

### Remove Email
Just delete or comment out the email line:

```javascript
// <p style={{ ... }}>
//   Email: info@school.com
// </p>
```

### Add Multiple Phone Numbers

```javascript
<p style={{ 
  fontSize: '0.85rem', 
  margin: '4px 0',
  color: '#666'
}}>
  Phone: (555) 123-4567 | Mobile: (555) 987-6543
</p>
```

### Add Social Media

```javascript
<p style={{ 
  fontSize: '0.8rem', 
  margin: '4px 0',
  color: '#666'
}}>
  Facebook: @YourSchool | Twitter: @YourSchool
</p>
```

## Status: ✅ Ready to Customize

The receipt header is now fully customizable. Just edit the text and save!

## File Location

**File to edit**: `APP/src/PAGE/Finance/FeePaymentManagement.jsx`
**Section**: Look for `{/* School Header */}` (around line 420)
**Time needed**: 2-3 minutes

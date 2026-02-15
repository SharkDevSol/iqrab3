# 📍 Where to Find: Staff-Specific Time Settings

## 🗺️ Navigation Path

```
Home Page
  └─> HR Module
      └─> Attendance Section
          └─> Time Settings
              └─> Scroll Down
                  └─> Staff-Specific Time Settings Section
```

---

## 📸 Visual Guide

### Step 1: Go to HR Module

From the home page, click on the **HR** module card or menu item.

---

### Step 2: Navigate to Attendance

In the HR module, look for the **Attendance** section or menu.

---

### Step 3: Open Time Settings

Click on **"Time Settings"** or **"Attendance Time Settings"**.

You should see a page with:
- Header: **"⏰ Attendance Time Settings"**
- Subtitle: **"Configure standard work hours and attendance rules"**

---

### Step 4: Scroll Down

Scroll down past the **Global Work Time Configuration** section.

You'll see two columns:
- **Left**: Global settings form
- **Right**: Current rules and examples

---

### Step 5: Find Staff-Specific Section

Below the global settings, you'll see a new section:

```
┌─────────────────────────────────────────────────────────┐
│  👤 Staff-Specific Time Settings                        │
│  Configure custom work hours for individual staff       │
│                                    [➕ Add Staff-Specific Time] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Empty state or table with staff-specific times]       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 What You'll See

### If No Data (Empty State):

```
┌─────────────────────────────────────────────────────────┐
│                          👤                              │
│                                                          │
│         No staff-specific times configured               │
│                                                          │
│  Click "Add Staff-Specific Time" to set custom hours    │
│         for individual staff                             │
└─────────────────────────────────────────────────────────┘
```

### If Data Exists (Table):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Staff Name │ Type    │ Check-In │ Late After │ Check-Out │ Min Hours │ ... │
├────────────┼─────────┼──────────┼────────────┼───────────┼───────────┼─────┤
│ Chaltu     │ Teachers│  09:00   │   09:30    │   15:00   │    6h     │ ... │
│ John Doe   │ Support │  20:00   │   20:15    │   04:00   │    8h     │ ... │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Visual Elements

### Header Section:
- **Title**: "👤 Staff-Specific Time Settings"
- **Subtitle**: "Configure custom work hours for individual staff members (overrides global settings)"
- **Button**: Green button with "➕ Add Staff-Specific Time"

### Empty State:
- **Icon**: Large 👤 emoji
- **Message**: "No staff-specific times configured"
- **Instruction**: "Click 'Add Staff-Specific Time' to set custom hours for individual staff"
- **Background**: Light gray (#f8f9fa)

### Table (when data exists):
- **Columns**: 9 columns with headers
- **Badges**: Color-coded time badges
  - Green: Check-in time
  - Orange: Late threshold
  - Pink: Check-out time
  - Blue: Staff type
- **Actions**: Red delete button (🗑️ Delete)

### Modal (when adding):
- **Title**: "👤 Add Staff-Specific Time"
- **Fields**: Staff dropdown, time inputs, numeric inputs, notes
- **Buttons**: Gray "Cancel" and green "💾 Save Staff-Specific Time"

---

## 🎨 Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Check-in badge | Green (#e8f5e9, text #2e7d32) | Arrival time |
| Late threshold badge | Orange (#fff3e0, text #e65100) | Late cutoff |
| Check-out badge | Pink (#fce4ec, text #c2185b) | Departure time |
| Staff type badge | Blue (#e3f2fd) | Staff category |
| Add button | Green (#4CAF50) | Primary action |
| Delete button | Red (#f44336) | Destructive action |
| Cancel button | Gray (#e0e0e0) | Secondary action |

---

## 📱 Responsive Behavior

### Desktop (> 1024px):
- Table shows all columns
- Modal is centered with max-width 600px
- Two-column layout for global settings

### Tablet (768px - 1024px):
- Table scrolls horizontally
- Modal is centered with 90% width
- Two-column layout maintained

### Mobile (< 768px):
- Table scrolls horizontally
- Modal is full-width with padding
- Single-column layout for global settings

---

## 🔔 What to Look For

### Success Indicators:
- ✅ Section appears below global settings
- ✅ "Add Staff-Specific Time" button is visible
- ✅ Empty state shows if no data
- ✅ Table shows if data exists
- ✅ Color-coded badges are visible
- ✅ Delete buttons are present

### If Not Visible:
- ❌ Check if you're on the correct page (Time Settings)
- ❌ Try scrolling down (it's below global settings)
- ❌ Refresh the page
- ❌ Check browser console for errors
- ❌ Verify backend is running

---

## 🎯 Quick Access Checklist

- [ ] Navigate to HR Module
- [ ] Click on Attendance section
- [ ] Open Time Settings page
- [ ] Scroll down past global settings
- [ ] Look for "👤 Staff-Specific Time Settings" header
- [ ] See "➕ Add Staff-Specific Time" button
- [ ] Verify empty state or table is visible

---

## 💡 Tips

1. **Can't find it?**
   - Make sure you're on the **Time Settings** page, not the main Attendance page
   - The section is **below** the global settings, so scroll down

2. **Button not working?**
   - Check browser console for errors
   - Verify backend server is running
   - Try refreshing the page

3. **Table not showing?**
   - If no data exists, you'll see the empty state instead
   - Click "Add Staff-Specific Time" to add your first entry

4. **Modal not opening?**
   - Check browser console for errors
   - Verify staff data exists in the database
   - Try clicking the button again

---

## 🎉 You Found It!

Once you see the **"👤 Staff-Specific Time Settings"** section with the green **"➕ Add Staff-Specific Time"** button, you're in the right place!

**Next Steps**:
1. Click the "Add" button to open the modal
2. Select a staff member from the dropdown
3. Configure their custom work hours
4. Save and see the entry appear in the table

**Happy configuring!** 🎊

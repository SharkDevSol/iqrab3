# View Deactivated Staff Feature ✅

## Overview
Added a toggle button to view and manage deactivated staff members. Deactivated staff are hidden from normal operations but can be viewed and reactivated through a dedicated view.

## New Features

### 1. Toggle Button
A new button in the staff list page allows switching between:
- **Active Staff View** (default) - Shows only active staff
- **Deactivated Staff View** - Shows only deactivated staff

**Button Location:** Top right of the controls section, next to the Refresh button

**Button States:**
- Gray when showing active staff: "Show Deactivated Staff"
- Red when showing deactivated staff: "Show Active Staff"

### 2. Visual Indicators for Deactivated Staff

When viewing deactivated staff, they appear with:
- **Red "Deactivated" badge** on card header
- **Grayed out appearance** (reduced opacity)
- **Red overlay icon** on profile image in table view
- **"(Deactivated)" label** next to name in table view

### 3. Reactivation Feature

When viewing deactivated staff:
- The action button changes from red (deactivate) to green (activate)
- Icon changes from FiUserX to FiUserCheck
- Clicking activates the staff member
- Confirmation dialog explains they will be visible in all system lists again

## How to Use

### View Deactivated Staff
1. Go to Staff List page
2. Click the "Show Deactivated Staff" button (gray button with FiUserX icon)
3. The page refreshes to show only deactivated staff
4. Header changes to "Deactivated Staff"
5. All deactivated staff appear with visual indicators

### Reactivate Staff
1. While viewing deactivated staff, find the staff member
2. Click the green activate button (FiUserCheck icon)
3. Confirm the activation
4. Staff member is reactivated and will appear in all system lists
5. Page refreshes to show updated list

### Return to Active Staff View
1. Click the "Show Active Staff" button (red button when viewing deactivated)
2. Page returns to normal active staff view

## Backend Changes

### Updated Endpoint: GET /api/staff/data/:staffType/:className

Added query parameter `includeInactive`:
- **No parameter** (default): Returns only active staff (`is_active = TRUE OR NULL`)
- **`includeInactive=true`**: Returns all staff (active and inactive)
- **`includeInactive=only`**: Returns only inactive staff (`is_active = FALSE`)

**Example Usage:**
```javascript
// Get only active staff (default)
GET /api/staff/data/Teachers/teachers

// Get only deactivated staff
GET /api/staff/data/Teachers/teachers?includeInactive=only

// Get all staff (active and inactive)
GET /api/staff/data/Teachers/teachers?includeInactive=true
```

## Frontend Changes

### State Management
Added `showInactive` state to toggle between views:
```javascript
const [showInactive, setShowInactive] = useState(false);
```

### Fetch Logic
Updated `fetchAllStaff()` to include query parameter based on `showInactive`:
```javascript
const includeInactiveParam = showInactive ? '?includeInactive=only' : '';
```

### Toggle Function
Updated `handleToggleActive()` to support both deactivation and reactivation:
- Checks if staff is currently active or inactive
- Shows appropriate confirmation message
- Sends correct `is_active` value to backend

### Visual Updates
- Header title changes based on view
- Staff cards show deactivated badge when viewing inactive staff
- Action buttons change color and icon based on staff status

## CSS Styling

### Toggle Button
```css
.toggleInactiveBtn - Gray button for normal state
.toggleInactiveBtn.active - Red button when viewing deactivated staff
```

### Inactive Staff Indicators
- `.inactiveCard` - Grayed out card
- `.inactiveBadge` - Red badge with "Deactivated" text
- `.inactiveRow` - Grayed out table row
- `.inactiveLabel` - Red "(Deactivated)" text
- `.inactiveOverlay` - Red icon overlay on images

### Action Buttons
- `.deactivateBtn` - Red button for deactivation
- `.activateBtn` - Green button for activation

## User Experience Flow

### Normal Operation (Active Staff)
1. User sees only active staff by default
2. Can deactivate staff using red button
3. Deactivated staff immediately disappear from view
4. Staff are hidden from all system operations

### Viewing Deactivated Staff
1. User clicks "Show Deactivated Staff" button
2. Page shows only deactivated staff with visual indicators
3. User can reactivate staff using green button
4. Reactivated staff immediately disappear from deactivated view
5. Staff become visible in all system operations again

## Benefits

✅ **Easy Access** - One-click toggle to view deactivated staff
✅ **Clear Visual Distinction** - Deactivated staff clearly marked
✅ **Simple Reactivation** - Can reactivate staff if they return
✅ **Data Preservation** - All historical data remains intact
✅ **Clean Separation** - Active and inactive staff never mixed in normal operations
✅ **Audit Trail** - Can review deactivated staff anytime

## Testing Checklist

- [ ] Click "Show Deactivated Staff" button
- [ ] Verify only deactivated staff appear
- [ ] Verify deactivated badge shows on cards
- [ ] Verify grayed out appearance
- [ ] Click activate button on a deactivated staff
- [ ] Verify staff is reactivated
- [ ] Verify staff disappears from deactivated view
- [ ] Click "Show Active Staff" button
- [ ] Verify reactivated staff now appears in active view
- [ ] Verify staff appears in attendance, salary, etc.

## API Examples

### Get Active Staff (Default)
```bash
curl http://localhost:5000/api/staff/data/Teachers/teachers
```

### Get Deactivated Staff Only
```bash
curl http://localhost:5000/api/staff/data/Teachers/teachers?includeInactive=only
```

### Get All Staff (Active + Inactive)
```bash
curl http://localhost:5000/api/staff/data/Teachers/teachers?includeInactive=true
```

### Deactivate Staff
```bash
curl -X PUT http://localhost:5000/api/staff/toggle-active/123 \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

### Reactivate Staff
```bash
curl -X PUT http://localhost:5000/api/staff/toggle-active/123 \
  -H "Content-Type: application/json" \
  -d '{"is_active": true}'
```

## Important Notes

1. **Default View**: Always shows active staff by default
2. **Separate Views**: Active and deactivated staff are never shown together
3. **System Operations**: Only active staff appear in attendance, salary, etc.
4. **Reactivation**: Can only be done from the deactivated staff view
5. **Data Integrity**: All data is preserved regardless of active status

---

**Status:** ✅ Complete and Ready for Testing
**Date:** February 14, 2026
**Feature:** View and manage deactivated staff with easy reactivation

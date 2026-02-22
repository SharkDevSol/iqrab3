# 🔔 Guardian Notifications - Exact Location

## Where to Find It

The Notifications tab is in the **Guardian Mobile App**, NOT the admin panel.

### URL Path:
```
http://localhost:5173/guardian/notifications
```

### Full Access Path:
1. Go to: `http://localhost:5173/app/guardian-login`
2. Login with guardian credentials
3. You'll see the Guardian Portal
4. Click the **🔔 Notifications** tab

## Navigation Bar Location

### Desktop View:
```
┌────────────────────────────────────────────────────────┐
│ 👤 Guardian Portal                    🔍 🔔 ☰         │
├────────────────────────────────────────────────────────┤
│ Home | My Wards | Attendance | Marks | Notifications  │
│                                          ↑             │
│                                       HERE!            │
└────────────────────────────────────────────────────────┘
```

### Mobile Bottom Navigation:
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│              Page Content Here                         │
│                                                        │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  🏠     👥      📅      📝      🔔      💬      👤    │
│ Home  Wards   Attend  Marks   Bell   Messages Profile │
│                                ↑                       │
│                             HERE!                      │
└────────────────────────────────────────────────────────┘
```

## Tab Order

The Notifications tab is the **5th tab** in the navigation:

1. 🏠 Home
2. 👥 My Wards
3. 📅 Attendance
4. 📝 Marks
5. **🔔 Notifications** ← NEW!
6. 💬 Messages
7. 👤 Profile

## Visual Indicators

### Icon
- **Bell icon (🔔)** in all navigation areas
- Purple/blue color when active
- Gray when inactive

### Active State
- Tab highlighted when on notifications page
- Underline or background color
- Icon color changes to primary color

## Quick Test

### Method 1: Direct URL
```
http://localhost:5173/guardian/notifications
```

### Method 2: Login Flow
1. `http://localhost:5173/app/guardian-login`
2. Enter guardian username/password
3. Click "Notifications" in navigation

### Method 3: From Guardian Home
1. Already logged in as guardian
2. Look at top navigation bar
3. Click "Notifications" (5th item)

## What You'll See

When you click the Notifications tab, you'll see:

```
┌────────────────────────────────────────────────────────┐
│ 🔔 Notifications              Mark all as read         │
│ 2 unread notifications                                 │
├────────────────────────────────────────────────────────┤
│ [🔔 All] [📅 Attendance] [💰 Payments]                │
├────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐  │
│ │ 📅  Daily Attendance Report              • unread│  │
│ │     Your ward Ahmed was present today...         │  │
│ │     🕐 2 hours ago                               │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ ┌──────────────────────────────────────────────────┐  │
│ │ 💰  Monthly Payment Summary              • unread│  │
│ │     Payment of ETB 2,500 received...             │  │
│ │     🕐 1 day ago                                  │  │
│ └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Not in Admin Panel!

❌ **NOT HERE**: `http://localhost:5173/` (Admin panel)
❌ **NOT HERE**: `http://localhost:5173/guardian-notifications` (Admin route)

✅ **YES HERE**: `http://localhost:5173/guardian/notifications` (Guardian app)
✅ **YES HERE**: After guardian login → Notifications tab

## Difference Between Two Notification Pages

### 1. Admin Panel Notifications (for admins)
- **URL**: `/guardian-notifications`
- **Purpose**: Manage and send notifications
- **Features**: Test emails, preview, manual triggers
- **Users**: Admin only

### 2. Guardian App Notifications (for parents)
- **URL**: `/guardian/notifications`
- **Purpose**: View received notifications
- **Features**: Read notifications, filter, mark as read
- **Users**: Guardians/parents

## Summary

**Location**: Guardian Mobile App
**Tab Name**: Notifications
**Icon**: 🔔 Bell
**Position**: 5th tab (between Marks and Messages)
**URL**: `http://localhost:5173/guardian/notifications`
**Access**: Login as guardian first

---

**Quick Access**: 
1. Login as guardian
2. Click bell icon (🔔)
3. Done!

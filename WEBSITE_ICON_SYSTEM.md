# Website Icon System - Complete Guide

## Overview
The system allows you to upload a custom website icon (favicon) that will be displayed in the browser tab, bookmarks, and when the app is installed as a PWA. If no custom icon is uploaded, the default Skoolific icon is automatically displayed.

## Features

### 1. Custom Icon Upload
- Upload your school's logo/icon through the Settings page
- Supported formats: PNG, JPG, JPEG, GIF
- Maximum file size: 5MB
- Icon is stored in the database and file system

### 2. Automatic Fallback
- If no custom icon is uploaded → Skoolific icon is displayed
- If database connection fails → Skoolific icon is displayed
- If icon file is deleted → Skoolific icon is displayed

### 3. Dynamic Updates
- Icon updates immediately after upload (no page refresh needed)
- Updates all icon references:
  - Browser favicon (tab icon)
  - Apple touch icon (iOS home screen)
  - PWA manifest icons (installed app icon)

## How to Upload a Custom Icon

### Step 1: Access Settings
1. Log in as admin
2. Navigate to Settings page
3. Click on the "Branding" tab

### Step 2: Upload Icon
1. Find the "Website Icon (Favicon)" section
2. Click "Upload Icon" button
3. Select your icon file (PNG recommended, 192x192px or larger)
4. Wait for upload confirmation

### Step 3: Verify
- Check browser tab - your icon should appear immediately
- For PWA: Reinstall the app to see the new icon

## Technical Details

### Backend (Database)
- Table: `branding_settings`
- Column: `website_icon` (VARCHAR 255)
- Storage: `/backend/uploads/branding/`
- API Endpoint: `POST /api/admin/branding/icon`

### Frontend Implementation

#### 1. AppContext.jsx
- Loads icon on app startup
- Updates favicon and manifest dynamically
- Handles fallback to Skoolific icon

#### 2. Settings.jsx
- Provides upload interface
- Handles file upload to server
- Updates browser icons immediately

#### 3. Icon Update Flow
```
User uploads icon
    ↓
File saved to server
    ↓
Database updated with filename
    ↓
Frontend receives icon URL
    ↓
Updates:
  - <link rel="icon"> (favicon)
  - <link rel="apple-touch-icon"> (iOS)
  - manifest.json (PWA)
```

### Files Modified
1. `APP/src/context/AppContext.jsx` - Added icon loading and fallback logic
2. `APP/src/PAGE/Setting/Setting.jsx` - Enhanced icon upload with manifest updates
3. `backend/routes/adminRoutes.js` - Already had icon upload endpoint

## Default Icon Location
- Path: `/APP/public/skoolific-icon.png`
- This is the fallback icon used when no custom icon is uploaded

## For Developers

### Adding Icon Support to New Pages
```javascript
// Load icon from database
const response = await api.get('/admin/branding');
const iconUrl = response.data.website_icon 
  ? `http://localhost:5000/uploads/branding/${response.data.website_icon}`
  : '/skoolific-icon.png';

// Update favicon
const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = iconUrl;
document.getElementsByTagName('head')[0].appendChild(link);
```

### Testing
1. Test with custom icon uploaded
2. Test with no icon (should show Skoolific)
3. Test with database offline (should show Skoolific)
4. Test PWA installation with custom icon
5. Test icon change (upload new icon)

## Troubleshooting

### Icon not showing after upload
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+F5)
- Check browser console for errors

### PWA not showing new icon
- Uninstall the PWA
- Clear browser cache
- Reinstall the PWA

### Icon file missing
- Check `/backend/uploads/branding/` directory
- Verify file permissions
- Check database `website_icon` column value

## Security
- File type validation (only images allowed)
- File size limit (5MB max)
- Filename sanitization
- Authentication required for upload
- Old icon files are automatically deleted when new one is uploaded

## Future Enhancements
- [ ] Icon preview before upload
- [ ] Multiple icon sizes generation
- [ ] Icon cropping/resizing tool
- [ ] Icon library/gallery
- [ ] Bulk icon management for multi-tenant systems

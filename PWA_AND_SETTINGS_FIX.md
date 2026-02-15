# PWA and Settings Page Fix Guide

## Issue 1: Settings Page 403 Error (Role Mismatch)

### Problem
You're logged in but the system detects your role as `teacher` instead of `admin`. This causes a 403 error when accessing Settings page because it requires `admin` or `sub-account` role.

### Root Cause
Your JWT authentication token has `role: 'teacher'` stored in it, but you need `role: 'admin'` to access admin features like Settings.

### Solution
**Log out and log back in with admin credentials:**

1. Click the profile dropdown in the top right corner
2. Click "Logout"
3. Log back in using your admin username and password
4. The new JWT token will have the correct `admin` role
5. Settings page will now work properly

### Technical Details
- The error comes from `backend/middleware/auth.js` line 92
- The `/api/admin/branding` PUT endpoint requires `authorizeRoles('admin', 'sub-account')`
- Your current token has the wrong role, so it's being rejected

---

## Issue 2: PWA Installation Warnings

### Problems Fixed
1. ✅ Deprecated meta tag `apple-mobile-web-app-capable` - Already removed from index.html
2. ✅ Missing icon files (icon-192.png, icon-512.png) - Updated manifest to use existing vite.svg

### Changes Made
- Updated `APP/public/manifest.json` to use `/vite.svg` instead of missing `/icon.svg`
- Removed duplicate `apple-mobile-web-app-capable` meta tag from `APP/index.html`
- Updated all icon references in shortcuts to use `/vite.svg`

### PWA Installation Status
The PWA should now be installable without errors. To test:

1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Check "Manifest" section - should show no errors
4. Check "Service Workers" section - should show registered worker
5. Look for install prompt or use Chrome menu > "Install app"

### Note About localhost
PWA install prompts work on localhost, but for production you'll need:
- HTTPS connection
- Valid SSL certificate
- Proper domain name

### Creating Custom Icons (Optional)
If you want custom PNG icons instead of the SVG:

1. Create two PNG files:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

2. Place them in `APP/public/` folder

3. Update `APP/public/manifest.json`:
```json
"icons": [
  {
    "src": "/icon-192.png",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any"
  },
  {
    "src": "/icon-512.png",
    "sizes": "512x512",
    "type": "image/png",
    "purpose": "any maskable"
  }
]
```

---

## Summary

### Immediate Actions Required
1. **Log out and log back in** to fix the Settings page 403 error
2. **Refresh the browser** to load the updated PWA manifest

### What Was Fixed
- PWA manifest now uses existing vite.svg icon (no more 404 errors)
- Removed deprecated meta tags
- Settings page will work once you log in with admin credentials

### Files Modified
- `APP/public/manifest.json` - Updated icon references
- `APP/index.html` - Removed deprecated meta tag
- `PWA_AND_SETTINGS_FIX.md` - This guide

---

## Testing Checklist

### Settings Page
- [ ] Log out from current session
- [ ] Log back in with admin credentials
- [ ] Navigate to Settings page
- [ ] Verify no 403 errors
- [ ] Test saving branding settings

### PWA
- [ ] Open DevTools > Application > Manifest (no errors)
- [ ] Check Service Worker is registered
- [ ] Look for install prompt
- [ ] Test offline functionality (optional)

---

## Need Help?

If you still see errors after following these steps:

1. **For Settings 403 Error:**
   - Check browser console for the exact error message
   - Verify you're using admin credentials, not teacher credentials
   - Check `localStorage` in DevTools > Application > Local Storage
   - Look for `authToken` and decode it at jwt.io to see the role

2. **For PWA Issues:**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Unregister old service workers (DevTools > Application > Service Workers)
   - Hard refresh (Ctrl+Shift+R)
   - Check console for any remaining errors

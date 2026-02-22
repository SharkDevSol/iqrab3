# Mobile App Setup Guide for Skoolific

Your Skoolific app is already configured as a Progressive Web App (PWA)! Here's how to use it on mobile devices:

## 📱 How to Install on Mobile

### For Android Users:

1. **Open Chrome Browser** on your Android phone
2. **Navigate to your app URL** (e.g., http://your-server-ip:5173 or your domain)
3. **Tap the menu (3 dots)** in the top right corner
4. **Select "Add to Home Screen"** or "Install App"
5. **Confirm** the installation
6. The app icon will appear on your home screen like a native app!

### For iPhone/iPad Users:

1. **Open Safari Browser** (must use Safari, not Chrome)
2. **Navigate to your app URL**
3. **Tap the Share button** (square with arrow pointing up)
4. **Scroll down and tap "Add to Home Screen"**
5. **Name it** (e.g., "Skoolific Student" or "Skoolific Staff")
6. **Tap "Add"**
7. The app icon will appear on your home screen!

## 🚀 Current PWA Features

✅ Works offline (basic caching)
✅ Installable on home screen
✅ Full-screen experience (no browser UI)
✅ Fast loading
✅ Responsive design for mobile

## 🔧 For Production Deployment

### 1. Enable Service Worker (Currently Disabled)

Edit `APP/index.html` and uncomment the service worker registration code (around line 30-40).

### 2. Deploy to HTTPS

PWA requires HTTPS in production. Options:
- Use a hosting service (Vercel, Netlify, Render)
- Set up SSL certificate on your server (Let's Encrypt)

### 3. Update Backend URL

Make sure your mobile app can reach your backend:
- Use your server's public IP or domain
- Update API URLs in your React app
- Enable CORS on backend for your domain

## 📦 Alternative: Build Native Apps (Advanced)

If you want true native apps for App Store/Play Store:

### Option A: React Native (Recommended)
- Reuse your React code
- Build for iOS and Android
- Better performance and native features

### Option B: Capacitor (Easiest)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Build and sync
npm run build
npx cap sync
npx cap open android
npx cap open ios
```

### Option C: Cordova
Similar to Capacitor but older technology.

## 🎯 Recommended Approach

**For Now:** Use PWA (already set up!)
- No app store approval needed
- Instant updates
- Works on all devices
- Free to deploy

**For Future:** Consider React Native or Capacitor
- Better performance
- Access to native features (camera, notifications, etc.)
- App store presence
- Offline capabilities

## 📝 Testing Your Mobile App

1. **Start your development server:**
   ```bash
   cd APP
   npm run dev
   ```

2. **Find your local IP address:**
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`

3. **Access from mobile:**
   - Connect phone to same WiFi
   - Open browser on phone
   - Go to: `http://YOUR-IP:5173`
   - Example: `http://192.168.1.100:5173`

4. **Install the PWA** using steps above

## 🔐 Important Notes

- Backend must be accessible from mobile (same network or public IP)
- Update CORS settings in backend to allow mobile access
- For production, use HTTPS and a proper domain
- Test all features (login, navigation, data loading) on mobile

## 🆘 Troubleshooting

**Can't access from phone:**
- Check if phone and computer are on same WiFi
- Check firewall settings on your computer
- Try using your computer's IP address instead of localhost

**Install button doesn't appear:**
- Make sure you're using HTTPS (or localhost for testing)
- Check browser console for PWA errors
- Verify manifest.json is loading correctly

**App doesn't work offline:**
- Service worker is currently disabled
- Enable it in index.html for offline support

## 📞 Need Help?

Your app is ready to use as a mobile web app right now! Just access it from your phone's browser and add it to your home screen.

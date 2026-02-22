# Build Desktop Applications Guide - Skoolific

## 🎯 Overview

This guide shows you how to create downloadable desktop installers (.exe, .dmg, .AppImage) for the Skoolific Admin app using Electron.

## 📦 What You'll Create

- **Windows**: `skoolific-admin-windows.exe` (Installer)
- **macOS**: `skoolific-admin-mac.dmg` (Disk Image)
- **Linux**: `skoolific-admin-linux.AppImage` (Portable App)

---

## 🚀 Quick Start (Easiest Method)

### Option 1: Use Electron Forge (Recommended)

```bash
# 1. Install Electron Forge globally
npm install -g @electron-forge/cli

# 2. Create new Electron app
cd ..
npx create-electron-app skoolific-desktop

# 3. Navigate to the project
cd skoolific-desktop

# 4. Install dependencies
npm install
```

---

## 📝 Step-by-Step Setup

### Step 1: Create Electron Project Structure

```bash
mkdir skoolific-desktop
cd skoolific-desktop
npm init -y
```

### Step 2: Install Electron and Builder

```bash
npm install electron electron-builder --save-dev
```

### Step 3: Create Main Process File

Create `main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load your Skoolific web app
  // For production, use your VPS URL
  mainWindow.loadURL('http://localhost:5173');
  
  // Or load from local build
  // mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

### Step 4: Update package.json

```json
{
  "name": "skoolific-admin",
  "version": "1.0.0",
  "description": "Skoolific School Management System",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.skoolific.admin",
    "productName": "Skoolific Admin",
    "directories": {
      "output": "dist"
    },
    "win": {
      "target": "nsis",
      "icon": "icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "icon.png",
      "category": "Education"
    }
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.1"
  }
}
```

### Step 5: Add App Icon

1. Create icons for each platform:
   - **Windows**: `icon.ico` (256x256)
   - **macOS**: `icon.icns` (512x512)
   - **Linux**: `icon.png` (512x512)

2. Use online converter: https://www.icoconverter.com/

3. Place icons in project root

### Step 6: Build for All Platforms

```bash
# Build for Windows
npm run build:win

# Build for macOS (requires Mac)
npm run build:mac

# Build for Linux
npm run build:linux

# Or build for all
npm run build
```

### Step 7: Copy Built Files

After building, copy the installers:

```bash
# Windows
copy dist\Skoolific-Admin-Setup-1.0.0.exe ..\SCHOOLS\APP\public\downloads\skoolific-admin-windows.exe

# macOS
copy dist\Skoolific-Admin-1.0.0.dmg ..\SCHOOLS\APP\public\downloads\skoolific-admin-mac.dmg

# Linux
copy dist\Skoolific-Admin-1.0.0.AppImage ..\SCHOOLS\APP\public\downloads\skoolific-admin-linux.AppImage
```

---

## 🎨 Advanced Configuration

### Add Auto-Update

Install electron-updater:

```bash
npm install electron-updater
```

Update `main.js`:

```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});
```

### Add Menu Bar

```javascript
const { Menu } = require('electron');

const template = [
  {
    label: 'File',
    submenu: [
      { role: 'quit' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

### Add System Tray

```javascript
const { Tray } = require('electron');

let tray = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.setToolTip('Skoolific Admin');
  tray.on('click', () => {
    mainWindow.show();
  });
});
```

---

## 🔧 Alternative: Use Tauri (Smaller Size)

Tauri creates smaller desktop apps (5-10 MB vs Electron's 50-100 MB).

### Install Tauri:

```bash
npm install -g @tauri-apps/cli
npm install @tauri-apps/api
```

### Initialize Tauri:

```bash
npm run tauri init
```

### Build:

```bash
npm run tauri build
```

---

## 📦 Alternative: Use Neutralino (Lightest)

Neutralino creates the smallest apps (2-5 MB).

### Install:

```bash
npm install -g @neutralinojs/neu
```

### Create Project:

```bash
neu create skoolific-desktop
cd skoolific-desktop
```

### Build:

```bash
neu build
```

---

## 🎯 Recommended Approach

### For Beginners: Use PWA Builder

1. Go to https://www.pwabuilder.com/
2. Enter your website URL
3. Click "Build My PWA"
4. Download Windows/Mac/Linux packages
5. No coding required!

### For Advanced: Use Electron

- Full control over app behavior
- Can add native features
- Professional appearance
- Larger file size (50-100 MB)

### For Lightweight: Use Tauri

- Smaller file size (5-10 MB)
- Modern and fast
- Requires Rust installation
- More complex setup

---

## 📋 Build Checklist

- [ ] Install Node.js and npm
- [ ] Create Electron project
- [ ] Configure package.json
- [ ] Add app icons
- [ ] Update main.js with your URL
- [ ] Test locally: `npm start`
- [ ] Build for Windows: `npm run build:win`
- [ ] Build for macOS: `npm run build:mac`
- [ ] Build for Linux: `npm run build:linux`
- [ ] Copy installers to `APP/public/downloads/`
- [ ] Test downloads from Settings → Apps

---

## 🔍 Testing

### Test Locally:

```bash
npm start
```

### Test Built App:

1. Navigate to `dist` folder
2. Run the installer
3. Install the app
4. Launch and test all features

---

## 📊 File Sizes

| Platform | Method | Size |
|----------|--------|------|
| Windows | Electron | ~80 MB |
| Windows | Tauri | ~8 MB |
| Windows | PWA Builder | ~5 MB |
| macOS | Electron | ~100 MB |
| macOS | Tauri | ~10 MB |
| Linux | Electron | ~90 MB |
| Linux | Tauri | ~9 MB |
| Linux | AppImage | ~85 MB |

---

## 🆘 Troubleshooting

### "electron-builder not found"
```bash
npm install electron-builder --save-dev
```

### "Build failed on macOS"
- macOS builds require a Mac computer
- Or use CI/CD services like GitHub Actions

### "Icon not showing"
- Make sure icon files are in correct format
- Windows: .ico
- macOS: .icns
- Linux: .png

### "App won't start"
- Check the URL in main.js
- Make sure your server is running
- Check console for errors

---

## 💡 Pro Tips

1. **Use Your VPS URL**
   - Update `mainWindow.loadURL()` with your VPS URL
   - App will always load latest version
   - No need to rebuild for updates

2. **Bundle the Web App**
   - Copy your built React app to Electron project
   - Load from local files instead of URL
   - Works offline

3. **Code Signing**
   - Sign your apps for Windows/Mac
   - Prevents security warnings
   - Required for macOS notarization

4. **Auto-Update**
   - Implement electron-updater
   - Users get updates automatically
   - No need to download again

5. **Optimize Size**
   - Use Tauri instead of Electron
   - Or use PWA Builder
   - Smaller downloads, faster installs

---

## 🎉 Quick Summary

**Easiest Way:**
1. Use PWA Builder (https://www.pwabuilder.com/)
2. Enter your URL
3. Download packages
4. Done!

**Professional Way:**
1. Create Electron project
2. Configure and build
3. Distribute installers
4. Users install like any app

**Best Way:**
1. Use PWA for now (no build needed)
2. Later, create Electron apps if needed
3. Most users are fine with PWA!

---

Good luck building your desktop apps! 🚀

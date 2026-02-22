# Build Mobile Apps Guide - Skoolific

This guide will help you create downloadable APK files for Android devices.

## 🎯 Quick Overview

We'll use **Capacitor** to convert your React web app into native Android APK files.

## 📋 Prerequisites

1. **Node.js** (already installed)
2. **Android Studio** (for building APKs)
3. **Java JDK 11 or higher**

## 🚀 Step-by-Step Instructions

### Step 1: Install Capacitor

```bash
cd APP
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### Step 2: Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name**: Skoolific
- **App ID**: com.skoolific.app (or your domain in reverse)
- **Web asset directory**: dist

### Step 3: Build Your React App

```bash
npm run build
```

### Step 4: Add Android Platform

```bash
npx cap add android
```

### Step 5: Configure for Multiple Apps

You'll need to create 3 separate builds for Student, Staff, and Guardian apps.

#### Create Configuration Files:

**capacitor.config.student.json:**
```json
{
  "appId": "com.skoolific.student",
  "appName": "Skoolific Student",
  "webDir": "dist",
  "server": {
    "url": "http://YOUR-SERVER-IP:5173",
    "cleartext": true
  },
  "android": {
    "path": "android-student"
  }
}
```

**capacitor.config.staff.json:**
```json
{
  "appId": "com.skoolific.staff",
  "appName": "Skoolific Staff",
  "webDir": "dist",
  "server": {
    "url": "http://YOUR-SERVER-IP:5173",
    "cleartext": true
  },
  "android": {
    "path": "android-staff"
  }
}
```

**capacitor.config.guardian.json:**
```json
{
  "appId": "com.skoolific.guardian",
  "appName": "Skoolific Guardian",
  "webDir": "dist",
  "server": {
    "url": "http://YOUR-SERVER-IP:5173",
    "cleartext": true
  },
  "android": {
    "path": "android-guardian"
  }
}
```

### Step 6: Build Each App

#### For Student App:
```bash
npx cap add android --config capacitor.config.student.json
npx cap sync --config capacitor.config.student.json
npx cap open android --config capacitor.config.student.json
```

#### For Staff App:
```bash
npx cap add android --config capacitor.config.staff.json
npx cap sync --config capacitor.config.staff.json
npx cap open android --config capacitor.config.staff.json
```

#### For Guardian App:
```bash
npx cap add android --config capacitor.config.guardian.json
npx cap sync --config capacitor.config.guardian.json
npx cap open android --config capacitor.config.guardian.json
```

### Step 7: Build APK in Android Studio

1. Android Studio will open automatically
2. Wait for Gradle sync to complete
3. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. Wait for the build to complete
5. Click "locate" to find your APK file

### Step 8: Copy APK Files

Create a downloads folder and copy the APK files:

```bash
mkdir APP\public\downloads
```

Copy the generated APK files:
- `android-student/app/build/outputs/apk/debug/app-debug.apk` → `APP/public/downloads/skoolific-student.apk`
- `android-staff/app/build/outputs/apk/debug/app-debug.apk` → `APP/public/downloads/skoolific-staff.apk`
- `android-guardian/app/build/outputs/apk/debug/app-debug.apk` → `APP/public/downloads/skoolific-guardian.apk`

## 🎨 Customize App Icons

### Create Icons for Each App:

1. Create 3 different icons (512x512 PNG):
   - `student-icon.png` (purple theme)
   - `staff-icon.png` (pink theme)
   - `guardian-icon.png` (green theme)

2. Use online tool: https://icon.kitchen/

3. Replace icons in each Android project:
   - `android-student/app/src/main/res/`
   - `android-staff/app/src/main/res/`
   - `android-guardian/app/src/main/res/`

## 🔐 For Production (Release APK)

### Step 1: Generate Signing Key

```bash
keytool -genkey -v -keystore skoolific-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias skoolific
```

### Step 2: Configure Signing in Android Studio

1. Open `android/app/build.gradle`
2. Add signing configuration:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../skoolific-release-key.jks')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'skoolific'
            keyPassword 'YOUR_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### Step 3: Build Release APK

In Android Studio:
- **Build → Generate Signed Bundle / APK**
- Select **APK**
- Choose your keystore file
- Build release APK

## 📱 Alternative: Easier Method Using PWA Builder

If Android Studio is too complex, use PWA Builder:

1. Go to https://www.pwabuilder.com/
2. Enter your website URL
3. Click "Build My PWA"
4. Download Android package
5. Follow their simple instructions

## 🔄 Quick Update Script

Create `BUILD_APPS.bat`:

```batch
@echo off
echo Building Skoolific Mobile Apps...

cd APP

echo Step 1: Building React app...
call npm run build

echo Step 2: Syncing Student app...
call npx cap sync --config capacitor.config.student.json

echo Step 3: Syncing Staff app...
call npx cap sync --config capacitor.config.staff.json

echo Step 4: Syncing Guardian app...
call npx cap sync --config capacitor.config.guardian.json

echo Done! Now open each project in Android Studio and build APK.
pause
```

## 📝 Important Notes

1. **Server URL**: Update the server URL in config files to your actual server IP or domain
2. **HTTPS**: For production, use HTTPS instead of HTTP
3. **App Store**: To publish on Google Play Store, you need a release APK with proper signing
4. **Updates**: When you update your web app, rebuild and redistribute the APK
5. **File Size**: APK files are typically 10-20 MB

## 🆘 Troubleshooting

**Android Studio not installed?**
- Download from: https://developer.android.com/studio

**Build fails?**
- Make sure Java JDK is installed
- Check Android SDK is properly configured
- Run `npx cap doctor` to diagnose issues

**APK won't install?**
- Enable "Unknown Sources" on Android device
- Make sure APK is not corrupted
- Check Android version compatibility (minimum API 22)

## 🎉 Success!

Once you have the APK files in `APP/public/downloads/`, users can download them directly from the Settings → Apps page!

## 📞 Need Help?

If this seems too complex, consider:
1. Using the PWA method (no APK needed, works in browser)
2. Hiring a developer to set up the build process
3. Using a service like AppGyver or Thunkable for no-code app building

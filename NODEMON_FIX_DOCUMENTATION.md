# Nodemon Constant Restart Fix - PERMANENT SOLUTION

## Problem
Nodemon was restarting the backend server constantly (every second), causing:
- Routes not loading properly
- 404 errors on API calls
- Server instability
- Connection refused errors

## Root Cause
Nodemon was watching ALL files in the backend folder, including:
- Log files that change constantly
- Backup files
- Upload files
- JSON data files
- Database migration files

Every time these files changed, nodemon restarted the server.

## Solution Applied
Created `backend/nodemon.json` configuration file that:

1. **Only watches specific code folders:**
   - `server.js`
   - `routes/**/*.js`
   - `services/**/*.js`
   - `config/**/*.js`
   - `middleware/**/*.js`

2. **Ignores non-code files:**
   - `uploads/**` - User uploaded files
   - `backups/**` - Database backups
   - `logs/**` - Log files
   - `*.log` - Individual log files
   - `*.json` - JSON data files (except package.json)
   - `*.md` - Markdown documentation
   - `*.txt` - Text files
   - `test/**` - Test files
   - `scripts/**` - Utility scripts
   - `prisma/**` - Prisma schema files

3. **Added 2-second delay** before restart to prevent rapid restarts

## Configuration File Location
```
backend/nodemon.json
```

## This Fix is PERMANENT Because:

✅ **File-based configuration** - Stored in `nodemon.json`, not in memory
✅ **Version controlled** - File is committed to Git
✅ **Device independent** - Works on any computer that clones the repo
✅ **Data deletion safe** - Deleting database data won't affect this file
✅ **Survives restarts** - Configuration persists across server restarts
✅ **Team-wide** - All developers get the same configuration

## How to Verify It's Working

1. Start the server with nodemon:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   [nodemon] starting `node server.js`
   ✅ Server running on port 5000
   ```

3. The server should NOT restart unless you:
   - Edit a `.js` file in routes, services, config, or middleware
   - Edit `server.js`

4. The server WILL NOT restart when:
   - Log files change
   - Backups are created
   - Files are uploaded
   - Database data changes
   - JSON files are modified

## If Problem Returns

If nodemon starts restarting constantly again:

### Check 1: Verify nodemon.json exists
```bash
dir backend\nodemon.json
```

If missing, recreate it with the content from this document.

### Check 2: Verify nodemon is using the config
Look for this in the startup logs:
```
[nodemon] reading config backend/nodemon.json
```

### Check 3: Check what's triggering restarts
Run nodemon in verbose mode:
```bash
cd backend
nodemon --verbose server.js
```

This will show which files are causing restarts.

### Check 4: Manually specify ignore patterns
If nodemon.json isn't being read, use command line:
```bash
cd backend
nodemon --ignore uploads/ --ignore backups/ --ignore logs/ --ignore '*.log' --ignore '*.json' --ext js server.js
```

## Backup Configuration

If you ever need to restore the configuration, here's the complete `nodemon.json`:

```json
{
  "watch": [
    "server.js",
    "routes/**/*.js",
    "services/**/*.js",
    "config/**/*.js",
    "middleware/**/*.js"
  ],
  "ignore": [
    "node_modules/**",
    "uploads/**",
    "backups/**",
    "logs/**",
    "*.log",
    "*.json",
    "*.md",
    "*.txt",
    "test/**",
    "scripts/**",
    ".git/**",
    "prisma/**"
  ],
  "ext": "js",
  "delay": 2000,
  "verbose": false,
  "env": {
    "NODE_ENV": "development"
  }
}
```

## Alternative: Use Regular Node (No Auto-Restart)

If you prefer no auto-restart at all:
```bash
cd backend
npm start
```

This uses `node server.js` directly without nodemon.

## Testing the Fix

1. Start server: `npm run dev`
2. Create a test file: `echo test > backend/uploads/test.txt`
3. Server should NOT restart
4. Edit a route file: `backend/routes/shiftSettings.js`
5. Server SHOULD restart

## Related Files
- `backend/nodemon.json` - Main configuration
- `backend/package.json` - Scripts that use nodemon
- `START_BACKEND_NO_NODEMON.bat` - Alternative without nodemon

## Date Fixed
February 21, 2026

## Status
✅ FIXED - Permanent solution implemented

# Fix Timezone and Recover Lost User Data

## URGENT: Two-Step Solution

### Step 1: Fix Timezone Configuration

The timezone needs to be set at the **database level** in PostgreSQL.

#### Option A: Set Timezone in Database Connection (Recommended)

1. Open `backend/.env` file
2. Update the `DATABASE_URL` to include timezone parameter:

```env
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/school_management?schema=school_comms&timezone=Africa/Addis_Ababa"
```

**Common Timezones:**
- Ethiopia: `Africa/Addis_Ababa` (EAT - UTC+3)
- Kenya: `Africa/Nairobi` (EAT - UTC+3)
- Egypt: `Africa/Cairo` (EET - UTC+2)
- South Africa: `Africa/Johannesburg` (SAST - UTC+2)

#### Option B: Set Timezone in PostgreSQL Server

Run this SQL command in your PostgreSQL database:

```sql
-- Set timezone for current session
SET TIME ZONE 'Africa/Addis_Ababa';

-- Set timezone permanently for database
ALTER DATABASE school_management SET timezone TO 'Africa/Addis_Ababa';
```

#### Option C: Set System Timezone (Windows)

1. Open Command Prompt as Administrator
2. Run:
```cmd
tzutil /s "E. Africa Standard Time"
```

3. Restart your backend server

---

### Step 2: Recover Lost User Data from AI06 Device

You have **TWO OPTIONS** to recover user data:

## OPTION 1: Restore from Backup (If you have backup)

### Check if Backup Exists

1. Navigate to `backend/backups` folder
2. Look for files like: `ai06-users-backup-YYYY-MM-DD.json`

### Restore from Backup

1. **Configure Device IP** in `backend/restore-ai06-users.js`:
   ```javascript
   const DEVICE_IP = '192.168.1.201'; // Change to YOUR device IP
   ```

2. **Run Restore Script**:
   ```cmd
   cd backend
   node restore-ai06-users.js
   ```

   OR double-click:
   ```
   RESTORE_AI06_USERS.bat
   ```

---

## OPTION 2: Pull Users from Device (If device still has data)

If your AI06 device still has the user data, you can pull it back to your database.

### Create Backup Script (if not exists)

Create `backend/backup-ai06-users.js`:

```javascript
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.201'; // Change to your device IP
const DEVICE_PORT = 80;

async function backupUsers() {
  try {
    console.log('Connecting to AI06 device...');
    
    // Get all users from device
    const response = await axios.post(
      `http://${DEVICE_IP}:${DEVICE_PORT}/cgi-bin/js/app/module/userManager.js`,
      {
        command: 'getUserList',
        token: ''
      },
      { timeout: 10000 }
    );

    if (response.data && response.data.result === 'success') {
      const users = response.data.users || [];
      console.log(`✅ Found ${users.length} users on device`);

      // Create backup directory
      const backupDir = path.join(__dirname, 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }

      // Save backup
      const timestamp = new Date().toISOString().split('T')[0];
      const backupFile = path.join(backupDir, `ai06-users-backup-${timestamp}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(users, null, 2));

      console.log(`✅ Backup saved: ${backupFile}`);
      console.log('\nUser Summary:');
      users.forEach(user => {
        console.log(`  - ID: ${user.id}, Name: ${user.name}`);
      });

      return users;
    } else {
      console.log('❌ Failed to get users from device');
    }
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

// Run backup
backupUsers();
```

### Run Backup to Pull Users

1. **Update Device IP** in the script above
2. **Run**:
   ```cmd
   cd backend
   node backup-ai06-users.js
   ```

3. This will create a backup file in `backend/backups/`

---

## OPTION 3: Sync Users to Database

If you want to sync AI06 users to your Staff database:

### Create Sync Script

Create `backend/sync-ai06-to-staff.js`:

```javascript
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.201'; // Change to your device IP
const DEVICE_PORT = 80;

async function syncUsersToDatabase() {
  try {
    console.log('📡 Connecting to AI06 device...');
    
    // Get all users from device
    const response = await axios.post(
      `http://${DEVICE_IP}:${DEVICE_PORT}/cgi-bin/js/app/module/userManager.js`,
      {
        command: 'getUserList',
        token: ''
      },
      { timeout: 10000 }
    );

    if (response.data && response.data.result === 'success') {
      const users = response.data.users || [];
      console.log(`✅ Found ${users.length} users on device\n`);

      let syncedCount = 0;
      let skippedCount = 0;

      for (const user of users) {
        try {
          // Check if staff with this machineId already exists
          const existingStaff = await prisma.staff.findUnique({
            where: { machineId: user.id }
          });

          if (existingStaff) {
            console.log(`⏭️  Skipped: ${user.name} (already exists)`);
            skippedCount++;
            continue;
          }

          // Create new staff record
          await prisma.staff.create({
            data: {
              employeeNumber: `EMP${user.id}`,
              machineId: user.id,
              firstName: user.name.split(' ')[0] || user.name,
              lastName: user.name.split(' ').slice(1).join(' ') || 'Unknown',
              email: `staff${user.id}@school.com`,
              phone: '0900000000',
              staffType: 'TEACHER', // Change as needed
              dateOfBirth: new Date('1990-01-01'),
              gender: 'MALE', // Change as needed
              hireDate: new Date(),
              contractType: 'PERMANENT',
              status: 'ACTIVE'
            }
          });

          console.log(`✅ Synced: ${user.name} (Machine ID: ${user.id})`);
          syncedCount++;

        } catch (error) {
          console.log(`❌ Error syncing ${user.name}: ${error.message}`);
        }
      }

      console.log('\n========================================');
      console.log(`Sync Summary:`);
      console.log(`✅ Synced: ${syncedCount}`);
      console.log(`⏭️  Skipped: ${skippedCount}`);
      console.log('========================================');

    } else {
      console.log('❌ Failed to get users from device');
    }
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run sync
syncUsersToDatabase();
```

### Run Sync

```cmd
cd backend
node sync-ai06-to-staff.js
```

---

## Quick Commands Summary

### 1. Fix Timezone
```cmd
# Edit backend/.env and add timezone parameter
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/school_management?schema=school_comms&timezone=Africa/Addis_Ababa"

# Restart backend
cd backend
npm start
```

### 2. Backup Users from Device
```cmd
cd backend
node backup-ai06-users.js
```

### 3. Restore Users to Device
```cmd
cd backend
node restore-ai06-users.js
```

### 4. Sync Users to Database
```cmd
cd backend
node sync-ai06-to-staff.js
```

---

## Troubleshooting

### Cannot Connect to Device
- Verify device IP address: `ping 192.168.1.201`
- Check device is powered on
- Ensure device and server are on same network
- Try accessing device web interface: `http://192.168.1.201`

### No Backup Files Found
- Check `backend/backups/` folder exists
- If no backups, use Option 2 to pull from device
- If device also lost data, you'll need to re-enroll users

### Timezone Still Wrong
1. Restart PostgreSQL service
2. Restart backend server
3. Check timezone in database:
   ```sql
   SHOW timezone;
   ```

---

## Important Notes

1. **Device Time**: The device will always sync time from cloud server. This is correct behavior.
2. **Database Time**: Your database should store times in your local timezone.
3. **Display Time**: The frontend will display times based on database timezone.
4. **Backup Regularly**: Run backup script weekly to prevent data loss.

---

## Need Help?

If you still have issues:
1. Check device IP is correct
2. Verify device is accessible on network
3. Ensure PostgreSQL is running
4. Check backend logs for errors

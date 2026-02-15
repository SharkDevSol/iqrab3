# AI06 Device Configuration Request

## Device Information
- **Model:** AiFace (AI06)
- **Serial Number:** AYTE16052143
- **IP Address:** 172.21.8.159
- **Firmware:** ai806_f06v_v5.17
- **Connection:** WebSocket (Port 7788)
- **Current Status:** ✅ Connected and working

---

## Current Issue: Accidental Double-Scan Problem

### Problem Description

When a staff member accidentally scans their face twice in quick succession (within seconds), the device sends two separate attendance logs with the same timestamp. Our system currently interprets these as:

1. **First scan** → Check-in
2. **Second scan** → Check-out (even though the person is still at work)

This causes incorrect attendance records showing "HALF_DAY" status when the person is actually present for the full day.

### Example Scenario

```
08:00 AM - Staff member arrives and scans face ✅ (Check-in)
08:00 AM - Staff member accidentally scans again ❌ (Interpreted as check-out)
Result: System thinks they worked 0 minutes = HALF_DAY status
Reality: Staff member is still at work for the full day
```

---

## Current Backend Solution (Temporary)

We've implemented smart detection logic on our backend server:

```javascript
// Backend logic
if (existingRecord.check_in && !existingRecord.check_out) {
  // Already checked in, this is a check-out
  checkOutTime = scanTime;
} else if (existingRecord.check_in && existingRecord.check_out) {
  // Already has both, ignore this scan
  console.log('⚠️ Already has check-in and check-out today - ignoring scan');
  return;
} else {
  // First scan of the day, this is a check-in
  checkInTime = scanTime;
}
```

**This works, but it's not ideal because:**
- Accidental scans still get sent to the server
- Creates unnecessary network traffic
- Confusing for staff (device doesn't indicate what happened)
- No visual feedback on the device

---

## Requested Device Configuration

### Option 1: Time-Based Scan Blocking (Preferred)

**Request:** Configure the device to ignore duplicate scans from the same person within a configurable time window.

**Suggested Settings:**
```
Minimum time between scans for same person: 30 seconds
```

**Behavior:**
- First scan at 08:00:00 → Sent to server ✅
- Second scan at 08:00:05 → Blocked by device ❌ (within 30 seconds)
- Third scan at 08:00:45 → Sent to server ✅ (after 30 seconds)

**Benefits:**
- Prevents accidental double-scans
- Reduces server load
- Better user experience
- More accurate attendance data

---

### Option 2: Check-In/Check-Out Mode Toggle

**Request:** Configure the device to alternate between check-in and check-out modes automatically.

**Behavior:**
```
Mode: CHECK-IN
↓
Staff scans face → Sends check-in log → Mode switches to CHECK-OUT
↓
Mode: CHECK-OUT
↓
Staff scans face → Sends check-out log → Mode switches to CHECK-IN
```

**Device Display:**
- Show "CHECK-IN MODE" or "CHECK-OUT MODE" on screen
- Display different colors (Green for check-in, Red for check-out)
- Play different voice messages

**Benefits:**
- Clear visual indication of current mode
- Staff knows what action they're performing
- Prevents confusion
- Natural workflow (in/out/in/out)

---

### Option 3: Manual Mode Selection

**Request:** Allow staff to select check-in or check-out before scanning.

**Behavior:**
```
Device shows menu:
[1] Check-In
[2] Check-Out

Staff selects option → Scans face → Sends log with selected mode
```

**Benefits:**
- Staff has full control
- No accidental wrong mode
- Works for irregular schedules
- Handles mid-day exits

---

## Device Configuration Questions

### 1. Scan Interval Settings

**Question:** Does the AI06 device have a configurable "minimum scan interval" setting?

**If YES:**
- What is the parameter name?
- What is the valid range (e.g., 10-300 seconds)?
- How do we configure it (web interface, command, config file)?

**If NO:**
- Can this feature be added in a firmware update?
- What is the estimated timeline?

---

### 2. In/Out Mode Configuration

**Question:** Does the device support check-in/check-out mode toggling?

**If YES:**
- How do we enable it?
- Can we customize the display messages?
- Can we customize voice messages?
- Does it persist across device restarts?

**If NO:**
- Is this feature available in newer firmware versions?
- Can it be added as a custom feature?

---

### 3. Custom Event Types

**Question:** Can we configure the device to send different event types?

**Current log format:**
```json
{
  "enrollid": 10,
  "name": "khalid",
  "time": "2026-02-10 13:23:55",
  "mode": 8,
  "inout": 0,  ← This field
  "event": 0
}
```

**Request:** Can we make the device alternate the `inout` field?
- `inout: 0` for check-in
- `inout: 1` for check-out

**Or:** Can we use the `event` field to indicate check-in vs check-out?

---

### 4. Display Customization

**Question:** Can we customize the device display messages?

**Desired messages:**
```
✅ CHECK-IN SUCCESSFUL
   Time: 08:00 AM
   Have a great day!

✅ CHECK-OUT SUCCESSFUL
   Time: 17:00 PM
   See you tomorrow!

⚠️ ALREADY CHECKED IN
   Please check out first

⚠️ ALREADY CHECKED OUT
   See you tomorrow!
```

---

### 5. Voice Message Customization

**Question:** Can we customize voice messages for different scenarios?

**Desired voice messages:**
- Check-in: "Good morning, [Name]. Check-in successful."
- Check-out: "Goodbye, [Name]. Check-out successful."
- Duplicate scan: "You have already checked in today."

---

## Technical Details

### Current WebSocket Communication

**Device Registration:**
```json
{
  "cmd": "reg",
  "sn": "AYTE16052143",
  "devinfo": {
    "modelname": "AiFace",
    "firmware": "ai806_f06v_v5.17",
    "useduser": 6,
    "usedface": 4
  }
}
```

**Attendance Log:**
```json
{
  "cmd": "sendlog",
  "sn": "AYTE16052143",
  "count": 1,
  "logindex": 0,
  "record": [{
    "enrollid": 10,
    "name": "khalid",
    "time": "2026-02-10 13:23:55",
    "mode": 8,
    "inout": 0,
    "event": 0
  }]
}
```

**Server Response:**
```json
{
  "ret": "sendlog",
  "result": true,
  "cloudtime": "2026-02-10T13:23:55.000Z",
  "access": 1,
  "message": "Attendance received successfully"
}
```

---

## Proposed Server Response Enhancement

**Question:** Can the device respond to server commands in the response?

**Proposed enhanced response:**
```json
{
  "ret": "sendlog",
  "result": true,
  "cloudtime": "2026-02-10T13:23:55.000Z",
  "access": 1,
  "message": "Check-in successful",
  "voice": "Good morning, Khalid. Check-in successful.",
  "display": "✅ CHECK-IN SUCCESSFUL\nTime: 08:00 AM",
  "nextMode": "checkout"  ← Tell device to switch to check-out mode
}
```

**Benefits:**
- Server controls the logic
- Device just follows instructions
- Flexible and customizable
- No firmware changes needed

---

## Alternative: Server-Side Only Solution

If device configuration is not possible, we can handle everything server-side:

### Current Implementation (Already Done)

```javascript
// Smart detection based on existing records
if (already_checked_in && !already_checked_out) {
  // This is a check-out
  checkOutTime = scanTime;
} else if (already_checked_in && already_checked_out) {
  // Ignore duplicate scan
  return;
} else {
  // This is a check-in
  checkInTime = scanTime;
}
```

### Enhanced Server-Side Solution

```javascript
// Add time-based duplicate detection
const lastScanTime = getLastScanTime(staffId);
const timeSinceLastScan = currentTime - lastScanTime;

if (timeSinceLastScan < 30) {
  // Ignore scan within 30 seconds
  console.log('⚠️ Duplicate scan detected - ignoring');
  return {
    result: true,
    message: 'Duplicate scan ignored',
    voice: 'Please wait before scanning again'
  };
}
```

**This works, but:**
- Device still sends unnecessary data
- No visual feedback on device
- Staff doesn't know what happened

---

## Requested Documentation

Please provide:

1. **Device Configuration Manual**
   - All available settings and parameters
   - How to access device configuration
   - Web interface URL and credentials

2. **WebSocket Protocol Documentation**
   - Complete list of commands and responses
   - All available fields and their meanings
   - Custom configuration options

3. **Firmware Update Guide**
   - How to check current firmware version
   - How to update firmware
   - Latest firmware version available
   - Changelog for firmware updates

4. **Custom Feature Development**
   - Can you develop custom features for us?
   - What is the process and timeline?
   - What are the costs involved?

---

## Priority Ranking

### High Priority (Must Have)
1. ✅ **Time-based scan blocking** (30-second minimum interval)
   - Prevents accidental double-scans
   - Reduces server load
   - Improves data accuracy

### Medium Priority (Should Have)
2. ⭐ **Check-in/check-out mode toggle**
   - Better user experience
   - Clear visual feedback
   - Natural workflow

3. ⭐ **Custom display messages**
   - Inform staff of their action
   - Reduce confusion
   - Professional appearance

### Low Priority (Nice to Have)
4. 💡 **Custom voice messages**
   - Enhanced user experience
   - Personalized feedback

5. 💡 **Manual mode selection**
   - For advanced users
   - Handles edge cases

---

## Testing Requirements

Once configuration is provided, we need to test:

1. **Normal Flow**
   - Check-in at 08:00 AM ✅
   - Check-out at 17:00 PM ✅
   - Verify correct status

2. **Accidental Double-Scan**
   - Check-in at 08:00:00 ✅
   - Accidental scan at 08:00:05 ❌ (should be blocked)
   - Verify only one check-in recorded

3. **Mid-Day Exit**
   - Check-in at 08:00 AM ✅
   - Check-out at 12:00 PM ✅
   - Check-in at 13:00 PM ✅
   - Check-out at 17:00 PM ✅
   - Verify all four scans recorded correctly

4. **Multiple Staff**
   - Staff A checks in ✅
   - Staff B checks in ✅
   - Staff A checks out ✅
   - Staff B checks out ✅
   - Verify no cross-contamination

---

## Contact Information

**School System Details:**
- **Backend Server:** Node.js + Express
- **Database:** PostgreSQL
- **WebSocket Port:** 7788
- **API Port:** 5000
- **Protocol:** WebSocket + JSON

**Technical Contact:**
- **System:** School Management System
- **Integration:** AI06 Biometric Attendance
- **Status:** Operational (with workaround)
- **Request:** Device configuration for optimal performance

---

## Expected Response

Please provide:

1. ✅ **Confirmation** - Can the requested features be configured?
2. 📖 **Documentation** - Configuration manual and protocol docs
3. ⚙️ **Settings** - Specific parameters and values to use
4. 🔧 **Instructions** - Step-by-step configuration guide
5. 📅 **Timeline** - If firmware update needed, when available?
6. 💰 **Costs** - Any fees for custom features or support

---

## Current Workaround Status

✅ **Working:** Backend smart detection prevents incorrect records  
⚠️ **Issue:** No device-level feedback for staff  
🎯 **Goal:** Optimal solution with device configuration  

**We can continue using the current workaround while waiting for device configuration guidance.**

---

**Document Version:** 1.0  
**Date:** February 10, 2026  
**Status:** Awaiting AI06 Support Response  
**Priority:** Medium (System functional, optimization requested)

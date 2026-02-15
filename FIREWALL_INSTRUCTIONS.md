# Windows Firewall Configuration for AI06 Machine

## Option 1: Temporarily Disable Firewall (For Testing Only)

1. Press `Windows + R`
2. Type `firewall.cpl` and press Enter
3. Click "Turn Windows Defender Firewall on or off"
4. Select "Turn off Windows Defender Firewall" for Private networks
5. Click OK
6. Test connection: `npm run diagnose:machine`
7. **IMPORTANT:** Turn firewall back on after testing!

## Option 2: Add Firewall Rule (Recommended)

### Method A: Using PowerShell (Run as Administrator)

```powershell
# Allow incoming connections on port 4370
New-NetFirewallRule -DisplayName "ZKTeco AI06 Machine" -Direction Inbound -Protocol TCP -LocalPort 4370 -Action Allow

# Allow outgoing connections on port 4370
New-NetFirewallRule -DisplayName "ZKTeco AI06 Machine Out" -Direction Outbound -Protocol TCP -LocalPort 4370 -Action Allow
```

### Method B: Using GUI

1. Press `Windows + R`
2. Type `wf.msc` and press Enter (Windows Defender Firewall with Advanced Security)
3. Click "Inbound Rules" on the left
4. Click "New Rule..." on the right
5. Select "Port" → Next
6. Select "TCP" and enter "4370" → Next
7. Select "Allow the connection" → Next
8. Check all profiles (Domain, Private, Public) → Next
9. Name it "ZKTeco AI06 Machine" → Finish
10. Repeat for "Outbound Rules"

## Option 3: Allow Node.js Through Firewall

1. Press `Windows + R`
2. Type `firewall.cpl` and press Enter
3. Click "Allow an app or feature through Windows Defender Firewall"
4. Click "Change settings"
5. Click "Allow another app..."
6. Browse to: `C:\Program Files\nodejs\node.exe`
7. Click "Add"
8. Make sure both Private and Public are checked
9. Click OK

## Test After Configuration

```bash
cd backend
npm run diagnose:machine
```

You should see:
```
✅ Machine is reachable on network
✅ Socket created successfully!
✅ Device responded!
```

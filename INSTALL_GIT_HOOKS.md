# Git Hooks Installation Guide

## Purpose

Git hooks prevent accidentally committing code that disables the AI06 WebSocket service.

## What the Hook Does

The pre-commit hook checks:
1. ✅ `AI06_WEBSOCKET_ENABLED` is not set to `false` in .env
2. ✅ AI06 WebSocket Service code is not commented out in server.js

If either check fails, the commit is blocked with an error message.

## Installation

### Windows (PowerShell)

```powershell
# Navigate to project root
cd path\to\your\project

# Copy hook to .git/hooks
Copy-Item .git-hooks\pre-commit .git\hooks\pre-commit

# Make executable (Git Bash required)
# Open Git Bash and run:
chmod +x .git/hooks/pre-commit
```

### Windows (Command Prompt)

```cmd
REM Navigate to project root
cd path\to\your\project

REM Copy hook to .git/hooks
copy .git-hooks\pre-commit .git\hooks\pre-commit

REM Make executable using Git Bash
"C:\Program Files\Git\bin\bash.exe" -c "chmod +x .git/hooks/pre-commit"
```

### Linux/Mac

```bash
# Navigate to project root
cd /path/to/your/project

# Copy hook to .git/hooks
cp .git-hooks/pre-commit .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit
```

## Verification

Test the hook is working:

```bash
# Try to commit a change that disables AI06
echo "AI06_WEBSOCKET_ENABLED=false" >> backend/.env
git add backend/.env
git commit -m "Test commit"

# Should see:
# ❌ COMMIT BLOCKED!
# You are trying to commit AI06_WEBSOCKET_ENABLED=false
```

If you see this error, the hook is working! Revert the test change:

```bash
git restore backend/.env
```

## Bypassing the Hook

If you absolutely need to commit a change that disables AI06 (not recommended):

```bash
git commit --no-verify -m "Your commit message"
```

**Warning:** Only use `--no-verify` if you know what you're doing!

## Uninstalling

To remove the hook:

```bash
rm .git/hooks/pre-commit
```

## Troubleshooting

### Hook Not Running

**Problem:** Commits go through even with AI06 disabled

**Solution:**
1. Check hook exists: `ls .git/hooks/pre-commit`
2. Check it's executable: `ls -l .git/hooks/pre-commit`
3. Reinstall using instructions above

### Permission Denied

**Problem:** `Permission denied: .git/hooks/pre-commit`

**Solution:**
```bash
chmod +x .git/hooks/pre-commit
```

### Hook Blocks Valid Commit

**Problem:** Hook blocks a commit that should be allowed

**Solution:**
1. Review the error message
2. Check if you're actually disabling AI06
3. If it's a false positive, use `--no-verify` or update the hook

## Customization

To modify what the hook checks, edit:
- Source: `.git-hooks/pre-commit`
- Active: `.git/hooks/pre-commit`

After editing, reinstall the hook.

---

**Recommendation:** Install this hook on all development machines to prevent accidental service disabling.

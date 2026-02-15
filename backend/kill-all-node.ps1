# Kill ALL Node.js processes (use with caution!)
Write-Host "⚠️  WARNING: This will kill ALL Node.js processes!" -ForegroundColor Red
Write-Host "Press Ctrl+C to cancel, or wait 3 seconds to continue..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

$processes = Get-Process node -ErrorAction SilentlyContinue

if ($processes) {
    Write-Host "`nFound $($processes.Count) Node.js process(es):" -ForegroundColor Yellow
    $processes | ForEach-Object {
        Write-Host "  - PID: $($_.Id) | Started: $($_.StartTime)" -ForegroundColor Gray
    }
    
    Write-Host "`nKilling all Node.js processes..." -ForegroundColor Red
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    
    Start-Sleep -Seconds 1
    
    $remaining = Get-Process node -ErrorAction SilentlyContinue
    if ($remaining) {
        Write-Host "❌ Some processes could not be killed" -ForegroundColor Red
    } else {
        Write-Host "✅ All Node.js processes killed!" -ForegroundColor Green
        Write-Host "`nYou can now run: npm run dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "✅ No Node.js processes running" -ForegroundColor Green
}

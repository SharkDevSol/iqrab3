# Kill process using port 5000
Write-Host "Checking port 5000..." -ForegroundColor Yellow

$connection = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    Write-Host "Found process using port 5000:" -ForegroundColor Red
    Write-Host "  Process ID: $processId" -ForegroundColor Red
    Write-Host "  Process Name: $($process.ProcessName)" -ForegroundColor Red
    
    Write-Host "`nKilling process..." -ForegroundColor Yellow
    Stop-Process -Id $processId -Force
    
    Start-Sleep -Seconds 1
    
    $check = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    if ($check) {
        Write-Host "❌ Failed to free port 5000" -ForegroundColor Red
    } else {
        Write-Host "✅ Port 5000 is now FREE!" -ForegroundColor Green
        Write-Host "`nYou can now run: npm run dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "✅ Port 5000 is already FREE!" -ForegroundColor Green
    Write-Host "`nYou can run: npm run dev" -ForegroundColor Cyan
}

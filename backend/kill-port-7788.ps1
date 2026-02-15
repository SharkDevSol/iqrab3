# Kill process using port 7788
Write-Host "🔍 Finding process using port 7788..." -ForegroundColor Yellow

$process = Get-NetTCPConnection -LocalPort 7788 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "✅ Found process ID: $process" -ForegroundColor Green
    Write-Host "🔪 Killing process..." -ForegroundColor Red
    Stop-Process -Id $process -Force
    Write-Host "✅ Process killed successfully!" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "ℹ️  No process found using port 7788" -ForegroundColor Cyan
}

Write-Host "`n✅ Port 7788 is now free!" -ForegroundColor Green
Write-Host "💡 You can now start the server with: npm run dev" -ForegroundColor Cyan

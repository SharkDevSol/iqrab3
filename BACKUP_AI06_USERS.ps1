Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI06 User Backup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will backup all users from the AI06 device to your database" -ForegroundColor Yellow
Write-Host ""

Set-Location backend
node backup-ai06-users.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Backup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

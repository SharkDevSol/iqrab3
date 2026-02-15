Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AI06 User Restore Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will restore users to the AI06 device from backup" -ForegroundColor Yellow
Write-Host ""

Set-Location backend
node restore-ai06-users.js

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Restore Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

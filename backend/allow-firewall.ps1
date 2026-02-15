# Run this script as Administrator to allow port 5000

Write-Host "🔥 Configuring Windows Firewall for Port 5000" -ForegroundColor Cyan
Write-Host "=" * 70
Write-Host ""

try {
    # Add firewall rule for inbound connections
    netsh advfirewall firewall add rule name="Node Server Port 5000" dir=in action=allow protocol=TCP localport=5000
    
    Write-Host "✅ Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Port 5000 is now allowed through Windows Firewall"
    Write-Host ""
    Write-Host "📌 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Restart the machine (Menu → System → Restart)"
    Write-Host "   2. Do a face check-in"
    Write-Host "   3. Watch your server console"
    Write-Host ""
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Make sure you ran this script as Administrator:" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell → Run as Administrator"
    Write-Host "   Then run: .\allow-firewall.ps1"
}

Write-Host "=" * 70
Write-Host ""
Read-Host "Press Enter to close"

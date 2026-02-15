# Test USB Import
# This script tests the USB import functionality

Write-Host "📁 Testing USB Import Functionality" -ForegroundColor Cyan
Write-Host "=" * 70
Write-Host ""

# Create test file
$testFile = "test-attendance.txt"
$testContent = @"
1	2026-01-30 14:30:00	0	1
1	2026-01-30 17:00:00	0	1
"@

Write-Host "📝 Creating test file: $testFile"
$testContent | Out-File -FilePath $testFile -Encoding UTF8
Write-Host "✅ Test file created" -ForegroundColor Green
Write-Host ""

# Upload to server
Write-Host "📤 Uploading to server..."
$uri = "http://localhost:5000/api/usb-attendance/upload"

try {
    $form = @{
        file = Get-Item -Path $testFile
    }
    
    $response = Invoke-RestMethod -Uri $uri -Method Post -Form $form
    
    Write-Host "✅ Upload successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Results:" -ForegroundColor Yellow
    Write-Host "   Total Records: $($response.stats.totalRecords)"
    Write-Host "   Saved: $($response.stats.saved)"
    Write-Host "   Skipped: $($response.stats.skipped)"
    
    if ($response.stats.unmappedUsers.Count -gt 0) {
        Write-Host "   Unmapped Users: $($response.stats.unmappedUsers -join ', ')" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "✅ Test completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Make sure:" -ForegroundColor Yellow
    Write-Host "   1. Server is running (npm start)"
    Write-Host "   2. User mapping exists (node scripts/list-mappings.js)"
}

# Cleanup
Remove-Item $testFile -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=" * 70

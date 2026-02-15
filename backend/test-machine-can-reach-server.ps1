# Test if machine can reach server from machine's perspective

Write-Host "🧪 Testing Server Accessibility" -ForegroundColor Cyan
Write-Host "=" * 70
Write-Host ""

$serverIP = "192.168.1.22"
$serverPort = 5000

Write-Host "Testing if server at ${serverIP}:${serverPort} is accessible..."
Write-Host ""

# Test 1: Ping
Write-Host "📋 Test 1: Ping server IP"
$ping = Test-Connection -ComputerName $serverIP -Count 2 -Quiet
if ($ping) {
    Write-Host "   ✅ Server IP is reachable" -ForegroundColor Green
} else {
    Write-Host "   ❌ Cannot ping server IP" -ForegroundColor Red
}
Write-Host ""

# Test 2: Port
Write-Host "📋 Test 2: Check if port $serverPort is open"
$port = Test-NetConnection -ComputerName $serverIP -Port $serverPort -WarningAction SilentlyContinue
if ($port.TcpTestSucceeded) {
    Write-Host "   ✅ Port $serverPort is open" -ForegroundColor Green
} else {
    Write-Host "   ❌ Port $serverPort is closed or blocked" -ForegroundColor Red
}
Write-Host ""

# Test 3: HTTP Request
Write-Host "📋 Test 3: Try HTTP request (like machine does)"
try {
    $response = Invoke-WebRequest -Uri "http://${serverIP}:${serverPort}/api/health" -TimeoutSec 5
    Write-Host "   ✅ Server responds to HTTP requests" -ForegroundColor Green
    Write-Host "   Response: $($response.StatusCode) $($response.StatusDescription)"
} catch {
    Write-Host "   ❌ Server doesn't respond to HTTP" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}
Write-Host ""

# Test 4: Webhook endpoint
Write-Host "📋 Test 4: Test webhook endpoint"
try {
    $body = @{
        test = "true"
        userId = "1"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://${serverIP}:${serverPort}/api/machine-webhook/test" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5
    Write-Host "   ✅ Webhook endpoint is working" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Webhook test: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=" * 70
Write-Host ""
Write-Host "💡 DIAGNOSIS:" -ForegroundColor Yellow
Write-Host ""

if ($ping -and $port.TcpTestSucceeded) {
    Write-Host "✅ Network connectivity is GOOD" -ForegroundColor Green
    Write-Host ""
    Write-Host "The machine SHOULD be able to reach your server." -ForegroundColor Green
    Write-Host ""
    Write-Host "If machine still shows 'Disconnected', the issue might be:" -ForegroundColor Yellow
    Write-Host "   1. Machine is trying wrong URL format"
    Write-Host "   2. Machine expects specific response format"
    Write-Host "   3. Machine firmware doesn't support this push method"
    Write-Host ""
    Write-Host "📌 RECOMMENDATION: Use USB Import method instead" -ForegroundColor Cyan
    Write-Host "   It's simpler and more reliable!"
    Write-Host "   Read: USB_IMPORT_GUIDE.md"
} else {
    Write-Host "❌ Network connectivity has issues" -ForegroundColor Red
    Write-Host ""
    Write-Host "Fix these first:"
    if (-not $ping) {
        Write-Host "   - Server IP not reachable"
    }
    if (-not $port.TcpTestSucceeded) {
        Write-Host "   - Port 5000 is blocked"
    }
}

Write-Host ""
Write-Host "=" * 70

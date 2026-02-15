# Restart Backend Server Script
# This script stops any running node processes and starts the server fresh

Write-Host "🔄 Restarting Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Stop any running node processes on port 5000
Write-Host "📍 Stopping existing server..." -ForegroundColor Yellow
try {
    npx kill-port 5000 2>$null
    Write-Host "✅ Stopped existing server" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  No server was running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 Starting server..." -ForegroundColor Yellow
Write-Host ""

# Start the server
npm start

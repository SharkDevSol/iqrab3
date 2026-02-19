# Fix Date Column Constraint
# Makes the 'date' column nullable so auto-marker can work with Ethiopian calendar

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Date Column Constraint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load environment variables
if (Test-Path "backend\.env") {
    Get-Content "backend\.env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Host "✓ Loaded environment variables" -ForegroundColor Green
} else {
    Write-Host "⚠ .env file not found" -ForegroundColor Yellow
}

$DATABASE_URL = $env:DATABASE_URL

if (-not $DATABASE_URL) {
    Write-Host "❌ DATABASE_URL not found in environment" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set DATABASE_URL in backend/.env file" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

Write-Host "Database: $DATABASE_URL" -ForegroundColor Gray
Write-Host ""

# Run the migration using Node.js
Write-Host "Running migration..." -ForegroundColor Yellow

$migrationScript = @"
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'backend/database/fix_student_attendance_constraint.sql'), 'utf8');
    await pool.query(sql);
    console.log('✓ Migration completed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
"@

$migrationScript | Out-File -FilePath "temp_migration.js" -Encoding UTF8

node temp_migration.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✓ Date column is now nullable" -ForegroundColor Green
    Write-Host "✓ Auto-marker will now work correctly" -ForegroundColor Green
    Write-Host ""
    Write-Host "Please restart your server to apply changes." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Could not run migration." -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual fix:" -ForegroundColor Yellow
    Write-Host "1. Open your database client" -ForegroundColor Yellow
    Write-Host "2. Run: ALTER TABLE academic_student_attendance ALTER COLUMN date DROP NOT NULL;" -ForegroundColor Yellow
}

# Cleanup
if (Test-Path "temp_migration.js") {
    Remove-Item "temp_migration.js"
}

Write-Host ""
pause

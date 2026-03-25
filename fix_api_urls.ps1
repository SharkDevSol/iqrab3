$files = @(
    "APP/src/PAGE/CreateMarklist/MarkListManagement.jsx",
    "APP/src/PAGE/CreateMarklist/SubjectMappingSetup.jsx"
)

foreach ($file in $files) {
    Write-Host "Fixing $file..."
    $content = Get-Content $file -Raw
    
    # Fix all fetch calls
    $content = $content -replace 'fetch\(\$\{API_BASE_URL\}/', 'fetch(`${API_BASE_URL}/'
    
    Set-Content $file -Value $content -NoNewline
    Write-Host "Fixed $file"
}

Write-Host "All files fixed!"

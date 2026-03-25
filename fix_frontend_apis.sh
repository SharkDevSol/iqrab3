#!/bin/bash

# Fix MarkListManagement.jsx
FILE1="APP/src/PAGE/CreateMarklist/MarkListManagement.jsx"
# Add API_BASE_URL constant after imports
sed -i "4i const API_BASE_URL = 'https://bilal.skoolific.com/api';" "$FILE1"
# Replace fetch calls
sed -i "s|fetch('/api/|fetch(\`\${API_BASE_URL}/|g" "$FILE1"

# Fix SubjectMappingSetup.jsx
FILE2="APP/src/PAGE/CreateMarklist/SubjectMappingSetup.jsx"
# Add API_BASE_URL constant after imports
sed -i "4i const API_BASE_URL = 'https://bilal.skoolific.com/api';" "$FILE2"
# Replace fetch calls
sed -i "s|fetch('/api/|fetch(\`\${API_BASE_URL}/|g" "$FILE2"

# Fix TaskDetail.jsx
FILE3="APP/src/PAGE/TaskDetail.jsx"
# Add API_BASE_URL constant after imports
sed -i "2i const API_BASE_URL = 'https://bilal.skoolific.com/api';" "$FILE3"
# Replace fetch calls
sed -i "s|fetch('/api/|fetch(\`\${API_BASE_URL}/|g" "$FILE3"

echo "Files fixed!"

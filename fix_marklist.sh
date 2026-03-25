#!/bin/bash
cd /var/www/bilal-school/backend/routes
cp markListRoutes.js markListRoutes.js.backup

# Fix the regex to include period
sed -i "s/replace(\\/\[\\\\s\\\\-\]+\\/g, '_')/replace(\\/[\\\\s\\\\-\\\\.]+\\/g, '_')/g" markListRoutes.js

echo "Fixed regex pattern"

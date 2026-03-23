#!/bin/bash
# Deploy script for bilal.skoolific.com
# Usage: bash deploy.sh

SERVER="root@76.13.48.245"
REMOTE_PATH="/var/www/bilal.skoolific.com"   # adjust if different

echo "==> Building app..."
cd APP
npm install
npm run build
cd ..

echo "==> Uploading to server..."
scp -r APP/dist/* $SERVER:$REMOTE_PATH/

echo "==> Done! Visit https://bilal.skoolific.com"

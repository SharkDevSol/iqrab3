# Setup HTTPS for Local Development

## Step 1: Install mkcert

### On Windows (using Chocolatey):
```bash
choco install mkcert
```

### Or download manually:
1. Download mkcert from: https://github.com/FiloSottile/mkcert/releases
2. Download `mkcert-v1.4.4-windows-amd64.exe`
3. Rename it to `mkcert.exe`
4. Move it to a folder in your PATH (or use it directly)

## Step 2: Create Local Certificate Authority

Open PowerShell as Administrator and run:
```bash
mkcert -install
```

## Step 3: Generate Certificate for Your IP

In your project root, run:
```bash
mkcert 172.21.8.159 localhost 127.0.0.1
```

This will create two files:
- `172.21.8.159+2.pem` (certificate)
- `172.21.8.159+2-key.pem` (private key)

## Step 4: Move Certificates

Create a `certs` folder and move the certificates:
```bash
mkdir certs
move 172.21.8.159+2.pem certs/cert.pem
move 172.21.8.159+2-key.pem certs/key.pem
```

## Step 5: Update Vite Config

The vite.config.js has been updated to use HTTPS.

## Step 6: Update Backend for HTTPS

The backend server.js needs to be updated to use HTTPS.

## Step 7: Update Environment Variables

Update APP/.env:
```
VITE_API_URL=https://172.21.8.159:5000/api
```

## Step 8: Start Servers

Frontend:
```bash
cd APP
npm run dev
```

Backend:
```bash
cd backend
node server.js
```

## Step 9: Access from Mobile

On your mobile device:
1. Go to: https://172.21.8.159:5173
2. You'll see a security warning (because it's self-signed)
3. Click "Advanced" → "Proceed to site"
4. Now install the PWA - it will work in standalone mode!

## Step 10: Install Certificate on Mobile (Optional)

To avoid security warnings:
1. Transfer the `rootCA.pem` file from `C:\Users\[YourUser]\AppData\Local\mkcert` to your phone
2. Install it as a trusted certificate on your phone
3. Settings → Security → Install from storage → Select the certificate

## Troubleshooting

If you get "certificate not trusted" errors:
- Make sure you ran `mkcert -install` as Administrator
- Restart your browser after installing mkcert
- On mobile, you may need to install the root CA certificate

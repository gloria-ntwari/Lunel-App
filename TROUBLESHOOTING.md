# Lunel App Troubleshooting Guide

## Current Configuration
- **Your IP Address**: `192.168.127.50`
- **Backend URL**: `http://192.168.127.50:5000/api`
- **Admin Credentials**: `admin@lunel.com` / `admin123`

## Step-by-Step Testing

### 1. Test Backend Health
First, test if your backend is running:

**In Postman or Browser:**
```
GET http://192.168.127.50:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Lunel Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Database Connection
Check if the database is connected and admin exists:

**In Postman or Browser:**
```
GET http://192.168.127.50:5000/api/auth/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "data": {
    "totalUsers": 1,
    "adminExists": true,
    "adminRole": "super_admin"
  }
}
```

### 3. Test Admin Login
**In Postman:**
```
POST http://192.168.127.50:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@lunel.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Super Admin",
      "email": "admin@lunel.com",
      "role": "super_admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Symptoms:** Network error in frontend
**Solutions:**
1. Make sure backend is running: `npm run dev` in backend folder
2. Check if port 5000 is available
3. Try using `localhost:5000` instead of IP address
4. Check Windows Firewall settings

### Issue 2: "400 Bad Request" in Postman
**Symptoms:** Validation error
**Solutions:**
1. Make sure you're sending JSON with correct Content-Type header
2. Check if email and password fields are present
3. Verify the request body format

### Issue 3: "Admin not found"
**Symptoms:** 401 Unauthorized
**Solutions:**
1. Run the admin creation script: `npm run create-admin`
2. Check if MongoDB is running
3. Verify the database connection

### Issue 4: CORS Error
**Symptoms:** CORS policy error in browser
**Solutions:**
1. The backend CORS is already configured for your IP
2. Make sure you're using the correct URL
3. Try clearing browser cache

## Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop all running processes (Ctrl+C)
# Then restart:

# Terminal 1 - Backend
cd Lunel-App/backend
npm run dev

# Terminal 2 - Frontend  
cd Lunel-App
npx expo start
```

### Fix 2: Create Admin Again
```bash
cd Lunel-App/backend
npm run create-admin
```

### Fix 3: Check MongoDB
```bash
# Windows - Check if MongoDB service is running
net start MongoDB

# Or start MongoDB manually
mongod
```

### Fix 4: Alternative API URLs
If `192.168.127.50` doesn't work, try these in `config/api.ts`:

```typescript
// Option 1: Localhost (for same machine)
BASE_URL: 'http://localhost:5000/api'

// Option 2: Android emulator
BASE_URL: 'http://10.0.2.2:5000/api'

// Option 3: Your IP
BASE_URL: 'http://192.168.127.50:5000/api'
```

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] MongoDB is running and connected
- [ ] Admin user exists in database
- [ ] Health endpoint returns success
- [ ] Test endpoint shows admin exists
- [ ] Login endpoint works in Postman
- [ ] Frontend can connect to backend
- [ ] CORS is properly configured

## Debug Information

### Backend Logs
Check your backend console for:
- Database connection messages
- Login attempt logs
- Error messages

### Frontend Logs
Check your Expo console for:
- Network request logs
- API response logs
- Error messages

### Network Testing
Test these URLs in your browser:
- `http://192.168.127.50:5000/api/health`
- `http://192.168.127.50:5000/api/auth/test`

If these don't work, the issue is with the backend or network configuration.

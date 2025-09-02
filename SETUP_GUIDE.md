# Lunel App Setup Guide

This guide will help you set up the complete Lunel application with backend authentication.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (running locally or MongoDB Atlas)
3. **Expo CLI** (for React Native development)

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd Lunel-App/backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lunel-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
- **Windows**: Start MongoDB service or run `mongod`
- **macOS**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### 4. Create Super Admin

Run the script to create the super admin user:

```bash
npm run create-admin
```

This creates:
- **Email**: `admin@lunel.com`
- **Password**: `admin123`
- **Role**: `super_admin`

### 5. Start Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd Lunel-App
npm install
```

### 2. Start Frontend

```bash
# Start Expo development server
npx expo start
```

## Testing the Authentication

### 1. Super Admin Login
- **Email**: `admin@lunel.com`
- **Password**: `admin123`
- **Expected**: Redirects to AdminHomeScreen

### 2. Student Registration
- **Email**: Must end with `@mail.louisenlund.de`
- **Example**: `student@mail.louisenlund.de`
- **Expected**: Redirects to EventScreen

### 3. Student Login
- Use the same credentials from registration
- **Expected**: Redirects to EventScreen

## Database Structure

### MongoDB Database: `lunel-app`
### Collection: `users`

Example user document:
```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@mail.louisenlund.de",
  "password": "$2a$10$...", // hashed
  "role": "user",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Health Check
- `GET /api/health` - Check API status

## Troubleshooting

### Backend Issues
1. **MongoDB Connection Error**: Ensure MongoDB is running
2. **Port Already in Use**: Change PORT in `.env` file
3. **JWT Secret Error**: Make sure JWT_SECRET is set in `.env`

### Frontend Issues
1. **Network Error**: Check if backend is running on correct port
2. **CORS Error**: Backend CORS is configured for localhost:3000, 19006, and Expo URLs
3. **Device Testing**: For physical device testing, update API_BASE_URL in `config/api.ts` to your computer's IP address

### Common Solutions
1. **Clear Cache**: `npx expo start --clear`
2. **Restart Backend**: Stop and restart the backend server
3. **Check Logs**: Check both frontend and backend console logs for errors

## Development Tips

1. **Backend Logs**: Check backend console for API request logs
2. **Frontend Logs**: Check Expo console for network requests
3. **Database**: Use MongoDB Compass to view your database
4. **Testing**: Use Postman or similar tool to test API endpoints directly

## Next Steps

After successful setup:
1. Test all authentication flows
2. Verify user roles and navigation
3. Add more features to the backend API
4. Implement additional frontend screens

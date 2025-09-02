# Lunel Backend API

This is the backend API for the Lunel mobile application, built with Express.js and MongoDB.

## Features

- User authentication (login/register)
- Role-based access control (user, admin, super_admin)
- Email domain validation for student users
- JWT token-based authentication
- MongoDB integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lunel-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system. The database name should be `lunel-app` with a collection called `users`.

### 4. Create Super Admin

Run the script to create the super admin user:

```bash
npm run create-admin
```

This will create a super admin with:
- Email: `admin@lunel.com`
- Password: `admin123`
- Role: `super_admin`

### 5. Start the Server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
- **Body**: `{ name, email, password, confirmPassword }`
- **Validation**: Email must end with `@mail.louisenlund.de`
- **Response**: User data and JWT token

#### POST `/api/auth/login`
Login user
- **Body**: `{ email, password }`
- **Response**: User data and JWT token

#### GET `/api/auth/me`
Get current user (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user data

#### POST `/api/auth/logout`
Logout user (client-side token removal)
- **Headers**: `Authorization: Bearer <token>`

### Health Check

#### GET `/api/health`
Check if the API is running

## User Roles

1. **super_admin**: Full system access (manually created)
2. **admin**: Administrative access
3. **user**: Regular student user

## Authentication Flow

1. **Super Admin Login**: 
   - Email: `admin@lunel.com`
   - Password: `admin123`
   - Redirects to: AdminHomeScreen

2. **Student Registration/Login**:
   - Email must end with `@mail.louisenlund.de`
   - Redirects to: EventScreen

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin', 'super_admin']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All API responses follow this format:

```javascript
{
  success: boolean,
  message: string,
  data?: object,
  errors?: array
}
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:19006`
- `exp://192.168.1.100:19000`

Add your frontend URLs to the CORS configuration in `server.js` if needed.

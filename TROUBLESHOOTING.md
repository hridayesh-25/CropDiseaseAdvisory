# Troubleshooting Registration Issues

## Fixed Issues

### 1. API Base URL Configuration
- **Problem**: AuthContext was using axios directly without baseURL
- **Fix**: Updated to use the `api` utility which has the correct baseURL configured
- **File**: `client/src/context/AuthContext.js`

### 2. Error Handling
- **Problem**: Error messages weren't being properly extracted from validation errors
- **Fix**: Improved error handling to show validation errors and better error messages
- **Files**: 
  - `client/src/context/AuthContext.js`
  - `server/routes/auth.js`

### 3. MongoDB Connection String
- **Problem**: Connection string might be missing database name
- **Fix**: Updated connection string to include database name `crop-advisory`
- **File**: `server/index.js`

## How to Debug Registration Issues

### Check Server Console
When registration fails, check the server console for:
1. MongoDB connection errors
2. Validation errors
3. Duplicate email errors

### Check Browser Console
Open browser DevTools (F12) and check:
1. Network tab - see the actual API request/response
2. Console tab - see any JavaScript errors

### Common Issues

#### 1. CORS Errors
If you see CORS errors, make sure:
- Backend is running on port 5000
- Frontend is making requests to correct API URL
- CORS middleware is enabled in server

#### 2. Validation Errors
Common validation errors:
- Email format invalid
- Password too short (minimum 6 characters)
- Name is required

#### 3. MongoDB Connection
If MongoDB connection fails:
- Check if MongoDB Atlas IP whitelist includes your IP
- Verify connection string is correct
- Check if database name is included in connection string

#### 4. Duplicate Email
If email already exists:
- Try a different email
- Or delete the existing user from database

## Testing Registration

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to register
4. Look for the `/api/auth/register` request
5. Check the response:
   - Status code (should be 201 for success)
   - Response body (should contain token and user data)
   - Error messages (if any)

## Manual Database Check

If you want to check users in database:

```javascript
// In MongoDB Compass or shell
use crop-advisory
db.users.find().pretty()
```

## Next Steps

If registration still fails:
1. Check server console for detailed error messages
2. Check browser Network tab for API response
3. Verify MongoDB connection is working
4. Make sure all required fields are filled


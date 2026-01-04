# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running (or use MongoDB Atlas cloud)

## Step 1: Install Dependencies

### Install Backend Dependencies
```bash
cd server
npm install
```

### Install Frontend Dependencies
```bash
cd client
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env file in server folder)
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crop-advisory
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
WEATHER_API_KEY=your_openweathermap_api_key_optional
```

### Frontend (.env file in client folder - Optional)
Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

Make sure MongoDB is running:
```bash
# On Windows
mongod

# On Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env

## Step 4: Run the Application

### Option 1: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Option 2: Run from Root (if concurrently installed)
```bash
npm run dev
```

## Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Step 6: Create Your First Account

1. Go to http://localhost:3000
2. Click "Sign up"
3. Register as a user, specialist, or admin
4. Login and explore the dashboard

## Creating Admin/Specialist Users

By default, registration creates "user" role. To create admin or specialist:

1. Register normally
2. Manually update in MongoDB:
```javascript
// In MongoDB shell or Compass
use crop-advisory
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
// or
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "specialist" } }
)
```

## Using Docker (Alternative)

```bash
docker-compose up
```

This will start MongoDB and the backend automatically.

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in server/.env
- For MongoDB Atlas, ensure IP is whitelisted

### Port Already in Use
- Change PORT in server/.env
- Or kill the process using the port

### CORS Errors
- Make sure backend is running on port 5000
- Check REACT_APP_API_URL in client/.env

## Next Steps

1. Add some products through Admin dashboard
2. Add medicines through Specialist dashboard
3. Test disease detection feature
4. Explore crop advisory features
5. Check weather information

Enjoy your Crop Disease Advisory Application! 🌾


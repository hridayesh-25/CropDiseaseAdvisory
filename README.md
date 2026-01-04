# Crop Disease Advisory Web Application

A comprehensive MERN stack application for crop disease detection, medicine recommendations, and agricultural advisory services.

## Features

### User Features
- **Authentication**: Secure login and registration system
- **Product Catalog**: Browse and view crop-related products (fertilizers, pesticides, seeds, equipment)
- **Disease Detection**: 
  - Upload leaf images for disease detection
  - Enter disease name manually
  - Get AI-powered disease predictions
- **Medicine Recommendations**: Get medicine suggestions based on detected diseases (High/Medium/Low price options)
- **Crop Advisory**: 
  - Best crops by location
  - Best crops by season
  - Climate-based recommendations
- **Weather Information**: 
  - Current weather conditions
  - Weather alerts (storms, floods)
- **Land Leasing**: Browse and lease crop lands for cultivation

### Specialist Features
- Review and approve disease detection requests
- Approve/reject medicine recommendations
- Add new medicines to the database

### Admin Features
- User management
- Product management
- Medicine management
- Platform statistics

## Tech Stack

- **Frontend**: React, React Router, Framer Motion, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crop-advisory
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
WEATHER_API_KEY=your_openweathermap_api_key
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

### Root Setup (Optional)

To run both frontend and backend concurrently:

1. Install root dependencies:
```bash
npm install
```

2. Run both servers:
```bash
npm run dev
```

## Default Users

After setting up the database, you can create users with different roles:

- **User (Farmer)**: Default role for new registrations
- **Admin**: Create manually or through registration with role selection
- **Specialist**: Create manually or through registration with role selection

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Diseases
- `POST /api/diseases/check` - Check disease (upload image or text)
- `GET /api/diseases` - Get all diseases
- `PUT /api/diseases/:id/review` - Review disease (Specialist only)
- `PUT /api/diseases/:id/approve` - Approve disease (Specialist only)

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create medicine (Specialist/Admin)
- `PUT /api/medicines/:id/approve` - Approve medicine (Specialist/Admin)

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/alerts` - Get weather alerts

### Crops
- `GET /api/crops/recommendations` - Get crop recommendations
- `GET /api/crops/by-location` - Get crops by location

### Lands
- `GET /api/lands` - Get all available lands
- `POST /api/lands` - List land for lease
- `PUT /api/lands/:id/lease` - Lease land

## Project Structure

```
crop-disease-advisory/
├── server/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # Uploaded images
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # Utility functions
│   └── public/          # Public assets
└── README.md
```

## Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment

1. Build the React app:
```bash
cd client
npm run build
```

2. Deploy the `build` folder to platforms like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

## Features in Detail

### Disease Detection Workflow
1. User uploads leaf image or enters disease name
2. System predicts disease using ML model (placeholder implementation)
3. Disease request is sent to specialist for review
4. Specialist reviews and approves/rejects
5. Approved diseases get medicine recommendations
6. Medicines are categorized by price (High/Medium/Low)

### Medicine Approval Flow
1. Specialist/Admin creates medicine
2. Medicine status is set to "pending"
3. Specialist reviews and approves
4. Approved medicines are available for recommendations

## Future Enhancements

- Integration with actual ML models for disease detection
- Real-time notifications
- Payment gateway integration
- Advanced analytics dashboard
- Mobile app version
- Multi-language support

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


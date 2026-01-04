const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const mongoURI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/diseases', require('./routes/diseases'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/lands', require('./routes/lands'));
app.use('/api/users', require('./routes/users'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// MongoDB
if (!mongoURI) {
  console.warn('Warning: MONGODB_URI is not set. MongoDB will not be connected.');
} else {
  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set a different PORT or stop the process using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

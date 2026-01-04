const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

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

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hridayeshkothamasu123_db_user:ZOtTIwD5nha706OH@cluster0.fyxovzw.mongodb.net/crop-advisory?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Connection string:', mongoURI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


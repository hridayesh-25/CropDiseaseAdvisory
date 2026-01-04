const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/weather/current
// @desc    Get current weather
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    
    if (!lat && !lon && !city) {
      return res.status(400).json({ message: 'Location (lat/lon or city) is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    let url = 'https://api.openweathermap.org/data/2.5/weather?';
    
    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `q=${city}`;
    }
    
    url += `&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      res.json(response.data);
    } catch (error) {
      // Fallback data if API fails
      res.json({
        main: {
          temp: 25,
          feels_like: 26,
          humidity: 60,
          pressure: 1013
        },
        weather: [{
          main: 'Clear',
          description: 'clear sky'
        }],
        wind: {
          speed: 5
        },
        name: city || 'Unknown'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/weather/alerts
// @desc    Get weather alerts
// @access  Private
router.get('/alerts', auth, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // In production, use actual weather alert API
    // This is a mock response
    const alerts = [
      {
        type: 'storm',
        severity: 'moderate',
        message: 'Thunderstorm warning in your area',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000)
      },
      {
        type: 'flood',
        severity: 'low',
        message: 'Heavy rainfall expected',
        startTime: new Date(Date.now() + 86400000),
        endTime: new Date(Date.now() + 172800000)
      }
    ];

    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


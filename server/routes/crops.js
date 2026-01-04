const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Crop recommendations based on location and season
const cropRecommendations = {
  'tropical': {
    'summer': ['Rice', 'Maize', 'Cotton', 'Sugarcane', 'Banana'],
    'winter': ['Wheat', 'Potato', 'Tomato', 'Onion', 'Carrot'],
    'monsoon': ['Rice', 'Soybean', 'Groundnut', 'Pulses']
  },
  'temperate': {
    'summer': ['Corn', 'Soybean', 'Sunflower', 'Tomato'],
    'winter': ['Wheat', 'Barley', 'Oats', 'Potato'],
    'spring': ['Peas', 'Lettuce', 'Carrots', 'Radish']
  },
  'arid': {
    'summer': ['Millet', 'Sorghum', 'Cotton'],
    'winter': ['Wheat', 'Barley', 'Mustard']
  }
};

// @route   GET /api/crops/recommendations
// @desc    Get crop recommendations based on location and season
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { location, season } = req.query;
    
    // Determine climate zone based on location
    let climateZone = 'tropical'; // default
    if (location) {
      const lowerLoc = location.toLowerCase();
      if (lowerLoc.includes('north') || lowerLoc.includes('cold')) {
        climateZone = 'temperate';
      } else if (lowerLoc.includes('desert') || lowerLoc.includes('arid')) {
        climateZone = 'arid';
      }
    }

    // Determine current season
    const currentMonth = new Date().getMonth() + 1;
    let currentSeason = 'summer';
    if (currentMonth >= 11 || currentMonth <= 2) {
      currentSeason = 'winter';
    } else if (currentMonth >= 6 && currentMonth <= 9) {
      currentSeason = 'monsoon';
    }

    const seasonToUse = season || currentSeason;
    const recommendations = cropRecommendations[climateZone]?.[seasonToUse] || 
                           cropRecommendations[climateZone]?.['summer'] || 
                           ['Rice', 'Wheat', 'Maize'];

    res.json({
      location: location || 'Unknown',
      climateZone,
      season: seasonToUse,
      recommendedCrops: recommendations,
      currentMonth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/crops/by-location
// @desc    Get best crops for a specific location
// @access  Private
router.get('/by-location', auth, async (req, res) => {
  try {
    const { city, state, country } = req.query;
    
    // Mock data - in production, use actual agricultural data
    const locationCrops = {
      'punjab': ['Wheat', 'Rice', 'Cotton', 'Sugarcane'],
      'maharashtra': ['Sugarcane', 'Cotton', 'Soybean', 'Turmeric'],
      'karnataka': ['Coffee', 'Rice', 'Ragi', 'Sugarcane'],
      'tamil nadu': ['Rice', 'Sugarcane', 'Cotton', 'Groundnut']
    };

    const location = (state || city || '').toLowerCase();
    const crops = locationCrops[location] || ['Rice', 'Wheat', 'Maize', 'Pulses'];

    res.json({
      location: city || state || country || 'Unknown',
      bestCrops: crops,
      soilType: 'Alluvial',
      waterRequirement: 'Moderate'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


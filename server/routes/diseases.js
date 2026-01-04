const express = require('express');
const Disease = require('../models/Disease');
const Medicine = require('../models/Medicine');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Disease prediction logic (simplified - in production, use ML model)
const predictDisease = async (diseaseName, imagePath) => {
  // This is a placeholder - in production, integrate with ML model
  const commonDiseases = {
    'leaf spot': { name: 'Leaf Spot', confidence: 0.85 },
    'rust': { name: 'Rust Disease', confidence: 0.80 },
    'blight': { name: 'Blight', confidence: 0.75 },
    'powdery mildew': { name: 'Powdery Mildew', confidence: 0.90 },
    'downy mildew': { name: 'Downy Mildew', confidence: 0.85 }
  };

  if (diseaseName) {
    const lowerName = diseaseName.toLowerCase();
    for (const [key, value] of Object.entries(commonDiseases)) {
      if (lowerName.includes(key)) {
        return value;
      }
    }
  }

  // Default prediction if image is provided
  if (imagePath) {
    return { name: 'Leaf Spot', confidence: 0.75 };
  }

  return { name: 'Unknown Disease', confidence: 0.5 };
};

// @route   POST /api/diseases/check
// @desc    Check disease (upload image or text)
// @access  Private
router.post('/check', auth, upload.single('image'), async (req, res) => {
  try {
    const { cropType, diseaseName, description } = req.body;
    const imagePath = req.file ? req.file.path : '';

    if (!cropType) {
      return res.status(400).json({ message: 'Crop type is required' });
    }

    // Predict disease
    const prediction = await predictDisease(diseaseName, imagePath);

    // Create disease record
    const disease = new Disease({
      user: req.user.id,
      cropType,
      diseaseName: diseaseName || prediction.name,
      image: imagePath,
      description,
      predictedDisease: prediction.name,
      confidence: prediction.confidence,
      status: 'pending'
    });

    await disease.save();

    // Find medicines for this disease (pending specialist approval)
    const medicines = await Medicine.find({
      disease: { $regex: prediction.name, $options: 'i' },
      cropType: { $regex: cropType, $options: 'i' },
      status: 'approved'
    }).sort({ priceCategory: 1 });

    res.status(201).json({
      disease,
      medicines: medicines.length > 0 ? medicines : [],
      message: 'Disease submitted for specialist review'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/diseases
// @desc    Get all diseases (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'user') {
      query.user = req.user.id;
      // Users can see all their diseases including approved ones
    } else if (req.user.role === 'specialist') {
      // Specialists see pending and reviewed diseases (not approved/rejected)
      query.status = { $in: ['pending', 'reviewed'] };
    }

    console.log(`Fetching diseases for ${req.user.role} with query:`, query);

    const diseases = await Disease.find(query)
      .populate('user', 'name email')
      .populate('specialist', 'name email')
      .populate('medicines')
      .sort({ createdAt: -1 });

    console.log(`Found ${diseases.length} diseases for ${req.user.role}`);

    res.json(diseases);
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/diseases/:id
// @desc    Get single disease
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate('user', 'name email')
      .populate('specialist', 'name email')
      .populate('medicines');

    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    // Check access
    if (req.user.role === 'user' && disease.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(disease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/diseases/:id/review
// @desc    Review disease by specialist
// @access  Private/Specialist
router.put('/:id/review', auth, authorize('specialist'), async (req, res) => {
  try {
    const { status, specialistNotes, medicines } = req.body;
    
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    disease.status = status || 'reviewed';
    disease.specialist = req.user.id;
    disease.specialistNotes = specialistNotes || '';
    disease.reviewedAt = new Date();

    if (medicines && Array.isArray(medicines)) {
      disease.medicines = medicines;
    }

    await disease.save();

    const updatedDisease = await Disease.findById(req.params.id)
      .populate('user', 'name email')
      .populate('medicines');

    res.json(updatedDisease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/diseases/:id/approve
// @desc    Approve disease and medicines
// @access  Private/Specialist
router.put('/:id/approve', auth, authorize('specialist'), async (req, res) => {
  try {
    const { medicines } = req.body;
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    disease.status = 'approved';
    disease.specialist = req.user.id;
    disease.reviewedAt = new Date();

    // If medicines are provided, use them; otherwise auto-find medicines
    if (medicines && Array.isArray(medicines) && medicines.length > 0) {
      disease.medicines = medicines;
    } else {
      // Auto-find medicines based on disease and crop type
      const foundMedicines = await Medicine.find({
        $or: [
          { disease: { $regex: disease.predictedDisease || disease.diseaseName, $options: 'i' } },
          { disease: { $regex: '.*', $options: 'i' } } // Fallback to any medicine
        ],
        cropType: { $regex: disease.cropType, $options: 'i' },
        status: 'approved'
      })
      .sort({ priceCategory: 1, price: 1 })
      .limit(9); // Get up to 9 medicines (3 per price category)

      disease.medicines = foundMedicines.map(m => m._id);
    }

    await disease.save();

    const updatedDisease = await Disease.findById(req.params.id)
      .populate('user', 'name email')
      .populate('medicines');

    res.json(updatedDisease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


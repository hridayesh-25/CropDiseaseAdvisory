const express = require('express');
const CropLand = require('../models/CropLand');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/lands
// @desc    Get all available lands
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, city, state, minPrice, maxPrice } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'available';
    }

    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const lands = await CropLand.find(query)
      .populate('owner', 'name email phone')
      .populate('leasedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(lands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/lands/my-lands
// @desc    Get user's lands
// @access  Private
router.get('/my-lands', auth, async (req, res) => {
  try {
    const lands = await CropLand.find({ owner: req.user.id })
      .populate('leasedTo', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(lands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/lands/:id
// @desc    Get single land
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const land = await CropLand.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('leasedTo', 'name email phone');

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    res.json(land);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/lands
// @desc    Create land listing
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const land = new CropLand({
      ...req.body,
      owner: req.user.id
    });

    await land.save();
    const populatedLand = await CropLand.findById(land._id)
      .populate('owner', 'name email phone');

    res.status(201).json(populatedLand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/lands/:id/lease
// @desc    Lease land
// @access  Private
router.put('/:id/lease', auth, async (req, res) => {
  try {
    const { leaseStartDate, leaseEndDate } = req.body;
    
    const land = await CropLand.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.status !== 'available') {
      return res.status(400).json({ message: 'Land is not available' });
    }

    land.status = 'leased';
    land.leasedTo = req.user.id;
    land.leaseStartDate = leaseStartDate || new Date();
    land.leaseEndDate = leaseEndDate;

    await land.save();
    const populatedLand = await CropLand.findById(land._id)
      .populate('owner', 'name email phone')
      .populate('leasedTo', 'name email phone');

    res.json(populatedLand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/lands/:id
// @desc    Update land
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const land = await CropLand.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(land, req.body);
    await land.save();

    const populatedLand = await CropLand.findById(land._id)
      .populate('owner', 'name email phone')
      .populate('leasedTo', 'name email phone');

    res.json(populatedLand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/lands/:id
// @desc    Delete land
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const land = await CropLand.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await land.deleteOne();
    res.json({ message: 'Land deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


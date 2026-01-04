const express = require('express');
const Medicine = require('../models/Medicine');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/medicines
// @desc    Get all medicines
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { disease, cropType, priceCategory, status } = req.query;
    let query = {};

    if (disease) query.disease = { $regex: disease, $options: 'i' };
    if (cropType) query.cropType = { $regex: cropType, $options: 'i' };
    if (priceCategory) query.priceCategory = priceCategory;
    if (status) query.status = status;

    const medicines = await Medicine.find(query).sort({ price: 1 });
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/medicines/:id
// @desc    Get single medicine
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/medicines
// @desc    Create medicine (Specialist/Admin only)
// @access  Private/Specialist/Admin
router.post('/', auth, authorize('specialist', 'admin'), async (req, res) => {
  try {
    const medicine = new Medicine({
      ...req.body,
      approvedBy: req.user.id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/medicines/:id
// @desc    Update medicine
// @access  Private/Specialist/Admin
router.put('/:id', auth, authorize('specialist', 'admin'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/medicines/:id/approve
// @desc    Approve medicine
// @access  Private/Specialist/Admin
router.put('/:id/approve', auth, authorize('specialist', 'admin'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user.id },
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/medicines/:id
// @desc    Delete medicine
// @access  Private/Admin
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


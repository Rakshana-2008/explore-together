const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/users/profile
// @desc Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/users/profile
// @desc Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/users/saved
// @desc Save an experience
router.post('/saved', protect, async (req, res) => {
  const { placeId, name, address, rating, photo, category } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const alreadySaved = user.savedExperiences.find(e => e.placeId === placeId);
    if (alreadySaved) {
      return res.status(400).json({ message: 'Experience already saved' });
    }
    user.savedExperiences.push({ placeId, name, address, rating, photo, category });
    await user.save();
    res.json({ message: 'Experience saved', savedExperiences: user.savedExperiences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/users/saved/:placeId
// @desc Remove a saved experience
router.delete('/saved/:placeId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedExperiences = user.savedExperiences.filter(
      e => e.placeId !== req.params.placeId
    );
    await user.save();
    res.json({ message: 'Experience removed', savedExperiences: user.savedExperiences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/users/saved
// @desc Get all saved experiences
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user.savedExperiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
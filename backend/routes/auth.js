const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate mock OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (in production use Redis)
const otpStore = {};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name, phone, email,
      password: hashedPassword
    });
    // Generate and store OTP
    const otp = generateOTP();
    otpStore[email] = otp;
    console.log(`OTP for ${email}: ${otp}`); // Mock - just logs it
    res.status(201).json({ message: 'OTP sent', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email];
      const user = await User.findOne({ email });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate and store OTP
      const otp = generateOTP();
      otpStore[email] = otp;
      console.log(`OTP for ${email}: ${otp}`); // Mock - just logs it
      res.json({ message: 'OTP sent', email });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
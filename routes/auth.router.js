const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../configs/passport');
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user.model");
const UserLogModel = require('../models/userLog.model');
const LogHelper = require('../utils/logHelper');

const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      { _id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, user: req.user });
  }
);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); 
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (user && user.active_status === '0') {
      return res.status(403).json({
        status: false,
        message: "Tài khoản đã bị khóa, vui lòng liên hệ hỗ trợ.",
      });
    }

    if (!user) {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const username = `user${month}${year}${randomDigits}`;

      user = new User({
        username,
        email,
        full_name: name,
        image_url: picture,
        password: sub, 
      });
      await user.save();
    }

    const systemToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const clientInfo = LogHelper.getClientInfo(req);

      await UserLogModel.create({
        action: 'LOGIN-GG',
        userId: user._id,
        email: user.email,
        role: user.roleId ? user.roleId.name : 'User', 
        ...clientInfo 
      });

    res.json({
      message: "Login successful",
      token: systemToken,
      user: {
        _id: user._id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        image_url: user.image_url,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});


module.exports = router;

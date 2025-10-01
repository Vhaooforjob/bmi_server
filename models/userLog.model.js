const mongoose = require('mongoose');
const db = require('../configs/db');

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  role: { type: String },
  ipAddress: { type: String },
  location: { type: String },
  deviceType: { type: String },
  os: { type: String },
  browser: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const LogModel = db.model('UserLog', logSchema);
module.exports = LogModel;

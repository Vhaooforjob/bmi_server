const mongoose = require('mongoose');
const db = require('../configs/db');

const loggerSchema = new mongoose.Schema({
    method: String,
    path: String,
    timestamp: { type: Date, default: Date.now },
    status: { type: String },
    responseTime: { type: Number }
});

const LoggerModel = db.model('SystemLog', loggerSchema);
module.exports = LoggerModel;

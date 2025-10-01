const mongoose = require('mongoose');
const db = require('./../configs/db');
const { Schema } = mongoose;

const VerificationCodeSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

const VerificationCodeModel = db.model('VerificationCode', VerificationCodeSchema);
module.exports = VerificationCodeModel;

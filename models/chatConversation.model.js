const mongoose = require('mongoose');
const db = require('../configs/db');

const ChatConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, default: 'Tư vấn sức khỏe' },
  model: { type: String, default: process.env.GEMINI_MODEL || 'gemini-2.0-flash' },
  persona: { type: String, default: 'Bạn là chuyên gia dinh dưỡng, tư vấn khoa học, ngắn gọn, tiếng Việt.' },

  contextSnapshot: {
    height_cm: Number,
    weight_kg: Number,
    age_years: Number,
    sex: String,
    activity: String,
    goal: String,
    bmi: Number,
    bmr_kcal: Number,
    tdee_kcal: Number,
    allergies: [String],
    diet: String
  }
}, { timestamps: true });

module.exports = db.model('ChatConversation', ChatConversationSchema);

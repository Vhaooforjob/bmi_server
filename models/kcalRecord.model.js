const mongoose = require('mongoose');
const db = require('../configs/db');

const KcalRecordSchema = new mongoose.Schema({
  height_cm: { type: Number, required: true, min: 80, max: 250 },
  weight_kg: { type: Number, required: true, min: 25, max: 300 },
  age_years: { type: Number, default: 25, min: 12, max: 100 },
  sex:       { type: String, enum: ['male','female','average'], default: 'average' },
  activity:  { type: String, enum: ['sedentary','light','moderate','active','very_active'], default: 'sedentary' },
  meal_split: [{ id: String, name: String, percent: Number }],

  bmi: Number,
  bmi_class: String,
  bmr_kcal: Number,
  tdee_kcal: Number,
  meals: [{ id: String, name: String, percent: Number, kcal: Number }],

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, sparse: true }
}, { timestamps: true });

KcalRecordSchema.index({ userId: 1 }, { unique: true, sparse: true });

module.exports = db.model('KcalRecord', KcalRecordSchema);

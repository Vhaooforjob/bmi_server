const mongoose = require('mongoose');
const db = require('../configs/db');

const ChatMessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', index: true, required: true },
  role: { type: String, enum: ['system','user','model'], required: true },
  text: { type: String, required: true },
  meta: { type: Object }
}, { timestamps: true });

module.exports = db.model('ChatMessage', ChatMessageSchema);

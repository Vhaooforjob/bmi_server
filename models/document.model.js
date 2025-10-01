const mongoose = require('mongoose');
const db = require('./../configs/db');

const documentSchema = new mongoose.Schema({
    title: { type: String,  required: true},
    description: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    file_link: { type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const DocumentModel = db.model('Document', documentSchema);
module.exports = DocumentModel;

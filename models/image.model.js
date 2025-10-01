const mongoose = require('mongoose');
const db = require('./../configs/db');
const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
  },
});
const ImageModel = db.model('Image', ImageSchema);
module.exports = ImageModel;

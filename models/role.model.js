const mongoose = require('mongoose');
const db = require('./../configs/db');
const VALID_PERMISSIONS = require('../utils/permissionsValid');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true,unique: true },
  permissions: [{
    type: String,
    enum: VALID_PERMISSIONS,
  }]
});

const RoleModel = db.model('Role', roleSchema,);
module.exports = RoleModel;
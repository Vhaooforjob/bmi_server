const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const db = require('./../configs/db')
const {Schema} = mongoose;

const emergencyContactSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true }
  });

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String },
    full_name: { type: String, required: true },
    address: { type: String },
    join_date: { type: Date, default: Date.now },
    image_url: { type: String },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
    active_status: { 
        type: String, 
        enum: ['0', '1'],
        default: '1' 
    },
    verified: { type: Boolean, default: true }
});

UserSchema.pre('save', async function(){
    try {
        var user = this;
        const salt = await(bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(user.password,salt);

        user.password = hashpass;

    } catch (error) {
        throw error;
    }
});

UserSchema.methods.comparePassword = async function(userPassword){
    try {
        var user = this;
        const isMatch = await bcrypt.compare(userPassword, user.password);
        return isMatch;
    } catch (error) {
        throw error;
    }

}

const UserModel = db.model('User', UserSchema);

module.exports = UserModel;

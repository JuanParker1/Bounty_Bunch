const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ObjectId = mongoose.Schema.ObjectId;
const Address = require('models/subdocs/address');
const Phone = require('models/subdocs/phone');

const {Schema} = mongoose;

const userSchema = new Schema(
    {
        fullName: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        userName: { type: String },
        gender: { type: String },
        email: { type: String, },
        moduleAccess: [ { type: ObjectId, ref: 'game' } ],
        department: { type: String },
        phoneNumber: { type: Phone },
        address: { type: Address },
        isBot: { type: Boolean, default: false },
        botType: { type: String },
        botAvailability: { type: String, enum: ['Available', 'Engaged'] },
        country: String,
        pincode: Number,
        profileImg: String,
        role: { type: String, enum:['Admin', 'Sub-Admin', 'User', 'Player', 'Bot']},
        status: { type: String, enum:['Inactive', 'Active', 'Locked'], default: 'Active' },
        Password: { type: String, required: true},
        userWallet: { type: String, required: false },
        enable: { type: Boolean, default: true },
        accessToken:{ type: String }
    }
);

module.exports = mongoose.model('User', userSchema);

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Hashing failed", error);
    }
};

module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error("Comparison failed", error);
    }
};
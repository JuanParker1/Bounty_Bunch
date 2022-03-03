const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const ObjectId = mongoose.Schema.ObjectId;
// const Address = require('models/subdocs/address');
// const Phone = require('models/subdocs/phone');

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: { type: String, unique: true },
        fullname: { type: String },
        email: { type: String, },
        phone: { type: String },
        role: { type: String, enum: ['admin', 'sub-admin'] },
        status: { type: String, enum: ['Inactive', 'Active', 'Locked'], default: 'Active' },
        password: { type: String, required: true },
        accessToken: { type: String, default: null },
        // resetPasswordToken: { type: String, default: null },
        // resetPasswordExpires: { type: Date, default: null },
    }
);

module.exports = mongoose.model('Admin', userSchema);

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
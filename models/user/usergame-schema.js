let mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const Address = require('models/subdocs/address');
const Phone = require('models/subdocs/phone');

let userGame = mongoose.Schema({

    loc: { type: Object },
    current_location: { type: Object, },
    name: { type: String },
    username: { type: String },
    email: { type: String },
    gender: { type: String },
    nationality: { type: String },
    bio: { type: String },
    address: { type: String },
    location1: { type: String },
    state: { type: String },
    isoCode: { type: String },
    city: { type: String },
    dynamicLocation: { type: String },
    blockStatus: { type: Boolean },
    blockReason: { type: String },
    blockedActivity: { type: String },
    referralCount: { type: Number },
    notificationStatus: { type: Boolean },
    profilePic: { type: String },
    profileCover: { type: String },
    status: { type: String },
    usertype: { type: String },
    liveStatus: { type: String },
    badge: { type: String },
    kyc: { type: String },
    isSignUpComplete: { type: Number },
    showMeByStatus: { type: String },
    profileStatus: { type: String },
    messageStatus: { type: String },
    emailFlag: { type: Boolean },
    phoneNumberFlag: { type: Boolean },
    nameFlag: { type: Boolean },
    locationFlag: { type: Boolean },
    is_bliss_bundle_package: { type: Boolean },
    extended_bliss_bundle_package_info: { type: Object },
    _id: { type: ObjectId },
    phoneNumber: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
    __v: { type: Number },
    age: { type: Number },
    dob: { type: String },
    is_tweleve_plus: { type: Boolean },
    jwtToken: { type: String },
    password: { type: String },
    referralCode: { type: String },
    referredBy: { type: String },
    userNotificationToken: { type: String },
    connectsStatus: { type: String },
    dobStatus: { type: String },
    locationStatus: { type: String },
    bliss_bundle_package: { type: String, default: '' },
    bliss_bundle_package_end_date: { type: String },
    bliss_bundle_package_info: { type: Object },
    chips: { type: Number }
    
});

let userData = mongoose.Schema({
    fullName: {
        type: String
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    userName: {
        type: String,
    },
    gender: {
        type: String
    },
    email: {
        type: String,
    },
    moduleAccess: [{
        type: ObjectId,
        ref: 'game'
    }],
    department: {
        type: String
    },
    phoneNumber: {
        type: Phone
    },
    address: {
        type: Address
    },
    isBot: {
        type: { type: Boolean },
        default: false
    },
    botType: {
        type: String
    },
    botAvailability: {
        type: String,
        enum: 'Available|Engaged'.split('|')
    },
    country: String,
    pincode: Number,
    profileImg: String,
    role: {
        type: ObjectId,
        ref: 'role'
    },
    status: {
        type: String,
        enum: 'Inactive|Active|Locked'.split('|'),
        default: 'Active'
    },
    hashedPassword: {
        type: String,
        required: false
    },
    salt: {
        type: String,
        required: false
    },
    userWallet: {
        type: String,
        required: false
    },
    enable: {
        type: Boolean,
        default: true
    }

});

const userGamee = mongoose.model('userGame', userGame);
const userDataa = mongoose.model('userData', userData);

module.exports = {
    userGamee, userDataa
}
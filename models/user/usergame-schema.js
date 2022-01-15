let mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const Address = require('models/subdocs/address');
const Phone = require('models/subdocs/phone');

let userGame = mongoose.Schema({

    loc: Object,
    current_location: Object,
    name: String,
    username: String,
    email: String,
    gender: String,
    nationality: String,
    bio: String,
    address: String,
    location1: String,
    state: String,
    isoCode: String,
    city: String,
    dynamicLocation: String,
    blockStatus: Boolean,
    blockReason: String,
    blockedActivity: String,
    referralCount: Number,
    notificationStatus: Boolean,
    profilePic: String,
    profileCover: String,
    status: String,
    usertype: String,
    liveStatus: String,
    badge: String,
    kyc: String,
    isSignUpComplete: Number,
    showMeByStatus: String,
    profileStatus: String,
    messageStatus: String,
    emailFlag: Boolean,
    phoneNumberFlag: Boolean,
    nameFlag: Boolean,
    locationFlag: Boolean,
    is_bliss_bundle_package: Boolean,
    extended_bliss_bundle_package_info: Object,
    _id: ObjectId,
    phoneNumber: String,
    createdAt: String,
    updatedAt: String,
    __v: Number,
    age: Number,
    dob: String,
    is_tweleve_plus: Boolean,
    jwtToken: String,
    password: String,
    referralCode: String,
    referredBy: String,
    userNotificationToken: String,
    connectsStatus: String,
    dobStatus: String,
    locationStatus: String,
    bliss_bundle_package: '',
    bliss_bundle_package_end_date: String,
    bliss_bundle_package_info: Object,
    chips: Number
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
    moduleAccess:[{
        type:ObjectId,
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
        type: Boolean,
        default: false
    },
    botType:{
        type: String
    },
    botAvailability:{
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
    userWallet:{
        type: String,
        required: false
    },
    enable:{
        type:Boolean,
        default: true
    }

});

module.exports = mongoose.model('userGame',userGame);
module.exports = mongoose.model('userData',userData);
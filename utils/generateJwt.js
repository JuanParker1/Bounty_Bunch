require('dotenv').config();

const jwt = require('jsonwebtoken');

const options = {
    expiresIn: '864h',
}


async function Jwt(email, userId, fullname, role) {
    try {
        const payload = { email: email, userId: userId, fullname: fullname, role: role };
        const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
        return { error: false, token: token };
    } catch (error) {
        return { error: true };
    }
}

module.exports = { Jwt };
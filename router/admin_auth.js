const express = require('express');
const router = express.Router();

const Joi = require('joi');
const jwt_decode = require('jwt-decode');

const adminAuthModel = require('../models/admin_auth_schema');
const {Jwt} = require('../utils/generate_access_token')
const verify = require("../middleware/jwt_verification");

const adminAuthSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    fullname: Joi.string().required(),
    username: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required()
});

router.post("/register", async (req, res) => {
    try {
        console.log("body", req.body);
        const admin = await adminAuthSchema.validate(req.body);

        if (admin.error) {
            console.log("error", admin.error);
            return res.status(400).json(
                {
                    "error": true,
                    "message": admin.error.message
                }
            );
        };

        // check if the user details are unique or not
        let email = await adminAuthModel.findOne({ email: admin.value.email });
        if (email) {
            return res.status(400).json({
                "error": true,
                "message": "Email is already in use",
            });
        };

        // check if the user details are unique or not
        let username = await adminAuthModel.findOne({ username: admin.value.username });
        if (username) {
            return res.status(400).json({
                "error": true,
                "message": "Username is already in use",
            });
        };

        let phone = await adminAuthModel.findOne({ phone: admin.value.phone });
        if (phone) {
            return res.status(400).json({
                "error": true,
                "message": "Username is already in use",
            });
        };

        // hash the password
        const hash = await adminAuthModel.hashPassword(admin.value.password);

        //remove the confirmPassword field from the result as we dont need to save this in the db.
        delete admin.value.confirmPassword;
        admin.value.password = hash;

        // save adminAuthModel
        const newAdmin = new adminAuthModel(admin.value);
        await newAdmin.save();

        return res.status(200).json({
            "success": true,
            "message": "Registration Success",
            "admin": newAdmin
        });

    } catch (error) {
        console.error("register-error", error);
        return res.status(500).json({
            "error": true,
            "message": "Cannot Register",
            "reason": error.message
        });
    }
});


router.post ("/login",  async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                error: true,
                message: "Cannot authorize user.",
            });
        }
        //1. Find if any account with that email exists in DB
        const admin = await adminAuthModel.findOne({ username: username });
        // NOT FOUND - Throw error
        if (!admin) {
            return res.status(404).json({
                error: true,
                message: "Account not found",
            });
        }

        //2. Throw error if account is not activated
        if (admin.status === 'Inactive') {
            return res.status(400).json({
                error: true,
                message: "You must activate your account, contact support team!",
            });
        }

        if (admin.status === 'Locked') {
            return res.status(400).json({
                error: true,
                message: "Your account is locked. You can't access the account. contact support team!",
            });
        }

        if (!admin.enable) {
            return res.status(400).json({
                error: true,
                message: "Your account is not enabled. You can't access the account. contact support team!",
            });
        }

        //3. Verify the password is valid
        const isValid = await adminAuthModel.comparePasswords(password, admin.password);
        if (!isValid) {
            return res.status(400).json({
                error: true,
                message: "Invalid credentials",
            });
        }

        //Generate Access token
        const { error, token } = await Jwt(admin.email, admin._id, admin.fullname, admin.role);
        if (error) {
            return res.status(500).json({
                error: true,
                message: "Couldn't create access token. Please try again later",
            });
        }
        admin.accessToken = token;

        await admin.save();

        //Success
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken: token,  //Send it to the client
        });
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({
            error: true,
            message: "Couldn't login. Please try again later.",
            reason: error.message
        });
    }
});

router.post ('/logout', async (req, res) => {
    try {
        const bearerToken = req.rawHeaders[1];
        const decode = jwt_decode(bearerToken);
        
        console.log("token", bearerToken)
        console.log("decoded", decode);
        
        const id = decode.userId;

        let admin = await adminAuthModel.findOne({ _id: id });
        admin.accessToken = null;

        await admin.save();

        return res.json(
            {
                "success": true,
                "message": "User Logged out"
            }
        );

    } catch (error) {
        console.error("logout-error", error);
        return res.status(500).json({
            "error": true,
            "message": error.message,
        });
    }
});

// update password
router.patch('/change-password/:id', verify.verifyTokenAndSuperAdmin, async (req, res) => {
    try {
        console.log("body", req.body);

        const id = req.params.id;
        const role = 'admin'
        const { password, confirmPassword } = req.body;

        const admin = await adminAuthModel.findOne({ _id: id, role: role });
        if (!admin) {
            return res.status(404).json({
                "error": true,
                "message": 'Admin Not Found!'
            })
        } else if (admin.error) {
            console.log('change-status error', admin.error);
            return res.status(400).json({
                "error": true,
                "message": admin.error.message
            })
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                error: "password and confirmPassword does not match"
            })
        } else {
            const hash = await adminAuthModel.hashPassword(password);

            admin.password = hash;

            await admin.save();
        }

        return res.status(200).json({
            "message": "admin status updated.",
            "sub-admin": admin
        });

    } catch (error) {
        console.error("error", error);
        return res.status(500).json({
            "error": true,
            "message": "Something Went Wrong! ",
            "reason": error.message
        });
    }
});

// module.exports = {
//     register, 
//     login,
//     logout
// }

module.exports = router;
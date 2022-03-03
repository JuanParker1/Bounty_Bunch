const express = require('express');
const router = express.Router();

const Joi = require('joi');

const adminAuthModel = require("../models/admin_auth_schema");
const verify = require("../middleware/jwt_verification");

const subAdminAuthSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    fullname: Joi.string().required(),
    username: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required()
});

router.post('/create', verify.verifyTokenAndSuperAdmin, async (req, res) => {

    try {
        // console.log("body", req.body);
        const sub_admin = await subAdminAuthSchema.validate(req.body);
        // console.log("sub-admin", sub_admin);

        if (sub_admin.error) {
            // console.log("error", sub_admin.error);
            return res.status(400).json(
                {
                    "error": true,
                    "message": sub_admin.error.message
                }
            );
        };

        // check if the user details are unique or not
        let email = await adminAuthModel.findOne({ email: sub_admin.value.email });
        if (email) {
            return res.status(400).json({
                "error": true,
                "message": "Email is already in use",
            });
        };

        // check if the user details are unique or not
        let username = await adminAuthModel.findOne({ username: sub_admin.value.username });
        if (username) {
            return res.status(400).json({
                "error": true,
                "message": "Username is already in use",
            });
        };

        let phone = await adminAuthModel.findOne({ phone: sub_admin.value.phone });
        if (phone) {
            return res.status(400).json({
                "error": true,
                "message": "Username is already in use",
            });
        };

        // hash the password
        const hash = await adminAuthModel.hashPassword(sub_admin.value.password);

        //remove the confirmPassword field from the result as we dont need to save this in the db.
        delete sub_admin.value.confirmPassword;
        sub_admin.value.password = hash;

        const role = 'sub-admin';
        sub_admin.value.role = role;

        // save adminAuthModel
        const newsubAdmin = new adminAuthModel(sub_admin.value);
        await newsubAdmin.save();

        return res.status(200).json({
            "success": true,
            "message": "Registration Success",
            "subAdmin": newsubAdmin
        });

    } catch (error) {
        // console.error("register-error", error);
        return res.status(500).json({
            "error": true,
            "message": "Cannot Register",
            "reason": error.message
        });
    }

});

// get all subadmin
router.get('/', verify.verifyTokenAndSuperAdmin, async (req, res) => {
    try{
        const role = 'sub-admin';
        const subAdmin = await adminAuthModel.find({role: role});
        // console.log('sub-admin', subAdmin);
        if(subAdmin.error){
            // console.log("error fetching sub admin", subAdmin.error)
            return res.status(400).json({
                "error": true,
                "message": subAdmin.error.message
            })
        }
        return res.status(200).json({
            "success": true,
            "message": "Data Fetching Successfull",
            "subAdmins": subAdmin
        });

    }catch(error){
        // console.error("error", error);
        return res.status(500).json({
            "error": true,
            "message": "Something Went Wrong!",
            "reason": error.message
        });
    }
})

// get subadmins by id
router.get('/get/:id', verify.verifyTokenAndSuperAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const role = 'sub-admin'
        const subAdmin = await adminAuthModel.findOne({ _id: id, role: role });
        // console.log('sub-admin', subAdmin);
        if (subAdmin.error) {
            // console.log("error fetching sub admin", subAdmin.error)
            return res.status(400).json({
                "error": true,
                "message": subAdmin.error.message
            })
        }
        return res.status(200).json({
            "success": true,
            "message": "Data Fetching Successfull",
            "subAdmins": subAdmin
        });

    } catch (error) {
        // console.error("error", error);
        return res.status(500).json({
            "error": true,
            "message": "Something Went Wrong! ",
            "reason": error.message
        });
    }
})

// enable disable subadmin
router.patch('/change-status/:id', verify.verifyTokenAndSuperAdmin, async (req, res) => {
    try{

        // console.log("body", req.body);

        const id = req.params.id;
        const role = 'sub-admin'
        const {status} = req.body;

        const subAdmin = await adminAuthModel.findOne({ _id: id, role: role });
        if(!subAdmin){
            return res.status(404).json({
                "error": true,
                "message": 'Sub Admin Not Found!'
            })
        }else if(subAdmin.error){
            // console.log('change-status error', subAdmin.error);
            return res.status(400).json({
                "error": true,
                "message": subAdmin.error.message
            })
        }else{
            subAdmin.status = status || subAdmin.status;
            await subAdmin.save();
        }

        return res.status(200).json({
            "message": "sub-admin status updated.",
            "sub-admin": subAdmin
        })

    }catch(error){
        // console.error("error", error);
        return res.status(500).json({
            "error": true,
            "message": "Something Went Wrong! ",
            "reason": error.message
        });
    }
});

// edit sub admin
router.patch('/edit/:id', verify.verifyTokenAndSuperAdmin, async (req, res) => {
    try {

        // console.log("body", req.body);

        const id = req.params.id;
        const role = 'sub-admin'
        const { fullname, username, email, phone } = req.body;

        const subAdmin = await adminAuthModel.findOne({ _id: id, role: role });
        if (!subAdmin) {
            return res.status(404).json({
                "error": true,
                "message": 'Sub Admin Not Found!'
            })
        } else if (subAdmin.error) {
            console.log('change-status error', subAdmin.error);
            return res.status(400).json({
                "error": true,
                "message": subAdmin.error.message
            })
        } else {
            
            subAdmin.fullname = fullname || subAdmin.fullname;
            subAdmin.username = username || subAdmin.username;
            subAdmin.email = email || subAdmin.email;
            subAdmin.phone = phone || subAdmin.phone;

            await subAdmin.save();
        }

        return res.status(200).json({
            "message": "sub-admin status updated.",
            "sub-admin": subAdmin
        });

    } catch (error) {
        // console.error("error", error);
        return res.status(500).json({
            "error": true,
            "message": "Something Went Wrong! ",
            "reason": error.message
        });
    }
});

// update password
router.patch('/change-password/:id', verify.verifyTokenAndSubAdminOrAdmin, async (req, res) => {
    try{
        console.log("body", req.body);

        const id = req.params.id;
        const role = 'sub-admin'
        const { password, confirmPassword } = req.body;

        const subAdmin = await adminAuthModel.findOne({ _id: id, role: role });
        if (!subAdmin) {
            return res.status(404).json({
                "error": true,
                "message": 'Sub Admin Not Found!'
            })
        } else if (subAdmin.error) {
            console.log('change-status error', subAdmin.error);
            return res.status(400).json({
                "error": true,
                "message": subAdmin.error.message
            })
        } else if(password !== confirmPassword){
            return res.status(400).json({
                error: "password and confirmPassword does not match"
            })
        } else {
            const hash = await adminAuthModel.hashPassword(password);

            subAdmin.password = hash;

            await subAdmin.save();
        }

        return res.status(200).json({
            "message": "sub-admin status updated.",
            "sub-admin": subAdmin
        });

    }catch(error){
        console.error("error", error);
        return res.status(500).json({
            "error": true,
            "message": "Something Went Wrong! ",
            "reason": error.message
        });
    }
});

module.exports = router;
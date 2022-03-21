const mongoose = require('mongoose');
const CategoryModel = mongoose.model('gameCategory');
const errors = require('errors/index');
const { CostExplorer } = require('aws-sdk');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

const { awsStorageUploadGameCategory, awsStorageUploadBanner } = require("../../../utils/aws-storage");
const formidable = require("formidable");

const createCategory = async (req, res) => {
    try{
        let form = await new formidable.IncomingForm({multiples: true});
        form.parse(
            req, async (error, fields, files) =>{

                if (error) {
                    return res.json({
                        error: error.message
                    });
                }

                console.log("files", files);

                const categoryDetails = (fields);
                console.log("fileds:", categoryDetails);

                const icon = await awsStorageUploadGameCategory(files.icon);
                console.log("icon:", icon);

                // const banner = await awsStorageUploadBanner(files.banner);
                // console.log("banner:", banner);

                categoryDetails.icon = icon;
                // categoryDetails.banner = banner

                const newGameCategory = await CategoryModel(categoryDetails);
                await newGameCategory.save();

                return res.status(200).json({
                    "message": `game category created succefully`,
                    "New-Banner": newGameCategory
                });
            } 
        );
    }
    catch(error){
        return res.status(500).json(
            {
                "message": "somethin went wrong!",
                "error": error.message
            }
        )
    }
}


async function getCategories(req, res, next) {
    try {
        let query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }
        else {
            query.status = 'Active'
        }
        console.log(query)
        res.data = await CategoryModel.find(query).exec();
        console.log(res.data)
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function deleteCategories(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        res.data = await CategoryModel.remove({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function enableDisableCategories(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("enter valid id");
        }
        let categoryData = await CategoryModel.findOne({ _id: req.params.id }).exec();
        categoryData.status = req.body.enable ? "Active" : "Inactive";
        categoryData.enable = req.body.enable;
        res.data = await categoryData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

const editGameCategory = async (req, res) => {
    try{

        const id = req.params.id;
        
        const gameCategoryData = await CategoryModel.findByIdAndUpdate(id).exec();
        
        let form = await new formidable.IncomingForm({ multiples: true });

        form.parse(
            req, async (error, fields, files) => {

                if (error) {
                    return res.json({
                        error: error.message
                    });
                }

                console.log("fields:", fields);
                console.log("files:", files);

                const categoryDetails = (fields);
                console.log("fileds:", categoryDetails);

                const icon = await awsStorageUploadGameCategory(files.icon);
                console.log("icon:", icon);

                const banner = await awsStorageUploadBanner(files.banner);
                console.log("banner: ", banner);

                gameCategoryData.description = categoryDetails.description;
                gameCategoryData.icon = icon;
                gameCategoryData.banner = banner

                console.log("desc: ", categoryDetails.description);

                // const updatedGameCategory = await gameCategoryData(categoryDetails);
                await gameCategoryData.save();

                return res.status(200).json({
                    "message": `game category created succefully`,
                    "New-Banner": gameCategoryData
                });
            }
        );

    }catch(error){
        return res.status(500).json(
            {
                "message": "somethin went wrong!",
                "error": error.message
            }
        )
    }
}

async function getCategoriesById(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("Send Valid Id")
        }
        res.data = await CategoryModel.findOne({ _id: req.params.id }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

async function getCategoriesByName(req, res, next) {
    try {
        if (!req.params.name) {
            throw new validationError("Send Valid Name")
        }
        res.data = await CategoryModel.find({ name: req.params.name }).exec();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
    }
}

module.exports = {
    createCategory,
    getCategories,
    deleteCategories,
    enableDisableCategories,
    editGameCategory,
    getCategoriesById,
    getCategoriesByName
};
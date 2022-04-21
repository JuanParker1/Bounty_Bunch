const mongoose = require('mongoose');
var CategoryModel = mongoose.model('gameCategory');
const errors = require('errors/index');
const { CostExplorer } = require('aws-sdk');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

const { awsStorageUploadGameCategory, awsStorageUploadBanner } = require("../../../utils/aws-storage");
const formidable = require("formidable");
const multer = require("../../../utils/multer");


// create game category using multer
const createCategory = async (req, res) => {
    multer.uploadGameCategory(req, res, async (error) => {

        console.log("fields", req.body);
        console.log('files', req.file);
        // console.log("request", req);

        if (error) {

            console.log('errors', error);
            return res.status(500).json({
                status: 'fail',
                error: error
            });

        } else {

            // If File not found
            if (req.file === undefined) {
                console.log('uploadProductsImages Error: No File Selected!');
                return res.status(500).json({
                    status: 'fail',
                    message: 'Error: No File Selected'
                });
            } else {

                // If Success
                let fields = req.body
                console.log("Fields:", fields);

                let iconFile = req.file;
                let fileLocation = iconFile.location;

                const newGameCategory = await CategoryModel(
                    fields,
                    fields.icon = fileLocation
                );
                await newGameCategory.save();

                // Save the file name into database
                return res.status(200).json({
                    status: 'ok',
                    gameCategory: newGameCategory,
                });

            }
        }
    });
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
        
        console.log("res.data:>> "+res.data);
       if(res.data.length > 0){
      next();
    }
    else{
      res.status(404).json({
        status: 'fail',
        message: 'no data'
    });
    }
   
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
       if(res.data.length > 0){
      next();
    }
    else{
      res.status(404).json({
        status: 'fail',
        message: 'no data'
    });
    }
   
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
       if(res.data.length > 0){
      next();
    }
    else{
      res.status(404).json({
        status: 'fail',
        message: 'no data'
    });
    }
   
    } catch (ex) {
        errors.handleException(ex, next);
    }
}



// edit game category using multer 
const editGameCategory = async (req, res) => { // not finalized

    // var id = req.params.id;
    // var gameCategoryData = await CategoryModel.findByIdAndUpdate(id).exec();

    // console.log("id:", id)

    multer.uploadGameCategory(req, res, async (error) => {

        console.log("id", req.params);
        console.log("fields", req.body);
        console.log('files', req.file);
        // console.log("fetch:", gameCategoryData);
        // console.log("request", req);

        if (error) {

            console.log('errors', error);
            return res.status(500).json({
                status: 'fail',
                error: error
            });

        } else {

            // If File not found
            if (req.file === undefined) {
                console.log('uploadProductsImages Error: No File Selected!');
                return res.status(500).json({
                    status: 'fail',
                    message: 'Error: No File Selected'
                });
            } else {

                // If Success
                var fields = req.body;
                // console.log("Fields:", fields);

                var iconFile = req.file;
                var fileLocation = iconFile.location;

                fields.icon = fileLocation;

                console.log("newF", fields);

                var id = req.params.id;
                var gameCategoryData = await CategoryModel.findByIdAndUpdate(id, fields);
                console.log("updated:", gameCategoryData);
                // var updatedGameCategory = await gameCategoryData(fields);
                await gameCategoryData.save();
                // console.log("updated:", updatedGameCategory);

                // Save the file name into database
                return res.status(200).json({
                    status: 'ok',
                    gameCategory: gameCategoryData,
                });

            }
        }
    });
}

async function getCategoriesById(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("Send Valid Id")
        }
        res.data = await CategoryModel.findOne({ _id: req.params.id }).exec();
       if(res.data.length > 0){
      next();
    }
    else{
      res.status(404).json({
        status: 'fail',
        message: 'no data'
    });
    }
   
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
       if(res.data.length > 0){
      next();
    }
    else{
      res.status(404).json({
        status: 'fail',
        message: 'no data'
    });
    }
   
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
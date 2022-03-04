const mongoose = require('mongoose');
const CategoryModel = mongoose.model('gameCategory');
const errors = require('errors/index');
const { CostExplorer } = require('aws-sdk');
const validationError = errors.ValidationError;
const UserModel = mongoose.model('user');

module.exports = {
    createCategory,
    getCategories,
    deleteCategories,
    enableDisableCategories,
    editGameCategory,
    getCategoriesById,
    getCategoriesByName

};

async function createCategory(req, res, next) {
    try {
        const category = await CategoryModel(req.body);
        if(category.error){
            res.status(400).json({
                message: "something went wrong!",
                error: category.error.message
            })
        }
        await category.save();
        return res.status(200).json({
            message: "game category created successfully",
            categoryDetail: category
        });
    } catch (ex) {
        errors.handleException(ex, next);
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

async function editGameCategory(req, res, next) {
    try {
        if (!req.params.id) {
            throw new validationError("Send valid Id");
        }
        let gameCategoryData = await CategoryModel.findOne({ _id: req.params.id }).exec();
        gameCategoryData.description = req.body.description;
        if (req.body.icon) {
            gameCategoryData.icon = req.body.icon;
        }
        res.data = await gameCategoryData.save();
        next();
    } catch (ex) {
        errors.handleException(ex, next);
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
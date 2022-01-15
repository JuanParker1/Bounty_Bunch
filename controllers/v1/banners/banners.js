// const mongoose = require('mongoose');
// const BannerModel = mongoose.model('banner');
// const errors = require('errors/index');
// const validationError = errors.ValidationError;

// module.exports = {
//     getBanners,
//     deleteBanner,
//     enableDisableBanners
// };

// async function getBanners(req, res, next) {
//     try {
//         res.data = await BannerModel.find({}).exec();
//         next();
//     } catch (ex) {
//         errors.handleException(ex, next);
//     }
// }

// async function deleteBanner(req, res, next) {
//     try {
//         if (!req.params.id) {
//             throw new validationError("enter valid id");
//         }
//         res.data = await BannerModel.remove({ _id: req.params.id }).exec();
//         next();
//     } catch (ex) {
//         errors.handleException(ex, next);
//     }
// }

// async function enableDisableBanners(req, res, next) {
//     try {
//         if (!req.params.id) {
//             throw new validationError("enter valid id");
//         }
//         let bannerData = await BannerModel.findOne({ _id: req.params.id }).exec();
//         bannerData.status = req.body.enable ? "Active" : "Inactive";
//         bannerData.enable = req.body.enable;
//         res.data = await bannerData.save();
//         next();
//     } catch (ex) {
//         errors.handleException(ex, next);
//     }
// }


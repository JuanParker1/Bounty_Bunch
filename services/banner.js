const {
  addNewBanner,
  getBanners,
  deleteBanner,
  enableDisableBanners,
} = require("../mongoDB/banner");

const { awsStorageUploadBanner } = require("../utils/aws-storage");

const errors = require("errors/index");

var formidable = require("formidable");

const CreateBanners = async (req, res) => {
  try {

    var form = await new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (error, fields, files) => {

      if (error) {
        return res.json({
          error: error.message
        });
      }

      // console.log("fileds", fields);
      // console.log('files:', files);

      const bannerDetails = (fields);
      console.log('bannerDetailes:', bannerDetails);

      var filedata = await awsStorageUploadBanner(files.banners);
      console.log("filename:", filedata);
      bannerDetails.banners = filedata;

      const newBanner = await addNewBanner(bannerDetails);

      return res.status(200).json({
        "message": `banner added to database successfully`,
        "New-Banner": newBanner
      });

    });
  } catch (error) {
    return res.status(500).json(
      {
        message: `something went wrong`,
        error: error.message
      }
    )
  }
};


const GetBanners = async (req, res, next) => {
  try {
    res.data = await getBanners();
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const DeleteBanner = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new validationError("enter valid id");
    }
    res.data = await deleteBanner(req.params.id);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

const EnableDisableBanners = async (req, res, next) => {
  console.log(req.params.id);
  try {
    if (!req.params.id) {
      throw new validationError("enter valid id");
    }

    res.data = await enableDisableBanners(req.params.id, req);
    next();
  } catch (ex) {
    errors.handleException(ex, next);
  }
};

module.exports = {
  // createBanners,
  CreateBanners,
  GetBanners,
  DeleteBanner,
  EnableDisableBanners,
};

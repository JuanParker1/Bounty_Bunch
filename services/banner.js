const {
  addNewBanner,
  getBanners,
  deleteBanner,
  enableDisableBanners,
  getBannersByType
} = require("../mongoDB/banner");

const { awsStorageUploadBanner } = require("../utils/aws-storage");

const errors = require("errors/index");

var formidable = require("formidable");

const multer = require("../utils/multer");


// create banner using multer
const CreateBanners = async (req, res) => {
  multer.uploadBanners(req, res, async (error) => {
    
    console.log("fields", req.body);
    console.log('files', req.files);
    // console.log("fields:", req.body);
    
    if (error) {
      console.log('errors', error);
      return res.status(500).json({
        status: 'fail',
        error: error
      });

    } else {
      // If File not found
      if (req.files === undefined) {
        console.log('uploadProductsImages Error: No File Selected!');
        return res.status(500).json({
          status: 'fail',
          message: 'Error: No File Selected'
        });
      } else {
        
        // If Success
        let fields = req.body
        console.log("bannerFields:", fields);

        let bannerFileArray = req.files;
        let fileLocation;
        let images = [];

        for (let i = 0; i < bannerFileArray.length; i++) {
          fileLocation = bannerFileArray[i].location;
          console.log('filename:', fileLocation);
          images.push(fileLocation)
        }
        
        const newBanner = await addNewBanner(
          fields.bannerType = req.body.bannerType || "",
          fields.typeId = req.body.typeId || "",
          fields.gameCategory = req.gameCategory || "",
          fields.gameName = req.body.gameName || "", 
          fields.banners = images
        );

        // Save the file name into database
        return res.status(200).json({
          status: 'ok',
          banners : newBanner,
          // filesArray: bannerFileArray,
          // locationArray: images
        });

      }
    }
  });
}


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

const GetBannersByType = async (req, res, next) => {
  try {

    var reqType = req.params.type;
    console.log("reqType:  >> "+reqType);
    res.data = await getBannersByType(reqType);
   
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
  GetBannersByType
};

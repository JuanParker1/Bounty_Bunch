const {
  addNewBanner,
  getBanners,
  deleteBanner,
  enableDisableBanners,
} = require("../mongoDB/banner");

const errors = require("errors/index");

const CreateBanners = async (req, res, next) => {
  try {
    const gameCategory =
      req.body.gameCategory === "" ? null : req.body.gameCategory;
    const gameName = req.body.gameName === "" ? null : req.body.gameName;

    res.data = await addNewBanner({
      bannerType: req.body.bannerType,
      status: "Active",
      enable: true,
      banners: req.body.banners,
      gameCategory: gameCategory,
      gameName: gameName,
    });
    next();
  } catch (err) {
    res.json({ message: err });
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
  CreateBanners,
  GetBanners,
  DeleteBanner,
  EnableDisableBanners,
};

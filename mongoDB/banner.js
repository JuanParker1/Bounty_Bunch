const Banner = require("./../models/banners/banner-schema");

const addNewBanner = async (bannerDetails) => {
  const banner = new Banner(bannerDetails);
  return Promise.resolve(await banner.save());
};

const getBanners = async () => {
  const banner = await Banner.find({});
  return Promise.resolve(banner);
};

const deleteBanner = async (id) => {
  return Promise.resolve(Banner.remove({ _id: id }).exec());
};

const enableDisableBanners = async (id, req) => { 
  console.log(id);
  let bannerData = await Banner.findOne({ _id: id }).exec();

  bannerData.status = req.body.enable ? "Active" : "Inactive";
  bannerData.enable = req.body.enable;
  return Promise.resolve(await bannerData.save());
};

module.exports = {
  addNewBanner,
  getBanners,
  deleteBanner,
  enableDisableBanners,
};

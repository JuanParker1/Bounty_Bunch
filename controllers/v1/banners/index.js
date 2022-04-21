const {
  CreateBanners,
  GetBanners,
  DeleteBanner,
  EnableDisableBanners,
  GetBannersByType
} = require("../../../services/banner");

module.exports = [
  {
    path: "/",
    method: "post",
    allUsers: true,
    controller: CreateBanners,
  },

  {
    path: "/get-banners",
    method: "get",
    allUsers: true,
    controller: GetBanners,
  },
  {
    path: "/:id/delete",
    method: "delete",
    allUsers: true,
    controller: DeleteBanner,
  },
  {
    path: "/:id/enable-disable-banner",
    method: "put",
    allUsers: true,
    controller: EnableDisableBanners,
  },
  {
    path: "/:type/get-banners-by-type",
    method: "get",
    allUsers: true,
    controller: GetBannersByType,
  },
];

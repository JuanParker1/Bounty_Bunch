const bannerController = require('./banners');

module.exports = [
    {
        path: '/',
        method: 'post',
        allUsers: true,
        controller: bannerController.createBanners
    },

    {
        path: '/get-banners',
        method: 'get',
        allUsers: true,
        controller: bannerController.getBanners
    },
    {
        path: '/:id/delete',
        method: 'delete',
        allUsers: true,
        controller: bannerController.deleteBanner
    },
    {
        path: '/:id/enable-disable-banner',
        method: 'put',
        allUsers: true,
        controller: bannerController.enableDisableBanners
    },
]
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    region: 'ap-south-1',
    accessKeyId: "AKIAYHB5H3RQUI6PBELB",
    secretAccessKey: "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"
});

exports.uploadBanners = multer({

    storage: multerS3({
        s3: s3,
        // acl: 'public-read',
        bucket: 'bounty-bunch-banners',
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'banners/' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = file.originalname;
            callBack(null, fullPath)
        }
    }),
    limits: { fileSize: 5000000 }, // In bytes: 2000000 bytes = 5 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }

}).array('banners', 10);



exports.uploadGameCategory = multer({

    storage: multerS3({
        s3: s3,
        // acl: 'public-read',
        bucket: 'bounty-bunch-game-category',
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'banners/' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = file.originalname;
            callBack(null, fullPath)
        }
    }),
    // limits: { fileSize: 10000000 }, // In bytes: 10000000 bytes = 10 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }

}).single('icon');




exports.uploadTournamentImage = multer({

    storage: multerS3({
        s3: s3,
        // acl: 'public-read',
        bucket: 'bounty-bunch-game-category',
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'banners/' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = file.originalname;
            callBack(null, fullPath)
        }
    }),
    limits: { fileSize: 5000000 }, // In bytes: 2000000 bytes = 5 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }

}).single('images');



exports.uploadGameCategory = multer({

    storage: multerS3({
        s3: s3,
        // acl: 'public-read',
        bucket: 'bounty-bunch-game-category',
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            // var fullPath = 'banners/' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            var fullPath = file.originalname;
            callBack(null, fullPath)
        }
    }),
    // limits: { fileSize: 10000000 }, // In bytes: 10000000 bytes = 10 MB
    // fileFilter: function (req, file, cb) {
    //     checkFileType(file, cb);
    // }

}).single('icon');
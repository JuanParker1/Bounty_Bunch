const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  region: 'ap-south-1',
  accessKeyId: "AKIAYHB5H3RQUI6PBELB",
  secretAccessKey: "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"
});

// async function awsStorageCreate(file, destFileName) {
//   console.log("name", file.type);
//   let type = file.type.split('/')[1];
//   let uploadParams = { Bucket: 'gameadminimages', Key: destFileName+'.'+type, Body: '' };
//   let rawData = fs.readFileSync(file.path);
//   // rawData.on('error', function (err) {
//   //     console.log('File Error', err);
//   // });
//   const data = rawData.toString('base64');
//   // console.log("rawData:", data);
//   uploadParams.Body = data;
//   uploadParams.ContentEncoding = 'base64';
//   uploadParams.ContentType = `images/${type}`;
//   s3.upload(uploadParams, function (error, data) {
//     if (error) {
//       console.log(error);
//     }
//     else if (data) {
//       //   response.write(JSON.stringify({status: 200, uri: data.Location}));
//       console.log(data.Location);
//       return data.Location;
//     }
//     else {
//       //   response.write('{"status": 442, "message": "Yikes! Error saving your photo. Please try again."}');
//       //   return response.end();
//       console.log("412");
//     }
//   });

//   // fs.readFile(data.path, function (error, file_buffer) {
//   //     console.log("buffer:", file_buffer);
//   //     let params = {
//   //         Bucket: 'bountybunch',
//   //         Key: data.name,
//   //         // Body: Buffer.from(file_buffer, 'base64'),
//   //         Body: file_buffer,
//   //         ContentType: 'image/jpeg'

//   //     };

//   //     // let awsUpload = await s3.upload(params).promise();
//   //     s3.upload(params, function (err, result) {
//   //         console.log("aws upload", result, result.Location);
//   //         callback(err, result.Location);
//   //         if (err) {
//   //             console.error(err);
//   //         }
//   //     })
//   // })

//   // console.log("aws upload", awsUpload, awsUpload.Location);
//   // return awsUpload.Location;
// }

const awsStorageUploadImage = async (file) => {
  let urlLink = '';

  let uploadParams = { Bucket: 'gameadminimages', Key: '', Body: '' };

  let fileStream = fs.createReadStream(file.path);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });

  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(`${file.path}_${file.name}`);

  // call S3 to retrieve upload file to specified bucket
  urlLink = await s3.upload(uploadParams).promise();

  console.log(urlLink)

  return urlLink.Location;
}

const awsStorageUploadBanner = async (file) => {
  let urlLink = '';

  let uploadParams = { Bucket: 'bounty-bunch-banners', Key: '', Body: '' };

  let fileStream = fs.createReadStream(file.path);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });

  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(`${file.path}_${file.name}`);

  // call S3 to retrieve upload file to specified bucket
  urlLink = await s3.upload(uploadParams).promise();

  console.log(urlLink)

  return urlLink.Location;
}

const awsStorageUploadGameCategory = async (file) => {
  let urlLink = '';

  let uploadParams = { Bucket: 'bounty-bunch-game-category', Key: '', Body: '' };

  let fileStream = fs.createReadStream(file.path);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });

  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(`${file.path}_${file.name}`);

  // call S3 to retrieve upload file to specified bucket
  urlLink = await s3.upload(uploadParams).promise();

  console.log(urlLink)

  return urlLink.Location;
}

const awsStorageUploadApk = async (file) => {
  let urlLink = '';

  let uploadParams = { Bucket: 'bountybunch-apk-bucket', Key: '', Body: '' };

  let fileStream = fs.createReadStream(file.path);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });

  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(`${file.path}_${file.name}`);

  // call S3 to retrieve upload file to specified bucket
  urlLink = await s3.upload(uploadParams).promise();

  console.log(urlLink)

  return urlLink.Location;
}

//call S3 to create the bucket
const createS3Bucket = async () => {
  
  try {
      // Create the parameters for calling createBucket
      let bucketParams = {
          Bucket: 'bountybunch-apk-bucket'
      };

      // call S3 to create the bucket
      s3.createBucket(bucketParams, function (err, data) {
          if (err) {
              console.log("Error", err);
          } else {
              console.log("Success", data.Location);
          }
      });
  } catch (err) {
      console.log("Error", err);
  }
};

const listBuckets = async () => {
  let datas = [];
  try {
      // Call S3 to list the buckets
      s3.listBuckets(function (err, data) {
          if (err) {
              console.log("Error", err);
          } else {
              console.log("Success", data.Buckets);
              datas = data.Buckets
          }
      });
      console.log("Success", datas);
      return datas
  } catch (err) {
      console.log("Error", err);
  }
};

module.exports = {
  awsStorageUploadImage,
  awsStorageUploadBanner,
  awsStorageUploadGameCategory,
  awsStorageUploadApk,
  listBuckets,
  createS3Bucket
}
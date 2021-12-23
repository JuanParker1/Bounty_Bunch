const AWS = require('aws-sdk');
const fs = require('fs');
var path = require('path');

// const s3 = new AWS.S3({
//   region: 'ap-south-1',
//   accessKeyId: "AKIAUHGCFUEZLQTCXGWO",
//   secretAccessKey: "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"
// });

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

const awsStorageCreate = async (file) => {
  var urlLink = '';

  var uploadParams = { Bucket: 'gameadminimages', Key: '', Body: '' };

  var fileStream = fs.createReadStream(file.path);
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

module.exports = {
  awsStorageCreate
}
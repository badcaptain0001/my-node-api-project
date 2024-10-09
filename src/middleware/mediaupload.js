const multer = require("multer");
const S3 = require("aws-sdk/clients/s3");

const s3 = new S3({
  endpoint: "https://usc1.contabostorage.com/canulo",
  accessKeyId: "8fe5f069ca4c4b50bd74c7adf18fcf75",
  secretAccessKey: "90ea5d8271241f37b3e248ecee1843ff",
  s3BucketEndpoint: true,
  publicReadAccess: true,
});

let upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000 * 1024 * 1024, //not more than 100mb
  },
});

const uploadToS3 = (file, userid) => {
  if (!file) {
    return null;
  } else {
    return new Promise((resolve, reject) => {
      let newFileName;
      const folder = "zois";
      if (userid) {
         newFileName = userid + "." + file.originalname.split(".")[1];
      }
      const params = {
        Bucket: "canulo",
        Key: newFileName ? folder + "/" + newFileName : folder + "/" + file.originalname,
        Body: file.buffer,
        ACL: "public-read",
        ContentDisposition: "inline",
        ContentType: file.mimetype,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
};

module.exports = { upload, uploadToS3 };

const Banner = require("../models/bannerModel");
const { upload, uploadToS3 } = require("../middleware/mediaupload");
const uuid = require("uuid");
const {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  failureResponse,
} = require("../middleware/responseTemplate");

exports.uploadBanner = [
  upload.fields([{ name: "bannerUrls", maxCount: 5 }]),
  async (req, res) => {
    try {
      const {
        workerPhone,
        lat,
        lng,
        bannerHeight,
        bannerWidth,
        bannerType,
        bannerStatus,
        nameOfSite,
      } = req.body;
      const uid = uuid.v4();
      const bannerUrlsData = [];
      const files = req.files["bannerUrls"];
      const user = await User.findOne({ phone: workerPhone });
      if (!user) {
        return failureResponse(res, "User not found");
      } else {
        for (let i = 0; i < files.length; i++) {
          const bannerUrl = req.files["bannerUrls"][i];
          const bannerUrlData = await uploadToS3(bannerUrl, uid).then(
            (data) => {
              let format = uid + "." + data.Key.split(".")[1];
              return (
                "https://usc1.contabostorage.com/f49065475849480fbcd19fb8279b2f98:canulo/zois/" +
                format
              );
            }
          );
          bannerUrlsData.push(bannerUrlData);
        }
        const newBanner = new Banner({
          bannerUrls: bannerUrlsData,
          workerId: user.uid,
          workerName: user.fullName,
          workerPhone: user.phone,
          bannerLocation: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          bannerHeight,
          bannerWidth,
          bannerType,
          bannerStatus,
          dimensions: `${bannerHeight}x${bannerWidth}`,
          nameOfSite,
          role: user.role,
        });
        newBanner.save().then((data) => {
          return successResponse(res, "Banner uploaded successfully", data);
        });
      }
    } catch (err) {
      return failureResponse(res, err.message);
    }
  },
];

const User = require("../models/userModel");
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
          bannerId: uuid.v4(),
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

// get banners by workerId

exports.getBanners = async (req, res) => {
  try {
    const { workerId } = req.params;
    const banners = await Banner.find({ workerId });
    if (banners.length === 0) {
      return notFoundResponse(res, "No banners found");
    } else {
      return successResponse(res, "Banners retrieved successfully", banners);
    }
  } catch (err) {
    return failureResponse(res, err.message);
  }
};

// get all banners

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    if (banners.length === 0) {
      return notFoundResponse(res, "No banners found");
    } else {
      return successResponse(res, "Banners retrieved successfully", banners);
    }
  } catch (err) {
    return failureResponse(res, err.message);
  }
}

// get banner by bannerId

exports.getBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const banner = await Banner.findOne({ bannerId });
    if (!banner) {
      return notFoundResponse(res, "Banner not found");
    } else {
      return successResponse(res, "Banner retrieved successfully", banner);
    }
  }
  catch (err) {
    return failureResponse(res, err.message);
  }
}

// getbannerbylocation

exports.getBannerByLocation = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const banners = await Banner.find({
      bannerLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 10000,
        },
      },
    });
    if (banners.length === 0) {
      return notFoundResponse(res, "No banners found");
    } else {
      return successResponse(res, "Banners retrieved successfully", banners);
    }
  } catch (err) {
    return failureResponse(res, err.message);
  }
};
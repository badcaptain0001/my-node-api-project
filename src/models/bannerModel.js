const moongoose = require("mongoose");
const userSchema = new moongoose.Schema({
  bannerId: { type: String, required: false },
  date: { type: Date, default: Date.now },
  bannerUrls: { type: Array, required: false },
  workerId: { type: String, required: false },
  workerName: { type: String, required: false },
  workerPhone: { type: String, required: false },
  bannerLocation: { type: Object, required: false },
  bannerHeight: { type: String, required: false },
  bannerWidth: { type: String, required: false },
  bannerType: { type: String, required: false },
  bannerStatus: { type: String, required: false },
  dimensions: { type: String, required: false },
  nameOfSite: { type: String, required: false },
  role: { type: String, required: false },
});

module.exports = moongoose.model("banner", userSchema);

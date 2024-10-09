const moongoose = require("mongoose");
const userSchema = new moongoose.Schema({
  uid: { type: String, required: false },
  fullName: { type: String, required: false },
  phone: { type: String, required: false, unique: true },
  pin: { type: Number, required: false },
  role: { type: String, required: false },
  address: { type: String, required: false },
  state: { type: String, required: false },
  city: { type: String, required: false },
  pincode: { type: String, required: false },
  status: { type: String, required: false, default: "active" },
  profilePicture: { type: String, required: false },
  idProof: { type: String, required: false },
  aadharCard: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

module.exports = moongoose.model("users", userSchema);

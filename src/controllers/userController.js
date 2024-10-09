const User = require("../models/userModel");
const { upload, uploadToS3 } = require("../middleware/mediaupload");
const {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  failureResponse,
} = require("../middleware/responseTemplate");
const uuid = require("uuid");


exports.loginUser = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return badRequestResponse(res, "User not found");
    }
    if (user.pin !== pin) {
      return unauthorizedResponse(res, "Invalid pin");
    }
    res.json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(400).json({ message: "Error logging in user" });
  }
};

exports.workerOnboarding = [
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        fullName,
        phone,
        role,
        address,
        aadharCard,
        state,
        city,
        pincode,
      } = req.body;
      const user = await User.findOne({ phone: phone });
      if (user) {
        return successResponse(res, "User already exists", user);
      }
      const uid = uuid.v4();
      const profilePicture = req.files["profilePicture"][0];
      const idProof = req.files["idProof"][0];
      const pin = Math.floor(1000 + Math.random() * 9000);

      const profilePictureData = await uploadToS3(profilePicture, uid).then(
        (data) => {
          let format = uid + "." + data.Key.split(".")[1];
          return (
            "https://usc1.contabostorage.com/f49065475849480fbcd19fb8279b2f98:canulo/zois/" +
            format
          );
        }
      );

      const idProofData = await uploadToS3(idProof, uid).then((data) => {
        let format = uid + "." + data.Key.split(".")[1];
        return (
          "https://usc1.contabostorage.com/f49065475849480fbcd19fb8279b2f98:canulo/zois/" +
          format
        );
      });

      const newUser = new User({
        fullName,
        phone,
        role,
        address,
        profilePicture: profilePictureData,
        idProof: idProofData,
        uid,
        pin,
        aadharCard,
        state,
        city,
        pincode,
      });

      await newUser.save();

      successResponse(res, "User created and files uploaded successfully", {
        newUser,
        profilePictureData,
        idProofData,
      });
    } catch (error) {
      failureResponse(res, error.message);
    }
  },
];

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();
    successResponse(res, "All users fetched", users);
  } catch (error) {
    failureResponse(res, error.message);
  }
}


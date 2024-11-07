const User = require("../models/userModel");
const { upload, uploadToS3 } = require("../middleware/mediaupload");
const {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  failureResponse,
} = require("../middleware/responseTemplate");

exports.registerUser = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      pin,
      role,
      address,
      state,
      city,
      pincode,
      aadharCard,
      bankDetails,
      perSqFtPrice,
      totalSqFt,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return badRequestResponse(res, "User already exists");
    }

    const newUser = new User({
      fullName,
      phone,
      pin,
      role,
      address,
      state,
      city,
      pincode,
      aadharCard,
      bankDetails,
      perSqFtPrice,
      totalSqFt,
    });

    await newUser.save();

    successResponse(res, "User created successfully", newUser);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    // Find the user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return badRequestResponse(res, "User not found");
    }

    // Verify the pin
    if (user.pin !== pin) {
      return unauthorizedResponse(res, "Invalid pin");
    }

    successResponse(res, "User logged in successfully", user);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);

    successResponse(res, "Users fetched successfully", users);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    successResponse(res, "User fetched successfully", user);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      address,
      state,
      city,
      pincode,
      perSqFtPrice,
      totalSqFt,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        address,
        state,
        city,
        pincode,
        perSqFtPrice,
        totalSqFt,
      },
      { new: true }
    );

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    successResponse(res, "User updated successfully", user);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    successResponse(res, "User deleted successfully");
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.getUserWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    successResponse(res, "User wallet fetched successfully", user.wallet);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.updateUserWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance, transaction } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "wallet.balance": balance,
          "wallet.transaction": transaction,
        },
      },
      { new: true }
    );

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    successResponse(res, "User wallet updated successfully", user.wallet);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

exports.uploadProfilePicture = [
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const profilePicture = await uploadToS3(req.file, id);

      const user = await User.findByIdAndUpdate(
        id,
        { profilePicture },
        { new: true }
      );

      if (!user) {
        return notFoundResponse(res, "User not found");
      }

      successResponse(res, "Profile picture uploaded successfully", {
        profilePictureUrl: user.profilePicture,
      });
    } catch (error) {
      failureResponse(res, error.message);
    }
  },
];

exports.uploadIDProof = [
  upload.single("idProof"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const idProof = await uploadToS3(req.file, id);

      const user = await User.findByIdAndUpdate(
        id,
        { idProof },
        { new: true }
      );

      if (!user) {
        return notFoundResponse(res, "User not found");
      }

      successResponse(res, "ID proof uploaded successfully", {
        idProofUrl: user.idProof,
      });
    } catch (error) {
      failureResponse(res, error.message);
    }
  },
];
const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserWallet,
  updateUserWallet,
  uploadProfilePicture,
  uploadIDProof,
} = require('../controllers/userController');

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get All Users
router.get('/', getAllUsers);

// Get User by ID
router.get('/:id', getUserById);

// Update User
router.put('/:id', updateUser);

// Delete User
router.delete('/:id', deleteUser);

// Get User's Wallet
router.get('/:id/wallet', getUserWallet);

// Update User's Wallet
router.put('/:id/wallet', updateUserWallet);

// Upload Profile Picture
router.post('/:id/profile-picture', uploadProfilePicture);

// Upload ID Proof
router.post('/:id/id-proof', uploadIDProof);

module.exports = router;
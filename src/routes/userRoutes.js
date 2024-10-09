const express = require('express');
const { getUsers, createUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.post('/register', createUser);
router.post('/login', loginUser);

module.exports = router;

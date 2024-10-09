const express = require('express');
const {loginUser,workerOnboarding,allUsers } = require('../controllers/userController');

const router = express.Router();
router.post('/login', loginUser);
router.post('/worker', workerOnboarding);
router.get('/allworker', allUsers);

module.exports = router;

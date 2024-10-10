const express = require('express');
const {uploadBanner,getAllBanners,getBanners,getBanner } = require('../controllers/bannerController');

const router = express.Router();
router.post('/uploadbanner', uploadBanner);
router.get('/getallbanners', getAllBanners);
router.get('/getbanners/:workerId', getBanners);
router.get('/getbanner/:bannerId', getBanner);

module.exports = router;

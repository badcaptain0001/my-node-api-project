const express = require("express");
const {
  createJob,
  updateLocationInJob,
} = require("../controllers/jobController");

const router = express.Router();

// Register User
router.post("/create-job", createJob);
router.post("/update-location/:jobId/:locationId", updateLocationInJob);

module.exports = router;

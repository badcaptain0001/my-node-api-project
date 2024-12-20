const Job = require("../models/jobModal");
const { upload, uploadToS3 } = require("../middleware/mediaupload");
const uuid = require("uuid");
const {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  failureResponse,
} = require("../middleware/responseTemplate");

exports.createJob = async (req, res) => {
  try {
    const {
      jobName,
      clientName,
      jobStartDate,
      jobEndDate,
      jobType,
      totalSqFtJob,
      jobPricePerSqFt,
      jobTotalPrice,
      jobWorkers,
      jobSupervisors,
    } = req.body;

    const newJob = new Job({
      jobName,
      clientName,
      jobStartDate,
      jobEndDate,
      jobType,
      totalSqFtJob,
      jobPricePerSqFt,
      jobTotalPrice,
      jobWorkers,
      jobSupervisors,
    });

    await newJob.save();

    successResponse(res, "Job created successfully", newJob);
  } catch (error) {
    failureResponse(res, error.message);
  }
};

// update location in job by job id

exports.updateLocationInJob = [
  upload.single("locationPicture"),
  async (req, res) => {
    try {
      const { jobId, locationId } = req.params;
      const { locationName, sqFtWorked } = req.body;

      // Find the job by ID
      const job = await Job.findById(jobId);
      if (!job) {
        return notFoundResponse(res, "Job not found");
      }

      // Find the location within the job
      let locationFound = false;
      job.jobWorkers.forEach((worker) => {
        worker.locations.forEach(async (location) => {
          if (location._id.toString() === locationId) {
            locationFound = true;
            // Update the location details
            if (locationName) location.locationName = locationName;
            if (sqFtWorked) location.sqFtWorked = sqFtWorked;

            // If a new picture is uploaded, upload it to S3 and update the location
            if (req.file) {
              const locationPicture = await uploadToS3(req.file, uuid.v4());
              location.picturesTaken.push({ url: locationPicture });
            }
          }
        });
      });

      if (!locationFound) {
        return notFoundResponse(res, "Location not found");
      }

      // Save the updated job
      await job.save();

      successResponse(res, "Location updated successfully", job);
    } catch (error) {
      failureResponse(res, error.message);
    }
  },
];

const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema({
  pictureUrls: { type: [String], required: false },
  picturedAt: { type: Date, default: Date.now },
});

const locationSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  picturesTaken: { type: [pictureSchema], required: false },
  sqFtWorked: { type: Number, required: true },
});

const workerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  aadharCard: { type: String, required: false },
  locations: { type: [locationSchema], required: false },
  totalSqFtWorked: { type: Number, required: false, default: 0 },
  totalAmount: { type: Number, required: false, default: 0 },
  workApproval: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, default: Date.now },
});

const jobSchema = new mongoose.Schema({
  jobName: { type: String, required: true },
  clientName: { type: String, required: true },
  jobStartDate: { type: Date, required: true },
  jobEndDate: { type: Date, required: false },
  jobStatus: { type: String, required: false, default: "active" },
  jobType: { type: String, required: true },
  totalSqFtJob: { type: Number, required: true },
  jobPricePerSqFt: { type: Number, required: true },
  jobTotalPrice: { type: Number, required: true },
  jobWorkers: { type: [workerSchema], required: false },
  jobSupervisors: { type: [String], required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);

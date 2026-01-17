import JobPostingService from '../services/jobPosting.service.js';

/*
  ENDPOINTS (/api/v1/jobs)
    POST   /
    GET    /
    GET    /:jobId
    GET    /my-jobs
    PATCH  /:jobId
    PATCH  /:jobId/close
    PATCH  /:jobId/open
*/

// POST /
const createJob = async (req, res) => {
  try {
    const employerId = req.user._id;
    const jobData = req.body;

    const job = await JobPostingService.createJob(employerId, jobData);

    const responseObj = {
      success: true,
      data: job
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// GET /
const getJobs = async (req, res) => {
  try {
    const query = req.query;

    const jobs = await JobPostingService.getJobs(query, query);

    const responseObj = {
      success: true,
      data: jobs,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// GET /:jobId
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await JobPostingService.getJobById(jobId);

    const responseObj = {
      success: true,
      data: job,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// GET /my-jobs
const getMyJobs = async (req, res) => {
  try {
    const employerId = req.user._id;

    const jobs = await JobPostingService.getEmployerJobs(employerId);

    const responseObj = {
      success: true,
      data: jobs,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// PATCH /:jobId
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const employerId = req.user._id;
    const updates = req.body;

    const job = await JobPostingService.updateJob(jobId, employerId, updates);

    const responseObj = {
      success: true,
      data: job
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// PATCH /:jobId/close
const archiveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const employerId = req.user._id;

    const job = await JobPostingService.archiveJob(jobId, employerId);

    const responseObj = {
      success: true,
      data: job,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
} 

// PATCH /:jobId/open
const restoreJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const employerId = req.user._id;

    const job = await JobPostingService.restoreJob(jobId, employerId);

    const responseObj = {
      success: true,
      data: job,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  archiveJob,
  restoreJob
}
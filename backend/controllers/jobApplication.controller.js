import JobApplicationService from '../services/jobApplication.service.js';

/*
  ENDPOINTS (api/v1/applications)
    POST /
    GET /job/:jobPostingId
    PATCH /:applicationId/status
    GET /me
*/

// POST /
const applyToJob = async (req, res) => {
  try {
    const { jobPostingId, resumeId, coverLetter } = req.body;
    const userId = req.user._id;

    const apply = await JobApplicationService.apply(userId, jobPostingId, resumeId, coverLetter);

    const responseObj = {
      success: true,
      data: apply
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /job/:jobPostingId
const getApplicantsByJob = async (req, res) => {
  try {
    const { jobPostingId } = req.params;
    const userId = req.user._id;

    const applicants = await JobApplicationService.getApplicantsByJob(jobPostingId, userId);

    const responseObj = {
      success: true,
      data: applicants
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

// PATCH /:applicationId/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const apply = await JobApplicationService.updateStatus(applicationId, userId, status);

    const responseObj = {
      success: true,
      data: apply
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /me
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await JobApplicationService.getMyApplications(userId);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  applyToJob,
  getApplicantsByJob,
  updateApplicationStatus,
  getMyApplications,
};
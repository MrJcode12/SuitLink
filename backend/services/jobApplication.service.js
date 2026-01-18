import JobApplication from '../models/JobApplication.js';
import JobPosting from '../models/JobPosting.js';
import ApplicantProfile from '../models/ApplicantProfile.js';
import CompanyProfile from '../models/CompanyProfile.js';
import NotificationService from './notification.service.js';

/*
  ENDPOINTS (api/v1/applications)
    POST /
    GET /job/:jobPostingId
    PATCH /:applicationId/status
    GET /me
*/

class JobApplicationService {

  // POST /
  static async apply(userId, jobPostingId, resumeId, coverLetter) {
    const applicantProfile = await ApplicantProfile.findOne({ user: userId });
    if (!applicantProfile) {
      throw new Error('Applicant profile not found');
    }

    const jobPosting = await JobPosting.findById(jobPostingId);
    if (!jobPosting) {
      throw new Error('Job posting not found');
    }

    if (jobPosting.status !== 'open') {
      throw new Error('Job is no longer accepting applications');
    }

    const resume = applicantProfile.resumes.id(resumeId);
    if (!resume) {
      throw new Error('Selected resume does not belong to applicant');
    }

    const application = await JobApplication.create({
      jobPosting: jobPosting._id,
      applicant: applicantProfile._id,
      employer: jobPosting.employer,
      company: jobPosting.company,
      resumeUsed: resumeId,
      coverLetter,
    });

    await CompanyProfile.findByIdAndUpdate(
      jobPosting.company,
      { $inc: { 'metrics.totalApplicants': 1 }}
    );

    await NotificationService.create({
      user: jobPosting.employer,
      type: 'NEW_APPLICATION',
      title: 'New job application',
      message: 'A new applicant has applied to your job posting.',
      data: {
        jobPostingId: jobPosting._id,
        applicationId: application._id,
      },
    });

    return application;
  }

  // GET /job/:jobPostingId
  static async getApplicantsByJob(jobPostingId, employerUserId) {
    const jobPosting = await JobPosting.findOne({
      _id: jobPostingId,
      employer: employerUserId,
    });

    if (!jobPosting) {
      throw new Error('Unauthorized access to job applicants');
    }

    return JobApplication.find({ jobPosting: jobPostingId })
      .populate({
        path: 'applicant',
        select: 'firstName lastName skills experience resumeAnalysis',
      })
      .sort({ createdAt: -1 });
  }

  // PATCH /:applicationId/status
  static async updateStatus(applicationId, employerUserId, status) {

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    if (application.employer.toString() !== employerUserId.toString()) {
      throw new Error('Unauthorized to update this application');
    }

    application.status = status;
    await application.save();

    const applicantProfile = await ApplicantProfile.findById(application.applicant);
    
    await NotificationService.create({
      user: applicantProfile.user,
      type: 'APPLICATION_STATUS_UPDATE',
      title: 'Application status updated',
      message: `Your application has been ${status}.`,
      data: {
        applicationId: application._id,
        status,
      },
    });

    return application;
  }

  // GET /me
  static async getMyApplications(userId) {
    const applicantProfile = await ApplicantProfile.findOne({ user: userId });
    if (!applicantProfile) {
      throw new Error('Applicant profile not found');
    }

    return JobApplication.find({ applicant: applicantProfile._id })
      .populate({
        path: 'jobPosting',
        select: 'title employmentType location',
      })
      .populate({
        path: 'company',
        select: 'companyName logo',
      })
      .sort({ createdAt: -1 });
  }
}

export default JobApplicationService;
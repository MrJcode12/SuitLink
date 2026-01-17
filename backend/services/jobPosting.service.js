import JobPosting from '../models/JobPosting.js';
import CompanyProfile from '../models/CompanyProfile.js'

/*
  ENDPOINTS (/api/v1/jobs)
    POST /
    GET /
    GET /:jobId
    GET /my-jobs
    PATCH /:jobId
    PATCH /:jobId/close
    PATCH /:jobId/open
*/


class JobPostingService {

  // POST /
  static async createJob(employerId, jobData) {
    const company = await CompanyProfile.findOne({ user: employerId });

    if (!company) {
      throw new Error('Company profile not found');
    }

    const job = await JobPosting.create({
      ...jobData,
      employer: employerId,
      company: company._id,
    });

    return job;
  }

  // GET /
  static async getJobs(filters = {}, pagination = {}) {
    const { employmentType, remote, salaryMin, salaryMax } = filters;
    const { page = 1, limit = 10 } = pagination;
    const query = { status: 'open' };

    if (employmentType?.length) {
      query.employmentType = { $in: employmentType };
    }

    if (remote !== undefined) {
      query.remote = remote;
    }

    if (salaryMin) {
      query['salaryRange.min'] = { $gte: salaryMin };
    }

    if (salaryMax) {
      query['salaryRange.max'] = { $lte: salaryMax };
    }

    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      JobPosting.find(query)
        .populate('company', 'companyName logo industry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      JobPosting.countDocuments(query),
    ]);

    return {
      jobs,
      pagination : {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET /:jobId
  static async getJobById(jobId) {
    const job = await JobPosting.findOne({ _id: jobId, status: 'open' })
      .populate('company', 'companyName description logo industry location');
    
      if (!job) {
        throw new Error('Job not found');
      }
    
    return job;
  }

  // GET /my-jobs
  static async getEmployerJobs(employerId) {
    const jobs = await JobPosting.find({ employer: employerId }).sort({ createdAt: -1 });

    return jobs;
  }

  // PATCH /:jobId
  static async updateJob(jobId, employerId, updates) {
    const job = await JobPosting.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    if (!job.employer.equals(employerId)) {
      throw new Error('Unauthorized!')
    }

    delete updates.employer;
    delete updates.company;
    delete updates.status;

    Object.assign(job, updates);
    await job.save();

    return job;
  }

  // PATCH /:jobId/close
  static async archiveJob(jobId, employerId) {
    const job = await JobPosting.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    if (!job.employer.equals(employerId)) {
      throw new Error('Unauthorized!');
    }

    job.status = 'closed';
    await job.save();

    return job;
  }

  // PATCH /:jobId/open
  static async restoreJob(jobId, employerId) {
    const job = await JobPosting.findById(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    if (!job.employer.equals(employerId)) {
      throw new Error('Unauthorized!');
    }

    job.status = 'open';
    await job.save();

    return job;
  }
}

export default JobPostingService;
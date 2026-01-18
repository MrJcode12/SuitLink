import JobPosting from "../models/JobPosting.js";
import CompanyProfile from "../models/CompanyProfile.js";

class JobPostingService {
  // Helper: Update company metrics
  static async updateCompanyMetrics(companyId) {
    const [totalJobs, activeJobs] = await Promise.all([
      JobPosting.countDocuments({ company: companyId }),
      JobPosting.countDocuments({ company: companyId, status: "open" }),
    ]);

    await CompanyProfile.findByIdAndUpdate(companyId, {
      $set: {
        "metrics.jobPostsCount": totalJobs,
        "metrics.activeJobsCount": activeJobs,
      },
    });
  }

  // POST /
  static async createJob(employerId, jobData) {
    const company = await CompanyProfile.findOne({ user: employerId });

    if (!company) {
      throw new Error("Company profile not found");
    }

    const job = await JobPosting.create({
      ...jobData,
      employer: employerId,
      company: company._id,
    });

    await CompanyProfile.findByIdAndUpdate(company._id, {
      $inc: {
        "metrics.jobPostsCount": 1,
        "metrics.activeJobsCount": 1,
      },
    });

    return job;
  }

  // GET /
  static async getJobs(filters = {}, pagination = {}) {
    const { employmentType, remote, salaryMin, salaryMax } = filters;
    const { page = 1, limit = 10 } = pagination;
    const query = { status: "open" };

    // Handle employmentType filter (can be single value or array)
    if (employmentType) {
      if (Array.isArray(employmentType)) {
        query.employmentType = { $in: employmentType };
      } else {
        query.employmentType = employmentType;
      }
    }

    // Handle remote filter
    if (remote !== undefined && remote !== null && remote !== "") {
      query.remote = remote === "true" || remote === true;
    }

    // Handle salary filters
    if (salaryMin) {
      query["salaryRange.min"] = { $gte: Number(salaryMin) };
    }

    if (salaryMax) {
      query["salaryRange.max"] = { $lte: Number(salaryMax) };
    }

    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      JobPosting.find(query)
        .populate({
          path: "company",
          select: "companyName logo industry location credibilityScore"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      JobPosting.countDocuments(query),
    ]);

    return {
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  // GET /:jobId
  static async getJobById(jobId) {
    const job = await JobPosting.findById(jobId).populate({
      path: "company",
      select: "companyName description logo industry location credibilityScore"
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  }

  // GET /my-jobs
  static async getEmployerJobs(employerId) {
    const jobs = await JobPosting.find({ employer: employerId })
      .populate("company", "companyName credibilityScore")
      .sort({ createdAt: -1 });

    return jobs;
  }

  // PATCH /:jobId
  static async updateJob(jobId, employerId, updates) {
    const job = await JobPosting.findById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    if (!job.employer.equals(employerId)) {
      throw new Error("Unauthorized!");
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
      throw new Error("Job not found");
    }

    if (!job.employer.equals(employerId)) {
      throw new Error("Unauthorized!");
    }

    job.status = "closed";
    await job.save();

    // Update metrics after closing
    await this.updateCompanyMetrics(job.company);

    return job;
  }

  // PATCH /:jobId/open
  static async restoreJob(jobId, employerId) {
    const job = await JobPosting.findById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    if (!job.employer.equals(employerId)) {
      throw new Error("Unauthorized!");
    }

    const oldStatus = job.status;

    job.status = "open";
    await job.save();

    if (oldStatus === "closed") {
      await CompanyProfile.findByIdAndUpdate(job.company, {
        $inc: { "metrics.activeJobsCount": 1 },
      });
    }
    job.status = "open";
    await job.save();

    // Update metrics after reopening
    await this.updateCompanyMetrics(job.company);

    return job;
  }
}

export default JobPostingService;

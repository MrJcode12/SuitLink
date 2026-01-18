import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
    index: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApplicantProfile',
    required: true,
    index: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  resumeUsed: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'accepted'],
    default: 'pending',
    index: true,
  },
}, { timestamps: true });


jobApplicationSchema.index({ jobPosting: 1, applicant: 1 }, { unique: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description required'],
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  remote: {
    type: Boolean,
    default: false
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'PHP',
    }
  },
  requirements: {
    skills: [String],
    experienceYears: Number,
    educationLevel: String
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, { timestamps: true });

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

export default JobPosting;
import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  companyName: {
    type: String,
    trim: true,
    required: [true, 'Company name required!'],
  },
  description: {
    type: String,
  },
  industry: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  logo: {
    publicId: String,
    url: String,
  },
  credibilityScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  metrics: {
    jobPostsCount: {
      type: Number, 
      default: 0,
    },
    activeJobsCount: {
      type: Number,
      default: 0,
    },
    totalApplicants: {
      type: Number,
      default: 0,
    },
  }

}, { timestamps: true });

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

export default CompanyProfile;
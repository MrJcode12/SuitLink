import mongoose from 'mongoose';
import educationSchema from './subdocuments/Education.js';
import experienceSchema from './subdocuments/Experience.js';
import resumeSchema from './subdocuments/Resume.js';

const applicantProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name required!'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name required!'],
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: {
    type: [String],
    default: [],
  },
  resumes: [resumeSchema],
  profileImage: {
    publicId: String,
    url: String,
  },
  resumeParsed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const ApplicantProfile = mongoose.model('ApplicantProfile', applicantProfileSchema);

export default ApplicantProfile;
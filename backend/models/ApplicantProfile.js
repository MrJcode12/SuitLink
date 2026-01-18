import mongoose from "mongoose";
import educationSchema from "./subdocuments/Education.js";
import experienceSchema from "./subdocuments/Experience.js";
import resumeSchema from "./subdocuments/Resume.js";

const applicantProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name required!"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name required!"],
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
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
    resumeAnalysis: {
      score: {
        type: Number,
      },
      seniority: {
        type: String,
        enum: ["Junior", "Mid", "Senior"],
      },
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      suggestions: {
        type: [String],
        default: [],
      },
    },
    resumeAnalyzedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ApplicantProfile = mongoose.model(
  "ApplicantProfile",
  applicantProfileSchema
);

export default ApplicantProfile;

import ApplicantProfileService from "../services/applicantProfile.service.js";
import { parseResume } from "../utils/resumeParser.utils.js";
import { extractResumeData } from '../services/gemini.service.js';

/* 
ENDPOINTS (/api/v1/applicant/)
  MAIN 
    POST /profile - create profile
    GET /profile - get own profile
    PATCH /profile - update some of the fields 
    PUT /profile/avatar - replacing the avatar entirely with a picture
  
  EDUCATION (subdocument)
    POST /education 
    PATCH /education/:educationId
    DELETE /education/:educationId

  EXPERIENCE (subdocument)
    POST /experience
    PATCH /experience/:experienceId
    DELETE /experience/:experienceId
  
  RESUME (cloudinary)
    POST /resume
    DELETE /resume/:resumeId    
*/

// POST /profile
const createProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;

    const profile = await ApplicantProfileService.createProfile(userId, payload);

    const responseObj = {
      success: true,
      data: profile,
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// GET /profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await ApplicantProfileService.getProfile(userId);

    const responseObj = {
      success: true,
      data: profile,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    })
  }
}

// PATCH /profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;

    const profile = await ApplicantProfileService.updateProfile(userId, payload);

    const responseObj = {
      success: true,
      data: profile,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// POST /education
const createEducation = async (req, res) => {
  try {
    const userId = req.user._id;
    const educationData = req.body;

    const education = await ApplicantProfileService.addEducation(userId, educationData);

    const responseObj = {
      success: true,
      data: education,
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// PATCH /education/:educationId
const updateEducation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { educationId } = req.params;
    const updateData = req.body;

    const education = await ApplicantProfileService.updateEducation(userId, educationId, updateData);

    const responseObj = {
      success: true,
      data: education,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// DELETE /education/:educationId
const deleteEducation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { educationId } = req.params;

    const education = await ApplicantProfileService.deleteEducation(userId, educationId);

    const responseObj = {
      success: true,
      data: education,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// POST /experience
const createExperience = async (req, res) => {
  try {
    const userId = req.user._id;
    const experienceData = req.body;

    const experience = await ApplicantProfileService.addExperience(userId, experienceData);

    const responseObj = {
      success: true,
      data: experience,
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// PATCH /experience/:experienceId
const updateExperience = async (req, res) => {
  try {
    const userId = req.user._id;
    const { experienceId } = req.params;
    const updateData = req.body;

    const experience = await ApplicantProfileService.updateExperience(userId, experienceId, updateData);

    const responseObj = {
      success: true,
      data: experience
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// DELETE /experience/:experienceId
const deleteExperience = async (req, res) => {
  try {
    const userId = req.user._id;
    const { experienceId } = req.params;

    const experience = await ApplicantProfileService.deleteExperience(userId, experienceId);

    const responseObj = {
      success: true,
      data: experience,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// POST /resume
const uploadResume = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      throw new Error('Resume file is required.');
    }

    const resume = await ApplicantProfileService.uploadResume(userId, req.file);
    const parsedText = await parseResume(req.file);

    const extractedData = await extractResumeData(parsedText);

    await ApplicantProfileService.updateProfile(userId, { 
      skills: extractedData.skills || [],
      resumeParsed: true 
    });

    const responseObj = {
      success: true,
      data: {
        resume,
        extractedData
      },
    };

    res.status(201).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

const deleteResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const { resumeId } = req.params;

    const resumes = await ApplicantProfileService.deleteResume(userId, resumeId);

    const responseObj = {
      success: true,
      data: resumes,
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
  createProfile,
  getProfile,
  updateProfile,
  createEducation,
  updateEducation,
  deleteEducation,
  createExperience,
  updateExperience,
  deleteExperience,
  uploadResume,
  deleteResume
};
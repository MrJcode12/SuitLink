import ApplicantProfile from "../models/ApplicantProfile.js";
import cloudinary from '../config/cloudinaryApplicant.config.js';

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

class ApplicantProfileService {
  
  // POST /profile
  static async createProfile(userId, payload) {
    const exists = await ApplicantProfile.findOne({ user: userId });

    if (exists) {
      throw new Error('Applicant profile already exists.');
    };

    const profile = await ApplicantProfile.create({
      user: userId,
      ...payload
    });

    return profile;
  }

  // GET /profile
  static async getProfile(userId) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    };

    return profile;
  }

  // PATCH /profile
  static async updateProfile(userId, payload) {
    if ('user' in payload) {
      delete payload.user;
    }

    const profile = await ApplicantProfile.findOneAndUpdate({ user: userId }, { $set: payload }, { new: true });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    };

    return profile;
  }

  // POST /education
  static async addEducation(userId, educationData) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    }

    profile.education.push(educationData);
    await profile.save();

    return profile.education;
  }

  // PATCH /education/:educationId
  static async updateEducation(userId, educationId, updateData) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    }

    const education = profile.education.id(educationId);
    
    if (!education) {
      throw new Error('Education entry not found.');
    }

    Object.assign(education, updateData);
    await profile.save();

    return education;
  }

  // DELETE /education/educationId
  static async deleteEducation(userId, educationId) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    }

    const education = profile.education.id(educationId);

    if (!education) {
      throw new Error('Education entry not found.');
    }

    education.deleteOne();
    await profile.save();

    return profile.education;
  }

  // POST /experience
  static async addExperience(userId, experienceData) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    };

    profile.experience.push(experienceData);
    await profile.save();

    return profile.experience;
  }

  // PATCH /experience/:experienceId
  static async updateExperience(userId, experienceId, updateData) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    }

    const experience = profile.experience.id(experienceId);

    if (!experience) {
      throw new Error('Experience entry not found.');
    };

    Object.assign(experience, updateData);
    await profile.save();

    return experience;
  }

  // DELETE /experience/:experienceId
  static async deleteExperience(userId, experienceId) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    }

    const experience = profile.experience.id(experienceId);

    if (!experience) {
      throw new Error('Experience entry not found.');
    }

    experience.deleteOne();
    await profile.save();

    return profile.experience;
  }

  // POST /resume
  static async uploadResume(userId, file) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    }

    if (profile.resumes.length > 0) {
      const oldResume = profile.resumes[0];

      await cloudinary.uploader.destroy(oldResume.publicId, {
        resource_type: 'raw'
      });

      profile.resumes = [];
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'resumes'
        },
        (err, res) => {
          if (err) reject(err);
          resolve(res);
        }
      ).end(file.buffer);
    });

    profile.resumes.push({
      fileName: file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
    });

    await profile.save();
    return profile.resumes;
  }

  // DELETE /resume/:resumeId
  static async deleteResume(userId, resumeId) {
    const profile = await ApplicantProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Applicant profile not found.');
    }

    const resume = profile.resumes.id(resumeId);
    
    if (!resume) {
      throw new Error('Resume not found.');
    }

    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: 'raw'
    });

    resume.deleteOne();
    await profile.save();

    return profile.resumes;
  }
}

export default ApplicantProfileService;
import CompanyProfile from "../models/CompanyProfile.js";
import { calculateCompanyCredibility } from "../utils/calculateCompanyCredibility.utils.js";
import { uploadCompanyLogo, deleteCompanyLogo } from '../utils/companyLogoUploader.utils.js';

/*
  ENDPOINTS (/api/v1/company/) 
    POST /profile 
    GET /profile
    PATCH /profile
    DELETE /profile
    PUT /profile/logo 
*/

class CompanyProfileService {

  // POST /profile
  static async createProfile(userId, payload) {
    const exists = await CompanyProfile.findOne({ user: userId });

    if (exists) {
      throw new Error('Company profile already exists.');
    }
    
    const profile = await CompanyProfile.create({ user: userId, ...payload });

    profile.credibilityScore = calculateCompanyCredibility(profile);
    await profile.save();

    return profile;
  }

  // GET /profile
  static async getProfile(userId) {
    const profile = await CompanyProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Company profile not found.');
    }

    return profile;
  }

  // PATCH /profile
  static async updateProfile(userId, payload) {
    const forbiddenFields = ['user', 'credibilityScore', 'metrics'];

    forbiddenFields.forEach(field => {
      if (field in payload) {
        delete payload[field];
      }
    });

    const profile = await CompanyProfile.findOneAndUpdate({ user: userId }, { $set: payload }, {new: true });

    if (!profile) {
      throw new Error('Company profile not found.');
    };

    profile.credibilityScore = calculateCompanyCredibility(profile);
    await profile.save();

    return profile;
  }

  // DELETE /profile
  static async deleteProfile(userId) {
    const profile = await CompanyProfile.findOne({ user: userId });

    if (!profile) {
      throw new Error('Company profile not found.');
    }

    await CompanyProfile.deleteOne({ user: userId });

    return { message: 'Company profile deleted successfully. '};
  }

  // PUT /profile/logo
  static async uploadLogo(userId, file) {
    if (!file) {
      throw new Error('Company logo image is required.');
    }

    const profile = await CompanyProfile.findOne({ user: userId });

    if(!profile) {
      throw new Error('Company profile not found.');
    }

    // delete old logo if it exists
    if (profile.logo?.publicId) {
      await deleteCompanyLogo(profile.logo.publicId);
    }

    // upload new logo
    const uploadedLogo = await uploadCompanyLogo(file.buffer);

    profile.logo = uploadedLogo

    profile.credibilityScore = calculateCompanyCredibility(profile);
    await profile.save();

    return profile;
  }
}

export default CompanyProfileService;
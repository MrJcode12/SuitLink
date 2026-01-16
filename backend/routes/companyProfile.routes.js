import { Router } from 'express';
import requireAuth from '../middlewares/auth.middleware.js';
import requireRole from '../middlewares/requireRole.middleware.js';
import { companyLogoUpload } from '../config/companyLogoUpload.config.js';


import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  uploadCompanyLogo
} from '../controllers/companyProfile.controller.js';

const companyProfileRouter = Router();

companyProfileRouter.post('/profile', requireAuth, requireRole('employer'),createProfile);
companyProfileRouter.get('/profile', requireAuth, requireRole('employer'), getProfile);
companyProfileRouter.patch('/profile', requireAuth, requireRole('employer'), updateProfile);
companyProfileRouter.delete('/profile', requireAuth, requireRole('employer'), deleteProfile);
companyProfileRouter.put('/profile/logo', requireAuth, requireRole('employer'), companyLogoUpload.single('logo'), uploadCompanyLogo);

export default companyProfileRouter;
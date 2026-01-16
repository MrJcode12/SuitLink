import { Router } from 'express';
import requireAuth from '../middlewares/auth.middleware.js';
import requireRole from '../middlewares/requireRole.middleware.js';
import uploadResumeMiddleware from '../middlewares/uploadResume.middleware.js';

import {
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
} from '../controllers/applicantProfile.controller.js';

const applicantProfileRouter = Router();

applicantProfileRouter.use(requireAuth, requireRole('applicant'));

applicantProfileRouter.post('/profile', createProfile);
applicantProfileRouter.get('/profile', getProfile);
applicantProfileRouter.patch('/profile', updateProfile);

applicantProfileRouter.post('/education', createEducation);
applicantProfileRouter.patch('/education/:educationId', updateEducation);
applicantProfileRouter.delete('/education/:educationId', deleteEducation);

applicantProfileRouter.post('/experience', createExperience);
applicantProfileRouter.patch('/experience/:experienceId', updateExperience);
applicantProfileRouter.delete('/experience/:experienceId', deleteExperience);

applicantProfileRouter.post('/resume', uploadResumeMiddleware.single('resume'), uploadResume);
applicantProfileRouter.delete('/resume/:resumeId', deleteResume);


export default applicantProfileRouter;
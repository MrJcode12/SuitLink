import { Router } from 'express';
import requireAuth from '../middlewares/auth.middleware.js';
import requireRole from '../middlewares/requireRole.middleware.js';

import {
  applyToJob,
  getApplicantsByJob,
  updateApplicationStatus,
  getMyApplications,
} from '../controllers/jobApplication.controller.js';

/*
  ENDPOINTS (api/v1/applications)
    POST /
    GET /job/:jobPostingId
    PATCH /:applicationId/status
    GET /me
*/


const jobApplicationRouter = Router();

jobApplicationRouter.use(requireAuth);

jobApplicationRouter.post('/', requireRole('applicant'), applyToJob);
jobApplicationRouter.get('/me', requireRole('applicant'), getMyApplications);
jobApplicationRouter.get('/job/:jobPostingId', requireRole('employer'), getApplicantsByJob);
jobApplicationRouter.patch('/:applicationId/status', requireRole('employer'), updateApplicationStatus);

export default jobApplicationRouter;
import { Router } from 'express';
import requireAuth from '../middlewares/auth.middleware.js';
import requireRole from '../middlewares/requireRole.middleware.js';

import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  archiveJob,
  restoreJob
} from '../controllers/jobPosting.controller.js';

const jobPostingRouter = Router();

jobPostingRouter.use(requireAuth);

jobPostingRouter.get('/', getJobs);
jobPostingRouter.get('/my-jobs', requireRole('employer'), getMyJobs);

jobPostingRouter.get('/:jobId', getJobById);

jobPostingRouter.post('/', requireRole('employer'), createJob);
jobPostingRouter.patch('/:jobId', requireRole('employer'), updateJob);
jobPostingRouter.patch('/:jobId/close', requireRole('employer'), archiveJob);
jobPostingRouter.patch('/:jobId/open', requireRole('employer'), restoreJob);

export default jobPostingRouter;
import { Router } from 'express';
import requireAuth from '../middlewares/auth.middleware.js';

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/notification.controller.js';

const notificationRouter = Router();

notificationRouter.use(requireAuth);

notificationRouter.get('/', getMyNotifications);
notificationRouter.patch('/:notificationId/read', markNotificationAsRead);
notificationRouter.patch('/read-all', markAllNotificationsAsRead);

export default notificationRouter;
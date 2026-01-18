import NotificationService from "../services/notification.service.js";

/*
  ENDPOINTS (/api/v1/notifications)
    GET    /
    PATCH  /:notificationId/read
    PATCH  /read-all
*/

// GET / 
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await NotificationService.getUserNotifications(userId);

    const responseObj = {
      success: true,
      data: notifications,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// PATCH /:notificationId/read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await NotificationService.markAsRead(notificationId, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    const responseObj = {
      success: true,
      data: notification,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

// PATCH /read-all
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await NotificationService.markAllAsRead(userId);

    const responseObj = {
      success: true,
      message: 'All notifications marked as read',
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
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
}
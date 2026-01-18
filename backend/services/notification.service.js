import Notification from "../models/Notification.js";


class NotificationService {
  static async create(payload) {
    const notif = await Notification.create(payload);

    return notif;
  }

  static async getUserNotifications(userId) {
    const notif = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(20);

    return notif;
  }

  static async markAsRead(notificationId, userId) {
    const notif = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    return notif;
  }

  static async markAllAsRead(userId) {
    return Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    )
  }
}

export default NotificationService;
import notificationsApi from "../api/notificationConfig";

const notificationsService = {
  // Get all notifications (latest 20)
  getNotifications: async () => {
    return notificationsApi.get("/");
  },

  // Mark single notification as read
  markNotificationRead: async (notificationId) => {
    return notificationsApi.patch(`/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    return notificationsApi.patch("/read-all");
  },
};

export default notificationsService;

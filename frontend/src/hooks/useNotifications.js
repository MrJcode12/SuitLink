import { useState, useEffect, useCallback } from "react";
import notificationsService from "../services/notificationsService";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Computed: Check if there are unread notifications
  const hasUnread = notifications.some((n) => !n.isRead);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await notificationsService.getNotifications();

      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark single notification as read (optimistic UI)
  const markAsRead = async (notificationId) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      )
    );

    try {
      await notificationsService.markNotificationRead(notificationId);
      // Success - state already updated optimistically
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // Revert optimistic update on failure
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: false } : notif
        )
      );
    }
  };

  // Mark all notifications as read (optimistic UI)
  const markAllAsRead = async () => {
    // Store original state for rollback
    const originalNotifications = [...notifications];

    // Optimistic update
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );

    try {
      await notificationsService.markAllNotificationsRead();
      // Success - state already updated optimistically
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      // Revert optimistic update on failure
      setNotifications(originalNotifications);
      setError("Failed to mark all as read");
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };

  // Clear notifications (for logout/user switch)
  const clearNotifications = () => {
    setNotifications([]);
    setError(null);
  };

  return {
    notifications,
    loading,
    error,
    hasUnread,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    clearNotifications,
  };
};

export default useNotifications;

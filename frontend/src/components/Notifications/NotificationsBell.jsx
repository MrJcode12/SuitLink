import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationsPanel from "./NotificationsPanel";
import useNotifications from "../../hooks/useNotifications";

const NotificationsBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    loading,
    error,
    hasUnread,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={togglePanel}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-500 hover:text-gray-900 transition-colors" />

        {/* Unread indicator dot */}
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <NotificationsPanel
          notifications={notifications}
          loading={loading}
          error={error}
          onClose={closePanel}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </div>
  );
};

export default NotificationsBell;

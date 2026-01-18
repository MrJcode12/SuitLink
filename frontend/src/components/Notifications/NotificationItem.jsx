import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const NotificationItem = ({ notification, onMarkAsRead, onClose }) => {
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "";
    }
  };

  const handleClick = async () => {
    // Mark as read if unread
    if (!notification.isRead) {
      await onMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    handleNavigation(notification.type, notification.data);

    // Close the popup
    onClose();
  };

  const handleNavigation = (type, data) => {
    switch (type) {
      case "APPLICATION_STATUS_UPDATE":
        // Navigate to applications page
        navigate("/applications");
        break;

      case "NEW_APPLICATION":
        // Applicant should not navigate to employer pages
        // Just mark as read and stay on current page
        break;

      default:
        // Unknown type - do nothing
        break;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
        !notification.isRead ? "bg-emerald-50/30" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Unread indicator dot */}
        {!notification.isRead && (
          <span className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2 mb-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500">{formatTime(notification.createdAt)}</p>
        </div>
      </div>
    </button>
  );
};

export default NotificationItem;

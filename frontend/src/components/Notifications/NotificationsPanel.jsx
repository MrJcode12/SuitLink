import { useEffect, useRef } from "react";
import { X, BellOff } from "lucide-react";
import NotificationItem from "./NotificationItem";

const NotificationsPanel = ({
  notifications,
  loading,
  error,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const panelRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-base font-medium text-gray-900">Notifications</h3>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Mark all as read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          // Loading state (first load only)
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          // Error state
          <div className="p-8 text-center">
            <BellOff className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-red-600 mb-1">Failed to load</p>
            <p className="text-xs text-gray-500">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <BellOff className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No notifications yet</p>
            <p className="text-xs text-gray-500 mt-1">
              You'll see updates here when they arrive
            </p>
          </div>
        ) : (
          // Notifications list
          <div>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;

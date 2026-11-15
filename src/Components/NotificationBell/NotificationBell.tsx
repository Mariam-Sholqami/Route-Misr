import { useEffect, useRef, useState } from "react";
import { Avatar } from "@heroui/react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../Hooks/useNotifications";
import useUnreadNotifications from "../../Hooks/useUnreadNotifications";
import useMarkNotificationRead from "../../Hooks/useMarkNotificationRead";
import useMarkAllNotificationsRead from "../../Hooks/useMarkAllNotificationsRead";
import type { INotification } from "../../interfaces/notifications.interface";

// what the notification says
function getText(type: string) {
  if (type === "follow_user") {
    return "started following you";
  }
  if (type === "like_post") {
    return "liked your post";
  }
  if (type === "comment_post") {
    return "commented on your post";
  }
  if (type === "share_post") {
    return "shared your post";
  }
  //anything else
  return "sent you a notification";
}

// where a click on the notification goes 
function getLink(notification: INotification) {
  if (notification.entityType === "user") {
    return `/users/${notification.entityId}`;
  }

  if (notification.entityType === "post") {
    if (notification.type === "comment_post") {
      return `/posts/${notification.entityId}#comments`;
    }
    return `/posts/${notification.entityId}`;
  }

  return null;
}

//timeAgo
function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(dateString).toLocaleDateString("en-US", { dateStyle: "medium" });
}

//NotificationBell
export default function NotificationBell() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadNotifications();
  // the list requested => when the bell open
  const {
    data: notifications,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotifications(open);
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  // close list => click outside it or Esc key
  useEffect(
    function () {
      if (!open) {
        return;
      }

      function handleClickOutside(e: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }

      function handleEsc(e: KeyboardEvent) {
        if (e.key === "Escape") {
          setOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);

      return function () {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEsc);
      };
    },
    [open]
  );

  function handleNotificationClick(notification: INotification) {
    // mark it as read if it is not read=> then open what it is about
    if (!notification.isRead) {
      markRead(notification._id);
    }

    setOpen(false);

    const link = getLink(notification);
    if (link) {
      navigate(link);
    }
  }

  //red circle=> nothing when 0
  let badge = null;
  if (unreadCount > 0) {
    let badgeText = String(unreadCount);
    if (unreadCount > 99) {
      badgeText = "99+";
    }

    badge = (
      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
        {badgeText}
      </span>
    );
  }

  //"See more" button => only if the API has more pages
  function renderLoadMore() {
    if (!hasNextPage) {
      return null;
    }

    let loadMoreText = "See more";
    if (isFetchingNextPage) {
      loadMoreText = "Loading...";
    }

    return (
      <button
        type="button"
        onClick={function () {
          fetchNextPage();
        }}
        disabled={isFetchingNextPage}
        className="w-full border-t border-gray-100 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-60"
      >
        {loadMoreText}
      </button>
    );
  }

  function renderList() {
    if (isLoading) {
      return <p className="px-4 py-6 text-center text-sm text-gray-500">Loading...</p>;
    }

    if (isError || notifications === undefined) {
      return (
        <p className="px-4 py-6 text-center text-sm text-red-500">Could not load notifications</p>
      );
    }

    if (notifications.length === 0) {
      return <p className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet</p>;
    }

    const list = (
      <ul className="divide-y divide-gray-100">
        {notifications.map(function (notification) {
          //design of unread notification
          let itemClass = "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-gray-50";
          if (!notification.isRead) {
            itemClass = "flex w-full items-start gap-3 bg-blue-50 px-4 py-3 text-left transition hover:bg-blue-100";
          }

          return (
            <li key={notification._id}>
              <button
                type="button"
                onClick={function () {
                  handleNotificationClick(notification);
                }}
                className={itemClass}
              >
                <Avatar size="sm">
                  <Avatar.Image src={notification.actor.photo} alt="Profile photo" />
                  <Avatar.Fallback>
                    {notification.actor.name.trim().slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.actor.name.trim()}</span>{" "}
                    {getText(notification.type)}
                  </p>

                  {/* small piece of the post => if notification about post with text */}
                  {notification.entity?.body && (
                    <p className="truncate text-xs text-gray-500">{notification.entity.body}</p>
                  )}

                  <p className="mt-0.5 text-xs text-blue-600">{timeAgo(notification.createdAt)}</p>
                </div>

                {!notification.isRead && (
                  <span
                    className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600"
                    aria-label="Unread"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    );

    return (
      <div className="max-h-96 overflow-y-auto">
        {list}
        {renderLoadMore()}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={function () {
          setOpen(!open);
        }}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-full p-2 transition hover:bg-gray-100"
      >
        <Bell size={22} />
        {badge}
      </button>

      {open && (
        <div className="fixed inset-x-2 top-20 z-50 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="font-semibold">Notifications</h2>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={function () {
                  markAllRead();
                }}
                disabled={isMarkingAll}
                className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-60"
              >
                Mark all as read
              </button>
            )}
          </div>

          {renderList()}
        </div>
      )}
    </div>
  );
}
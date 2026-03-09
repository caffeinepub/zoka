import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Coins,
  Gift,
  Heart,
  MessageCircle,
  Trophy,
  UserPlus,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { currentUser, getCreatorById, notifications } from "../data/mockData";
import type { Notification } from "../data/mockData";

const NOTIFICATION_ICONS: Record<Notification["type"], React.ReactNode> = {
  like: <Heart className="w-4 h-4 text-red-400 fill-red-400" />,
  comment: <MessageCircle className="w-4 h-4 text-accent" />,
  follow: <UserPlus className="w-4 h-4 text-primary" />,
  gift: <Gift className="w-4 h-4 text-yellow-400" />,
  milestone: <Trophy className="w-4 h-4 text-primary" />,
  collab: <Zap className="w-4 h-4 text-purple-400" />,
};

const NOTIFICATION_BG: Record<Notification["type"], string> = {
  like: "bg-red-400/10 border-red-400/20",
  comment: "bg-accent/10 border-accent/20",
  follow: "bg-primary/10 border-primary/20",
  gift: "bg-yellow-400/10 border-yellow-400/20",
  milestone: "bg-primary/10 border-primary/20",
  collab: "bg-purple-400/10 border-purple-400/20",
};

export function NotificationsPage() {
  const [items, setItems] = useState(notifications);

  const unreadCount = items.filter((n) => !n.isRead).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read ✓");
  }

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  const unread = items.filter((n) => !n.isRead);
  const read = items.filter((n) => n.isRead);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between sticky top-0 z-10 glass-dark border-b border-border">
        <div className="flex items-center gap-2">
          <h1 className="font-display font-bold text-lg text-foreground">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs h-5 min-w-[20px] flex items-center justify-center rounded-full px-1.5">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            data-ocid="notifications.mark_read_button"
            className="text-xs text-primary hover:text-primary/80 h-8 px-3"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Unread Section */}
      {unread.length > 0 && (
        <div className="px-4 pt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            New
          </p>
          <div className="space-y-2">
            {unread.map((notif, i) => {
              const creator = getCreatorById(notif.creatorId);
              return (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  creator={creator}
                  index={i}
                  onRead={() => markRead(notif.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Read Section */}
      {read.length > 0 && (
        <div className="px-4 pt-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Earlier
          </p>
          <div className="space-y-2">
            {read.map((notif, i) => {
              const creator = getCreatorById(notif.creatorId);
              return (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  creator={creator}
                  index={unread.length + i}
                  onRead={() => {}}
                />
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center px-8">
          <div className="text-5xl mb-4">🔔</div>
          <p className="font-semibold text-foreground mb-1">
            No notifications yet
          </p>
          <p className="text-sm text-muted-foreground">
            Start creating and engaging — your community will respond!
          </p>
        </div>
      )}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  creator: ReturnType<typeof getCreatorById>;
  index: number;
  onRead: () => void;
}

function NotificationItem({
  notification,
  creator,
  index,
  onRead,
}: NotificationItemProps) {
  const isFirstFive = index < 5;

  return (
    <button
      type="button"
      data-ocid={isFirstFive ? `notifications.item.${index + 1}` : undefined}
      onClick={onRead}
      className={`
        w-full flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 text-left
        hover:bg-card
        ${
          notification.isRead
            ? "bg-transparent border-transparent opacity-70"
            : "bg-card border-border"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center
          ${NOTIFICATION_BG[notification.type]}
        `}
      >
        {NOTIFICATION_ICONS[notification.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-foreground leading-snug">
            {notification.coins && (
              <span className="inline-flex items-center gap-0.5 mr-1">
                <Coins className="w-3 h-3 text-primary" />
                <span className="font-bold text-primary">
                  {notification.coins}
                </span>
              </span>
            )}
            {notification.message}
          </p>
          {!notification.isRead && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {notification.timeAgo}
        </p>
      </div>

      {/* Creator avatar */}
      {creator && (
        <Avatar className="w-8 h-8 flex-shrink-0 border border-border">
          <AvatarImage src={creator.avatar} alt={creator.displayName} />
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            {creator.displayName[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </button>
  );
}

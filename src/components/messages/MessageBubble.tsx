import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  isCurrentUser: boolean;
  senderName?: string | null;
  senderAvatar?: string | null;
}

export const MessageBubble = ({
  content,
  isCurrentUser,
  senderName,
  senderAvatar,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex gap-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName || ""}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-8 w-8" />
          )}
        </div>
      )}
      <div
        className={cn(
          "rounded-lg p-3 max-w-[70%]",
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="text-sm break-words">{content}</p>
      </div>
      {isCurrentUser && (
        <div className="flex-shrink-0">
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName || ""}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-8 w-8" />
          )}
        </div>
      )}
    </div>
  );
};
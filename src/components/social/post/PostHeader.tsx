import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostHeaderProps {
  profileUrl?: string;
  fullName: string;
  createdAt: string;
  onProfileClick: (userId: string) => void;
  userId: string;
}

export const PostHeader = ({
  profileUrl,
  fullName,
  createdAt,
  onProfileClick,
  userId,
}: PostHeaderProps) => {
  return (
    <div 
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => onProfileClick(userId)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') onProfileClick(userId);
      }}
      aria-label={`View ${fullName || 'Anonymous'}'s profile`}
    >
      <Avatar>
        <AvatarImage src={profileUrl} alt={fullName || 'Anonymous'} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{fullName || 'Anonymous'}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
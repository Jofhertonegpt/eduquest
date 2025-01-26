import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface PostHeaderProps {
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  };
  createdAt: string;
}

export const PostHeader = ({ profile, createdAt }: PostHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={profile?.avatar_url || undefined} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{profile?.full_name || 'Anonymous'}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
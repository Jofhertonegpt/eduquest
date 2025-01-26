import { UserRound, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface XHeaderProps {
  profile: {
    name: string;
    email: string;
    location?: string;
    website?: string;
    avatar_url?: string;
  };
  isOwnProfile: boolean;
  editMode: boolean;
  onEditToggle: () => void;
  onSave: () => void;
}

export const XHeader = ({
  profile,
  isOwnProfile,
  editMode,
  onEditToggle,
  onSave,
}: XHeaderProps) => {
  return (
    <div className="relative">
      <div className="h-32 bg-accent/10">
        {/* Cover image would go here */}
      </div>
      
      <div className="px-4">
        <div className="relative -mt-16 mb-4">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>
              <UserRound className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
          
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <Button
                variant={editMode ? "default" : "outline"}
                onClick={editMode ? onSave : onEditToggle}
              >
                {editMode ? "Save profile" : "Edit profile"}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground">@{profile.email.split('@')[0]}</p>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {format(new Date(), 'MMMM yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ProfileBioProps {
  profile: {
    bio?: string;
    location?: string;
    website?: string;
  };
  editMode: boolean;
  onChange: (updates: Partial<ProfileBioProps['profile']>) => void;
}

export const ProfileBio = ({ profile, editMode, onChange }: ProfileBioProps) => {
  if (editMode) {
    return (
      <div className="space-y-4 p-4">
        <Textarea
          placeholder="Write a bio..."
          value={profile.bio || ''}
          onChange={(e) => onChange({ bio: e.target.value })}
          className="min-h-[100px]"
        />
        <Input
          placeholder="Location"
          value={profile.location || ''}
          onChange={(e) => onChange({ location: e.target.value })}
        />
        <Input
          placeholder="Website"
          value={profile.website || ''}
          onChange={(e) => onChange({ website: e.target.value })}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      {profile.bio && <p className="whitespace-pre-wrap">{profile.bio}</p>}
    </div>
  );
};
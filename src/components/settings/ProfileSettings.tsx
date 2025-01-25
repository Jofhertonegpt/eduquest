import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface ProfileSettingsProps {
  userData: any;
  updateProfile: (data: any) => Promise<void>;
}

export const ProfileSettings = ({ userData, updateProfile }: ProfileSettingsProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${userData?.user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({
        ...userData?.profile,
        avatar_url: publicUrl,
      });

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Profile</h3>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={userData?.profile?.avatar_url} alt="Profile picture" />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="font-semibold">Profile Picture</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={uploading}>
              <label className="cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload New"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={userData?.profile?.full_name || ''}
            onChange={(e) => updateProfile({
              ...userData?.profile,
              full_name: e.target.value,
            })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="level">Experience Level</Label>
          <Select
            value={userData?.profile?.level || 'Intermediate'}
            onValueChange={(value) => updateProfile({
              ...userData?.profile,
              level: value,
            })}
          >
            <SelectTrigger id="level" className="mt-1">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
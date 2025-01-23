import { useState } from "react";
import { useTheme } from "next-themes";
import { useProfile } from "@/hooks/useProfile";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Upload, Palette, Bell, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { userData, updateProfile } = useProfile();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

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
        name: userData?.profile?.full_name || '', 
        level: userData?.profile?.level || 'Intermediate',
        avatar_url: publicUrl 
      });

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="h-4 w-4 mr-2" />
              Language
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              <div className="space-y-4">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="h-24 bg-[#1A1F2C] hover:bg-[#1A1F2C]/90"
                    onClick={() => setTheme("dark")}
                  >
                    <div className="space-y-2">
                      <div className="w-12 h-2 bg-[#1EAEDB] rounded" />
                      <div className="w-8 h-2 bg-[#8B5CF6] rounded" />
                    </div>
                  </Button>
                  <Button
                    variant={theme === "rainbow" ? "default" : "outline"}
                    className="h-24 bg-gradient-to-r from-[#ea384c] via-[#0EA5E9] to-[#9b87f5]"
                    onClick={() => setTheme("rainbow")}
                  >
                    Rainbow
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData?.profile?.avatar_url || undefined} />
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
                        Upload New
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              {/* Add notification settings here */}
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-semibold mb-4">Privacy Settings</h3>
              {/* Add privacy settings here */}
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-semibold mb-4">Language Settings</h3>
              {/* Add language settings here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
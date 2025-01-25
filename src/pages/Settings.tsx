import { useState, useCallback, Suspense } from "react";
import { useTheme } from "next-themes";
import { useProfile } from "@/hooks/useProfile";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Upload, Palette, Bell, Shield, Globe, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { userData, updateProfile, isLoading } = useProfile();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only JPEG, PNG and WebP images are allowed",
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
        name: userData?.profile?.full_name || '',
        level: userData?.profile?.level || 'Intermediate',
        avatar_url: publicUrl,
        notification_preferences: userData?.profile?.notification_preferences,
        language_preference: userData?.profile?.language_preference,
        theme_preference: userData?.profile?.theme_preference,
        accessibility_settings: userData?.profile?.accessibility_settings,
        privacy_settings: userData?.profile?.privacy_settings
      });

    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [userData, updateProfile, toast]);

  const handleSettingUpdate = async (
    setting: string,
    value: any,
    category: 'notification_preferences' | 'accessibility_settings' | 'privacy_settings' | 'language_preference' | 'theme_preference'
  ) => {
    try {
      const updatedSettings = { ...userData?.profile };
      
      if (category === 'language_preference' || category === 'theme_preference') {
        updatedSettings[category] = value;
      } else {
        updatedSettings[category] = {
          ...updatedSettings[category],
          [setting]: value
        };
      }

      await updateProfile({
        name: updatedSettings.full_name || '',
        level: updatedSettings.level || 'Intermediate',
        avatar_url: updatedSettings.avatar_url,
        notification_preferences: updatedSettings.notification_preferences,
        language_preference: updatedSettings.language_preference,
        theme_preference: updatedSettings.theme_preference,
        accessibility_settings: updatedSettings.accessibility_settings,
        privacy_settings: updatedSettings.privacy_settings
      });
    } catch (error) {
      console.error('Settings update error:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" tabIndex={0}>Settings</h1>
        
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 w-full md:grid md:grid-cols-6" aria-label="Settings sections">
            <TabsTrigger value="appearance" className="flex items-center gap-2 flex-1 md:flex-none">
              <Palette className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 flex-1 md:flex-none">
              <User className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 flex-1 md:flex-none">
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 flex-1 md:flex-none">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2 flex-1 md:flex-none">
              <Languages className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2 flex-1 md:flex-none">
              <Globe className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Accessibility</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? "dark" : "light");
                    handleSettingUpdate('theme', checked ? "dark" : "light", 'theme_preference');
                  }}
                  aria-label="Toggle dark mode"
                />
              </div>

              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="h-24 bg-background hover:bg-background/90"
                    onClick={() => {
                      setTheme("light");
                      handleSettingUpdate('theme', "light", 'theme_preference');
                    }}
                    aria-label="Light theme"
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="h-24 bg-[#221F26] hover:bg-[#221F26]/90 text-[#1EAEDB]"
                    onClick={() => {
                      setTheme("dark");
                      handleSettingUpdate('theme', "dark", 'theme_preference');
                    }}
                    aria-label="Dark theme"
                  >
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="h-24 col-span-1 md:col-span-2"
                    onClick={() => {
                      setTheme("system");
                      handleSettingUpdate('theme', "system", 'theme_preference');
                    }}
                    aria-label="System theme"
                  >
                    System
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={userData?.profile?.avatar_url || undefined} 
                    alt="Profile picture"
                  />
                  <AvatarFallback>
                    <User className="h-10 w-10" aria-label="Default avatar" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-semibold">Profile Picture</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={uploading}
                      aria-busy={uploading}
                    >
                      <label className="cursor-pointer flex items-center gap-2">
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        {uploading ? "Uploading..." : "Upload New"}
                        <input
                          type="file"
                          className="hidden"
                          accept={ALLOWED_FILE_TYPES.join(',')}
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                          aria-label="Upload profile picture"
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
                      name: e.target.value,
                      level: userData?.profile?.level || 'Intermediate'
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="level">Experience Level</Label>
                  <Select
                    value={userData?.profile?.level || 'Intermediate'}
                    onValueChange={(value) => updateProfile({
                      name: userData?.profile?.full_name || '',
                      level: value
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
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="space-y-4">
                {Object.entries(userData?.profile?.notification_preferences || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor={`notification-${key}`} className="capitalize">
                        {key.replace(/_/g, ' ')} Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive {key.replace(/_/g, ' ')} notifications
                      </p>
                    </div>
                    <Switch
                      id={`notification-${key}`}
                      checked={value as boolean}
                      onCheckedChange={(checked) => 
                        handleSettingUpdate(key, checked, 'notification_preferences')
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="space-y-4">
                {Object.entries(userData?.profile?.privacy_settings || {}).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`privacy-${key}`} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Select
                      value={value as string}
                      onValueChange={(newValue) => 
                        handleSettingUpdate(key, newValue, 'privacy_settings')
                      }
                    >
                      <SelectTrigger id={`privacy-${key}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="space-y-4">
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={userData?.profile?.language_preference || 'en'}
                  onValueChange={(value) => 
                    handleSettingUpdate('language', value, 'language_preference')
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <div className="glass-panel rounded-xl p-6 space-y-6">
              <div className="space-y-4">
                {Object.entries(userData?.profile?.accessibility_settings || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor={`accessibility-${key}`} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {key === 'fontSize' ? 'Adjust text size' : `Enable ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                      </p>
                    </div>
                    {key === 'fontSize' ? (
                      <Select
                        value={value as string}
                        onValueChange={(newValue) => 
                          handleSettingUpdate(key, newValue, 'accessibility_settings')
                        }
                      >
                        <SelectTrigger id={`accessibility-${key}`} className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Switch
                        id={`accessibility-${key}`}
                        checked={value as boolean}
                        onCheckedChange={(checked) => 
                          handleSettingUpdate(key, checked, 'accessibility_settings')
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, User, Bell, Shield, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { supabase } from "@/lib/supabase";
import { TooltipProvider } from "@/components/ui/tooltip";

const Settings = () => {
  const { userData, updateProfile: mutateProfile, isLoading } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Security: Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to access settings",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  // Wrap the mutation function to return a Promise
  const updateProfile = async (updates: any) => {
    try {
      await mutateProfile(updates);
    } catch (error) {
      throw error;
    }
  };

  const handleSettingUpdate = async (
    category: 'notification_preferences' | 'privacy_settings' | 'accessibility_settings',
    key: string,
    value: any
  ) => {
    try {
      // Rate limiting
      const now = Date.now();
      const lastUpdate = localStorage.getItem('lastSettingsUpdate');
      if (lastUpdate && now - parseInt(lastUpdate) < 1000) { // 1 second cooldown
        toast({
          title: "Please wait",
          description: "Too many updates. Please wait a moment.",
          variant: "destructive",
        });
        return;
      }
      localStorage.setItem('lastSettingsUpdate', now.toString());

      const updatedSettings = {
        ...userData?.profile,
        [category]: {
          ...userData?.profile?.[category],
          [key]: value
        }
      };
      await updateProfile(updatedSettings);
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
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          
          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="flex flex-wrap gap-2 w-full bg-transparent">
              <TabsTrigger value="appearance" className="flex-1 md:flex-none data-[state=active]:bg-primary">
                <span className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden md:inline">Appearance</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-1 md:flex-none data-[state=active]:bg-primary">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1 md:flex-none data-[state=active]:bg-primary">
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex-1 md:flex-none data-[state=active]:bg-primary">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden md:inline">Privacy</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex-1 md:flex-none data-[state=active]:bg-primary">
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline">Accessibility</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="mt-6">
              <AppearanceSettings />
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <ProfileSettings userData={userData} updateProfile={updateProfile} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <NotificationSettings
                preferences={userData?.profile?.notification_preferences}
                onUpdate={(key, value) => handleSettingUpdate('notification_preferences', key, value)}
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <PrivacySettings
                settings={userData?.profile?.privacy_settings}
                onUpdate={(key, value) => handleSettingUpdate('privacy_settings', key, value)}
              />
            </TabsContent>

            <TabsContent value="accessibility" className="mt-6">
              <AccessibilitySettings
                settings={userData?.profile?.accessibility_settings}
                onUpdate={(key, value) => handleSettingUpdate('accessibility_settings', key, value)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Settings;
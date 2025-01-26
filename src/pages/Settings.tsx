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
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
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
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <TooltipProvider>
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
                onUpdate={(key, value) => updateProfile({
                  ...userData?.profile,
                  notification_preferences: {
                    ...userData?.profile?.notification_preferences,
                    [key]: value
                  }
                })}
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <PrivacySettings
                settings={userData?.profile?.privacy_settings}
                onUpdate={(key, value) => updateProfile({
                  ...userData?.profile,
                  privacy_settings: {
                    ...userData?.profile?.privacy_settings,
                    [key]: value
                  }
                })}
              />
            </TabsContent>

            <TabsContent value="accessibility" className="mt-6">
              <AccessibilitySettings
                settings={userData?.profile?.accessibility_settings}
                onUpdate={(key, value) => updateProfile({
                  ...userData?.profile,
                  accessibility_settings: {
                    ...userData?.profile?.accessibility_settings,
                    [key]: value
                  }
                })}
              />
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Settings;
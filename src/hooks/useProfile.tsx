import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      // Security: Verify session exists
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No active session');

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profile) {
        // Create default profile with secure defaults
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            full_name: user.email?.split('@')[0] || '',
            level: 'Beginner',
            notification_preferences: {
              email: false, // Secure default: opt-in rather than opt-out
              push: false,
              marketing: false
            },
            language_preference: 'en',
            theme_preference: 'system',
            accessibility_settings: {
              fontSize: 'medium',
              highContrast: false,
              reducedMotion: false
            },
            privacy_settings: {
              profileVisibility: 'private', // Secure default: most private option
              activityVisibility: 'private'
            }
          }])
          .select()
          .single();

        if (createError) throw createError;
        return { user, profile: newProfile };
      }

      return { user, profile };
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Sanitize input
      const sanitizedUpdates = {
        ...updates,
        full_name: updates.full_name ? String(updates.full_name).slice(0, 100) : undefined,
        level: ['Beginner', 'Intermediate', 'Advanced'].includes(updates.level) ? updates.level : 'Beginner',
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...sanitizedUpdates,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    userData,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
  };
};
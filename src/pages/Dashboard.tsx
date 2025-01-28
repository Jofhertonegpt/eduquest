import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { AssignmentsList } from "@/components/dashboard/AssignmentsList";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { handleError } from "@/lib/errorHandling";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('Not authenticated');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        return profile;
      } catch (error) {
        handleError(error, 'Dashboard profile fetch');
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseProgressCard />
        <AssignmentsList />
        <NotificationPanel />
      </div>
    </div>
  );
}
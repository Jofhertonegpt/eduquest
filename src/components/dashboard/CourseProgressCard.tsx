import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookOpen, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/lib/errorHandling";
import type { CourseProgress } from "@/types/academic";

export const CourseProgressCard = () => {
  const { toast } = useToast();

  const { data: progress, isLoading, error } = useQuery({
    queryKey: ["course-progress"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error("Not authenticated");

        const { data, error: progressError } = await supabase
          .from("course_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (progressError) throw progressError;

        if (!data) {
          // Create default progress if none exists
          const defaultProgress = {
            user_id: user.id,
            completed_modules: 0,
            total_modules: 10,
            current_grade: 0,
            rank: null,
            total_students: null
          };

          const { data: newProgress, error: createError } = await supabase
            .from("course_progress")
            .insert([defaultProgress])
            .select()
            .single();

          if (createError) throw createError;
          return newProgress;
        }

        return data as CourseProgress;
      } catch (error) {
        handleError(error, 'Course progress fetch');
        throw error;
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-4">
        <div className="text-center text-red-500">
          Failed to load progress. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading || !progress) {
    return (
      <div className="glass-panel rounded-xl p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-primary/10 rounded w-1/4"></div>
          <div className="h-2 bg-primary/5 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-primary/5 rounded"></div>
            <div className="h-20 bg-primary/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (progress.completedModules / progress.totalModules) * 100;

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Course Progress</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground">Current Grade</p>
            <p className="text-2xl font-bold">{progress.currentGrade}%</p>
          </div>
          
          {progress.rank && progress.totalStudents && (
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground">Class Rank</p>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <p className="text-2xl font-bold">
                  {progress.rank}/{progress.totalStudents}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
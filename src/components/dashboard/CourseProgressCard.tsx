import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BookOpen, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import type { CourseProgress } from "@/types/academic";

export const CourseProgressCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDefaultProgress = async (userId: string) => {
    const defaultProgress = {
      user_id: userId,
      completed_modules: 0,
      total_modules: 10, // Default value
      current_grade: 0,
      rank: null,
      total_students: null
    };

    const { data, error } = await supabase
      .from("course_progress")
      .insert([defaultProgress])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const { data: progress, isLoading } = useQuery({
    queryKey: ["course-progress"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      // If no progress exists, create a default one
      if (!data) {
        return createDefaultProgress(user.id);
      }

      // Transform snake_case to camelCase for frontend use
      return {
        ...data,
        completedModules: data.completed_modules,
        totalModules: data.total_modules,
        currentGrade: data.current_grade,
        totalStudents: data.total_students
      } as CourseProgress;
    },
  });

  if (isLoading) {
    return <div>Loading progress...</div>;
  }

  if (!progress) {
    return <div>No course progress found</div>;
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
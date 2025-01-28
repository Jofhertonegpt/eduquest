import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Calendar, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleError } from "@/lib/errorHandling";
import { useToast } from "@/hooks/use-toast";
import type { Assignment } from "@/types/academic";

export const AssignmentsList = () => {
  const { toast } = useToast();

  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ["upcoming-assignments"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error("Not authenticated");

        const { data, error: assignmentsError } = await supabase
          .from("assignments")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("due_date", { ascending: true });

        if (assignmentsError) throw assignmentsError;
        return data as Assignment[];
      } catch (error) {
        handleError(error, 'Assignments fetch');
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
          Failed to load assignments. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-panel rounded-xl p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-primary/10 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-primary/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Upcoming Assignments</h2>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {assignments?.map((assignment) => (
            <div
              key={assignment.id}
              className="p-3 rounded-lg border bg-background/50 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              </div>
              <CheckCircle2 
                className={`h-5 w-5 ${
                  assignment.status === "submitted" 
                    ? "text-green-500" 
                    : "text-muted-foreground"
                }`} 
              />
            </div>
          ))}
          {assignments?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No upcoming assignments
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
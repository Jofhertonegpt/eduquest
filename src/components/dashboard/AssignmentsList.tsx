import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Calendar, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Assignment } from "@/types/academic";

export const AssignmentsList = () => {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ["upcoming-assignments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Assignment[];
    },
  });

  if (isLoading) {
    return <div>Loading assignments...</div>;
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
        </div>
      </ScrollArea>
    </div>
  );
};
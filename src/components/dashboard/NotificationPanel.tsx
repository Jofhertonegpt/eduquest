import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { handleError } from "@/lib/errorHandling";
import { useToast } from "@/hooks/use-toast";
import type { Notification } from "@/types/academic";

export const NotificationPanel = () => {
  const { toast } = useToast();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error("Not authenticated");

        const { data, error: notificationsError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (notificationsError) throw notificationsError;
        return data as Notification[];
      } catch (error) {
        handleError(error, 'Notifications fetch');
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
          Failed to load notifications. Please try again later.
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
              <div key={i} className="h-16 bg-primary/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Recent Notifications</h2>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.read ? "bg-background/50" : "bg-background border-primary"
              }`}
            >
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
          {notifications?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No new notifications
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/types/academic";

export const NotificationPanel = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Notification[];
    },
  });

  if (isLoading) {
    return <div>Loading notifications...</div>;
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
        </div>
      </ScrollArea>
    </div>
  );
};
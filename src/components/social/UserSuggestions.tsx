import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export const UserSuggestions = () => {
  const { toast } = useToast();

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["user-suggestions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get users you're not following
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .neq("id", user.id)
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const handleFollow = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("social_follows")
        .insert({
          follower_id: user.id,
          following_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You are now following this user!",
      });
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg space-y-4">
        <h2 className="font-semibold">Suggested Users</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded mt-1 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="font-semibold flex items-center gap-2">
        <Users className="h-4 w-4" />
        Suggested Users
      </h2>
      <div className="space-y-4">
        {suggestions?.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{user.full_name || 'Anonymous'}</p>
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => handleFollow(user.id)}
              >
                Follow
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
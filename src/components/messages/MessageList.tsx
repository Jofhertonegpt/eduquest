import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";

export const MessageList = ({ recipientId }: { recipientId?: string }) => {
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", recipientId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !recipientId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!sender_id(full_name, avatar_url),
          recipient:profiles!recipient_id(full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!recipientId,
  });

  if (isLoading) return <div>Loading messages...</div>;

  return (
    <div className="space-y-4">
      {messages?.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 ${
            message.sender.id === recipientId ? "justify-start" : "justify-end"
          }`}
        >
          {message.sender.avatar_url ? (
            <img
              src={message.sender.avatar_url}
              alt={message.sender.full_name || ""}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-8 w-8" />
          )}
          <div className="bg-primary/10 rounded-lg p-2 max-w-[70%]">
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
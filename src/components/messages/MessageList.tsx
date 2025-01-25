import { useMessages } from "@/hooks/useMessages";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { supabase } from "@/lib/supabase";

export const MessageList = ({ recipientId }: { recipientId?: string }) => {
  const { messages, isLoading, sendMessage, isSending } = useMessages(recipientId);

  const getCurrentUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            isCurrentUser={message.sender_id === getCurrentUserId()}
            senderName={message.sender?.full_name}
            senderAvatar={message.sender?.avatar_url}
          />
        ))}
      </div>
      <MessageInput onSend={sendMessage} disabled={isSending} />
    </div>
  );
};
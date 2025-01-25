import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface MessageInputProps {
  recipientId?: string | null;
  onSend?: (content: string) => void;
  disabled?: boolean; // Added this prop
}

export const MessageInput = ({ recipientId, onSend, disabled }: MessageInputProps) => {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    if (!recipientId) {
      toast({
        title: "Error",
        description: "No recipient selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("messages")
        .insert({
          content: content.trim(),
          recipient_id: recipientId,
          sender_id: user.id,
        });

      if (error) throw error;

      setContent("");
      if (onSend) onSend(content);
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 min-h-[40px] max-h-[120px]"
        disabled={disabled}
      />
      <Button type="submit" disabled={!content.trim() || disabled}>
        Send
      </Button>
    </form>
  );
};
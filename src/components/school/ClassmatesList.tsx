import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/database.types";
import { getMockSchoolMembersBySchoolId, getMockProfileById, mockDelay } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { MessageInput } from "@/components/messages/MessageInput";
import { MessageList } from "@/components/messages/MessageList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const ClassmatesList = ({ schoolId }: { schoolId: string }) => {
  const [selectedClassmate, setSelectedClassmate] = useState<Profile | null>(null);

  const { data: classmates, isLoading } = useQuery({
    queryKey: ["classmates", schoolId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("school_members")
        .select(`
          profiles!inner (
            id,
            full_name,
            avatar_url,
            level,
            current_degree,
            completed_degrees,
            created_at,
            updated_at
          )
        `)
        .eq("school_id", schoolId);
      
      if (error) throw error;
      
      return data?.map(item => {
        const profile = item.profiles as unknown as Profile;
        return {
          id: profile.id,
          full_name: profile.full_name || 'Anonymous User',
          avatar_url: profile.avatar_url,
          level: profile.level,
          current_degree: profile.current_degree,
          completed_degrees: profile.completed_degrees,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        } satisfies Profile;
      }) || [];
    },
    enabled: !!schoolId,
  });

  if (isLoading) {
    return (
      <div className="w-64 border-r p-4 space-y-4 hidden md:block animate-pulse">
        <h2 className="font-semibold">Classmates</h2>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 border-r p-4 space-y-4 hidden md:block"
      >
        <h2 className="font-semibold">Classmates</h2>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2">
            {classmates?.map((classmate) => (
              <Button
                key={classmate.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setSelectedClassmate(classmate)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={classmate.avatar_url || undefined} />
                  <AvatarFallback>
                    {classmate.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{classmate.full_name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </motion.div>

      <Dialog open={!!selectedClassmate} onOpenChange={() => setSelectedClassmate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedClassmate?.avatar_url || undefined} />
                <AvatarFallback>
                  {selectedClassmate?.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              Chat with {selectedClassmate?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <MessageList recipientId={selectedClassmate?.id} />
            </div>
            <MessageInput recipientId={selectedClassmate?.id} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
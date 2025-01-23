import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/database.types";
import { getMockSchoolMembersBySchoolId, getMockProfileById, mockDelay } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { MessageInput } from "@/components/messages/MessageInput";
import { MessageList } from "@/components/messages/MessageList";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const ClassmatesList = ({ schoolId }: { schoolId: string }) => {
  const [selectedClassmate, setSelectedClassmate] = useState<Profile | null>(null);

  const { data: classmates, isLoading } = useQuery({
    queryKey: ["classmates", schoolId],
    queryFn: async () => {
      try {
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
        
        if (!data?.length) {
          await mockDelay();
          const mockMembers = getMockSchoolMembersBySchoolId(schoolId);
          return mockMembers.map(member => {
            const profile = getMockProfileById(member.student_id);
            return profile as Profile;
          }).filter(Boolean);
        }
        
        return data?.map(item => {
          const profile = item.profiles as unknown as Profile;
          return {
            id: profile.id,
            full_name: profile.full_name || '',
            avatar_url: profile.avatar_url,
            level: profile.level,
            current_degree: profile.current_degree,
            completed_degrees: profile.completed_degrees,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          } satisfies Profile;
        }) || [];
      } catch (error) {
        console.error("Error fetching classmates:", error);
        await mockDelay();
        const mockMembers = getMockSchoolMembersBySchoolId(schoolId);
        return mockMembers.map(member => {
          const profile = getMockProfileById(member.student_id);
          return profile as Profile;
        }).filter(Boolean);
      }
    },
    enabled: !!schoolId,
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading classmates...</div>;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 border-r p-4 space-y-4 hidden md:block"
      >
        <h2 className="font-semibold">Classmates</h2>
        <div className="space-y-2">
          {classmates?.map((classmate) => (
            <Button
              key={classmate.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedClassmate(classmate)}
            >
              {classmate.avatar_url ? (
                <img
                  src={classmate.avatar_url}
                  alt={classmate.full_name || ''}
                  className="h-6 w-6 rounded-full mr-2"
                />
              ) : (
                <User className="h-6 w-6 mr-2" />
              )}
              <span className="truncate">{classmate.full_name}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      <Dialog open={!!selectedClassmate} onOpenChange={() => setSelectedClassmate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat with {selectedClassmate?.full_name}</DialogTitle>
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/database.types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const ClassmatesList = ({ schoolId }: { schoolId: string }) => {
  const { data: classmates, isLoading } = useQuery({
    queryKey: ["classmates", schoolId],
    queryFn: async () => {
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
      
      // Fix the type conversion by properly extracting the profiles data
      return data?.map(item => item.profiles) as Profile[];
    },
    enabled: !!schoolId,
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading classmates...</div>;
  }

  return (
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
            onClick={() => {/* TODO: Implement direct message */}}
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
  );
};
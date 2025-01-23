import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Cat, Dog, Rabbit, Squirrel, Turtle } from "lucide-react";
import { DEFAULT_SCHOOL } from "@/data/defaultSchool";

const SCHOOL_ICONS = {
  Cat,
  Dog,
  Rabbit,
  Squirrel,
  Turtle,
};

export const SchoolHeader = ({ schoolId }: { schoolId: string }) => {
  const { data: school } = useQuery({
    queryKey: ["school", schoolId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .eq("id", schoolId)
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) {
          return DEFAULT_SCHOOL;
        }
        
        return data;
      } catch (error) {
        console.error("Error fetching school:", error);
        return DEFAULT_SCHOOL;
      }
    },
    enabled: !!schoolId,
  });

  const IconComponent = school?.icon_type ? SCHOOL_ICONS[school.icon_type as keyof typeof SCHOOL_ICONS] : Cat;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-background/80 backdrop-blur-lg border-b sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <IconComponent className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{school?.name}</h1>
          <p className="text-sm text-muted-foreground">{school?.description}</p>
        </div>
      </div>
    </motion.div>
  );
};
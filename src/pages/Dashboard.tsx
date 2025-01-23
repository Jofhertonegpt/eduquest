import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";
import { NoSchool } from "@/components/school/NoSchool";
import { Database } from "@/lib/database.types";
import { DEFAULT_SCHOOL } from "@/data/defaultSchool";
import { useToast } from "@/components/ui/use-toast";

type School = Database['public']['Tables']['schools']['Row'];

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: defaultSchool } = useQuery({
    queryKey: ["default-school"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", DEFAULT_SCHOOL.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data as School | null;
    },
  });

  const createDefaultSchool = useMutation({
    mutationFn: async () => {
      const { error: schoolError } = await supabase
        .from("schools")
        .insert([DEFAULT_SCHOOL]);
      
      if (schoolError) throw schoolError;
      return DEFAULT_SCHOOL as School;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-school"] });
      toast({
        title: "Welcome to the Learning Hub!",
        description: "We've created a default school to help you get started.",
      });
    },
  });

  const { data: activeSchool, isLoading } = useQuery({
    queryKey: ["active-school"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: memberData, error: memberError } = await supabase
        .from("school_members")
        .select(`
          schools (
            id,
            name,
            description,
            logo_url,
            created_at
          )
        `)
        .eq("student_id", user.id)
        .maybeSingle();
      
      if (memberError) throw memberError;
      
      if (!memberData) return null;
      return memberData.schools as School;
    },
    onSettled: async (school) => {
      // If user has no school and default school exists, join it
      if (!school && defaultSchool) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from("school_members")
          .insert({
            school_id: DEFAULT_SCHOOL.id,
            student_id: user.id,
          });

        if (!error) {
          toast({
            title: "Welcome to the Learning Hub!",
            description: "You've been automatically joined to our learning community.",
          });
          // Refetch the active school query
          queryClient.invalidateQueries({ queryKey: ["active-school"] });
        }
      }
      // If default school doesn't exist, create it
      else if (!school && !defaultSchool) {
        createDefaultSchool.mutate();
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!activeSchool) {
    return <NoSchool />;
  }

  return (
    <div className="min-h-screen">
      <SchoolHeader schoolId={activeSchool.id} />
      <div className="flex">
        <ClassmatesList schoolId={activeSchool.id} />
        <SchoolPosts schoolId={activeSchool.id} />
      </div>
    </div>
  );
};

export default Dashboard;

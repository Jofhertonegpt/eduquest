import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";
import { NoSchool } from "@/components/school/NoSchool";
import { Database } from "@/lib/database.types";
import { DEFAULT_SCHOOL, DEFAULT_SCHOOL_POSTS } from "@/data/defaultSchool";
import { useToast } from "@/components/ui/use-toast";

type School = Database['public']['Tables']['schools']['Row'];

const Dashboard = () => {
  const { toast } = useToast();

  // Query to check if the default school exists
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

  // Create default school if it doesn't exist
  const createDefaultSchool = useMutation({
    mutationFn: async () => {
      // Create the school
      const { error: schoolError } = await supabase
        .from("schools")
        .insert([DEFAULT_SCHOOL]);
      
      if (schoolError) throw schoolError;

      // Create the default posts
      const { error: postsError } = await supabase
        .from("school_posts")
        .insert(DEFAULT_SCHOOL_POSTS);
      
      if (postsError) throw postsError;
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Learning Hub!",
        description: "We've created a default school to help you get started.",
      });
    },
  });

  // Query user's active school
  const { data: activeSchool, isLoading } = useQuery({
    queryKey: ["active-school"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
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
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.schools as School | null;
    },
    onSuccess: async (school) => {
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
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";
import { NoSchool } from "@/components/school/NoSchool";
import { Database } from "@/lib/database.types";

type School = Database['public']['Tables']['schools']['Row'];

const Dashboard = () => {
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
            logo_url
          )
        `)
        .eq("student_id", user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.schools as School | null;
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
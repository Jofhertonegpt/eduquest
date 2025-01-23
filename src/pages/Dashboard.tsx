import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";

const Dashboard = () => {
  const { data: activeSchool } = useQuery({
    queryKey: ["active-school"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("school_members")
        .select(`
          school_id,
          schools (
            id,
            name,
            description,
            logo_url
          )
        `)
        .eq("student_id", user.id)
        .single();
      
      if (error) throw error;
      return data?.schools;
    },
  });

  return (
    <div className="min-h-screen">
      {activeSchool ? (
        <>
          <SchoolHeader schoolId={activeSchool.id} />
          <div className="flex">
            <ClassmatesList schoolId={activeSchool.id} />
            <SchoolPosts schoolId={activeSchool.id} />
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-8 text-center"
        >
          <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            Join a school to see updates and connect with classmates
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
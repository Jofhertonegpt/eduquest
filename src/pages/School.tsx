import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";
import { NoSchool } from "@/components/school/NoSchool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type School = Database['public']['Tables']['schools']['Row'];

const School = () => {
  const { data: activeSchool, isLoading } = useQuery({
    queryKey: ["active-school"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("school_members")
        .select(`
          school_id
        `)
        .eq("student_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data?.school_id) return null;

      const { data: school, error: schoolError } = await supabase
        .from("schools")
        .select("*")
        .eq("id", data.school_id)
        .single();
      
      if (schoolError) throw schoolError;
      return school as School;
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

export default School;
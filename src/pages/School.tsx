import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";
import { SchoolCreator } from "@/components/school/SchoolCreator";
import { DEFAULT_SCHOOL } from "@/data/defaultSchool";

const School = () => {
  const { data: currentSchool } = useQuery({
    queryKey: ["current-school"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: schoolMember, error } = await supabase
        .from("school_members")
        .select("school_id")
        .eq("student_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return schoolMember?.school_id || DEFAULT_SCHOOL.id;
    },
  });

  if (!currentSchool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Schools</h1>
        <p className="text-muted-foreground mb-8">Create or join a school to get started</p>
        <div className="space-x-4">
          <SchoolCreator />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SchoolHeader schoolId={currentSchool} />
      <div className="flex">
        <ClassmatesList schoolId={currentSchool} />
        <SchoolPosts schoolId={currentSchool} />
      </div>
    </div>
  );
};

export default School;
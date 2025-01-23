import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SchoolHeader } from "@/components/school/SchoolHeader";
import { ClassmatesList } from "@/components/school/ClassmatesList";
import { SchoolPosts } from "@/components/school/SchoolPosts";
import { NoSchool } from "@/components/school/NoSchool";
import { Database } from "@/lib/database.types";
import { DEFAULT_SCHOOL, DEFAULT_SCHOOL_POSTS } from "@/data/defaultSchool";
import { useToast } from "@/hooks/use-toast";

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
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") throw error;
      return data as School | null;
    },
  });

  const createDefaultSchool = useMutation({
    mutationFn: async () => {
      const { data: school, error: schoolError } = await supabase
        .from("schools")
        .insert([DEFAULT_SCHOOL])
        .select()
        .single();
      
      if (schoolError) throw schoolError;

      const postsWithSchoolId = DEFAULT_SCHOOL_POSTS.map(post => ({
        ...post,
        created_by: DEFAULT_SCHOOL.id
      }));

      const { error: postsError } = await supabase
        .from("school_posts")
        .insert(postsWithSchoolId);
      
      if (postsError) throw postsError;

      return school as School;
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
      
      if (!memberData?.schools) return null;
      return memberData.schools as School;
    },
  });

  // Handle school joining and creation in a separate effect
  useQuery({
    queryKey: ["handle-school-setup"],
    queryFn: async () => null,
    enabled: !isLoading && !!defaultSchool,
    meta: {
      onSettled: async () => {
        if (!activeSchool && defaultSchool) {
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
            queryClient.invalidateQueries({ queryKey: ["active-school"] });
          }
        }
        else if (!activeSchool && !defaultSchool) {
          createDefaultSchool.mutate();
        }
      }
    }
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
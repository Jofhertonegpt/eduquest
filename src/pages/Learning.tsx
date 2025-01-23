import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import CurriculumImport from "@/components/CurriculumImport";
import type { Curriculum, Module, Course } from "@/types/curriculum";
import { ModuleList } from "@/components/learning/ModuleList";
import { ModuleContent } from "@/components/learning/ModuleContent";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation } from "@tanstack/react-query";

const Learning = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  // Query to fetch saved curricula
  const { data: savedCurriculum } = useQuery({
    queryKey: ['saved-curriculum'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the most recently imported curriculum
      const { data: importedCurriculum, error: importError } = await supabase
        .from('imported_curricula')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (importError) throw importError;

      if (importedCurriculum) {
        // Get the saved progress
        const { data: progress, error: progressError } = await supabase
          .from('curriculum_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('curriculum_id', importedCurriculum.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError;
        }

        return {
          curriculum: importedCurriculum.curriculum,
          progress: progress || null
        };
      }

      return null;
    }
  });

  // Mutation to save progress
  const saveMutation = useMutation({
    mutationFn: async ({ moduleId, courseId }: { moduleId: string, courseId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: importedCurriculum } = await supabase
        .from('imported_curricula')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!importedCurriculum) throw new Error('No curriculum found');

      const { error } = await supabase
        .from('curriculum_progress')
        .upsert({
          user_id: user.id,
          curriculum_id: importedCurriculum.id,
          active_module_id: moduleId,
          active_course_id: courseId,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    }
  });

  // Load saved curriculum and progress
  useEffect(() => {
    if (savedCurriculum && !curriculum) {
      setCurriculum(savedCurriculum.curriculum);
      
      if (savedCurriculum.progress) {
        const course = savedCurriculum.curriculum.degrees[0]?.courses.find(
          c => c.id === savedCurriculum.progress.active_course_id
        );
        const module = course?.modules.find(
          m => m.id === savedCurriculum.progress.active_module_id
        );
        
        if (course) setActiveCourse(course);
        if (module) setActiveModule(module);
      } else if (savedCurriculum.curriculum.degrees[0]?.courses[0]?.modules[0]) {
        setActiveCourse(savedCurriculum.curriculum.degrees[0].courses[0]);
        setActiveModule(savedCurriculum.curriculum.degrees[0].courses[0].modules[0]);
      }
    }
  }, [savedCurriculum, curriculum]);

  // Save progress when active module/course changes
  useEffect(() => {
    if (activeModule?.id && activeCourse?.id) {
      saveMutation.mutate({
        moduleId: activeModule.id,
        courseId: activeCourse.id
      });
    }
  }, [activeModule?.id, activeCourse?.id]);

  const handleImport = (imported: Curriculum) => {
    setCurriculum(imported);
    if (imported.degrees[0]?.courses[0]?.modules[0]) {
      setActiveCourse(imported.degrees[0].courses[0]);
      setActiveModule(imported.degrees[0].courses[0].modules[0]);
    }
  };

  if (!curriculum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-bold mb-8">Learning</h1>
          <CurriculumImport onImport={handleImport} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl font-bold">{curriculum.name}</h1>
          <Progress value={33} className="w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {activeCourse && (
            <ModuleList
              modules={activeCourse.modules}
              activeModule={activeModule}
              onModuleSelect={setActiveModule}
            />
          )}
          <div className="md:col-span-3">
            {activeModule && <ModuleContent module={activeModule} />}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Learning;
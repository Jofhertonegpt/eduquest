import { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import CurriculumImport from "@/components/CurriculumImport";
import type { Curriculum, Module, Course } from "@/types/curriculum";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components
const ModuleList = lazy(() => import('@/components/learning/ModuleList'));
const ModuleContent = lazy(() => import('@/components/learning/ModuleContent'));

const Learning = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  // Query to fetch only user's uploaded curriculum
  const { data: savedCurriculum, isLoading } = useQuery({
    queryKey: ['saved-curriculum'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: importedCurriculum, error: importError } = await supabase
        .from('imported_curricula')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (importError && importError.code !== 'PGRST116') {
        throw importError;
      }

      if (importedCurriculum) {
        // Get the saved progress for this specific curriculum
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
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Load saved curriculum and progress
  useEffect(() => {
    if (savedCurriculum?.curriculum && !curriculum) {
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

  const handleImport = (imported: Curriculum) => {
    setCurriculum(imported);
    if (imported.degrees[0]?.courses[0]?.modules[0]) {
      setActiveCourse(imported.degrees[0].courses[0]);
      setActiveModule(imported.degrees[0].courses[0].modules[0]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : !curriculum ? (
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CurriculumImport onImport={handleImport} />
          </Suspense>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-display text-4xl font-bold">{curriculum.name}</h1>
              <Progress value={33} className="w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                {activeCourse && (
                  <ModuleList
                    modules={activeCourse.modules}
                    activeModule={activeModule}
                    onModuleSelect={setActiveModule}
                  />
                )}
              </Suspense>
              <div className="md:col-span-3">
                <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
                  {activeModule && <ModuleContent module={activeModule} />}
                </Suspense>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Learning;

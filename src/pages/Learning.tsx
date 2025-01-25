import { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import type { Curriculum, Module, Course } from "@/types/curriculum";
import { CurriculumFormatInfo } from "@/components/learning/CurriculumFormatInfo";
import { CurriculumSelector } from "@/components/learning/CurriculumSelector";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useCurriculum } from "@/hooks/use-curriculum";
import { useProgress } from "@/hooks/use-progress";

// Lazy load components
const ModuleList = lazy(() => import('@/components/learning/ModuleList'));
const ModuleContent = lazy(() => import('@/components/learning/ModuleContent').then(m => ({ default: m.ModuleContent })));
const CurriculumImport = lazy(() => import('@/components/CurriculumImport'));

const Learning = () => {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showImport, setShowImport] = useState(false);

  const { curricula, isLoading: isLoadingCurricula, importCurriculum } = useCurriculum();
  const { progress, updateProgress } = useProgress(
    curricula?.find(c => c.curriculum.name === curriculum?.name)?.id
  );

  const handleCurriculumChange = (curriculumId: string) => {
    if (curriculumId === 'new') {
      setShowImport(true);
      return;
    }
    const selectedCurriculum = curricula?.find(c => c.id === curriculumId)?.curriculum;
    if (selectedCurriculum) {
      setCurriculum(selectedCurriculum);
      if (selectedCurriculum.degrees[0]?.courses[0]) {
        setActiveCourse(selectedCurriculum.degrees[0].courses[0]);
        setActiveModule(selectedCurriculum.degrees[0].courses[0].modules[0] || null);
      }
    }
  };

  const handleImport = async (imported: Curriculum) => {
    await importCurriculum.mutateAsync(imported);
    setCurriculum(imported);
    if (imported.degrees[0]?.courses[0]?.modules[0]) {
      setActiveCourse(imported.degrees[0].courses[0]);
      setActiveModule(imported.degrees[0].courses[0].modules[0]);
    }
    setShowImport(false);
  };

  const handleModuleSelect = (module: Module) => {
    setActiveModule(module);
    if (activeCourse) {
      updateProgress.mutate({
        moduleId: module.id,
        courseId: activeCourse.id,
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8" role="main" aria-label="Learning content">
      <Breadcrumb className="mb-6" aria-label="Page navigation">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/learning">Learning</BreadcrumbLink>
        </BreadcrumbItem>
        {activeCourse && (
          <BreadcrumbItem>
            <BreadcrumbLink>{activeCourse.title}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {activeModule && (
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{activeModule.title}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoadingCurricula ? (
          <div className="space-y-6" aria-busy="true" aria-label="Loading content">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Skeleton className="h-[300px]" />
              <div className="md:col-span-3">
                <Skeleton className="h-[600px]" />
              </div>
            </div>
          </div>
        ) : !curriculum && (!curricula || curricula.length === 0) ? (
          <GlassPanel className="max-w-2xl mx-auto p-8 rounded-xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to Learning!</h2>
              <p className="text-muted-foreground mb-8">
                Get started by importing your curriculum. Need help with the format?
              </p>
              <div className="flex justify-center gap-4 mb-8">
                <CurriculumFormatInfo />
              </div>
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <CurriculumImport onImport={handleImport} />
              </Suspense>
            </div>
          </GlassPanel>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-display text-4xl font-bold">{curriculum?.name}</h1>
              <div className="flex items-center gap-4">
                <CurriculumSelector
                  curricula={curricula}
                  currentCurriculumId={curricula?.find(c => c.curriculum.name === curriculum?.name)?.id}
                  onCurriculumChange={handleCurriculumChange}
                />
                <Progress value={33} className="w-32" aria-label="Course progress" />
                <CurriculumFormatInfo />
              </div>
            </div>

            {showImport ? (
              <GlassPanel className="max-w-2xl mx-auto p-8 rounded-xl">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                  <CurriculumImport onImport={handleImport} />
                </Suspense>
              </GlassPanel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Suspense 
                  fallback={
                    <GlassPanel className="rounded-xl p-4">
                      <Skeleton className="h-[300px]" />
                    </GlassPanel>
                  }
                >
                  {activeCourse && (
                    <ModuleList
                      modules={activeCourse.modules}
                      activeModule={activeModule}
                      onModuleSelect={handleModuleSelect}
                    />
                  )}
                </Suspense>
                <div className="md:col-span-3">
                  <Suspense 
                    fallback={
                      <GlassPanel className="rounded-xl p-6">
                        <Skeleton className="h-[600px]" />
                      </GlassPanel>
                    }
                  >
                    {activeModule && <ModuleContent module={activeModule} />}
                  </Suspense>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
};

export default Learning;
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleList } from "./ModuleList";
import { ModuleContent } from "@/components/learning/ModuleContent";
import { useProgress } from "@/hooks/use-progress";
import type { Module } from "@/types/curriculum";

interface CurriculumViewerProps {
  curriculumId: string;
}

export const CurriculumViewer = ({ curriculumId }: CurriculumViewerProps) => {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const { updateProgress } = useProgress(curriculumId);

  const handleModuleSelect = (module: Module) => {
    setActiveModule(module);
    if (module.id) {
      updateProgress.mutate({
        moduleId: module.id,
        courseId: module.id, // Using module.id as courseId for now
      });
    }
  };

  return (
    <Tabs defaultValue="program" className="w-full">
      <TabsList className="grid grid-cols-6 w-full">
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
      </TabsList>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="md:col-span-1">
          <TabsContent value="program" className="mt-0">
            <ModuleList curriculumId={curriculumId} type="program" onModuleSelect={handleModuleSelect} />
          </TabsContent>
          
          <TabsContent value="courses" className="mt-0">
            <ModuleList curriculumId={curriculumId} type="course" onModuleSelect={handleModuleSelect} />
          </TabsContent>
          
          <TabsContent value="modules" className="mt-0">
            <ModuleList curriculumId={curriculumId} type="module" onModuleSelect={handleModuleSelect} />
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <ModuleList curriculumId={curriculumId} type="resource" onModuleSelect={handleModuleSelect} />
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-0">
            <ModuleList curriculumId={curriculumId} type="assignment" onModuleSelect={handleModuleSelect} />
          </TabsContent>
          
          <TabsContent value="quizzes" className="mt-0">
            <ModuleList curriculumId={curriculumId} type="quiz" onModuleSelect={handleModuleSelect} />
          </TabsContent>
        </div>

        <div className="md:col-span-3">
          {activeModule && <ModuleContent module={activeModule} />}
        </div>
      </div>
    </Tabs>
  );
};
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ModuleList } from "@/components/curriculum/ModuleList";
import { ModuleContent } from "@/components/learning/ModuleContent";
import { useProgress } from "@/hooks/use-progress";
import { useCurriculumQueries } from "@/hooks/useCurriculumQueries";
import type { Module } from "@/types/curriculum";

const Learning = () => {
  const { id } = useParams();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const { progress, updateProgress } = useProgress(id);
  const { modules, modulesLoading } = useCurriculumQueries(id);

  // Load last active module from progress
  useEffect(() => {
    if (progress?.active_module_id && modules) {
      const lastActiveModule = modules.find(
        m => m.module_data?.id === progress.active_module_id
      );
      if (lastActiveModule) {
        setSelectedModule(lastActiveModule.module_data as Module);
      }
    }
  }, [progress, modules]);

  const handleModuleSelect = async (module: Module) => {
    setSelectedModule(module);
    if (id) {
      await updateProgress.mutateAsync({
        moduleId: module.id,
        courseId: module.courseId
      });
    }
  };

  if (modulesLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 bg-card rounded-lg border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Modules</h2>
          </div>
          {id && (
            <ModuleList
              curriculumId={id}
              onModuleSelect={handleModuleSelect}
            />
          )}
        </div>
        <div className="col-span-9">
          {selectedModule ? (
            <ModuleContent module={selectedModule} />
          ) : (
            <Card className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to your curriculum!</h2>
              <p className="text-muted-foreground">
                Select a module from the list to begin learning.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;
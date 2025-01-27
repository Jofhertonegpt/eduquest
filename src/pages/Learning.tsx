import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModuleList } from '@/components/curriculum/ModuleList';
import { ModuleContent } from '@/components/learning/ModuleContent';
import { CurriculumSelector } from '@/components/learning/CurriculumSelector';
import { useCurriculum } from '@/hooks/use-curriculum';
import { useProgress } from '@/hooks/use-progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Module } from '@/types/curriculum';

const Learning = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const { curriculumId } = useParams();
  const { curricula, isLoading } = useCurriculum();
  const { updateProgress } = useProgress(curriculumId);

  const handleModuleSelect = async (module: Module) => {
    setSelectedModule(module);
    if (curriculumId) {
      await updateProgress.mutateAsync({
        moduleId: module.id,
        courseId: module.id, // This should be the actual course ID in a real implementation
      });
    }
  };

  const handleCurriculumChange = (id: string) => {
    // Reset selected module when curriculum changes
    setSelectedModule(null);
    // Handle curriculum change (you might want to add navigation here)
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Learning</h1>
          <CurriculumSelector
            curricula={curricula}
            currentCurriculumId={curriculumId}
            onCurriculumChange={handleCurriculumChange}
          />
        </div>

        {curriculumId && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <ModuleList
                curriculumId={curriculumId}
                onModuleSelect={handleModuleSelect}
              />
            </div>
            <div className="lg:col-span-8">
              {selectedModule ? (
                <ModuleContent module={selectedModule} />
              ) : (
                <div className="flex items-center justify-center h-[600px] rounded-xl border p-8 text-muted-foreground">
                  Select a module to begin learning
                </div>
              )}
            </div>
          </div>
        )}

        {!curriculumId && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Learning</h2>
            <p className="text-muted-foreground mb-8">
              Select a curriculum to start your learning journey
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
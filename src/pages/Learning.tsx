import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModuleContent } from '@/components/learning/ModuleContent';
import { ModuleList } from '@/components/curriculum/ModuleList';
import { useCurriculumQueries } from '@/hooks/useCurriculumQueries';
import type { Module, ModuleData } from '@/types/curriculum';

export default function Learning() {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const { modules, modulesLoading, modulesError } = useCurriculumQueries(curriculumId);

  const handleModuleSelect = (module: ModuleData) => {
    const fullModule = {
      ...module,
      resources: [],
      assignments: [],
      quizzes: [],
      credits: 0
    } as Module;
    
    setSelectedModule(fullModule);
  };

  if (modulesLoading) {
    return <div>Loading modules...</div>;
  }

  if (modulesError) {
    return <div>Error loading modules: {modulesError.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <ModuleList
          curriculumId={curriculumId}
          modules={modules}
          onModuleSelect={handleModuleSelect}
        />
        {selectedModule && <ModuleContent module={selectedModule} />}
      </div>
    </div>
  );
}

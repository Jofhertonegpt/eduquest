import { useState } from 'react';
import { ProgramList } from '@/components/curriculum/ProgramList';
import { CurriculumViewer } from '@/components/curriculum/CurriculumViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { ProgramInfo } from '@/types/curriculum-types';

const Learning = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramInfo | null>(null);

  const handleBack = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedProgram ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </Button>
            <h1 className="text-3xl font-bold">{selectedProgram.name}</h1>
          </div>
          <CurriculumViewer programId={selectedProgram.id} />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8">Learning Programs</h1>
          <ProgramList onProgramSelect={setSelectedProgram} />
        </>
      )}
    </div>
  );
};

export default Learning;
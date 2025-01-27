import { useState } from 'react';
import { ProgramList } from '@/components/curriculum/ProgramList';
import { CurriculumViewer } from '@/components/curriculum/CurriculumViewer';
import type { ProgramInfo } from '@/types/curriculum-types';

const Learning = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramInfo | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Learning Programs</h1>
      
      {selectedProgram ? (
        <CurriculumViewer programId={selectedProgram.id} />
      ) : (
        <ProgramList onProgramSelect={setSelectedProgram} />
      )}
    </div>
  );
};

export default Learning;
<<<<<<< HEAD
=======
import { useState, useEffect } from 'react';
import { CourseCard } from '@/components/home/CourseCard';
import { CurriculumManager } from '@/lib/curriculum/manager';
import type { Program } from '@/types/curriculum';
import { useToast } from '@/hooks/use-toast';

>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5
interface CurriculumViewProps {
  programId: string;
}

export const CurriculumView = ({ programId }: CurriculumViewProps) => {
<<<<<<< HEAD
  const [curriculumData, setCurriculumData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadCurriculumData();
      setCurriculumData(data);
    };
    loadData();
  }, [programId]);

  return (
    <div>
      <h1>{curriculumData?.program.name}</h1>
      <div className="courses-grid">
        {curriculumData?.courses.map(course => (
          <CourseCard 
            key={course.id}
            course={course}
            modules={course.modules}
          />
        ))}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { loadCurriculumData } from '@/lib/curriculum-loader';
import { CourseCard } from '@/components/home/CourseCard';
=======
  const [manager] = useState(() => new CurriculumManager());
  const [program, setProgram] = useState<Program | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      try {
        await manager.initialize();
        const loadedProgram = manager.getProgram();
        setProgram(loadedProgram);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading curriculum",
          description: "Failed to load the curriculum data. Please try again."
        });
      }
    };
    init();
  }, [programId]);

  if (!program) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{program.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {program.degrees[0].courses.map((courseId, index) => {
          const course = manager.getCourse(courseId);
          if (!course) return null;
          
          return (
            <CourseCard 
              key={courseId}
              course={course}
              modules={manager.getCourseModules(courseId)}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};
>>>>>>> 805ef23d12118d30d69bc74a6f2381c6c24686b5

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CurriculumManager } from '@/lib/curriculum/manager';
import { Program } from '@/types/curriculum';
import { CourseCard } from '@/components/home/CourseCard';

interface CurriculumViewProps {
  programId: string;
}

export const CurriculumView = ({ programId }: CurriculumViewProps) => {
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
  }, [programId, manager, toast]);

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

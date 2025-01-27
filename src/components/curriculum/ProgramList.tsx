import { usePrograms } from '@/hooks/useCurriculum';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Book, Target } from 'lucide-react';
import type { ProgramInfo } from '@/types/curriculum-types';

interface ProgramListProps {
  onProgramSelect: (program: ProgramInfo) => void;
}

export function ProgramList({ onProgramSelect }: ProgramListProps) {
  const { data: programs, isLoading } = usePrograms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border">
      <div className="p-4 space-y-4">
        {programs?.map((program) => (
          <Card 
            key={program.id}
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
          >
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {program.name}
                </h3>
                <p className="text-muted-foreground mt-2">{program.description}</p>
              </div>
              
              {program.programOutcomes && program.programOutcomes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Program Outcomes
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {program.programOutcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Book className="h-3 w-3" />
                    {program.institution}
                  </Badge>
                </div>
                <Button onClick={() => onProgramSelect(program)}>
                  View Program
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
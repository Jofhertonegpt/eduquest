import { usePrograms } from '@/hooks/useCurriculum';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {programs?.map((program) => (
          <Card 
            key={program.id}
            className="p-4 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onProgramSelect(program)}
          >
            <h3 className="text-lg font-semibold">{program.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
            
            {program.programOutcomes.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Program Outcomes:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {program.programOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">{program.institution}</span>
              <Button variant="outline" onClick={() => onProgramSelect(program)}>
                View Program
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
import { useState, useEffect } from 'react';
import { useDegrees, useCourses, useModules } from '@/hooks/useCurriculum';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { Degree, Course, CourseModule } from '@/types/curriculum-types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CurriculumViewerProps {
  programId: string;
}

export function CurriculumViewer({ programId }: CurriculumViewerProps) {
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const { toast } = useToast();

  const { data: degrees, isLoading: loadingDegrees } = useDegrees(programId);
  const { data: courses, isLoading: loadingCourses } = useCourses(selectedDegree?.id);
  const { data: modules, isLoading: loadingModules } = useModules(selectedCourse?.id);

  useEffect(() => {
    const initializeModules = async () => {
      try {
        // Check if modules exist for this curriculum
        const { data: existingModules, error: checkError } = await supabase
          .from('curriculum_modules')
          .select('*')
          .eq('curriculum_id', programId);

        if (checkError) throw checkError;

        // If no modules exist, initialize them from the default data
        if (!existingModules || existingModules.length === 0) {
          console.log('No modules found, initializing from defaults');
          
          // Import default modules
          const defaultModules = await import('@/data/curriculum/New defaults/modules.json');
          
          // Insert modules into the database
          const { error: insertError } = await supabase
            .from('curriculum_modules')
            .insert(defaultModules.default.map((module: any) => ({
              curriculum_id: programId,
              module_type: 'module',
              content: module,
              display_order: module.order || 0
            })));

          if (insertError) {
            console.error('Error inserting modules:', insertError);
            toast({
              title: "Error initializing modules",
              description: "There was an error loading the curriculum modules.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Modules initialized",
              description: "Curriculum modules have been loaded successfully."
            });
          }
        }
      } catch (error) {
        console.error('Error in initializeModules:', error);
        toast({
          title: "Error",
          description: "Failed to initialize curriculum modules.",
          variant: "destructive"
        });
      }
    };

    if (programId) {
      initializeModules();
    }
  }, [programId, toast]);

  return (
    <Tabs defaultValue="degrees" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="degrees">Degrees</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="degrees">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            <div className="space-y-4">
              {degrees?.map((degree) => (
                <Card
                  key={degree.id}
                  className="p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedDegree(degree)}
                >
                  <h3 className="text-lg font-semibold">{degree.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{degree.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">Credits: {degree.requiredCredits}</span>
                    <Button variant="outline" onClick={() => setSelectedDegree(degree)}>
                      View Courses
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="courses">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            <div className="space-y-4">
              {courses?.map((course) => (
                <Card
                  key={course.id}
                  className="p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedCourse(course)}
                >
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">Credits: {course.credits}</span>
                    <Button variant="outline" onClick={() => setSelectedCourse(course)}>
                      View Modules
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="modules">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            <div className="space-y-4">
              {modules?.map((module) => (
                <Card
                  key={module.id}
                  className="p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedModule(module)}
                >
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Learning Objectives:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {module.learningObjectives.map((objective) => (
                        <li key={objective.id}>{objective.description}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="content">
          {selectedModule && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedModule.title}</h2>
                <p className="text-muted-foreground">{selectedModule.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Learning Objectives</h3>
                <ul className="list-disc list-inside space-y-2">
                  {selectedModule.learningObjectives.map((objective) => (
                    <li key={objective.id}>
                      {objective.description}
                      <ul className="ml-6 mt-2 list-circle">
                        {objective.assessmentCriteria.map((criterion, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}
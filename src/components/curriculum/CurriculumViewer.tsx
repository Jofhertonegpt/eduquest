import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleList } from "./ModuleList";

interface CurriculumViewerProps {
  curriculumId: string;
}

export const CurriculumViewer = ({ curriculumId }: CurriculumViewerProps) => {
  return (
    <Tabs defaultValue="program" className="w-full">
      <TabsList>
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
      </TabsList>

      <TabsContent value="program">
        <ModuleList curriculumId={curriculumId} type="program" />
      </TabsContent>
      
      <TabsContent value="courses">
        <ModuleList curriculumId={curriculumId} type="course" />
      </TabsContent>
      
      <TabsContent value="modules">
        <ModuleList curriculumId={curriculumId} type="module" />
      </TabsContent>
      
      <TabsContent value="resources">
        <ModuleList curriculumId={curriculumId} type="resource" />
      </TabsContent>
      
      <TabsContent value="assignments">
        <ModuleList curriculumId={curriculumId} type="assignment" />
      </TabsContent>
      
      <TabsContent value="quizzes">
        <ModuleList curriculumId={curriculumId} type="quiz" />
      </TabsContent>
    </Tabs>
  );
};
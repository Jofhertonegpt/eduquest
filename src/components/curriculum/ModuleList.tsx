import { useCurriculumModules } from "@/hooks/useCurriculumModules";
import { ModuleType } from "@/types/curriculum-module";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, CheckCircle } from "lucide-react";
import type { Module } from "@/types/curriculum";

interface ModuleListProps {
  curriculumId: string;
  type?: ModuleType;
  onModuleSelect: (module: Module) => void;
}

export const ModuleList = ({ curriculumId, type, onModuleSelect }: ModuleListProps) => {
  const { data: modules, isLoading } = useCurriculumModules(curriculumId, type);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="resources" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Resources
        </TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Assignments
        </TabsTrigger>
        <TabsTrigger value="quizzes" className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Quizzes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="resources">
        <ModuleList.Content
          modules={modules?.filter(m => m.content.type === 'resource')}
          onModuleSelect={onModuleSelect}
        />
      </TabsContent>

      <TabsContent value="assignments">
        <ModuleList.Content
          modules={modules?.filter(m => m.content.type === 'assignment')}
          onModuleSelect={onModuleSelect}
        />
      </TabsContent>

      <TabsContent value="quizzes">
        <ModuleList.Content
          modules={modules?.filter(m => m.content.type === 'quiz')}
          onModuleSelect={onModuleSelect}
        />
      </TabsContent>
    </Tabs>
  );
};

ModuleList.Content = function ModuleListContent({ 
  modules, 
  onModuleSelect 
}: { 
  modules?: { content: Module }[];
  onModuleSelect: (module: Module) => void;
}) {
  if (!modules?.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No modules available
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {modules.map((module) => (
          <Card 
            key={module.content.id} 
            className="p-4 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onModuleSelect(module.content)}
          >
            <h3 className="text-lg font-semibold">
              {module.content.title || "Untitled Module"}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {module.content.description || "No description available"}
            </p>
            <div className="flex flex-wrap gap-2">
              {module.content.metadata?.estimatedTime && (
                <Badge variant="outline">
                  {module.content.metadata.estimatedTime} mins
                </Badge>
              )}
              {module.content.metadata?.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
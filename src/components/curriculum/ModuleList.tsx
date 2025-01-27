import { useCurriculumModules } from "@/hooks/useCurriculumModules";
import { ModuleType } from "@/types/curriculum-module";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, CheckCircle, Clock, Tag } from "lucide-react";
import type { Module } from "@/types/curriculum";
import { useCurriculumQueries } from "@/hooks/useCurriculumQueries";
import { Skeleton } from "@/components/ui/skeleton";

interface ModuleListProps {
  curriculumId: string;
  type?: ModuleType;
  onModuleSelect: (module: Module) => void;
}

const ModuleListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 border rounded-lg">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const ModuleList = ({ curriculumId, type, onModuleSelect }: ModuleListProps) => {
  const { modules, modulesLoading, prefetchModuleContent } = useCurriculumQueries(curriculumId);

  if (modulesLoading) {
    return <ModuleListSkeleton />;
  }

  const filterModulesByType = (modules: any[], moduleType: string) => {
    return modules?.filter(m => m.module_type === moduleType) || [];
  };

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
          modules={filterModulesByType(modules, 'resource')}
          onModuleSelect={onModuleSelect}
          onModuleHover={prefetchModuleContent}
        />
      </TabsContent>

      <TabsContent value="assignments">
        <ModuleList.Content
          modules={filterModulesByType(modules, 'assignment')}
          onModuleSelect={onModuleSelect}
          onModuleHover={prefetchModuleContent}
        />
      </TabsContent>

      <TabsContent value="quizzes">
        <ModuleList.Content
          modules={filterModulesByType(modules, 'quiz')}
          onModuleSelect={onModuleSelect}
          onModuleHover={prefetchModuleContent}
        />
      </TabsContent>
    </Tabs>
  );
};

ModuleList.Content = function ModuleListContent({ 
  modules, 
  onModuleSelect,
  onModuleHover 
}: { 
  modules?: { content: Module }[];
  onModuleSelect: (module: Module) => void;
  onModuleHover: (moduleId: string) => void;
}) {
  if (!modules?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <div className="mb-4">
          <FileText className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <p className="text-sm">No modules available</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {modules.map((module) => (
          <Card 
            key={module.content.id} 
            className="p-4 hover:bg-accent cursor-pointer transition-all duration-200 hover:shadow-md"
            onClick={() => onModuleSelect(module.content)}
            onMouseEnter={() => onModuleHover(module.content.id)}
          >
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {module.content.title || "Untitled Module"}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {module.content.description || "No description available"}
            </p>
            <div className="flex flex-wrap gap-2">
              {module.content.metadata?.estimatedTime && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.content.metadata.estimatedTime} mins
                </Badge>
              )}
              {module.content.metadata?.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
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
import { useCurriculumModules } from "@/hooks/useCurriculumModules";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, CheckCircle } from "lucide-react";
import type { Module } from "@/types/curriculum";
import { useCurriculumQueries } from "@/hooks/useCurriculumQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleCard } from "@/components/learning/ModuleCard";
import { filterModulesByType } from "@/utils/learning-utils";
import type { ModuleListProps } from "@/types/learning-types";

const ModuleListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 border rounded-lg bg-card">
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

  return (
    <Tabs defaultValue="resources" className="w-full">
      <TabsList className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

      <TabsContent value="resources" className="mt-4">
        <ModuleList.Content
          modules={filterModulesByType(modules, 'resource')}
          onModuleSelect={onModuleSelect}
          onModuleHover={prefetchModuleContent}
        />
      </TabsContent>

      <TabsContent value="assignments" className="mt-4">
        <ModuleList.Content
          modules={filterModulesByType(modules, 'assignment')}
          onModuleSelect={onModuleSelect}
          onModuleHover={prefetchModuleContent}
        />
      </TabsContent>

      <TabsContent value="quizzes" className="mt-4">
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
      <div className="p-8 text-center text-muted-foreground bg-card/50 rounded-lg border border-border/50">
        <div className="mb-4">
          <FileText className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <p className="text-sm">No modules available</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] rounded-md">
      <div className="space-y-4 p-4">
        {modules.map((module) => (
          <ModuleCard
            key={module.content.id}
            module={module.content}
            onClick={() => onModuleSelect(module.content)}
            onHover={() => onModuleHover(module.content.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
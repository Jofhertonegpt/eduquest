import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronDown, BookOpen, FileText, CheckCircle } from "lucide-react";
import { useCurriculumQueries } from "@/hooks/useCurriculumQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ModuleListProps } from "@/types/learning-types";
import type { Module } from "@/types/curriculum";

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

export const ModuleList = ({ curriculumId, onModuleSelect }: ModuleListProps) => {
  const { modules, modulesLoading, modulesError } = useCurriculumQueries(curriculumId);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  if (modulesLoading) {
    return <ModuleListSkeleton />;
  }

  if (modulesError) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Error loading modules: {modulesError.message}</p>
      </div>
    );
  }

  if (!modules?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No modules available for this curriculum</p>
      </div>
    );
  }

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Group modules by course using module_data
  const courseGroups = modules.reduce((acc, module) => {
    const moduleData = module.module_data as any;
    const courseId = moduleData?.courseId || 'uncategorized';
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(moduleData);
    return acc;
  }, {} as Record<string, Module[]>);

  const getModuleTypeIcon = (type?: string) => {
    switch (type) {
      case 'resource':
        return <BookOpen className="w-4 h-4" />;
      case 'assignment':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="p-4 space-y-4">
        {Object.entries(courseGroups).map(([courseId, courseModules]) => (
          <Collapsible
            key={courseId}
            open={expandedCourses.includes(courseId)}
            onOpenChange={() => toggleCourse(courseId)}
          >
            <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-accent rounded-lg">
              {expandedCourses.includes(courseId) ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <span className="font-medium">
                {courseId === 'uncategorized' ? 'General Modules' : `Course ${courseId}`}
              </span>
              <Badge variant="secondary" className="ml-2">
                {courseModules.length}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 mt-2 space-y-2">
              {courseModules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg cursor-pointer"
                  onClick={() => onModuleSelect(module)}
                >
                  {getModuleTypeIcon(module.type)}
                  <span>{module.title}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </ScrollArea>
  );
};
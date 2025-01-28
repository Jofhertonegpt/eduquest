import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Module } from "@/types/curriculum";
import { ModuleHeader } from "./ModuleHeader";
import { LearningObjectives } from "./LearningObjectives";
import { ResourcesTab } from "./ResourcesTab";
import { QuizzesTab } from "./QuizzesTab";
import { AssignmentsTab } from "./AssignmentsTab";

interface ModuleContentProps {
  module: Module;
}

export const ModuleContent = ({ module }: ModuleContentProps) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(() => {
    try {
      const savedProgress = localStorage.getItem(`module-progress-${module.id}`);
      return savedProgress ? JSON.parse(savedProgress) : {
        completedResources: [],
        completedQuizzes: [],
        completedAssignments: [],
        overallProgress: 0
      };
    } catch (error) {
      console.error('Error loading progress:', error);
      return {
        completedResources: [],
        completedQuizzes: [],
        completedAssignments: [],
        overallProgress: 0
      };
    }
  });

  const updateProgress = useCallback((newProgress: any) => {
    const total = (module.resources?.length || 0) + 
                 (module.quizzes?.length || 0) + 
                 (module.assignments?.length || 0);
    
    if (total === 0) return;

    const completed = 
      newProgress.completedResources.length + 
      newProgress.completedQuizzes.length + 
      newProgress.completedAssignments.length;
    
    const overallProgress = Math.round((completed / total) * 100);
    
    const finalProgress = {
      ...newProgress,
      overallProgress
    };
    
    setProgress(finalProgress);
    
    try {
      localStorage.setItem(`module-progress-${module.id}`, JSON.stringify(finalProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        variant: "destructive",
        title: "Error saving progress",
        description: "Your progress may not be saved correctly."
      });
    }
  }, [module.id, module.resources?.length, module.quizzes?.length, module.assignments?.length, toast]);

  const handleResourceComplete = useCallback((resourceId: string) => {
    const newProgress = {
      ...progress,
      completedResources: [...progress.completedResources, resourceId]
    };
    updateProgress(newProgress);
  }, [progress, updateProgress]);

  const handleQuizComplete = useCallback((score: number) => {
    const newProgress = {
      ...progress,
      completedQuizzes: [...progress.completedQuizzes, score]
    };
    updateProgress(newProgress);
    
    toast({
      title: `Quiz completed with score: ${score}%`,
      description: "Your progress has been saved",
      className: score > 80 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-yellow-500"
    });
  }, [progress, updateProgress, toast]);

  useEffect(() => {
    return () => {
      const timeoutIds = (window as any).__moduleTimeouts || [];
      timeoutIds.forEach((id: number) => clearTimeout(id));
      (window as any).__moduleTimeouts = [];
    };
  }, []);

  if (!module) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No module content available
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <ModuleHeader module={module} progress={progress.overallProgress} />
      <LearningObjectives module={module} />
      
      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <ResourcesTab
            module={module}
            completedResources={progress.completedResources}
            onResourceComplete={handleResourceComplete}
          />
        </TabsContent>

        <TabsContent value="quizzes">
          <QuizzesTab
            module={module}
            completedQuizzes={progress.completedQuizzes}
            onQuizComplete={handleQuizComplete}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTab
            module={module}
            completedAssignments={progress.completedAssignments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
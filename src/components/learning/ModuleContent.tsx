import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BookOpen, FileText, CheckCircle, Clock, Target } from "lucide-react";
import type { Module } from "@/types/curriculum";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ResourceSection } from "./content/ResourceSection";
import { QuizSection } from "./content/QuizSection";
import { AssignmentSection } from "./content/AssignmentSection";

interface ModuleContentProps {
  module: Module;
}

export const ModuleContent = ({ module }: ModuleContentProps) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem(`module-progress-${module.id}`);
    return savedProgress ? JSON.parse(savedProgress) : {
      completedResources: [],
      completedQuizzes: [],
      completedAssignments: [],
      overallProgress: 0
    };
  });

  const handleResourceComplete = (resourceId: string) => {
    const newProgress = {
      ...progress,
      completedResources: [...progress.completedResources, resourceId]
    };
    updateProgress(newProgress);
  };

  const handleQuizComplete = (score: number) => {
    const newProgress = {
      ...progress,
      completedQuizzes: [...progress.completedQuizzes, score]
    };
    updateProgress(newProgress);
    
    toast({
      title: "Quiz completed",
      description: `You scored ${score} points!`,
      className: cn(
        "bg-green-50 border-green-200",
        score > 80 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-yellow-500"
      )
    });
  };

  const updateProgress = (newProgress: any) => {
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
    localStorage.setItem(`module-progress-${module.id}`, JSON.stringify(finalProgress));
  };

  if (!module) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Select a module to begin</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
            <p className="text-muted-foreground mb-4">{module.description}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <Progress value={progress.overallProgress} className="w-32" />
            </div>
            <p className="text-sm text-muted-foreground">
              {progress.overallProgress}% Complete
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {module.metadata?.estimatedTime || 0} mins
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {module.metadata?.difficulty || "beginner"}
          </Badge>
          {module.metadata?.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>

        {module.learningObjectives?.length > 0 && (
          <Card className="mb-6 hover:shadow-md transition-shadow">
            <div className="p-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Target className="w-5 h-5 text-primary" />
                Learning Objectives
              </h3>
              <ul className="mt-2 space-y-2">
                {module.learningObjectives.map((objective) => (
                  <li key={objective.id} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                    <span>{objective.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}
      </div>

      <Tabs defaultValue="resources" className="animate-fade-in">
        <TabsList className="mb-4">
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Resources ({module.resources?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Assignments ({module.assignments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Quizzes ({module.quizzes?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-4 space-y-6">
          <ResourceSection
            resources={module.resources}
            completedResources={progress.completedResources}
            onResourceComplete={handleResourceComplete}
          />
        </TabsContent>

        <TabsContent value="quizzes" className="mt-4">
          <QuizSection
            quizzes={module.quizzes}
            completedQuizzes={progress.completedQuizzes}
            onQuizComplete={handleQuizComplete}
          />
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <AssignmentSection
            assignments={module.assignments}
            completedAssignments={progress.completedAssignments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
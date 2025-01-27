import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, CheckCircle, Clock, Target, Code, Award } from "lucide-react";
import type { Module } from "@/types/curriculum";
import { ResourceViewer } from "./ResourceViewer";
import { QuizPlayer } from "./QuizPlayer";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const ModuleContent = ({ module }: { module: Module }) => {
  const { toast } = useToast();

  const handleQuizComplete = (score: number) => {
    toast({
      title: "Quiz completed",
      description: `You scored ${score} points!`,
      className: cn(
        "bg-green-50 border-green-200",
        score > 80 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-yellow-500"
      )
    });
  };

  return (
    <div className="glass-panel rounded-xl p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
        <p className="text-muted-foreground mb-4">{module.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {module.metadata.estimatedTime} mins
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {module.metadata.difficulty}
          </Badge>
          {module.metadata.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>

        <Card className="mb-6 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {module.learningObjectives.map((objective) => (
                <li key={objective.id} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
                  <span>{objective.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resources" className="animate-fade-in">
        <TabsList className="mb-4">
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
          <TabsTrigger value="coding" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Practice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-4 space-y-6">
          <div className="space-y-6">
            {module.resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>
                    {resource.type} • {resource.duration || "No duration"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResourceViewer resource={resource} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <div className="space-y-4">
            {module.assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {assignment.points} points
                    </span>
                  </div>
                  {assignment.rubric && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Grading Rubric</h4>
                      <ul className="space-y-2">
                        {assignment.rubric.criteria.map((criterion, index) => (
                          <li key={index} className="flex justify-between p-2 bg-muted rounded-lg">
                            <span>{criterion.name}</span>
                            <span className="font-medium">{criterion.points} pts</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4">
                    <CodeEditor />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-4">
          <div className="space-y-4">
            {module.quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardContent className="pt-6">
                  <QuizPlayer quiz={quiz} onComplete={handleQuizComplete} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coding" className="mt-4">
          <div className="space-y-4">
            {module.resources
              .filter((resource) => resource.type === 'code')
              .map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeEditor />
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
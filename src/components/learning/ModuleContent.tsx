import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, CheckCircle } from "lucide-react";
import type { Module } from "@/types/curriculum";
import { ResourceViewer } from "./ResourceViewer";
import CodeEditor from "@/components/CodeEditor";

export const ModuleContent = ({ module }: { module: Module }) => {
  return (
    <div className="glass-panel rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
      <p className="text-muted-foreground mb-6">{module.description}</p>

      <Tabs defaultValue="resources">
        <TabsList>
          <TabsTrigger value="resources">
            <BookOpen className="w-4 h-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <FileText className="w-4 h-4 mr-2" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <CheckCircle className="w-4 h-4 mr-2" />
            Quizzes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-4">
          <div className="space-y-6">
            {module.resources.map((resource) => (
              <div
                key={resource.id}
                className="p-4 rounded-lg border hover:border-primary transition-colors"
              >
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.type} • {resource.duration || "No duration"}
                </p>
                <ResourceViewer resource={resource} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <div className="space-y-4">
            {module.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-lg border hover:border-primary transition-colors"
              >
                <h3 className="font-semibold">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {assignment.description}
                </p>
                <div className="flex justify-between text-sm mb-4">
                  <span>Due: {assignment.dueDate}</span>
                  <span>{assignment.points} points</span>
                </div>
                <CodeEditor />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-4">
          <div className="space-y-4">
            {module.quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="font-semibold">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {quiz.questions.length} questions
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
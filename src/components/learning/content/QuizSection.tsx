import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { QuizPlayer } from "../QuizPlayer";
import type { Quiz } from "@/types/curriculum";

interface QuizSectionProps {
  quizzes: Quiz[];
  completedQuizzes: number[];
  onQuizComplete: (score: number) => void;
}

export const QuizSection = ({ 
  quizzes, 
  completedQuizzes, 
  onQuizComplete 
}: QuizSectionProps) => {
  if (!quizzes?.length) {
    return (
      <Card className="p-6 text-center">
        <CardDescription>No quizzes available for this module</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </div>
              {completedQuizzes.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Score: {completedQuizzes[0]}%
                </Badge>
              )}
            </div>
            <QuizPlayer quiz={quiz} onComplete={onQuizComplete} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
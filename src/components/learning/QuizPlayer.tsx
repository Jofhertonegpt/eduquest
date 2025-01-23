import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Quiz } from "@/types/curriculum";

interface QuizPlayerProps {
  quiz: Quiz;
}

export const QuizPlayer = ({ quiz }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = parseInt(value);
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
      });
      return;
    }
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleSubmit = () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
      });
      return;
    }

    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    setIsSubmitted(true);
    toast({
      title: "Quiz completed!",
      description: `Your score: ${score}%`,
    });
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <p className="font-medium">{question.question}</p>
                <p className={selectedAnswers[index] === question.correctAnswer ? "text-green-600" : "text-red-600"}>
                  Your answer: {question.options[selectedAnswers[index]]}
                </p>
                <p className="text-green-600">
                  Correct answer: {question.options[question.correctAnswer]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-medium">{currentQuestion.question}</p>
          <RadioGroup
            value={selectedAnswers[currentQuestionIndex]?.toString()}
            onValueChange={handleAnswerSelect}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isLastQuestion ? (
          <Button onClick={handleSubmit}>Submit Quiz</Button>
        ) : (
          <Button onClick={handleNext}>Next Question</Button>
        )}
      </CardFooter>
    </Card>
  );
};
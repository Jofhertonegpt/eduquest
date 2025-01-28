import { useState, useCallback, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import CodeEditor from "@/components/CodeEditor";
import { handleError } from "@/lib/errorHandling";
import type { Quiz, Question } from "@/types/curriculum";

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

const SUBMISSION_TIMEOUT = 30000; // 30 seconds timeout

export const QuizPlayer = ({ quiz, onComplete }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const validateAnswer = useCallback((question: Question, answer: any): boolean => {
    if (!answer) return false;

    switch (question.type) {
      case 'multiple-choice':
        return typeof answer === 'number' && answer >= 0 && answer < question.options.length;
      case 'essay':
        return typeof answer === 'string' && answer.trim().length > 0;
      case 'coding':
        return typeof answer === 'string' && answer.trim().length > 0;
      default:
        return false;
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    if (!validateAnswer(currentQuestion, answers[currentQuestion.id])) {
      toast({
        title: "Invalid Answer",
        description: "Please provide a valid answer before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    submitTimeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Submission Timeout",
        description: "The submission took too long. Please try again.",
        variant: "destructive",
      });
    }, SUBMISSION_TIMEOUT);

    try {
      if (currentQuestionIndex === quiz.questions.length - 1) {
        setSubmitted(true);
        const score = calculateScore();
        onComplete(score);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      handleError(error, "Quiz submission error");
    } finally {
      setIsSubmitting(false);
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    }
  }, [currentQuestionIndex, quiz.questions, answers, isSubmitting, onComplete]);

  const calculateScore = useCallback(() => {
    let totalScore = 0;
    quiz.questions.forEach((question) => {
      if ('correctAnswer' in question && answers[question.id] === question.correctAnswer) {
        totalScore += question.points;
      }
    });
    return totalScore;
  }, [quiz.questions, answers]);

  const handleAnswerChange = useCallback((questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const renderQuestion = useCallback((question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'essay':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Write your answer here..."
            className="min-h-[200px]"
          />
        );
      case 'coding':
        return (
          <CodeEditor
            initialValue={question.initialCode || ''}
            onChange={(value) => handleAnswerChange(question.id, value)}
          />
        );
      default:
        return <p>Question type not supported</p>;
    }
  }, [answers, handleAnswerChange]);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Quiz Complete!</h3>
          <p>Your score: {calculateScore()} points</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{currentQuestion.title}</h3>
        <p className="text-muted-foreground mb-4">{currentQuestion.description}</p>
        {renderQuestion(currentQuestion)}
      </div>
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : currentQuestionIndex === quiz.questions.length - 1 ? 'Submit' : 'Next Question'}
      </Button>
    </div>
  );
};
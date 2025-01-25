import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CodeEditor from "@/components/CodeEditor";
import type { Quiz, Question } from "@/types/curriculum";

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

export const QuizPlayer = ({ quiz, onComplete }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (currentQuestionIndex === quiz.questions.length - 1) {
      setSubmitted(true);
      const score = calculateScore();
      onComplete(score);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    quiz.questions.forEach((question) => {
      if ('correctAnswer' in question && answers[question.id] === question.correctAnswer) {
        totalScore += question.points;
      }
    });
    return totalScore;
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => setAnswers({ ...answers, [question.id]: parseInt(value) })}
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
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder="Write your answer here..."
            className="min-h-[200px]"
          />
        );
      case 'coding':
        return (
          <CodeEditor
            initialValue={question.initialCode || ''}
            onChange={(value) => setAnswers({ ...answers, [question.id]: value })}
          />
        );
      default:
        return <p>Question type not supported</p>;
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold mb-2">Quiz Complete!</h3>
        <p>Your score: {calculateScore()} points</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{currentQuestion.title}</h3>
        <p className="text-muted-foreground mb-4">{currentQuestion.description}</p>
        {renderQuestion(currentQuestion)}
      </div>
      <Button onClick={handleSubmit}>
        {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit' : 'Next Question'}
      </Button>
    </div>
  );
};
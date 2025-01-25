import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/CodeEditor";
import type { Quiz, Question, MultipleChoiceQuestion, EssayQuestion, CodingQuestion, TrueFalseQuestion, ShortAnswerQuestion, MatchingQuestion } from "@/types/curriculum";

interface QuizPlayerProps {
  quiz: Quiz;
}

export const QuizPlayer = ({ quiz }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoice(question as MultipleChoiceQuestion);
      case 'essay':
        return renderEssay(question as EssayQuestion);
      case 'coding':
        return renderCoding(question as CodingQuestion);
      case 'true-false':
        return renderTrueFalse(question as TrueFalseQuestion);
      case 'short-answer':
        return renderShortAnswer(question as ShortAnswerQuestion);
      case 'matching':
        return renderMatching(question as MatchingQuestion);
      default:
        return <p>Unsupported question type</p>;
    }
  };

  const renderMultipleChoice = (question: MultipleChoiceQuestion) => (
    <RadioGroup
      value={answers[question.id]?.toString()}
      onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
    >
      {question.options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
          <Label htmlFor={`option-${index}`}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  );

  const renderEssay = (question: EssayQuestion) => (
    <Textarea
      value={answers[question.id] || ''}
      onChange={(e) => handleAnswer(question.id, e.target.value)}
      placeholder="Write your essay answer here..."
      className="min-h-[200px]"
    />
  );

  const renderCoding = (question: CodingQuestion) => (
    <div className="space-y-4">
      <CodeEditor
        initialFiles={{
          "solution.js": {
            content: answers[question.id] || question.initialCode || '',
            language: "javascript"
          }
        }}
        onChange={(files) => handleAnswer(question.id, files["solution.js"].content)}
      />
      {question.testCases && (
        <div className="text-sm text-muted-foreground">
          <h4 className="font-semibold mb-2">Test Cases:</h4>
          <ul className="list-disc list-inside">
            {question.testCases.map((testCase, index) => (
              <li key={index}>
                Input: {testCase.input} → Expected: {testCase.expectedOutput}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderTrueFalse = (question: TrueFalseQuestion) => (
    <RadioGroup
      value={answers[question.id]?.toString()}
      onValueChange={(value) => handleAnswer(question.id, value === 'true')}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id="true" />
        <Label htmlFor="true">True</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id="false" />
        <Label htmlFor="false">False</Label>
      </div>
    </RadioGroup>
  );

  const renderShortAnswer = (question: ShortAnswerQuestion) => (
    <Textarea
      value={answers[question.id] || ''}
      onChange={(e) => handleAnswer(question.id, e.target.value)}
      placeholder="Write your answer here..."
      className="min-h-[100px]"
    />
  );

  const renderMatching = (question: MatchingQuestion) => (
    <div className="space-y-4">
      {question.pairs.map((pair, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="font-medium">{pair.left}</span>
          <Textarea
            value={answers[`${question.id}-${index}`] || ''}
            onChange={(e) => handleAnswer(`${question.id}-${index}`, e.target.value)}
            placeholder="Match with the correct answer..."
            className="flex-1"
          />
        </div>
      ))}
    </div>
  );

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast({
        title: "Please answer the question",
        variant: "destructive",
      });
      return;
    }
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleSubmit = () => {
    if (!answers[currentQuestion.id]) {
      toast({
        title: "Please answer the question",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Quiz submitted!",
      description: "Your answers have been recorded.",
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
                <p className="text-muted-foreground">
                  Your answer: {JSON.stringify(answers[question.id])}
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
          {renderQuestion(currentQuestion)}
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
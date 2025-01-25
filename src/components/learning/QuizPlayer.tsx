import React, { useState } from 'react';
import { Quiz, Question, MultipleChoiceQuestion } from '@/types/curriculum';
import CodeEditor from '@/components/CodeEditor';

export const QuizPlayer = ({ quiz, onComplete }: { quiz: Quiz; onComplete: (score: number) => void }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswer = (answer: any) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const score = calculateScore();
      onComplete(score);
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((total, answer, index) => {
      const question = quiz.questions[index];
      if (question.type === 'multiple-choice' && answer === (question as MultipleChoiceQuestion).correctAnswer) {
        return total + question.points;
      }
      return total;
    }, 0);
  };

  return (
    <div className="space-y-8">
      {currentQuestion.type === 'coding' && (
        <CodeEditor
          initialFiles={{
            "solution.js": {
              content: currentQuestion.initialCode || '',
              language: "javascript"
            }
          }}
        />
      )}
      <div>
        <h2 className="text-lg font-semibold">{currentQuestion.title}</h2>
        <p>{currentQuestion.description}</p>
        {currentQuestion.type === 'multiple-choice' && (
          <div>
            {(currentQuestion as MultipleChoiceQuestion).options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(index)} 
                className="block w-full text-left p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
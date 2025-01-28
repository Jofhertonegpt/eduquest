import { useState } from 'react';
import { QuizPlayer } from './QuizPlayer';
import type { Quiz } from '@/types/curriculum';

const testQuiz: Quiz = {
  id: 'test-quiz',
  title: 'Test Quiz',
  description: 'Testing CodeEditor integration',
  questions: [{
    id: 'test-coding-q1',
    type: 'coding',
    title: 'Write a Hello World Function',
    description: 'Create a function that returns "Hello World"',
    points: 10,
    initialCode: 'function helloWorld() {\n  // Your code here\n}',
    testCases: [{
      input: '',
      expectedOutput: 'Hello World'
    }]
  }]
};

export const TestQuiz = () => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
    setCompleted(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Test Quiz</h2>
      <QuizPlayer
        quiz={testQuiz}
        isCompleted={completed}
        onComplete={handleComplete}
      />
    </div>
  );
};
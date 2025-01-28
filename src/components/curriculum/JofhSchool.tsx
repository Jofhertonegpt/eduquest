import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonacoEditor } from '@/components/code-editor/MonacoEditor';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import type { 
  Course, 
  Module, 
  Quiz, 
  CodingQuestion, 
  MultipleChoiceQuestion,
  ModuleMetadata,
  ResourceType,
  Resource,
  Assignment,
  Question
} from '@/types/curriculum';

interface QuestionViewProps {
  question: Quiz['questions'][0];
  answer?: string | number | boolean | number[];
  onAnswerChange: (value: string | number | boolean | number[]) => void;
  onVerify?: () => void;
}

const QuestionView = ({ question, answer, onAnswerChange, onVerify }: QuestionViewProps) => {
  const { toast } = useToast();

  const mcq = question.type === 'multiple-choice' ? question as MultipleChoiceQuestion : null;
  
  switch (question.type) {
    case 'coding':
      return (
        <div className="space-y-4">
          <div className="h-[400px] border rounded-lg overflow-hidden">
            <MonacoEditor
              initialValue={(question as CodingQuestion).initialCode || ''}
              onChange={onAnswerChange}
            />
          </div>
          <Button 
            onClick={onVerify}
            className="w-full sm:w-auto"
          >
            Run Code
          </Button>
        </div>
      );
    case 'multiple-choice':
      if (!mcq) return null;
      return (
        <div className="space-y-4">
          {mcq.options.map((option, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer">
              <input
                type={mcq.allowMultiple ? "checkbox" : "radio"}
                name={`question-${question.id}`}
                value={idx}
                checked={mcq.allowMultiple 
                  ? Array.isArray(answer) && answer.includes(idx)
                  : answer === idx
                }
                onChange={(e) => {
                  if (mcq.allowMultiple) {
                    const currentAnswers = Array.isArray(answer) ? answer : [];
                    if (e.target.checked) {
                      onAnswerChange([...currentAnswers, idx]);
                    } else {
                      onAnswerChange(currentAnswers.filter(a => a !== idx));
                    }
                  } else {
                    onAnswerChange(idx);
                  }
                }}
                className="w-4 h-4"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    case 'true-false':
      return (
        <div className="space-x-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              value="true"
              checked={answer === true}
              onChange={() => onAnswerChange(true)}
              className="w-4 h-4"
            />
            <span>True</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`question-${question.id}`}
              value="false"
              checked={answer === false}
              onChange={() => onAnswerChange(false)}
              className="w-4 h-4"
            />
            <span>False</span>
          </label>
        </div>
      );
    case 'short-answer':
    case 'essay':
      return (
        <textarea
          value={answer as string || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="w-full min-h-[100px] p-2 border rounded-lg"
          placeholder={`Enter your ${question.type} answer here...`}
        />
      );
    default:
      return (
        <div className="text-gray-500">
          Question type not supported
        </div>
      );
  }
};

export const JofhSchool = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean | number[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome toast on mount
    toast({
      title: "Welcome back!",
      description: "You've learned 40% of your goal this week! Keep it up!",
      action: <Button variant="ghost" size="sm"><X className="h-4 w-4" /></Button>,
      duration: 5000,
    });

    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem('quizAnswers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
  }, [answers]);

  const handleAnswerSubmit = (questionId: string, answer: string | number | boolean | number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const verifyAnswer = (question: Quiz['questions'][0], answer: string | number | boolean | number[]) => {
    if (question.type === 'coding') {
      // Here you would implement actual code verification
      return true;
    }
    
    if (question.type === 'multiple-choice') {
      const mcq = question as MultipleChoiceQuestion;
        if (mcq.allowMultiple) {
          const answers = answer as number[];
          return answers.length > 0 && answers.every(a => mcq.correctAnswers?.includes(a));
        }
        return answer === mcq.correctAnswer;
      case 'true-false':
        return answer === question.correctAnswer;
      default:
        // For essay, short-answer, etc., return true as they need manual grading
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
        <Navigation />
      </div>
      <div className="flex pt-16">
        {/* Course Sidebar */}
        <div className="w-64 border-r min-h-screen p-4 space-y-4 overflow-y-auto fixed left-0 top-16 bottom-0">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          {coursesData.map((course) => (
            <div key={course.id} className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start truncate ${
                  selectedCourse?.id === course.id ? 'bg-primary/10' : ''
                }`}
                onClick={() => setSelectedCourse({
                  ...course,
                  category: 'general' as const,
                  duration: '16 weeks' as const
                })}
              >
                {course.title}
              </Button>
              
              {selectedCourse?.id === course.id && (
                <div className="pl-4 space-y-2">
                  {modulesData
                    .filter(module => course.modules.includes(module.id))
                    .map(module => (
                      <Button
                        key={module.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start truncate ${
                          selectedModule?.id === module.id ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedModule({
                          ...module,
                          metadata: {
                            ...module.metadata,
                            difficulty: module.metadata.difficulty as ModuleMetadata['difficulty']
                          },
                          resources: module.resources.map(r => ({
                            ...r,
                            type: r.type as ResourceType,
                            embedType: r.type === 'video' ? 'youtube' as const : undefined
                          })) as Resource[],
                          assignments: module.assignments.map(a => ({
                            ...a,
                            questions: a.questions.map(q => {
                              const baseQuestion = { ...q };
                              if (baseQuestion.type === 'multiple-choice') {
                                const mcq = baseQuestion as unknown as MultipleChoiceQuestion;
                                return {
                                  ...mcq,
                                  type: 'multiple-choice' as const,
                                  options: mcq.options || [],
                                  correctAnswer: mcq.correctAnswer || 0
                                } as MultipleChoiceQuestion;
                              }
                              if (q.type === 'coding') {
                                return {
                                  ...q,
                                  type: 'coding' as const,
                                  initialCode: q.initialCode || '',
                                  testCases: q.testCases || []
                                };
                              }
                              return {
                                ...q,
                                type: q.type as Question['type']
                              };
                            }) as Question[]
                          })) as Assignment[],
                          quizzes: module.quizzes.map(quiz => ({
                            ...quiz,
                            questions: quiz.questions.map(q => {
                              if (q.type === 'multiple-choice') {
                                return {
                                  ...q,
                                  type: 'multiple-choice' as const,
                                  options: q.options || [],
                                  correctAnswer: q.correctAnswer || 0,
                                  allowMultiple: q.allowMultiple || false,
                                  correctAnswers: q.correctAnswers || []
                                };
                              }
                              if (q.type === 'coding') {
                                return {
                                  ...q,
                                  type: 'coding' as const,
                                  initialCode: q.initialCode || '',
                                  testCases: q.testCases || []
                                };
                              }
                              return {
                                ...q,
                                type: q.type as Question['type']
                              };
                            }) as Question[]
                          })) as Quiz[]
                        })}
                      >
                        {module.title}
                      </Button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 ml-64">
          {selectedModule ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{selectedModule.title}</h1>
                <div className="text-sm text-gray-500">
                  {selectedCourse?.metadata.instructor} • {selectedCourse?.metadata.meetingTimes}
                </div>
              </div>

              <Tabs defaultValue="assignments">
                <TabsList>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="assignments">
                  {selectedModule.assignments.map((assignment) => (
                    <Card key={assignment.id} className="p-6 mb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                        </div>
                        <div className="text-sm font-medium">
                          Points: {assignment.points}
                        </div>
                      </div>
                      <p className="mb-4">{assignment.description}</p>
                      <div className="space-y-8">
                        {assignment.questions.map((question) => (
                          <div key={question.id} className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-4">
                              <h4 className="font-medium">{question.title}</h4>
                              <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                                {question.type}
                              </span>
                            </div>
                            <p className="mb-4">{question.description}</p>
                            <QuestionView 
                              question={question}
                              answer={answers[question.id]}
                              onAnswerChange={(value) => handleAnswerSubmit(question.id, value)}
                              onVerify={() => {
                                const isCorrect = verifyAnswer(question, answers[question.id]);
                                toast({
                                  title: isCorrect ? "Correct!" : "Try Again",
                                  description: isCorrect 
                                    ? "Great job! Your answer is correct."
                                    : "Your answer needs some adjustments.",
                                  variant: isCorrect ? "default" : "destructive",
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="quizzes">
                  {selectedModule.quizzes.map((quiz: Quiz) => (
                    <Card key={quiz.id} className="p-6 mb-4">
                      <h3 className="text-xl font-semibold mb-4">{quiz.title}</h3>
                      <div className="space-y-8">
                        {quiz.questions.map((question) => (
                          <div key={question.id} className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-4">
                              <h4 className="font-medium">{question.title}</h4>
                              <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                                {question.type}
                              </span>
                            </div>
                            <p className="mb-4">{question.description}</p>
                            <QuestionView 
                              question={question}
                              answer={answers[question.id]}
                              onAnswerChange={(value) => handleAnswerSubmit(question.id, value)}
                              onVerify={() => {
                                const isCorrect = verifyAnswer(question, answers[question.id]);
                                toast({
                                  title: isCorrect ? "Correct!" : "Try Again",
                                  description: isCorrect 
                                    ? "Great job! Your answer is correct."
                                    : "Your answer needs some adjustments.",
                                  variant: isCorrect ? "default" : "destructive",
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="resources">
                  {selectedModule.resources.map((resource) => (
                    <Card key={resource.id} className="p-6 mb-4">
                      <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
                      {(() => {
                        switch (resource.type) {
                          case 'video':
                            return (
                              <div className="aspect-video rounded-lg overflow-hidden">
                                <iframe
                                  className="w-full h-full"
                                  src={resource.url}
                                  title={resource.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            );
                          case 'code':
                            return (
                              'code' in resource && resource.code && (
                                <div className="h-[400px] border rounded-lg overflow-hidden">
                                  <MonacoEditor
                                    initialValue={resource.code.initialCode}
                                    onChange={(value) => console.log('Code changed:', value)}
                                  />
                                </div>
                              )
                            );
                          case 'pdf':
                          case 'document':
                            return (
                              <div className="border rounded-lg p-4">
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-2"
                                >
                                  View Document
                                  <span className="text-xs">({resource.duration})</span>
                                </a>
                              </div>
                            );
                          case 'article':
                            return (
                              <div className="prose max-w-none">
                                {resource.content}
                              </div>
                            );
                          default:
                            return (
                              <div className="text-gray-500">
                                Resource type not supported
                              </div>
                            );
                        }
                      })()}
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a module to begin learning
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
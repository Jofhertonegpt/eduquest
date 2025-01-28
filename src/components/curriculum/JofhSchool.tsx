import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonacoEditor } from '@/components/code-editor/MonacoEditor';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import type { Course, Module, Quiz, CodingQuestion } from '@/types/curriculum';

export const JofhSchool = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
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

  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const verifyAnswer = (question: any, answer: any) => {
    if (question.type === 'coding') {
      // Here you would implement actual code verification
      return true;
    }
    return answer === question.correctAnswer;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Course Sidebar */}
        <div className="w-64 border-r min-h-screen p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Courses</h2>
          {coursesData.map((course) => (
            <div key={course.id} className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  selectedCourse?.id === course.id ? 'bg-primary/10' : ''
                }`}
                onClick={() => setSelectedCourse(course)}
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
                        className={`w-full justify-start ${
                          selectedModule?.id === module.id ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedModule(module)}
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
        <div className="flex-1 p-8">
          {selectedModule ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{selectedModule.title}</h1>
                <div className="text-sm text-gray-500">
                  {selectedCourse?.metadata.instructor} • {selectedCourse?.metadata.meetingTimes}
                </div>
              </div>

              <Tabs defaultValue="quizzes">
                <TabsList>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

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
                            
                            {question.type === 'coding' && (
                              <div className="space-y-4">
                                <div className="h-[400px] border rounded-lg overflow-hidden">
                                  <MonacoEditor
                                    initialValue={(question as CodingQuestion).initialCode || ''}
                                    onChange={(value) => handleAnswerSubmit(question.id, value)}
                                  />
                                </div>
                                <Button 
                                  onClick={() => {
                                    const isCorrect = verifyAnswer(question, answers[question.id]);
                                    toast({
                                      title: isCorrect ? "Correct!" : "Try Again",
                                      description: isCorrect 
                                        ? "Great job! Your code works perfectly."
                                        : "Your code needs some adjustments.",
                                      variant: isCorrect ? "default" : "destructive",
                                    });
                                  }}
                                  className="w-full sm:w-auto"
                                >
                                  Run Code
                                </Button>
                              </div>
                            )}
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
                      {resource.type === 'code' && resource.code && (
                        <div className="h-[400px] border rounded-lg overflow-hidden">
                          <MonacoEditor
                            initialValue={resource.code.initialCode}
                            onChange={(value) => console.log('Code changed:', value)}
                          />
                        </div>
                      )}
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
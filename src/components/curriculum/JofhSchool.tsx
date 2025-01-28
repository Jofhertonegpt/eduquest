import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonacoEditor } from '@/components/code-editor/MonacoEditor';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import type { Course, Module, Quiz, CodingQuestion } from '@/types/curriculum';
import { useToast } from '@/hooks/use-toast';

export const JofhSchool = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const { toast } = useToast();

  // Mock data for the UI
  const progress = {
    weeklyProgress: 40,
    latestResults: [
      { unit: 'Technology', progress: 28 },
      { unit: 'Ecology', progress: 44 },
      { unit: 'Real estate', progress: 40 },
      { unit: 'Education', progress: 18 },
      { unit: 'Job market', progress: 76 },
    ],
    timeSpent: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [
        { type: 'vocabulary', values: [2, 1, 3, 2, 1, 0, 1] },
        { type: 'grammar', values: [1, 2, 1, 0, 2, 1, 0] },
        { type: 'listening', values: [1, 0, 2, 1, 1, 2, 1] },
        { type: 'writing', values: [0, 1, 1, 2, 0, 1, 2] },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Welcome Section */}
      <div className="bg-pink-50 p-8 rounded-lg mb-8 max-w-7xl mx-auto mt-8">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-bold text-pink-500 mb-2">Welcome back!</h1>
            <p className="text-gray-600">
              You've learned {progress.weeklyProgress}% of your goal this week!
              <br />
              Keep it up and improve your results!
            </p>
          </div>
          <img src="/student-learning.svg" alt="Student learning" className="h-32" />
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        {/* Latest Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Latest results</h2>
            <Button variant="ghost" size="sm">More →</Button>
          </div>
          <div className="space-y-4">
            {progress.latestResults.map((result) => (
              <div key={result.unit} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{result.unit}</span>
                  <span>{result.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${result.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Spent Learning */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Time spent on learning</h2>
            <select className="text-sm border rounded p-1">
              <option>Last week</option>
              <option>This week</option>
            </select>
          </div>
          <div className="h-64 bg-white rounded-lg p-4">
            {/* Here you would implement the actual chart */}
            <div className="flex justify-between h-full items-end">
              {progress.timeSpent.labels.map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-primary/20 rounded-t" style={{ height: '100px' }} />
                  <span className="text-sm text-gray-500">{day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            {['Vocabulary', 'Grammar', 'Listening', 'Writing'].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <span className="text-sm text-gray-500">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Your Courses */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your courses</h2>
            <Button variant="ghost" size="sm">More →</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coursesData.map((course) => (
              <Card 
                key={course.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedCourse?.id === course.id 
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-gray-50 hover:shadow-md'
                }`}
                onClick={() => setSelectedCourse({
                  ...course,
                  category: 'general',
                  duration: '16 weeks'
                } as Course)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  </div>
                  <div className="px-2 py-1 bg-primary/10 rounded text-xs font-medium">
                    {course.level}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{course.metadata.instructor}</span>
                  <span>•</span>
                  <span>{course.metadata.meetingTimes}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Module Content */}
        {selectedModule && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Content</h2>
            <Tabs defaultValue="quizzes">
              <TabsList>
                <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="quizzes">
                {selectedModule.quizzes.map((quiz: Quiz) => (
                  <Card key={quiz.id} className="p-4 mb-4">
                    <h3 className="font-medium mb-2">{quiz.title}</h3>
                    <div className="space-y-4">
                      {quiz.questions.map((question) => (
                        <div key={question.id} className="border-t pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{question.title}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {question.type}
                            </span>
                          </div>
                          <p className="mb-4">{question.description}</p>
                          
                          {question.type === 'coding' && (
                            <div className="space-y-4">
                              <div className="h-[400px] border rounded-lg overflow-hidden">
                                <MonacoEditor
                                  initialValue={(question as CodingQuestion).initialCode || ''}
                                  onChange={(value) => console.log('Code changed:', value)}
                                />
                              </div>
                              <Button 
                                onClick={() => {
                                  toast({
                                    title: "Running code...",
                                    description: "Your code is being evaluated.",
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
                  <Card key={resource.id} className="p-4 mb-4">
                    <h3 className="font-medium">{resource.title}</h3>
                    {resource.type === 'code' && resource.code && (
                      <div className="h-[400px] border rounded-lg overflow-hidden mt-4">
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
        )}
      </div>
    </div>
  );
};
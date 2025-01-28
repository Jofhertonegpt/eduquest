import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonacoEditor } from '@/components/code-editor/MonacoEditor';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import type { Course, Module, Quiz, CodingQuestion } from '@/types/curriculum';

export const JofhSchool = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Jofh School</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Courses List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Courses</h2>
          {coursesData.map((course) => (
            <Card key={course.id} className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedCourse(course)}>
              <h3 className="font-medium">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
            </Card>
          ))}
        </div>

        {/* Modules List */}
        {selectedCourse && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Modules</h2>
            {selectedCourse.modules.map((moduleId) => {
              const module = modulesData.find(m => m.id === moduleId);
              if (!module) return null;
              
              return (
                <Card key={module.id} className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedModule(module)}>
                  <h3 className="font-medium">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </Card>
              );
            })}
          </div>
        )}

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
                          <h4 className="font-medium mb-2">{question.title}</h4>
                          <p className="mb-4">{question.description}</p>
                          
                          {question.type === 'coding' && (
                            <div className="h-[400px] border rounded-lg overflow-hidden">
                              <MonacoEditor
                                initialValue={(question as CodingQuestion).initialCode || ''}
                                onChange={(value) => console.log('Code changed:', value)}
                              />
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
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import { QuizPlayer } from '@/components/learning/QuizPlayer';
import type { Module, Quiz } from '@/types/curriculum';

export const JofhSchool = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);

  const handleQuizComplete = (quizId: string, score: number) => {
    setCompletedQuizzes(prev => [...prev, quizId]);
  };

  const renderCourses = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coursesData.map(course => (
        <Card key={course.id} className="p-4 cursor-pointer hover:bg-secondary/50" onClick={() => setSelectedCourse(course.id)}>
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <p className="text-sm text-muted-foreground">{course.description}</p>
          <div className="mt-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {course.level}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderModules = () => {
    const course = coursesData.find(c => c.id === selectedCourse);
    if (!course) return null;

    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedCourse(null)}>← Back to Courses</Button>
        <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.modules.map(moduleId => {
            const foundModule = modulesData.find(m => m.id === moduleId);
            if (!foundModule) return null;
            // Cast the module to match our type definitions
            const module: Module = {
              ...foundModule,
              metadata: {
                ...foundModule.metadata,
                difficulty: foundModule.metadata.difficulty as "beginner" | "intermediate" | "advanced"
              },
              resources: foundModule.resources.map(resource => ({
                ...resource,
                type: resource.type as "video" | "pdf" | "epub" | "article" | "document" | "code",
                embedType: resource.embedType as "youtube"
              }))
            };
            return (
              <Card key={module.id} className="p-4 cursor-pointer hover:bg-secondary/50" onClick={() => setSelectedModule(module)}>
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <p className="text-sm text-muted-foreground">{module.description}</p>
                {module.quizzes && module.quizzes.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {module.quizzes.length} Quizzes
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderModule = () => {
    if (!selectedModule) return null;

    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedModule(null)}>← Back to Modules</Button>
        <h2 className="text-2xl font-bold">{selectedModule.title}</h2>
        <p className="text-muted-foreground">{selectedModule.description}</p>
        
        {selectedModule.quizzes && selectedModule.quizzes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Quizzes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedModule.quizzes.map(quiz => (
                <Card key={quiz.id} className="p-4 cursor-pointer hover:bg-secondary/50" onClick={() => setSelectedQuiz(quiz)}>
                  <h4 className="text-lg font-semibold">{quiz.title}</h4>
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                  {completedQuizzes.includes(quiz.id) && (
                    <div className="mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Completed
                      </span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    if (!selectedQuiz) return null;

    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedQuiz(null)}>← Back to Module</Button>
        <QuizPlayer
          quiz={selectedQuiz}
          isCompleted={completedQuizzes.includes(selectedQuiz.id)}
          onComplete={(score) => handleQuizComplete(selectedQuiz.id, score)}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Jofh School</h1>
      {selectedQuiz ? renderQuiz() :
       selectedModule ? renderModule() :
       selectedCourse ? renderModules() :
       renderCourses()}
    </div>
  );
};
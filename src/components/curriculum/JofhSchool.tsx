import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import programData from '@/data/curriculum/New defaults/program.json';
import coursesData from '@/data/curriculum/New defaults/courses.json';
import modulesData from '@/data/curriculum/New defaults/modules.json';
import type { Course, Module } from '@/types/curriculum';

export function JofhSchool() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Get the first degree's courses
  const courseIds = programData.degrees[0].courses;
  const courses = courseIds.map(id => coursesData.find(c => c.id === id));

  const getModulesForCourse = (courseId: string) => {
    const course = coursesData.find(c => c.id === courseId);
    return course?.modules.map(moduleId => 
      modulesData.find(m => m.id === moduleId)
    ).filter(Boolean) || [];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Jofh School</h1>
      
      {/* Courses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {courses.map(course => (
          <Card key={course?.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCourse(course?.id || null)}>
            <h2 className="text-xl font-semibold mb-2">{course?.title}</h2>
            <p className="text-gray-600 mb-2">{course?.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Credits: {course?.credits}</span>
              <span className="text-sm text-gray-500">Level: {course?.level}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modules Section */}
      {selectedCourse && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getModulesForCourse(selectedCourse).map(module => (
              <Card key={module?.id} className="p-4">
                <h3 className="text-lg font-semibold mb-2">{module?.title}</h3>
                <p className="text-gray-600 mb-4">{module?.description}</p>
                <div className="flex flex-wrap gap-2">
                  {module?.resources.map(resource => (
                    <Button key={resource.id} variant="outline" size="sm"
                            onClick={() => window.open(resource.url, '_blank')}>
                      {resource.title}
                    </Button>
                  ))}
                </div>
                {module?.assignments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Assignments</h4>
                    <ul className="list-disc list-inside">
                      {module?.assignments.map(assignment => (
                        <li key={assignment.id}>{assignment.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {module?.quizzes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Quizzes</h4>
                    <ul className="list-disc list-inside">
                      {module?.quizzes.map(quiz => (
                        <li key={quiz.id}>{quiz.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
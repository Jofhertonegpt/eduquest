import { Curriculum } from "@/types/curriculum";

export const sampleCurriculum: Curriculum = {
  name: "Advanced Web Development",
  description: "Comprehensive web development curriculum with interactive assessments",
  degrees: [
    {
      id: "advanced-web-dev",
      title: "Advanced Web Development",
      type: "certificate",
      description: "Master modern web development",
      requiredCredits: 12,
      courses: [
        {
          id: "react-mastery",
          title: "React Mastery",
          description: "Advanced React development concepts",
          credits: 4,
          level: "advanced",
          modules: [
            {
              id: "react-hooks",
              title: "Advanced React Hooks",
              description: "Master React Hooks and Custom Hooks",
              credits: 1,
              metadata: {
                estimatedTime: 180,
                difficulty: "advanced",
                prerequisites: ["react-basics"],
                tags: ["react", "hooks", "frontend"],
                skills: ["React", "TypeScript", "State Management"]
              },
              learningObjectives: [
                {
                  id: "obj-1",
                  description: "Understand and implement custom React hooks",
                  assessmentCriteria: ["Create a custom hook", "Implement data fetching"]
                }
              ],
              resources: [
                {
                  id: "res-1",
                  title: "Custom Hooks Deep Dive",
                  type: "video",
                  content: "Learn how to create and use custom hooks",
                  duration: "45 minutes",
                  url: "https://example.com/video",
                  embedType: "youtube"
                }
              ],
              assignments: [
                {
                  id: "assign-1",
                  title: "Custom Hooks Implementation",
                  description: "Create a set of custom hooks",
                  dueDate: "2024-12-31",
                  points: 100,
                  questions: [
                    {
                      id: "q1",
                      type: "coding",
                      title: "Implement useLocalStorage",
                      description: "Create a custom hook for local storage",
                      points: 20,
                      initialCode: "export const useLocalStorage = () => {\n  // Implement here\n}",
                      testCases: [
                        {
                          input: "setValue('test', 'value')",
                          expectedOutput: "value"
                        }
                      ]
                    }
                  ]
                }
              ],
              quizzes: [
                {
                  id: "quiz-1",
                  title: "React Hooks Quiz",
                  description: "Test your knowledge of React Hooks",
                  questions: [
                    {
                      id: "q1",
                      type: "multiple-choice",
                      title: "Understanding Custom Hooks",
                      description: "What is a custom hook?",
                      points: 10,
                      options: [
                        "A reusable function that contains stateful logic",
                        "A React component",
                        "A JavaScript class",
                        "A CSS framework"
                      ],
                      correctAnswer: 0
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
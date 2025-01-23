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
              resources: [
                {
                  id: "res-1",
                  title: "Custom Hooks Deep Dive",
                  type: "video",
                  content: "Learn how to create and use custom hooks",
                  duration: "45 minutes",
                  url: "https://example.com/custom-hooks",
                  embedType: "youtube"
                }
              ],
              assignments: [
                {
                  id: "assign-1",
                  title: "Custom Hooks Implementation",
                  description: "Create a custom hook for managing form state",
                  dueDate: "2024-12-31",
                  points: 100
                }
              ],
              quizzes: [
                {
                  id: "quiz-1",
                  title: "React Hooks Fundamentals",
                  questions: [
                    {
                      id: "q1",
                      question: "What is a custom hook?",
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
      ],
      requiredCredits: 12
    }
  ]
};
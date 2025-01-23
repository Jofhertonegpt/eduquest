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
              learningObjectives: [
                {
                  id: "obj-1",
                  description: "Understand and implement custom React hooks",
                  assessmentCriteria: [
                    "Create a custom hook that manages form state",
                    "Implement data fetching with custom hooks"
                  ]
                }
              ],
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
                  url: "https://www.youtube.com/watch?v=example",
                  embedType: "youtube"
                },
                {
                  id: "res-2",
                  title: "Hooks Practice",
                  type: "code",
                  content: "Practice implementing custom hooks",
                  code: {
                    initialCode: "function useCounter() {\n  // Implement counter hook\n}",
                    solution: "function useCounter() {\n  const [count, setCount] = useState(0);\n  return [count, setCount];\n}",
                    testCases: [
                      {
                        input: "increment()",
                        expectedOutput: "count === 1"
                      }
                    ]
                  }
                }
              ],
              assignments: [
                {
                  id: "assign-1",
                  title: "Custom Hooks Implementation",
                  description: "Create a custom hook for managing form state",
                  dueDate: "2024-12-31",
                  points: 100,
                  rubric: {
                    criteria: [
                      {
                        name: "Functionality",
                        description: "Hook works as expected",
                        points: 40
                      },
                      {
                        name: "Code Quality",
                        description: "Clean and maintainable code",
                        points: 30
                      },
                      {
                        name: "Documentation",
                        description: "Clear documentation and examples",
                        points: 30
                      }
                    ]
                  }
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
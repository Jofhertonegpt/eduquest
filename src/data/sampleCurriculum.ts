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
          modules: [
            {
              id: "react-hooks",
              title: "Advanced React Hooks",
              description: "Master React Hooks and Custom Hooks",
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
                  description: "Understand and implement custom hooks",
                  assessmentCriteria: [
                    "Create a custom hook",
                    "Implement proper dependency management",
                    "Handle cleanup functions"
                  ]
                }
              ],
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
              assessments: [
                {
                  id: "assess-1",
                  title: "Custom Hooks Implementation",
                  type: "coding",
                  description: "Create a custom hook for managing form state",
                  difficultyLevel: "advanced",
                  points: 100,
                  timeLimit: 60,
                  codingExercise: {
                    id: "code-1",
                    title: "Form State Hook",
                    description: "Implement a custom hook for form state management",
                    initialCode: "export const useFormState = () => {\n  // Your code here\n}",
                    solution: "// Hidden until submission",
                    testCases: [
                      {
                        input: "{ initialValues: { name: '' } }",
                        expectedOutput: "{ values: { name: '' }, setValues: Function }"
                      }
                    ],
                    hints: [
                      "Consider using useState",
                      "Remember to handle form validation"
                    ]
                  }
                }
              ],
              milestones: [
                {
                  id: "milestone-1",
                  title: "Custom Hooks Master",
                  requiredAssessments: ["assess-1"],
                  reward: {
                    type: "badge",
                    value: "hooks-master"
                  }
                }
              ]
            }
          ]
        }
      ],
      requiredCredits: 12,
      estimatedDuration: "6 months"
    }
  ]
};
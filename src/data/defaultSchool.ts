import { Database } from "@/lib/database.types";

export type School = Database['public']['Tables']['schools']['Row'];

export const DEFAULT_SCHOOL: School = {
  id: "default-learning-hub",
  name: "Learning Hub",
  description: "Welcome to the Learning Hub! This is your starting point for understanding how to use the platform and access learning resources.",
  logo_url: null,
  created_at: new Date().toISOString()
};

export const DEFAULT_SCHOOL_POSTS = [
  {
    id: "welcome-post",
    school_id: DEFAULT_SCHOOL.id,
    content: `Welcome to the Learning Hub! 🎓

Here's how to get started:
1. Explore the available degrees and certificates
2. Join study groups with fellow learners
3. Track your progress through achievements
4. Import custom curriculum using our JSON format

Need help importing a curriculum? Check the example below!`,
    created_by: "system",
    created_at: new Date().toISOString(),
    likes_count: 0,
    comments_count: 0
  },
  {
    id: "curriculum-example",
    school_id: DEFAULT_SCHOOL.id,
    content: `Here's an example curriculum JSON format you can use:

{
  "degrees": [
    {
      "id": "cs-degree",
      "title": "Computer Science",
      "description": "Bachelor's degree in Computer Science",
      "level": "Bachelor",
      "estimatedDuration": "4 years",
      "courses": [
        {
          "id": "cs101",
          "title": "Introduction to Programming",
          "description": "Learn the basics of programming",
          "credits": 3
        }
      ]
    }
  ]
}

Download this example and modify it for your needs!`,
    created_by: "system",
    created_at: new Date().toISOString(),
    likes_count: 0,
    comments_count: 0
  }
];
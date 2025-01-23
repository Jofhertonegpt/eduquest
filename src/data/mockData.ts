import { Database } from "@/lib/database.types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type School = Database['public']['Tables']['schools']['Row'];
type SchoolMember = Database['public']['Tables']['school_members']['Row'];
type SchoolPost = Database['public']['Tables']['school_posts']['Row'];

export const mockProfiles: Profile[] = [
  {
    id: "mock-user-1",
    full_name: "John Doe",
    level: "Intermediate",
    current_degree: "bs-cs",
    completed_degrees: ["as-cs"],
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
  {
    id: "mock-user-2",
    full_name: "Jane Smith",
    level: "Advanced",
    current_degree: "ms-cs",
    completed_degrees: ["bs-cs", "as-cs"],
    created_at: "2024-01-02T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
  },
  {
    id: "mock-user-3",
    full_name: "Bob Wilson",
    level: "Beginner",
    current_degree: "as-cs",
    completed_degrees: null,
    created_at: "2024-01-03T00:00:00.000Z",
    updated_at: "2024-01-03T00:00:00.000Z",
    avatar_url: null
  }
];

export const mockSchools: School[] = [
  {
    id: "mock-school-1",
    name: "Tech Academy",
    description: "A leading institution for technology education",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=TechAcademy",
    created_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "mock-school-2",
    name: "Data Science Institute",
    description: "Specialized in data science and analytics",
    logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=DataScience",
    created_at: "2024-01-02T00:00:00.000Z"
  }
];

export const mockSchoolMembers: SchoolMember[] = [
  {
    id: "mock-member-1",
    school_id: "mock-school-1",
    student_id: "mock-user-1",
    created_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "mock-member-2",
    school_id: "mock-school-1",
    student_id: "mock-user-2",
    created_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "mock-member-3",
    school_id: "mock-school-2",
    student_id: "mock-user-3",
    created_at: "2024-01-02T00:00:00.000Z"
  }
];

export const mockSchoolPosts: SchoolPost[] = [
  {
    id: "mock-post-1",
    school_id: "mock-school-1",
    content: "Welcome to our new learning platform! 🎓",
    created_by: "mock-user-1",
    created_at: "2024-01-01T00:00:00.000Z",
    likes_count: 5,
    comments_count: 2
  },
  {
    id: "mock-post-2",
    school_id: "mock-school-1",
    content: "Just completed my first assignment! 🎉",
    created_by: "mock-user-2",
    created_at: "2024-01-02T00:00:00.000Z",
    likes_count: 3,
    comments_count: 1
  },
  {
    id: "mock-post-3",
    school_id: "mock-school-2",
    content: "Starting my journey in data science today! 📊",
    created_by: "mock-user-3",
    created_at: "2024-01-03T00:00:00.000Z",
    likes_count: 2,
    comments_count: 0
  }
];

// Helper function to simulate API delay
export const mockDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get a mock profile by ID
export const getMockProfileById = (id: string) =>
  mockProfiles.find(profile => profile.id === id);

// Helper function to get a mock school by ID
export const getMockSchoolById = (id: string) =>
  mockSchools.find(school => school.id === id);

// Helper function to get mock school members by school ID
export const getMockSchoolMembersBySchoolId = (schoolId: string) =>
  mockSchoolMembers.filter(member => member.school_id === schoolId);

// Helper function to get mock school posts by school ID
export const getMockSchoolPostsBySchoolId = (schoolId: string) =>
  mockSchoolPosts.filter(post => post.school_id === schoolId);
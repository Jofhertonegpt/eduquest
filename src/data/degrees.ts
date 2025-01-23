export type DegreeLevel = 'associate' | 'bachelor' | 'master' | 'doctorate';
export type CertificateLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Degree {
  id: string;
  title: string;
  level: DegreeLevel;
  description: string;
  requiredCredits: number;
  specializations?: string[];
  prerequisites?: string[];
  estimatedDuration: string;
}

export interface Certificate {
  id: string;
  title: string;
  level: CertificateLevel;
  description: string;
  skills: string[];
  requiredCourses: string[];
  estimatedDuration: string;
}

export const degrees: Degree[] = [
  {
    id: "as-cs",
    title: "Associate of Science in Computer Science",
    level: "associate",
    description: "Foundation in computer science principles and programming",
    requiredCredits: 60,
    estimatedDuration: "2 years"
  },
  {
    id: "bs-cs",
    title: "Bachelor of Science in Computer Science",
    level: "bachelor",
    description: "Comprehensive computer science education with practical applications",
    requiredCredits: 120,
    specializations: ["AI/ML", "Web Development", "Cybersecurity"],
    prerequisites: ["as-cs"],
    estimatedDuration: "4 years"
  },
  {
    id: "ms-cs",
    title: "Master of Science in Computer Science",
    level: "master",
    description: "Advanced study in computer science with a focus on research and development",
    requiredCredits: 30,
    prerequisites: ["bs-cs"],
    estimatedDuration: "2 years"
  },
  {
    id: "phd-cs",
    title: "Doctor of Philosophy in Computer Science",
    level: "doctorate",
    description: "Research-focused degree in computer science",
    requiredCredits: 60,
    prerequisites: ["ms-cs"],
    estimatedDuration: "4 years"
  },
  {
    id: "as-bus",
    title: "Associate of Science in Business Administration",
    level: "associate",
    description: "Introduction to business principles and practices",
    requiredCredits: 60,
    estimatedDuration: "2 years"
  },
  {
    id: "bs-bus",
    title: "Bachelor of Science in Business Administration",
    level: "bachelor",
    description: "Comprehensive business education with practical applications",
    requiredCredits: 120,
    specializations: ["Marketing", "Finance", "Management"],
    prerequisites: ["as-bus"],
    estimatedDuration: "4 years"
  },
  {
    id: "ms-bus",
    title: "Master of Business Administration",
    level: "master",
    description: "Advanced study in business administration with a focus on leadership",
    requiredCredits: 36,
    prerequisites: ["bs-bus"],
    estimatedDuration: "2 years"
  },
  {
    id: "phd-bus",
    title: "Doctor of Philosophy in Business Administration",
    level: "doctorate",
    description: "Research-focused degree in business administration",
    requiredCredits: 60,
    prerequisites: ["ms-bus"],
    estimatedDuration: "4 years"
  },
  {
    id: "as-edu",
    title: "Associate of Arts in Education",
    level: "associate",
    description: "Foundation in education principles and practices",
    requiredCredits: 60,
    estimatedDuration: "2 years"
  },
  {
    id: "bs-edu",
    title: "Bachelor of Arts in Education",
    level: "bachelor",
    description: "Comprehensive education training with practical applications",
    requiredCredits: 120,
    specializations: ["Elementary Education", "Special Education"],
    prerequisites: ["as-edu"],
    estimatedDuration: "4 years"
  },
  {
    id: "ms-edu",
    title: "Master of Education",
    level: "master",
    description: "Advanced study in education with a focus on curriculum development",
    requiredCredits: 36,
    prerequisites: ["bs-edu"],
    estimatedDuration: "2 years"
  },
  {
    id: "phd-edu",
    title: "Doctor of Philosophy in Education",
    level: "doctorate",
    description: "Research-focused degree in education",
    requiredCredits: 60,
    prerequisites: ["ms-edu"],
    estimatedDuration: "4 years"
  },
  {
    id: "as-nursing",
    title: "Associate of Science in Nursing",
    level: "associate",
    description: "Foundation in nursing principles and practices",
    requiredCredits: 60,
    estimatedDuration: "2 years"
  },
  {
    id: "bs-nursing",
    title: "Bachelor of Science in Nursing",
    level: "bachelor",
    description: "Comprehensive nursing education with clinical practice",
    requiredCredits: 120,
    prerequisites: ["as-nursing"],
    estimatedDuration: "4 years"
  },
  {
    id: "ms-nursing",
    title: "Master of Science in Nursing",
    level: "master",
    description: "Advanced study in nursing with a focus on leadership and management",
    requiredCredits: 36,
    prerequisites: ["bs-nursing"],
    estimatedDuration: "2 years"
  },
  {
    id: "phd-nursing",
    title: "Doctor of Philosophy in Nursing",
    level: "doctorate",
    description: "Research-focused degree in nursing",
    requiredCredits: 60,
    prerequisites: ["ms-nursing"],
    estimatedDuration: "4 years"
  }
];

export const certificates: Certificate[] = [
  {
    id: "web-dev-fundamentals",
    title: "Web Development Fundamentals",
    level: "beginner",
    description: "Essential skills for modern web development",
    skills: ["HTML", "CSS", "JavaScript", "React Basics"],
    requiredCourses: ["intro-web-dev", "html-css-basics", "js-fundamentals"],
    estimatedDuration: "3 months"
  },
  {
    id: "data-science-basics",
    title: "Data Science Basics",
    level: "beginner",
    description: "Introduction to data science concepts and tools",
    skills: ["Python", "Data Analysis", "Statistics"],
    requiredCourses: ["intro-data-science", "python-fundamentals"],
    estimatedDuration: "3 months"
  },
  {
    id: "advanced-web-dev",
    title: "Advanced Web Development",
    level: "intermediate",
    description: "In-depth skills for modern web development",
    skills: ["React", "Node.js", "API Development"],
    requiredCourses: ["web-dev-fundamentals", "js-advanced"],
    estimatedDuration: "6 months"
  },
  {
    id: "machine-learning-fundamentals",
    title: "Machine Learning Fundamentals",
    level: "intermediate",
    description: "Introduction to machine learning concepts and techniques",
    skills: ["Python", "Machine Learning", "Data Preprocessing"],
    requiredCourses: ["data-science-basics", "python-fundamentals"],
    estimatedDuration: "6 months"
  },
  {
    id: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals",
    level: "beginner",
    description: "Essential skills for cybersecurity",
    skills: ["Network Security", "Cryptography", "Risk Management"],
    requiredCourses: ["intro-cybersecurity"],
    estimatedDuration: "3 months"
  },
  {
    id: "cloud-computing-fundamentals",
    title: "Cloud Computing Fundamentals",
    level: "beginner",
    description: "Introduction to cloud computing concepts and services",
    skills: ["AWS", "Azure", "Cloud Architecture"],
    requiredCourses: ["intro-cloud-computing"],
    estimatedDuration: "3 months"
  },
  {
    id: "project-management-fundamentals",
    title: "Project Management Fundamentals",
    level: "beginner",
    description: "Essential skills for project management",
    skills: ["Agile", "Scrum", "Project Planning"],
    requiredCourses: ["intro-project-management"],
    estimatedDuration: "3 months"
  },
  {
    id: "data-visualization-fundamentals",
    title: "Data Visualization Fundamentals",
    level: "beginner",
    description: "Introduction to data visualization techniques and tools",
    skills: ["Tableau", "Power BI", "Data Storytelling"],
    requiredCourses: ["data-science-basics"],
    estimatedDuration: "3 months"
  },
  {
    id: "advanced-data-science",
    title: "Advanced Data Science",
    level: "advanced",
    description: "In-depth skills for data science and analytics",
    skills: ["Machine Learning", "Deep Learning", "Big Data"],
    requiredCourses: ["data-science-basics", "machine-learning-fundamentals"],
    estimatedDuration: "6 months"
  },
  {
    id: "full-stack-development",
    title: "Full Stack Development",
    level: "advanced",
    description: "Comprehensive skills for full stack web development",
    skills: ["React", "Node.js", "Database Management"],
    requiredCourses: ["advanced-web-dev"],
    estimatedDuration: "6 months"
  }
];

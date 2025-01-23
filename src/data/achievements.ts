import { Trophy, Rocket, Brain, Book, Code, Star, Target, Users, Clock, Zap, Heart, Coffee } from "lucide-react";

export type AchievementCategory = 
  | 'academic'
  | 'social'
  | 'technical'
  | 'personal'
  | 'participation'
  | 'milestone';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: any; // Lucide icon component
  points: number;
  condition?: string;
}

export const achievements: Achievement[] = [
  // Academic Excellence
  {
    id: "perfect-score-quiz",
    title: "Perfect Score",
    description: "Achieve 100% on any quiz",
    category: "academic",
    icon: Star,
    points: 100
  },
  {
    id: "course-completion-streak",
    title: "Course Streak",
    description: "Complete 5 courses in a row",
    category: "academic",
    icon: Zap,
    points: 200
  },
  {
    id: "first-degree",
    title: "Graduate",
    description: "Complete your first degree program",
    category: "academic",
    icon: Trophy,
    points: 1000
  },
  {
    id: "team-player",
    title: "Team Player",
    description: "Participate in a group project",
    category: "social",
    icon: Users,
    points: 150
  },
  {
    id: "community-service",
    title: "Community Service",
    description: "Volunteer for a community event",
    category: "social",
    icon: Heart,
    points: 200
  },
  {
    id: "coding-challenge",
    title: "Coding Challenge",
    description: "Complete a coding challenge",
    category: "technical",
    icon: Code,
    points: 300
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Read 10 books in a year",
    category: "personal",
    icon: Book,
    points: 250
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Attend a class before 8 AM",
    category: "milestone",
    icon: Clock,
    points: 100
  },
  {
    id: "perfect-attendance",
    title: "Perfect Attendance",
    description: "Attend all classes in a semester",
    category: "milestone",
    icon: Target,
    points: 500
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Achieve the highest score in a quiz",
    category: "academic",
    icon: Star,
    points: 400
  },
  {
    id: "project-completion",
    title: "Project Completion",
    description: "Complete a major project",
    category: "academic",
    icon: Trophy,
    points: 600
  },
  {
    id: "peer-mentor",
    title: "Peer Mentor",
    description: "Help a peer with their studies",
    category: "social",
    icon: Users,
    points: 200
  },
  {
    id: "hackathon-participant",
    title: "Hackathon Participant",
    description: "Participate in a hackathon",
    category: "technical",
    icon: Rocket,
    points: 300
  },
  {
    id: "self-improvement",
    title: "Self Improvement",
    description: "Complete a personal development course",
    category: "personal",
    icon: Brain,
    points: 250
  },
  {
    id: "networking",
    title: "Networking",
    description: "Attend a networking event",
    category: "social",
    icon: Users,
    points: 150
  },
  {
    id: "course-completion",
    title: "Course Completion",
    description: "Complete a course",
    category: "academic",
    icon: Book,
    points: 100
  },
  {
    id: "skill-mastery",
    title: "Skill Mastery",
    description: "Master a new skill",
    category: "technical",
    icon: Code,
    points: 500
  },
  {
    id: "community-leader",
    title: "Community Leader",
    description: "Lead a community project",
    category: "social",
    icon: Heart,
    points: 400
  },
  {
    id: "time-management",
    title: "Time Management",
    description: "Manage your time effectively for a month",
    category: "personal",
    icon: Clock,
    points: 300
  },
  {
    id: "innovation",
    title: "Innovation",
    description: "Create a new project or idea",
    category: "technical",
    icon: Zap,
    points: 600
  },
  {
    id: "team-leader",
    title: "Team Leader",
    description: "Lead a team project",
    category: "social",
    icon: Users,
    points: 500
  },
  {
    id: "research-presentation",
    title: "Research Presentation",
    description: "Present research at a conference",
    category: "academic",
    icon: Trophy,
    points: 700
  },
  {
    id: "volunteer-leader",
    title: "Volunteer Leader",
    description: "Lead a volunteer project",
    category: "social",
    icon: Heart,
    points: 400
  },
  {
    id: "coding-bootcamp",
    title: "Coding Bootcamp",
    description: "Complete a coding bootcamp",
    category: "technical",
    icon: Code,
    points: 800
  },
  {
    id: "personal-challenge",
    title: "Personal Challenge",
    description: "Complete a personal challenge",
    category: "personal",
    icon: Brain,
    points: 300
  },
  {
    id: "academic-scholarship",
    title: "Academic Scholarship",
    description: "Receive an academic scholarship",
    category: "academic",
    icon: Trophy,
    points: 1000
  },
  {
    id: "leadership-training",
    title: "Leadership Training",
    description: "Complete a leadership training program",
    category: "personal",
    icon: Zap,
    points: 500
  },
  {
    id: "internship",
    title: "Internship",
    description: "Complete an internship",
    category: "academic",
    icon: Trophy,
    points: 600
  },
  {
    id: "study-abroad",
    title: "Study Abroad",
    description: "Participate in a study abroad program",
    category: "academic",
    icon: Book,
    points: 800
  },
  {
    id: "research-publication",
    title: "Research Publication",
    description: "Publish research in a journal",
    category: "academic",
    icon: Book,
    points: 900
  },
  {
    id: "community-advocate",
    title: "Community Advocate",
    description: "Advocate for a community issue",
    category: "social",
    icon: Heart,
    points: 400
  },
  {
    id: "coding-competition",
    title: "Coding Competition",
    description: "Participate in a coding competition",
    category: "technical",
    icon: Code,
    points: 300
  },
  {
    id: "personal-growth",
    title: "Personal Growth",
    description: "Achieve a personal growth goal",
    category: "personal",
    icon: Brain,
    points: 250
  },
  {
    id: "networking-event",
    title: "Networking Event",
    description: "Attend a professional networking event",
    category: "social",
    icon: Users,
    points: 150
  },
  {
    id: "course-mentor",
    title: "Course Mentor",
    description: "Mentor a student in a course",
    category: "academic",
    icon: Trophy,
    points: 200
  },
  {
    id: "community-project",
    title: "Community Project",
    description: "Complete a community project",
    category: "social",
    icon: Heart,
    points: 300
  },
  {
    id: "technical-certification",
    title: "Technical Certification",
    description: "Obtain a technical certification",
    category: "technical",
    icon: Code,
    points: 500
  },
  {
    id: "personal-development",
    title: "Personal Development",
    description: "Complete a personal development course",
    category: "personal",
    icon: Brain,
    points: 250
  },
  {
    id: "academic-excellence",
    title: "Academic Excellence",
    description: "Achieve a GPA of 3.5 or higher",
    category: "academic",
    icon: Star,
    points: 1000
  },
  {
    id: "team-collaboration",
    title: "Team Collaboration",
    description: "Collaborate effectively in a team",
    category: "social",
    icon: Users,
    points: 200
  },
  {
    id: "coding-project",
    title: "Coding Project",
    description: "Complete a coding project",
    category: "technical",
    icon: Code,
    points: 300
  },
  {
    id: "personal-reflection",
    title: "Personal Reflection",
    description: "Reflect on personal growth",
    category: "personal",
    icon: Brain,
    points: 150
  },
  {
    id: "academic-research",
    title: "Academic Research",
    description: "Conduct academic research",
    category: "academic",
    icon: Book,
    points: 600
  },
  {
    id: "community-engagement",
    title: "Community Engagement",
    description: "Engage in community activities",
    category: "social",
    icon: Heart,
    points: 200
  },
  {
    id: "technical-project",
    title: "Technical Project",
    description: "Complete a technical project",
    category: "technical",
    icon: Code,
    points: 400
  },
  {
    id: "personal-achievement",
    title: "Personal Achievement",
    description: "Achieve a personal goal",
    category: "personal",
    icon: Brain,
    points: 300
  },
  {
    id: "academic-mentor",
    title: "Academic Mentor",
    description: "Mentor a student academically",
    category: "academic",
    icon: Trophy,
    points: 200
  },
  {
    id: "community-leadership",
    title: "Community Leadership",
    description: "Lead a community initiative",
    category: "social",
    icon: Heart,
    points: 500
  },
  {
    id: "technical-expertise",
    title: "Technical Expertise",
    description: "Demonstrate technical expertise",
    category: "technical",
    icon: Code,
    points: 600
  },
  {
    id: "personal-initiative",
    title: "Personal Initiative",
    description: "Take initiative in personal projects",
    category: "personal",
    icon: Brain,
    points: 400
  },
  {
    id: "academic-innovation",
    title: "Academic Innovation",
    description: "Innovate in academic projects",
    category: "academic",
    icon: Trophy,
    points: 700
  },
  {
    id: "community-advocacy",
    title: "Community Advocacy",
    description: "Advocate for community issues",
    category: "social",
    icon: Heart,
    points: 300
  },
  {
    id: "technical-innovation",
    title: "Technical Innovation",
    description: "Innovate in technical projects",
    category: "technical",
    icon: Code,
    points: 800
  },
  {
    id: "personal-commitment",
    title: "Personal Commitment",
    description: "Commit to personal growth",
    category: "personal",
    icon: Brain,
    points: 500
  },
  {
    id: "academic-commitment",
    title: "Academic Commitment",
    description: "Commit to academic excellence",
    category: "academic",
    icon: Trophy,
    points: 800
  },
  {
    id: "community-involvement",
    title: "Community Involvement",
    description: "Get involved in community service",
    category: "social",
    icon: Heart,
    points: 400
  },
  {
    id: "technical-commitment",
    title: "Technical Commitment",
    description: "Commit to technical skill development",
    category: "technical",
    icon: Code,
    points: 600
  },
  {
    id: "personal-fulfillment",
    title: "Personal Fulfillment",
    description: "Achieve personal fulfillment",
    category: "personal",
    icon: Brain,
    points: 700
  },
  {
    id: "academic-fulfillment",
    title: "Academic Fulfillment",
    description: "Achieve academic fulfillment",
    category: "academic",
    icon: Trophy,
    points: 900
  },
  {
    id: "community-empowerment",
    title: "Community Empowerment",
    description: "Empower the community through initiatives",
    category: "social",
    icon: Heart,
    points: 500
  },
  {
    id: "technical-empowerment",
    title: "Technical Empowerment",
    description: "Empower others through technical skills",
    category: "technical",
    icon: Code,
    points: 700
  },
  {
    id: "personal-empowerment",
    title: "Personal Empowerment",
    description: "Empower yourself through personal growth",
    category: "personal",
    icon: Brain,
    points: 800
  },
  {
    id: "academic-empowerment",
    title: "Academic Empowerment",
    description: "Empower others through academic support",
    category: "academic",
    icon: Trophy,
    points: 1000
  },
  {
    id: "community-connection",
    title: "Community Connection",
    description: "Connect with the community",
    category: "social",
    icon: Heart,
    points: 300
  },
  {
    id: "technical-connection",
    title: "Technical Connection",
    description: "Connect with others through technical skills",
    category: "technical",
    icon: Code,
    points: 400
  },
  {
    id: "personal-connection",
    title: "Personal Connection",
    description: "Connect with others through personal growth",
    category: "personal",
    icon: Brain,
    points: 500
  },
  {
    id: "academic-connection",
    title: "Academic Connection",
    description: "Connect with others through academic pursuits",
    category: "academic",
    icon: Trophy,
    points: 600
  },
  {
    id: "community-collaboration",
    title: "Community Collaboration",
    description: "Collaborate with the community",
    category: "social",
    icon: Heart,
    points: 400
  },
  {
    id: "technical-collaboration",
    title: "Technical Collaboration",
    description: "Collaborate on technical projects",
    category: "technical",
    icon: Code,
    points: 500
  },
  {
    id: "personal-collaboration",
    title: "Personal Collaboration",
    description: "Collaborate on personal projects",
    category: "personal",
    icon: Brain,
    points: 600
  },
  {
    id: "academic-collaboration",
    title: "Academic Collaboration",
    description: "Collaborate on academic projects",
    category: "academic",
    icon: Trophy,
    points: 700
  },
  {
    id: "community-initiative",
    title: "Community Initiative",
    description: "Initiate a community project",
    category: "social",
    icon: Heart,
    points: 500
  },
  {
    id: "technical-initiative",
    title: "Technical Initiative",
    description: "Initiate a technical project",
    category: "technical",
    icon: Code,
    points: 600
  },
  {
    id: "personal-initiative",
    title: "Personal Initiative",
    description: "Initiate a personal project",
    category: "personal",
    icon: Brain,
    points: 700
  },
  {
    id: "academic-initiative",
    title: "Academic Initiative",
    description: "Initiate an academic project",
    category: "academic",
    icon: Trophy,
    points: 800
  },
  {
    id: "community-visionary",
    title: "Community Visionary",
    description: "Envision a better community",
    category: "social",
    icon: Heart,
    points: 900
  },
  {
    id: "technical-visionary",
    title: "Technical Visionary",
    description: "Envision a better technical future",
    category: "technical",
    icon: Code,
    points: 1000
  },
  {
    id: "personal-visionary",
    title: "Personal Visionary",
    description: "Envision a better personal future",
    category: "personal",
    icon: Brain,
    points: 900
  },
  {
    id: "academic-visionary",
    title: "Academic Visionary",
    description: "Envision a better academic future",
    category: "academic",
    icon: Trophy,
    points: 1000
  }
];

// Achievement categories for filtering
export const achievementCategories = {
  academic: "Academic Excellence",
  social: "Community Engagement",
  technical: "Technical Mastery",
  personal: "Personal Growth",
  participation: "Active Participation",
  milestone: "Major Milestones"
};

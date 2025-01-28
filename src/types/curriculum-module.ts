export type ModuleType = 'program' | 'course' | 'module' | 'resource' | 'assignment' | 'quiz';

export interface CurriculumModule {
  id: string;
  curriculum_id: string;
  module_type: ModuleType;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface Program {
  name: string;
  description: string;
  programOutcomes: string[];
  institution: string;
  complianceStandards: string[];
  degrees: {
    id: string;
    title: string;
    type: string;
    description: string;
    requiredCredits: number;
    metadata: {
      academicYear: string;
      deliveryFormat: string;
      department: string;
    };
    courses: string[];
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  credits: number;
  level: string;
  metadata: {
    instructor: string;
    meetingTimes: string;
    tags: string[];
    skills: string[];
  };
  modules: string[];
}
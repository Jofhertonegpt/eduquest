import type { Module } from "./curriculum";

export interface ModuleListProps {
  curriculumId: string;
  onModuleSelect: (module: Module) => void;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  type?: 'resource' | 'assignment' | 'quiz';
  courseId?: string;
  metadata?: {
    estimatedTime: number;
    difficulty: string;
    prerequisites: string[];
    tags: string[];
    skills: string[];
  };
}
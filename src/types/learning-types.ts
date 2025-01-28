import type { Module, Resource, Quiz, Assignment } from './curriculum';

export interface LearningModuleProps {
  module: Module;
  onComplete?: (moduleId: string) => void;
}

export interface ResourceViewerProps {
  resource: Resource;
  isCompleted?: boolean;
  onComplete?: (resourceId: string) => void;
}

export interface QuizPlayerProps {
  quiz: Quiz;
  isCompleted?: boolean;
  onComplete: (score: number) => void;
}

export interface AssignmentProps {
  assignment: Assignment;
  onSubmit: (assignmentId: string, submission: any) => void;
}

export interface ModuleListProps {
  curriculumId: string;
  type?: 'resource' | 'assignment' | 'quiz';
  onModuleSelect: (module: Module) => void;
}

export interface CurriculumSelectorProps {
  curricula: { id: string; curriculum: any }[] | undefined;
  currentCurriculumId?: string;
  onCurriculumChange: (id: string) => void;
}
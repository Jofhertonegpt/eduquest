import type { ModuleData } from '@/types/curriculum';

export interface ModuleListProps {
  curriculumId: string;
  modules: ModuleData[];
  onModuleSelect: (module: ModuleData) => void;
}
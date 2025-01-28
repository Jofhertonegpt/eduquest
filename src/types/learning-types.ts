import type { ModuleData } from "./curriculum";

export interface ModuleListProps {
  curriculumId: string;
  modules: any[];
  onModuleSelect: (module: ModuleData) => void;
}
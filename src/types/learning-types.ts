import type { ModuleData } from "./curriculum";

export interface ModuleListProps {
  curriculumId: string;
  modules: ModuleData[];
  onModuleSelect: (module: ModuleData) => void;
}
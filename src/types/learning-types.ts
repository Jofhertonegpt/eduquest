import type { ModuleData } from "./curriculum";

export interface ModuleListProps {
  curriculumId: string;
  onModuleSelect: (module: ModuleData) => void;
}
import type { Module } from "@/types/curriculum";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";

interface ModuleListProps {
  modules: Module[];
  activeModule: Module | null;
  onModuleSelect: (module: Module) => void;
}

const ModuleList = ({ modules, activeModule, onModuleSelect }: ModuleListProps) => {
  return (
    <GlassPanel 
      className="rounded-xl p-4"
      role="navigation"
      aria-label="Module navigation"
    >
      <h2 className="font-semibold mb-4" id="modules-heading">Modules</h2>
      <nav className="space-y-2" aria-labelledby="modules-heading">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleSelect(module)}
            className={cn(
              "w-full text-left px-4 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none",
              activeModule?.id === module.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
            aria-current={activeModule?.id === module.id ? "true" : undefined}
          >
            {module.title}
          </button>
        ))}
      </nav>
    </GlassPanel>
  );
};

export default ModuleList;
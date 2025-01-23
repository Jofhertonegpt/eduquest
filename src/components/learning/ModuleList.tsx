import type { Module } from "@/types/curriculum";

interface ModuleListProps {
  modules: Module[];
  activeModule: Module | null;
  onModuleSelect: (module: Module) => void;
}

const ModuleList = ({ modules, activeModule, onModuleSelect }: ModuleListProps) => {
  return (
    <div className="glass-panel rounded-xl p-4">
      <h2 className="font-semibold mb-4">Modules</h2>
      <nav className="space-y-2">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleSelect(module)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              activeModule?.id === module.id
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {module.title}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ModuleList;
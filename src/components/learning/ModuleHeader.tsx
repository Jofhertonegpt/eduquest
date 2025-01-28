import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Module } from "@/types/curriculum";

interface ModuleHeaderProps {
  module: Module;
  progress: number;
}

export const ModuleHeader = ({ module, progress }: ModuleHeaderProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2 mb-2">
        {module.metadata?.tags?.map((tag: string) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>
      <h2 className="text-2xl font-bold">{module.title}</h2>
      <p className="text-muted-foreground">{module.description}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
};
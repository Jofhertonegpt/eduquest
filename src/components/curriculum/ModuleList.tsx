import { useCurriculumModules } from "@/hooks/useCurriculumModules";
import { ModuleType } from "@/types/curriculum-module";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";
import type { Module } from "@/types/curriculum";

interface ModuleListProps {
  curriculumId: string;
  type?: ModuleType;
  onModuleSelect: (module: Module) => void;
}

export const ModuleList = ({ curriculumId, type, onModuleSelect }: ModuleListProps) => {
  const { data: modules, isLoading } = useCurriculumModules(curriculumId, type);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {modules?.map((module) => (
          <Card 
            key={module.id} 
            className="p-4 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onModuleSelect(module.content)}
          >
            <h3 className="text-lg font-semibold">
              {module.content.title || "Untitled Module"}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {module.content.description || "No description available"}
            </p>
            <div className="flex flex-wrap gap-2">
              {module.content.metadata?.estimatedTime && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.content.metadata.estimatedTime} mins
                </Badge>
              )}
              {module.content.metadata?.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
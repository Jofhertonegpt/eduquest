import { useCurriculumModules } from "@/hooks/useCurriculumModules";
import { ModuleType } from "@/types/curriculum-module";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModuleListProps {
  curriculumId: string;
  type?: ModuleType;
}

export const ModuleList = ({ curriculumId, type }: ModuleListProps) => {
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
          <Card key={module.id} className="p-4">
            <h3 className="text-lg font-semibold">
              {module.content.title || "Untitled Module"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {module.content.description || "No description available"}
            </p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
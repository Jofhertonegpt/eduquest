import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurriculumTemplates } from "@/hooks/useCurriculumTemplates";
import { Loader2 } from "lucide-react";

export function CurriculumTemplateList() {
  const { templates, isLoading } = useCurriculumTemplates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border p-4">
      <div className="space-y-4">
        {templates?.map((template) => (
          <Card key={template.id} className="p-4">
            <h3 className="text-lg font-semibold">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button size="sm">
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
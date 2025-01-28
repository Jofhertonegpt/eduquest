import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { ResourceViewer } from "../ResourceViewer";
import type { Resource } from "@/types/curriculum";

interface ResourceSectionProps {
  resources: Resource[];
  completedResources: string[];
  onResourceComplete: (resourceId: string) => void;
}

export const ResourceSection = ({ 
  resources, 
  completedResources, 
  onResourceComplete 
}: ResourceSectionProps) => {
  if (!resources?.length) {
    return (
      <Card className="p-6 text-center">
        <CardDescription>No resources available for this module</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {resources.map((resource) => (
        <Card key={resource.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>
                  {resource.type} • {resource.duration || "No duration"}
                </CardDescription>
              </div>
              {completedResources.includes(resource.id) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResourceViewer 
              resource={resource} 
              onComplete={() => onResourceComplete(resource.id)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
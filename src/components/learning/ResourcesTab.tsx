import { ResourceViewer } from "./ResourceViewer";
import type { Module } from "@/types/curriculum";

interface ResourcesTabProps {
  module: Module;
  completedResources: string[];
  onResourceComplete: (resourceId: string) => void;
}

export const ResourcesTab = ({ 
  module, 
  completedResources, 
  onResourceComplete 
}: ResourcesTabProps) => {
  return (
    <div className="space-y-6">
      {module.resources?.map((resource) => (
        <ResourceViewer
          key={resource.id}
          resource={resource}
          isCompleted={completedResources.includes(resource.id)}
          onComplete={() => onResourceComplete(resource.id)}
        />
      ))}
    </div>
  );
};
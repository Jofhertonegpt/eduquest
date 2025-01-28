import type { Module } from "@/types/curriculum";

interface AssignmentsTabProps {
  module: Module;
  completedAssignments: string[];
}

export const AssignmentsTab = ({ 
  module, 
  completedAssignments 
}: AssignmentsTabProps) => {
  return (
    <div className="space-y-6">
      {module.assignments?.map((assignment) => (
        <div
          key={assignment.id}
          className={`p-4 rounded-lg border ${
            completedAssignments.includes(assignment.id)
              ? "border-l-4 border-l-green-500"
              : "border-l-4 border-l-yellow-500"
          }`}
        >
          <h3 className="font-semibold mb-2">{assignment.title}</h3>
          <p className="text-muted-foreground">{assignment.description}</p>
        </div>
      ))}
    </div>
  );
};
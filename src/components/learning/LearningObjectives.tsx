import type { Module } from "@/types/curriculum";

interface LearningObjectivesProps {
  module: Module;
}

export const LearningObjectives = ({ module }: LearningObjectivesProps) => {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold">Learning Objectives</h3>
      <ul className="list-disc list-inside space-y-2">
        {module.learningObjectives?.map((objective, index) => (
          <li key={index} className="text-muted-foreground">
            {objective.description}
          </li>
        ))}
      </ul>
    </div>
  );
};
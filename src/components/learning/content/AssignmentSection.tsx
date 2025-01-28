import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import type { Assignment } from "@/types/curriculum";

interface AssignmentSectionProps {
  assignments: Assignment[];
  completedAssignments: string[];
}

export const AssignmentSection = ({ 
  assignments,
  completedAssignments 
}: AssignmentSectionProps) => {
  if (!assignments?.length) {
    return (
      <Card className="p-6 text-center">
        <CardDescription>No assignments available for this module</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>{assignment.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {assignment.points} points
              </span>
            </div>
            {assignment.rubric && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Grading Rubric</h4>
                <ul className="space-y-2">
                  {assignment.rubric.criteria.map((criterion, index) => (
                    <li key={index} className="flex justify-between p-2 bg-muted rounded-lg">
                      <span>{criterion.name}</span>
                      <span className="font-medium">{criterion.points} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <CodeEditor />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
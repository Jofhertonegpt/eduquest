import { GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AcademicProgressProps {
  currentDegree?: string | null;
}

export const AcademicProgress = ({ currentDegree }: AcademicProgressProps) => {
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Academic Progress</h3>
      </div>
      <div className="space-y-4">
        {currentDegree && (
          <div className="p-4 rounded-lg bg-background/50">
            <h4 className="font-semibold text-lg mb-2">Current Degree Program</h4>
            <p className="text-muted-foreground">{currentDegree}</p>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span>Progress</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
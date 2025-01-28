import { Progress } from "@/components/ui/progress";

interface ImportProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const ImportProgress = ({ currentStep, totalSteps }: ImportProgressProps) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
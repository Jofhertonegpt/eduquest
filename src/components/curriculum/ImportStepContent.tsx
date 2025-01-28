import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { JsonInputs } from "@/types/curriculum";

interface ImportStepContentProps {
  currentStep: number;
  jsonInputs: JsonInputs;
  jsonPlaceholders: Record<string, string>;
  onInputChange: (field: keyof JsonInputs, value: string) => void;
}

export const ImportStepContent = ({ 
  currentStep, 
  jsonInputs, 
  jsonPlaceholders, 
  onInputChange 
}: ImportStepContentProps) => {
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="curriculum-json">Program Structure</Label>
            <Textarea
              id="curriculum-json"
              placeholder={jsonPlaceholders.curriculum}
              value={jsonInputs.curriculum}
              onChange={(e) => onInputChange("curriculum", e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label htmlFor="courses-json">Course Definitions</Label>
            <Textarea
              id="courses-json"
              placeholder={jsonPlaceholders.courses}
              value={jsonInputs.courses}
              onChange={(e) => onInputChange("courses", e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="modules-json">Module Details</Label>
            <Textarea
              id="modules-json"
              placeholder={jsonPlaceholders.modules}
              value={jsonInputs.modules}
              onChange={(e) => onInputChange("modules", e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
        );
    }
  };

  return getStepContent();
};
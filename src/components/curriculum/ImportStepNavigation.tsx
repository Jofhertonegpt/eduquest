import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ImportStepNavigationProps {
  currentStep: number;
  isLoading: boolean;
  hasRequiredInput: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onImport: (useDefault?: boolean) => void;
}

export const ImportStepNavigation = ({
  currentStep,
  isLoading,
  hasRequiredInput,
  onPrevious,
  onNext,
  onImport
}: ImportStepNavigationProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        onClick={onPrevious}
        disabled={currentStep === 1}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Previous
      </Button>

      <div className="flex gap-2">
        <Button
          onClick={() => onImport(true)}
          variant="secondary"
          disabled={isLoading}
        >
          Use Default
        </Button>

        {currentStep === 3 ? (
          <Button
            onClick={() => onImport()}
            disabled={isLoading || !hasRequiredInput}
            className="flex items-center gap-2"
          >
            {isLoading ? "Importing..." : "Import Curriculum"}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="flex items-center gap-2"
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
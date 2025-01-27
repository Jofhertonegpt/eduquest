import { CurriculumImport } from "@/components/CurriculumImport";
import { CurriculumFormatInfo } from "@/components/learning/CurriculumFormatInfo";
import { Card } from "@/components/ui/card";

const Import = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Import Curriculum</h1>
        <CurriculumFormatInfo />
      </div>
      
      <Card className="p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground mb-6">
            Import your curriculum by pasting JSON or dragging a file. Make sure to follow the curriculum format guide for proper structure.
          </p>
          <CurriculumImport />
        </div>
      </Card>
    </div>
  );
};

export default Import;
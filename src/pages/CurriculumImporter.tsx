import { useNavigate } from "react-router-dom";
import { CurriculumImport } from "@/components/CurriculumImport";
import { CurriculumFormatInfo } from "@/components/learning/CurriculumFormatInfo";
import { Card } from "@/components/ui/card";

const CurriculumImporter = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between pb-6 border-b">
          <h1 className="text-3xl font-bold">Import Curriculum</h1>
          <CurriculumFormatInfo />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                Import your curriculum in JSON format to get started. Click the info icon
                to see the required format and example.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-6">
                <li>Supports multiple modules and content types</li>
                <li>Automatic validation of curriculum structure</li>
                <li>Version control for curriculum updates</li>
                <li>Easy to modify and extend</li>
              </ul>
            </Card>
          </div>

          <div>
            <CurriculumImport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumImporter;
import { CurriculumImport } from "@/components/CurriculumImport";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

const Import = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Import Curriculum</h1>
        </div>
        
        <Card className="p-6">
          <div className="text-center space-y-4 mb-8">
            <FileUp className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">Import Your Curriculum</h2>
              <p className="text-sm text-muted-foreground">
                Upload your curriculum JSON file or paste your curriculum data below
              </p>
            </div>
          </div>
          
          <CurriculumImport />
        </Card>
      </div>
    </div>
  );
};

export default Import;
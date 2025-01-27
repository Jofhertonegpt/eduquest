import { useNavigate } from "react-router-dom";
import { CurriculumImport } from "@/components/CurriculumImport";
import { ImportedCurriculaList } from "@/components/curriculum/ImportedCurriculaList";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, PenTool } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Import = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Curriculum Manager</h1>
          <Button 
            onClick={() => navigate('/creator')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            Create New Curriculum
          </Button>
        </div>
        
        <Tabs defaultValue="imported" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="imported">Imported Curricula</TabsTrigger>
            <TabsTrigger value="import">Import New</TabsTrigger>
          </TabsList>

          <TabsContent value="imported">
            <ImportedCurriculaList />
          </TabsContent>

          <TabsContent value="import">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Import;
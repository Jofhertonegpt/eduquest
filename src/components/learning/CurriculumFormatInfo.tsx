import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Info, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sampleCurriculum } from "@/data/sampleCurriculum";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CurriculumFormatInfo = () => {
  const { toast } = useToast();

  const copyFormatToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(sampleCurriculum, null, 2));
      toast({
        title: "Format copied!",
        description: "The curriculum format has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>JSON Format FAQ:</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview" className="h-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="example">Example</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(80vh-10rem)] mt-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>What are the required JSON files?</h3>
                <p>
                  The curriculum system requires multiple JSON files that work together to create a complete
                  learning experience. Each file serves a specific purpose:
                </p>
                
                <h4>Required Files:</h4>
                <ul>
                  <li>
                    <strong>Curriculum JSON</strong> - Contains the main program information and structure
                  </li>
                  <li>
                    <strong>Courses JSON</strong> - Defines the courses within the program
                  </li>
                  <li>
                    <strong>Modules JSON</strong> - Contains the learning modules for each course
                  </li>
                  <li>
                    <strong>Quizzes JSON</strong> - Defines assessment questions and answers
                  </li>
                  <li>
                    <strong>Assignments JSON</strong> - Contains practical assignments and projects
                  </li>
                  <li>
                    <strong>Resources JSON</strong> - Lists learning materials and references
                  </li>
                </ul>

                <h4>Key Features:</h4>
                <ul>
                  <li>Each file must be valid JSON format</li>
                  <li>IDs must be unique across all files</li>
                  <li>References between files use these unique IDs</li>
                  <li>All required fields must be present</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>JSON Structure Requirements</h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-semibold mb-2">Curriculum JSON:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>name (string) - Program name</li>
                      <li>description (string) - Program overview</li>
                      <li>degrees (array) - List of degree programs</li>
                      <li>institution (string) - Institution name</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-semibold mb-2">Courses JSON:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>id (string) - Unique course identifier</li>
                      <li>title (string) - Course name</li>
                      <li>description (string) - Course description</li>
                      <li>credits (number) - Course credit value</li>
                      <li>level (string) - Course difficulty level</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-semibold mb-2">Modules JSON:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>id (string) - Unique module identifier</li>
                      <li>courseId (string) - Reference to parent course</li>
                      <li>title (string) - Module name</li>
                      <li>description (string) - Module content</li>
                      <li>resources (array) - Learning materials</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="example" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button onClick={copyFormatToClipboard} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Example
                </Button>
              </div>
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-auto">
                {JSON.stringify(sampleCurriculum, null, 2)}
              </pre>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
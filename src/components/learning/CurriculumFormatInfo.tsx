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
          <DialogTitle>Enhanced Curriculum Format Guide</DialogTitle>
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
                <h3>What is a Curriculum?</h3>
                <p>
                  A curriculum is a structured educational program that consists of programs, 
                  courses, and modules. Each component is designed to provide a comprehensive 
                  learning experience with clear objectives and outcomes.
                </p>
                
                <h4>Key Components:</h4>
                <ul>
                  <li>
                    <strong>Programs</strong> - The highest level of organization, representing complete
                    educational paths (e.g., Computer Science, Business Administration)
                  </li>
                  <li>
                    <strong>Courses</strong> - Major subjects or areas of study within a program
                  </li>
                  <li>
                    <strong>Modules</strong> - Specific units of learning within courses
                  </li>
                </ul>

                <h4>Learning Features:</h4>
                <ul>
                  <li>Interactive assessments and quizzes</li>
                  <li>Multimedia resources (videos, documents, code examples)</li>
                  <li>Progress tracking and achievements</li>
                  <li>Clear learning objectives and outcomes</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Program Structure</h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-semibold mb-2">Required Fields:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>name (string) - Program title</li>
                      <li>description (string) - Program overview</li>
                      <li>programOutcomes (string[]) - Expected learning outcomes</li>
                      <li>institution (string) - Institution offering the program</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-semibold mb-2">Course Structure:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>title (string) - Course name</li>
                      <li>description (string) - Course overview</li>
                      <li>credits (number) - Course credits</li>
                      <li>level (string) - Course difficulty level</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-semibold mb-2">Module Components:</h4>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Resources (videos, documents, code)</li>
                      <li>Assessments with rubrics</li>
                      <li>Interactive quizzes</li>
                      <li>Learning objectives</li>
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
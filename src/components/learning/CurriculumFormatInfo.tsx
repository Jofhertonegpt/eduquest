import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Info, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sampleCurriculum } from "@/data/sampleCurriculum";

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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Enhanced Curriculum Format</DialogTitle>
          <p className="text-sm text-muted-foreground">
            This format supports advanced features including interactive quizzes, coding assignments, and detailed learning objectives.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <ScrollArea className="h-[500px] mt-4">
            <div className="space-y-4 p-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Interactive quizzes with multiple question types</li>
                  <li>Coding assignments with automated testing</li>
                  <li>Detailed learning objectives and assessment criteria</li>
                  <li>Resource management with various content types</li>
                  <li>Progress tracking and achievements</li>
                </ul>
              </div>
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-auto">
                {JSON.stringify(sampleCurriculum, null, 2)}
              </pre>
            </div>
          </ScrollArea>
          <Button onClick={copyFormatToClipboard} className="w-full">
            <Copy className="mr-2 h-4 w-4" />
            Copy Format
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
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
          <DialogTitle>Curriculum Format</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ScrollArea className="h-[500px] mt-4">
            <pre className="p-4 bg-muted rounded-lg text-sm">
              {JSON.stringify(sampleCurriculum, null, 2)}
            </pre>
          </ScrollArea>
          <Button onClick={copyFormatToClipboard} className="mt-4">
            <Copy className="mr-2 h-4 w-4" />
            Copy Format
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
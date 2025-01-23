import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Curriculum } from "@/types/curriculum";

interface Props {
  onImport: (curriculum: Curriculum) => void;
}

const CurriculumImport = ({ onImport }: Props) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileImport = async (file: File) => {
    try {
      const text = await file.text();
      const curriculum = JSON.parse(text) as Curriculum;
      
      // Basic validation
      if (!curriculum.modules || !Array.isArray(curriculum.modules)) {
        throw new Error("Invalid curriculum format");
      }

      onImport(curriculum);
      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import curriculum. Please check the file format.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      handleFileImport(file);
    } else {
      toast({
        title: "Error",
        description: "Please provide a JSON file",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-semibold mb-2">Import Curriculum</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop your JSON curriculum file here
      </p>
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept="application/json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileImport(file);
        }}
      />
      <Button
        variant="outline"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        Select File
      </Button>
    </div>
  );
};

export default CurriculumImport;
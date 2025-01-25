import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { encryptData } from "@/lib/encryption";
import { sanitizeInput } from "@/lib/supabase";
import { uploadFile } from "@/lib/storage";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import type { Curriculum } from "@/types/curriculum";

interface Props {
  onImport: (curriculum: Curriculum) => void;
}

const CurriculumImport = ({ onImport }: Props) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileImport = async (file: File) => {
    try {
      setIsValidating(true);
      const { text } = await uploadFile(file);
      const rawCurriculum = JSON.parse(text as string);
      
      // Validate and transform curriculum data
      const curriculum = validateAndTransformCurriculum(rawCurriculum);

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      // Encrypt sensitive data before saving
      const encryptedData = encryptData(JSON.stringify(curriculum));

      // Save to Supabase with encrypted data
      const { data: savedCurriculum, error: saveError } = await supabase
        .from('imported_curricula')
        .insert({
          user_id: user.id,
          curriculum: encryptedData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Create backup
      await supabase
        .from('curriculum_backups')
        .insert({
          user_id: user.id,
          curriculum: encryptedData,
          created_at: new Date().toISOString()
        });

      onImport(curriculum);
      toast({
        title: "Success",
        description: "Curriculum imported and encrypted successfully",
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
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
      {isValidating ? (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Validating curriculum...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default CurriculumImport;
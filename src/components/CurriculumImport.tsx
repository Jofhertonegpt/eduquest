import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Curriculum, Degree } from "@/types/curriculum";
import { supabase } from "@/lib/supabase";
import { curriculumSchema, encryptData } from "@/lib/encryption";
import { sanitizeInput } from "@/lib/supabase";

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
      const text = await file.text();
      const rawCurriculum = JSON.parse(text);
      
      // Validate curriculum structure
      const validationResult = curriculumSchema.safeParse(rawCurriculum);
      
      if (!validationResult.success) {
        throw new Error("Invalid curriculum format: " + validationResult.error.message);
      }

      // Ensure required properties are present and add default values
      const curriculum: Curriculum = {
        name: sanitizeInput(validationResult.data.name || ''),
        description: sanitizeInput(validationResult.data.description || ''),
        degrees: validationResult.data.degrees.map((degree): Degree => ({
          id: degree.id || crypto.randomUUID(),
          title: degree.title || '',
          type: degree.type || 'bachelors',
          description: degree.description || '',
          requiredCredits: degree.requiredCredits || 0,
          courses: degree.courses?.map(course => ({
            id: course.id || crypto.randomUUID(),
            title: course.title || '',
            description: course.description || '',
            credits: course.credits || 0,
            level: course.level || 'introductory',
            modules: course.modules?.map(module => ({
              id: module.id || crypto.randomUUID(),
              title: module.title || '',
              description: module.description || '',
              metadata: {
                estimatedTime: 0,
                difficulty: 'beginner',
                prerequisites: [],
                tags: [],
                skills: []
              },
              learningObjectives: [],
              resources: [],
              assignments: [],
              quizzes: []
            })) || []
          })) || []
        }))
      };

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      // Encrypt sensitive data before saving
      const encryptedData = encryptData(JSON.stringify(curriculum));

      // Save to Supabase with encrypted data
      const { error: saveError } = await supabase
        .from('imported_curricula')
        .insert({
          user_id: user.id,
          curriculum: encryptedData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

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
        description: "Curriculum imported, encrypted, and backed up successfully",
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
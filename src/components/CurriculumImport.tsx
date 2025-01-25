import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Curriculum, Degree } from "@/types/curriculum";
import { supabase } from "@/lib/supabase";
import { curriculumSchema, encryptData } from "@/lib/encryption";
import { sanitizeInput } from "@/lib/supabase";
import { uploadFile } from "@/lib/storage";

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
      
      // Validate curriculum structure
      const validationResult = curriculumSchema.safeParse(rawCurriculum);
      
      if (!validationResult.success) {
        throw new Error("Invalid curriculum format: " + validationResult.error.message);
      }

      const { data } = validationResult;

      // Create curriculum object with validated data and ensure all required fields
      const curriculum: Curriculum = {
        name: sanitizeInput(data.name),
        description: sanitizeInput(data.description),
        degrees: data.degrees.map((degree): Degree => ({
          id: degree.id || crypto.randomUUID(),
          title: degree.title,
          type: degree.type,
          description: degree.description,
          requiredCredits: degree.requiredCredits,
          courses: degree.courses.map(course => ({
            id: course.id || crypto.randomUUID(),
            title: course.title,
            description: course.description,
            credits: course.credits,
            level: course.level,
            modules: course.modules.map(module => ({
              id: module.id || crypto.randomUUID(),
              title: module.title,
              description: module.description,
              credits: module.credits,
              metadata: {
                estimatedTime: module.metadata.estimatedTime,
                difficulty: module.metadata.difficulty,
                prerequisites: module.metadata.prerequisites,
                tags: module.metadata.tags,
                skills: module.metadata.skills
              },
              learningObjectives: module.learningObjectives.map(obj => ({
                id: obj.id || crypto.randomUUID(),
                description: obj.description || '',
                assessmentCriteria: obj.assessmentCriteria || []
              })),
              resources: module.resources,
              assignments: module.assignments,
              quizzes: module.quizzes
            }))
          }))
        }))
      };

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
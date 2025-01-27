import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import { supabase } from "@/integrations/supabase/client";
import type { Curriculum } from "@/types/curriculum";

export function CurriculumImport() {
  const [isLoading, setIsLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImport = async () => {
    try {
      setIsLoading(true);
      
      // Parse and validate JSON input
      const curriculumData = JSON.parse(jsonInput);
      const validatedCurriculum = validateAndTransformCurriculum(curriculumData);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Insert curriculum
      const { data, error } = await supabase
        .from("imported_curricula")
        .insert({
          user_id: user.id,
          curriculum: validatedCurriculum,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Curriculum imported successfully",
      });

      // Navigate to the learning page with the new curriculum ID
      navigate(`/learning/${data.id}`);
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import curriculum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="curriculum-json">Curriculum JSON</Label>
          <Textarea
            id="curriculum-json"
            placeholder="Paste your curriculum JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <Button 
          onClick={handleImport} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Importing..." : "Import Curriculum"}
        </Button>
      </div>
    </Card>
  );
}

export default CurriculumImport;
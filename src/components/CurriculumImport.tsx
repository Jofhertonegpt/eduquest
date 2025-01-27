import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateAndTransformCurriculum } from "@/lib/curriculumValidation";
import { supabase } from "@/lib/supabase";
import defaultCurriculum from "@/data/curriculum/program.json";
import type { Json } from "@/lib/database.types";
import type { Curriculum } from "@/types/curriculum";

export function CurriculumImport() {
  const [isLoading, setIsLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleImport = async (curriculumData?: any) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to import a curriculum",
          variant: "destructive",
        });
        navigate("/login", { state: { returnTo: "/import" } });
        return;
      }

      setIsLoading(true);
      
      // Use provided data or parse JSON input
      const dataToImport = curriculumData || JSON.parse(jsonInput);
      const validatedCurriculum = validateAndTransformCurriculum(dataToImport);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Convert curriculum to JSON type expected by Supabase
      const curriculumJson: Json = validatedCurriculum as unknown as Json;

      // Insert curriculum
      const { data, error } = await supabase
        .from("imported_curricula")
        .insert({
          user_id: user.id,
          curriculum: curriculumJson,
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

  const handleUseDefault = () => {
    handleImport(defaultCurriculum);
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
        <div className="flex gap-4">
          <Button 
            onClick={() => handleImport()} 
            disabled={isLoading || !jsonInput}
            className="flex-1"
          >
            {isLoading ? "Importing..." : "Import Custom Curriculum"}
          </Button>
          <Button 
            onClick={handleUseDefault}
            disabled={isLoading}
            variant="secondary"
            className="flex-1"
          >
            Use Default Curriculum
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CurriculumImport;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";

const JoinSchool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJoinSchool = async (schoolId: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("school_members")
        .insert({
          school_id: schoolId,
          student_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've successfully joined the school.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join school. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <h1 className="text-2xl font-bold mb-6">Join a School</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search for a school</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Enter school name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Schools</h2>
          <div className="space-y-2">
            {/* This would be replaced with actual search results */}
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => handleJoinSchool("example-school-id")}
              disabled={isLoading}
            >
              Example University
              <span className="text-sm text-muted-foreground">Join →</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JoinSchool;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Cat, Dog, Rabbit, Squirrel, Turtle } from "lucide-react";
import { cn } from "@/lib/utils";

const SCHOOL_ICONS = [
  { icon: Cat, label: "Cat" },
  { icon: Dog, label: "Dog" },
  { icon: Rabbit, label: "Rabbit" },
  { icon: Squirrel, label: "Squirrel" },
  { icon: Turtle, label: "Turtle" },
];

export const SchoolCreator = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Cat");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create school
      const { data: school, error: schoolError } = await supabase
        .from("schools")
        .insert({
          name: name.trim(),
          description: description.trim(),
          icon_type: selectedIcon,
        })
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Add creator as member
      const { error: memberError } = await supabase
        .from("school_members")
        .insert({
          school_id: school.id,
          student_id: user.id,
          role: "admin",
        });

      if (memberError) throw memberError;

      toast({
        title: "School Created",
        description: "Your school has been created successfully!",
      });

      setOpen(false);
      navigate("/school");
    } catch (error) {
      console.error("Error creating school:", error);
      toast({
        title: "Error",
        description: "Failed to create school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create School</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New School</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">School Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter school name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your school"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">School Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {SCHOOL_ICONS.map(({ icon: Icon, label }) => (
                <Button
                  key={label}
                  variant="outline"
                  className={cn(
                    "h-12 w-12 p-0",
                    selectedIcon === label && "border-primary"
                  )}
                  onClick={() => setSelectedIcon(label)}
                  disabled={loading}
                >
                  <Icon className="h-6 w-6" />
                </Button>
              ))}
            </div>
          </div>
          <Button 
            className="w-full" 
            onClick={handleCreate}
            disabled={!name.trim() || loading}
          >
            {loading ? "Creating..." : "Create School"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
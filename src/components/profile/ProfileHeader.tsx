import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeEditor from "@/components/CodeEditor";
import { toast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  name: string;
  email: string;
  editMode: boolean;
  onNameChange: (name: string) => void;
  onEditToggle: () => void;
  onSave: () => void;
}

export const ProfileHeader = ({
  name,
  email,
  editMode,
  onNameChange,
  onEditToggle,
  onSave,
}: ProfileHeaderProps) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newName = e.target.value.trim();
      if (newName.length > 100) {
        throw new Error("Name cannot exceed 100 characters");
      }
      onNameChange(newName);
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update name",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        throw new Error("Name cannot be empty");
      }
      await onSave();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          {editMode ? (
            <Input
              value={name}
              onChange={handleNameChange}
              className="mb-2"
              maxLength={100}
              required
              aria-label="Full name"
            />
          ) : (
            <h2 className="text-2xl font-bold">{name}</h2>
          )}
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <CodeEditor />
        <Button
          variant={editMode ? "default" : "outline"}
          onClick={editMode ? handleSave : onEditToggle}
          aria-label={editMode ? "Save changes" : "Edit profile"}
        >
          <Settings className="h-4 w-4 mr-2" />
          {editMode ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>
    </div>
  );
};
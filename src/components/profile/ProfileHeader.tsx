import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeEditor from "@/components/CodeEditor";

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
              onChange={(e) => onNameChange(e.target.value)}
              className="mb-2"
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
          onClick={editMode ? onSave : onEditToggle}
        >
          <Settings className="h-4 w-4 mr-2" />
          {editMode ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>
    </div>
  );
};
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

interface PrivacySettingsProps {
  settings: any;
  onUpdate: (key: string, value: string) => void;
}

export const PrivacySettings = ({ settings, onUpdate }: PrivacySettingsProps) => {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Privacy</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(settings || {}).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`privacy-${key}`} className="capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
            <Select
              value={value as string}
              onValueChange={(newValue) => onUpdate(key, newValue)}
            >
              <SelectTrigger id={`privacy-${key}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};
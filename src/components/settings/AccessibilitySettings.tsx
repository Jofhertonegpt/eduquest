import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface AccessibilitySettingsProps {
  settings: any;
  onUpdate: (key: string, value: any) => void;
}

export const AccessibilitySettings = ({ settings, onUpdate }: AccessibilitySettingsProps) => {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Accessibility</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(settings || {}).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor={`accessibility-${key}`} className="capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <p className="text-sm text-muted-foreground">
                {key === 'fontSize' ? 'Adjust text size' : `Enable ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
              </p>
            </div>
            {key === 'fontSize' ? (
              <Select
                value={value as string}
                onValueChange={(newValue) => onUpdate(key, newValue)}
              >
                <SelectTrigger id={`accessibility-${key}`} className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Switch
                id={`accessibility-${key}`}
                checked={value as boolean}
                onCheckedChange={(checked) => onUpdate(key, checked)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
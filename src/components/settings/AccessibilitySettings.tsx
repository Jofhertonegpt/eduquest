import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Text Size</Label>
          <Select
            value={settings?.fontSize || "medium"}
            onValueChange={(value) => onUpdate("fontSize", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Contrast Level</Label>
          <Slider
            value={[settings?.contrastLevel || 100]}
            onValueChange={(value) => onUpdate("contrastLevel", value[0])}
            max={200}
            min={100}
            step={10}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Adjust contrast for better readability
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              checked={settings?.reducedMotion || false}
              onCheckedChange={(checked) => onUpdate("reducedMotion", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enhance visual distinction between elements
              </p>
            </div>
            <Switch
              checked={settings?.highContrast || false}
              onCheckedChange={(checked) => onUpdate("highContrast", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Screen Reader Optimization</Label>
              <p className="text-sm text-muted-foreground">
                Enhanced descriptions for screen readers
              </p>
            </div>
            <Switch
              checked={settings?.screenReaderOptimized || false}
              onCheckedChange={(checked) => onUpdate("screenReaderOptimized", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
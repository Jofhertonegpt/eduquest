import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";

interface PrivacySettingsProps {
  settings: any;
  onUpdate: (key: string, value: string | boolean) => void;
}

export const PrivacySettings = ({ settings, onUpdate }: PrivacySettingsProps) => {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Privacy</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Profile Visibility</Label>
          <Select
            value={settings?.profileVisibility || "public"}
            onValueChange={(value) => onUpdate("profileVisibility", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Friends Only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Media Privacy</Label>
          <Select
            value={settings?.mediaVisibility || "public"}
            onValueChange={(value) => onUpdate("mediaVisibility", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Friends Only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-Play Media</Label>
              <p className="text-sm text-muted-foreground">
                Automatically play videos in feed
              </p>
            </div>
            <Switch
              checked={settings?.autoPlayMedia || false}
              onCheckedChange={(checked) => onUpdate("autoPlayMedia", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>High Quality Media</Label>
              <p className="text-sm text-muted-foreground">
                Load high resolution media by default
              </p>
            </div>
            <Switch
              checked={settings?.highQualityMedia || false}
              onCheckedChange={(checked) => onUpdate("highQualityMedia", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Location Data</Label>
              <p className="text-sm text-muted-foreground">
                Include location data in media uploads
              </p>
            </div>
            <Switch
              checked={settings?.includeLocation || false}
              onCheckedChange={(checked) => onUpdate("includeLocation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Content Warning</Label>
              <p className="text-sm text-muted-foreground">
                Show warning for sensitive content
              </p>
            </div>
            <Switch
              checked={settings?.showContentWarning || false}
              onCheckedChange={(checked) => onUpdate("showContentWarning", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
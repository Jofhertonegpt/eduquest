import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

interface NotificationSettingsProps {
  preferences: any;
  onUpdate: (key: string, value: boolean) => void;
}

export const NotificationSettings = ({ preferences, onUpdate }: NotificationSettingsProps) => {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>

      <div className="space-y-4">
        {Object.entries(preferences || {}).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor={`notification-${key}`} className="capitalize">
                {key.replace(/_/g, ' ')} Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive {key.replace(/_/g, ' ').toLowerCase()} notifications
              </p>
            </div>
            <Switch
              id={`notification-${key}`}
              checked={value as boolean}
              onCheckedChange={(checked) => onUpdate(key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
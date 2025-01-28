import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Appearance</h3>
      </div>
      
      <div className="space-y-4">
        <Label>Theme</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="h-24 bg-background hover:bg-background/90"
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="h-24 bg-[#221F26] hover:bg-[#221F26]/90 text-[#1EAEDB]"
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="h-24"
            onClick={() => setTheme("system")}
          >
            System
          </Button>
          <Button
            variant={theme === "rainbow" ? "default" : "outline"}
            className="h-24 relative overflow-hidden"
            style={{
              background: theme === "rainbow" 
                ? "linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #8000ff)"
                : undefined,
              backgroundSize: "300% 300%",
              animation: theme === "rainbow" ? "gradient 10s ease infinite" : undefined
            }}
            onClick={() => setTheme("rainbow")}
          >
            <span className={theme === "rainbow" ? "text-white font-bold" : undefined}>
              Rainbow
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
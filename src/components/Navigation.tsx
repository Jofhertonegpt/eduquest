import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurriculum } from "@/hooks/use-curriculum";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Download,
  Home,
  Settings,
  User,
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { hasCurriculum } = useCurriculum();

  const links = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
      ariaLabel: "Go to Dashboard",
      disabled: false,
    },
    {
      to: "/import",
      icon: Download,
      label: "Import",
      ariaLabel: "Import Curriculum",
      disabled: false,
    },
    {
      to: "/learning",
      icon: BookOpen,
      label: "Learning",
      ariaLabel: "Access Learning",
      disabled: !hasCurriculum,
    },
    {
      to: "/profile",
      icon: User,
      label: "Profile",
      ariaLabel: "View Profile",
      disabled: false,
    },
    {
      to: "/settings",
      icon: Settings,
      label: "Settings",
      ariaLabel: "Adjust Settings",
      disabled: false,
    },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start gap-1 md:gap-6 h-16">
          {links.map(({ to, icon: Icon, label, ariaLabel, disabled }) => (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <Link
                  to={disabled ? "#" : to}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-colors",
                    "text-muted-foreground hover:text-foreground",
                    "text-xs md:text-sm font-medium",
                    location.pathname === to && "text-primary bg-primary/5",
                    disabled && "opacity-50 cursor-not-allowed hover:text-muted-foreground"
                  )}
                  aria-label={ariaLabel}
                  aria-disabled={disabled}
                  aria-current={location.pathname === to ? "page" : undefined}
                  onClick={e => disabled && e.preventDefault()}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {disabled && label === "Learning" 
                  ? "Import a curriculum first to access learning"
                  : ariaLabel}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
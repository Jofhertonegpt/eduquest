import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  User,
  PenTool,
  Download,
  GraduationCap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const links = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
      ariaLabel: "Go to Dashboard",
      disabled: false,
    },
    {
      to: "/jofh-school",
      icon: GraduationCap,
      label: "Jofh School",
      ariaLabel: "Go to Jofh School",
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
      to: "/creator",
      icon: PenTool,
      label: "Creator",
      ariaLabel: "Curriculum Creator",
      disabled: false,
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

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, disabled: boolean, to: string) => {
    if (disabled) {
      e.preventDefault();
      toast({
        title: "Access Denied",
        description: "This feature is currently unavailable",
        variant: "destructive",
      });
      return;
    }

    // Additional navigation error handling could be added here
    try {
      // Navigation will be handled by React Router
      // This try-catch is for any pre-navigation logic
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to the requested page",
        variant: "destructive",
      });
      e.preventDefault();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-around md:justify-start gap-1 md:gap-6 h-16 relative">
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
                  onClick={(e) => handleNavigation(e, disabled, to)}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {disabled ? "Currently unavailable" : ariaLabel}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, User, School } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Dashboard", ariaLabel: "Go to Dashboard" },
    { to: "/school", icon: School, label: "School", ariaLabel: "Go to School" },
    { to: "/learning", icon: BookOpen, label: "Learning", ariaLabel: "Go to Learning" },
    { to: "/profile", icon: User, label: "Profile", ariaLabel: "Go to Profile" },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t md:top-0 md:bottom-auto z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start gap-4 h-16">
          {links.map(({ to, icon: Icon, label, ariaLabel }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-none",
                "text-muted-foreground hover:text-foreground",
                location.pathname === to && "text-primary bg-primary/5"
              )}
              aria-label={ariaLabel}
              aria-current={location.pathname === to ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
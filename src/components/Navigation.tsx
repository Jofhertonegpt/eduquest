import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, User, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/learning", icon: BookOpen, label: "Learning" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t md:top-0 md:bottom-auto z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start gap-4 h-16">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1.5 rounded-lg transition-colors",
                "text-muted-foreground hover:text-foreground",
                location.pathname === to && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, BookOpen, FileText, CheckCircle, AlertCircle } from "lucide-react";
import type { Module } from "@/types/curriculum";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
  onHover: () => void;
}

const ModuleCardContent = ({ module, onClick, onHover }: ModuleCardProps) => {
  if (!module) {
    return (
      <Card className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>Module data unavailable</span>
        </div>
      </Card>
    );
  }

  const getModuleIcon = (type?: string) => {
    switch (type) {
      case 'resource':
        return <BookOpen className="w-4 h-4" aria-hidden="true" />;
      case 'assignment':
        return <FileText className="w-4 h-4" aria-hidden="true" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" aria-hidden="true" />;
      default:
        return <BookOpen className="w-4 h-4" aria-hidden="true" />;
    }
  };

  return (
    <Card 
      className={cn(
        "group transition-all duration-200 hover:shadow-md cursor-pointer",
        "bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/50"
      )}
      onClick={onClick}
      onMouseEnter={onHover}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${module.title} - ${module.type || 'learning'} module`}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2 group-hover:text-primary transition-colors">
          {getModuleIcon(module.type)}
          <span>{module.title || "Untitled Module"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {module.description || "No description available"}
        </p>
        <div className="flex flex-wrap gap-2" aria-label="Module metadata">
          {module.metadata?.estimatedTime && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 bg-secondary/50"
              aria-label={`Estimated time: ${module.metadata.estimatedTime} minutes`}
            >
              <Clock className="w-3 h-3" aria-hidden="true" />
              {module.metadata.estimatedTime} mins
            </Badge>
          )}
          {module.metadata?.tags?.map((tag: string) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="flex items-center gap-1 border-border/50"
              aria-label={`Tag: ${tag}`}
            >
              <Tag className="w-3 h-3" aria-hidden="true" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const ModuleCard = (props: ModuleCardProps) => {
  return (
    <ErrorBoundary>
      <ModuleCardContent {...props} />
    </ErrorBoundary>
  );
};
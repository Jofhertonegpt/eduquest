import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, BookOpen, FileText, CheckCircle } from "lucide-react";
import type { Module } from "@/types/curriculum";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  module: Module;
  onClick: () => void;
  onHover: () => void;
}

export const ModuleCard = ({ module, onClick, onHover }: ModuleCardProps) => {
  const getModuleIcon = (type?: string) => {
    switch (type) {
      case 'resource':
        return <BookOpen className="w-4 h-4" />;
      case 'assignment':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
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
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2 group-hover:text-primary transition-colors">
          {getModuleIcon(module.type)}
          {module.title || "Untitled Module"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {module.description || "No description available"}
        </p>
        <div className="flex flex-wrap gap-2">
          {module.metadata?.estimatedTime && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-secondary/50">
              <Clock className="w-3 h-3" />
              {module.metadata.estimatedTime} mins
            </Badge>
          )}
          {module.metadata?.tags?.map((tag: string) => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1 border-border/50">
              <Tag className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
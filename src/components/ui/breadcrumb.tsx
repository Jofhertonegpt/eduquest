import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  isCurrentPage?: boolean;
}

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export const Breadcrumb = ({ children, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex items-center space-x-2", className)}>
        {children}
      </ol>
    </nav>
  );
};

export const BreadcrumbItem = ({ children, isCurrentPage }: BreadcrumbItemProps) => {
  return (
    <li className="flex items-center">
      <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
      <span
        className={cn(
          "text-sm",
          isCurrentPage ? "text-foreground font-medium" : "text-muted-foreground"
        )}
        aria-current={isCurrentPage ? "page" : undefined}
      >
        {children}
      </span>
    </li>
  );
};

export const BreadcrumbLink = ({ children, href, className }: BreadcrumbLinkProps) => {
  if (!href) {
    return <span className={cn("text-sm", className)}>{children}</span>;
  }

  return (
    <a
      href={href}
      className={cn(
        "text-sm text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
    >
      {children}
    </a>
  );
};
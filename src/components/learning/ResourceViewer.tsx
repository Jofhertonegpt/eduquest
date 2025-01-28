import { useState, useEffect, useCallback } from "react";
import type { Resource } from "@/types/curriculum";
import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResourceViewerProps {
  resource: Resource;
  onComplete?: () => void;
}

export const ResourceViewer = ({ resource, onComplete }: ResourceViewerProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedProgress = localStorage.getItem(`resource-${resource.id}`);
    if (savedProgress) {
      setIsComplete(true);
    }
    setIsLoading(false);
  }, [resource.id]);

  const handleComplete = () => {
    localStorage.setItem(`resource-${resource.id}`, 'completed');
    setIsComplete(true);
    onComplete?.();
    
    toast({
      title: "Resource Completed",
      description: "Your progress has been saved",
    });
  };

  const handleRetry = useCallback(() => {
    setLoadError(null);
    setIsLoading(true);
    // Force iframe reload by updating key
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  const handleError = useCallback((error: string) => {
    setLoadError(error);
    setIsLoading(false);
    
    toast({
      variant: "destructive",
      title: "Error Loading Resource",
      description: error,
    });
  }, [toast]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
      );
    }

    if (loadError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loadError}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="mt-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Alert>
      );
    }

    if (resource.type === 'video' && resource.embedType === 'youtube' && resource.url) {
      const videoId = resource.url.split('v=')[1];
      return (
        <div className="space-y-4">
          <div className="aspect-video w-full">
            <iframe
              key={`video-${loadError ? 'retry' : 'initial'}`}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
              title={resource.title}
              aria-label={`YouTube video: ${resource.title}`}
              onError={() => handleError("Failed to load video")}
            />
          </div>
          {!isComplete && (
            <Button onClick={handleComplete} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      );
    }

    if ((resource.type === 'pdf' || resource.type === 'epub') && resource.url) {
      return (
        <div className="space-y-4">
          <div className="aspect-[4/3] w-full">
            <iframe
              key={`document-${loadError ? 'retry' : 'initial'}`}
              src={resource.url}
              width="100%"
              height="100%"
              className="rounded-lg border"
              title={resource.title}
              aria-label={`${resource.type.toUpperCase()} document: ${resource.title}`}
              onError={() => handleError(`Failed to load ${resource.type} document`)}
            />
          </div>
          {!isComplete && (
            <Button onClick={handleComplete} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      );
    }

    if (resource.type === 'code' && resource.code) {
      return (
        <div className="space-y-4">
          <CodeEditor
            initialValue={resource.code.initialCode}
            aria-label={`Code editor for ${resource.title}`}
          />
          <div 
            className="text-sm text-muted-foreground"
            role="complementary"
            aria-label="Test cases"
          >
            <h4 className="font-semibold mb-2">Test Cases:</h4>
            <ul className="list-disc list-inside">
              {resource.code.testCases.map((testCase, index) => (
                <li key={index}>
                  Input: {testCase.input} → Expected: {testCase.expectedOutput}
                </li>
              ))}
            </ul>
          </div>
          {!isComplete && (
            <Button onClick={handleComplete} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div 
          className="p-4 rounded-lg border"
          role="article"
          aria-label={resource.title}
        >
          <p className="text-sm text-muted-foreground">{resource.content}</p>
        </div>
        {!isComplete && (
          <Button onClick={handleComplete} className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        )}
      </div>
    );
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clear any error states when component unmounts
      setLoadError(null);
      setIsLoading(false);
    };
  }, []);

  return renderContent();
};
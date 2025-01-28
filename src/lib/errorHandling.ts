import { toast } from "@/hooks/use-toast";

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, context?: string) => {
  console.error(`Error in ${context || 'application'}:`, error);

  if (error instanceof AppError) {
    toast({
      title: `Error: ${error.code || 'Unknown Error'}`,
      description: error.message,
      variant: "destructive",
    });
    return;
  }

  if (error instanceof Error) {
    toast({
      title: "An error occurred",
      description: error.message,
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Unexpected Error",
    description: "An unexpected error occurred. Please try again.",
    variant: "destructive",
  });
};

export const validateJSON = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error, context);
    throw error;
  }
};
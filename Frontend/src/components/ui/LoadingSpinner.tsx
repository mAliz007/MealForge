// Frontend/src/components/ui/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  message = "Loading...", 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gray-50" 
    : "flex justify-center items-center h-48 text-text-muted";

  return (
    <div className={containerClasses}>
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        {message && <span className="text-sm font-medium">{message}</span>}
      </div>
    </div>
  );
}
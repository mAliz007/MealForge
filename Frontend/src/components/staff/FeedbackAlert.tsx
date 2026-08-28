import { CheckCircle, AlertCircle, X } from "lucide-react";

interface FeedbackAlertProps {
  feedback: { type: "success" | "error"; msg: string } | null;
  onClear: () => void;
}

export function FeedbackAlert({ feedback, onClear }: FeedbackAlertProps) {
  if (!feedback) return null;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border text-sm ${
        feedback.type === "success"
          ? "bg-green-500/10 border-green-500/20 text-green-600"
          : "bg-red-500/10 border-red-500/20 text-red-600"
      }`}
    >
      <div className="flex items-center gap-2">
        {feedback.type === "success" ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
        <span>{feedback.msg}</span>
      </div>
      <button onClick={onClear}>
        <X className="h-4 w-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
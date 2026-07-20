// frontend/src/components/ui/Input.tsx
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-gray-700 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 bg-white border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${
            error
              ? "border-red-500 focus:ring-red-200 text-red-900 placeholder-red-300"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100 text-gray-900 placeholder-gray-400"
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-red-600 mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
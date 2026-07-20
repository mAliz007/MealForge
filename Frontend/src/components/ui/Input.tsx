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
            /* Swapped text-gray-700 to text-muted */
            className="text-xs font-semibold text-muted uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          /* 
            Swapped bg-white -> bg-canvas
            Swapped text colors and validation focus states to track theme variables 
          */
          className={`w-full px-3 py-2 bg-canvas border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500/20 text-red-500 placeholder-red-400/50"
              : "border-structure focus:border-accent focus:ring-accent/20 text-main placeholder-text-muted/50"
          } ${className}`}
          {...props}
        />
        {error && (
          /* Made error text pop cleanly against dark and light backdrops */
          <p className="text-xs font-medium text-red-500 mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
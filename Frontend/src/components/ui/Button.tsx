import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Base structural styles with relative positioning for overlay loading state
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  // Variant color definitions using Tailwind utility classes
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    outline:
      "border border-text-muted/30 text-text-main hover:bg-text-muted/10 focus:ring-blue-500 bg-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Absolute overlay spinner keeps button dimensions fixed */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2 bg-inherit rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        </span>
      )}
      
      {/* Children content remains rendered but invisible during loading to preserve exact dimensions */}
      <span className={isLoading ? "invisible flex items-center gap-2" : "flex items-center gap-2"}>
        {children}
      </span>
    </button>
  );
}
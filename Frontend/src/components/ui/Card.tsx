// frontend/src/components/ui/Card.tsx
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-5 shadow-xs transition-all duration-200 ${
        hoverable ? "hover:shadow-md hover:border-gray-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
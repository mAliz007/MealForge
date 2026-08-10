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
      className={`bg-structure/30 border border-structure rounded-xl p-5 shadow-xs transition-all duration-200 backdrop-blur-xs ${
        hoverable ? "hover:shadow-md hover:border-structure/80" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
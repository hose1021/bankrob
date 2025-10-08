import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
      bg-white dark:bg-gray-800 
      rounded-xl shadow-xl 
      border border-gray-200 dark:border-gray-700
      p-6
      ${hover ? "hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer" : ""}
      ${className}
    `}
    >
      {children}
    </div>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/constants/theme";
import type { DifficultyLevel } from "@/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          // Variants
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400": variant === "default",
          "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300": variant === "secondary",
          "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300": variant === "outline",
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400": variant === "success",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400": variant === "warning",
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400": variant === "error",
          // Sizes
          "px-2 py-0.5 text-xs": size === "sm",
          "px-2.5 py-0.5 text-sm": size === "md",
          "px-3 py-1 text-sm": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  className,
}) => {
  const colorClass = DIFFICULTY_COLORS[difficulty];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        colorClass,
        className
      )}
    >
      {difficulty}
    </span>
  );
};

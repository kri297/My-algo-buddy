"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = cn(
    "bg-slate-200 dark:bg-slate-700",
    animation === "pulse" && "animate-pulse",
    animation === "wave" && "animate-shimmer",
    variant === "text" && "h-4 rounded",
    variant === "circular" && "rounded-full",
    variant === "rectangular" && "rounded-lg",
    className
  );

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return <div className={baseClasses} style={style} />;
};

// Pre-built skeleton layouts
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 border rounded-xl bg-white dark:bg-slate-900", className)}>
    <Skeleton variant="rectangular" className="w-12 h-12 mb-4" />
    <Skeleton className="w-3/4 mb-2" />
    <Skeleton className="w-1/2 mb-4" />
    <Skeleton className="w-full h-20" />
  </div>
);

export const ListSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 5,
  className,
}) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4" />
          <Skeleton className="w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className,
}) => (
  <div className={cn("space-y-2", className)}>
    {/* Header */}
    <div className="flex gap-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="flex-1 h-4" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-3">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="flex-1 h-4" />
        ))}
      </div>
    ))}
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" className="w-20 h-20" />
      <div className="space-y-2">
        <Skeleton className="w-40 h-6" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
    <Skeleton variant="rectangular" className="w-full h-4 rounded-full" />
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

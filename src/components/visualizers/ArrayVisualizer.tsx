"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ArrayElement } from "@/types";

interface ArrayVisualizerProps {
  data: ArrayElement[];
  maxValue?: number;
  showIndices?: boolean;
  showValues?: boolean;
  barWidth?: number;
  className?: string;
}

export function ArrayVisualizer({
  data,
  maxValue,
  showIndices = true,
  showValues = true,
  barWidth = 40,
  className,
}: ArrayVisualizerProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Calculate dynamic bar width based on number of elements
  const dynamicBarWidth = data.length > 20 ? Math.max(20, 800 / data.length) : barWidth;

  const getBarColor = (element: ArrayElement): string => {
    if (element.color) return element.color;
    if (element.isSorted) return "bg-green-500";
    if (element.isSwapping) return "bg-red-500";
    if (element.isComparing) return "bg-yellow-500";
    if (element.isHighlighted) return "bg-blue-500";
    return "bg-primary";
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 w-full", className)}>
      <div
        ref={containerRef}
        className="flex items-end justify-center gap-1 h-64 p-4 w-full overflow-x-auto"
      >
        <AnimatePresence mode="popLayout">
          {data.map((element) => (
            <motion.div
              key={element.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex flex-col items-center flex-shrink-0"
              style={{ width: dynamicBarWidth }}
            >
              {showValues && data.length <= 30 && (
                <motion.span
                  layout
                  className={cn(
                    "text-xs font-medium mb-1",
                    element.isHighlighted || element.isComparing || element.isSwapping
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {element.value}
                </motion.span>
              )}
              <motion.div
                layout
                className={cn(
                  "rounded-t-md transition-colors duration-200",
                  getBarColor(element)
                )}
                style={{
                  width: dynamicBarWidth - 4,
                  height: `${(element.value / max) * 200}px`,
                }}
                animate={{
                  scale: element.isComparing || element.isSwapping ? 1.05 : 1,
                }}
              />
              {showIndices && data.length <= 20 && (
                <span className="text-xs text-muted-foreground mt-1">
                  {element.index}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs justify-center">\n        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary rounded" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}

// Compact array display for inline visualization
export function ArrayInline({
  values,
  highlightIndices = [],
  className,
}: {
  values: (number | string)[];
  highlightIndices?: number[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="text-muted-foreground">[</span>
      {values.map((value, index) => (
        <React.Fragment key={index}>
          <span
            className={cn(
              "px-2 py-1 rounded font-mono text-sm",
              highlightIndices.includes(index)
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {value}
          </span>
          {index < values.length - 1 && (
            <span className="text-muted-foreground">,</span>
          )}
        </React.Fragment>
      ))}
      <span className="text-muted-foreground">]</span>
    </div>
  );
}

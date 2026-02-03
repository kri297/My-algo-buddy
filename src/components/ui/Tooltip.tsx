"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 200,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-700 border-l-transparent border-r-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-700 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-700 border-t-transparent border-b-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-700 border-t-transparent border-b-transparent border-l-transparent",
  };

  const motionVariants = {
    top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={motionVariants[position].initial}
            animate={motionVariants[position].animate}
            exit={motionVariants[position].initial}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-1.5 text-sm text-white bg-slate-900 dark:bg-slate-700 rounded-lg shadow-lg whitespace-nowrap",
              positionClasses[position],
              className
            )}
          >
            {content}
            <div
              className={cn(
                "absolute w-0 h-0 border-4",
                arrowClasses[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

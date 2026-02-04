"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { VISUALIZATION_COLORS } from "@/constants/theme";
import type { StackElement, QueueElement } from "@/types";

// ============== Stack Visualizer ==============

interface StackVisualizerProps {
  elements: StackElement[];
  maxSize?: number;
  className?: string;
  onElementClick?: (index: number) => void;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({
  elements,
  maxSize = 10,
  className,
  onElementClick,
}) => {
  return (
    <div className={cn("flex flex-col items-center p-4", className)}>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
        ← TOP
      </div>
      <div
        className="flex flex-col-reverse gap-1 border-2 border-slate-300 dark:border-slate-600 
                   rounded-lg p-2 min-h-[300px] w-20 relative overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          {elements.map((element, index) => {
            const colors = VISUALIZATION_COLORS[element.state];
            const isTop = index === elements.length - 1;

            return (
              <motion.div
                key={element.id}
                layout
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "w-full h-12 flex items-center justify-center rounded-md",
                  "font-semibold text-lg cursor-pointer transition-colors",
                  colors.bg,
                  "border-2",
                  colors.border,
                  colors.text,
                  isTop && "ring-2 ring-blue-500 ring-offset-1"
                )}
                onClick={() => onElementClick?.(index)}
                whileHover={{ scale: 1.05 }}
              >
                {element.value}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, maxSize - elements.length) }).map(
          (_, i) => (
            <div
              key={`empty-${i}`}
              className="w-full h-12 border-2 border-dashed border-slate-200 
                        dark:border-slate-700 rounded-md"
            />
          )
        )}
      </div>
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
        BOTTOM →
      </div>
    </div>
  );
};

// ============== Queue Visualizer ==============

interface QueueVisualizerProps {
  elements: QueueElement[];
  maxSize?: number;
  className?: string;
  onElementClick?: (index: number) => void;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  elements,
  maxSize = 10,
  className,
  onElementClick,
}) => {
  return (
    <div className={cn("flex flex-col items-center p-4", className)}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-sm font-medium text-green-600 dark:text-green-400">
          ← DEQUEUE (Front)
        </div>
        <div className="flex-1" />
        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
          ENQUEUE (Rear) →
        </div>
      </div>
      
      <div
        className="flex gap-1 border-2 border-slate-300 dark:border-slate-600 
                   rounded-lg p-2 min-w-[400px] h-20 items-center overflow-x-auto"
      >
        <AnimatePresence mode="popLayout">
          {elements.map((element, index) => {
            const colors = VISUALIZATION_COLORS[element.state];
            const isFront = index === 0;
            const isRear = index === elements.length - 1;

            return (
              <motion.div
                key={element.id}
                layout
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-md",
                  "font-semibold text-lg cursor-pointer transition-colors",
                  colors.bg,
                  "border-2",
                  colors.border,
                  colors.text,
                  isFront && "ring-2 ring-green-500 ring-offset-1",
                  isRear && !isFront && "ring-2 ring-blue-500 ring-offset-1"
                )}
                onClick={() => onElementClick?.(index)}
                whileHover={{ scale: 1.05 }}
              >
                {element.value}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, maxSize - elements.length) }).map(
          (_, i) => (
            <div
              key={`empty-${i}`}
              className="w-14 h-14 flex-shrink-0 border-2 border-dashed 
                        border-slate-200 dark:border-slate-700 rounded-md"
            />
          )
        )}
      </div>

      <div className="flex gap-8 mt-4 text-xs text-slate-500 dark:text-slate-400">
        <span>Front: {elements.length > 0 ? elements[0].value : "Empty"}</span>
        <span>
          Rear:{" "}
          {elements.length > 0 ? elements[elements.length - 1].value : "Empty"}
        </span>
        <span>Size: {elements.length}</span>
      </div>
    </div>
  );
};

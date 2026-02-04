"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LinkedListNode } from "@/types";

interface LinkedListVisualizerProps {
  nodes: Map<string, LinkedListNode>;
  headId: string | null;
  isDoublyLinked?: boolean;
  className?: string;
}

export function LinkedListVisualizer({
  nodes,
  headId,
  isDoublyLinked = false,
  className,
}: LinkedListVisualizerProps) {
  const orderedNodes: LinkedListNode[] = [];
  let currentId = headId;
  
  while (currentId && nodes.has(currentId)) {
    const node = nodes.get(currentId)!;
    orderedNodes.push(node);
    currentId = node.next;
  }

  return (
    <div className={cn("flex flex-col items-center gap-4 p-8 overflow-x-auto", className)}>
      <div className="flex items-center gap-0">
        <AnimatePresence mode="popLayout">
          {orderedNodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex items-center"
              >
                {/* Node */}
                <div
                  className={cn(
                    "relative flex items-center border-2 rounded-lg overflow-hidden",
                    node.isHighlighted ? "border-primary shadow-lg" : "border-border",
                    node.isHead && "ring-2 ring-green-500 ring-offset-2",
                    node.isTail && "ring-2 ring-red-500 ring-offset-2"
                  )}
                >
                  {/* Value section */}
                  <div
                    className={cn(
                      "px-4 py-3 min-w-[60px] text-center font-mono font-bold",
                      node.isHighlighted ? "bg-primary text-primary-foreground" : "bg-card"
                    )}
                  >
                    {node.value}
                  </div>
                  
                  {/* Next pointer section */}
                  <div className="px-3 py-3 bg-muted border-l text-xs text-muted-foreground">
                    next
                  </div>

                  {/* Labels */}
                  {node.isHead && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-green-600">
                      HEAD
                    </span>
                  )}
                  {node.isTail && (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-red-600">
                      TAIL
                    </span>
                  )}
                </div>

                {/* Arrow to next node */}
                {node.next && (
                  <div className="flex items-center">
                    <motion.div
                      layout
                      className="w-8 h-0.5 bg-border"
                    />
                    <motion.div
                      layout
                      className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-border"
                    />
                    {isDoublyLinked && (
                      <>
                        <motion.div
                          layout
                          className="absolute -bottom-3 w-8 h-0.5 bg-border"
                        />
                        <motion.div
                          layout
                          className="absolute -bottom-3 left-0 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-border"
                        />
                      </>
                    )}
                  </div>
                )}

                {/* NULL pointer for tail */}
                {!node.next && (
                  <div className="flex items-center ml-2">
                    <div className="w-4 h-0.5 bg-border" />
                    <span className="text-xs text-muted-foreground ml-1">NULL</span>
                  </div>
                )}
              </motion.div>
            </React.Fragment>
          ))}
        </AnimatePresence>

        {orderedNodes.length === 0 && (
          <div className="text-muted-foreground italic">Empty list</div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-green-500" />
          <span>Head</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-red-500" />
          <span>Tail</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}

// Stack visualization
export function StackVisualizer({
  items,
  maxSize = 10,
  className,
}: {
  items: { id: string; value: unknown; isTop: boolean; isHighlighted: boolean }[];
  maxSize?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="text-sm text-muted-foreground mb-2">
        Size: {items.length} / {maxSize}
      </div>
      
      <div className="flex flex-col-reverse gap-1 border-l-2 border-r-2 border-b-2 border-border p-2 min-h-[200px] w-32">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "px-4 py-2 rounded text-center font-mono",
                item.isTop
                  ? "bg-primary text-primary-foreground"
                  : item.isHighlighted
                  ? "bg-yellow-500 text-yellow-950"
                  : "bg-muted"
              )}
            >
              {String(item.value)}
              {item.isTop && (
                <span className="ml-2 text-xs opacity-75">← TOP</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <div className="text-muted-foreground text-sm italic text-center py-8">
            Empty Stack
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">BOTTOM</div>
    </div>
  );
}

// Queue visualization
export function QueueVisualizer({
  items,
  maxSize = 10,
  className,
}: {
  items: { id: string; value: unknown; isFront: boolean; isRear: boolean; isHighlighted: boolean }[];
  maxSize?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="text-sm text-muted-foreground">
        Size: {items.length} / {maxSize}
      </div>
      
      <div className="flex items-center gap-1">
        <div className="text-xs text-muted-foreground mr-2">FRONT →</div>
        
        <div className="flex gap-1 border-t-2 border-b-2 border-border p-2 min-w-[200px]">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                  "relative px-4 py-2 rounded text-center font-mono",
                  item.isFront
                    ? "bg-green-500 text-white"
                    : item.isRear
                    ? "bg-blue-500 text-white"
                    : item.isHighlighted
                    ? "bg-yellow-500 text-yellow-950"
                    : "bg-muted"
                )}
              >
                {String(item.value)}
                {item.isFront && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-green-600">
                    Front
                  </span>
                )}
                {item.isRear && (
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-blue-600">
                    Rear
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {items.length === 0 && (
            <div className="text-muted-foreground text-sm italic text-center py-2 w-full">
              Empty Queue
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground ml-2">← REAR</div>
      </div>
    </div>
  );
}

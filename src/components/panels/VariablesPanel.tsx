"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useVisualizationStore } from "@/store";
import { ChevronDown, ChevronUp } from "lucide-react";

interface VariablesPanelProps {
  className?: string;
}

export function VariablesPanel({ className }: VariablesPanelProps) {
  const { variables, animation } = useVisualizationStore();
  const [isExpanded, setIsExpanded] = React.useState(true);

  const currentStep = animation.history[animation.currentStep];
  const stepVariables = currentStep?.variables || variables;

  const formatValue = (value: unknown): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getTypeColor = (value: unknown): string => {
    if (value === null || value === undefined) return "text-gray-500";
    if (typeof value === "number") return "text-blue-500";
    if (typeof value === "string") return "text-green-500";
    if (typeof value === "boolean") return "text-purple-500";
    if (Array.isArray(value)) return "text-orange-500";
    return "text-yellow-500";
  };

  return (
    <div className={cn("border rounded-lg bg-card", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm">Variables</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t p-3 space-y-2 max-h-64 overflow-y-auto">
          {Object.keys(stepVariables).length === 0 ? (
            <p className="text-sm text-muted-foreground">No variables to display</p>
          ) : (
            Object.entries(stepVariables).map(([name, value]) => (
              <div
                key={name}
                className="flex items-start gap-2 p-2 bg-muted/50 rounded-md"
              >
                <span className="font-mono text-sm font-medium">{name}:</span>
                <span className={cn("font-mono text-sm", getTypeColor(value))}>
                  {formatValue(value)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Step description panel
export function StepDescriptionPanel({ className }: { className?: string }) {
  const { animation } = useVisualizationStore();
  const currentStep = animation.history[animation.currentStep];

  return (
    <div className={cn("border rounded-lg bg-card p-4", className)}>
      <h3 className="font-medium text-sm mb-2">Current Step</h3>
      <p className="text-sm text-muted-foreground">
        {currentStep?.description || "No step selected. Press Play to start."}
      </p>
      {currentStep?.action && (
        <div className="mt-2 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium inline-block">
          {currentStep.action}
        </div>
      )}
    </div>
  );
}

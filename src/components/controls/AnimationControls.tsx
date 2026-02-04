"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useVisualizationStore } from "@/store";
import type { AnimationSpeed } from "@/types";

interface AnimationControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  className?: string;
}

const speedOptions: { value: AnimationSpeed; label: string; ms: number }[] = [
  { value: "slow", label: "0.5x", ms: 1000 },
  { value: "normal", label: "1x", ms: 500 },
  { value: "fast", label: "2x", ms: 250 },
  { value: "instant", label: "4x", ms: 50 },
];

export function AnimationControls({
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  className,
}: AnimationControlsProps) {
  const { animation, setSpeed } = useVisualizationStore();
  const { isPlaying, isPaused, currentStep, totalSteps, speed } = animation;

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-card rounded-lg border", className)}>
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground min-w-[3rem]">
          {currentStep}/{totalSteps}
        </span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onReset}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          title="Step Backward"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          title="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={isPlaying && !isPaused ? onPause : onPlay}
          className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          title={isPlaying && !isPaused ? "Pause" : "Play"}
        >
          {isPlaying && !isPaused ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>

        <button
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          title="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
          className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          title="Step Forward"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Speed controls */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Speed:</span>
        <div className="flex gap-1">
          {speedOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSpeed(option.value)}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                speed === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function getSpeedMs(speed: AnimationSpeed): number {
  return speedOptions.find((s) => s.value === speed)?.ms ?? 500;
}

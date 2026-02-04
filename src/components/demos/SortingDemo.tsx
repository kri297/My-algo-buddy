"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Shuffle } from "lucide-react";
import { cn, generateRandomArray, delay, generateId } from "@/lib/utils";
import { sortingAlgorithms, getCodeByLanguage } from "@/data/algorithms";
import type { ArrayElement, ProgrammingLanguage, AnimationSpeed } from "@/types";

interface SortingDemoProps {
  algorithm?: keyof typeof sortingAlgorithms;
  initialArray?: number[];
  className?: string;
}

const speedMs: Record<AnimationSpeed, number> = {
  slow: 1000,
  medium: 700,
  normal: 500,
  fast: 200,
  instant: 50,
};

export function SortingDemo({
  algorithm = "bubbleSort",
  initialArray,
  className,
}: SortingDemoProps) {
  const [array, setArray] = useState<ArrayElement[]>(() =>
    (initialArray || generateRandomArray(10, 5, 100)).map((value, index) => ({
      id: generateId(),
      value,
      index,
      isHighlighted: false,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
    }))
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<AnimationSpeed>("normal");
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [language, setLanguage] = useState<ProgrammingLanguage>("python");
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

  const sortingRef = useRef(false);
  const pauseRef = useRef(false);

  const algorithmInfo = sortingAlgorithms[algorithm];

  const resetArray = useCallback(() => {
    sortingRef.current = false;
    pauseRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
    setHighlightedLines([]);
    setStats({ comparisons: 0, swaps: 0 });
    
    const newArray = generateRandomArray(10, 5, 100);
    setArray(
      newArray.map((value, index) => ({
        id: generateId(),
        value,
        index,
        isHighlighted: false,
        isComparing: false,
        isSwapping: false,
        isSorted: false,
      }))
    );
  }, []);

  const waitIfPaused = async () => {
    while (pauseRef.current && sortingRef.current) {
      await delay(100);
    }
  };

  const bubbleSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let step = 0;
    let comparisons = 0;
    let swaps = 0;

    setTotalSteps(n * (n - 1) / 2);

    for (let i = 0; i < n && sortingRef.current; i++) {
      for (let j = 0; j < n - i - 1 && sortingRef.current; j++) {
        await waitIfPaused();
        if (!sortingRef.current) return;

        // Highlight comparing elements
        arr[j] = { ...arr[j], isComparing: true };
        arr[j + 1] = { ...arr[j + 1], isComparing: true };
        setArray([...arr]);
        setHighlightedLines([4, 5]);
        comparisons++;
        setStats({ comparisons, swaps });
        
        await delay(speedMs[speed]);
        await waitIfPaused();
        if (!sortingRef.current) return;

        if (arr[j].value > arr[j + 1].value) {
          // Swap
          arr[j] = { ...arr[j], isSwapping: true, isComparing: false };
          arr[j + 1] = { ...arr[j + 1], isSwapping: true, isComparing: false };
          setArray([...arr]);
          setHighlightedLines([6, 7]);
          
          await delay(speedMs[speed]);
          
          const temp = arr[j];
          arr[j] = { ...arr[j + 1], index: j };
          arr[j + 1] = { ...temp, index: j + 1 };
          swaps++;
          setStats({ comparisons, swaps });
        }

        // Reset states
        arr[j] = { ...arr[j], isComparing: false, isSwapping: false };
        arr[j + 1] = { ...arr[j + 1], isComparing: false, isSwapping: false };
        setArray([...arr]);
        setCurrentStep(++step);
      }
      
      // Mark as sorted
      arr[n - i - 1] = { ...arr[n - i - 1], isSorted: true };
      setArray([...arr]);
    }

    // Mark all as sorted
    setArray(arr.map((el) => ({ ...el, isSorted: true })));
    setIsPlaying(false);
    sortingRef.current = false;
  }, [array, speed]);

  const startSorting = useCallback(() => {
    if (isPaused) {
      pauseRef.current = false;
      setIsPaused(false);
      return;
    }

    sortingRef.current = true;
    pauseRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);

    switch (algorithm) {
      case "bubbleSort":
        bubbleSort();
        break;
      default:
        bubbleSort();
    }
  }, [algorithm, bubbleSort, isPaused]);

  const pauseSorting = useCallback(() => {
    pauseRef.current = true;
    setIsPaused(true);
  }, []);

  const stopSorting = useCallback(() => {
    sortingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const maxValue = Math.max(...array.map((el) => el.value));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Algorithm Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{algorithmInfo.name}</h3>
          <p className="text-sm text-muted-foreground">{algorithmInfo.description}</p>
        </div>
        <div className="text-right text-sm">
          <div>Time: <span className="font-mono">{algorithmInfo.timeComplexity.average}</span></div>
          <div>Space: <span className="font-mono">{algorithmInfo.spaceComplexity}</span></div>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex items-end justify-center gap-1 h-64 p-4 bg-muted/30 rounded-lg">
        <AnimatePresence mode="popLayout">
          {array.map((element) => (
            <motion.div
              key={element.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex flex-col items-center"
              style={{ width: 40 }}
            >
              <span
                className={cn(
                  "text-xs font-medium mb-1 transition-colors",
                  element.isComparing || element.isSwapping
                    ? "text-foreground font-bold"
                    : "text-muted-foreground"
                )}
              >
                {element.value}
              </span>
              <motion.div
                layout
                className={cn(
                  "w-8 rounded-t-md transition-colors duration-200",
                  element.isSorted
                    ? "bg-green-500"
                    : element.isSwapping
                    ? "bg-red-500"
                    : element.isComparing
                    ? "bg-yellow-500"
                    : "bg-primary"
                )}
                style={{
                  height: `${(element.value / maxValue) * 200}px`,
                }}
                animate={{
                  scale: element.isComparing || element.isSwapping ? 1.05 : 1,
                }}
              />
              <span className="text-xs text-muted-foreground mt-1">
                {element.index}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={resetArray}
            disabled={isPlaying && !isPaused}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title="Reset"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={isPlaying && !isPaused ? pauseSorting : startSorting}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            title={isPlaying && !isPaused ? "Pause" : "Play"}
          >
            {isPlaying && !isPaused ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={stopSorting}
            disabled={!isPlaying}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title="Stop"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Speed:</span>
          {(["slow", "normal", "fast", "instant"] as AnimationSpeed[]).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                "px-2 py-1 text-xs rounded-md transition-colors",
                speed === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {s === "slow" ? "0.5x" : s === "normal" ? "1x" : s === "fast" ? "2x" : "4x"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          Comparisons: <span className="font-mono font-bold">{stats.comparisons}</span>
        </div>
        <div>
          Swaps: <span className="font-mono font-bold">{stats.swaps}</span>
        </div>
        <div>
          Step: <span className="font-mono font-bold">{currentStep}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
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

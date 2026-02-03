"use client";

import React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

interface SplitLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  defaultLeftSize?: number;
  minLeftSize?: number;
  minRightSize?: number;
  className?: string;
  direction?: "horizontal" | "vertical";
}

export function SplitLayout({
  leftPanel,
  rightPanel,
  leftTitle,
  rightTitle,
  defaultLeftSize = 50,
  minLeftSize = 20,
  minRightSize = 20,
  className,
  direction = "horizontal",
}: SplitLayoutProps) {
  return (
    <Group
      orientation={direction}
      className={cn("min-h-[400px] rounded-lg border", className)}
    >
      <Panel defaultSize={defaultLeftSize} minSize={minLeftSize}>
        <div className="flex flex-col h-full">
          {leftTitle && (
            <div className="px-4 py-2 border-b bg-muted/50 font-medium text-sm">
              {leftTitle}
            </div>
          )}
          <div className="flex-1 overflow-auto">{leftPanel}</div>
        </div>
      </Panel>
      
      <Separator className="w-2 bg-slate-200 dark:bg-slate-700 hover:bg-blue-500 transition-colors" />
      
      <Panel defaultSize={100 - defaultLeftSize} minSize={minRightSize}>
        <div className="flex flex-col h-full">
          {rightTitle && (
            <div className="px-4 py-2 border-b bg-muted/50 font-medium text-sm">
              {rightTitle}
            </div>
          )}
          <div className="flex-1 overflow-auto">{rightPanel}</div>
        </div>
      </Panel>
    </Group>
  );
}

// Three panel layout for visualization + code + variables
interface TriplePanelLayoutProps {
  visualPanel: React.ReactNode;
  codePanel: React.ReactNode;
  infoPanel: React.ReactNode;
  className?: string;
}

export function TriplePanelLayout({
  visualPanel,
  codePanel,
  infoPanel,
  className,
}: TriplePanelLayoutProps) {
  return (
    <Group
      orientation="horizontal"
      className={cn("min-h-[500px] rounded-lg border", className)}
    >
      {/* Visualization panel */}
      <Panel defaultSize={45} minSize={30}>
        <div className="flex flex-col h-full">
          <div className="px-4 py-2 border-b bg-muted/50 font-medium text-sm">
            Visualization
          </div>
          <div className="flex-1 overflow-auto p-4">{visualPanel}</div>
        </div>
      </Panel>
      
      <Separator className="w-2 bg-slate-200 dark:bg-slate-700 hover:bg-blue-500 transition-colors" />
      
      {/* Code panel */}
      <Panel defaultSize={35} minSize={25}>
        <div className="flex flex-col h-full">
          <div className="px-4 py-2 border-b bg-muted/50 font-medium text-sm">
            Code
          </div>
          <div className="flex-1 overflow-hidden">{codePanel}</div>
        </div>
      </Panel>
      
      <Separator className="w-2 bg-slate-200 dark:bg-slate-700 hover:bg-blue-500 transition-colors" />
      
      {/* Info panel */}
      <Panel defaultSize={20} minSize={15}>
        <div className="flex flex-col h-full">
          <div className="px-4 py-2 border-b bg-muted/50 font-medium text-sm">
            Info
          </div>
          <div className="flex-1 overflow-auto p-4">{infoPanel}</div>
        </div>
      </Panel>
    </Group>
  );
}

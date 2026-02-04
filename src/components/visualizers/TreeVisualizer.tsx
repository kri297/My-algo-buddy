"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import type { TreeNode } from "@/types";

interface TreeVisualizerProps {
  nodes: Map<string, TreeNode>;
  rootId: string | null;
  width?: number;
  height?: number;
  className?: string;
}

interface D3TreeNode {
  id: string;
  value: number;
  isHighlighted: boolean;
  isVisited: boolean;
  children?: D3TreeNode[];
}

export function TreeVisualizer({
  nodes,
  rootId,
  width = 600,
  height = 400,
  className,
}: TreeVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Convert flat node map to hierarchical structure
  const buildTree = (nodeId: string | null): D3TreeNode | null => {
    if (!nodeId || !nodes.has(nodeId)) return null;
    
    const node = nodes.get(nodeId)!;
    const children: D3TreeNode[] = [];
    
    if (node.left) {
      const leftChild = buildTree(node.left);
      if (leftChild) children.push(leftChild);
    }
    if (node.right) {
      const rightChild = buildTree(node.right);
      if (rightChild) children.push(rightChild);
    }

    return {
      id: node.id,
      value: node.value,
      isHighlighted: node.isHighlighted,
      isVisited: node.isVisited,
      children: children.length > 0 ? children : undefined,
    };
  };

  useEffect(() => {
    if (!svgRef.current || !rootId) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const treeData = buildTree(rootId);
    if (!treeData) return;

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<D3TreeNode>().size([innerWidth, innerHeight]);
    const treeNodes = treeLayout(root);

    // Draw links
    g.selectAll(".link")
      .data(treeNodes.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .linkVertical<d3.HierarchyPointLink<D3TreeNode>, d3.HierarchyPointNode<D3TreeNode>>()
          .x((d) => d.x)
          .y((d) => d.y)
      );

    // Draw nodes
    const nodeGroups = g
      .selectAll(".node")
      .data(treeNodes.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Node circles
    nodeGroups
      .append("circle")
      .attr("r", 25)
      .attr("fill", (d) => {
        if (d.data.isHighlighted) return "#3b82f6";
        if (d.data.isVisited) return "#22c55e";
        return "#1e293b";
      })
      .attr("stroke", (d) => (d.data.isHighlighted ? "#60a5fa" : "#475569"))
      .attr("stroke-width", (d) => (d.data.isHighlighted ? 3 : 2));

    // Node labels
    nodeGroups
      .append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text((d) => d.data.value);

  }, [nodes, rootId, width, height]);

  if (!rootId) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <p className="text-muted-foreground italic">Empty tree</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-auto", className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto"
      />
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600" />
          <span>Default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-400" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span>Visited</span>
        </div>
      </div>
    </div>
  );
}

// Binary Heap Visualizer (array-based tree representation)
export function HeapVisualizer({
  values,
  highlightIndices = [],
  isMaxHeap = true,
  className,
}: {
  values: number[];
  highlightIndices?: number[];
  isMaxHeap?: boolean;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 600;
  const height = 300;

  useEffect(() => {
    if (!svgRef.current || values.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodeRadius = 22;
    const levelHeight = 60;
    
    const g = svg.append("g").attr("transform", "translate(0, 30)");

    // Calculate positions
    const positions: { x: number; y: number; value: number; index: number }[] = [];
    
    for (let i = 0; i < values.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const levelStart = Math.pow(2, level) - 1;
      const positionInLevel = i - levelStart;
      const nodesInLevel = Math.pow(2, level);
      const levelWidth = width / (nodesInLevel + 1);
      
      positions.push({
        x: levelWidth * (positionInLevel + 1),
        y: level * levelHeight,
        value: values[i],
        index: i,
      });
    }

    // Draw edges
    for (let i = 1; i < positions.length; i++) {
      const parentIdx = Math.floor((i - 1) / 2);
      g.append("line")
        .attr("x1", positions[parentIdx].x)
        .attr("y1", positions[parentIdx].y)
        .attr("x2", positions[i].x)
        .attr("y2", positions[i].y)
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 2);
    }

    // Draw nodes
    const nodeGroups = g
      .selectAll(".node")
      .data(positions)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    nodeGroups
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d) => highlightIndices.includes(d.index) ? "#3b82f6" : "#1e293b")
      .attr("stroke", (d) => highlightIndices.includes(d.index) ? "#60a5fa" : "#475569")
      .attr("stroke-width", 2);

    nodeGroups
      .append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => d.value);

    // Index labels
    nodeGroups
      .append("text")
      .attr("dy", nodeRadius + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .text((d) => `[${d.index}]`);

  }, [values, highlightIndices]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="text-sm font-medium">
        {isMaxHeap ? "Max Heap" : "Min Heap"}
      </div>
      
      {values.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground italic">
          Empty heap
        </div>
      ) : (
        <svg ref={svgRef} width={width} height={height} />
      )}

      {/* Array representation */}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-xs text-muted-foreground mr-2">Array:</span>
        {values.map((v, i) => (
          <span
            key={i}
            className={cn(
              "px-2 py-1 text-xs font-mono rounded",
              highlightIndices.includes(i)
                ? "bg-blue-500 text-white"
                : "bg-muted"
            )}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

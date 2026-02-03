"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import type { GraphNode, GraphEdge } from "@/types";

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  directed?: boolean;
  weighted?: boolean;
  className?: string;
}

export function GraphVisualizer({
  nodes,
  edges,
  width = 600,
  height = 400,
  directed = false,
  weighted = false,
  className,
}: GraphVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);

  const getNodeColor = useCallback((node: GraphNode): string => {
    if (node.isStart) return "#22c55e";
    if (node.isEnd) return "#ef4444";
    if (node.isHighlighted) return "#3b82f6";
    if (node.isVisited) return "#f59e0b";
    return "#1e293b";
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create arrow marker for directed graphs
    if (directed) {
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .append("path")
        .attr("d", "M 0,-5 L 10,0 L 0,5")
        .attr("fill", "#94a3b8");
    }

    const g = svg.append("g");

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphEdge>(edges)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    simulationRef.current = simulation;

    // Draw edges
    const link = g
      .append("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d) => (d.isHighlighted ? "#3b82f6" : "#94a3b8"))
      .attr("stroke-width", (d) => (d.isHighlighted ? 3 : 2))
      .attr("marker-end", directed ? "url(#arrowhead)" : null);

    // Edge weight labels
    const edgeLabels = weighted
      ? g
          .append("g")
          .selectAll("text")
          .data(edges)
          .enter()
          .append("text")
          .attr("font-size", "12px")
          .attr("fill", "#94a3b8")
          .attr("text-anchor", "middle")
          .text((d) => d.weight ?? "")
      : null;

    // Draw nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append("circle")
      .attr("r", 25)
      .attr("fill", getNodeColor)
      .attr("stroke", (d) => (d.isHighlighted ? "#60a5fa" : "#475569"))
      .attr("stroke-width", (d) => (d.isHighlighted ? 3 : 2));

    node
      .append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text((d) => d.value);

    // Distance labels for shortest path visualization
    node
      .filter((d) => d.distance !== undefined)
      .append("text")
      .attr("dy", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "11px")
      .text((d) => `d=${d.distance === Infinity ? "∞" : d.distance}`);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as unknown as GraphNode).x)
        .attr("y1", (d) => (d.source as unknown as GraphNode).y)
        .attr("x2", (d) => (d.target as unknown as GraphNode).x)
        .attr("y2", (d) => (d.target as unknown as GraphNode).y);

      if (edgeLabels) {
        edgeLabels
          .attr("x", (d) => ((d.source as unknown as GraphNode).x + (d.target as unknown as GraphNode).x) / 2)
          .attr("y", (d) => ((d.source as unknown as GraphNode).y + (d.target as unknown as GraphNode).y) / 2 - 5);
      }

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height, directed, weighted, getNodeColor]);

  return (
    <div className={cn("overflow-hidden", className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="mx-auto border rounded-lg bg-card"
      />
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-slate-800" />
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span>Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span>End</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span>Visited</span>
        </div>
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        Drag nodes to rearrange • Scroll to zoom
      </p>
    </div>
  );
}

// Adjacency matrix visualization
export function AdjacencyMatrix({
  nodes,
  edges,
  className,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  className?: string;
}) {
  const matrix: (number | null)[][] = Array(nodes.length)
    .fill(null)
    .map(() => Array(nodes.length).fill(null));

  const nodeIndexMap = new Map(nodes.map((n, i) => [n.id, i]));

  edges.forEach((edge) => {
    const sourceIdx = nodeIndexMap.get(edge.source as string);
    const targetIdx = nodeIndexMap.get(edge.target as string);
    if (sourceIdx !== undefined && targetIdx !== undefined) {
      matrix[sourceIdx][targetIdx] = edge.weight ?? 1;
      if (!edge.isDirected) {
        matrix[targetIdx][sourceIdx] = edge.weight ?? 1;
      }
    }
  });

  return (
    <div className={cn("overflow-auto", className)}>
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-2 border bg-muted"></th>
            {nodes.map((node) => (
              <th key={node.id} className="p-2 border bg-muted font-mono">
                {node.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {nodes.map((rowNode, i) => (
            <tr key={rowNode.id}>
              <td className="p-2 border bg-muted font-mono font-bold">
                {rowNode.value}
              </td>
              {nodes.map((_, j) => (
                <td
                  key={j}
                  className={cn(
                    "p-2 border text-center font-mono",
                    matrix[i][j] !== null ? "bg-primary/20" : ""
                  )}
                >
                  {matrix[i][j] ?? 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

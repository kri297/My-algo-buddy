"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Settings,
  ChevronDown,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ArrayVisualizer, StackVisualizer, QueueVisualizer, LinkedListVisualizer, TreeVisualizer, GraphVisualizer } from "@/components/visualizers";
import { Button } from "@/components/ui";
import { cn, generateRandomArray, delay } from "@/lib/utils";
import {
  SORTING_ALGORITHMS,
  BUBBLE_SORT_CODE,
  SELECTION_SORT_CODE,
  INSERTION_SORT_CODE,
  MERGE_SORT_CODE,
  QUICK_SORT_CODE,
  HEAP_SORT_CODE,
} from "@/constants/algorithms";
import { ANIMATION_SPEEDS } from "@/constants/theme";
import type { AnimationSpeed, Language, ArrayElement } from "@/types";

const createArrayElement = (value: number, index: number): ArrayElement => ({
  id: `element-${index}`,
  value,
  index,
  isHighlighted: false,
  isComparing: false,
  isSwapping: false,
  isSorted: false,
});

const algorithms = [
  { id: "bubbleSort", name: "Bubble Sort" },
  { id: "selectionSort", name: "Selection Sort" },
  { id: "insertionSort", name: "Insertion Sort" },
  { id: "mergeSort", name: "Merge Sort" },
  { id: "quickSort", name: "Quick Sort" },
  { id: "heapSort", name: "Heap Sort" },
];

const languages: { id: Language; name: string }[] = [
  { id: "c", name: "C" },
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
];

const codeMap: Record<string, any> = {
  bubbleSort: BUBBLE_SORT_CODE,
  selectionSort: SELECTION_SORT_CODE,
  insertionSort: INSERTION_SORT_CODE,
  mergeSort: MERGE_SORT_CODE,
  quickSort: QUICK_SORT_CODE,
  heapSort: HEAP_SORT_CODE,
};

interface HistoryStep {
  array: ArrayElement[];
  highlightedLines: number[];
  variables: Record<string, any>;
  description: string;
}

export default function VisualizePage() {
  // Get URL search params
  const [urlAlgo, setUrlAlgo] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const algo = searchParams.get('algo');
      if (algo) setUrlAlgo(algo);
    }
  }, []);

  // Use fixed initial array to avoid hydration mismatch
  const [array, setArray] = useState<ArrayElement[]>(() =>
    [42, 15, 73, 28, 91, 55, 37, 64, 19, 82].map((value, index) => createArrayElement(value, index))
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState<AnimationSpeed>("medium");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(urlAlgo || "bubbleSort");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("c");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showVariables, setShowVariables] = useState(true);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [arraySize, setArraySize] = useState(10);
  const [customInput, setCustomInput] = useState("");
  const [inputMode, setInputMode] = useState<"random" | "custom">("random");
  const [activeTab, setActiveTab] = useState<"algorithms" | "dataStructures">("algorithms");
  const [selectedDataStructure, setSelectedDataStructure] = useState<"stack" | "queue" | "linkedList" | "doubleLinkedList" | "bst" | "graph">("stack");
  
  // Data structure states
  const [stackElements, setStackElements] = useState<any[]>([]);
  const [queueElements, setQueueElements] = useState<any[]>([]);
  const [linkedListNodes, setLinkedListNodes] = useState<any[]>([]);
  const [doubleLinkedListNodes, setDoubleLinkedListNodes] = useState<any[]>([]);
  const [bstNodes, setBstNodes] = useState<any[]>([]);
  const [graphNodes, setGraphNodes] = useState<any[]>([]);
  const [graphEdges, setGraphEdges] = useState<any[]>([]);
  const [dsInputValue, setDsInputValue] = useState("");
  const [dsMessage, setDsMessage] = useState("");
  const [dsMessageType, setDsMessageType] = useState<"success" | "error" | "info">("info");
  const [dsHistory, setDsHistory] = useState<any[]>([{ stack: [], queue: [], linkedList: [], doubleLinkedList: [], bst: [], graph: { nodes: [], edges: [] }, operation: "Initial", timestamp: Date.now() }]);
  const [dsHistoryIndex, setDsHistoryIndex] = useState(0);
  const [dsMetrics, setDsMetrics] = useState({ totalOps: 0, successfulOps: 0, failedOps: 0 });
  const [dsAnimationSpeed, setDsAnimationSpeed] = useState(1000);
  const [isOperating, setIsOperating] = useState(false);
  const MAX_DS_SIZE = 8;
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [history, setHistory] = useState<HistoryStep[]>([]);
  const [canStepBack, setCanStepBack] = useState(false);
  const [canStepForward, setCanStepForward] = useState(false);
  
  const sortingRef = useRef(false);
  const audioContext = useRef<AudioContext | null>(null);

  // Generate random array after hydration to avoid mismatch
  useEffect(() => {
    setArray(generateRandomArray(10, 5, 100).map((value, index) => createArrayElement(value, index)));
  }, []);

  // Regenerate array when size changes (only for random mode)
  useEffect(() => {
    if (!isPlaying && inputMode === "random") {
      setArray(generateRandomArray(arraySize, 5, 100).map((value, index) => createArrayElement(value, index)));
    }
  }, [arraySize, isPlaying, inputMode]);

  // Update algorithm when URL param changes
  useEffect(() => {
    if (urlAlgo && urlAlgo !== selectedAlgorithm) {
      setSelectedAlgorithm(urlAlgo);
    }
  }, [urlAlgo, selectedAlgorithm]);

  useEffect(() => {
    setCanStepBack(currentStep > 0 && history.length > 0);
    setCanStepForward(currentStep < history.length - 1);
  }, [currentStep, history.length]);

  // Data Structure Helper Functions
  const showDsMessage = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    setDsMessage(msg);
    setDsMessageType(type);
    setTimeout(() => setDsMessage(""), 2500);
  }, []);

  const addToDsHistory = useCallback((operation: string) => {
    const newHistory = dsHistory.slice(0, dsHistoryIndex + 1);
    newHistory.push({
      stack: JSON.parse(JSON.stringify(stackElements)),
      queue: JSON.parse(JSON.stringify(queueElements)),
      linkedList: JSON.parse(JSON.stringify(linkedListNodes)),
      doubleLinkedList: JSON.parse(JSON.stringify(doubleLinkedListNodes)),
      bst: JSON.parse(JSON.stringify(bstNodes)),
      graph: { nodes: JSON.parse(JSON.stringify(graphNodes)), edges: JSON.parse(JSON.stringify(graphEdges)) },
      operation,
      timestamp: Date.now(),
    });
    setDsHistory(newHistory);
    setDsHistoryIndex(newHistory.length - 1);
  }, [dsHistory, dsHistoryIndex, stackElements, queueElements, linkedListNodes, doubleLinkedListNodes, bstNodes, graphNodes, graphEdges]);

  const updateDsMetrics = useCallback((success: boolean) => {
    setDsMetrics(prev => ({
      totalOps: prev.totalOps + 1,
      successfulOps: success ? prev.successfulOps + 1 : prev.successfulOps,
      failedOps: success ? prev.failedOps : prev.failedOps + 1,
    }));
  }, []);

  const undoDs = useCallback(() => {
    if (dsHistoryIndex > 0) {
      const prevState = dsHistory[dsHistoryIndex - 1];
      setStackElements(JSON.parse(JSON.stringify(prevState.stack)));
      setQueueElements(JSON.parse(JSON.stringify(prevState.queue)));
      setLinkedListNodes(JSON.parse(JSON.stringify(prevState.linkedList)));
      setDoubleLinkedListNodes(JSON.parse(JSON.stringify(prevState.doubleLinkedList || [])));
      setBstNodes(JSON.parse(JSON.stringify(prevState.bst || [])));
      setGraphNodes(JSON.parse(JSON.stringify(prevState.graph?.nodes || [])));
      setGraphEdges(JSON.parse(JSON.stringify(prevState.graph?.edges || [])));
      setDsHistoryIndex(dsHistoryIndex - 1);
      showDsMessage("↩️ Undid: " + dsHistory[dsHistoryIndex].operation, "info");
    }
  }, [dsHistory, dsHistoryIndex, showDsMessage]);

  const redoDs = useCallback(() => {
    if (dsHistoryIndex < dsHistory.length - 1) {
      const nextState = dsHistory[dsHistoryIndex + 1];
      setStackElements(JSON.parse(JSON.stringify(nextState.stack)));
      setQueueElements(JSON.parse(JSON.stringify(nextState.queue)));
      setLinkedListNodes(JSON.parse(JSON.stringify(nextState.linkedList)));
      setDoubleLinkedListNodes(JSON.parse(JSON.stringify(nextState.doubleLinkedList || [])));
      setBstNodes(JSON.parse(JSON.stringify(nextState.bst || [])));
      setGraphNodes(JSON.parse(JSON.stringify(nextState.graph?.nodes || [])));
      setGraphEdges(JSON.parse(JSON.stringify(nextState.graph?.edges || [])));
      setDsHistoryIndex(dsHistoryIndex + 1);
      showDsMessage("↪️ Redid: " + nextState.operation, "info");
    }
  }, [dsHistory, dsHistoryIndex, showDsMessage]);

  // Keyboard shortcuts for data structures
  useEffect(() => {
    if (activeTab !== "dataStructures") return;
    
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["z", "y", "r", "d"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) undoDs();
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "z")) redoDs();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") generateRandomDs();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") clearDataStructure();
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [activeTab, undoDs, redoDs]);

  const playSound = useCallback((frequency: number, duration: number = 50) => {
    if (!soundEnabled) return;
    
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration / 1000);
  }, [soundEnabled]);

  const addToHistory = useCallback((arr: ArrayElement[], lines: number[], vars: Record<string, any>, desc: string) => {
    setHistory(prev => [...prev, { array: arr.map(el => ({ ...el })), highlightedLines: lines, variables: { ...vars }, description: desc }]);
    setCurrentStep(prev => prev + 1);
  }, []);

  // Data Structure Operations
  const pushToStack = useCallback(async () => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    if (isNaN(value)) {
      showDsMessage("❌ Please enter a valid number", "error");
      updateDsMetrics(false);
      return;
    }
    if (stackElements.length >= MAX_DS_SIZE) {
      showDsMessage(`❌ Stack Overflow! Maximum size is ${MAX_DS_SIZE}`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const newElement = { id: Date.now().toString(), value, state: "new" as const };
    setStackElements(prev => [...prev, newElement]);
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.4));
    
    setStackElements(prev => prev.map((item, idx) => ({
      ...item,
      state: idx === prev.length - 1 ? "top" : "default"
    })));
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.3));
    
    showDsMessage(`✅ Pushed ${value} onto stack`, "success");
    updateDsMetrics(true);
    addToDsHistory(`Push(${value})`);
    setDsInputValue("");
    setIsOperating(false);
  }, [dsInputValue, stackElements, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const popFromStack = useCallback(async () => {
    if (isOperating || stackElements.length === 0) {
      showDsMessage("❌ Stack Underflow! Cannot pop from empty stack", "error");
      updateDsMetrics(false);
      return;
    }
    setIsOperating(true);
    const val = stackElements[stackElements.length - 1].value;
    setStackElements(prev => prev.map((item, idx) => idx === prev.length - 1 ? { ...item, state: "popping" } : item));
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.4));
    setStackElements(prev => prev.slice(0, -1));
    showDsMessage(`✅ Popped ${val} from stack`, "success");
    updateDsMetrics(true);
    addToDsHistory(`Pop() → ${val}`);
    setIsOperating(false);
  }, [stackElements, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const peekStack = useCallback(() => {
    if (stackElements.length === 0) {
      showDsMessage("❌ Stack is empty! Cannot peek", "error");
      updateDsMetrics(false);
      return;
    }
    const topValue = stackElements[stackElements.length - 1].value;
    showDsMessage(`🔍 Top element: ${topValue}`, "info");
    updateDsMetrics(true);
    addToDsHistory(`Peek() → ${topValue}`);
  }, [stackElements, showDsMessage, updateDsMetrics, addToDsHistory]);

  const enqueue = useCallback(async () => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    if (isNaN(value)) {
      showDsMessage("❌ Enter a valid number", "error");
      updateDsMetrics(false);
      return;
    }
    if (queueElements.length >= MAX_DS_SIZE) {
      showDsMessage(`❌ Queue is full! Max ${MAX_DS_SIZE} items`, "error");
      updateDsMetrics(false);
      return;
    }
    setIsOperating(true);
    const newItem = { id: Date.now().toString(), value, state: "new" };
    setQueueElements(prev => [...prev.map(q => ({ ...q, state: "default" })), newItem]);
    setDsInputValue("");
    showDsMessage(`✅ Enqueued ${value} at rear`, "success");
    updateDsMetrics(true);
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed));
    setQueueElements(prev => prev.map((item, i) => ({ 
      ...item, 
      state: prev.length === 1 ? "front" : i === 0 ? "front" : i === prev.length - 1 ? "rear" : "default" 
    })));
    addToDsHistory(`Enqueue(${value})`);
    setIsOperating(false);
  }, [dsInputValue, queueElements, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const dequeue = useCallback(async () => {
    if (isOperating || queueElements.length === 0) {
      showDsMessage("❌ Queue is empty! Nothing to dequeue", "error");
      updateDsMetrics(false);
      return;
    }
    setIsOperating(true);
    const dequeuedValue = queueElements[0].value;
    setQueueElements(prev => prev.map((item, i) => i === 0 ? { ...item, state: "dequeuing" } : item));
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.6));
    setQueueElements(prev => prev.slice(1).map((item, i, arr) => ({
      ...item,
      state: arr.length === 1 ? "front" : i === 0 ? "front" : i === arr.length - 1 ? "rear" : "default"
    })));
    showDsMessage(`✅ Dequeued ${dequeuedValue} from front`, "success");
    updateDsMetrics(true);
    addToDsHistory(`Dequeue() → ${dequeuedValue}`);
    setIsOperating(false);
  }, [queueElements, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const insertLinkedList = useCallback(async (position: "head" | "tail") => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    if (isNaN(value)) {
      showDsMessage("❌ Please enter a valid number", "error");
      updateDsMetrics(false);
      return;
    }
    if (linkedListNodes.length >= MAX_DS_SIZE) {
      showDsMessage(`❌ Linked list is full! Maximum size is ${MAX_DS_SIZE}`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const newNode = { id: Date.now().toString(), value, state: "new" as const };
    
    if (position === "head") {
      setLinkedListNodes(prev => [newNode, ...prev]);
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      setLinkedListNodes(prev => prev.map((node, i) => ({ ...node, state: i === 0 ? "default" : "default" })));
      showDsMessage(`✅ Inserted ${value} at head`, "success");
      addToDsHistory(`InsertHead(${value})`);
    } else {
      setLinkedListNodes(prev => [...prev, newNode]);
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      setLinkedListNodes(prev => prev.map(node => ({ ...node, state: "default" })));
      showDsMessage(`✅ Inserted ${value} at tail`, "success");
      addToDsHistory(`InsertTail(${value})`);
    }
    
    updateDsMetrics(true);
    setDsInputValue("");
    setIsOperating(false);
  }, [dsInputValue, linkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const deleteLinkedList = useCallback(async (position: "head" | "tail") => {
    if (isOperating || linkedListNodes.length === 0) {
      showDsMessage("❌ Linked list is empty! Nothing to delete", "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    
    if (position === "head") {
      const deleted = linkedListNodes[0];
      setLinkedListNodes(prev => prev.map((node, i) => i === 0 ? { ...node, state: "deleting" as const } : node));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      setLinkedListNodes(prev => prev.slice(1));
      showDsMessage(`✅ Deleted ${deleted.value} from head`, "success");
      addToDsHistory(`DeleteHead() → ${deleted.value}`);
    } else {
      const deleted = linkedListNodes[linkedListNodes.length - 1];
      setLinkedListNodes(prev => prev.map((node, i) => i === prev.length - 1 ? { ...node, state: "deleting" as const } : node));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      setLinkedListNodes(prev => prev.slice(0, -1));
      showDsMessage(`✅ Deleted ${deleted.value} from tail`, "success");
      addToDsHistory(`DeleteTail() → ${deleted.value}`);
    }
    
    updateDsMetrics(true);
    setIsOperating(false);
  }, [linkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const insertLinkedListAtIndex = useCallback(async () => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    const indexInput = prompt("Enter index (0 to " + linkedListNodes.length + "):");
    const index = parseInt(indexInput || "", 10);
    
    if (isNaN(value) || isNaN(index)) {
      showDsMessage("❌ Please enter valid number and index", "error");
      updateDsMetrics(false);
      return;
    }
    if (index < 0 || index > linkedListNodes.length) {
      showDsMessage(`❌ Index out of range (0-${linkedListNodes.length})`, "error");
      updateDsMetrics(false);
      return;
    }
    if (linkedListNodes.length >= MAX_DS_SIZE) {
      showDsMessage(`❌ List is full! Maximum size is ${MAX_DS_SIZE}`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const newNode = { id: Date.now().toString(), value, state: "new" as const };
    
    setLinkedListNodes(prev => {
      const updated = [...prev];
      updated.splice(index, 0, newNode);
      return updated;
    });
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    setLinkedListNodes(prev => prev.map(node => ({ ...node, state: "default" })));
    showDsMessage(`✅ Inserted ${value} at index ${index}`, "success");
    updateDsMetrics(true);
    addToDsHistory(`InsertAt(${index}, ${value})`);
    setDsInputValue("");
    setIsOperating(false);
  }, [dsInputValue, linkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const deleteLinkedListAtIndex = useCallback(async () => {
    if (isOperating || linkedListNodes.length === 0) {
      showDsMessage("❌ List is empty! Nothing to delete", "error");
      updateDsMetrics(false);
      return;
    }
    
    const indexInput = prompt("Enter index (0 to " + (linkedListNodes.length - 1) + "):");
    const index = parseInt(indexInput || "", 10);
    
    if (isNaN(index) || index < 0 || index >= linkedListNodes.length) {
      showDsMessage(`❌ Invalid index! Range: 0-${linkedListNodes.length - 1}`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const deleted = linkedListNodes[index];
    
    setLinkedListNodes(prev => prev.map((node, i) => i === index ? { ...node, state: "deleting" as const } : node));
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    setLinkedListNodes(prev => prev.filter((_, i) => i !== index));
    
    showDsMessage(`✅ Deleted ${deleted.value} from index ${index}`, "success");
    updateDsMetrics(true);
    addToDsHistory(`DeleteAt(${index}) → ${deleted.value}`);
    setIsOperating(false);
  }, [linkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  // BST Helper Functions
  const buildBST = (values: number[]) => {
    if (!values.length) return null;
    let root: any = null;
    
    const insert = (node: any, value: number): any => {
      if (!node) return { id: Date.now().toString() + Math.random(), value, left: null, right: null, state: "default" };
      if (value < node.value) node.left = insert(node.left, value);
      else node.right = insert(node.right, value);
      return node;
    };
    
    values.forEach(val => { root = insert(root, val); });
    return root;
  };

  const flattenBST = (root: any): any[] => {
    if (!root) return [];
    const result: any[] = [];
    const queue = [{ node: root, x: 200, y: 50, level: 0 }];
    
    while (queue.length) {
      const { node, x, y, level } = queue.shift()!;
      result.push({ ...node, x, y, level });
      
      const offset = 100 / (level + 1);
      if (node.left) queue.push({ node: node.left, x: x - offset, y: y + 80, level: level + 1 });
      if (node.right) queue.push({ node: node.right, x: x + offset, y: y + 80, level: level + 1 });
    }
    
    return result;
  };

  const generateRandomDs = useCallback(() => {
    const size = Math.floor(Math.random() * 4) + 3;
    if (selectedDataStructure === "stack") {
      const arr = Array.from({ length: size }, (_, i) => ({
        id: Date.now().toString() + i,
        value: Math.floor(Math.random() * 99) + 1,
        state: i === size - 1 ? "top" : "default"
      }));
      setStackElements(arr);
    } else if (selectedDataStructure === "queue") {
      const arr = Array.from({ length: size }, (_, i) => ({
        id: Date.now().toString() + i,
        value: Math.floor(Math.random() * 99) + 1,
        state: size === 1 ? "front" : i === 0 ? "front" : i === size - 1 ? "rear" : "default"
      }));
      setQueueElements(arr);
    } else if (selectedDataStructure === "linkedList") {
      const arr = Array.from({ length: size }, (_, i) => ({
        id: Date.now().toString() + i,
        value: Math.floor(Math.random() * 99) + 1,
        state: "default"
      }));
      setLinkedListNodes(arr);
    } else if (selectedDataStructure === "doubleLinkedList") {
      const arr = Array.from({ length: size }, (_, i) => ({
        id: Date.now().toString() + i,
        value: Math.floor(Math.random() * 99) + 1,
        state: "default",
        prev: i > 0 ? (Date.now().toString() + (i - 1)) : null,
        next: i < size - 1 ? (Date.now().toString() + (i + 1)) : null
      }));
      setDoubleLinkedListNodes(arr);
    } else if (selectedDataStructure === "bst") {
      const values = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
      const root = buildBST(values);
      setBstNodes(root ? flattenBST(root) : []);
    } else if (selectedDataStructure === "graph") {
      const nodeCount = Math.min(size, 6);
      const nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i.toString(),
        value: i + 1,
        x: 100 + (i % 3) * 150,
        y: 100 + Math.floor(i / 3) * 150,
        state: "default"
      }));
      const edges: any[] = [];
      for (let i = 0; i < nodeCount - 1; i++) {
        if (Math.random() > 0.3) {
          edges.push({ from: i.toString(), to: (i + 1).toString(), weight: Math.floor(Math.random() * 10) + 1 });
        }
      }
      setGraphNodes(nodes);
      setGraphEdges(edges);
    }
    showDsMessage(`🎲 Generated ${size} random elements`, "info");
    addToDsHistory(`Random(${size})`);
    updateDsMetrics(true);
  }, [selectedDataStructure, showDsMessage, addToDsHistory, updateDsMetrics]);

  const exportDataStructure = useCallback(() => {
    let data: any = [];
    if (selectedDataStructure === "stack") data = stackElements.map(item => item.value);
    else if (selectedDataStructure === "queue") data = queueElements.map(item => item.value);
    else if (selectedDataStructure === "linkedList") data = linkedListNodes.map(item => item.value);
    else if (selectedDataStructure === "doubleLinkedList") data = doubleLinkedListNodes.map(item => ({ value: item.value, prev: item.prev, next: item.next }));
    else if (selectedDataStructure === "bst") data = bstNodes.map(item => item.value);
    else if (selectedDataStructure === "graph") data = { nodes: graphNodes.map(n => n.value), edges: graphEdges };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showDsMessage("📋 Copied to clipboard!", "success");
  }, [selectedDataStructure, stackElements, queueElements, linkedListNodes, doubleLinkedListNodes, bstNodes, graphNodes, graphEdges, showDsMessage]);

  const clearDataStructure = useCallback(() => {
    if (selectedDataStructure === "stack") setStackElements([]);
    else if (selectedDataStructure === "queue") setQueueElements([]);
    else if (selectedDataStructure === "linkedList") setLinkedListNodes([]);
    else if (selectedDataStructure === "doubleLinkedList") setDoubleLinkedListNodes([]);
    else if (selectedDataStructure === "bst") setBstNodes([]);
    else if (selectedDataStructure === "graph") { setGraphNodes([]); setGraphEdges([]); }
    showDsMessage("🗑️ Cleared!", "info");
    addToDsHistory("Clear()");
  }, [selectedDataStructure, showDsMessage, addToDsHistory]);

  const checkEmpty = useCallback(() => {
    let isEmpty = false;
    if (selectedDataStructure === "stack") isEmpty = stackElements.length === 0;
    else if (selectedDataStructure === "queue") isEmpty = queueElements.length === 0;
    else if (selectedDataStructure === "linkedList") isEmpty = linkedListNodes.length === 0;
    else if (selectedDataStructure === "doubleLinkedList") isEmpty = doubleLinkedListNodes.length === 0;
    else if (selectedDataStructure === "bst") isEmpty = bstNodes.length === 0;
    else if (selectedDataStructure === "graph") isEmpty = graphNodes.length === 0;
    
    showDsMessage(isEmpty ? "✅ Yes, it's empty" : "❌ No, it's not empty", "info");
    updateDsMetrics(true);
    addToDsHistory(`isEmpty() → ${isEmpty}`);
  }, [selectedDataStructure, stackElements, queueElements, linkedListNodes, doubleLinkedListNodes, bstNodes, graphNodes, showDsMessage, updateDsMetrics, addToDsHistory]);

  const checkFull = useCallback(() => {
    let isFull = false;
    if (selectedDataStructure === "stack") isFull = stackElements.length >= MAX_DS_SIZE;
    else if (selectedDataStructure === "queue") isFull = queueElements.length >= MAX_DS_SIZE;
    else if (selectedDataStructure === "linkedList") isFull = linkedListNodes.length >= MAX_DS_SIZE;
    else if (selectedDataStructure === "doubleLinkedList") isFull = doubleLinkedListNodes.length >= MAX_DS_SIZE;
    else if (selectedDataStructure === "bst") isFull = bstNodes.length >= MAX_DS_SIZE;
    else if (selectedDataStructure === "graph") isFull = graphNodes.length >= MAX_DS_SIZE;
    
    showDsMessage(isFull ? "✅ Yes, it's full" : "❌ No, it's not full", "info");
    updateDsMetrics(true);
    addToDsHistory(`isFull() → ${isFull}`);
  }, [selectedDataStructure, stackElements, queueElements, linkedListNodes, doubleLinkedListNodes, bstNodes, graphNodes, showDsMessage, updateDsMetrics, addToDsHistory]);

  const reverseStack = useCallback(async () => {
    if (isOperating || selectedDataStructure !== "stack") return;
    if (stackElements.length === 0) {
      showDsMessage("❌ Stack is empty! Nothing to reverse", "error");
      return;
    }
    
    setIsOperating(true);
    const reversed = [...stackElements].reverse();
    setStackElements(reversed.map(item => ({ ...item, state: "default" })));
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    setStackElements(prev => prev.map((item, i) => ({ ...item, state: i === prev.length - 1 ? "top" : "default" })));
    
    showDsMessage("🔄 Stack reversed!", "success");
    updateDsMetrics(true);
    addToDsHistory("Reverse()");
    setIsOperating(false);
  }, [stackElements, selectedDataStructure, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  // Double Linked List Operations
  const insertDoubleLinkedList = useCallback(async (position: "head" | "tail") => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    if (isNaN(value)) {
      showDsMessage("❌ Please enter a valid number", "error");
      updateDsMetrics(false);
      return;
    }
    if (doubleLinkedListNodes.length >= MAX_DS_SIZE) {
      showDsMessage(`❌ List is full! Maximum size is ${MAX_DS_SIZE}`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const newNode = { 
      id: Date.now().toString(), 
      value, 
      state: "new" as const,
      prev: position === "tail" && doubleLinkedListNodes.length > 0 ? doubleLinkedListNodes[doubleLinkedListNodes.length - 1].id : null,
      next: position === "head" && doubleLinkedListNodes.length > 0 ? doubleLinkedListNodes[0].id : null
    };
    
    if (position === "head") {
      setDoubleLinkedListNodes(prev => {
        const updated = [newNode, ...prev];
        if (updated.length > 1) updated[1].prev = newNode.id;
        return updated;
      });
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      showDsMessage(`✅ Inserted ${value} at head`, "success");
      addToDsHistory(`InsertHead(${value})`);
    } else {
      setDoubleLinkedListNodes(prev => {
        const updated = [...prev, newNode];
        if (updated.length > 1) updated[updated.length - 2].next = newNode.id;
        return updated;
      });
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      showDsMessage(`✅ Inserted ${value} at tail`, "success");
      addToDsHistory(`InsertTail(${value})`);
    }
    
    updateDsMetrics(true);
    setDsInputValue("");
    setIsOperating(false);
  }, [dsInputValue, doubleLinkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const deleteDoubleLinkedList = useCallback(async (position: "head" | "tail") => {
    if (isOperating || doubleLinkedListNodes.length === 0) {
      showDsMessage("❌ List is empty! Nothing to delete", "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    
    if (position === "head") {
      const deleted = doubleLinkedListNodes[0];
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      setDoubleLinkedListNodes(prev => {
        const updated = prev.slice(1);
        if (updated.length > 0) updated[0].prev = null;
        return updated;
      });
      showDsMessage(`✅ Deleted ${deleted.value} from head`, "success");
      addToDsHistory(`DeleteHead() → ${deleted.value}`);
    } else {
      const deleted = doubleLinkedListNodes[doubleLinkedListNodes.length - 1];
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      setDoubleLinkedListNodes(prev => {
        const updated = prev.slice(0, -1);
        if (updated.length > 0) updated[updated.length - 1].next = null;
        return updated;
      });
      showDsMessage(`✅ Deleted ${deleted.value} from tail`, "success");
      addToDsHistory(`DeleteTail() → ${deleted.value}`);
    }
    
    updateDsMetrics(true);
    setIsOperating(false);
  }, [doubleLinkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const insertDoubleLinkedListAtIndex = useCallback(async () => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    const indexInput = prompt("Enter index (0 to " + doubleLinkedListNodes.length + "):");
    const index = parseInt(indexInput || "", 10);
    
    if (isNaN(value) || isNaN(index)) {
      showDsMessage("❌ Please enter valid number and index", "error");
      updateDsMetrics(false);
      return;
    }
    if (index < 0 || index > doubleLinkedListNodes.length) {
      showDsMessage(`❌ Index out of range (0-${doubleLinkedListNodes.length})`, "error");
      updateDsMetrics(false);
      return;
    }
    if (doubleLinkedListNodes.length >= MAX_DS_SIZE) {
      showDsMessage(`❌ List is full! Maximum size is ${MAX_DS_SIZE}`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const newNode = { 
      id: Date.now().toString(), 
      value, 
      state: "new" as const,
      prev: index > 0 ? doubleLinkedListNodes[index - 1]?.id : null,
      next: index < doubleLinkedListNodes.length ? doubleLinkedListNodes[index]?.id : null
    };
    
    setDoubleLinkedListNodes(prev => {
      const updated = [...prev];
      updated.splice(index, 0, newNode);
      // Update pointers
      if (index > 0) updated[index - 1].next = newNode.id;
      if (index < updated.length - 1) updated[index + 1].prev = newNode.id;
      return updated;
    });
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    setDoubleLinkedListNodes(prev => prev.map(node => ({ ...node, state: "default" })));
    showDsMessage(`✅ Inserted ${value} at index ${index}`, "success");
    updateDsMetrics(true);
    addToDsHistory(`InsertAt(${index}, ${value})`);
    setDsInputValue("");
    setIsOperating(false);
  }, [dsInputValue, doubleLinkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const deleteDoubleLinkedListAtIndex = useCallback(async () => {
    if (isOperating || doubleLinkedListNodes.length === 0) {
      showDsMessage("❌ List is empty! Nothing to delete", "error");
      updateDsMetrics(false);
      return;
    }
    
    const indexInput = prompt("Enter index (0 to " + (doubleLinkedListNodes.length - 1) + "):");
    const index = parseInt(indexInput || "", 10);
    
    if (isNaN(index) || index < 0 || index >= doubleLinkedListNodes.length) {
      showDsMessage(`❌ Invalid index! Range: 0-${doubleLinkedListNodes.length - 1}`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const deleted = doubleLinkedListNodes[index];
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    setDoubleLinkedListNodes(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Update pointers
      if (index > 0 && index < prev.length) {
        if (updated[index - 1]) updated[index - 1].next = updated[index]?.id || null;
      }
      if (index < prev.length - 1 && index > 0) {
        if (updated[index]) updated[index].prev = updated[index - 1]?.id || null;
      }
      return updated;
    });
    
    showDsMessage(`✅ Deleted ${deleted.value} from index ${index}`, "success");
    updateDsMetrics(true);
    addToDsHistory(`DeleteAt(${index}) → ${deleted.value}`);
    setIsOperating(false);
  }, [doubleLinkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  // BST Operations
  const insertBST = useCallback(async () => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    if (isNaN(value)) {
      showDsMessage("❌ Please enter a valid number", "error");
      updateDsMetrics(false);
      return;
    }
    
    if (bstNodes.some(n => n.value === value)) {
      showDsMessage("❌ Value already exists in BST!", "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    
    // If empty tree, just insert root
    if (bstNodes.length === 0) {
      showDsMessage(`🌱 Starting new BST with root ${value}`, "success");
      const newRoot = { id: Date.now().toString(), value, left: null, right: null, state: "new", x: 200, y: 50, level: 0 };
      setBstNodes([newRoot]);
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 1.5));
      setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
      updateDsMetrics(true);
      addToDsHistory(`Insert(${value})`);
      setDsInputValue("");
      setIsOperating(false);
      return;
    }
    
    // Rebuild tree with animation showing the path
    showDsMessage(`🔍 Finding position for ${value}...`, "info");
    
    // Animate traversal path
    const values = bstNodes.map(n => n.value);
    let currentVal = values[0]; // root
    let path = [currentVal];
    
    // Find path to insertion
    let tempRoot: any = { value: values[0], left: null, right: null };
    const buildTree = (node: any, vals: number[]) => {
      vals.forEach(v => {
        let curr = node;
        while (true) {
          if (v < curr.value) {
            if (!curr.left) { curr.left = { value: v, left: null, right: null }; break; }
            curr = curr.left;
          } else {
            if (!curr.right) { curr.right = { value: v, left: null, right: null }; break; }
            curr = curr.right;
          }
        }
      });
    };
    buildTree(tempRoot, values.slice(1));
    
    // Find insertion path for new value
    let curr = tempRoot;
    while (true) {
      if (value < curr.value) {
        await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.8));
        setBstNodes(prev => prev.map(n => 
          n.value === curr.value ? { ...n, state: "current" } : { ...n, state: "default" }
        ));
        showDsMessage(`💭 ${value} < ${curr.value}, go LEFT`, "info");
        
        if (!curr.left) {
          path.push(value);
          break;
        }
        path.push(curr.left.value);
        curr = curr.left;
      } else {
        await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.8));
        setBstNodes(prev => prev.map(n => 
          n.value === curr.value ? { ...n, state: "current" } : { ...n, state: "default" }
        ));
        showDsMessage(`💭 ${value} > ${curr.value}, go RIGHT`, "info");
        
        if (!curr.right) {
          path.push(value);
          break;
        }
        path.push(curr.right.value);
        curr = curr.right;
      }
    }
    
    // Insert and rebuild
    values.push(value);
    const root = buildBST(values);
    const newNodes = root ? flattenBST(root) : [];
    
    // Mark new node
    setBstNodes(newNodes.map(n => 
      n.value === value ? { ...n, state: "new" } : { ...n, state: "visited" }
    ));
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 1.5));
    showDsMessage(`✅ Inserted ${value} successfully!`, "success");
    
    // Reset states
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    
    updateDsMetrics(true);
    addToDsHistory(`Insert(${value})`);
    setDsInputValue("");
    setIsOperating(false);
  }, [dsInputValue, bstNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const searchBST = useCallback(async () => {
    if (isOperating || bstNodes.length === 0) return;
    
    const input = prompt("Enter value to search:");
    const value = parseInt(input || "", 10);
    
    if (isNaN(value)) {
      showDsMessage("❌ Please enter a valid number", "error");
      return;
    }
    
    setIsOperating(true);
    showDsMessage(`🔍 Searching for ${value}...`, "info");
    
    // Start from root
    const values = bstNodes.map(n => n.value).sort((a, b) => a - b);
    let currentVal = values[0];
    
    // Rebuild tree to traverse
    let tempRoot: any = { value: values[0], left: null, right: null };
    const buildTree = (node: any, vals: number[]) => {
      vals.forEach(v => {
        let curr = node;
        while (true) {
          if (v < curr.value) {
            if (!curr.left) { curr.left = { value: v, left: null, right: null }; break; }
            curr = curr.left;
          } else if (v > curr.value) {
            if (!curr.right) { curr.right = { value: v, left: null, right: null }; break; }
            curr = curr.right;
          } else break;
        }
      });
    };
    buildTree(tempRoot, values.slice(1));
    
    // Search with animation
    let curr = tempRoot;
    let found = false;
    let steps = 0;
    
    while (curr) {
      steps++;
      setBstNodes(prev => prev.map(n => 
        n.value === curr.value ? { ...n, state: "current" } : { ...n, state: "visited" }
      ));
      
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed));
      
      if (value === curr.value) {
        showDsMessage(`🎉 Found ${value}! (${steps} steps)`, "success");
        setBstNodes(prev => prev.map(n => 
          n.value === value ? { ...n, state: "found" } : { ...n, state: "default" }
        ));
        found = true;
        break;
      } else if (value < curr.value) {
        showDsMessage(`💭 ${value} < ${curr.value}, go LEFT`, "info");
        curr = curr.left;
      } else {
        showDsMessage(`💭 ${value} > ${curr.value}, go RIGHT`, "info");
        curr = curr.right;
      }
    }
    
    if (!found) {
      showDsMessage(`❌ ${value} not found (searched ${steps} nodes)`, "error");
      setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    } else {
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 2));
      setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    }
    
    updateDsMetrics(true);
    addToDsHistory(`Search(${value}) → ${found}`);
    setIsOperating(false);
  }, [bstNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  // BST Traversals
  const inorderTraversal = useCallback(async () => {
    if (bstNodes.length === 0 || isOperating) {
      showDsMessage("❌ BST is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    showDsMessage("🔄 Inorder: Left → Root → Right", "info");
    
    const result: number[] = [];
    
    const traverse = async (node: any): Promise<void> => {
      if (!node) return;
      
      // Traverse left subtree
      if (node.left) {
        const leftNode = bstNodes.find(n => n.id === node.left?.id);
        await traverse(leftNode);
      }
      
      // Visit current node
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "current" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.8));
      
      result.push(node.value);
      showDsMessage(`➕ Visiting: ${node.value} → [${result.join(', ')}]`, "info");
      
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "visited" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      
      // Traverse right subtree
      if (node.right) {
        const rightNode = bstNodes.find(n => n.id === node.right?.id);
        await traverse(rightNode);
      }
    };
    
    if (bstNodes.length > 0) {
      await traverse(bstNodes[0]);
    }
    
    // Highlight all and show final result
    setBstNodes(prev => prev.map(n => ({ ...n, state: "found" })));
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 1.5));
    showDsMessage(`✅ Inorder Result: [${result.join(', ')}]`, "success");
    
    // Reset
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed));
    setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    
    addToDsHistory(`Inorder() → [${result.join(', ')}]`);
    setIsOperating(false);
  }, [bstNodes, isOperating, dsAnimationSpeed, showDsMessage, addToDsHistory]);

  const preorderTraversal = useCallback(async () => {
    if (bstNodes.length === 0 || isOperating) {
      showDsMessage("❌ BST is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    showDsMessage("🔄 Preorder: Root → Left → Right", "info");
    
    const result: number[] = [];
    
    const traverse = async (node: any): Promise<void> => {
      if (!node) return;
      
      // Visit current node first
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "current" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.8));
      
      result.push(node.value);
      showDsMessage(`➕ Visiting: ${node.value} → [${result.join(', ')}]`, "info");
      
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "visited" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
      
      // Traverse left subtree
      if (node.left) {
        const leftNode = bstNodes.find(n => n.id === node.left?.id);
        await traverse(leftNode);
      }
      
      // Traverse right subtree
      if (node.right) {
        const rightNode = bstNodes.find(n => n.id === node.right?.id);
        await traverse(rightNode);
      }
    };
    
    if (bstNodes.length > 0) {
      await traverse(bstNodes[0]);
    }
    
    // Highlight all and show final result
    setBstNodes(prev => prev.map(n => ({ ...n, state: "found" })));
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 1.5));
    showDsMessage(`✅ Preorder Result: [${result.join(', ')}]`, "success");
    
    // Reset
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed));
    setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    
    addToDsHistory(`Preorder() → [${result.join(', ')}]`);
    setIsOperating(false);
  }, [bstNodes, isOperating, dsAnimationSpeed, showDsMessage, addToDsHistory]);

  const postorderTraversal = useCallback(async () => {
    if (bstNodes.length === 0 || isOperating) {
      showDsMessage("❌ BST is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    showDsMessage("🔄 Postorder: Left → Right → Root", "info");
    
    const result: number[] = [];
    
    const traverse = async (node: any): Promise<void> => {
      if (!node) return;
      
      // Traverse left subtree
      if (node.left) {
        const leftNode = bstNodes.find(n => n.id === node.left?.id);
        await traverse(leftNode);
      }
      
      // Traverse right subtree
      if (node.right) {
        const rightNode = bstNodes.find(n => n.id === node.right?.id);
        await traverse(rightNode);
      }
      
      // Visit current node last
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "current" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.8));
      
      result.push(node.value);
      showDsMessage(`➕ Visiting: ${node.value} → [${result.join(', ')}]`, "info");
      
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "visited" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    };
    
    if (bstNodes.length > 0) {
      await traverse(bstNodes[0]);
    }
    
    // Highlight all and show final result
    setBstNodes(prev => prev.map(n => ({ ...n, state: "found" })));
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 1.5));
    showDsMessage(`✅ Postorder Result: [${result.join(', ')}]`, "success");
    
    // Reset
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed));
    setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    
    addToDsHistory(`Postorder() → [${result.join(', ')}]`);
    setIsOperating(false);
  }, [bstNodes, isOperating, dsAnimationSpeed, showDsMessage, addToDsHistory]);

  const levelOrderTraversal = useCallback(async () => {
    if (bstNodes.length === 0 || isOperating) {
      showDsMessage("❌ BST is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    showDsMessage("🔄 Level Order: Level by Level (BFS)", "info");
    
    const result: number[] = [];
    const nodesByLevel = bstNodes.sort((a, b) => a.level - b.level);
    
    for (let i = 0; i < nodesByLevel.length; i++) {
      const node = nodesByLevel[i];
      
      // Highlight current node
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "current" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.8));
      
      result.push(node.value);
      showDsMessage(`➕ Level ${node.level}: ${node.value} → [${result.join(', ')}]`, "info");
      
      setBstNodes(prev => prev.map(n => 
        n.value === node.value ? { ...n, state: "visited" } : n
      ));
      await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    }
    
    // Highlight all and show final result
    setBstNodes(prev => prev.map(n => ({ ...n, state: "found" })));
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 1.5));
    showDsMessage(`✅ Level Order Result: [${result.join(', ')}]`, "success");
    
    // Reset
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed));
    setBstNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    
    addToDsHistory(`LevelOrder() → [${result.join(', ')}]`);
    setIsOperating(false);
  }, [bstNodes, isOperating, dsAnimationSpeed, showDsMessage, addToDsHistory]);

  const findMinMaxBST = useCallback((type: "min" | "max") => {
    if (bstNodes.length === 0) {
      showDsMessage("❌ BST is empty!", "error");
      return;
    }
    
    const value = type === "min" ? Math.min(...bstNodes.map(n => n.value)) : Math.max(...bstNodes.map(n => n.value));
    showDsMessage(`${type === "min" ? "🔽" : "🔼"} ${type.toUpperCase()}: ${value}`, "info");
    addToDsHistory(`Find${type === "min" ? "Min" : "Max"}() → ${value}`);
  }, [bstNodes, showDsMessage, addToDsHistory]);

  const getHeightBST = useCallback(() => {
    if (bstNodes.length === 0) {
      showDsMessage("❌ BST is empty!", "error");
      return;
    }
    
    const maxLevel = Math.max(...bstNodes.map(n => n.level || 0));
    showDsMessage(`📏 Height: ${maxLevel + 1}`, "info");
    addToDsHistory(`Height() → ${maxLevel + 1}`);
  }, [bstNodes, showDsMessage, addToDsHistory]);

  // Linked List Additional Operations
  const reverseLinkedList = useCallback(async () => {
    if (isOperating || linkedListNodes.length === 0) {
      showDsMessage("❌ List is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    const reversed = [...linkedListNodes].reverse();
    setLinkedListNodes(reversed);
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    showDsMessage("🔄 List reversed!", "success");
    updateDsMetrics(true);
    addToDsHistory("Reverse()");
    setIsOperating(false);
  }, [linkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const findMiddleLinkedList = useCallback(() => {
    if (linkedListNodes.length === 0) {
      showDsMessage("❌ List is empty!", "error");
      return;
    }
    
    const middleIndex = Math.floor(linkedListNodes.length / 2);
    const middleValue = linkedListNodes[middleIndex].value;
    showDsMessage(`🎯 Middle: ${middleValue} at position ${middleIndex}`, "info");
    addToDsHistory(`FindMiddle() → ${middleValue}`);
  }, [linkedListNodes, showDsMessage, addToDsHistory]);

  const getSizeLinkedList = useCallback(() => {
    const size = linkedListNodes.length;
    showDsMessage(`📊 Size: ${size}`, "info");
    addToDsHistory(`GetSize() → ${size}`);
  }, [linkedListNodes, showDsMessage, addToDsHistory]);

  // Double Linked List Additional Operations
  const reverseDoubleLinkedList = useCallback(async () => {
    if (isOperating || doubleLinkedListNodes.length === 0) {
      showDsMessage("❌ List is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    const reversed = [...doubleLinkedListNodes].reverse().map((node, index, arr) => ({
      ...node,
      prev: index < arr.length - 1 ? arr[index + 1].id : null,
      next: index > 0 ? arr[index - 1].id : null
    }));
    setDoubleLinkedListNodes(reversed);
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    showDsMessage("🔄 Double List reversed!", "success");
    updateDsMetrics(true);
    addToDsHistory("Reverse()");
    setIsOperating(false);
  }, [doubleLinkedListNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  // Graph Traversals
  const dfsGraph = useCallback(async () => {
    if (graphNodes.length === 0) {
      showDsMessage("❌ Graph is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    const visited = new Set<string>();
    const result: number[] = [];
    
    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      const node = graphNodes.find(n => n.id === nodeId);
      if (node) result.push(node.value);
      
      const neighbors = graphEdges.filter(e => e.from === nodeId).map(e => e.to);
      neighbors.forEach(neighborId => dfs(neighborId));
    };
    
    if (graphNodes.length > 0) {
      dfs(graphNodes[0].id);
    }
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    showDsMessage(`🔍 DFS: [${result.join(', ')}]`, "info");
    addToDsHistory(`DFS() → [${result.join(', ')}]`);
    setIsOperating(false);
  }, [graphNodes, graphEdges, isOperating, dsAnimationSpeed, showDsMessage, addToDsHistory]);

  const bfsGraph = useCallback(async () => {
    if (graphNodes.length === 0) {
      showDsMessage("❌ Graph is empty!", "error");
      return;
    }
    
    setIsOperating(true);
    const visited = new Set<string>();
    const queue: string[] = [graphNodes[0].id];
    const result: number[] = [];
    visited.add(graphNodes[0].id);
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = graphNodes.find(n => n.id === nodeId);
      if (node) result.push(node.value);
      
      const neighbors = graphEdges.filter(e => e.from === nodeId).map(e => e.to);
      neighbors.forEach(neighborId => {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    showDsMessage(`🔍 BFS: [${result.join(', ')}]`, "info");
    addToDsHistory(`BFS() → [${result.join(', ')}]`);
    setIsOperating(false);
  }, [graphNodes, graphEdges, isOperating, dsAnimationSpeed, showDsMessage, addToDsHistory]);

  const getGraphDegree = useCallback(() => {
    if (graphNodes.length === 0) {
      showDsMessage("❌ Graph is empty!", "error");
      return;
    }
    
    const degrees = graphNodes.map(node => {
      const inDegree = graphEdges.filter(e => e.to === node.id).length;
      const outDegree = graphEdges.filter(e => e.from === node.id).length;
      return { node: node.value, in: inDegree, out: outDegree, total: inDegree + outDegree };
    });
    
    const summary = degrees.map(d => `${d.node}(${d.total})`).join(', ');
    showDsMessage(`📊 Degrees: ${summary}`, "info");
    addToDsHistory(`GetDegrees()`);
  }, [graphNodes, graphEdges, showDsMessage, addToDsHistory]);

  const detectCycleGraph = useCallback(() => {
    if (graphNodes.length === 0) {
      showDsMessage("❌ Graph is empty!", "error");
      return;
    }
    
    const visited = new Set<string>();
    const recStack = new Set<string>();
    
    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);
      
      const neighbors = graphEdges.filter(e => e.from === nodeId).map(e => e.to);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }
      
      recStack.delete(nodeId);
      return false;
    };
    
    let cycleFound = false;
    for (const node of graphNodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          cycleFound = true;
          break;
        }
      }
    }
    
    showDsMessage(cycleFound ? "⚠️ Cycle detected!" : "✅ No cycle found", cycleFound ? "error" : "success");
    addToDsHistory(`DetectCycle() → ${cycleFound}`);
  }, [graphNodes, graphEdges, showDsMessage, addToDsHistory]);

  // Graph Operations
  const addGraphNode = useCallback(async () => {
    if (isOperating) return;
    const value = parseInt(dsInputValue, 10);
    if (isNaN(value)) {
      showDsMessage("❌ Please enter a valid number", "error");
      updateDsMetrics(false);
      return;
    }
    if (graphNodes.length >= MAX_DS_SIZE) {
      showDsMessage(`❌ Graph is full! Maximum ${MAX_DS_SIZE} nodes`, "error");
      updateDsMetrics(false);
      return;
    }
    
    setIsOperating(true);
    const newNode = {
      id: Date.now().toString(),
      value,
      x: 100 + (graphNodes.length % 3) * 150,
      y: 100 + Math.floor(graphNodes.length / 3) * 150,
      state: "new" as const
    };
    
    setGraphNodes(prev => [...prev, newNode]);
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.5));
    showDsMessage(`✅ Added node ${value}`, "success");
    updateDsMetrics(true);
    addToDsHistory(`AddNode(${value})`);
    setDsInputValue("");
    setIsOperating(false);
  }, [dsInputValue, graphNodes, isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const addGraphEdge = useCallback(async (from: string, to: string) => {
    if (isOperating) return;
    setIsOperating(true);
    
    const edge = { from, to, weight: Math.floor(Math.random() * 10) + 1 };
    setGraphEdges(prev => [...prev, edge]);
    
    await new Promise(resolve => setTimeout(resolve, dsAnimationSpeed * 0.3));
    showDsMessage(`✅ Added edge from ${from} to ${to}`, "success");
    updateDsMetrics(true);
    addToDsHistory(`AddEdge(${from}, ${to})`);
    setIsOperating(false);
  }, [isOperating, dsAnimationSpeed, showDsMessage, updateDsMetrics, addToDsHistory]);

  const createCustomArray = useCallback(() => {
    const values = customInput
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "")
      .map((v) => parseInt(v, 10))
      .filter((v) => !isNaN(v));
    
    if (values.length === 0) {
      alert("Please enter valid numbers separated by commas");
      return;
    }
    
    setArray(values.map((value, index) => createArrayElement(value, index)));
    setArraySize(values.length);
  }, [customInput]);

  const resetArray = useCallback(() => {
    sortingRef.current = false;
    setIsPlaying(false);
    setCurrentStep(0);
    setHighlightedLines([]);
    setVariables({});
    setHistory([]);
    
    if (inputMode === "custom" && customInput) {
      createCustomArray();
    } else {
      setArray(
        generateRandomArray(arraySize, 5, 100).map((value, index) => createArrayElement(value, index))
      );
    }
  }, [arraySize, inputMode, customInput, createCustomArray]);

  const stepForward = useCallback(() => {
    if (currentStep < history.length - 1) {
      const nextStep = history[currentStep + 1];
      setArray(nextStep.array);
      setHighlightedLines(nextStep.highlightedLines);
      setVariables(nextStep.variables);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, history]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = history[currentStep - 1];
      setArray(prevStep.array);
      setHighlightedLines(prevStep.highlightedLines);
      setVariables(prevStep.variables);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, history]);

  // Sorting Algorithms
  const bubbleSort = useCallback(async () => {
    const arr = [...array].map(el => ({ ...el }));
    const n = arr.length;
    let step = 0;

    for (let i = 0; i < n && sortingRef.current; i++) {
      setVariables({ i, n, 'n-i-1': n - i - 1 });
      for (let j = 0; j < n - i - 1 && sortingRef.current; j++) {
        arr.forEach(el => { el.isComparing = false; el.isSwapping = false; });
        
        arr[j].isComparing = true;
        arr[j + 1].isComparing = true;
        setArray([...arr]);
        setHighlightedLines([4, 5]);
        setVariables({ i, j, n, 'n-i-1': n - i - 1 });
        addToHistory(arr, [4, 5], { i, j }, `Comparing arr[${j}]=${arr[j].value} and arr[${j+1}]=${arr[j+1].value}`);
        
        playSound(200 + arr[j].value * 5);
        await delay(ANIMATION_SPEEDS[speed]);

        if (!sortingRef.current) return;

        if (arr[j].value > arr[j + 1].value) {
          arr[j].isComparing = false;
          arr[j + 1].isComparing = false;
          arr[j].isSwapping = true;
          arr[j + 1].isSwapping = true;
          setArray([...arr]);
          setHighlightedLines([6, 7]);
          playSound(400 + arr[j].value * 5);
          await delay(ANIMATION_SPEEDS[speed]);

          if (!sortingRef.current) return;

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          arr[j].index = j;
          arr[j + 1].index = j + 1;
          addToHistory(arr, [6, 7], { i, j }, `Swapped arr[${j}] and arr[${j+1}]`);
        }

        arr[j].isComparing = false;
        arr[j + 1].isComparing = false;
        arr[j].isSwapping = false;
        arr[j + 1].isSwapping = false;
        setArray([...arr]);
      }
      arr[n - i - 1].isSorted = true;
      arr[n - i - 1].isComparing = false;
      arr[n - i - 1].isSwapping = false;
      setArray([...arr]);
      addToHistory(arr, [], { i }, `Element at position ${n-i-1} is sorted`);
    }

    arr.forEach((el) => { el.isSorted = true; el.isComparing = false; el.isSwapping = false; });
    setArray([...arr]);
    addToHistory(arr, [], {}, "Sorting complete!");
    setIsPlaying(false);
    sortingRef.current = false;
  }, [array, speed, playSound, addToHistory]);

  const selectionSort = useCallback(async () => {
    const arr = [...array].map(el => ({ ...el }));
    const n = arr.length;

    for (let i = 0; i < n && sortingRef.current; i++) {
      let minIdx = i;
      arr[i].isHighlighted = true;
      setArray([...arr]);
      setVariables({ i, minIdx, n });
      addToHistory(arr, [2, 3], { i, minIdx }, `Finding minimum from position ${i}`);
      
      for (let j = i + 1; j < n && sortingRef.current; j++) {
        arr.forEach(el => el.isComparing = false);
        arr[j].isComparing = true;
        arr[minIdx].isHighlighted = true;
        setArray([...arr]);
        setHighlightedLines([4, 5, 6]);
        setVariables({ i, j, minIdx, 'arr[minIdx]': arr[minIdx].value, 'arr[j]': arr[j].value });
        
        playSound(200 + arr[j].value * 5);
        await delay(ANIMATION_SPEEDS[speed]);

        if (!sortingRef.current) return;

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx].isHighlighted = false;
          minIdx = j;
          addToHistory(arr, [5, 6], { i, j, minIdx }, `New minimum found at position ${j}`);
        }
      }

      if (minIdx !== i) {
        arr[i].isSwapping = true;
        arr[minIdx].isSwapping = true;
        setArray([...arr]);
        playSound(400 + arr[i].value * 5);
        await delay(ANIMATION_SPEEDS[speed]);

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        arr[i].index = i;
        arr[minIdx].index = minIdx;
        addToHistory(arr, [7], { i, minIdx }, `Swapped arr[${i}] with arr[${minIdx}]`);
      }

      arr.forEach(el => {
        el.isHighlighted = false;
        el.isComparing = false;
        el.isSwapping = false;
      });
      arr[i].isSorted = true;
      setArray([...arr]);
    }

    arr.forEach(el => el.isSorted = true);
    setArray([...arr]);
    addToHistory(arr, [], {}, "Sorting complete!");
    setIsPlaying(false);
    sortingRef.current = false;
  }, [array, speed, playSound, addToHistory]);

  const insertionSort = useCallback(async () => {
    const arr = [...array].map(el => ({ ...el }));
    arr[0].isSorted = true;
    setArray([...arr]);

    for (let i = 1; i < arr.length && sortingRef.current; i++) {
      const key = arr[i].value;
      arr[i].isHighlighted = true;
      setArray([...arr]);
      setVariables({ i, key, j: i - 1 });
      addToHistory(arr, [1, 2], { i, key }, `Key = arr[${i}] = ${key}`);
      
      playSound(200 + key * 5);
      await delay(ANIMATION_SPEEDS[speed]);

      let j = i - 1;
      while (j >= 0 && sortingRef.current && arr[j].value > key) {
        arr[j].isComparing = true;
        arr[j + 1].isComparing = true;
        setArray([...arr]);
        setVariables({ i, key, j, 'arr[j]': arr[j].value });
        
        playSound(300 + arr[j].value * 5);
        await delay(ANIMATION_SPEEDS[speed]);

        arr[j + 1].value = arr[j].value;
        arr[j].isComparing = false;
        arr[j + 1].isComparing = false;
        setArray([...arr]);
        addToHistory(arr, [3, 4, 5], { i, key, j }, `Shift arr[${j}] to position ${j+1}`);
        
        j--;
      }

      arr[j + 1].value = key;
      arr.forEach((el, idx) => {
        el.isHighlighted = false;
        el.isComparing = false;
        if (idx <= i) el.isSorted = true;
      });
      setArray([...arr]);
      addToHistory(arr, [6], { i, j: j + 1, key }, `Placed key ${key} at position ${j+1}`);
    }

    setIsPlaying(false);
    sortingRef.current = false;
  }, [array, speed, playSound, addToHistory]);

  const quickSort = useCallback(async () => {
    const arr = [...array].map(el => ({ ...el }));

    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high].value;
      arr[high].isHighlighted = true;
      setArray([...arr]);
      setVariables({ low, high, pivot, i: low - 1 });
      addToHistory(arr, [6], { low, high, pivot }, `Pivot = arr[${high}] = ${pivot}`);
      await delay(ANIMATION_SPEEDS[speed]);

      let i = low - 1;

      for (let j = low; j < high && sortingRef.current; j++) {
        arr[j].isComparing = true;
        setArray([...arr]);
        setVariables({ low, high, pivot, i, j, 'arr[j]': arr[j].value });
        playSound(200 + arr[j].value * 5);
        await delay(ANIMATION_SPEEDS[speed]);

        if (arr[j].value <= pivot) {
          i++;
          if (i !== j) {
            arr[i].isSwapping = true;
            arr[j].isSwapping = true;
            setArray([...arr]);
            await delay(ANIMATION_SPEEDS[speed]);

            [arr[i], arr[j]] = [arr[j], arr[i]];
            arr[i].index = i;
            arr[j].index = j;
            addToHistory(arr, [9, 10], { i, j }, `Swapped arr[${i}] with arr[${j}]`);
          }
        }

        arr[j].isComparing = false;
        arr[i].isSwapping = false;
        if (j !== i) arr[j].isSwapping = false;
        setArray([...arr]);
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      arr[i + 1].index = i + 1;
      arr[high].index = high;
      arr[i + 1].isSorted = true;
      arr[high].isHighlighted = false;
      setArray([...arr]);
      addToHistory(arr, [11, 12], { i: i + 1, high }, `Pivot placed at position ${i+1}`);

      return i + 1;
    };

    const quickSortHelper = async (low: number, high: number): Promise<void> => {
      if (low < high && sortingRef.current) {
        const pivotIdx = await partition(low, high);
        await quickSortHelper(low, pivotIdx - 1);
        await quickSortHelper(pivotIdx + 1, high);
      }
      
      if (low >= high && low >= 0 && low < arr.length) {
        arr[low].isSorted = true;
        setArray([...arr]);
      }
    };

    await quickSortHelper(0, arr.length - 1);

    arr.forEach(el => el.isSorted = true);
    setArray([...arr]);
    addToHistory(arr, [], {}, "Sorting complete!");
    setIsPlaying(false);
    sortingRef.current = false;
  }, [array, speed, playSound, addToHistory]);

  const mergeSort = useCallback(async () => {
    const arr = [...array].map(el => ({ ...el }));

    const merge = async (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1).map(el => el.value);
      const rightArr = arr.slice(mid + 1, right + 1).map(el => el.value);

      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length && sortingRef.current) {
        arr[k].isComparing = true;
        setArray([...arr]);
        setVariables({ left, mid, right, i, j, k });
        playSound(200 + Math.min(leftArr[i], rightArr[j]) * 5);
        await delay(ANIMATION_SPEEDS[speed]);

        if (leftArr[i] <= rightArr[j]) {
          arr[k].value = leftArr[i];
          i++;
        } else {
          arr[k].value = rightArr[j];
          j++;
        }
        arr[k].isComparing = false;
        setArray([...arr]);
        k++;
      }

      while (i < leftArr.length && sortingRef.current) {
        arr[k].value = leftArr[i];
        arr[k].isComparing = true;
        setArray([...arr]);
        await delay(ANIMATION_SPEEDS[speed] / 2);
        arr[k].isComparing = false;
        i++;
        k++;
      }

      while (j < rightArr.length && sortingRef.current) {
        arr[k].value = rightArr[j];
        arr[k].isComparing = true;
        setArray([...arr]);
        await delay(ANIMATION_SPEEDS[speed] / 2);
        arr[k].isComparing = false;
        j++;
        k++;
      }

      for (let idx = left; idx <= right; idx++) {
        arr[idx].isHighlighted = true;
      }
      setArray([...arr]);
      addToHistory(arr, [], { left, mid, right }, `Merged [${left}..${mid}] and [${mid+1}..${right}]`);
      await delay(ANIMATION_SPEEDS[speed]);
      
      for (let idx = left; idx <= right; idx++) {
        arr[idx].isHighlighted = false;
      }
      setArray([...arr]);
    };

    const mergeSortHelper = async (left: number, right: number): Promise<void> => {
      if (left < right && sortingRef.current) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    };

    await mergeSortHelper(0, arr.length - 1);

    arr.forEach(el => el.isSorted = true);
    setArray([...arr]);
    addToHistory(arr, [], {}, "Sorting complete!");
    setIsPlaying(false);
    sortingRef.current = false;
  }, [array, speed, playSound, addToHistory]);

  const heapSort = useCallback(async () => {
    const arr = [...array].map(el => ({ ...el }));
    const n = arr.length;

    const heapify = async (n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      arr[i].isHighlighted = true;
      if (left < n) arr[left].isComparing = true;
      if (right < n) arr[right].isComparing = true;
      setArray([...arr]);
      setVariables({ n, i, largest, left, right });
      playSound(200 + arr[i].value * 5);
      await delay(ANIMATION_SPEEDS[speed]);

      if (left < n && arr[left].value > arr[largest].value) {
        largest = left;
      }
      if (right < n && arr[right].value > arr[largest].value) {
        largest = right;
      }

      if (largest !== i) {
        arr[i].isSwapping = true;
        arr[largest].isSwapping = true;
        setArray([...arr]);
        await delay(ANIMATION_SPEEDS[speed]);

        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        arr[i].index = i;
        arr[largest].index = largest;

        arr[i].isHighlighted = false;
        arr[i].isSwapping = false;
        arr[largest].isSwapping = false;
        if (left < n) arr[left].isComparing = false;
        if (right < n) arr[right].isComparing = false;
        setArray([...arr]);
        addToHistory(arr, [], { i, largest }, `Swapped arr[${i}] with arr[${largest}]`);

        await heapify(n, largest);
      } else {
        arr[i].isHighlighted = false;
        if (left < n) arr[left].isComparing = false;
        if (right < n) arr[right].isComparing = false;
        setArray([...arr]);
      }
    };

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0 && sortingRef.current; i--) {
      await heapify(n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0 && sortingRef.current; i--) {
      arr[0].isSwapping = true;
      arr[i].isSwapping = true;
      setArray([...arr]);
      await delay(ANIMATION_SPEEDS[speed]);

      [arr[0], arr[i]] = [arr[i], arr[0]];
      arr[0].index = 0;
      arr[i].index = i;
      arr[i].isSorted = true;
      arr[0].isSwapping = false;
      arr[i].isSwapping = false;
      setArray([...arr]);
      addToHistory(arr, [], { i }, `Moved max to position ${i}`);

      await heapify(i, 0);
    }

    arr[0].isSorted = true;
    setArray([...arr]);
    addToHistory(arr, [], {}, "Sorting complete!");
    setIsPlaying(false);
    sortingRef.current = false;
  }, [array, speed, playSound, addToHistory]);

  const algorithmMap: Record<string, () => Promise<void>> = {
    bubbleSort,
    selectionSort,
    insertionSort,
    quickSort,
    mergeSort,
    heapSort,
  };

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      sortingRef.current = false;
      setIsPlaying(false);
    } else {
      sortingRef.current = true;
      setIsPlaying(true);
      setHistory([]);
      setCurrentStep(0);
      const sortFn = algorithmMap[selectedAlgorithm];
      if (sortFn) {
        sortFn();
      }
    }
  }, [isPlaying, selectedAlgorithm, bubbleSort, selectionSort, insertionSort, quickSort, mergeSort, heapSort]);

  const algorithmInfo = SORTING_ALGORITHMS[selectedAlgorithm];
  const codeData = codeMap[selectedAlgorithm];
  const code = codeData?.iterative?.[selectedLanguage] || codeData?.recursive?.[selectedLanguage] || "";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("algorithms")}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === "algorithms"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Sorting Algorithms
            </button>
            <button
              onClick={() => setActiveTab("dataStructures")}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === "dataStructures"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Data Structures
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {activeTab === "algorithms" ? "Algorithm Visualizer" : "Data Structure Simulator"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {activeTab === "algorithms" 
                ? "Watch algorithms in action with step-by-step animations"
                : "Interactive data structure operations and visualizations"}
            </p>
          </div>

          {activeTab === "algorithms" && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Algorithm selector */}
              <div className="relative">
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {algorithms.map((algo) => (
                    <option key={algo.id} value={algo.id}>
                      {algo.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* Language selector */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* Sound toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Disable sound" : "Enable sound"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {/* Settings button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              {/* Input Mode Selection */}
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block font-medium">
                  Array Input Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setInputMode("random")}
                    disabled={isPlaying}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      inputMode === "random"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Random
                  </button>
                  <button
                    onClick={() => setInputMode("custom")}
                    disabled={isPlaying}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      inputMode === "custom"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Random Mode: Array Size Slider */}
              {inputMode === "random" && (
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                    Array Size: {arraySize}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    className="w-full accent-blue-600"
                    disabled={isPlaying}
                  />
                </div>
              )}

              {/* Custom Mode: Input Field */}
              {inputMode === "custom" && (
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                    Enter Values (comma-separated)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g., 42, 15, 73, 28, 91"
                      disabled={isPlaying}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <Button
                      onClick={createCustomArray}
                      disabled={isPlaying || !customInput}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Enter numbers between 1-100, separated by commas
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showCode"
                    checked={showCode}
                    onChange={(e) => setShowCode(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showCode" className="text-sm">Show Code</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showVariables"
                    checked={showVariables}
                    onChange={(e) => setShowVariables(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showVariables" className="text-sm">Show Variables</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPseudocode"
                    checked={showPseudocode}
                    onChange={(e) => setShowPseudocode(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showPseudocode" className="text-sm">Show Pseudocode</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="soundEnabled"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="soundEnabled" className="text-sm">Sound Effects</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={resetArray}
                disabled={isPlaying}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Generate New Array
              </Button>
            </div>
          </div>
        )}

        {/* Main content - Only show for algorithms tab */}
        {activeTab === "algorithms" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Visualization Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-semibold">Visualization</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Step {currentStep} {history.length > 0 && `/ ${history.length}`}
              </span>
            </div>

            <div className="p-6 min-h-[350px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
              <ArrayVisualizer
                data={array}
                showIndices={true}
                showValues={true}
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Speed:
                </span>
                <div className="flex items-center gap-2">
                  {(["slow", "medium", "fast"] as AnimationSpeed[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      disabled={isPlaying}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize disabled:opacity-50 disabled:cursor-not-allowed",
                        speed === s
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Button variant="outline" size="icon" onClick={resetArray} disabled={isPlaying} title="Reset Array">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={stepBackward} disabled={!canStepBack || isPlaying} title="Previous Step">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={stepBackward} disabled={!canStepBack || isPlaying} title="Step Back">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="icon" onClick={handlePlay} className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white" title={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={stepForward} disabled={!canStepForward || isPlaying} title="Step Forward">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={stepForward} disabled={!canStepForward || isPlaying} title="Next Step">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">\n            {/* Variables Panel */}
            {showVariables && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
                  <h2 className="font-semibold flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">📊</span>
                    Variables
                  </h2>
                </div>
                <div className="p-4 max-h-[200px] overflow-auto bg-slate-50 dark:bg-slate-900/50">
                  {Object.keys(variables).length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4">No active variables</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(variables).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                          <span className="font-mono font-medium text-blue-600 dark:text-blue-400">{key}</span>
                          <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Code Panel */}
            {showCode && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold">{showPseudocode ? "Pseudocode" : "Code"}</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {languages.find((l) => l.id === selectedLanguage)?.name}
                </span>
              </div>

              <div className="p-4 bg-slate-950 dark:bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-auto max-h-[400px]">
                <pre className="whitespace-pre">
                  {code.split("\n").map((line: string, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "px-2 -mx-2 transition-colors leading-relaxed",
                        highlightedLines.includes(i + 1) &&
                          "bg-yellow-500/20 border-l-2 border-yellow-500"
                      )}
                    >
                      <span className="text-slate-500 select-none mr-4 inline-block w-6 text-right">
                        {String(i + 1).padStart(2, " ")}
                      </span>
                      <span className="text-slate-100">{line}</span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>
            )}

            {/* Complexity Info */}
            {algorithmInfo && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-semibold">Complexity Analysis</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Time (Best):
                      </span>
                      <span className="ml-2 font-mono text-green-600 dark:text-green-400">
                        {algorithmInfo.timeComplexity.best}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Time (Avg):
                      </span>
                      <span className="ml-2 font-mono text-yellow-600 dark:text-yellow-400">
                        {algorithmInfo.timeComplexity.average}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Time (Worst):
                      </span>
                      <span className="ml-2 font-mono text-red-600 dark:text-red-400">
                        {algorithmInfo.timeComplexity.worst}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">
                        Space:
                      </span>
                      <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">
                        {algorithmInfo.spaceComplexity}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap text-sm">
                    {algorithmInfo.stable !== undefined && (
                      <span
                        className={cn(
                          "px-2 py-1 rounded",
                          algorithmInfo.stable
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        )}
                      >
                        {algorithmInfo.stable ? "Stable" : "Unstable"}
                      </span>
                    )}
                    {algorithmInfo.inPlace !== undefined && (
                      <span
                        className={cn(
                          "px-2 py-1 rounded",
                          algorithmInfo.inPlace
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        )}
                      >
                        {algorithmInfo.inPlace ? "In-Place" : "Not In-Place"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Data Structures Interactive Simulator - Only show when dataStructures tab is active */}
        {activeTab === "dataStructures" && (
          <div className="space-y-6">
            {/* Data Structure Selector */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "stack", name: "Stack", icon: "📚" },
                { id: "queue", name: "Queue", icon: "🎫" },
                { id: "linkedList", name: "Linked List", icon: "🔗" },
                { id: "doubleLinkedList", name: "Double LL", icon: "⇄" },
                { id: "bst", name: "BST", icon: "🌳" },
                { id: "graph", name: "Graph", icon: "🕸️" },
              ].map((ds) => (
                <button
                  key={ds.id}
                  onClick={() => setSelectedDataStructure(ds.id as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedDataStructure === ds.id
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="mr-2">{ds.icon}</span>
                  {ds.name}
                </button>
              ))}
            </div>

            {/* Main Simulator Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Visualization Panel */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="font-semibold capitalize">{selectedDataStructure} Visualization</h2>
                </div>

                <div className="p-6 min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
                  {selectedDataStructure === "stack" && (
                    <StackVisualizer elements={stackElements} maxSize={8} />
                  )}
                  {selectedDataStructure === "queue" && (
                    <QueueVisualizer elements={queueElements} maxSize={8} />
                  )}
                  {selectedDataStructure === "linkedList" && (
                    <div className="flex items-center gap-2 overflow-x-auto p-4">
                      {linkedListNodes.length === 0 ? (
                        <div className="text-slate-500 dark:text-slate-400">Empty List - Add nodes to get started!</div>
                      ) : (
                        <>
                          {linkedListNodes.map((node, index) => (
                            <React.Fragment key={node.id}>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2"
                              >
                                <div className="flex items-center bg-blue-600 text-white rounded-lg overflow-hidden shadow-lg">
                                  <div className="px-4 py-3 font-mono font-bold text-lg">{node.value}</div>
                                  <div className="px-2 py-3 bg-blue-700 text-xs">→</div>
                                </div>
                              </motion.div>
                              {index < linkedListNodes.length - 1 && (
                                <div className="text-slate-400 text-xl">→</div>
                              )}
                            </React.Fragment>
                          ))}
                          <div className="text-slate-400 text-xl">NULL</div>
                        </>
                      )}
                    </div>
                  )}
                  {selectedDataStructure === "doubleLinkedList" && (
                    <div className="flex items-center gap-2 overflow-x-auto p-4">
                      {doubleLinkedListNodes.length === 0 ? (
                        <div className="text-slate-500 dark:text-slate-400">Empty Double Linked List - Add nodes!</div>
                      ) : (
                        <>
                          <div className="text-slate-400 text-xl">NULL</div>
                          {doubleLinkedListNodes.map((node, index) => (
                            <React.Fragment key={node.id}>
                              {index > 0 && <div className="text-slate-400 text-xl">⇄</div>}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center"
                              >
                                <div className="flex items-center bg-purple-600 text-white rounded-lg overflow-hidden shadow-lg">
                                  <div className="px-2 py-3 bg-purple-700 text-xs">←</div>
                                  <div className="px-4 py-3 font-mono font-bold text-lg">{node.value}</div>
                                  <div className="px-2 py-3 bg-purple-700 text-xs">→</div>
                                </div>
                              </motion.div>
                            </React.Fragment>
                          ))}
                          <div className="text-slate-400 text-xl">NULL</div>
                        </>
                      )}
                    </div>
                  )}
                  {selectedDataStructure === "bst" && (
                    <div className="relative w-full h-[500px] bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden">
                      {bstNodes.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🌳</div>
                            <p className="font-medium text-lg">Empty Binary Search Tree</p>
                            <p className="text-sm mt-2">Insert numbers to build your tree!</p>
                            <div className="mt-4 text-xs bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-xs mx-auto">
                              <p className="font-semibold mb-1">💡 BST Rule:</p>
                              <p>Left child &lt; Parent &lt; Right child</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                          <defs>
                            <marker
                              id="arrowhead"
                              markerWidth="10"
                              markerHeight="7"
                              refX="9"
                              refY="3.5"
                              orient="auto"
                            >
                              <polygon
                                points="0 0, 10 3.5, 0 7"
                                fill="currentColor"
                                className="text-slate-400 dark:text-slate-600"
                              />
                            </marker>
                            <filter id="glow-new">
                              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                            <filter id="glow-found">
                              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          {bstNodes.map((node, index) => {
                            const leftChildX = node.x - 120 / Math.pow(1.8, node.level);
                            const rightChildX = node.x + 120 / Math.pow(1.8, node.level);
                            const childY = node.y + 90;
                            
                            return (
                              <g key={node.id}>
                                {/* Left edge */}
                                {node.left && (
                                  <g>
                                    <line
                                      x1={node.x}
                                      y1={node.y + 28}
                                      x2={leftChildX}
                                      y2={childY - 28}
                                      stroke="currentColor"
                                      className="text-slate-400 dark:text-slate-600"
                                      strokeWidth="2.5"
                                      markerEnd="url(#arrowhead)"
                                    />
                                    <circle
                                      cx={(node.x + leftChildX) / 2 - 8}
                                      cy={(node.y + childY) / 2}
                                      r="12"
                                      className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-300 dark:stroke-blue-700"
                                      strokeWidth="1.5"
                                    />
                                    <text
                                      x={(node.x + leftChildX) / 2 - 8}
                                      y={(node.y + childY) / 2 + 1}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                      className="fill-blue-700 dark:fill-blue-400 text-xs font-bold"
                                    >
                                      L
                                    </text>
                                  </g>
                                )}
                                {/* Right edge */}
                                {node.right && (
                                  <g>
                                    <line
                                      x1={node.x}
                                      y1={node.y + 28}
                                      x2={rightChildX}
                                      y2={childY - 28}
                                      stroke="currentColor"
                                      className="text-slate-400 dark:text-slate-600"
                                      strokeWidth="2.5"
                                      markerEnd="url(#arrowhead)"
                                    />
                                    <circle
                                      cx={(node.x + rightChildX) / 2 + 8}
                                      cy={(node.y + childY) / 2}
                                      r="12"
                                      className="fill-purple-100 dark:fill-purple-900/40 stroke-purple-300 dark:stroke-purple-700"
                                      strokeWidth="1.5"
                                    />
                                    <text
                                      x={(node.x + rightChildX) / 2 + 8}
                                      y={(node.y + childY) / 2 + 1}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                      className="fill-purple-700 dark:fill-purple-400 text-xs font-bold"
                                    >
                                      R
                                    </text>
                                  </g>
                                )}
                              </g>
                            );
                          })}
                          {/* Draw nodes on top */}
                          {bstNodes.map((node) => {
                            const stateStyles = {
                              default: { 
                                color: 'fill-emerald-600 dark:fill-emerald-500',
                                stroke: 'stroke-emerald-700 dark:stroke-emerald-400',
                                filter: '',
                                ring: false
                              },
                              new: { 
                                color: 'fill-green-500 dark:fill-green-400',
                                stroke: 'stroke-green-700 dark:stroke-green-300',
                                filter: 'url(#glow-new)',
                                ring: true
                              },
                              visited: { 
                                color: 'fill-slate-400 dark:fill-slate-500',
                                stroke: 'stroke-slate-600 dark:stroke-slate-400',
                                filter: '',
                                ring: false
                              },
                              found: { 
                                color: 'fill-yellow-400 dark:fill-yellow-500',
                                stroke: 'stroke-yellow-600 dark:stroke-yellow-400',
                                filter: 'url(#glow-found)',
                                ring: true
                              },
                              current: { 
                                color: 'fill-blue-500 dark:fill-blue-400',
                                stroke: 'stroke-blue-700 dark:stroke-blue-300',
                                filter: '',
                                ring: true
                              },
                            };
                            const style = stateStyles[node.state as keyof typeof stateStyles] || stateStyles.default;
                            
                            return (
                              <g key={`node-${node.id}`}>
                                {/* Outer ring for active states */}
                                {style.ring && (
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="36"
                                    className={style.stroke}
                                    strokeWidth="3"
                                    fill="none"
                                    opacity="0.5"
                                  >
                                    <animate
                                      attributeName="r"
                                      from="36"
                                      to="42"
                                      dur="1s"
                                      repeatCount="indefinite"
                                    />
                                    <animate
                                      attributeName="opacity"
                                      from="0.5"
                                      to="0"
                                      dur="1s"
                                      repeatCount="indefinite"
                                    />
                                  </circle>
                                )}
                                
                                {/* Main node circle */}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="32"
                                  className={`${style.color} ${style.stroke}`}
                                  strokeWidth="3"
                                  style={{
                                    filter: style.filter || 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                                  }}
                                />
                                
                                {/* Node value */}
                                <text
                                  x={node.x}
                                  y={node.y + 2}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="fill-white font-bold text-lg pointer-events-none"
                                  style={{ userSelect: 'none' }}
                                >
                                  {node.value}
                                </text>
                                
                                {/* Level badge */}
                                <g>
                                  <rect
                                    x={node.x - 18}
                                    y={node.y - 48}
                                    width="36"
                                    height="16"
                                    rx="8"
                                    className="fill-slate-200 dark:fill-slate-700"
                                  />
                                  <text
                                    x={node.x}
                                    y={node.y - 40}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-slate-600 dark:fill-slate-300 text-[10px] font-semibold"
                                  >
                                    Level {node.level}
                                  </text>
                                </g>
                                
                                {/* State indicator for learning */}
                                {node.state !== 'default' && (
                                  <g>
                                    <rect
                                      x={node.x - 28}
                                      y={node.y + 42}
                                      width="56"
                                      height="18"
                                      rx="9"
                                      className={
                                        node.state === 'new' ? 'fill-green-100 dark:fill-green-900/40' :
                                        node.state === 'found' ? 'fill-yellow-100 dark:fill-yellow-900/40' :
                                        node.state === 'current' ? 'fill-blue-100 dark:fill-blue-900/40' :
                                        'fill-slate-100 dark:fill-slate-800'
                                      }
                                    />
                                    <text
                                      x={node.x}
                                      y={node.y + 51}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                      className={
                                        node.state === 'new' ? 'fill-green-700 dark:fill-green-400' :
                                        node.state === 'found' ? 'fill-yellow-700 dark:fill-yellow-400' :
                                        node.state === 'current' ? 'fill-blue-700 dark:fill-blue-400' :
                                        'fill-slate-700 dark:fill-slate-400'
                                      }
                                      style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                    >
                                      {node.state === 'new' ? 'NEW' :
                                       node.state === 'found' ? 'FOUND!' :
                                       node.state === 'current' ? 'Checking' :
                                       node.state === 'visited' ? 'Visited' : ''}
                                    </text>
                                  </g>
                                )}
                              </g>
                            );
                          })}
                        </svg>
                      )}
                    </div>
                  )}
                  {selectedDataStructure === "graph" && (
                    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      {graphNodes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                          <svg className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <p className="font-medium">Empty Graph</p>
                          <p className="text-sm">Add nodes to get started!</p>
                        </div>
                      ) : (
                        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                          <defs>
                            <marker
                              id="graph-arrowhead"
                              markerWidth="10"
                              markerHeight="10"
                              refX="9"
                              refY="5"
                              orient="auto"
                            >
                              <polygon
                                points="0 0, 10 5, 0 10"
                                className="fill-slate-500 dark:fill-slate-400"
                              />
                            </marker>
                            <filter id="edge-shadow">
                              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
                            </filter>
                            <filter id="node-shadow">
                              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4"/>
                            </filter>
                          </defs>
                          
                          {/* Render edges first (behind nodes) */}
                          {graphEdges.map((edge, index) => {
                            const fromNode = graphNodes.find(n => n.id === edge.from);
                            const toNode = graphNodes.find(n => n.id === edge.to);
                            if (!fromNode || !toNode) return null;
                            
                            // Calculate edge angle for weight label positioning
                            const dx = toNode.x - fromNode.x;
                            const dy = toNode.y - fromNode.y;
                            const angle = Math.atan2(dy, dx);
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            // Offset start and end to account for node radius
                            const nodeRadius = 35;
                            const startX = fromNode.x + Math.cos(angle) * nodeRadius;
                            const startY = fromNode.y + Math.sin(angle) * nodeRadius;
                            const endX = toNode.x - Math.cos(angle) * nodeRadius;
                            const endY = toNode.y - Math.sin(angle) * nodeRadius;
                            
                            // Midpoint for weight label
                            const midX = (fromNode.x + toNode.x) / 2;
                            const midY = (fromNode.y + toNode.y) / 2;
                            
                            return (
                              <g key={`edge-${index}`}>
                                {/* Edge line */}
                                <line
                                  x1={startX}
                                  y1={startY}
                                  x2={endX}
                                  y2={endY}
                                  stroke="currentColor"
                                  className="text-slate-400 dark:text-slate-500"
                                  strokeWidth="3"
                                  markerEnd="url(#graph-arrowhead)"
                                  filter="url(#edge-shadow)"
                                  style={{
                                    transition: 'all 0.3s ease',
                                  }}
                                />
                                
                                {/* Weight label background */}
                                <circle
                                  cx={midX}
                                  cy={midY}
                                  r="16"
                                  className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600"
                                  strokeWidth="2"
                                  filter="url(#edge-shadow)"
                                />
                                
                                {/* Weight label text */}
                                <text
                                  x={midX}
                                  y={midY + 1}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="fill-blue-600 dark:fill-blue-400 text-xs font-bold pointer-events-none"
                                >
                                  {edge.weight}
                                </text>
                              </g>
                            );
                          })}
                          
                          {/* Render nodes on top */}
                          {graphNodes.map((node) => {
                            const stateColors = {
                              default: 'fill-indigo-600 dark:fill-indigo-500',
                              visited: 'fill-green-500 dark:fill-green-400',
                              current: 'fill-amber-500 dark:fill-amber-400',
                              queued: 'fill-blue-500 dark:fill-blue-400',
                              found: 'fill-rose-500 dark:fill-rose-400',
                            };
                            const nodeColor = stateColors[node.state as keyof typeof stateColors] || stateColors.default;
                            
                            return (
                              <g key={`node-${node.id}`} style={{ cursor: 'pointer' }}>
                                {/* Node shadow/glow effect */}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="38"
                                  className="fill-black/10 dark:fill-white/5"
                                  filter="url(#node-shadow)"
                                />
                                
                                {/* Main node circle */}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r="35"
                                  className={`${nodeColor} stroke-slate-700 dark:stroke-slate-300 hover:stroke-4 transition-all duration-200`}
                                  strokeWidth="3"
                                  style={{
                                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
                                  }}
                                />
                                
                                {/* Node value */}
                                <text
                                  x={node.x}
                                  y={node.y + 2}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="fill-white font-bold text-xl pointer-events-none"
                                  style={{ userSelect: 'none' }}
                                >
                                  {node.value}
                                </text>
                                
                                {/* Node ID label */}
                                <text
                                  x={node.x}
                                  y={node.y + 52}
                                  textAnchor="middle"
                                  className="fill-slate-600 dark:fill-slate-400 text-[11px] font-semibold pointer-events-none"
                                >
                                  Node {node.value}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      )}
                      
                      {/* Legend */}
                      {graphNodes.length > 0 && (
                        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-slate-200 dark:border-slate-700">
                          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">STATE LEGEND</div>
                          <div className="flex flex-col gap-1 text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500 border border-slate-700"></div>
                              <span className="text-slate-700 dark:text-slate-300">Default</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 border border-slate-700"></div>
                              <span className="text-slate-700 dark:text-slate-300">Visited</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-400 border border-slate-700"></div>
                              <span className="text-slate-700 dark:text-slate-300">Current</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Display */}
                {dsMessage && (
                  <div className="p-3 mx-4 mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                    {dsMessage}
                  </div>
                )}
              </div>

              {/* Controls Panel */}
              <div className="space-y-6">
                {/* Input Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold">Operations</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                        Enter Value
                      </label>
                      <input
                        type="number"
                        value={dsInputValue}
                        onChange={(e) => setDsInputValue(e.target.value)}
                        placeholder="Enter a number"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (selectedDataStructure === "stack") pushToStack();
                            else if (selectedDataStructure === "queue") enqueue();
                            else if (selectedDataStructure === "linkedList") insertLinkedList("tail");
                          }
                        }}
                      />
                    </div>

                    {/* Stack Operations */}
                    {selectedDataStructure === "stack" && (
                      <div className="space-y-2">
                        <Button onClick={pushToStack} className="w-full bg-green-600 hover:bg-green-700">
                          Push
                        </Button>
                        <Button onClick={popFromStack} variant="outline" className="w-full">
                          Pop
                        </Button>
                        <Button onClick={peekStack} variant="outline" className="w-full">
                          Peek
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={checkEmpty} variant="outline" className="w-full text-sm">
                            isEmpty
                          </Button>
                          <Button onClick={checkFull} variant="outline" className="w-full text-sm">
                            isFull
                          </Button>
                        </div>
                        <Button onClick={reverseStack} variant="outline" className="w-full">
                          Reverse
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={undoDs} disabled={dsHistoryIndex <= 0} variant="outline" className="w-full text-sm" title="Ctrl+Z">
                            ↩️ Undo
                          </Button>
                          <Button onClick={redoDs} disabled={dsHistoryIndex >= dsHistory.length - 1} variant="outline" className="w-full text-sm" title="Ctrl+Y">
                            ↪️ Redo
                          </Button>
                        </div>
                        <Button onClick={exportDataStructure} variant="outline" className="w-full">
                          📋 Export
                        </Button>
                        <Button onClick={clearDataStructure} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Clear Stack
                        </Button>
                      </div>
                    )}

                    {/* Queue Operations */}
                    {selectedDataStructure === "queue" && (
                      <div className="space-y-2">
                        <Button onClick={enqueue} className="w-full bg-blue-600 hover:bg-blue-700">
                          Enqueue
                        </Button>
                        <Button onClick={dequeue} variant="outline" className="w-full">
                          Dequeue
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={checkEmpty} variant="outline" className="w-full text-sm">
                            isEmpty
                          </Button>
                          <Button onClick={checkFull} variant="outline" className="w-full text-sm">
                            isFull
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={undoDs} disabled={dsHistoryIndex <= 0} variant="outline" className="w-full text-sm" title="Ctrl+Z">
                            ↩️ Undo
                          </Button>
                          <Button onClick={redoDs} disabled={dsHistoryIndex >= dsHistory.length - 1} variant="outline" className="w-full text-sm" title="Ctrl+Y">
                            ↪️ Redo
                          </Button>
                        </div>
                        <Button onClick={exportDataStructure} variant="outline" className="w-full">
                          📋 Export
                        </Button>
                        <Button onClick={clearDataStructure} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Clear Queue
                        </Button>
                      </div>
                    )}

                    {/* Linked List Operations */}
                    {selectedDataStructure === "linkedList" && (
                      <div className="space-y-2">
                        <Button onClick={() => insertLinkedList("head")} className="w-full bg-green-600 hover:bg-green-700">
                          Insert at Head
                        </Button>
                        <Button onClick={() => insertLinkedList("tail")} className="w-full bg-blue-600 hover:bg-blue-700">
                          Insert at Tail
                        </Button>
                        <Button onClick={insertLinkedListAtIndex} className="w-full bg-purple-600 hover:bg-purple-700">
                          Insert at Index
                        </Button>
                        <Button onClick={() => deleteLinkedList("head")} variant="outline" className="w-full">
                          Delete Head
                        </Button>
                        <Button onClick={() => deleteLinkedList("tail")} variant="outline" className="w-full">
                          Delete Tail
                        </Button>
                        <Button onClick={deleteLinkedListAtIndex} variant="outline" className="w-full">
                          Delete at Index
                        </Button>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Operations</p>
                          <div className="grid grid-cols-3 gap-2">
                            <Button onClick={reverseLinkedList} variant="outline" className="w-full text-xs">
                              Reverse
                            </Button>
                            <Button onClick={findMiddleLinkedList} variant="outline" className="w-full text-xs">
                              Middle
                            </Button>
                            <Button onClick={getSizeLinkedList} variant="outline" className="w-full text-xs">
                              Size
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={checkEmpty} variant="outline" className="w-full text-sm">
                            isEmpty
                          </Button>
                          <Button onClick={checkFull} variant="outline" className="w-full text-sm">
                            isFull
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={undoDs} disabled={dsHistoryIndex <= 0} variant="outline" className="w-full text-sm" title="Ctrl+Z">
                            ↩️ Undo
                          </Button>
                          <Button onClick={redoDs} disabled={dsHistoryIndex >= dsHistory.length - 1} variant="outline" className="w-full text-sm" title="Ctrl+Y">
                            ↪️ Redo
                          </Button>
                        </div>
                        <Button onClick={exportDataStructure} variant="outline" className="w-full">
                          📋 Export
                        </Button>
                        <Button onClick={clearDataStructure} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Clear List
                        </Button>
                      </div>
                    )}

                    {/* Double Linked List Operations */}
                    {selectedDataStructure === "doubleLinkedList" && (
                      <div className="space-y-2">
                        <Button onClick={() => insertDoubleLinkedList("head")} className="w-full bg-green-600 hover:bg-green-700">
                          Insert at Head
                        </Button>
                        <Button onClick={() => insertDoubleLinkedList("tail")} className="w-full bg-blue-600 hover:bg-blue-700">
                          Insert at Tail
                        </Button>
                        <Button onClick={insertDoubleLinkedListAtIndex} className="w-full bg-purple-600 hover:bg-purple-700">
                          Insert at Index
                        </Button>
                        <Button onClick={() => deleteDoubleLinkedList("head")} variant="outline" className="w-full">
                          Delete Head
                        </Button>
                        <Button onClick={() => deleteDoubleLinkedList("tail")} variant="outline" className="w-full">
                          Delete Tail
                        </Button>
                        <Button onClick={deleteDoubleLinkedListAtIndex} variant="outline" className="w-full">
                          Delete at Index
                        </Button>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Operations</p>
                          <Button onClick={reverseDoubleLinkedList} variant="outline" className="w-full text-sm">
                            🔄 Reverse
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={checkEmpty} variant="outline" className="w-full text-sm">
                            isEmpty
                          </Button>
                          <Button onClick={checkFull} variant="outline" className="w-full text-sm">
                            isFull
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={undoDs} disabled={dsHistoryIndex <= 0} variant="outline" className="w-full text-sm" title="Ctrl+Z">
                            ↩️ Undo
                          </Button>
                          <Button onClick={redoDs} disabled={dsHistoryIndex >= dsHistory.length - 1} variant="outline" className="w-full text-sm" title="Ctrl+Y">
                            ↪️ Redo
                          </Button>
                        </div>
                        <Button onClick={exportDataStructure} variant="outline" className="w-full">
                          📋 Export
                        </Button>
                        <Button onClick={clearDataStructure} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Clear DLL
                        </Button>
                      </div>
                    )}

                    {/* BST Operations */}
                    {selectedDataStructure === "bst" && (
                      <div className="space-y-2">
                        <Button onClick={insertBST} className="w-full bg-green-600 hover:bg-green-700">
                          🌱 Insert Node
                        </Button>
                        <Button onClick={searchBST} variant="outline" className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                          🔍 Search Node
                        </Button>
                        
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Traversals</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button onClick={inorderTraversal} variant="outline" className="w-full text-xs">
                              Inorder
                            </Button>
                            <Button onClick={preorderTraversal} variant="outline" className="w-full text-xs">
                              Preorder
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button onClick={postorderTraversal} variant="outline" className="w-full text-xs">
                              Postorder
                            </Button>
                            <Button onClick={levelOrderTraversal} variant="outline" className="w-full text-xs">
                              Level Order
                            </Button>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Info</p>
                          <div className="grid grid-cols-3 gap-2">
                            <Button onClick={() => findMinMaxBST("min")} variant="outline" className="w-full text-xs">
                              Min
                            </Button>
                            <Button onClick={() => findMinMaxBST("max")} variant="outline" className="w-full text-xs">
                              Max
                            </Button>
                            <Button onClick={getHeightBST} variant="outline" className="w-full text-xs">
                              Height
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={checkEmpty} variant="outline" className="w-full text-sm">
                            isEmpty
                          </Button>
                          <Button onClick={generateRandomDs} variant="outline" className="w-full text-sm">
                            🎲 Random
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={undoDs} disabled={dsHistoryIndex <= 0} variant="outline" className="w-full text-sm" title="Ctrl+Z">
                            ↩️ Undo
                          </Button>
                          <Button onClick={redoDs} disabled={dsHistoryIndex >= dsHistory.length - 1} variant="outline" className="w-full text-sm" title="Ctrl+Y">
                            ↪️ Redo
                          </Button>
                        </div>
                        <Button onClick={exportDataStructure} variant="outline" className="w-full">
                          📋 Export
                        </Button>
                        <Button onClick={clearDataStructure} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Clear BST
                        </Button>
                      </div>
                    )}

                    {/* Graph Operations */}
                    {selectedDataStructure === "graph" && (
                      <div className="space-y-2">
                        <Button onClick={addGraphNode} className="w-full bg-green-600 hover:bg-green-700">
                          Add Node
                        </Button>
                        <Button onClick={() => {
                          if (graphNodes.length >= 2) {
                            addGraphEdge(graphNodes[0].id, graphNodes[1].id);
                          } else {
                            showDsMessage("❌ Need at least 2 nodes to add edge", "error");
                          }
                        }} variant="outline" className="w-full">
                          Add Edge
                        </Button>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Traversals</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button onClick={dfsGraph} variant="outline" className="w-full text-sm">
                              DFS
                            </Button>
                            <Button onClick={bfsGraph} variant="outline" className="w-full text-sm">
                              BFS
                            </Button>
                          </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Analysis</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button onClick={getGraphDegree} variant="outline" className="w-full text-xs">
                              Degrees
                            </Button>
                            <Button onClick={detectCycleGraph} variant="outline" className="w-full text-xs">
                              Cycle
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={checkEmpty} variant="outline" className="w-full text-sm">
                            isEmpty
                          </Button>
                          <Button onClick={generateRandomDs} variant="outline" className="w-full text-sm">
                            🎲 Random
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button onClick={undoDs} disabled={dsHistoryIndex <= 0} variant="outline" className="w-full text-sm" title="Ctrl+Z">
                            ↩️ Undo
                          </Button>
                          <Button onClick={redoDs} disabled={dsHistoryIndex >= dsHistory.length - 1} variant="outline" className="w-full text-sm" title="Ctrl+Y">
                            ↪️ Redo
                          </Button>
                        </div>
                        <Button onClick={exportDataStructure} variant="outline" className="w-full">
                          📋 Export
                        </Button>
                        <Button onClick={clearDataStructure} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Clear Graph
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold">Performance Metrics</h3>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Total Operations:</span>
                      <span className="font-semibold">{dsMetrics.totalOps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600 dark:text-green-400">Successful:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{dsMetrics.successfulOps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600 dark:text-red-400">Failed:</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">{dsMetrics.failedOps}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">History:</span>
                      <span className="font-semibold">{dsHistoryIndex + 1} / {dsHistory.length}</span>
                    </div>
                  </div>
                </div>

                {/* Animation Speed Control */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold">Animation Speed</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Speed:</span>
                      <span className="font-semibold">{dsAnimationSpeed}ms</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="100"
                      value={dsAnimationSpeed}
                      onChange={(e) => setDsAnimationSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Fast</span>
                      <span>Slow</span>
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold">Keyboard Shortcuts</h3>
                  </div>
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Undo:</span>
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Ctrl+Z</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Redo:</span>
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Ctrl+Y</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Random:</span>
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Ctrl+R</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Clear:</span>
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">Ctrl+D</kbd>
                    </div>
                  </div>
                </div>

                {/* Info Panel */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold">Statistics</h3>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    {selectedDataStructure === "stack" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Size:</span>
                          <span className="font-semibold">{stackElements.length} / 8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Top:</span>
                          <span className="font-semibold">{stackElements.length > 0 ? stackElements[stackElements.length - 1].value : "Empty"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Is Empty:</span>
                          <span className="font-semibold">{stackElements.length === 0 ? "Yes" : "No"}</span>
                        </div>
                      </>
                    )}
                    {selectedDataStructure === "queue" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Size:</span>
                          <span className="font-semibold">{queueElements.length} / 8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Front:</span>
                          <span className="font-semibold">{queueElements.length > 0 ? queueElements[0].value : "Empty"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Rear:</span>
                          <span className="font-semibold">{queueElements.length > 0 ? queueElements[queueElements.length - 1].value : "Empty"}</span>
                        </div>
                      </>
                    )}
                    {selectedDataStructure === "linkedList" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Length:</span>
                          <span className="font-semibold">{linkedListNodes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Head:</span>
                          <span className="font-semibold">{linkedListNodes.length > 0 ? linkedListNodes[0].value : "NULL"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Tail:</span>
                          <span className="font-semibold">{linkedListNodes.length > 0 ? linkedListNodes[linkedListNodes.length - 1].value : "NULL"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Complexity Info */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold">Time Complexity</h3>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    {selectedDataStructure === "stack" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Push:</span>
                          <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Pop:</span>
                          <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Peek:</span>
                          <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                        </div>
                      </>
                    )}
                    {selectedDataStructure === "queue" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Enqueue:</span>
                          <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Dequeue:</span>
                          <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                        </div>
                      </>
                    )}
                    {selectedDataStructure === "linkedList" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Insert at Head:</span>
                          <span className="font-mono text-green-600 dark:text-green-400">O(1)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Insert at Tail:</span>
                          <span className="font-mono text-yellow-600 dark:text-yellow-400">O(n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Delete:</span>
                          <span className="font-mono text-yellow-600 dark:text-yellow-400">O(n)</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

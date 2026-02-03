"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Layers, GitBranch, TreeDeciduous, Network,
  Plus, Minus, Shuffle, Trash2, Info, Code2, Volume2, VolumeX, Lightbulb, TrendingUp,
  Eye, ArrowRight, ArrowLeft, ArrowUp, Hash, Target, Sparkles, Edit3, Check, Search, Copy, LogIn,
  ArrowLeftRight, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressSync } from "@/hooks/useProgressSync";

type AlgorithmType = "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap" | "linear" | "binary";
type DataStructureType = "stack" | "queue" | "linkedlist" | "doublylinkedlist" | "bst" | "graph";
type ViewMode = "algorithms" | "datastructures";
type CodeLanguage = "javascript" | "python" | "java" | "cpp";

interface ArrayBar { value: number; state: "default" | "comparing" | "swapping" | "sorted" | "pivot" | "searching" | "found" | "min"; id: string; }
interface AlgorithmInfo { name: string; description: string; timeComplexity: { best: string; average: string; worst: string }; spaceComplexity: string; stable: boolean; steps: string[]; }
interface StackItem { value: number; id: string; }
interface QueueItem { value: number; id: string; }
interface LinkedListNode { value: number; id: string; next: string | null; }
interface DoublyLinkedListNode { value: number; id: string; next: string | null; prev: string | null; }
interface BSTNode { value: number; id: string; left: string | null; right: string | null; state: "default" | "highlight" | "found" | "inserting"; }
interface GraphNode { id: string; value: number; x: number; y: number; state: "default" | "visited" | "current" | "path"; }
interface GraphEdge { from: string; to: string; }

const algorithmData: Record<AlgorithmType, AlgorithmInfo> = {
  bubble: { name: "Bubble Sort", description: "Repeatedly compares adjacent elements and swaps them if in wrong order.", timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" }, spaceComplexity: "O(1)", stable: true, steps: ["Compare adjacent", "Swap if left > right", "Repeat for all", "Largest bubbles up", "Repeat until sorted"] },
  selection: { name: "Selection Sort", description: "Finds minimum from unsorted region and moves to sorted region.", timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" }, spaceComplexity: "O(1)", stable: false, steps: ["Find minimum", "Swap to sorted", "Expand sorted", "Repeat"] },
  insertion: { name: "Insertion Sort", description: "Builds sorted array by inserting each element in correct position.", timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" }, spaceComplexity: "O(1)", stable: true, steps: ["Take unsorted", "Compare", "Shift larger", "Insert", "Repeat"] },
  merge: { name: "Merge Sort", description: "Divides array into halves, sorts recursively, merges sorted halves.", timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" }, spaceComplexity: "O(n)", stable: true, steps: ["Divide halves", "Sort each", "Merge", "Compare & place", "Done"] },
  quick: { name: "Quick Sort", description: "Selects pivot, partitions array around it.", timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" }, spaceComplexity: "O(log n)", stable: false, steps: ["Select pivot", "Partition", "Left < pivot", "Right > pivot", "Recurse"] },
  heap: { name: "Heap Sort", description: "Uses binary heap to extract maximum repeatedly.", timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" }, spaceComplexity: "O(1)", stable: false, steps: ["Build max heap", "Swap root", "Reduce heap", "Heapify", "Repeat"] },
  linear: { name: "Linear Search", description: "Checks each element sequentially until match found.", timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" }, spaceComplexity: "O(1)", stable: true, steps: ["Start first", "Compare target", "Match? return", "Next element", "Repeat"] },
  binary: { name: "Binary Search", description: "Divides sorted array in half repeatedly to find target.", timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" }, spaceComplexity: "O(1)", stable: true, steps: ["Must be sorted", "Find middle", "Match? return", "< go left", "> go right"] }
};

const algorithmCode: Record<AlgorithmType, Record<CodeLanguage, string>> = {
  bubble: {
    javascript: `function bubbleSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}`,
    python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n - 1):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`,
    java: `public static void bubbleSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}`,
    cpp: `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                swap(arr[j], arr[j + 1]);\n            }\n        }\n    }\n}`
  },
  selection: {
    javascript: `function selectionSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < n; j++) {\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    }\n    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }\n  return arr;\n}`,
    python: `def selection_sort(arr):\n    n = len(arr)\n    for i in range(n - 1):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr`,
    java: `public static void selectionSort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        int temp = arr[i];\n        arr[i] = arr[minIdx];\n        arr[minIdx] = temp;\n    }\n}`,
    cpp: `void selectionSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        swap(arr[i], arr[minIdx]);\n    }\n}`
  },
  insertion: {
    javascript: `function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    let key = arr[i], j = i - 1;\n    while (j >= 0 && arr[j] > key) {\n      arr[j + 1] = arr[j];\n      j--;\n    }\n    arr[j + 1] = key;\n  }\n  return arr;\n}`,
    python: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr`,
    java: `public static void insertionSort(int[] arr) {\n    for (int i = 1; i < arr.length; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}`,
    cpp: `void insertionSort(int arr[], int n) {\n    for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}`
  },
  merge: {
    javascript: `function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}`,
    python: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)`,
    java: `public static void mergeSort(int[] arr, int l, int r) {\n    if (l < r) {\n        int m = (l + r) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}`,
    cpp: `void mergeSort(int arr[], int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}`
  },
  quick: {
    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {\n  if (low < high) {\n    const pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n  }\n  return arr;\n}`,
    python: `def quick_sort(arr, low=0, high=None):\n    if high is None:\n        high = len(arr) - 1\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi - 1)\n        quick_sort(arr, pi + 1, high)\n    return arr`,
    java: `public static void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
    cpp: `void quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`
  },
  heap: {
    javascript: `function heapSort(arr) {\n  const n = arr.length;\n  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)\n    heapify(arr, n, i);\n  for (let i = n - 1; i > 0; i--) {\n    [arr[0], arr[i]] = [arr[i], arr[0]];\n    heapify(arr, i, 0);\n  }\n  return arr;\n}`,
    python: `def heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n    return arr`,
    java: `public static void heapSort(int[] arr) {\n    int n = arr.length;\n    for (int i = n / 2 - 1; i >= 0; i--)\n        heapify(arr, n, i);\n    for (int i = n - 1; i > 0; i--) {\n        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;\n        heapify(arr, i, 0);\n    }\n}`,
    cpp: `void heapSort(int arr[], int n) {\n    for (int i = n / 2 - 1; i >= 0; i--)\n        heapify(arr, n, i);\n    for (int i = n - 1; i > 0; i--) {\n        swap(arr[0], arr[i]);\n        heapify(arr, i, 0);\n    }\n}`
  },
  linear: {
    javascript: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}`,
    python: `def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1`,
    java: `public static int linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
    cpp: `int linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`
  },
  binary: {
    javascript: `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
    python: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
    java: `public static int binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`,
    cpp: `int binarySearch(int arr[], int n, int target) {\n    int left = 0, right = n - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`
  }
};

const languageLabels: Record<CodeLanguage, string> = { javascript: "JavaScript", python: "Python", java: "Java", cpp: "C++" };

export default function VisualizerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("algorithms");
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("bubble");
  const [array, setArray] = useState<ArrayBar[]>([]);
  const [arraySize, setArraySize] = useState(15);
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [searchTarget, setSearchTarget] = useState<number | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("python");
  const [customInputMode, setCustomInputMode] = useState(false);
  const [customArrayInput, setCustomArrayInput] = useState("");
  const [customSearchTarget, setCustomSearchTarget] = useState("");
  const [dsType, setDsType] = useState<DataStructureType>("stack");
  const [stack, setStack] = useState<StackItem[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [linkedList, setLinkedList] = useState<LinkedListNode[]>([]);
  const [doublyLinkedList, setDoublyLinkedList] = useState<DoublyLinkedListNode[]>([]);
  const [bstNodes, setBstNodes] = useState<Map<string, BSTNode>>(new Map());
  const [bstRoot, setBstRoot] = useState<string | null>(null);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [indexValue, setIndexValue] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [message, setMessage] = useState("");
  const [showCode, setShowCode] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncNotification, setSyncNotification] = useState<{ show: boolean; xp: number } | null>(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const stepsRef = useRef<{ array: ArrayBar[]; comparing?: number[]; swapping?: number[] }[]>([]);
  const stepIndexRef = useRef(0);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPausedRef = useRef(false);
  
  const { syncVisualization, syncDataStructure, isAuthenticated } = useProgressSync();

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const generateArray = useCallback(() => {
    stopAnimation();
    const newArray: ArrayBar[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({ value: Math.floor(Math.random() * 85) + 15, state: "default", id: generateId() });
    }
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setTotalSteps(0);
    stepsRef.current = [];
    stepIndexRef.current = 0;
  }, [arraySize]);

  const applyCustomArray = () => {
    const values = customArrayInput.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0 && v <= 100);
    if (values.length < 2) { showToast("Enter at least 2 valid numbers (1-100)"); return; }
    if (values.length > 30) { showToast("Maximum 30 elements allowed"); return; }
    stopAnimation();
    const newArray: ArrayBar[] = values.map(v => ({ value: v, state: "default" as const, id: generateId() }));
    setArray(newArray);
    setArraySize(values.length);
    setComparisons(0); setSwaps(0); setCurrentStep(0); setTotalSteps(0);
    stepsRef.current = []; stepIndexRef.current = 0;
    setCustomInputMode(false);
    showToast(`Applied custom array with ${values.length} elements`);
  };

  const applySearchTarget = () => {
    const target = parseInt(customSearchTarget);
    if (isNaN(target) || target < 1 || target > 100) { showToast("Enter a valid number (1-100)"); return; }
    setSearchTarget(target);
    showToast(`Search target set to ${target}`);
  };

  useEffect(() => { generateArray(); initializeDataStructures(); }, []);
  useEffect(() => { if (!customInputMode) generateArray(); }, [arraySize, customInputMode]);

  const initializeDataStructures = () => {
    setStack([{ value: 42, id: generateId() }, { value: 17, id: generateId() }, { value: 88, id: generateId() }]);
    setQueue([{ value: 23, id: generateId() }, { value: 56, id: generateId() }, { value: 11, id: generateId() }]);
    setLinkedList([{ value: 10, id: "node1", next: "node2" }, { value: 20, id: "node2", next: "node3" }, { value: 30, id: "node3", next: null }]);
    setDoublyLinkedList([
      { value: 10, id: "dll1", next: "dll2", prev: null },
      { value: 20, id: "dll2", next: "dll3", prev: "dll1" },
      { value: 30, id: "dll3", next: null, prev: "dll2" }
    ]);
    initializeBST([50, 30, 70, 20, 40, 60, 80]);
    initializeGraph();
  };

  const initializeBST = (values: number[]) => {
    const newNodes = new Map<string, BSTNode>();
    let rootId: string | null = null;
    
    values.forEach(value => {
      const nodeId = generateId();
      const newNode: BSTNode = { value, id: nodeId, left: null, right: null, state: "default" };
      
      if (!rootId) {
        rootId = nodeId;
        newNodes.set(nodeId, newNode);
      } else {
        let currentId = rootId;
        while (currentId) {
          const current = newNodes.get(currentId)!;
          if (value < current.value) {
            if (current.left === null) {
              current.left = nodeId;
              newNodes.set(nodeId, newNode);
              break;
            }
            currentId = current.left;
          } else {
            if (current.right === null) {
              current.right = nodeId;
              newNodes.set(nodeId, newNode);
              break;
            }
            currentId = current.right;
          }
        }
      }
    });
    
    setBstNodes(newNodes);
    setBstRoot(rootId);
  };

  const initializeGraph = () => {
    const nodes: GraphNode[] = [
      { id: "A", value: 1, x: 200, y: 50, state: "default" },
      { id: "B", value: 2, x: 100, y: 150, state: "default" },
      { id: "C", value: 3, x: 300, y: 150, state: "default" },
      { id: "D", value: 4, x: 50, y: 250, state: "default" },
      { id: "E", value: 5, x: 150, y: 250, state: "default" },
      { id: "F", value: 6, x: 350, y: 250, state: "default" },
    ];
    const edges: GraphEdge[] = [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "D" },
      { from: "B", to: "E" },
      { from: "C", to: "F" },
      { from: "E", to: "F" },
    ];
    setGraphNodes(nodes);
    setGraphEdges(edges);
  };

  const playSound = useCallback((frequency: number, duration: number = 50) => {
    if (!soundEnabled) return;
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = frequency; osc.type = "sine";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration / 1000);
  }, [soundEnabled]);

  const stopAnimation = () => { if (animationRef.current) { clearTimeout(animationRef.current); animationRef.current = null; } setIsRunning(false); setIsPaused(false); isPausedRef.current = false; };

  const generateBubbleSortSteps = (arr: ArrayBar[]) => {
    const steps: { array: ArrayBar[]; comparing?: number[]; swapping?: number[] }[] = [];
    const tempArr = arr.map(item => ({ ...item }));
    const n = tempArr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === j || idx === j + 1 ? "comparing" as const : idx >= n - i ? "sorted" as const : "default" as const })), comparing: [j, j + 1] });
        if (tempArr[j].value > tempArr[j + 1].value) {
          [tempArr[j], tempArr[j + 1]] = [tempArr[j + 1], tempArr[j]];
          steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === j || idx === j + 1 ? "swapping" as const : idx >= n - i ? "sorted" as const : "default" as const })), swapping: [j, j + 1] });
        }
      }
    }
    steps.push({ array: tempArr.map(item => ({ ...item, state: "sorted" as const })) });
    return steps;
  };

  const generateSelectionSortSteps = (arr: ArrayBar[]) => {
    const steps: { array: ArrayBar[]; comparing?: number[]; swapping?: number[] }[] = [];
    const tempArr = arr.map(item => ({ ...item }));
    const n = tempArr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx < i ? "sorted" as const : idx === minIdx ? "min" as const : idx === j ? "comparing" as const : "default" as const })), comparing: [minIdx, j] });
        if (tempArr[j].value < tempArr[minIdx].value) minIdx = j;
      }
      if (minIdx !== i) { [tempArr[i], tempArr[minIdx]] = [tempArr[minIdx], tempArr[i]]; steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx <= i ? "sorted" as const : "default" as const })), swapping: [i, minIdx] }); }
    }
    steps.push({ array: tempArr.map(item => ({ ...item, state: "sorted" as const })) });
    return steps;
  };

  const generateInsertionSortSteps = (arr: ArrayBar[]) => {
    const steps: { array: ArrayBar[]; comparing?: number[]; swapping?: number[] }[] = [];
    const tempArr = arr.map(item => ({ ...item }));
    for (let i = 1; i < tempArr.length; i++) {
      let j = i;
      while (j > 0 && tempArr[j - 1].value > tempArr[j].value) {
        steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === j || idx === j - 1 ? "comparing" as const : "default" as const })), comparing: [j - 1, j] });
        [tempArr[j], tempArr[j - 1]] = [tempArr[j - 1], tempArr[j]];
        steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === j || idx === j - 1 ? "swapping" as const : "default" as const })), swapping: [j - 1, j] });
        j--;
      }
    }
    steps.push({ array: tempArr.map(item => ({ ...item, state: "sorted" as const })) });
    return steps;
  };

  const generateQuickSortSteps = (arr: ArrayBar[]) => {
    const steps: { array: ArrayBar[]; comparing?: number[]; swapping?: number[] }[] = [];
    const tempArr = arr.map(item => ({ ...item }));
    const sortedIndices = new Set<number>();
    const qs = (low: number, high: number) => {
      if (low < high) {
        const pivot = tempArr[high].value;
        let i = low - 1;
        steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === high ? "pivot" as const : sortedIndices.has(idx) ? "sorted" as const : "default" as const })) });
        for (let j = low; j < high; j++) {
          steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === high ? "pivot" as const : idx === j ? "comparing" as const : sortedIndices.has(idx) ? "sorted" as const : "default" as const })), comparing: [j, high] });
          if (tempArr[j].value < pivot) { i++; if (i !== j) { [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]]; steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === i || idx === j ? "swapping" as const : idx === high ? "pivot" as const : sortedIndices.has(idx) ? "sorted" as const : "default" as const })), swapping: [i, j] }); } }
        }
        [tempArr[i + 1], tempArr[high]] = [tempArr[high], tempArr[i + 1]];
        sortedIndices.add(i + 1);
        steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: sortedIndices.has(idx) ? "sorted" as const : "default" as const })), swapping: [i + 1, high] });
        qs(low, i); qs(i + 2, high);
      } else if (low === high) sortedIndices.add(low);
    };
    qs(0, tempArr.length - 1);
    steps.push({ array: tempArr.map(item => ({ ...item, state: "sorted" as const })) });
    return steps;
  };

  const generateLinearSearchSteps = (arr: ArrayBar[], target: number) => {
    const steps: { array: ArrayBar[]; comparing?: number[] }[] = [];
    const tempArr = arr.map(item => ({ ...item }));
    for (let i = 0; i < tempArr.length; i++) {
      steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === i ? "searching" as const : "default" as const })), comparing: [i] });
      if (tempArr[i].value === target) { steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === i ? "found" as const : "default" as const })) }); return steps; }
    }
    return steps;
  };

  const generateBinarySearchSteps = (arr: ArrayBar[], target: number) => {
    const steps: { array: ArrayBar[]; comparing?: number[] }[] = [];
    const tempArr = [...arr].sort((a, b) => a.value - b.value).map(item => ({ ...item, state: "default" as const }));
    steps.push({ array: tempArr.map(item => ({ ...item, state: "sorted" as const })) });
    let left = 0, right = tempArr.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === mid ? "searching" as const : idx >= left && idx <= right ? "comparing" as const : "default" as const })), comparing: [mid] });
      if (tempArr[mid].value === target) { steps.push({ array: tempArr.map((item, idx) => ({ ...item, state: idx === mid ? "found" as const : "default" as const })) }); return steps; }
      else if (tempArr[mid].value < target) left = mid + 1;
      else right = mid - 1;
    }
    return steps;
  };

  const runAlgorithm = () => {
    if (isRunning && !isPaused) { setIsPaused(true); isPausedRef.current = true; return; }
    if (isPaused) { setIsPaused(false); isPausedRef.current = false; animateSteps(); return; }
    let steps: { array: ArrayBar[]; comparing?: number[]; swapping?: number[] }[] = [];
    if (algorithm === "linear" || algorithm === "binary") {
      const target = searchTarget ?? array[Math.floor(Math.random() * array.length)].value;
      setSearchTarget(target);
      steps = algorithm === "linear" ? generateLinearSearchSteps(array, target) : generateBinarySearchSteps(array, target);
    } else {
      switch (algorithm) {
        case "bubble": steps = generateBubbleSortSteps(array); break;
        case "selection": steps = generateSelectionSortSteps(array); break;
        case "insertion": steps = generateInsertionSortSteps(array); break;
        case "quick": steps = generateQuickSortSteps(array); break;
        default: steps = generateBubbleSortSteps(array);
      }
    }
    stepsRef.current = steps; stepIndexRef.current = 0; setTotalSteps(steps.length); setIsRunning(true); animateSteps();
  };

  const animateSteps = () => {
    const animate = async () => {
      if (isPausedRef.current) return;
      if (stepIndexRef.current >= stepsRef.current.length) { 
        setIsRunning(false); 
        setIsPaused(false);
        isPausedRef.current = false;
        const result = await syncVisualization(algorithm);
        if (result?.success && result?.xpGained && result.xpGained > 0) {
          setSyncNotification({ show: true, xp: result.xpGained });
          setTimeout(() => setSyncNotification(null), 3000);
        }
        return; 
      }
      const step = stepsRef.current[stepIndexRef.current];
      setArray(step.array); setCurrentStep(stepIndexRef.current + 1);
      if (step.comparing) { setComparisons(p => p + 1); if (soundEnabled) playSound(200 + step.array[step.comparing[0]].value * 5); }
      if (step.swapping) { setSwaps(p => p + 1); if (soundEnabled) playSound(600, 30); }
      stepIndexRef.current++;
      animationRef.current = setTimeout(animate, Math.max(10, 500 - speed * 4));
    };
    animate();
  };

  const stepForward = () => { if (stepIndexRef.current < stepsRef.current.length) { setArray(stepsRef.current[stepIndexRef.current].array); setCurrentStep(stepIndexRef.current + 1); stepIndexRef.current++; } };
  const stepBackward = () => { if (stepIndexRef.current > 0) { stepIndexRef.current--; setArray(stepsRef.current[stepIndexRef.current].array); setCurrentStep(stepIndexRef.current); } };
  const reset = () => { stopAnimation(); generateArray(); };
  const showToast = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 2000); };
  const copyCode = () => { navigator.clipboard.writeText(algorithmCode[algorithm][codeLanguage]); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // Stack Operations
  const pushStack = async () => { const val = parseInt(inputValue); if (isNaN(val)) return showToast("Enter a valid number"); if (stack.length >= 8) return showToast("Stack Overflow!"); setStack([...stack, { value: val, id: generateId() }]); setInputValue(""); showToast(`Pushed ${val}`); syncDataStructure("stack", "push"); };
  const popStack = async () => { if (stack.length === 0) return showToast("Stack Underflow!"); showToast(`Popped ${stack[stack.length - 1].value}`); setStack(stack.slice(0, -1)); syncDataStructure("stack", "pop"); };
  
  // Queue Operations
  const enqueue = async () => { const val = parseInt(inputValue); if (isNaN(val)) return showToast("Enter a valid number"); if (queue.length >= 8) return showToast("Queue Full!"); setQueue([...queue, { value: val, id: generateId() }]); setInputValue(""); showToast(`Enqueued ${val}`); syncDataStructure("queue", "enqueue"); };
  const dequeue = async () => { if (queue.length === 0) return showToast("Queue Empty!"); showToast(`Dequeued ${queue[0].value}`); setQueue(queue.slice(1)); syncDataStructure("queue", "dequeue"); };
  
  // Singly Linked List Operations
  const insertAtHead = async () => { const val = parseInt(inputValue); if (isNaN(val)) return showToast("Enter a valid number"); if (linkedList.length >= 10) return showToast("Maximum size reached!"); const newId = generateId(); setLinkedList([{ value: val, id: newId, next: linkedList[0]?.id || null }, ...linkedList]); setInputValue(""); showToast(`Inserted ${val} at head`); syncDataStructure("linkedlist", "insert"); };
  const deleteFromHead = async () => { if (linkedList.length === 0) return showToast("List is empty!"); showToast(`Deleted ${linkedList[0].value}`); setLinkedList(linkedList.slice(1)); syncDataStructure("linkedlist", "delete"); };
  const insertAtIndex = async () => {
    const val = parseInt(inputValue);
    const idx = parseInt(indexValue);
    if (isNaN(val)) return showToast("Enter a valid number");
    if (isNaN(idx) || idx < 0 || idx > linkedList.length) return showToast(`Index must be 0-${linkedList.length}`);
    if (linkedList.length >= 10) return showToast("Maximum size reached!");
    
    const newId = generateId();
    const newList = [...linkedList];
    const newNode: LinkedListNode = { value: val, id: newId, next: newList[idx]?.id || null };
    newList.splice(idx, 0, newNode);
    if (idx > 0) newList[idx - 1].next = newId;
    setLinkedList(newList);
    setInputValue("");
    setIndexValue("");
    showToast(`Inserted ${val} at index ${idx}`);
    syncDataStructure("linkedlist", "insert");
  };

  // Doubly Linked List Operations
  const insertDoublyAtHead = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return showToast("Enter a valid number");
    if (doublyLinkedList.length >= 10) return showToast("Maximum size reached!");
    
    const newId = generateId();
    const newList = [...doublyLinkedList];
    if (newList.length > 0) newList[0].prev = newId;
    newList.unshift({ value: val, id: newId, next: doublyLinkedList[0]?.id || null, prev: null });
    setDoublyLinkedList(newList);
    setInputValue("");
    showToast(`Inserted ${val} at head`);
    syncDataStructure("doublylinkedlist", "insert");
  };

  const insertDoublyAtTail = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return showToast("Enter a valid number");
    if (doublyLinkedList.length >= 10) return showToast("Maximum size reached!");
    
    const newId = generateId();
    const newList = [...doublyLinkedList];
    if (newList.length > 0) newList[newList.length - 1].next = newId;
    newList.push({ value: val, id: newId, next: null, prev: doublyLinkedList[doublyLinkedList.length - 1]?.id || null });
    setDoublyLinkedList(newList);
    setInputValue("");
    showToast(`Inserted ${val} at tail`);
    syncDataStructure("doublylinkedlist", "insert");
  };

  const insertDoublyAtIndex = async () => {
    const val = parseInt(inputValue);
    const idx = parseInt(indexValue);
    if (isNaN(val)) return showToast("Enter a valid number");
    if (isNaN(idx) || idx < 0 || idx > doublyLinkedList.length) return showToast(`Index must be 0-${doublyLinkedList.length}`);
    if (doublyLinkedList.length >= 10) return showToast("Maximum size reached!");
    
    const newId = generateId();
    const newList = [...doublyLinkedList];
    const prevNode = idx > 0 ? newList[idx - 1] : null;
    const nextNode = newList[idx] || null;
    
    const newNode: DoublyLinkedListNode = {
      value: val,
      id: newId,
      next: nextNode?.id || null,
      prev: prevNode?.id || null
    };
    
    if (prevNode) prevNode.next = newId;
    if (nextNode) nextNode.prev = newId;
    
    newList.splice(idx, 0, newNode);
    setDoublyLinkedList(newList);
    setInputValue("");
    setIndexValue("");
    showToast(`Inserted ${val} at index ${idx}`);
    syncDataStructure("doublylinkedlist", "insert");
  };

  const deleteDoublyFromHead = async () => {
    if (doublyLinkedList.length === 0) return showToast("List is empty!");
    const newList = doublyLinkedList.slice(1);
    if (newList.length > 0) newList[0].prev = null;
    setDoublyLinkedList(newList);
    showToast(`Deleted from head`);
    syncDataStructure("doublylinkedlist", "delete");
  };

  const deleteDoublyFromTail = async () => {
    if (doublyLinkedList.length === 0) return showToast("List is empty!");
    const newList = doublyLinkedList.slice(0, -1);
    if (newList.length > 0) newList[newList.length - 1].next = null;
    setDoublyLinkedList(newList);
    showToast(`Deleted from tail`);
    syncDataStructure("doublylinkedlist", "delete");
  };

  // BST Operations
  const insertBST = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return showToast("Enter a valid number");
    if (bstNodes.size >= 15) return showToast("Maximum nodes reached!");
    
    const nodeId = generateId();
    const newNode: BSTNode = { value: val, id: nodeId, left: null, right: null, state: "inserting" };
    
    if (!bstRoot) {
      setBstNodes(new Map([[nodeId, newNode]]));
      setBstRoot(nodeId);
    } else {
      const newNodes = new Map(bstNodes);
      let currentId = bstRoot;
      
      while (currentId) {
        const current = newNodes.get(currentId)!;
        if (val < current.value) {
          if (current.left === null) {
            current.left = nodeId;
            newNodes.set(nodeId, newNode);
            break;
          }
          currentId = current.left;
        } else {
          if (current.right === null) {
            current.right = nodeId;
            newNodes.set(nodeId, newNode);
            break;
          }
          currentId = current.right;
        }
      }
      setBstNodes(newNodes);
    }
    setInputValue("");
    showToast(`Inserted ${val} into BST`);
    syncDataStructure("bst", "insert");
    
    setTimeout(() => {
      setBstNodes(prev => {
        const updated = new Map(prev);
        const node = updated.get(nodeId);
        if (node) node.state = "default";
        return updated;
      });
    }, 1000);
  };

  const searchBST = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return showToast("Enter a value to search");
    if (!bstRoot) return showToast("BST is empty!");
    
    setIsTraversing(true);
    const path: string[] = [];
    let currentId: string | null = bstRoot;
    let found = false;
    
    while (currentId) {
      path.push(currentId);
      const current: BSTNode = bstNodes.get(currentId)!;
      
      setBstNodes(prev => {
        const updated = new Map(prev);
        path.forEach(id => {
          const node = updated.get(id);
          if (node) node.state = id === currentId ? "highlight" : "default";
        });
        return updated;
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (current.value === val) {
        found = true;
        setBstNodes(prev => {
          const updated = new Map(prev);
          const node = updated.get(currentId!);
          if (node) node.state = "found";
          return updated;
        });
        break;
      } else if (val < current.value) {
        currentId = current.left;
      } else {
        currentId = current.right;
      }
    }
    
    showToast(found ? `Found ${val}!` : `${val} not found`);
    setIsTraversing(false);
    
    setTimeout(() => {
      setBstNodes(prev => {
        const updated = new Map(prev);
        updated.forEach(node => node.state = "default");
        return updated;
      });
    }, 1500);
  };

  const clearBST = () => {
    setBstNodes(new Map());
    setBstRoot(null);
    showToast("BST cleared");
  };

  // Graph Operations
  const addGraphNode = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return showToast("Enter a valid number");
    if (graphNodes.length >= 10) return showToast("Maximum nodes reached!");
    
    const id = String.fromCharCode(65 + graphNodes.length);
    const x = 100 + Math.random() * 200;
    const y = 100 + Math.random() * 150;
    
    setGraphNodes([...graphNodes, { id, value: val, x, y, state: "default" }]);
    setInputValue("");
    showToast(`Added node ${id} with value ${val}`);
    syncDataStructure("graph", "add-node");
  };

  const addGraphEdge = async () => {
    if (!edgeFrom || !edgeTo) return showToast("Enter both nodes");
    const fromNode = graphNodes.find(n => n.id.toLowerCase() === edgeFrom.toLowerCase());
    const toNode = graphNodes.find(n => n.id.toLowerCase() === edgeTo.toLowerCase());
    
    if (!fromNode || !toNode) return showToast("Node not found");
    if (edgeFrom === edgeTo) return showToast("Cannot connect node to itself");
    
    const existingEdge = graphEdges.find(e => 
      (e.from === fromNode.id && e.to === toNode.id) ||
      (e.from === toNode.id && e.to === fromNode.id)
    );
    if (existingEdge) return showToast("Edge already exists");
    
    setGraphEdges([...graphEdges, { from: fromNode.id, to: toNode.id }]);
    setEdgeFrom("");
    setEdgeTo("");
    showToast(`Added edge ${fromNode.id} → ${toNode.id}`);
    syncDataStructure("graph", "add-edge");
  };

  const runBFS = async () => {
    if (graphNodes.length === 0) return showToast("Add some nodes first");
    setIsTraversing(true);
    
    const visited = new Set<string>();
    const queue: string[] = [graphNodes[0].id];
    const path: string[] = [];
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      
      visited.add(nodeId);
      path.push(nodeId);
      
      setGraphNodes(prev => prev.map(n => ({
        ...n,
        state: n.id === nodeId ? "current" : visited.has(n.id) ? "visited" : "default"
      })));
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const neighbors = graphEdges
        .filter(e => e.from === nodeId || e.to === nodeId)
        .map(e => e.from === nodeId ? e.to : e.from)
        .filter(id => !visited.has(id));
      
      queue.push(...neighbors);
    }
    
    showToast(`BFS Complete: ${path.join(" → ")}`);
    setIsTraversing(false);
    
    setTimeout(() => {
      setGraphNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    }, 2000);
  };

  const runDFS = async () => {
    if (graphNodes.length === 0) return showToast("Add some nodes first");
    setIsTraversing(true);
    
    const visited = new Set<string>();
    const path: string[] = [];
    
    const dfs = async (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      path.push(nodeId);
      
      setGraphNodes(prev => prev.map(n => ({
        ...n,
        state: n.id === nodeId ? "current" : visited.has(n.id) ? "visited" : "default"
      })));
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const neighbors = graphEdges
        .filter(e => e.from === nodeId || e.to === nodeId)
        .map(e => e.from === nodeId ? e.to : e.from)
        .filter(id => !visited.has(id));
      
      for (const neighbor of neighbors) {
        await dfs(neighbor);
      }
    };
    
    await dfs(graphNodes[0].id);
    
    showToast(`DFS Complete: ${path.join(" → ")}`);
    setIsTraversing(false);
    
    setTimeout(() => {
      setGraphNodes(prev => prev.map(n => ({ ...n, state: "default" })));
    }, 2000);
  };

  const clearGraph = () => {
    setGraphNodes([]);
    setGraphEdges([]);
    showToast("Graph cleared");
  };

  const getBarColor = (state: ArrayBar["state"]) => {
    switch (state) {
      case "comparing": return "from-yellow-400 to-amber-500";
      case "swapping": return "from-red-400 to-rose-500";
      case "sorted": return "from-emerald-400 to-green-500";
      case "pivot": return "from-orange-400 to-amber-500";
      case "searching": return "from-blue-400 to-cyan-500";
      case "found": return "from-green-400 to-emerald-500";
      case "min": return "from-orange-400 to-amber-500";
      default: return "from-blue-400 to-cyan-500";
    }
  };

  const currentAlgo = algorithmData[algorithm];

  // BST Rendering Helper
  const renderBST = (nodeId: string | null, x: number, y: number, level: number, offset: number): React.JSX.Element | null => {
    if (!nodeId) return null;
    const node = bstNodes.get(nodeId);
    if (!node) return null;
    
    const leftX = x - offset;
    const rightX = x + offset;
    const childY = y + 70;
    const nextOffset = Math.max(30, offset / 2);
    
    return (
      <g key={nodeId}>
        {node.left && (
          <line x1={x} y1={y + 20} x2={leftX} y2={childY - 20} stroke="#a855f7" strokeWidth="2" />
        )}
        {node.right && (
          <line x1={x} y1={y + 20} x2={rightX} y2={childY - 20} stroke="#a855f7" strokeWidth="2" />
        )}
        
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
          <circle
            cx={x}
            cy={y}
            r={22}
            className={cn(
              "transition-colors duration-300",
              node.state === "default" ? "fill-purple-500" :
              node.state === "highlight" ? "fill-yellow-500" :
              node.state === "found" ? "fill-green-500" :
              "fill-cyan-500"
            )}
            stroke="white"
            strokeWidth="2"
          />
          <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-sm font-bold">
            {node.value}
          </text>
        </motion.g>
        
        {renderBST(node.left, leftX, childY, level + 1, nextOffset)}
        {renderBST(node.right, rightX, childY, level + 1, nextOffset)}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1800px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-gray-800 hover:text-purple-600 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl hidden sm:block">AlgoBuddy</span>
                </Link>
                <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Interactive Visualizer</h1>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button onClick={() => setViewMode("algorithms")} className={cn("px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2", viewMode === "algorithms" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-gray-500 hover:text-gray-800")}>
                  <TrendingUp className="w-4 h-4" /><span className="hidden sm:inline">Algorithms</span>
                </button>
                <button onClick={() => setViewMode("datastructures")} className={cn("px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2", viewMode === "datastructures" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-gray-500 hover:text-gray-800")}>
                  <Layers className="w-4 h-4" /><span className="hidden sm:inline">Data Structures</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => setSoundEnabled(!soundEnabled)} className={cn("p-2 rounded-lg transition-colors", soundEnabled ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500 hover:text-gray-800")} title={soundEnabled ? "Mute" : "Enable Sound"}>
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <button onClick={() => setShowCode(!showCode)} className={cn("p-2 rounded-lg transition-colors", showCode ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500 hover:text-gray-800")} title="Toggle Code">
                  <Code2 className="w-5 h-5" />
                </button>
                <button onClick={() => setShowInfo(!showInfo)} className={cn("p-2 rounded-lg transition-colors", showInfo ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500 hover:text-gray-800")} title="Toggle Info">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg">
              {message}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {syncNotification?.show && (
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.8 }} className="fixed top-20 right-4 z-50 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>+{syncNotification.xp} XP - Progress Saved!</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isAuthenticated && (
          <div className="max-w-[1800px] mx-auto px-4 mt-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Sign in to save your progress and earn XP!</span>
              </div>
              <Link href="/auth/signin" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                Sign In
              </Link>
            </div>
          </div>
        )}
        
        <main className="max-w-[1800px] mx-auto p-4">
          <AnimatePresence mode="wait">
            {viewMode === "algorithms" ? (
              <motion.div key="algorithms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm lg:sticky lg:top-24">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Sorting</h3>
                    <div className="space-y-1 mb-6">
                      {(["bubble", "selection", "insertion", "merge", "quick", "heap"] as AlgorithmType[]).map(algo => (
                        <button key={algo} onClick={() => { setAlgorithm(algo); reset(); }} className={cn("w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-all", algorithm === algo ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100")}>
                          {algorithmData[algo].name}
                        </button>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Searching</h3>
                    <div className="space-y-1">
                      {(["linear", "binary"] as AlgorithmType[]).map(algo => (
                        <button key={algo} onClick={() => { setAlgorithm(algo); reset(); }} className={cn("w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-all", algorithm === algo ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100")}>
                          {algorithmData[algo].name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={cn("col-span-12", showCode || showInfo ? "lg:col-span-6" : "lg:col-span-10")}>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-purple-500" />Custom Input
                      </h3>
                      <button onClick={() => setCustomInputMode(!customInputMode)} className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-all", customInputMode ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 hover:text-gray-800")}>
                        {customInputMode ? "Using Custom" : "Use Random"}
                      </button>
                    </div>
                    {customInputMode && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                        <div className="flex gap-2">
                          <input type="text" value={customArrayInput} onChange={(e) => setCustomArrayInput(e.target.value)} placeholder="Enter values (e.g., 64, 34, 25, 12)" className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <button onClick={applyCustomArray} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                            <Check className="w-4 h-4" />Apply
                          </button>
                        </div>
                        {(algorithm === "linear" || algorithm === "binary") && (
                          <div className="flex gap-2">
                            <input type="number" value={customSearchTarget} onChange={(e) => setCustomSearchTarget(e.target.value)} placeholder="Search target (1-100)" className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            <button onClick={applySearchTarget} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                              <Search className="w-4 h-4" />Set Target
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">Enter comma-separated values (1-100). Max 30 elements.</p>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Eye className="w-3.5 h-3.5" />Comparisons</div>
                      <div className="text-2xl font-bold text-gray-800">{comparisons}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><ArrowUp className="w-3.5 h-3.5" />Swaps</div>
                      <div className="text-2xl font-bold text-gray-800">{swaps}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Hash className="w-3.5 h-3.5" />Array Size</div>
                      <div className="text-2xl font-bold text-gray-800">{array.length}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1"><Target className="w-3.5 h-3.5" />Step</div>
                      <div className="text-2xl font-bold text-gray-800">{currentStep}/{totalSteps || "-"}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4">
                    <div className="flex items-end justify-center gap-1 h-64">
                      <AnimatePresence>
                        {array.map((bar) => (
                          <motion.div key={bar.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative flex flex-col items-center" style={{ width: `${Math.max(20, 100 / array.length - 1)}%` }}>
                            <motion.div className={cn("w-full rounded-t-lg bg-gradient-to-t shadow-lg transition-colors duration-200", getBarColor(bar.state))} style={{ height: `${bar.value * 2.5}px` }} animate={{ scale: bar.state === "comparing" || bar.state === "swapping" ? 1.05 : 1 }} />
                            {array.length <= 20 && <span className="text-xs text-gray-500 mt-1 font-mono">{bar.value}</span>}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    {(algorithm === "linear" || algorithm === "binary") && searchTarget && (
                      <div className="mt-4 text-center">
                        <span className="text-gray-500">Searching for: </span>
                        <span className="text-lg font-bold text-purple-600">{searchTarget}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <button onClick={reset} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 hover:text-gray-800 transition-colors" disabled={isRunning}>
                          <RotateCcw className="w-5 h-5" />
                        </button>
                        <button onClick={stepBackward} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 hover:text-gray-800 transition-colors" disabled={isRunning}>
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button onClick={runAlgorithm} className={cn("p-4 rounded-xl text-white shadow-lg transition-all", isRunning && !isPaused ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/25")}>
                          {isRunning && !isPaused ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </button>
                        <button onClick={stepForward} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 hover:text-gray-800 transition-colors" disabled={isRunning}>
                          <SkipForward className="w-5 h-5" />
                        </button>
                        <button onClick={generateArray} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 hover:text-gray-800 transition-colors">
                          <Shuffle className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-12">Size</span>
                          <input type="range" min="5" max="50" value={arraySize} onChange={(e) => { setArraySize(parseInt(e.target.value)); setCustomInputMode(false); }} className="w-24 accent-purple-500" disabled={isRunning} />
                          <span className="text-sm font-mono text-gray-800 w-8">{arraySize}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-12">Speed</span>
                          <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-24 accent-purple-500" />
                          <span className="text-sm font-mono text-gray-800 w-8">{speed}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs flex-wrap">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gradient-to-r from-blue-400 to-cyan-500" /><span className="text-gray-500">Default</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gradient-to-r from-yellow-400 to-amber-500" /><span className="text-gray-500">Comparing</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gradient-to-r from-red-400 to-rose-500" /><span className="text-gray-500">Swapping</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-400 to-green-500" /><span className="text-gray-500">Sorted</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {(showCode || showInfo) && (
                  <div className="col-span-12 lg:col-span-4 space-y-4">
                    {showInfo && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                            <Lightbulb className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{currentAlgo.name}</h3>
                            <p className="text-xs text-gray-500">Understanding the algorithm</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{currentAlgo.description}</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-xs text-gray-500 mb-1">Time Complexity</div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs"><span className="text-gray-500">Best:</span><span className="text-green-600 font-mono">{currentAlgo.timeComplexity.best}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-gray-500">Avg:</span><span className="text-yellow-600 font-mono">{currentAlgo.timeComplexity.average}</span></div>
                              <div className="flex justify-between text-xs"><span className="text-gray-500">Worst:</span><span className="text-red-600 font-mono">{currentAlgo.timeComplexity.worst}</span></div>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="text-xs text-gray-500 mb-1">Space</div>
                            <div className="text-lg font-mono text-purple-600">{currentAlgo.spaceComplexity}</div>
                            <div className="text-xs text-gray-500 mt-1">{currentAlgo.stable ? "✓ Stable" : "✗ Unstable"}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">How it works</div>
                          {currentAlgo.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                              <span className="text-gray-600">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {showCode && (
                      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Code2 className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-gray-800">Implementation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value as CodeLanguage)} className="bg-white text-gray-800 text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                              {Object.entries(languageLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                            </select>
                            <button onClick={copyCode} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-gray-800 transition-colors" title="Copy code">
                              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <pre className="p-4 text-xs font-mono text-gray-700 overflow-x-auto max-h-80 bg-gray-50">
                          <code>{algorithmCode[algorithm][codeLanguage]}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="datastructures" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                  {([
                    { id: "stack" as const, name: "Stack", icon: Layers, color: "from-blue-500 to-teal-500" },
                    { id: "queue" as const, name: "Queue", icon: ArrowRight, color: "from-emerald-500 to-teal-500" },
                    { id: "linkedlist" as const, name: "Singly Linked List", icon: GitBranch, color: "from-orange-500 to-red-500" },
                    { id: "doublylinkedlist" as const, name: "Doubly Linked List", icon: ArrowLeftRight, color: "from-pink-500 to-rose-500" },
                    { id: "bst" as const, name: "Binary Search Tree", icon: TreeDeciduous, color: "from-cyan-500 to-blue-500" },
                    { id: "graph" as const, name: "Graph", icon: Network, color: "from-amber-500 to-orange-500" }
                  ]).map(ds => (
                    <button key={ds.id} onClick={() => setDsType(ds.id)} className={cn("flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap shadow-sm", dsType === ds.id ? `bg-gradient-to-r ${ds.color} text-white shadow-lg` : "bg-white text-gray-600 hover:text-gray-800 border border-gray-200")}>
                      <ds.icon className="w-4 h-4" />{ds.name}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[400px]">
                      {dsType === "stack" && (
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-gray-500 mb-4 font-medium">← Top of Stack</div>
                          <div className="flex flex-col-reverse gap-2 min-h-[300px] justify-end">
                            <AnimatePresence>
                              {stack.map((item, index) => (
                                <motion.div key={item.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className={cn("w-32 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg", index === stack.length - 1 ? "bg-gradient-to-r from-blue-500 to-teal-500" : "bg-gradient-to-r from-gray-400 to-gray-500")}>
                                  {item.value}
                                  {index === stack.length - 1 && <span className="ml-2 text-xs font-normal opacity-75">TOP</span>}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {stack.length === 0 && <div className="text-gray-400 text-center">Stack is empty</div>}
                          </div>
                        </div>
                      )}
                      
                      {dsType === "queue" && (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-between w-full max-w-lg mb-4">
                            <span className="text-sm text-gray-500 font-medium">Front →</span>
                            <span className="text-sm text-gray-500 font-medium">← Rear</span>
                          </div>
                          <div className="flex gap-2 min-w-[300px] justify-center flex-wrap">
                            <AnimatePresence>
                              {queue.map((item, index) => (
                                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className={cn("w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white font-bold text-lg shadow-lg", index === 0 ? "bg-gradient-to-br from-emerald-500 to-teal-500" : index === queue.length - 1 ? "bg-gradient-to-br from-blue-500 to-cyan-500" : "bg-gradient-to-br from-gray-400 to-gray-500")}>
                                  {item.value}
                                  <span className="text-[10px] font-normal opacity-75">{index === 0 ? "FRONT" : index === queue.length - 1 ? "REAR" : ""}</span>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {queue.length === 0 && <div className="text-gray-400 text-center">Queue is empty</div>}
                          </div>
                        </div>
                      )}
                      
                      {dsType === "linkedlist" && (
                        <div className="flex items-center justify-center gap-2 overflow-x-auto py-8 flex-wrap">
                          <span className="text-sm text-gray-500 font-medium mr-2">HEAD →</span>
                          <AnimatePresence>
                            {linkedList.map((node, index) => (
                              <React.Fragment key={node.id}>
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex items-center">
                                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex flex-col items-center justify-center text-white font-bold shadow-lg">
                                    <span className="text-lg">{node.value}</span>
                                    <span className="text-[10px] opacity-75">[{index}]</span>
                                  </div>
                                </motion.div>
                                {index < linkedList.length - 1 && <ArrowRight className="w-6 h-6 text-gray-400 mx-1" />}
                              </React.Fragment>
                            ))}
                          </AnimatePresence>
                          {linkedList.length === 0 && <div className="text-gray-400">List is empty</div>}
                          {linkedList.length > 0 && <span className="text-sm text-gray-500 font-medium ml-2">→ NULL</span>}
                        </div>
                      )}
                      
                      {dsType === "doublylinkedlist" && (
                        <div className="flex items-center justify-center gap-2 overflow-x-auto py-8 flex-wrap">
                          <span className="text-sm text-gray-500 font-medium mr-2">NULL ←</span>
                          <AnimatePresence>
                            {doublyLinkedList.map((node, index) => (
                              <React.Fragment key={node.id}>
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex items-center">
                                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex flex-col items-center justify-center text-white font-bold shadow-lg">
                                    <span className="text-lg">{node.value}</span>
                                    <span className="text-[10px] opacity-75">[{index}]</span>
                                  </div>
                                </motion.div>
                                {index < doublyLinkedList.length - 1 && (
                                  <div className="flex items-center mx-1">
                                    <ArrowLeft className="w-4 h-4 text-gray-400" />
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </AnimatePresence>
                          {doublyLinkedList.length === 0 && <div className="text-gray-400">List is empty</div>}
                          {doublyLinkedList.length > 0 && <span className="text-sm text-gray-500 font-medium ml-2">→ NULL</span>}
                        </div>
                      )}
                      
                      {dsType === "bst" && (
                        <div className="flex flex-col items-center">
                          <svg width="100%" height="350" viewBox="0 0 400 350">
                            {bstRoot && renderBST(bstRoot, 200, 40, 0, 80)}
                            {!bstRoot && (
                              <text x="200" y="175" textAnchor="middle" className="fill-gray-400 text-sm">
                                BST is empty. Add some values!
                              </text>
                            )}
                          </svg>
                        </div>
                      )}
                      
                      {dsType === "graph" && (
                        <div className="relative w-full h-[350px]">
                          <svg width="100%" height="100%" viewBox="0 0 400 320">
                            {graphEdges.map((edge, i) => {
                              const from = graphNodes.find(n => n.id === edge.from);
                              const to = graphNodes.find(n => n.id === edge.to);
                              if (!from || !to) return null;
                              return (
                                <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#a855f7" strokeWidth="2" />
                              );
                            })}
                            {graphNodes.map(node => (
                              <g key={node.id}>
                                <motion.circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={25}
                                  className={cn(
                                    "transition-colors duration-300",
                                    node.state === "default" ? "fill-amber-500" :
                                    node.state === "current" ? "fill-purple-500" :
                                    node.state === "visited" ? "fill-green-500" :
                                    "fill-blue-500"
                                  )}
                                  stroke="white"
                                  strokeWidth="3"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                />
                                <text x={node.x} y={node.y + 5} textAnchor="middle" className="fill-white text-sm font-bold">
                                  {node.id}
                                </text>
                              </g>
                            ))}
                            {graphNodes.length === 0 && (
                              <text x="200" y="160" textAnchor="middle" className="fill-gray-400 text-sm">
                                Graph is empty. Add some nodes!
                              </text>
                            )}
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-4">Operations</h3>
                      
                      <div className="mb-4">
                        <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter a number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      
                      {(dsType === "linkedlist" || dsType === "doublylinkedlist") && (
                        <div className="mb-4">
                          <input type="number" value={indexValue} onChange={(e) => setIndexValue(e.target.value)} placeholder="Index (for insert at)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                      )}
                      
                      {dsType === "graph" && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <input type="text" value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)} placeholder="From (A,B...)" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                          <input type="text" value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)} placeholder="To (A,B...)" className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                      )}
                      
                      {dsType === "stack" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={pushStack} className="px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <Plus className="w-4 h-4" />Push
                          </button>
                          <button onClick={popStack} className="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <Minus className="w-4 h-4" />Pop
                          </button>
                        </div>
                      )}
                      
                      {dsType === "queue" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={enqueue} className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <Plus className="w-4 h-4" />Enqueue
                          </button>
                          <button onClick={dequeue} className="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <Minus className="w-4 h-4" />Dequeue
                          </button>
                        </div>
                      )}
                      
                      {dsType === "linkedlist" && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={insertAtHead} className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                              <Plus className="w-4 h-4" />At Head
                            </button>
                            <button onClick={deleteFromHead} className="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                              <Trash2 className="w-4 h-4" />Delete Head
                            </button>
                          </div>
                          <button onClick={insertAtIndex} className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <MapPin className="w-4 h-4" />Insert at Index
                          </button>
                        </div>
                      )}
                      
                      {dsType === "doublylinkedlist" && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={insertDoublyAtHead} className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                              <ArrowLeft className="w-4 h-4" />At Head
                            </button>
                            <button onClick={insertDoublyAtTail} className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                              <ArrowRight className="w-4 h-4" />At Tail
                            </button>
                          </div>
                          <button onClick={insertDoublyAtIndex} className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <MapPin className="w-4 h-4" />Insert at Index
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={deleteDoublyFromHead} className="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                              <Trash2 className="w-4 h-4" />Del Head
                            </button>
                            <button onClick={deleteDoublyFromTail} className="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                              <Trash2 className="w-4 h-4" />Del Tail
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {dsType === "bst" && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={insertBST} disabled={isTraversing} className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                              <Plus className="w-4 h-4" />Insert
                            </button>
                            <button onClick={searchBST} disabled={isTraversing} className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                              <Search className="w-4 h-4" />Search
                            </button>
                          </div>
                          <button onClick={clearBST} className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <Trash2 className="w-4 h-4" />Clear Tree
                          </button>
                        </div>
                      )}
                      
                      {dsType === "graph" && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={addGraphNode} disabled={isTraversing} className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                              <Plus className="w-4 h-4" />Add Node
                            </button>
                            <button onClick={addGraphEdge} disabled={isTraversing} className="px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                              <GitBranch className="w-4 h-4" />Add Edge
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={runBFS} disabled={isTraversing} className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                              <Layers className="w-4 h-4" />Run BFS
                            </button>
                            <button onClick={runDFS} disabled={isTraversing} className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                              <TreeDeciduous className="w-4 h-4" />Run DFS
                            </button>
                          </div>
                          <button onClick={clearGraph} className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-md">
                            <Trash2 className="w-4 h-4" />Clear Graph
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-3">
                        {dsType === "stack" && "Stack - LIFO"}
                        {dsType === "queue" && "Queue - FIFO"}
                        {dsType === "linkedlist" && "Singly Linked List"}
                        {dsType === "doublylinkedlist" && "Doubly Linked List"}
                        {dsType === "bst" && "Binary Search Tree"}
                        {dsType === "graph" && "Graph"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {dsType === "stack" && "Last In, First Out. Elements added and removed from top. Used in function calls, undo operations."}
                        {dsType === "queue" && "First In, First Out. Elements added at rear, removed from front. Used in BFS, task scheduling."}
                        {dsType === "linkedlist" && "Linear collection where each node points to the next. Efficient insertions at known positions."}
                        {dsType === "doublylinkedlist" && "Each node has pointers to both next and previous nodes. Allows bidirectional traversal."}
                        {dsType === "bst" && "Binary tree where left child < parent < right child. Enables O(log n) operations."}
                        {dsType === "graph" && "Nodes connected by edges. Models relationships like social networks, maps, dependencies."}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Access:</span>
                          <span className="text-purple-600 font-mono">
                            {dsType === "stack" && "O(n)"}
                            {dsType === "queue" && "O(n)"}
                            {dsType === "linkedlist" && "O(n)"}
                            {dsType === "doublylinkedlist" && "O(n)"}
                            {dsType === "bst" && "O(log n)"}
                            {dsType === "graph" && "O(V+E)"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Insert:</span>
                          <span className="text-green-600 font-mono">
                            {dsType === "stack" && "O(1)"}
                            {dsType === "queue" && "O(1)"}
                            {dsType === "linkedlist" && "O(1) / O(n)"}
                            {dsType === "doublylinkedlist" && "O(1) / O(n)"}
                            {dsType === "bst" && "O(log n)"}
                            {dsType === "graph" && "O(1)"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delete:</span>
                          <span className="text-red-600 font-mono">
                            {dsType === "stack" && "O(1)"}
                            {dsType === "queue" && "O(1)"}
                            {dsType === "linkedlist" && "O(1) / O(n)"}
                            {dsType === "doublylinkedlist" && "O(1) / O(n)"}
                            {dsType === "bst" && "O(log n)"}
                            {dsType === "graph" && "O(V+E)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

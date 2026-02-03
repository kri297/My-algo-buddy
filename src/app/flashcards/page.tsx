'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Shuffle,
  CheckCircle,
  XCircle,
  Star,
  Brain,
  Zap,
  ArrowLeft,
  Flame,
  Trophy,
  Lightbulb,
  Hash,
  TreePine,
  Network,
  GitBranch,
  BarChart2,
  LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressSync } from '@/hooks/useProgressSync';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface CardCategory {
  name: string;
  icon: React.ElementType;
  color: string;
  count: number;
}

// ============================================
// COMPREHENSIVE FLASHCARD DATABASE
// ============================================
const flashcards: Flashcard[] = [
  // ========== ARRAYS & STRINGS ==========
  {
    id: 1,
    front: "What is the time complexity of accessing an element by index in an array?",
    back: "O(1) - Constant time\n\nArrays store elements in contiguous memory locations, allowing direct access using pointer arithmetic.\n\naddress = base_address + (index × element_size)",
    category: "Arrays",
    difficulty: "easy"
  },
  {
    id: 2,
    front: "What is the time complexity of inserting an element at the beginning of an array?",
    back: "O(n) - Linear time\n\nAll existing elements must be shifted one position to the right to make room for the new element at index 0.",
    category: "Arrays",
    difficulty: "easy"
  },
  {
    id: 3,
    front: "What is the Two Pointer technique?",
    back: "A technique using two pointers to iterate through data.\n\n📌 Common Patterns:\n• Opposite ends (palindrome check)\n• Slow/Fast (cycle detection)\n• Sliding Window (subarray problems)\n\n⏱️ Often reduces O(n²) to O(n)",
    category: "Arrays",
    difficulty: "medium"
  },
  {
    id: 4,
    front: "What is the Sliding Window technique?",
    back: "A technique for processing contiguous sequences.\n\n📌 Types:\n• Fixed window: Window size constant\n• Variable window: Size adjusts based on condition\n\n📌 Use cases:\n• Maximum sum subarray of size k\n• Longest substring with k distinct chars\n• Minimum window substring",
    category: "Arrays",
    difficulty: "medium"
  },
  {
    id: 5,
    front: "What does array.slice(-2) return?",
    back: "Returns the last 2 elements of the array.\n\nNegative indices count from the end:\n• -1 = last element\n• -2 = second to last\n\nExample:\n[1, 2, 3, 4, 5].slice(-2) → [4, 5]",
    category: "Arrays",
    difficulty: "easy"
  },
  {
    id: 6,
    front: "Difference between map(), filter(), and reduce()?",
    back: "🔄 map(): Transform each element\n[1,2,3].map(x => x*2) → [2,4,6]\n\n🔍 filter(): Keep elements that pass test\n[1,2,3,4].filter(x => x>2) → [3,4]\n\n📊 reduce(): Accumulate to single value\n[1,2,3].reduce((a,b) => a+b, 0) → 6",
    category: "Arrays",
    difficulty: "easy"
  },
  {
    id: 7,
    front: "How would you find duplicates in an array efficiently?",
    back: "Use a Set or Hash Map - O(n) time, O(n) space\n\nconst findDuplicates = (arr) => {\n  const seen = new Set();\n  const dupes = [];\n  for (const num of arr) {\n    if (seen.has(num)) dupes.push(num);\n    else seen.add(num);\n  }\n  return dupes;\n};",
    category: "Arrays",
    difficulty: "medium"
  },

  // ========== LINKED LISTS ==========
  {
    id: 8,
    front: "What is a Linked List?",
    back: "A linear data structure where elements are stored in nodes.\n\n📦 Each node contains:\n• Data\n• Pointer to next node\n\n📌 Types:\n• Singly Linked (next only)\n• Doubly Linked (prev + next)\n• Circular (last → first)",
    category: "Linked Lists",
    difficulty: "easy"
  },
  {
    id: 9,
    front: "Array vs Linked List: When to use which?",
    back: "📊 Use ARRAY when:\n• Need random access by index\n• Mostly reading data\n• Memory is contiguous\n• Size is relatively fixed\n\n🔗 Use LINKED LIST when:\n• Frequent insertions/deletions\n• Size changes often\n• Don't need random access\n• Implementing stacks/queues",
    category: "Linked Lists",
    difficulty: "medium"
  },
  {
    id: 10,
    front: "How to detect a cycle in a linked list?",
    back: "Floyd's Cycle Detection (Tortoise & Hare)\n\n🐢 Slow pointer: moves 1 step\n🐇 Fast pointer: moves 2 steps\n\nIf they meet → cycle exists\nIf fast reaches null → no cycle\n\n⏱️ Time: O(n) | Space: O(1)",
    category: "Linked Lists",
    difficulty: "medium"
  },
  {
    id: 11,
    front: "How to find the middle of a linked list in one pass?",
    back: "Use slow & fast pointers:\n\nlet slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n}\nreturn slow; // middle node\n\nWhen fast reaches end, slow is at middle.\n⏱️ Time: O(n) | Space: O(1)",
    category: "Linked Lists",
    difficulty: "easy"
  },
  {
    id: 12,
    front: "How to reverse a linked list?",
    back: "Iterative approach:\n\nlet prev = null, curr = head;\nwhile (curr) {\n  let next = curr.next;\n  curr.next = prev;\n  prev = curr;\n  curr = next;\n}\nreturn prev;\n\n⏱️ Time: O(n) | Space: O(1)",
    category: "Linked Lists",
    difficulty: "medium"
  },

  // ========== STACKS & QUEUES ==========
  {
    id: 13,
    front: "What is a Stack?",
    back: "A LIFO (Last In First Out) data structure.\n\n📌 Operations:\n• push(x): Add to top - O(1)\n• pop(): Remove from top - O(1)\n• peek(): View top - O(1)\n• isEmpty(): Check if empty - O(1)\n\n📌 Real examples: Undo button, browser back, call stack",
    category: "Stacks & Queues",
    difficulty: "easy"
  },
  {
    id: 14,
    front: "What is a Queue?",
    back: "A FIFO (First In First Out) data structure.\n\n📌 Operations:\n• enqueue(x): Add to back - O(1)\n• dequeue(): Remove from front - O(1)\n• front(): View first - O(1)\n• isEmpty(): Check if empty - O(1)\n\n📌 Real examples: Printer queue, BFS traversal",
    category: "Stacks & Queues",
    difficulty: "easy"
  },
  {
    id: 15,
    front: "How to check for balanced parentheses?",
    back: "Use a stack!\n\nfor (char of string) {\n  if (isOpening(char)) {\n    stack.push(char);\n  } else {\n    if (stack.isEmpty()) return false;\n    if (!matches(stack.pop(), char))\n      return false;\n  }\n}\nreturn stack.isEmpty();\n\n⏱️ Time: O(n) | Space: O(n)",
    category: "Stacks & Queues",
    difficulty: "easy"
  },
  {
    id: 16,
    front: "What is a Priority Queue?",
    back: "A queue where elements have priorities.\n\n📌 Elements served by priority, not order.\n\n📌 Implementation:\n• Binary Heap (most common)\n• Fibonacci Heap\n• BST\n\n📌 Operations:\n• Insert: O(log n)\n• Extract-Max/Min: O(log n)\n• Peek: O(1)",
    category: "Stacks & Queues",
    difficulty: "medium"
  },
  {
    id: 17,
    front: "What is a Monotonic Stack?",
    back: "A stack that maintains elements in sorted order (increasing or decreasing).\n\n📌 Use cases:\n• Next greater element\n• Stock span problem\n• Largest rectangle in histogram\n\n📌 Key: Pop elements that violate order before pushing\n\n⏱️ Amortized O(1) per operation",
    category: "Stacks & Queues",
    difficulty: "hard"
  },

  // ========== TREES ==========
  {
    id: 18,
    front: "What is a Binary Tree?",
    back: "A tree where each node has at most 2 children (left and right).\n\n📌 Key terms:\n• Root: Top node\n• Leaf: Node with no children\n• Height: Longest path from root to leaf\n• Depth: Distance from root\n\n📌 Full BT: Every node has 0 or 2 children\n📌 Complete BT: All levels full except last (left-filled)",
    category: "Trees",
    difficulty: "easy"
  },
  {
    id: 19,
    front: "What is a Binary Search Tree (BST)?",
    back: "A binary tree with ordering property:\n\n• Left subtree: all values < node\n• Right subtree: all values > node\n\n📌 Operations (balanced):\n• Search: O(log n)\n• Insert: O(log n)\n• Delete: O(log n)\n\n⚠️ Worst case (skewed): O(n)",
    category: "Trees",
    difficulty: "easy"
  },
  {
    id: 20,
    front: "What are the tree traversal orders?",
    back: "📌 DFS Traversals:\n• Pre-order: Root → Left → Right\n• In-order: Left → Root → Right\n• Post-order: Left → Right → Root\n\n📌 BFS:\n• Level-order: Level by level, left to right\n\n💡 In-order on BST gives sorted output!",
    category: "Trees",
    difficulty: "easy"
  },
  {
    id: 21,
    front: "What is a Balanced BST?",
    back: "A BST where height difference between left and right subtrees is ≤ 1.\n\n📌 Examples:\n• AVL Tree: Strict balance (height diff ≤ 1)\n• Red-Black Tree: Color-based balance\n• B-Tree: For databases/file systems\n\n📌 Benefit: Guarantees O(log n) operations",
    category: "Trees",
    difficulty: "medium"
  },
  {
    id: 22,
    front: "What is a Heap?",
    back: "A complete binary tree with heap property.\n\n📌 Max-Heap: Parent ≥ children\n📌 Min-Heap: Parent ≤ children\n\n📌 Operations:\n• Insert: O(log n) - add & bubble up\n• Extract: O(log n) - remove & heapify\n• Peek: O(1)\n• Build heap: O(n)\n\n📌 Used for: Priority queues, heap sort",
    category: "Trees",
    difficulty: "medium"
  },
  {
    id: 23,
    front: "What is a Trie (Prefix Tree)?",
    back: "A tree for storing strings where each node represents a character.\n\n📌 Use cases:\n• Autocomplete\n• Spell checker\n• IP routing\n\n📌 Operations:\n• Insert word: O(m)\n• Search word: O(m)\n• Search prefix: O(m)\n\nwhere m = word length",
    category: "Trees",
    difficulty: "hard"
  },

  // ========== GRAPHS ==========
  {
    id: 24,
    front: "What is a Graph?",
    back: "A collection of vertices (nodes) and edges (connections).\n\n📌 Types:\n• Directed vs Undirected\n• Weighted vs Unweighted\n• Cyclic vs Acyclic\n• Connected vs Disconnected\n\n📌 Special graphs:\n• Tree: Connected, acyclic\n• DAG: Directed Acyclic Graph",
    category: "Graphs",
    difficulty: "easy"
  },
  {
    id: 25,
    front: "Adjacency Matrix vs Adjacency List?",
    back: "📊 Adjacency Matrix:\n• Space: O(V²)\n• Check edge: O(1)\n• Find neighbors: O(V)\n• Good for: Dense graphs\n\n📋 Adjacency List:\n• Space: O(V + E)\n• Check edge: O(degree)\n• Find neighbors: O(degree)\n• Good for: Sparse graphs (most real graphs)",
    category: "Graphs",
    difficulty: "medium"
  },
  {
    id: 26,
    front: "BFS vs DFS: When to use which?",
    back: "🌊 BFS (Queue):\n• Shortest path (unweighted)\n• Level-order traversal\n• Finding all nodes at distance k\n• Closer solutions first\n\n🏊 DFS (Stack/Recursion):\n• Detecting cycles\n• Topological sort\n• Finding connected components\n• Path existence\n• Less memory for wide graphs",
    category: "Graphs",
    difficulty: "medium"
  },
  {
    id: 27,
    front: "What is Dijkstra's Algorithm?",
    back: "Finds shortest path from source to all vertices in weighted graph (non-negative weights).\n\n📌 Approach:\n1. Start with source, dist = 0\n2. Use priority queue (min-heap)\n3. Relax edges greedily\n\n⏱️ Time: O((V+E) log V) with heap\n\n⚠️ Doesn't work with negative edges!",
    category: "Graphs",
    difficulty: "hard"
  },
  {
    id: 28,
    front: "What is Topological Sort?",
    back: "Linear ordering of vertices in a DAG such that for every edge u→v, u comes before v.\n\n📌 Methods:\n• Kahn's Algorithm (BFS + in-degree)\n• DFS-based (post-order reverse)\n\n📌 Use cases:\n• Task scheduling\n• Build systems\n• Course prerequisites\n\n⏱️ Time: O(V + E)",
    category: "Graphs",
    difficulty: "hard"
  },

  // ========== SORTING ==========
  {
    id: 29,
    front: "What is the time complexity of common sorting algorithms?",
    back: "📊 O(n²) - Simple sorts:\n• Bubble: O(n²) always\n• Selection: O(n²) always\n• Insertion: O(n²) avg, O(n) best\n\n📊 O(n log n) - Efficient sorts:\n• Merge: O(n log n) always\n• Quick: O(n log n) avg, O(n²) worst\n• Heap: O(n log n) always",
    category: "Sorting",
    difficulty: "medium"
  },
  {
    id: 30,
    front: "How does Quick Sort work?",
    back: "Divide & Conquer using partitioning.\n\n📌 Steps:\n1. Choose pivot element\n2. Partition: smaller left, larger right\n3. Recursively sort both sides\n\n📌 Partition schemes:\n• Lomuto (end pivot)\n• Hoare (more efficient)\n\n⏱️ Avg: O(n log n) | Worst: O(n²)\n💾 Space: O(log n) - in-place",
    category: "Sorting",
    difficulty: "medium"
  },
  {
    id: 31,
    front: "How does Merge Sort work?",
    back: "Divide & Conquer by merging sorted halves.\n\n📌 Steps:\n1. Divide array in half\n2. Recursively sort each half\n3. Merge sorted halves\n\n📌 Properties:\n• Stable sort\n• Consistent O(n log n)\n• Requires O(n) extra space\n\n📌 Great for: Linked lists, external sort",
    category: "Sorting",
    difficulty: "medium"
  },
  {
    id: 32,
    front: "What is a Stable Sort?",
    back: "A sort that preserves the relative order of equal elements.\n\n✅ Stable sorts:\n• Merge Sort\n• Insertion Sort\n• Bubble Sort\n• Counting Sort\n\n❌ Unstable sorts:\n• Quick Sort\n• Heap Sort\n• Selection Sort\n\n💡 Important when sorting by multiple keys",
    category: "Sorting",
    difficulty: "medium"
  },

  // ========== SEARCHING ==========
  {
    id: 33,
    front: "How does Binary Search work?",
    back: "Divide & Conquer on sorted array.\n\n📌 Steps:\n1. Compare target with middle\n2. If equal → found\n3. If target < mid → search left\n4. If target > mid → search right\n\n⏱️ Time: O(log n)\n💾 Space: O(1) iterative, O(log n) recursive\n\n⚠️ Requires sorted array!",
    category: "Searching",
    difficulty: "easy"
  },
  {
    id: 34,
    front: "Binary Search variations you should know?",
    back: "📌 Common variations:\n• Find first occurrence\n• Find last occurrence\n• Find insertion position\n• Search in rotated array\n• Find peak element\n• Search in 2D matrix\n\n💡 Key: Modify the condition for when to go left/right",
    category: "Searching",
    difficulty: "medium"
  },

  // ========== HASH TABLES ==========
  {
    id: 35,
    front: "What is a Hash Table?",
    back: "Data structure that maps keys to values using a hash function.\n\n📌 Operations (average):\n• Insert: O(1)\n• Search: O(1)\n• Delete: O(1)\n\n📌 Components:\n• Hash function\n• Array of buckets\n• Collision handling\n\n⚠️ Worst case: O(n) with many collisions",
    category: "Hash Tables",
    difficulty: "easy"
  },
  {
    id: 36,
    front: "What is a Hash Collision and how to handle it?",
    back: "When two different keys hash to the same index.\n\n📌 Resolution methods:\n\n1️⃣ Chaining:\n• Store collisions in linked list\n• Simple but uses extra memory\n\n2️⃣ Open Addressing:\n• Linear Probing: Check next slot\n• Quadratic Probing: Check i² slots\n• Double Hashing: Use second hash",
    category: "Hash Tables",
    difficulty: "medium"
  },
  {
    id: 37,
    front: "What is Load Factor in Hash Tables?",
    back: "Load Factor = n / capacity\n(number of elements / table size)\n\n📌 Impact:\n• High LF → More collisions\n• Low LF → Wasted space\n\n📌 Typical threshold: 0.7 - 0.75\n\n📌 When exceeded:\n• Resize table (usually 2x)\n• Rehash all elements\n\n💡 Rehashing is O(n) but amortized O(1)",
    category: "Hash Tables",
    difficulty: "medium"
  },

  // ========== DYNAMIC PROGRAMMING ==========
  {
    id: 38,
    front: "What is Dynamic Programming?",
    back: "An optimization technique for solving problems with:\n\n📌 Two key properties:\n1. Optimal Substructure: Solution uses solutions to subproblems\n2. Overlapping Subproblems: Same subproblems solved multiple times\n\n📌 Approaches:\n• Top-down: Recursion + Memoization\n• Bottom-up: Iterative tabulation",
    category: "Dynamic Programming",
    difficulty: "medium"
  },
  {
    id: 39,
    front: "Memoization vs Tabulation?",
    back: "📌 Memoization (Top-Down):\n• Start with main problem\n• Recursively solve subproblems\n• Cache results\n• Only solves needed subproblems\n• Risk of stack overflow\n\n📌 Tabulation (Bottom-Up):\n• Start with base cases\n• Build up iteratively\n• Fill a table\n• Solves all subproblems\n• More space-efficient often",
    category: "Dynamic Programming",
    difficulty: "hard"
  },
  {
    id: 40,
    front: "Classic DP Problems to Know",
    back: "📌 1D DP:\n• Fibonacci, Climbing Stairs\n• House Robber\n• Maximum Subarray (Kadane's)\n\n📌 2D DP:\n• Longest Common Subsequence\n• Edit Distance\n• 0/1 Knapsack\n• Unique Paths\n\n📌 Interval DP:\n• Matrix Chain Multiplication\n• Palindrome Partitioning",
    category: "Dynamic Programming",
    difficulty: "hard"
  },

  // ========== COMPLEXITY ANALYSIS ==========
  {
    id: 41,
    front: "What is Big O Notation?",
    back: "Describes the upper bound of algorithm growth rate.\n\n📌 Common complexities (best to worst):\nO(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)\n\n📌 Rules:\n• Drop constants: O(2n) → O(n)\n• Drop lower terms: O(n² + n) → O(n²)\n• Consider worst case",
    category: "Complexity",
    difficulty: "easy"
  },
  {
    id: 42,
    front: "What is Amortized Analysis?",
    back: "Average time per operation over a sequence.\n\n📌 Example: Dynamic Array\n• Most insertions: O(1)\n• Occasional resize: O(n)\n• Amortized: O(1) per insert\n\n📌 Methods:\n• Aggregate analysis\n• Accounting method\n• Potential method\n\n💡 Useful when operations have varying costs",
    category: "Complexity",
    difficulty: "hard"
  },
  {
    id: 43,
    front: "Space Complexity: What to consider?",
    back: "📌 Types of space:\n• Input space (not usually counted)\n• Auxiliary space (extra space used)\n\n📌 Common causes:\n• Variables: O(1)\n• Arrays/HashMaps: O(n)\n• Recursion stack: O(depth)\n• 2D arrays: O(n×m)\n\n💡 In-place algorithms: O(1) auxiliary",
    category: "Complexity",
    difficulty: "medium"
  }
];

// Category metadata
const categoryMeta: Record<string, { icon: React.ElementType; color: string }> = {
  'Arrays': { icon: Layers, color: 'from-blue-500 to-cyan-500' },
  'Linked Lists': { icon: GitBranch, color: 'from-purple-500 to-pink-500' },
  'Stacks & Queues': { icon: Layers, color: 'from-orange-500 to-red-500' },
  'Trees': { icon: TreePine, color: 'from-green-500 to-emerald-500' },
  'Graphs': { icon: Network, color: 'from-indigo-500 to-purple-500' },
  'Sorting': { icon: BarChart2, color: 'from-yellow-500 to-orange-500' },
  'Searching': { icon: Zap, color: 'from-cyan-500 to-blue-500' },
  'Hash Tables': { icon: Hash, color: 'from-pink-500 to-rose-500' },
  'Dynamic Programming': { icon: Brain, color: 'from-violet-500 to-purple-500' },
  'Complexity': { icon: Lightbulb, color: 'from-amber-500 to-orange-500' },
};

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [stats, setStats] = useState({ known: 0, unknown: 0, streak: 0, bestStreak: 0 });
  const [showCategories, setShowCategories] = useState(true);
  const [showSyncNotification, setShowSyncNotification] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [learnedCards, setLearnedCards] = useState<Set<number>>(new Set());

  const { 
    isAuthenticated, 
    isLoading, 
    syncFlashcard, 
    getLearnedFlashcardIds,
    userProgress 
  } = useProgressSync();

  const categories = [...new Set(flashcards.map(c => c.category))];

  // Load learned cards from server or localStorage
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const serverLearned = getLearnedFlashcardIds();
      if (serverLearned.size > 0) {
        setLearnedCards(serverLearned as Set<number>);
        setStats(prev => ({ ...prev, known: serverLearned.size }));
      }
    } else if (!isAuthenticated && !isLoading) {
      const saved = localStorage.getItem('algobuddy_learnedFlashcards');
      if (saved) {
        const parsed = new Set<number>(JSON.parse(saved).map(Number));
        setLearnedCards(parsed);
        setStats(prev => ({ ...prev, known: parsed.size }));
      }
    }
  }, [isAuthenticated, isLoading, getLearnedFlashcardIds]);

  // Save to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('algobuddy_learnedFlashcards', JSON.stringify([...learnedCards]));
    }
  }, [learnedCards, isAuthenticated]);

  const filteredCards = cards.filter(card => {
    if (categoryFilter !== 'all' && card.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && card.difficulty !== difficultyFilter) return false;
    return true;
  });

  const currentCard = filteredCards[currentIndex] || null;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCategories) return;
      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case ' ':
          e.preventDefault();
          setIsFlipped(f => !f);
          break;
        case '1':
          markAsUnknown();
          break;
        case '2':
          markAsKnown();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCategories, currentIndex, filteredCards.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const markAsKnown = async () => {
    if (!currentCard) return;
    
    const newStreak = stats.streak + 1;
    const newLearnedCards = new Set(learnedCards);
    
    if (!learnedCards.has(currentCard.id)) {
      newLearnedCards.add(currentCard.id);
      setLearnedCards(newLearnedCards);
      
      // Sync to server if authenticated
      if (isAuthenticated) {
        const result = await syncFlashcard(currentCard.id, currentCard.category, newLearnedCards.size);
        if (result.success && result.xpGained) {
          setSyncMessage(`+${result.xpGained} XP`);
          setShowSyncNotification(true);
          setTimeout(() => setShowSyncNotification(false), 2000);
        }
      }
    }
    
    setStats(prev => ({
      ...prev,
      known: newLearnedCards.size,
      streak: newStreak,
      bestStreak: Math.max(prev.bestStreak, newStreak)
    }));
    handleNext();
  };

  const markAsUnknown = () => {
    setStats(prev => ({ ...prev, unknown: prev.unknown + 1, streak: 0 }));
    handleNext();
  };

  const startCategory = (category: string) => {
    setCategoryFilter(category);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowCategories(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getCategoryStats = () => {
    return categories.map(cat => ({
      name: cat,
      count: flashcards.filter(c => c.category === cat).length,
      ...categoryMeta[cat]
    }));
  };

  // Category Selection Screen
  if (showCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
        {/* Sync Notification */}
        <AnimatePresence>
          {showSyncNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg"
            >
              {syncMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Prompt for guests */}
        {!isAuthenticated && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Sign in to save progress</span>
              <Link href="/auth/signin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            </div>
          </motion.div>
        )}

        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">DSA Flashcards</h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Master key concepts with {flashcards.length} carefully crafted flashcards covering all major data structures and algorithms.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-slate-900">{flashcards.length}</div>
              <div className="text-sm text-slate-600">Total Cards</div>
            </div>
            <div className="bg-white border-2 border-green-200 rounded-xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-green-600">{stats.known}</div>
              <div className="text-sm text-slate-600">Mastered</div>
            </div>
            <div className="bg-white border-2 border-yellow-200 rounded-xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.bestStreak}</div>
              <div className="text-sm text-slate-600">Best Streak</div>
            </div>
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 text-center shadow-lg">
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <div className="text-sm text-slate-600">Categories</div>
            </div>
          </div>

          {/* All Cards Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => startCategory('all')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-6 text-left hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">📚 Study All Cards</h3>
                <p className="text-purple-200">Practice with all {flashcards.length} flashcards</p>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </motion.button>

          {/* Category Grid */}
          <h2 className="text-xl font-semibold mb-4">By Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCategoryStats().map((cat, index) => {
              const Icon = cat.icon || Layers;
              return (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => startCategory(cat.name)}
                  className="bg-white border-2 border-slate-200 rounded-xl p-5 text-left hover:border-blue-300 transition-all group shadow-lg"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
                    cat.color || 'from-slate-600 to-slate-700'
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-600">{cat.count} cards</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // No cards screen
  if (!currentCard) {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <button
            onClick={() => setShowCategories(true)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12">
            <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Cards Found</h2>
            <p className="text-slate-400">Try selecting a different category or filter.</p>
          </div>
        </div>
      </div>
    );
  }

  // Study Mode
  const progress = ((currentIndex + 1) / filteredCards.length) * 100;
  const catMeta = categoryMeta[currentCard.category] || { icon: Layers, color: 'from-slate-600 to-slate-700' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCategories(true)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Categories
          </button>
          
          <div className="flex items-center gap-4">
            {stats.streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 rounded-full"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">{stats.streak} streak</span>
              </motion.div>
            )}
            <button
              onClick={handleShuffle}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Shuffle className="w-4 h-4 text-slate-900" />
              <span className="text-sm text-slate-900">Shuffle</span>
            </button>
          </div>
        </div>

        {/* Category & Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r",
            catMeta.color
          )}>
            <catMeta.icon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {categoryFilter === 'all' ? 'All Categories' : currentCard.category}
            </span>
          </div>
          
          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm text-slate-600 font-mono">
            {currentIndex + 1}/{filteredCards.length}
          </span>
        </div>

        {/* Flashcard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className={cn(
                "min-h-[400px] bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-xl",
                isFlipped && "invisible"
              )}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className={cn("px-3 py-1 rounded-full text-xs border", getDifficultyColor(currentCard.difficulty))}>
                  {currentCard.difficulty}
                </span>
                <span className="text-sm text-slate-500">Click to flip</span>
              </div>
              
              <div className="flex items-center justify-center min-h-[280px]">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-blue-500/30 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold leading-relaxed text-slate-900">
                    {currentCard.front}
                  </h2>
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className={cn(
                "absolute inset-0 min-h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-8 shadow-xl",
                !isFlipped && "invisible"
              )}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700 border border-blue-200">
                  Answer
                </span>
                <RotateCcw className="w-4 h-4 text-blue-600" />
              </div>
              
              <div className="max-w-none">
                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-900">
                  {currentCard.back}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            className="p-3 bg-white border-2 border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-900" />
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={markAsUnknown}
            className="flex items-center gap-2 px-5 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors"
          >
            <XCircle className="w-5 h-5" />
            Review Later
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-slate-900" />
            <span className="text-slate-900">Flip</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={markAsKnown}
            className="flex items-center gap-2 px-5 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Got It!
          </motion.button>

          <button
            onClick={handleNext}
            className="p-3 bg-white border-2 border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-900" />
          </button>
        </div>

        {/* Keyboard hints */}
        <div className="mt-6 text-center text-sm text-slate-600">
          ← Previous • → Next • Space: Flip • 1: Review • 2: Got It
        </div>

        {/* Stats */}
        <div className="mt-8 flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="font-bold">{stats.known}</span>
            </div>
            <span className="text-xs text-slate-500">Known</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-red-400">
              <XCircle className="w-4 h-4" />
              <span className="font-bold">{stats.unknown}</span>
            </div>
            <span className="text-xs text-slate-500">To Review</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-yellow-400">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{stats.bestStreak}</span>
            </div>
            <span className="text-xs text-slate-500">Best Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}

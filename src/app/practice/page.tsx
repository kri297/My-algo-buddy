"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  CheckCircle,
  Circle,
  Star,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Flame,
  BookOpen,
  Code2,
  ArrowRight,
  Sparkles,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressSync } from "@/hooks/useProgressSync";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcodeUrl: string;
  leetcodeId: number;
  tags: string[];
  companies: string[];
  acceptance: string;
  completed: boolean;
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  problems: Problem[];
}

const topics: Topic[] = [
  {
    id: "arrays",
    name: "Arrays & Hashing",
    icon: "📊",
    description: "Fundamental array operations and hash table techniques",
    color: "from-sky-400 to-cyan-400",
    problems: [
      { id: "1", title: "Two Sum", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/two-sum/", leetcodeId: 1, tags: ["Array", "Hash Table"], companies: ["Google", "Amazon", "Meta"], acceptance: "49.1%", completed: false },
      { id: "2", title: "Contains Duplicate", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/", leetcodeId: 217, tags: ["Array", "Hash Table", "Sorting"], companies: ["Amazon", "Apple"], acceptance: "61.0%", completed: false },
      { id: "3", title: "Valid Anagram", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-anagram/", leetcodeId: 242, tags: ["String", "Hash Table", "Sorting"], companies: ["Amazon", "Microsoft"], acceptance: "62.7%", completed: false },
      { id: "4", title: "Group Anagrams", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/group-anagrams/", leetcodeId: 49, tags: ["Array", "Hash Table", "String"], companies: ["Amazon", "Meta", "Google"], acceptance: "66.7%", completed: false },
      { id: "5", title: "Top K Frequent Elements", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/", leetcodeId: 347, tags: ["Array", "Hash Table", "Heap"], companies: ["Amazon", "Meta"], acceptance: "64.2%", completed: false },
      { id: "6", title: "Product of Array Except Self", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/", leetcodeId: 238, tags: ["Array", "Prefix Sum"], companies: ["Amazon", "Microsoft", "Apple"], acceptance: "65.0%", completed: false },
      { id: "7", title: "Longest Consecutive Sequence", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/", leetcodeId: 128, tags: ["Array", "Hash Table", "Union Find"], companies: ["Google", "Amazon"], acceptance: "47.4%", completed: false },
      { id: "8", title: "Encode and Decode Strings", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/encode-and-decode-strings/", leetcodeId: 271, tags: ["Array", "String", "Design"], companies: ["Meta", "Google"], acceptance: "45.2%", completed: false },
      { id: "9", title: "Sort Colors", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/sort-colors/", leetcodeId: 75, tags: ["Array", "Two Pointers", "Sorting"], companies: ["Microsoft", "Amazon"], acceptance: "58.3%", completed: false },
      { id: "10", title: "First Missing Positive", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/first-missing-positive/", leetcodeId: 41, tags: ["Array", "Hash Table"], companies: ["Amazon", "Google", "Microsoft"], acceptance: "36.5%", completed: false },
    ]
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    icon: "👆",
    description: "Technique using two pointers to solve array problems",
    color: "from-sky-400 to-cyan-400",
    problems: [
      { id: "11", title: "Valid Palindrome", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", leetcodeId: 125, tags: ["Two Pointers", "String"], companies: ["Meta", "Microsoft"], acceptance: "44.2%", completed: false },
      { id: "12", title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", leetcodeId: 167, tags: ["Array", "Two Pointers"], companies: ["Amazon"], acceptance: "60.0%", completed: false },
      { id: "13", title: "3Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/3sum/", leetcodeId: 15, tags: ["Array", "Two Pointers", "Sorting"], companies: ["Meta", "Amazon", "Google"], acceptance: "32.7%", completed: false },
      { id: "14", title: "Container With Most Water", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/", leetcodeId: 11, tags: ["Array", "Two Pointers", "Greedy"], companies: ["Amazon", "Goldman Sachs"], acceptance: "54.0%", completed: false },
      { id: "15", title: "Trapping Rain Water", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/", leetcodeId: 42, tags: ["Array", "Two Pointers", "Dynamic Programming"], companies: ["Amazon", "Google", "Meta"], acceptance: "59.3%", completed: false },
      { id: "16", title: "4Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/4sum/", leetcodeId: 18, tags: ["Array", "Two Pointers", "Sorting"], companies: ["Amazon", "Microsoft"], acceptance: "37.5%", completed: false },
      { id: "17", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", leetcodeId: 26, tags: ["Array", "Two Pointers"], companies: ["Meta", "Amazon"], acceptance: "52.3%", completed: false },
      { id: "18", title: "Move Zeroes", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/move-zeroes/", leetcodeId: 283, tags: ["Array", "Two Pointers"], companies: ["Meta", "Amazon"], acceptance: "61.0%", completed: false },
    ]
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    icon: "🪟",
    description: "Window-based technique for substring and subarray problems",
    color: "from-green-500 to-emerald-500",
    problems: [
      { id: "19", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", leetcodeId: 121, tags: ["Array", "Dynamic Programming"], companies: ["Amazon", "Meta", "Google"], acceptance: "53.8%", completed: false },
      { id: "20", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", leetcodeId: 3, tags: ["Hash Table", "String", "Sliding Window"], companies: ["Amazon", "Meta", "Google"], acceptance: "34.0%", completed: false },
      { id: "21", title: "Longest Repeating Character Replacement", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/", leetcodeId: 424, tags: ["Hash Table", "String", "Sliding Window"], companies: ["Google"], acceptance: "52.0%", completed: false },
      { id: "22", title: "Minimum Window Substring", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/", leetcodeId: 76, tags: ["Hash Table", "String", "Sliding Window"], companies: ["Meta", "Amazon", "Google"], acceptance: "40.7%", completed: false },
      { id: "23", title: "Permutation in String", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/", leetcodeId: 567, tags: ["Hash Table", "Two Pointers", "Sliding Window"], companies: ["Microsoft", "Amazon"], acceptance: "43.8%", completed: false },
      { id: "24", title: "Maximum Average Subarray I", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/maximum-average-subarray-i/", leetcodeId: 643, tags: ["Array", "Sliding Window"], companies: ["Meta"], acceptance: "43.5%", completed: false },
      { id: "25", title: "Sliding Window Maximum", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/", leetcodeId: 239, tags: ["Array", "Queue", "Sliding Window"], companies: ["Amazon", "Google", "Meta"], acceptance: "46.5%", completed: false },
    ]
  },
  {
    id: "stack",
    name: "Stack",
    icon: "📚",
    description: "LIFO data structure problems",
    color: "from-orange-500 to-red-500",
    problems: [
      { id: "26", title: "Valid Parentheses", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", leetcodeId: 20, tags: ["String", "Stack"], companies: ["Amazon", "Meta", "Google"], acceptance: "40.3%", completed: false },
      { id: "27", title: "Min Stack", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/min-stack/", leetcodeId: 155, tags: ["Stack", "Design"], companies: ["Amazon", "Bloomberg"], acceptance: "52.0%", completed: false },
      { id: "28", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", leetcodeId: 150, tags: ["Array", "Math", "Stack"], companies: ["Amazon", "LinkedIn"], acceptance: "44.5%", completed: false },
      { id: "29", title: "Daily Temperatures", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/", leetcodeId: 739, tags: ["Array", "Stack", "Monotonic Stack"], companies: ["Meta", "Amazon"], acceptance: "66.0%", completed: false },
      { id: "30", title: "Largest Rectangle in Histogram", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/", leetcodeId: 84, tags: ["Array", "Stack", "Monotonic Stack"], companies: ["Amazon", "Google"], acceptance: "43.4%", completed: false },
      { id: "31", title: "Generate Parentheses", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/generate-parentheses/", leetcodeId: 22, tags: ["String", "Backtracking", "Stack"], companies: ["Meta", "Amazon"], acceptance: "72.6%", completed: false },
      { id: "32", title: "Car Fleet", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/car-fleet/", leetcodeId: 853, tags: ["Array", "Stack", "Sorting"], companies: ["Google"], acceptance: "50.2%", completed: false },
      { id: "33", title: "Asteroid Collision", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/asteroid-collision/", leetcodeId: 735, tags: ["Array", "Stack", "Simulation"], companies: ["Amazon", "Uber"], acceptance: "44.0%", completed: false },
    ]
  },
  {
    id: "binary-search",
    name: "Binary Search",
    icon: "🔍",
    description: "Divide and conquer search technique",
    color: "from-yellow-500 to-orange-500",
    problems: [
      { id: "34", title: "Binary Search", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/binary-search/", leetcodeId: 704, tags: ["Array", "Binary Search"], companies: ["Amazon", "Apple"], acceptance: "55.2%", completed: false },
      { id: "35", title: "Search a 2D Matrix", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/", leetcodeId: 74, tags: ["Array", "Binary Search", "Matrix"], companies: ["Amazon", "Microsoft"], acceptance: "47.5%", completed: false },
      { id: "36", title: "Koko Eating Bananas", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/", leetcodeId: 875, tags: ["Array", "Binary Search"], companies: ["Google", "Amazon"], acceptance: "51.8%", completed: false },
      { id: "37", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", leetcodeId: 153, tags: ["Array", "Binary Search"], companies: ["Meta", "Amazon"], acceptance: "48.6%", completed: false },
      { id: "38", title: "Search in Rotated Sorted Array", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/", leetcodeId: 33, tags: ["Array", "Binary Search"], companies: ["Meta", "Amazon", "Microsoft"], acceptance: "39.0%", completed: false },
      { id: "39", title: "Median of Two Sorted Arrays", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/", leetcodeId: 4, tags: ["Array", "Binary Search", "Divide and Conquer"], companies: ["Amazon", "Google", "Apple"], acceptance: "36.1%", completed: false },
      { id: "40", title: "Time Based Key-Value Store", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/time-based-key-value-store/", leetcodeId: 981, tags: ["Hash Table", "String", "Binary Search"], companies: ["Google", "Amazon"], acceptance: "52.0%", completed: false },
      { id: "41", title: "Find First and Last Position", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", leetcodeId: 34, tags: ["Array", "Binary Search"], companies: ["Meta", "Microsoft"], acceptance: "42.0%", completed: false },
      { id: "42", title: "Search Insert Position", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/search-insert-position/", leetcodeId: 35, tags: ["Array", "Binary Search"], companies: ["Google", "Amazon"], acceptance: "45.2%", completed: false },
    ]
  },
  {
    id: "linked-list",
    name: "Linked List",
    icon: "🔗",
    description: "Linear data structure with pointers",
    color: "from-emerald-400 to-teal-400",
    problems: [
      { id: "43", title: "Reverse Linked List", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", leetcodeId: 206, tags: ["Linked List", "Recursion"], companies: ["Amazon", "Microsoft", "Apple"], acceptance: "73.2%", completed: false },
      { id: "44", title: "Merge Two Sorted Lists", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", leetcodeId: 21, tags: ["Linked List", "Recursion"], companies: ["Amazon", "Microsoft"], acceptance: "62.2%", completed: false },
      { id: "45", title: "Linked List Cycle", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", leetcodeId: 141, tags: ["Hash Table", "Linked List", "Two Pointers"], companies: ["Amazon", "Microsoft"], acceptance: "47.4%", completed: false },
      { id: "46", title: "Reorder List", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/reorder-list/", leetcodeId: 143, tags: ["Linked List", "Two Pointers", "Stack"], companies: ["Amazon", "Meta"], acceptance: "52.4%", completed: false },
      { id: "47", title: "Remove Nth Node From End of List", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", leetcodeId: 19, tags: ["Linked List", "Two Pointers"], companies: ["Amazon", "Meta"], acceptance: "41.0%", completed: false },
      { id: "48", title: "LRU Cache", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/lru-cache/", leetcodeId: 146, tags: ["Hash Table", "Linked List", "Design"], companies: ["Amazon", "Meta", "Google", "Microsoft"], acceptance: "40.5%", completed: false },
      { id: "49", title: "Merge k Sorted Lists", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", leetcodeId: 23, tags: ["Linked List", "Divide and Conquer", "Heap"], companies: ["Amazon", "Meta", "Google"], acceptance: "50.3%", completed: false },
      { id: "50", title: "Copy List with Random Pointer", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/copy-list-with-random-pointer/", leetcodeId: 138, tags: ["Hash Table", "Linked List"], companies: ["Amazon", "Meta", "Microsoft"], acceptance: "51.2%", completed: false },
      { id: "51", title: "Add Two Numbers", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/add-two-numbers/", leetcodeId: 2, tags: ["Linked List", "Math", "Recursion"], companies: ["Amazon", "Microsoft", "Google"], acceptance: "40.5%", completed: false },
      { id: "52", title: "Find the Duplicate Number", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-the-duplicate-number/", leetcodeId: 287, tags: ["Array", "Two Pointers", "Binary Search"], companies: ["Amazon", "Google"], acceptance: "59.0%", completed: false },
    ]
  },
  {
    id: "trees",
    name: "Trees",
    icon: "🌳",
    description: "Binary trees, BST, and tree traversals",
    color: "from-teal-500 to-green-500",
    problems: [
      { id: "53", title: "Invert Binary Tree", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/", leetcodeId: 226, tags: ["Tree", "DFS", "BFS"], companies: ["Google", "Amazon"], acceptance: "73.5%", completed: false },
      { id: "54", title: "Maximum Depth of Binary Tree", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", leetcodeId: 104, tags: ["Tree", "DFS", "BFS"], companies: ["Amazon", "Microsoft"], acceptance: "73.9%", completed: false },
      { id: "55", title: "Same Tree", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/same-tree/", leetcodeId: 100, tags: ["Tree", "DFS", "BFS"], companies: ["Amazon", "Microsoft"], acceptance: "57.4%", completed: false },
      { id: "56", title: "Subtree of Another Tree", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/subtree-of-another-tree/", leetcodeId: 572, tags: ["Tree", "DFS"], companies: ["Meta", "Amazon"], acceptance: "46.3%", completed: false },
      { id: "57", title: "Lowest Common Ancestor of a BST", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", leetcodeId: 235, tags: ["Tree", "DFS", "BST"], companies: ["Meta", "Amazon"], acceptance: "61.1%", completed: false },
      { id: "58", title: "Binary Tree Level Order Traversal", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/", leetcodeId: 102, tags: ["Tree", "BFS"], companies: ["Amazon", "Meta", "Microsoft"], acceptance: "64.2%", completed: false },
      { id: "59", title: "Validate Binary Search Tree", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/", leetcodeId: 98, tags: ["Tree", "DFS", "BST"], companies: ["Amazon", "Meta", "Microsoft"], acceptance: "32.0%", completed: false },
      { id: "60", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", leetcodeId: 124, tags: ["Tree", "DFS", "Dynamic Programming"], companies: ["Meta", "Amazon", "Google"], acceptance: "39.2%", completed: false },
      { id: "61", title: "Kth Smallest Element in a BST", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", leetcodeId: 230, tags: ["Tree", "DFS", "BST"], companies: ["Amazon", "Meta"], acceptance: "69.0%", completed: false },
      { id: "62", title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", leetcodeId: 105, tags: ["Array", "Tree", "DFS"], companies: ["Amazon", "Microsoft"], acceptance: "61.5%", completed: false },
      { id: "63", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", leetcodeId: 297, tags: ["Tree", "DFS", "BFS", "Design"], companies: ["Meta", "Amazon", "Google"], acceptance: "55.0%", completed: false },
      { id: "64", title: "Diameter of Binary Tree", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/", leetcodeId: 543, tags: ["Tree", "DFS"], companies: ["Meta", "Amazon"], acceptance: "56.5%", completed: false },
      { id: "65", title: "Balanced Binary Tree", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/balanced-binary-tree/", leetcodeId: 110, tags: ["Tree", "DFS"], companies: ["Amazon", "Google"], acceptance: "49.5%", completed: false },
    ]
  },
  {
    id: "graphs",
    name: "Graphs",
    icon: "🕸️",
    description: "Graph traversals, shortest paths, and more",
    color: "from-rose-500 to-pink-500",
    problems: [
      { id: "66", title: "Number of Islands", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", leetcodeId: 200, tags: ["Array", "DFS", "BFS", "Graph"], companies: ["Amazon", "Meta", "Microsoft"], acceptance: "56.5%", completed: false },
      { id: "67", title: "Clone Graph", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/clone-graph/", leetcodeId: 133, tags: ["Hash Table", "DFS", "BFS", "Graph"], companies: ["Meta", "Amazon"], acceptance: "51.3%", completed: false },
      { id: "68", title: "Pacific Atlantic Water Flow", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/", leetcodeId: 417, tags: ["Array", "DFS", "BFS", "Matrix"], companies: ["Google", "Amazon"], acceptance: "54.0%", completed: false },
      { id: "69", title: "Course Schedule", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/course-schedule/", leetcodeId: 207, tags: ["DFS", "BFS", "Graph", "Topological Sort"], companies: ["Amazon", "Microsoft"], acceptance: "45.4%", completed: false },
      { id: "70", title: "Course Schedule II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/", leetcodeId: 210, tags: ["DFS", "BFS", "Graph", "Topological Sort"], companies: ["Amazon", "Meta"], acceptance: "48.5%", completed: false },
      { id: "71", title: "Word Ladder", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/word-ladder/", leetcodeId: 127, tags: ["Hash Table", "String", "BFS"], companies: ["Amazon", "Meta", "Google"], acceptance: "37.2%", completed: false },
      { id: "72", title: "Rotting Oranges", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/", leetcodeId: 994, tags: ["Array", "BFS", "Matrix"], companies: ["Amazon", "Microsoft"], acceptance: "53.0%", completed: false },
      { id: "73", title: "Walls and Gates", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/walls-and-gates/", leetcodeId: 286, tags: ["Array", "BFS", "Matrix"], companies: ["Meta", "Amazon"], acceptance: "60.5%", completed: false },
      { id: "74", title: "Surrounded Regions", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/surrounded-regions/", leetcodeId: 130, tags: ["Array", "DFS", "BFS", "Matrix"], companies: ["Google", "Amazon"], acceptance: "36.0%", completed: false },
      { id: "75", title: "Graph Valid Tree", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/graph-valid-tree/", leetcodeId: 261, tags: ["DFS", "BFS", "Graph", "Union Find"], companies: ["Meta", "Google"], acceptance: "47.0%", completed: false },
      { id: "76", title: "Network Delay Time", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/network-delay-time/", leetcodeId: 743, tags: ["DFS", "BFS", "Graph", "Heap"], companies: ["Google", "Amazon"], acceptance: "51.5%", completed: false },
    ]
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    icon: "🧠",
    description: "Optimization through subproblem solutions",
    color: "from-teal-500 to-cyan-500",
    problems: [
      { id: "77", title: "Climbing Stairs", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", leetcodeId: 70, tags: ["Math", "Dynamic Programming", "Memoization"], companies: ["Amazon", "Microsoft"], acceptance: "52.0%", completed: false },
      { id: "78", title: "House Robber", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/house-robber/", leetcodeId: 198, tags: ["Array", "Dynamic Programming"], companies: ["Amazon", "Google"], acceptance: "49.2%", completed: false },
      { id: "79", title: "House Robber II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/", leetcodeId: 213, tags: ["Array", "Dynamic Programming"], companies: ["Amazon"], acceptance: "41.1%", completed: false },
      { id: "80", title: "Longest Palindromic Substring", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/", leetcodeId: 5, tags: ["String", "Dynamic Programming"], companies: ["Amazon", "Microsoft"], acceptance: "33.0%", completed: false },
      { id: "81", title: "Coin Change", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/coin-change/", leetcodeId: 322, tags: ["Array", "Dynamic Programming", "BFS"], companies: ["Amazon", "Google"], acceptance: "42.5%", completed: false },
      { id: "82", title: "Longest Increasing Subsequence", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", leetcodeId: 300, tags: ["Array", "Binary Search", "Dynamic Programming"], companies: ["Amazon", "Google", "Microsoft"], acceptance: "52.0%", completed: false },
      { id: "83", title: "Word Break", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/word-break/", leetcodeId: 139, tags: ["Hash Table", "String", "Dynamic Programming"], companies: ["Amazon", "Meta", "Google"], acceptance: "45.6%", completed: false },
      { id: "84", title: "Edit Distance", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/edit-distance/", leetcodeId: 72, tags: ["String", "Dynamic Programming"], companies: ["Amazon", "Google"], acceptance: "54.0%", completed: false },
      { id: "85", title: "Unique Paths", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/unique-paths/", leetcodeId: 62, tags: ["Math", "Dynamic Programming"], companies: ["Google", "Amazon"], acceptance: "62.5%", completed: false },
      { id: "86", title: "Jump Game", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/jump-game/", leetcodeId: 55, tags: ["Array", "Dynamic Programming", "Greedy"], companies: ["Amazon", "Microsoft"], acceptance: "38.5%", completed: false },
      { id: "87", title: "Jump Game II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/jump-game-ii/", leetcodeId: 45, tags: ["Array", "Dynamic Programming", "Greedy"], companies: ["Amazon", "Google"], acceptance: "39.5%", completed: false },
      { id: "88", title: "Decode Ways", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/decode-ways/", leetcodeId: 91, tags: ["String", "Dynamic Programming"], companies: ["Meta", "Google"], acceptance: "32.5%", completed: false },
      { id: "89", title: "Maximum Product Subarray", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/maximum-product-subarray/", leetcodeId: 152, tags: ["Array", "Dynamic Programming"], companies: ["Amazon", "Microsoft"], acceptance: "34.5%", completed: false },
      { id: "90", title: "Partition Equal Subset Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/", leetcodeId: 416, tags: ["Array", "Dynamic Programming"], companies: ["Meta", "Amazon"], acceptance: "46.5%", completed: false },
    ]
  },
  {
    id: "backtracking",
    name: "Backtracking",
    icon: "🔄",
    description: "Explore all possibilities with pruning",
    color: "from-amber-500 to-yellow-500",
    problems: [
      { id: "91", title: "Subsets", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/subsets/", leetcodeId: 78, tags: ["Array", "Backtracking", "Bit Manipulation"], companies: ["Meta", "Amazon"], acceptance: "75.0%", completed: false },
      { id: "92", title: "Combination Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/combination-sum/", leetcodeId: 39, tags: ["Array", "Backtracking"], companies: ["Amazon", "Meta"], acceptance: "68.5%", completed: false },
      { id: "93", title: "Permutations", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/permutations/", leetcodeId: 46, tags: ["Array", "Backtracking"], companies: ["Meta", "Amazon", "Microsoft"], acceptance: "76.0%", completed: false },
      { id: "94", title: "Word Search", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/word-search/", leetcodeId: 79, tags: ["Array", "Backtracking", "Matrix"], companies: ["Amazon", "Meta", "Microsoft"], acceptance: "40.5%", completed: false },
      { id: "95", title: "N-Queens", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/n-queens/", leetcodeId: 51, tags: ["Array", "Backtracking"], companies: ["Amazon", "Meta", "Google"], acceptance: "63.5%", completed: false },
      { id: "96", title: "Combination Sum II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/combination-sum-ii/", leetcodeId: 40, tags: ["Array", "Backtracking"], companies: ["Amazon", "Microsoft"], acceptance: "53.0%", completed: false },
      { id: "97", title: "Subsets II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/subsets-ii/", leetcodeId: 90, tags: ["Array", "Backtracking", "Bit Manipulation"], companies: ["Meta", "Amazon"], acceptance: "55.5%", completed: false },
      { id: "98", title: "Palindrome Partitioning", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/palindrome-partitioning/", leetcodeId: 131, tags: ["String", "Backtracking", "Dynamic Programming"], companies: ["Amazon", "Meta"], acceptance: "63.0%", completed: false },
      { id: "99", title: "Letter Combinations of a Phone Number", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", leetcodeId: 17, tags: ["Hash Table", "String", "Backtracking"], companies: ["Meta", "Amazon", "Google"], acceptance: "57.0%", completed: false },
    ]
  },
  {
    id: "heap-priority-queue",
    name: "Heap / Priority Queue",
    icon: "⛰️",
    description: "Efficient min/max operations",
    color: "from-sky-500 to-blue-500",
    problems: [
      { id: "100", title: "Kth Largest Element in an Array", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/", leetcodeId: 215, tags: ["Array", "Divide and Conquer", "Heap"], companies: ["Meta", "Amazon", "Google"], acceptance: "65.5%", completed: false },
      { id: "101", title: "Last Stone Weight", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/", leetcodeId: 1046, tags: ["Array", "Heap"], companies: ["Amazon"], acceptance: "64.5%", completed: false },
      { id: "102", title: "K Closest Points to Origin", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/k-closest-points-to-origin/", leetcodeId: 973, tags: ["Array", "Math", "Heap"], companies: ["Meta", "Amazon"], acceptance: "66.0%", completed: false },
      { id: "103", title: "Task Scheduler", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/task-scheduler/", leetcodeId: 621, tags: ["Array", "Hash Table", "Greedy", "Heap"], companies: ["Meta", "Amazon", "Google"], acceptance: "57.5%", completed: false },
      { id: "104", title: "Design Twitter", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/design-twitter/", leetcodeId: 355, tags: ["Hash Table", "Linked List", "Design", "Heap"], companies: ["Amazon", "Twitter"], acceptance: "37.0%", completed: false },
      { id: "105", title: "Find Median from Data Stream", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/", leetcodeId: 295, tags: ["Two Pointers", "Design", "Heap"], companies: ["Amazon", "Microsoft", "Google"], acceptance: "51.5%", completed: false },
    ]
  },
  {
    id: "intervals",
    name: "Intervals",
    icon: "📏",
    description: "Working with ranges and intervals",
    color: "from-sky-400 to-cyan-400",
    problems: [
      { id: "106", title: "Merge Intervals", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/merge-intervals/", leetcodeId: 56, tags: ["Array", "Sorting"], companies: ["Meta", "Amazon", "Google"], acceptance: "46.5%", completed: false },
      { id: "107", title: "Insert Interval", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/insert-interval/", leetcodeId: 57, tags: ["Array"], companies: ["Google", "Amazon"], acceptance: "39.0%", completed: false },
      { id: "108", title: "Non-overlapping Intervals", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/non-overlapping-intervals/", leetcodeId: 435, tags: ["Array", "Dynamic Programming", "Greedy"], companies: ["Meta", "Amazon"], acceptance: "51.5%", completed: false },
      { id: "109", title: "Meeting Rooms", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/meeting-rooms/", leetcodeId: 252, tags: ["Array", "Sorting"], companies: ["Meta", "Amazon"], acceptance: "57.5%", completed: false },
      { id: "110", title: "Meeting Rooms II", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/meeting-rooms-ii/", leetcodeId: 253, tags: ["Array", "Two Pointers", "Sorting", "Heap"], companies: ["Meta", "Amazon", "Google"], acceptance: "50.5%", completed: false },
      { id: "111", title: "Minimum Interval to Include Each Query", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/minimum-interval-to-include-each-query/", leetcodeId: 1851, tags: ["Array", "Binary Search", "Sorting", "Heap"], companies: ["Google"], acceptance: "48.0%", completed: false },
    ]
  },
  {
    id: "greedy",
    name: "Greedy",
    icon: "🎯",
    description: "Making locally optimal choices",
    color: "from-lime-500 to-green-500",
    problems: [
      { id: "112", title: "Maximum Subarray", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", leetcodeId: 53, tags: ["Array", "Divide and Conquer", "Dynamic Programming"], companies: ["Amazon", "Microsoft", "Apple"], acceptance: "50.0%", completed: false },
      { id: "113", title: "Gas Station", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/gas-station/", leetcodeId: 134, tags: ["Array", "Greedy"], companies: ["Amazon", "Google"], acceptance: "45.0%", completed: false },
      { id: "114", title: "Hand of Straights", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/hand-of-straights/", leetcodeId: 846, tags: ["Array", "Hash Table", "Greedy"], companies: ["Google"], acceptance: "56.5%", completed: false },
      { id: "115", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/", leetcodeId: 1899, tags: ["Array", "Greedy"], companies: ["Google"], acceptance: "64.0%", completed: false },
      { id: "116", title: "Partition Labels", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/partition-labels/", leetcodeId: 763, tags: ["Hash Table", "Two Pointers", "String", "Greedy"], companies: ["Amazon", "Meta"], acceptance: "79.5%", completed: false },
      { id: "117", title: "Valid Parenthesis String", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/valid-parenthesis-string/", leetcodeId: 678, tags: ["String", "Dynamic Programming", "Greedy"], companies: ["Amazon", "Meta"], acceptance: "33.5%", completed: false },
    ]
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    icon: "🔢",
    description: "Working with binary representations",
    color: "from-slate-500 to-zinc-500",
    problems: [
      { id: "118", title: "Single Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/single-number/", leetcodeId: 136, tags: ["Array", "Bit Manipulation"], companies: ["Amazon", "Apple"], acceptance: "71.5%", completed: false },
      { id: "119", title: "Number of 1 Bits", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/", leetcodeId: 191, tags: ["Bit Manipulation"], companies: ["Microsoft", "Apple"], acceptance: "66.5%", completed: false },
      { id: "120", title: "Counting Bits", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/counting-bits/", leetcodeId: 338, tags: ["Dynamic Programming", "Bit Manipulation"], companies: ["Amazon"], acceptance: "75.5%", completed: false },
      { id: "121", title: "Reverse Bits", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-bits/", leetcodeId: 190, tags: ["Divide and Conquer", "Bit Manipulation"], companies: ["Apple"], acceptance: "53.0%", completed: false },
      { id: "122", title: "Missing Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/missing-number/", leetcodeId: 268, tags: ["Array", "Hash Table", "Bit Manipulation"], companies: ["Amazon", "Microsoft"], acceptance: "62.5%", completed: false },
      { id: "123", title: "Sum of Two Integers", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/sum-of-two-integers/", leetcodeId: 371, tags: ["Math", "Bit Manipulation"], companies: ["Meta", "Amazon"], acceptance: "50.5%", completed: false },
      { id: "124", title: "Reverse Integer", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/reverse-integer/", leetcodeId: 7, tags: ["Math"], companies: ["Amazon", "Apple"], acceptance: "27.5%", completed: false },
    ]
  },
  {
    id: "math-geometry",
    name: "Math & Geometry",
    icon: "📐",
    description: "Mathematical and geometric problems",
    color: "from-cyan-500 to-teal-500",
    problems: [
      { id: "125", title: "Rotate Image", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/rotate-image/", leetcodeId: 48, tags: ["Array", "Math", "Matrix"], companies: ["Amazon", "Microsoft", "Apple"], acceptance: "70.5%", completed: false },
      { id: "126", title: "Spiral Matrix", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/spiral-matrix/", leetcodeId: 54, tags: ["Array", "Matrix", "Simulation"], companies: ["Amazon", "Google", "Microsoft"], acceptance: "45.5%", completed: false },
      { id: "127", title: "Set Matrix Zeroes", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/set-matrix-zeroes/", leetcodeId: 73, tags: ["Array", "Hash Table", "Matrix"], companies: ["Amazon", "Microsoft"], acceptance: "51.5%", completed: false },
      { id: "128", title: "Happy Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/happy-number/", leetcodeId: 202, tags: ["Hash Table", "Math", "Two Pointers"], companies: ["Amazon", "Apple"], acceptance: "54.5%", completed: false },
      { id: "129", title: "Plus One", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/plus-one/", leetcodeId: 66, tags: ["Array", "Math"], companies: ["Google", "Amazon"], acceptance: "43.5%", completed: false },
      { id: "130", title: "Pow(x, n)", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/powx-n/", leetcodeId: 50, tags: ["Math", "Recursion"], companies: ["Meta", "Amazon", "Google"], acceptance: "33.5%", completed: false },
      { id: "131", title: "Multiply Strings", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/multiply-strings/", leetcodeId: 43, tags: ["Math", "String", "Simulation"], companies: ["Meta", "Amazon", "Microsoft"], acceptance: "39.5%", completed: false },
      { id: "132", title: "Detect Squares", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/detect-squares/", leetcodeId: 2013, tags: ["Array", "Hash Table", "Design"], companies: ["Google"], acceptance: "50.0%", completed: false },
    ]
  },
];

const difficultyColors = {
  Easy: "text-green-400 bg-green-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  Hard: "text-red-400 bg-red-400/10",
};

export default function PracticePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [showSyncNotification, setShowSyncNotification] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const { 
    isAuthenticated, 
    isLoading, 
    syncPractice, 
    getCompletedProblemIds,
    userProgress 
  } = useProgressSync();

  // Load completed from server or localStorage
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const serverProblems = getCompletedProblemIds();
      if (serverProblems.size > 0) {
        setCompletedProblems(serverProblems);
      }
    } else if (!isAuthenticated && !isLoading) {
      const saved = localStorage.getItem('algobuddy_completedProblems');
      if (saved) {
        setCompletedProblems(new Set(JSON.parse(saved)));
      }
    }
  }, [isAuthenticated, isLoading, getCompletedProblemIds]);

  // Save to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('algobuddy_completedProblems', JSON.stringify([...completedProblems]));
    }
  }, [completedProblems, isAuthenticated]);

  const toggleComplete = async (problemId: string, difficulty: string) => {
    const newCompleted = new Set(completedProblems);
    const wasCompleted = newCompleted.has(problemId);
    
    if (wasCompleted) {
      newCompleted.delete(problemId);
    } else {
      newCompleted.add(problemId);
      
      // Sync to server if authenticated
      if (isAuthenticated) {
        const result = await syncPractice(problemId, difficulty);
        if (result.success && result.xpGained) {
          setSyncMessage(`+${result.xpGained} XP${result.leveledUp ? ` • Level ${result.newLevel}!` : ''}`);
          setShowSyncNotification(true);
          setTimeout(() => setShowSyncNotification(false), 3000);
        }
      }
    }
    setCompletedProblems(newCompleted);
  };

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const filterProblems = (problems: Problem[]) => {
    return problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = difficultyFilter === "all" || p.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  };

  const totalProblems = topics.reduce((acc, t) => acc + t.problems.length, 0);
  const completedCount = completedProblems.size;

  return (
    <div className="min-h-screen bg-white">
      {/* Sync Notification */}
      <AnimatePresence>
        {showSyncNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg shadow-emerald-500/25"
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
          className="fixed top-20 right-4 z-40 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 shadow-sm text-xs text-blue-700"
        >
          <span>💡 Sign in to track progress</span>
        </motion.div>
      )}

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b-2 border-slate-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-slate-900 hover:text-purple-600 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl">AlgoBuddy</span>
                </Link>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Practice Problems</h1>
                  <p className="text-sm text-slate-600">Master DSA with {totalProblems}+ curated LeetCode problems</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                  <Trophy className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">{completedCount}/{totalProblems}</span>
                  <span className="text-slate-400 text-sm">solved</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-400/20 to-cyan-400/20 border border-sky-400/30 rounded-xl">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 font-semibold">{Math.round((completedCount / totalProblems) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search problems by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex gap-2">
              {["all", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={cn(
                    "px-4 py-3 rounded-xl font-medium transition-all",
                    difficultyFilter === diff
                      ? diff === "Easy" ? "bg-green-500/20 text-green-600 border border-green-500/50"
                      : diff === "Medium" ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/50"
                      : diff === "Hard" ? "bg-red-500/20 text-red-600 border border-red-500/50"
                      : "bg-purple-500/20 text-purple-600 border border-purple-500/50"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-300"
                  )}
                >
                  {diff === "all" ? "All" : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-4">
            {topics.map((topic, topicIndex) => {
              const filteredProblems = filterProblems(topic.problems);
              const topicCompleted = topic.problems.filter(p => completedProblems.has(p.id)).length;
              const progressPercent = (topicCompleted / topic.problems.length) * 100;
              
              if (searchQuery && filteredProblems.length === 0) return null;

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: topicIndex * 0.05 }}
                  className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg"
                >
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-xl shadow-lg`}>
                        {topic.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-slate-900">{topic.name}</h3>
                        <p className="text-sm text-slate-600">{topic.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-slate-600">{topicCompleted}/{topic.problems.length} solved</p>
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full bg-gradient-to-r ${topic.color}`}
                          />
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedTopics.has(topic.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedTopics.has(topic.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t-2 border-slate-200"
                      >
                        <div className="p-4 space-y-2">
                          {filteredProblems.map((problem, problemIndex) => (
                            <motion.div
                              key={problem.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: problemIndex * 0.02 }}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl transition-all group",
                                completedProblems.has(problem.id)
                                  ? "bg-green-500/10 border border-green-500/20"
                                  : "bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-blue-300"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => toggleComplete(problem.id, problem.difficulty)}
                                  className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                    completedProblems.has(problem.id)
                                      ? "bg-green-500 text-white"
                                      : "border-2 border-slate-300 hover:border-blue-500"
                                  )}
                                >
                                  {completedProblems.has(problem.id) && <CheckCircle className="w-4 h-4" />}
                                </button>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-500 text-sm">#{problem.leetcodeId}</span>
                                    <h4 className={cn(
                                      "font-medium transition-colors",
                                      completedProblems.has(problem.id) ? "text-green-600" : "text-slate-900 group-hover:text-blue-600"
                                    )}>
                                      {problem.title}
                                    </h4>
                                    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", difficultyColors[problem.difficulty])}>
                                      {problem.difficulty}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {problem.tags.slice(0, 3).map((tag) => (
                                      <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                                        {tag}
                                      </span>
                                    ))}
                                    <span className="text-xs text-slate-500">{problem.acceptance} acceptance</span>
                                  </div>
                                </div>
                              </div>
                              <a
                                href={problem.leetcodeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all text-sm"
                              >
                                <span className="hidden sm:inline">Solve on LeetCode</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

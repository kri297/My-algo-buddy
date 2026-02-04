'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, 
  Clock, 
  Trophy, 
  Target, 
  Play, 
  RotateCcw,
  ChevronRight,
  Star,
  Flame,
  Award,
  ArrowLeft,
  Code,
  CheckCircle,
  XCircle,
  Timer,
  Lightbulb,
  FastForward,
  Rocket,
  Medal,
  LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressSync } from '@/hooks/useProgressSync';

interface TestCase {
  input: string;
  output: string;
  hidden?: boolean;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  points: number;
  testCases: TestCase[];
  hint: string;
  starterCode: string;
  solution: string;
  category: string;
}

// ============================================
// COMPREHENSIVE CHALLENGE DATABASE
// ============================================
const speedChallenges: Challenge[] = [
  // ========== EASY CHALLENGES ==========
  {
    id: 1,
    title: "Reverse a String",
    description: "Write a function `reverseString` that takes a string and returns it reversed.",
    difficulty: "easy",
    timeLimit: 60,
    points: 100,
    category: "Strings",
    testCases: [
      { input: "reverseString('hello')", output: "'olleh'" },
      { input: "reverseString('world')", output: "'dlrow'" },
      { input: "reverseString('a')", output: "'a'" },
      { input: "reverseString('')", output: "''" },
    ],
    hint: "Try using split(), reverse(), and join() methods.",
    starterCode: "function reverseString(str) {\n  // Your code here\n  \n}",
    solution: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}"
  },
  {
    id: 2,
    title: "Find Maximum",
    description: "Write a function `findMax` that returns the maximum number in an array.",
    difficulty: "easy",
    timeLimit: 45,
    points: 80,
    category: "Arrays",
    testCases: [
      { input: "findMax([1, 5, 3, 9, 2])", output: "9" },
      { input: "findMax([-1, -5, -3])", output: "-1" },
      { input: "findMax([42])", output: "42" },
      { input: "findMax([0, 0, 0])", output: "0" },
    ],
    hint: "Use Math.max() with the spread operator, or a simple loop.",
    starterCode: "function findMax(arr) {\n  // Your code here\n  \n}",
    solution: "function findMax(arr) {\n  return Math.max(...arr);\n}"
  },
  {
    id: 3,
    title: "Is Palindrome",
    description: "Write a function `isPalindrome` that checks if a string reads the same forwards and backwards.",
    difficulty: "easy",
    timeLimit: 60,
    points: 100,
    category: "Strings",
    testCases: [
      { input: "isPalindrome('racecar')", output: "true" },
      { input: "isPalindrome('hello')", output: "false" },
      { input: "isPalindrome('a')", output: "true" },
      { input: "isPalindrome('noon')", output: "true" },
    ],
    hint: "Compare the string with its reverse.",
    starterCode: "function isPalindrome(str) {\n  // Your code here\n  \n}",
    solution: "function isPalindrome(str) {\n  const reversed = str.split('').reverse().join('');\n  return str === reversed;\n}"
  },
  {
    id: 4,
    title: "Count Vowels",
    description: "Write a function `countVowels` that counts the number of vowels (a, e, i, o, u) in a string.",
    difficulty: "easy",
    timeLimit: 60,
    points: 100,
    category: "Strings",
    testCases: [
      { input: "countVowels('hello')", output: "2" },
      { input: "countVowels('AEIOU')", output: "5" },
      { input: "countVowels('xyz')", output: "0" },
      { input: "countVowels('beautiful')", output: "5" },
    ],
    hint: "Use a regex or loop through checking each character.",
    starterCode: "function countVowels(str) {\n  // Your code here\n  \n}",
    solution: "function countVowels(str) {\n  const matches = str.toLowerCase().match(/[aeiou]/g);\n  return matches ? matches.length : 0;\n}"
  },
  {
    id: 5,
    title: "Sum of Array",
    description: "Write a function `sumArray` that returns the sum of all numbers in an array.",
    difficulty: "easy",
    timeLimit: 45,
    points: 80,
    category: "Arrays",
    testCases: [
      { input: "sumArray([1, 2, 3, 4, 5])", output: "15" },
      { input: "sumArray([-1, 1])", output: "0" },
      { input: "sumArray([10])", output: "10" },
      { input: "sumArray([])", output: "0" },
    ],
    hint: "Use the reduce() method or a simple loop.",
    starterCode: "function sumArray(arr) {\n  // Your code here\n  \n}",
    solution: "function sumArray(arr) {\n  return arr.reduce((sum, n) => sum + n, 0);\n}"
  },
  {
    id: 6,
    title: "FizzBuzz Single",
    description: "Write a function `fizzBuzz` that returns 'Fizz' for multiples of 3, 'Buzz' for 5, 'FizzBuzz' for both, or the number itself.",
    difficulty: "easy",
    timeLimit: 75,
    points: 120,
    category: "Logic",
    testCases: [
      { input: "fizzBuzz(3)", output: "'Fizz'" },
      { input: "fizzBuzz(5)", output: "'Buzz'" },
      { input: "fizzBuzz(15)", output: "'FizzBuzz'" },
      { input: "fizzBuzz(7)", output: "7" },
    ],
    hint: "Check divisibility by 15 first (both 3 and 5), then 3, then 5.",
    starterCode: "function fizzBuzz(n) {\n  // Your code here\n  \n}",
    solution: "function fizzBuzz(n) {\n  if (n % 15 === 0) return 'FizzBuzz';\n  if (n % 3 === 0) return 'Fizz';\n  if (n % 5 === 0) return 'Buzz';\n  return n;\n}"
  },
  {
    id: 7,
    title: "Find First Duplicate",
    description: "Write a function `firstDuplicate` that returns the first duplicate value in an array, or -1 if none.",
    difficulty: "easy",
    timeLimit: 75,
    points: 120,
    category: "Arrays",
    testCases: [
      { input: "firstDuplicate([1, 2, 3, 2, 1])", output: "2" },
      { input: "firstDuplicate([1, 2, 3, 4])", output: "-1" },
      { input: "firstDuplicate([1, 1])", output: "1" },
    ],
    hint: "Use a Set to track seen values.",
    starterCode: "function firstDuplicate(arr) {\n  // Your code here\n  \n}",
    solution: "function firstDuplicate(arr) {\n  const seen = new Set();\n  for (const num of arr) {\n    if (seen.has(num)) return num;\n    seen.add(num);\n  }\n  return -1;\n}"
  },

  // ========== MEDIUM CHALLENGES ==========
  {
    id: 8,
    title: "Two Sum Indices",
    description: "Write a function `twoSum` that finds two numbers in an array that add up to a target. Return their indices.",
    difficulty: "medium",
    timeLimit: 120,
    points: 200,
    category: "Arrays",
    testCases: [
      { input: "twoSum([2, 7, 11, 15], 9)", output: "[0, 1]" },
      { input: "twoSum([3, 2, 4], 6)", output: "[1, 2]" },
      { input: "twoSum([3, 3], 6)", output: "[0, 1]" },
    ],
    hint: "Use a hash map to store values and their indices. For each number, check if (target - num) exists.",
    starterCode: "function twoSum(nums, target) {\n  // Your code here\n  \n}",
    solution: "function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n}"
  },
  {
    id: 9,
    title: "Valid Parentheses",
    description: "Write a function `isValid` that checks if a string of parentheses is valid (properly opened and closed).",
    difficulty: "medium",
    timeLimit: 120,
    points: 200,
    category: "Stacks",
    testCases: [
      { input: "isValid('()')", output: "true" },
      { input: "isValid('()[]{}')", output: "true" },
      { input: "isValid('(]')", output: "false" },
      { input: "isValid('([)]')", output: "false" },
      { input: "isValid('{[]}')", output: "true" },
    ],
    hint: "Use a stack. Push opening brackets, pop for closing and check if they match.",
    starterCode: "function isValid(s) {\n  // Your code here\n  \n}",
    solution: "function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const char of s) {\n    if ('([{'.includes(char)) {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}"
  },
  {
    id: 10,
    title: "Fibonacci Number",
    description: "Write a function `fib` that returns the nth Fibonacci number. F(0)=0, F(1)=1.",
    difficulty: "medium",
    timeLimit: 90,
    points: 150,
    category: "Recursion",
    testCases: [
      { input: "fib(0)", output: "0" },
      { input: "fib(1)", output: "1" },
      { input: "fib(5)", output: "5" },
      { input: "fib(10)", output: "55" },
    ],
    hint: "Use iteration or memoization to avoid exponential time.",
    starterCode: "function fib(n) {\n  // Your code here\n  \n}",
    solution: "function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}"
  },
  {
    id: 11,
    title: "Merge Sorted Arrays",
    description: "Write a function `mergeSorted` that merges two sorted arrays into one sorted array.",
    difficulty: "medium",
    timeLimit: 120,
    points: 200,
    category: "Arrays",
    testCases: [
      { input: "mergeSorted([1,3,5], [2,4,6])", output: "[1,2,3,4,5,6]" },
      { input: "mergeSorted([1,2], [3,4])", output: "[1,2,3,4]" },
      { input: "mergeSorted([], [1,2])", output: "[1,2]" },
    ],
    hint: "Use two pointers, one for each array, and compare elements.",
    starterCode: "function mergeSorted(arr1, arr2) {\n  // Your code here\n  \n}",
    solution: "function mergeSorted(arr1, arr2) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < arr1.length && j < arr2.length) {\n    if (arr1[i] < arr2[j]) result.push(arr1[i++]);\n    else result.push(arr2[j++]);\n  }\n  return [...result, ...arr1.slice(i), ...arr2.slice(j)];\n}"
  },
  {
    id: 12,
    title: "Anagram Check",
    description: "Write a function `isAnagram` that checks if two strings are anagrams of each other.",
    difficulty: "medium",
    timeLimit: 90,
    points: 150,
    category: "Strings",
    testCases: [
      { input: "isAnagram('listen', 'silent')", output: "true" },
      { input: "isAnagram('hello', 'world')", output: "false" },
      { input: "isAnagram('anagram', 'nagaram')", output: "true" },
    ],
    hint: "Sort both strings and compare, or use a character frequency map.",
    starterCode: "function isAnagram(s, t) {\n  // Your code here\n  \n}",
    solution: "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  return s.split('').sort().join('') === t.split('').sort().join('');\n}"
  },
  {
    id: 13,
    title: "Maximum Subarray Sum",
    description: "Write a function `maxSubArray` that finds the contiguous subarray with the largest sum.",
    difficulty: "medium",
    timeLimit: 120,
    points: 250,
    category: "Dynamic Programming",
    testCases: [
      { input: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", output: "6" },
      { input: "maxSubArray([1])", output: "1" },
      { input: "maxSubArray([5,4,-1,7,8])", output: "23" },
    ],
    hint: "Use Kadane's algorithm: track current sum and max sum, reset current if it goes negative.",
    starterCode: "function maxSubArray(nums) {\n  // Your code here\n  \n}",
    solution: "function maxSubArray(nums) {\n  let maxSum = nums[0], currentSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}"
  },

  // ========== HARD CHALLENGES ==========
  {
    id: 14,
    title: "Longest Substring Without Repeating",
    description: "Write a function `lengthOfLongestSubstring` that finds the length of the longest substring without repeating characters.",
    difficulty: "hard",
    timeLimit: 180,
    points: 300,
    category: "Sliding Window",
    testCases: [
      { input: "lengthOfLongestSubstring('abcabcbb')", output: "3" },
      { input: "lengthOfLongestSubstring('bbbbb')", output: "1" },
      { input: "lengthOfLongestSubstring('pwwkew')", output: "3" },
    ],
    hint: "Use sliding window with a Set. Expand right, shrink left when duplicate found.",
    starterCode: "function lengthOfLongestSubstring(s) {\n  // Your code here\n  \n}",
    solution: "function lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left++]);\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}"
  },
  {
    id: 15,
    title: "Binary Search",
    description: "Write a function `binarySearch` that returns the index of a target in a sorted array, or -1 if not found.",
    difficulty: "medium",
    timeLimit: 90,
    points: 150,
    category: "Searching",
    testCases: [
      { input: "binarySearch([1,2,3,4,5], 3)", output: "2" },
      { input: "binarySearch([1,2,3,4,5], 6)", output: "-1" },
      { input: "binarySearch([1], 1)", output: "0" },
    ],
    hint: "Divide and conquer: compare with middle, search left or right half.",
    starterCode: "function binarySearch(arr, target) {\n  // Your code here\n  \n}",
    solution: "function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}"
  },
  {
    id: 16,
    title: "Product Except Self",
    description: "Write a function `productExceptSelf` that returns an array where each element is the product of all other elements.",
    difficulty: "hard",
    timeLimit: 180,
    points: 300,
    category: "Arrays",
    testCases: [
      { input: "productExceptSelf([1,2,3,4])", output: "[24,12,8,6]" },
      { input: "productExceptSelf([2,3])", output: "[3,2]" },
    ],
    hint: "Use prefix and suffix products. Can be done in O(n) time and O(1) extra space.",
    starterCode: "function productExceptSelf(nums) {\n  // Your code here\n  \n}",
    solution: "function productExceptSelf(nums) {\n  const n = nums.length;\n  const result = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    result[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    result[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return result;\n}"
  },
  {
    id: 17,
    title: "Rotate Array",
    description: "Write a function `rotate` that rotates an array to the right by k steps.",
    difficulty: "medium",
    timeLimit: 120,
    points: 200,
    category: "Arrays",
    testCases: [
      { input: "rotate([1,2,3,4,5,6,7], 3)", output: "[5,6,7,1,2,3,4]" },
      { input: "rotate([-1,-100,3,99], 2)", output: "[3,99,-1,-100]" },
    ],
    hint: "Handle k > length by using modulo. Can slice and concatenate, or reverse three times.",
    starterCode: "function rotate(nums, k) {\n  // Your code here\n  \n}",
    solution: "function rotate(nums, k) {\n  k = k % nums.length;\n  return [...nums.slice(-k), ...nums.slice(0, -k)];\n}"
  },
  {
    id: 18,
    title: "Climbing Stairs",
    description: "Write a function `climbStairs` that counts distinct ways to climb n stairs (1 or 2 steps at a time).",
    difficulty: "medium",
    timeLimit: 90,
    points: 180,
    category: "Dynamic Programming",
    testCases: [
      { input: "climbStairs(2)", output: "2" },
      { input: "climbStairs(3)", output: "3" },
      { input: "climbStairs(5)", output: "8" },
    ],
    hint: "This is essentially Fibonacci! ways(n) = ways(n-1) + ways(n-2).",
    starterCode: "function climbStairs(n) {\n  // Your code here\n  \n}",
    solution: "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}"
  },
];

export default function SpeedCodingPage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [results, setResults] = useState<{ passed: boolean; challenge: Challenge; timeTaken: number }[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [showSolution, setShowSolution] = useState(false);
  const [challengeStartTime, setChallengeStartTime] = useState(0);
  const [showSyncNotification, setShowSyncNotification] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [completedChallenges, setCompletedChallenges] = useState<Set<number>>(new Set());

  const { 
    isAuthenticated, 
    isLoading, 
    syncSpeedCoding, 
    getCompletedSpeedChallengeIds,
    userProgress 
  } = useProgressSync();

  // Load completed challenges from server or localStorage
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const serverChallenges = getCompletedSpeedChallengeIds();
      if (serverChallenges.size > 0) {
        setCompletedChallenges(serverChallenges);
      }
    } else if (!isAuthenticated && !isLoading) {
      const saved = localStorage.getItem('algobuddy_speedChallenges');
      if (saved) {
        setCompletedChallenges(new Set(JSON.parse(saved).map(Number)));
      }
    }
  }, [isAuthenticated, isLoading, getCompletedSpeedChallengeIds]);

  // Save to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('algobuddy_speedChallenges', JSON.stringify([...completedChallenges]));
    }
  }, [completedChallenges, isAuthenticated]);

  const filteredChallenges = speedChallenges.filter(c => 
    difficulty === 'all' || c.difficulty === difficulty
  );

  const currentChallenge = filteredChallenges[currentChallengeIndex];

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setCurrentChallengeIndex(0);
    setScore(0);
    setStreak(0);
    setResults([]);
    setTotalTime(0);
    setTimeLeft(filteredChallenges[0]?.timeLimit || 60);
    setCode(filteredChallenges[0]?.starterCode || '');
    setShowHint(false);
    setHintUsed(false);
    setShowSolution(false);
    setChallengeStartTime(Date.now());
  };

  const handleSubmit = async () => {
    const timeTaken = Math.floor((Date.now() - challengeStartTime) / 1000);
    
    // Check if code contains expected patterns (simplified validation)
    const passed = validateCode(code, currentChallenge);
    
    if (passed) {
      const timeBonus = Math.floor(timeLeft / 10) * 15;
      const streakBonus = streak * 25;
      const hintPenalty = hintUsed ? 20 : 0;
      const points = currentChallenge.points + timeBonus + streakBonus - hintPenalty;
      const finalPoints = Math.max(points, currentChallenge.points / 2);
      setScore(prev => prev + finalPoints);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(bs => Math.max(bs, newStreak));
        return newStreak;
      });
      
      // Sync to server if authenticated and challenge not already completed
      if (!completedChallenges.has(currentChallenge.id)) {
        const newCompleted = new Set(completedChallenges);
        newCompleted.add(currentChallenge.id);
        setCompletedChallenges(newCompleted);
        
        if (isAuthenticated) {
          const result = await syncSpeedCoding(currentChallenge.id, timeTaken, Math.floor(finalPoints));
          if (result.success && result.xpGained) {
            setSyncMessage(`+${result.xpGained} XP`);
            setShowSyncNotification(true);
            setTimeout(() => setShowSyncNotification(false), 2000);
          }
        }
      }
    } else {
      setStreak(0);
    }

    setResults(prev => [...prev, { passed, challenge: currentChallenge, timeTaken }]);
    moveToNext();
  };

  const validateCode = (code: string, challenge: Challenge): boolean => {
    // Simple validation - check for function definition and return statement
    const hasFunction = code.includes('function') || code.includes('=>');
    const hasReturn = code.includes('return');
    const hasLogic = code.length > challenge.starterCode.length + 10;
    return hasFunction && hasReturn && hasLogic;
  };

  const handleSkip = () => {
    setStreak(0);
    const timeTaken = Math.floor((Date.now() - challengeStartTime) / 1000);
    setResults(prev => [...prev, { passed: false, challenge: currentChallenge, timeTaken }]);
    moveToNext();
  };

  const handleTimeout = () => {
    handleSkip();
  };

  const moveToNext = () => {
    if (currentChallengeIndex < filteredChallenges.length - 1) {
      const nextIndex = currentChallengeIndex + 1;
      setCurrentChallengeIndex(nextIndex);
      setTimeLeft(filteredChallenges[nextIndex].timeLimit);
      setCode(filteredChallenges[nextIndex].starterCode);
      setShowHint(false);
      setHintUsed(false);
      setShowSolution(false);
      setChallengeStartTime(Date.now());
    } else {
      setGameState('results');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getScoreGrade = () => {
    const maxScore = filteredChallenges.reduce((sum, c) => sum + c.points, 0);
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return { grade: 'S', color: 'text-yellow-400', label: 'LEGENDARY!' };
    if (percentage >= 75) return { grade: 'A', color: 'text-green-400', label: 'Amazing!' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400', label: 'Great job!' };
    if (percentage >= 40) return { grade: 'C', color: 'text-orange-400', label: 'Good effort!' };
    return { grade: 'D', color: 'text-red-400', label: 'Keep practicing!' };
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-8 px-4">
        {/* Sync Notification */}
        <AnimatePresence>
          {showSyncNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg"
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
              <Link href="/auth/signin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm font-medium hover:opacity-90 transition">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            </div>
          </motion.div>
        )}

        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-3xl mx-auto relative">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Zap className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Speed Coding Challenge
            </h1>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Race against the clock! Solve coding challenges as fast as you can. 
              Build streaks for bonus points and prove your coding speed!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Code className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="font-bold text-xl">{filteredChallenges.length}</p>
                <p className="text-xs text-slate-400">Challenges</p>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="font-bold text-xl">{filteredChallenges.reduce((sum, c) => sum + c.points, 0)}</p>
                <p className="text-xs text-slate-400">Max Points</p>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Flame className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="font-bold text-xl">+25</p>
                <p className="text-xs text-slate-400">Streak Bonus</p>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Timer className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="font-bold text-xl">+15</p>
                <p className="text-xs text-slate-400">Time Bonus</p>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <p className="text-sm text-slate-400 mb-4">Select Difficulty</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-sm font-medium transition-all border",
                      difficulty === diff
                        ? diff === 'easy' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                          diff === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                          diff === 'hard' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                          'bg-purple-500/20 border-purple-500/50 text-purple-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    )}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    <span className="ml-2 text-xs opacity-70">
                      ({speedChallenges.filter(c => diff === 'all' || c.difficulty === diff).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* How to Play */}
            <div className="bg-slate-800/30 rounded-xl p-4 mb-8 text-left">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-purple-400" />
                How to Play
              </h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  Solve each challenge before time runs out
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  Build streaks by solving consecutive challenges for bonus points
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  Faster solutions = more time bonus points
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  Hints are available but cost 20 points
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              disabled={filteredChallenges.length === 0}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              Start Challenge
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const passedCount = results.filter(r => r.passed).length;
    const { grade, color, label } = getScoreGrade();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative w-32 h-32 mx-auto mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                <span className={cn("text-5xl font-black", color)}>{grade}</span>
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold mb-2">Challenge Complete!</h1>
            <p className={cn("text-xl font-semibold mb-6", color)}>{label}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{score}</p>
                <p className="text-xs text-slate-400">Score</p>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.round((passedCount / results.length) * 100)}%</p>
                <p className="text-xs text-slate-400">Accuracy</p>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{bestStreak}</p>
                <p className="text-xs text-slate-400">Best Streak</p>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
                <p className="text-xs text-slate-400">Total Time</p>
              </div>
            </div>

            {/* Results Breakdown */}
            <div className="text-left mb-8">
              <h3 className="font-semibold mb-4">Challenge Results</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border",
                      result.passed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    )}
                  >
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.challenge.title}</p>
                      <p className="text-xs text-slate-500">
                        {result.passed ? `+${result.challenge.points} points` : 'Skipped'} • {result.timeTaken}s
                      </p>
                    </div>
                    <span className={cn("text-xs px-2 py-1 rounded-lg border", getDifficultyColor(result.challenge.difficulty))}>
                      {result.challenge.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGameState('menu')}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </motion.button>
              <Link href="/" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold"
                >
                  Back to Home
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (!currentChallenge) return null;

  const progress = ((currentChallengeIndex + 1) / filteredChallenges.length) * 100;
  const timeProgress = (timeLeft / currentChallenge.timeLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-4 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-sm font-medium">
              {currentChallengeIndex + 1} / {filteredChallenges.length}
            </span>
            <span className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border", getDifficultyColor(currentChallenge.difficulty))}>
              {currentChallenge.difficulty}
            </span>
            <span className="px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-sm text-slate-400">
              {currentChallenge.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-sm font-medium"
              >
                <Flame className="w-4 h-4" />
                {streak} streak
              </motion.div>
            )}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 border border-white/10 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-bold">{score}</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg border",
              timeLeft < 15 
                ? 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse' 
                : 'bg-slate-800 border-white/10'
            )}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500"
            animate={{ width: `${timeProgress}%` }}
          />
          <div 
            className="absolute inset-y-0 left-0 bg-white/10"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge Description */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              {currentChallenge.title}
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">{currentChallenge.description}</p>

            {/* Test Cases */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Test Cases:</h3>
              <div className="space-y-2">
                {currentChallenge.testCases.filter(tc => !tc.hidden).map((tc, index) => (
                  <div key={index} className="bg-slate-800/50 border border-white/5 rounded-lg p-3 text-sm font-mono">
                    <div className="text-slate-400">
                      <span className="text-blue-400">Input:</span> {tc.input}
                    </div>
                    <div>
                      <span className="text-slate-400">Output:</span>{' '}
                      <span className="text-green-400">{tc.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowHint(!showHint);
                  if (!hintUsed) setHintUsed(true);
                }}
                className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Show Hint'} 
                {!hintUsed && <span className="text-xs text-slate-500">(-20 points)</span>}
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-200"
                  >
                    💡 {currentChallenge.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Code className="w-4 h-4" />
                {showSolution ? 'Hide Solution' : 'View Solution (gives up challenge)'}
              </button>
              <AnimatePresence>
                {showSolution && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm font-mono text-purple-200 whitespace-pre-wrap overflow-x-auto"
                  >
                    {currentChallenge.solution}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Your Solution
            </h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your code here..."
              className="w-full h-64 bg-slate-800 border border-white/10 rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors"
              spellCheck={false}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FastForward className="w-4 h-4" />
                Skip
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={code.trim().length === 0 || showSolution}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Submit
              </motion.button>
            </div>

            <p className="text-xs text-slate-500 mt-3 text-center">
              Points: {currentChallenge.points} {streak > 0 && `+ ${streak * 25} streak`} {timeLeft > 10 && `+ time bonus`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

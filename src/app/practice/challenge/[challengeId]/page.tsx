"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Check,
  X,
  Clock,
  Trophy,
  Lightbulb,
  Code2,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { Button, Card, Badge, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// Challenge data - in a real app this would come from an API/database
const challengeData: Record<string, any> = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    category: "Arrays",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "A brute force approach would be to check every pair of numbers.",
      "Can you use a hash map to store numbers you've seen?",
      "For each number, check if (target - number) exists in the hash map.",
    ],
    starterCode: {
      python: `def two_sum(nums, target):
    # Your code here
    pass

# Test your solution
print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
`,
      javascript: `function twoSum(nums, target) {
    // Your code here
}

// Test your solution
console.log(twoSum([2, 7, 11, 15], 9));  // Expected: [0, 1]
`,
    },
    solution: {
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
`,
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    points: 50,
  },
  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "easy",
    category: "Searching",
    description: `Given a sorted array of integers \`nums\` and an integer \`target\`, write a function to search for \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    hints: [
      "Think about dividing the search space in half each time.",
      "Compare the target with the middle element.",
      "If target < middle, search the left half. If target > middle, search the right half.",
    ],
    starterCode: {
      python: `def binary_search(nums, target):
    # Your code here
    pass

# Test your solution
print(binary_search([-1,0,3,5,9,12], 9))  # Expected: 4
`,
      javascript: `function binarySearch(nums, target) {
    // Your code here
}

// Test your solution
console.log(binarySearch([-1,0,3,5,9,12], 9));  // Expected: 4
`,
    },
    solution: {
      python: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
`,
      javascript: `function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
`,
    },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    points: 50,
  },
};

// Add more challenges as fallback
const defaultChallenge = {
  id: "default",
  title: "Challenge",
  difficulty: "medium",
  category: "General",
  description: "This challenge is coming soon!",
  examples: [],
  constraints: [],
  hints: ["Check back later for this challenge."],
  starterCode: {
    python: `# Coming soon!\npass`,
    javascript: `// Coming soon!`,
  },
  solution: { python: "", javascript: "" },
  testCases: [],
  timeComplexity: "TBD",
  spaceComplexity: "TBD",
  points: 50,
};

interface PageProps {
  params: Promise<{ challengeId: string }>;
}

export default function ChallengePage({ params }: PageProps) {
  const { challengeId } = use(params);
  const challenge = challengeData[challengeId] || defaultChallenge;

  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [code, setCode] = useState(challenge.starterCode[language]);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [testResults, setTestResults] = useState<
    { passed: boolean; input: string; expected: string; actual: string }[]
  >([]);

  const handleLanguageChange = (lang: "python" | "javascript") => {
    setLanguage(lang);
    setCode(challenge.starterCode[lang]);
    setOutput("");
    setTestResults([]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running tests...\n");
    setTestResults([]);

    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (language === "javascript") {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((a) => JSON.stringify(a)).join(" "));
        };

        eval(code);
        setOutput(logs.join("\n") || "Code executed (no output)");

        console.log = originalLog;
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      setOutput(
        "Python execution requires a backend.\nCopy the code and run it locally, or switch to JavaScript."
      );
    }

    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(challenge.starterCode[language]);
    setOutput("");
    setTestResults([]);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setCode(challenge.solution[language]);
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/practice">
                <Button variant="ghost" size="icon-sm">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-slate-900 dark:text-white">
                    {challenge.title}
                  </h1>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                      difficultyColors[challenge.difficulty as keyof typeof difficultyColors]
                    )}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {challenge.category} • {challenge.points} points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {challenge.timeComplexity}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Problem</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{challenge.description}</p>
              </div>
            </Card>

            {/* Examples */}
            {challenge.examples.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Examples</h3>
                <div className="space-y-4">
                  {challenge.examples.map((example: any, index: number) => (
                    <div
                      key={index}
                      className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4"
                    >
                      <div className="font-mono text-sm mb-2">
                        <span className="text-slate-500">Input:</span>{" "}
                        <span className="text-slate-900 dark:text-white">
                          {example.input}
                        </span>
                      </div>
                      <div className="font-mono text-sm mb-2">
                        <span className="text-slate-500">Output:</span>{" "}
                        <span className="text-green-600 dark:text-green-400">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium">Explanation:</span>{" "}
                          {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Constraints */}
            {challenge.constraints.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Constraints</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  {challenge.constraints.map((constraint: string, index: number) => (
                    <li key={index} className="font-mono">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Hints */}
            <Card className="p-6">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Hints</span>
                </div>
                <ChevronRight
                  className={cn(
                    "w-5 h-5 text-slate-400 transition-transform",
                    showHints && "rotate-90"
                  )}
                />
              </button>

              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-3"
                >
                  {challenge.hints
                    .slice(0, currentHintIndex + 1)
                    .map((hint: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {hint}
                        </p>
                      </div>
                    ))}

                  {currentHintIndex < challenge.hints.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentHintIndex(currentHintIndex + 1)}
                    >
                      Show Next Hint
                    </Button>
                  )}
                </motion.div>
              )}
            </Card>
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-slate-500" />
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    {(["python", "javascript"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={cn(
                          "px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize",
                          language === lang
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="h-[400px]">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowSolution}
                  disabled={showSolution}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showSolution ? "Solution Shown" : "Show Solution"}
                </Button>
                <Button onClick={handleRun} disabled={isRunning}>
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
              </div>
            </Card>

            {/* Output */}
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm font-medium">Output</span>
              </div>
              <div className="h-[200px] bg-slate-950 p-4 overflow-auto">
                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                  {output || "// Run your code to see output"}
                </pre>
              </div>
            </Card>

            {/* Complexity Info */}
            <Card className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-500">Expected Time:</span>{" "}
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {challenge.timeComplexity}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Expected Space:</span>{" "}
                  <span className="font-mono text-purple-600 dark:text-purple-400">
                    {challenge.spaceComplexity}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Play, RotateCcw, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui";

// Dynamic import for Monaco Editor (client-side only)
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const defaultCode = {
  python: `# Welcome to Algo Buddy Playground!
# Write your code here and run it.

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Test the algorithm
test_array = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", test_array)
sorted_array = bubble_sort(test_array.copy())
print("Sorted array:", sorted_array)
`,
  javascript: `// Welcome to Algo Buddy Playground!
// Write your code here and run it.

function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Test the algorithm
const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", testArray);
const sortedArray = bubbleSort([...testArray]);
console.log("Sorted array:", sortedArray);
`,
};

type Language = "python" | "javascript";

export default function PlaygroundPage() {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(defaultCode.python);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(defaultCode[lang]);
    setOutput("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...\n");

    try {
      if (language === "javascript") {
        // Execute JavaScript in browser
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map((a) => JSON.stringify(a)).join(" "));
        };

        try {
          // eslint-disable-next-line no-eval
          eval(code);
          setOutput(logs.join("\n") || "Code executed successfully (no output)");
        } catch (error) {
          setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          console.log = originalLog;
        }
      } else {
        // For Python, we'd need a backend - show placeholder
        setOutput(
          "✨ Python Execution\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
            "Python execution requires a server environment.\n\n" +
            "Options to run your code:\n" +
            "1. Copy code and run in your local Python environment\n" +
            "2. Use online interpreters like Replit or PythonAnywhere\n" +
            "3. Try the JavaScript version (runs instantly in browser)\n\n" +
            "💡 Tip: JavaScript is equivalent and executes immediately!\n" +
            "   Switch to JavaScript to see real-time results."
        );
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(defaultCode[language]);
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Code Playground</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Write, test, and experiment with algorithms
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language tabs */}
            <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
              {(["python", "javascript"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    language === lang
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-medium">Editor</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="h-[500px]">
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

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? "Running..." : "Run Code"}
              </Button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-medium">Output</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOutput("")}
                className="text-xs"
              >
                Clear
              </Button>
            </div>

            <div className="h-[500px] p-4 bg-slate-950 overflow-auto">
              <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                {output || "// Output will appear here after running the code"}
              </pre>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>
                  Language: <span className="capitalize font-medium">{language}</span>
                </span>
                <span>
                  Lines: <span className="font-medium">{code.split("\n").length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• JavaScript code runs directly in your browser</li>
            <li>• Use console.log() in JavaScript to see output</li>
            <li>• Python code can be copied and run in your local environment</li>
            <li>• Try modifying the algorithms to understand how they work</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

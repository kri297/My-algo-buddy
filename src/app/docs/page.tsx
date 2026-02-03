"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  Play,
  Settings,
  Trophy,
  Boxes,
  Terminal,
  Search,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({
    code,
    language,
    id,
  }: {
    code: string;
    language: string;
    id: string;
  }) => (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {language}
        </span>
        <button
          onClick={() => copyCode(code, id)}
          className="p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors"
        >
          {copiedCode === id ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );

  const sections: DocSection[] = [
    {
      id: "overview",
      title: "Overview",
      icon: BookOpen,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Welcome to AlgoBuddy</h2>
          <p>
            AlgoBuddy is a comprehensive platform for learning data structures
            and algorithms through interactive visualizations, hands-on coding
            practice, and gamified learning paths.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li>
              <strong>Interactive Visualizations</strong> - Watch algorithms
              execute step-by-step with animated visualizations
            </li>
            <li>
              <strong>Code Playground</strong> - Write and test your own
              algorithm implementations
            </li>
            <li>
              <strong>Data Structure Simulators</strong> - Interact with arrays,
              stacks, queues, linked lists, trees, and graphs
            </li>
            <li>
              <strong>Practice Challenges</strong> - Sharpen your skills with
              coding challenges and quizzes
            </li>
            <li>
              <strong>Progress Tracking</strong> - Track your learning journey
              with achievements and XP
            </li>
          </ul>

          <h3>Quick Start</h3>
          <ol>
            <li>
              Start with the{" "}
              <Link href="/learn" className="text-primary">
                Learning Paths
              </Link>{" "}
              to understand core concepts
            </li>
            <li>
              Use the{" "}
              <Link href="/visualize" className="text-primary">
                Visualizer
              </Link>{" "}
              to see algorithms in action
            </li>
            <li>
              Practice in the{" "}
              <Link href="/playground" className="text-primary">
                Playground
              </Link>{" "}
              to reinforce your understanding
            </li>
            <li>
              Take on{" "}
              <Link href="/practice" className="text-primary">
                Challenges
              </Link>{" "}
              to test your skills
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: "visualizer",
      title: "Algorithm Visualizer",
      icon: Play,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Using the Algorithm Visualizer</h2>
          <p>
            The visualizer is your window into understanding how algorithms
            work. Here&apos;s how to make the most of it:
          </p>

          <h3>Controls</h3>
          <ul>
            <li>
              <strong>Play/Pause</strong> - Start or pause the animation
            </li>
            <li>
              <strong>Step Forward/Back</strong> - Move through execution one
              step at a time
            </li>
            <li>
              <strong>Speed Control</strong> - Adjust animation speed from slow
              (0.5x) to instant (4x)
            </li>
            <li>
              <strong>Reset</strong> - Generate a new random array and start
              fresh
            </li>
          </ul>

          <h3>Available Algorithms</h3>
          <div className="grid md:grid-cols-2 gap-4 not-prose">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Sorting</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Bubble Sort - O(n²)</li>
                <li>• Selection Sort - O(n²)</li>
                <li>• Insertion Sort - O(n²)</li>
                <li>• Merge Sort - O(n log n)</li>
                <li>• Quick Sort - O(n log n)</li>
                <li>• Heap Sort - O(n log n)</li>
              </ul>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Searching</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Linear Search - O(n)</li>
                <li>• Binary Search - O(log n)</li>
                <li>• Jump Search - O(√n)</li>
              </ul>
            </div>
          </div>

          <h3>Code Panel</h3>
          <p>
            The code panel shows the algorithm implementation and highlights the
            current line being executed. You can switch between Python,
            JavaScript, Java, and C++.
          </p>
        </div>
      ),
    },
    {
      id: "playground",
      title: "Code Playground",
      icon: Code2,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Code Playground Guide</h2>
          <p>
            The playground is where you can write and test your own code. It
            supports both JavaScript and Python (with limitations).
          </p>

          <h3>JavaScript Execution</h3>
          <p>
            JavaScript code runs directly in your browser. Use{" "}
            <code>console.log()</code> to output results:
          </p>
          <CodeBlock
            id="js-example"
            language="javascript"
            code={`function bubbleSort(arr) {
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

console.log(bubbleSort([64, 34, 25, 12, 22]));`}
          />

          <h3>Python Support</h3>
          <p>
            Python code requires a backend server to execute. You can copy the
            code and run it locally or in an online interpreter like Replit or
            Google Colab.
          </p>
          <CodeBlock
            id="py-example"
            language="python"
            code={`def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22]))`}
          />

          <h3>Tips</h3>
          <ul>
            <li>Use the copy button to quickly copy your code</li>
            <li>
              Clear the output before running to see fresh results
            </li>
            <li>Check your browser console for any JavaScript errors</li>
          </ul>
        </div>
      ),
    },
    {
      id: "simulators",
      title: "Data Structure Simulators",
      icon: Boxes,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Data Structure Simulators</h2>
          <p>
            Our simulators let you interact with data structures visually.
            Perform operations and watch the changes in real-time.
          </p>

          <h3>Available Simulators</h3>
          <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
            {[
              { title: "Array", desc: "Insert, delete, search, sort" },
              { title: "Stack", desc: "LIFO - Push, pop, peek" },
              { title: "Queue", desc: "FIFO - Enqueue, dequeue" },
              { title: "Linked List", desc: "Insert, delete, traverse" },
              { title: "Binary Tree", desc: "BST operations, traversals" },
              { title: "Graph", desc: "BFS, DFS, shortest path" },
            ].map((sim) => (
              <div
                key={sim.title}
                className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <h4 className="font-semibold">{sim.title}</h4>
                <p className="text-sm text-muted-foreground">{sim.desc}</p>
              </div>
            ))}
          </div>

          <h3>Common Operations</h3>
          <p>Each simulator supports these common features:</p>
          <ul>
            <li>Add/remove elements with visual feedback</li>
            <li>View complexity information for each operation</li>
            <li>Reset to initial state</li>
            <li>Generate random data</li>
            <li>Undo/redo history</li>
          </ul>
        </div>
      ),
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts",
      icon: Terminal,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Keyboard Shortcuts</h2>
          <p>
            Use these shortcuts to navigate and control AlgoBuddy more
            efficiently.
          </p>

          <h3>Global Shortcuts</h3>
          <div className="not-prose">
            <div className="bg-card border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Shortcut</th>
                    <th className="text-left p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Ctrl + /", "Open command palette"],
                    ["Ctrl + K", "Quick search"],
                    ["Ctrl + S", "Save progress"],
                    ["Ctrl + ,", "Open settings"],
                    ["?", "Show keyboard shortcuts"],
                  ].map(([key, action]) => (
                    <tr key={key}>
                      <td className="p-3">
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                          {key}
                        </kbd>
                      </td>
                      <td className="p-3 text-muted-foreground">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3>Visualizer Shortcuts</h3>
          <div className="not-prose mt-4">
            <div className="bg-card border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Shortcut</th>
                    <th className="text-left p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Space", "Play/Pause animation"],
                    ["→ / L", "Step forward"],
                    ["← / H", "Step backward"],
                    ["R", "Reset/Generate new array"],
                    ["1-4", "Set speed (slow to instant)"],
                  ].map(([key, action]) => (
                    <tr key={key}>
                      <td className="p-3">
                        <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                          {key}
                        </kbd>
                      </td>
                      <td className="p-3 text-muted-foreground">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "settings",
      title: "Settings & Preferences",
      icon: Settings,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Customizing Your Experience</h2>
          <p>
            AlgoBuddy offers various settings to personalize your learning
            experience.
          </p>

          <h3>Appearance</h3>
          <ul>
            <li>
              <strong>Theme</strong> - Choose between Light, Dark, or System
              theme
            </li>
            <li>
              <strong>Font Size</strong> - Adjust code editor font size
              (12-20px)
            </li>
          </ul>

          <h3>Code Editor</h3>
          <ul>
            <li>
              <strong>Default Language</strong> - Set your preferred programming
              language
            </li>
            <li>
              <strong>Code Highlighting</strong> - Toggle current line
              highlighting
            </li>
            <li>
              <strong>Variable Panel</strong> - Show/hide variable values during
              execution
            </li>
          </ul>

          <h3>Animation</h3>
          <ul>
            <li>
              <strong>Default Speed</strong> - Set the default animation speed
            </li>
            <li>
              <strong>Sound Effects</strong> - Enable/disable audio feedback
            </li>
          </ul>

          <h3>Accessibility</h3>
          <ul>
            <li>
              <strong>Reduced Motion</strong> - Minimize animations for
              accessibility
            </li>
            <li>
              <strong>High Contrast</strong> - Enhanced contrast for better
              visibility
            </li>
          </ul>

          <p>
            Access settings from the{" "}
            <Link href="/settings" className="text-primary">
              Settings page
            </Link>{" "}
            or press <kbd className="px-2 py-0.5 bg-muted rounded text-sm">Ctrl + ,</kbd>
          </p>
        </div>
      ),
    },
    {
      id: "achievements",
      title: "Achievements & Progress",
      icon: Trophy,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          <h2>Tracking Your Progress</h2>
          <p>
            AlgoBuddy gamifies your learning journey with XP, achievements, and
            streaks to keep you motivated.
          </p>

          <h3>Experience Points (XP)</h3>
          <ul>
            <li>Earn XP by completing lessons, challenges, and exercises</li>
            <li>Gain bonus XP for maintaining learning streaks</li>
            <li>Level up as you accumulate XP</li>
          </ul>

          <h3>Achievement Categories</h3>
          <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-semibold mb-2">📚 Learning</h4>
              <p className="text-sm text-muted-foreground">
                Complete lessons and modules
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-semibold mb-2">💻 Practice</h4>
              <p className="text-sm text-muted-foreground">
                Solve challenges and exercises
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-semibold mb-2">🔥 Streak</h4>
              <p className="text-sm text-muted-foreground">
                Maintain daily learning streaks
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-semibold mb-2">🏆 Mastery</h4>
              <p className="text-sm text-muted-foreground">
                Master specific topics completely
              </p>
            </div>
          </div>

          <h3>Leaderboards</h3>
          <p>
            Compare your progress with other learners on global and weekly
            leaderboards. Climb the ranks by earning more XP!
          </p>
        </div>
      ),
    },
  ];

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <h1 className="text-xl font-bold mb-4">Documentation</h1>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-medium mb-2">Need help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Can&apos;t find what you need?
                </p>
                <Link href="/contact">
                  <Button size="sm" variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-xl p-8"
            >
              {currentSection?.content}
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {sections.findIndex((s) => s.id === activeSection) > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const idx = sections.findIndex(
                      (s) => s.id === activeSection
                    );
                    setActiveSection(sections[idx - 1].id);
                  }}
                >
                  ← Previous
                </Button>
              )}
              <div className="flex-1" />
              {sections.findIndex((s) => s.id === activeSection) <
                sections.length - 1 && (
                <Button
                  onClick={() => {
                    const idx = sections.findIndex(
                      (s) => s.id === activeSection
                    );
                    setActiveSection(sections[idx + 1].id);
                  }}
                >
                  Next →
                </Button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

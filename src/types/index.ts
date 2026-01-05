// ============================================
// CORE TYPES FOR ALGO BUDDY
// ============================================

// Animation & Visualization Types
export type AnimationSpeed = "slow" | "normal" | "fast" | "instant";

export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: AnimationSpeed;
  history: VisualizationStep[];
}

export interface VisualizationStep {
  id: string;
  timestamp: number;
  description: string;
  highlightedElements: string[];
  highlightedCodeLines: number[];
  variables: Record<string, unknown>;
  action: string;
}

// Data Structure Types
export interface ArrayElement {
  id: string;
  value: number;
  index: number;
  isHighlighted: boolean;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  color?: string;
}

export interface LinkedListNode {
  id: string;
  value: number;
  next: string | null;
  prev?: string | null; // For doubly linked list
  isHighlighted: boolean;
  isHead: boolean;
  isTail: boolean;
  x?: number;
  y?: number;
}

export interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  parent: string | null;
  isHighlighted: boolean;
  isVisited: boolean;
  depth: number;
  x?: number;
  y?: number;
}

export interface GraphNode {
  id: string;
  value: string | number;
  x: number;
  y: number;
  isHighlighted: boolean;
  isVisited: boolean;
  isStart: boolean;
  isEnd: boolean;
  distance?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  isHighlighted: boolean;
  isDirected: boolean;
}

export interface HeapNode {
  id: string;
  value: number;
  index: number;
  parentIndex: number | null;
  leftChildIndex: number | null;
  rightChildIndex: number | null;
  isHighlighted: boolean;
  x?: number;
  y?: number;
}

export interface TrieNode {
  id: string;
  char: string;
  children: Record<string, string>;
  isEndOfWord: boolean;
  isHighlighted: boolean;
  x?: number;
  y?: number;
}

export interface StackFrame {
  id: string;
  value: unknown;
  isTop: boolean;
  isHighlighted: boolean;
}

export interface QueueElement {
  id: string;
  value: unknown;
  isFront: boolean;
  isRear: boolean;
  isHighlighted: boolean;
}

// Code Editor Types
export type ProgrammingLanguage = "python" | "javascript" | "java" | "cpp";

export interface CodeSnippet {
  language: ProgrammingLanguage;
  code: string;
  highlightedLines: number[];
}

export interface CodeImplementation {
  id: string;
  name: string;
  description: string;
  snippets: Record<ProgrammingLanguage, string>;
  timeComplexity: string;
  spaceComplexity: string;
  isIterative: boolean;
}

// Algorithm Types
export type AlgorithmCategory =
  | "sorting"
  | "searching"
  | "graph"
  | "tree"
  | "dynamic-programming"
  | "backtracking"
  | "greedy"
  | "divide-conquer";

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  implementations: CodeImplementation[];
  steps: string[];
  useCases: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Learning & Progress Types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // in minutes
  prerequisites: string[];
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  visualizationType: string;
  exercises: Exercise[];
  isCompleted: boolean;
}

export interface Exercise {
  id: string;
  type: "quiz" | "coding" | "visualization" | "debug";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export interface UserProgress {
  userId: string;
  completedModules: string[];
  completedTopics: string[];
  completedExercises: string[];
  totalPoints: number;
  achievements: Achievement[];
  streak: number;
  lastActivity: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: "learning" | "practice" | "streak" | "mastery";
}

// Complexity Analysis Types
export interface ComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  operationCount: number;
  comparisons: number;
  swaps: number;
  memoryUsage: number;
}

// Theme & Settings Types
export type Theme = "light" | "dark" | "system";

export interface UserSettings {
  theme: Theme;
  defaultLanguage: ProgrammingLanguage;
  animationSpeed: AnimationSpeed;
  showCodeHighlighting: boolean;
  showVariablePanel: boolean;
  enableSound: boolean;
  enableVoiceNarration: boolean;
  fontSize: number;
}

// Collaboration Types
export interface SharedVisualization {
  id: string;
  authorId: string;
  title: string;
  description: string;
  type: string;
  data: unknown;
  createdAt: Date;
  likes: number;
  views: number;
}

// Interview Prep Types
export interface InterviewQuestion {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  solution: CodeImplementation;
  relatedQuestions: string[];
  companies: string[];
}

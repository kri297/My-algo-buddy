import type { LearningModule, Topic, Exercise } from "@/types";

export const learningModules: LearningModule[] = [
  {
    id: "intro-dsa",
    title: "Introduction to Data Structures",
    description: "Learn the fundamentals of data structures and why they matter",
    difficulty: "beginner",
    category: "fundamentals",
    estimatedTime: 30,
    isCompleted: false,
    progress: 0,
    prerequisites: [],
    topics: [
      {
        id: "what-is-dsa",
        title: "What are Data Structures?",
        content: `Data structures are specialized formats for organizing, processing, retrieving, and storing data. They are essential for efficient algorithm design and are the building blocks of software development.

## Why Learn Data Structures?

1. **Efficiency**: Proper data structure choice can dramatically improve performance
2. **Problem Solving**: Many problems have elegant solutions with the right structure
3. **Interviews**: Essential for technical interviews at top companies
4. **Foundation**: Core knowledge for understanding complex systems

## Types of Data Structures

- **Linear**: Arrays, Linked Lists, Stacks, Queues
- **Non-Linear**: Trees, Graphs
- **Hash-Based**: Hash Tables, Hash Maps
- **Specialized**: Heaps, Tries, Union-Find`,
        visualizationType: "overview",
        isCompleted: false,
        exercises: [
          {
            id: "ex-dsa-1",
            type: "quiz",
            question: "Which data structure uses LIFO (Last In, First Out) principle?",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correctAnswer: 1,
            explanation: "A Stack uses LIFO - the last element added is the first one to be removed.",
            points: 10,
          },
        ],
      },
      {
        id: "big-o-notation",
        title: "Big O Notation",
        content: `Big O notation describes the performance or complexity of an algorithm in terms of input size.

## Common Time Complexities

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array access by index |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Recursive Fibonacci |

## How to Analyze Complexity

1. Count the basic operations
2. Focus on the dominant term
3. Drop constants and lower-order terms
4. Consider best, average, and worst cases`,
        visualizationType: "complexity-chart",
        isCompleted: false,
        exercises: [
          {
            id: "ex-bigo-1",
            type: "quiz",
            question: "What is the time complexity of accessing an element in an array by index?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Array access by index is O(1) because it's a direct memory lookup.",
            points: 10,
          },
          {
            id: "ex-bigo-2",
            type: "quiz",
            question: "Which time complexity is better: O(n) or O(n log n)?",
            options: ["O(n)", "O(n log n)", "They are equal", "Depends on the input"],
            correctAnswer: 0,
            explanation: "O(n) grows slower than O(n log n), making it more efficient.",
            points: 10,
          },
        ],
      },
    ],
  },
  {
    id: "arrays-module",
    title: "Arrays & Dynamic Arrays",
    description: "Master arrays - the fundamental data structure",
    difficulty: "beginner",
    category: "data-structures",
    estimatedTime: 45,
    isCompleted: false,
    progress: 0,
    prerequisites: ["intro-dsa"],
    topics: [
      {
        id: "static-arrays",
        title: "Static Arrays",
        content: `An array is a contiguous block of memory storing elements of the same type.

## Key Characteristics

- **Fixed Size**: Size determined at creation
- **Random Access**: O(1) access by index
- **Contiguous Memory**: Elements stored sequentially

## Operations Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Access | O(1) |
| Search | O(n) |
| Insert at end | O(1)* |
| Insert at middle | O(n) |
| Delete | O(n) |

*Assuming space is available`,
        visualizationType: "array",
        isCompleted: false,
        exercises: [
          {
            id: "ex-arr-1",
            type: "visualization",
            question: "Insert the value 42 at index 2 in the array [1, 2, 3, 4, 5]",
            correctAnswer: "[1, 2, 42, 3, 4, 5]",
            explanation: "Elements at index 2 and beyond shift right to make room.",
            points: 15,
          },
        ],
      },
      {
        id: "dynamic-arrays",
        title: "Dynamic Arrays",
        content: `Dynamic arrays automatically resize when they run out of space.

## How They Work

1. Start with initial capacity
2. When full, create new array (usually 2x size)
3. Copy elements to new array
4. Delete old array

## Amortized Analysis

While individual resize operations are O(n), the amortized cost of insertion is O(1).

## Implementation in Languages

- **Python**: list
- **JavaScript**: Array
- **Java**: ArrayList
- **C++**: vector`,
        visualizationType: "dynamic-array",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "array-operations",
        title: "Array Operations & Techniques",
        content: `Master common array operations and problem-solving patterns.

## Common Patterns

1. **Two Pointers**: For sorted arrays, finding pairs
2. **Sliding Window**: Contiguous subarrays
3. **Prefix Sum**: Fast range queries
4. **Kadane's Algorithm**: Maximum subarray
5. **Dutch National Flag**: 3-way partitioning

## Rotation Techniques

- Reversal algorithm: O(n) time, O(1) space
- Using temp array: O(n) time, O(n) space

## Key Problems

- Two Sum, Three Sum
- Container with most water
- Trapping rainwater`,
        visualizationType: "array",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "2d-arrays",
        title: "2D Arrays & Matrices",
        content: `Working with multidimensional arrays and matrix operations.

## Memory Layout

- **Row-Major**: Most languages (C, Java, Python)
- **Column-Major**: Fortran, MATLAB

## Common Operations

- Matrix traversal (row, column, diagonal, spiral)
- Matrix rotation (90°, 180°, 270°)
- Matrix transpose
- Searching in sorted matrix

## Space Optimization

- Use 1D array: index = row * cols + col
- Sparse matrices: Store only non-zero values`,
        visualizationType: "array",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "array-sorting",
        title: "Sorting Algorithms",
        content: `Understanding fundamental sorting algorithms.

## Simple Sorts O(n²)

- **Bubble Sort**: Repeatedly swap adjacent elements
- **Selection Sort**: Find minimum, place at start
- **Insertion Sort**: Build sorted array one element at a time

## Efficient Sorts O(n log n)

- **Merge Sort**: Divide and conquer, stable
- **Quick Sort**: Partition around pivot, in-place
- **Heap Sort**: Using heap data structure

## Special Cases

- **Counting Sort**: O(n+k) for limited range
- **Radix Sort**: O(d*n) for d-digit numbers`,
        visualizationType: "array",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "array-searching",
        title: "Searching Algorithms",
        content: `Techniques for finding elements efficiently.

## Linear Search

- O(n) time complexity
- Works on any array
- No preprocessing needed

## Binary Search

- O(log n) time complexity
- Requires sorted array
- Divide and conquer approach

## Variations

- First/Last occurrence
- Search in rotated array
- Search in 2D matrix
- Peak element finding

## Problem Patterns

- Finding boundaries
- Minimizing/maximizing with condition
- Finding missing element`,
        visualizationType: "array",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
  {
    id: "linked-lists-module",
    title: "Linked Lists",
    description: "Understand linked lists and their variations",
    difficulty: "beginner",
    category: "data-structures",
    estimatedTime: 60,
    isCompleted: false,
    progress: 0,
    prerequisites: ["arrays-module"],
    topics: [
      {
        id: "singly-linked-list",
        title: "Singly Linked Lists",
        content: `A linked list is a sequence of nodes where each node contains data and a reference to the next node.

## Structure

\`\`\`
[Data|Next] -> [Data|Next] -> [Data|Next] -> NULL
\`\`\`

## Advantages over Arrays

- Dynamic size
- Efficient insertions/deletions at beginning
- No wasted memory from unused capacity

## Disadvantages

- No random access (must traverse)
- Extra memory for pointers
- Not cache-friendly

## Operations

| Operation | Time |
|-----------|------|
| Insert at head | O(1) |
| Insert at tail | O(n) or O(1) with tail pointer |
| Delete head | O(1) |
| Search | O(n) |
| Access by index | O(n) |`,
        visualizationType: "linked-list",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "doubly-linked-list",
        title: "Doubly Linked Lists",
        content: `Each node has pointers to both next and previous nodes.

## Structure

\`\`\`
NULL <- [Prev|Data|Next] <-> [Prev|Data|Next] -> NULL
\`\`\`

## Advantages

- Bidirectional traversal
- O(1) deletion if node reference available
- Easier implementation of some algorithms

## Disadvantages

- Extra memory for prev pointer
- More complex to maintain

## Applications

- Browser forward/back navigation
- Undo/Redo functionality
- LRU Cache implementation`,
        visualizationType: "linked-list",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "linked-list-operations",
        title: "Linked List Operations",
        content: `Master key linked list operations and patterns.

## Basic Operations

1. **Insertion**: Beginning, end, middle
2. **Deletion**: By value, by position
3. **Search**: Linear traversal
4. **Reversal**: Iterative and recursive

## Common Patterns

- **Fast-Slow Pointers**: Find middle, detect cycle
- **Two Pointers**: Find kth from end
- **Dummy Head**: Simplify edge cases
- **Recursion**: Natural for linked lists

## Edge Cases to Handle

- Empty list
- Single node
- Operating on head/tail`,
        visualizationType: "linked-list",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "cycle-detection",
        title: "Cycle Detection & Problems",
        content: `Advanced linked list problem-solving techniques.

## Floyd's Cycle Detection (Tortoise and Hare)

\`\`\`
slow = head
fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        return True  # Cycle found
\`\`\`

## Finding Cycle Start

After detecting cycle, reset one pointer to head and move both one step at a time until they meet.

## Key Problems

- Find middle of linked list
- Detect and remove cycle
- Check if palindrome
- Merge two sorted lists
- Reverse in groups`,
        visualizationType: "linked-list",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "linked-list-reversal",
        title: "Reversal Techniques",
        content: `Different approaches to reverse linked lists.

## Iterative Reversal O(1) space

\`\`\`python
prev = None
curr = head
while curr:
    next_temp = curr.next
    curr.next = prev
    prev = curr
    curr = next_temp
return prev
\`\`\`

## Recursive Reversal O(n) space

Uses call stack for recursion.

## Partial Reversal

- Reverse first k nodes
- Reverse between positions m and n
- Reverse in k-groups
- Reverse alternate k nodes

## Applications

- Palindrome check
- Add two numbers represented as lists
- Reorder list`,
        visualizationType: "linked-list",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "advanced-linked-lists",
        title: "Advanced Concepts",
        content: `Specialized linked list variations and applications.

## Circular Linked Lists

Last node points back to head, forming a circle.

**Applications**: Round-robin scheduling, circular buffers

## Skip List

Linked list with multiple levels for faster search O(log n).

## XOR Linked List

Memory-efficient doubly linked list using XOR of addresses.

## Multi-level Linked Lists

Nodes with child pointers creating 2D structure.

## Real-World Uses

- Music playlist (circular)
- LRU Cache (doubly linked list + hash map)
- Undo functionality
- File system management`,
        visualizationType: "linked-list",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
  {
    id: "linked-list-module",
    title: "Linked Lists",
    description: "Understanding nodes, pointers, and dynamic structures",
    difficulty: "beginner",
    category: "data-structures",
    estimatedTime: 40,
    isCompleted: false,
    progress: 0,
    prerequisites: ["arrays-module"],
    topics: [
      {
        id: "linked-list-intro",
        title: "Introduction to Linked Lists",
        content: `A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a reference (link) to the next node.

## Operations Complexity

Time complexities for common operations:
- Access: O(n)
- Search: O(n)
- Insert at head: O(1)
- Insert at tail: O(n) or O(1) with tail pointer
- Delete: O(n)`,
        visualizationType: "linked-list",
        isCompleted: false,
        exercises: [
          {
            id: "ex-ll-1",
            type: "quiz",
            question: "What is the time complexity to insert at the head of a singly linked list?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            correctAnswer: 2,
            explanation: "Inserting at head only requires updating the head pointer and new node's next pointer - O(1).",
            points: 10,
          },
        ],
      },
      {
        id: "doubly-linked-list",
        title: "Doubly Linked Lists",
        content: `Each node has pointers to both next and previous nodes.

## Structure

\`\`\`
NULL <- [Prev|Data|Next] <-> [Prev|Data|Next] <-> [Prev|Data|Next] -> NULL
\`\`\`

## Advantages

- Traversal in both directions
- O(1) deletion if we have the node reference
- Easier insertion before a node

## Use Cases

- Browser history (back/forward)
- Undo/Redo functionality
- LRU Cache implementation`,
        visualizationType: "doubly-linked-list",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
  {
    id: "stacks-queues-module",
    title: "Stacks & Queues",
    description: "Learn LIFO and FIFO data structures",
    difficulty: "beginner",
    category: "data-structures",
    estimatedTime: 45,
    isCompleted: false,
    progress: 0,
    prerequisites: ["linked-lists-module"],
    topics: [
      {
        id: "stack-basics",
        title: "Stack Fundamentals",
        content: `A stack is a Last-In-First-Out (LIFO) data structure.

## Core Operations

- **Push**: Add element to top - O(1)
- **Pop**: Remove and return top element - O(1)
- **Peek/Top**: View top element without removing - O(1)
- **isEmpty**: Check if stack is empty - O(1)

## Implementation

Can be implemented using:
1. Array/Dynamic Array
2. Linked List

## Real-World Examples

- Function call stack
- Undo mechanism in editors
- Browser back button
- Expression evaluation
- Backtracking algorithms

## Common Problems

- Valid parentheses
- Next greater element
- Min/Max stack
- Evaluate postfix`,
        visualizationType: "stack",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "stack-applications",
        title: "Stack Applications",
        content: `Practical uses and problems solved with stacks.

## Expression Evaluation

- **Infix to Postfix**: Convert (A+B) to AB+
- **Postfix Evaluation**: Evaluate AB+C*
- **Prefix Evaluation**: Evaluate +AB*C

## Parentheses Problems

- Check balanced parentheses
- Remove invalid parentheses
- Longest valid parentheses substring

## Monotonic Stack

Stack maintaining increasing/decreasing order.

**Problems**:
- Next greater element
- Trapping rainwater
- Largest rectangle in histogram
- Stock span problem`,
        visualizationType: "stack",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "queue-basics",
        title: "Queue Fundamentals",
        content: `A queue is a First-In-First-Out (FIFO) data structure.

## Core Operations

- **Enqueue**: Add element to rear - O(1)
- **Dequeue**: Remove element from front - O(1)
- **Front**: View front element - O(1)
- **isEmpty**: Check if empty - O(1)

## Implementation Types

1. **Array-based**: Simple but wasteful
2. **Circular Queue**: Efficient array usage
3. **Linked List**: Dynamic size

## Real-World Examples

- Print spooler
- Task scheduling
- BFS traversal
- Message queues
- Customer service lines`,
        visualizationType: "queue",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "queue-variations",
        title: "Queue Variations",
        content: `Different types of queues for specific needs.

## Circular Queue

Efficiently reuses array space by wrapping around.

\`\`\`
front = (front + 1) % capacity
rear = (rear + 1) % capacity
\`\`\`

## Deque (Double-Ended Queue)

Operations at both ends in O(1).

**Applications**: Sliding window maximum

## Priority Queue

Elements ordered by priority, not insertion order.

**Implementation**: Heap
**Applications**: Dijkstra's, task scheduling

## Blocking Queue

Thread-safe queue for producer-consumer pattern.`,
        visualizationType: "queue",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "stack-queue-problems",
        title: "Advanced Problems",
        content: `Complex problems using stacks and queues.

## Stack Problems

- Implement queue using stacks
- Design browser history
- Decode string
- Asteroid collision
- Basic calculator

## Queue Problems

- Implement stack using queues
- Design hit counter
- Recent counter
- Time needed to buy tickets
- Number of students unable to eat

## Combined Techniques

- Sliding window maximum (deque)
- First unique character in stream
- Level order traversal variations`,
        visualizationType: "stack",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "recursion-stack",
        title: "Recursion & Call Stack",
        content: `Understanding the relationship between recursion and stacks.

## Call Stack

Every function call:
1. Pushes frame onto call stack
2. Contains local variables and return address
3. Pops when function returns

## Stack Overflow

Occurs when:
- Too many recursive calls
- No base case
- Insufficient stack memory

## Converting Recursion to Iteration

Use explicit stack to simulate recursion.

**Benefits**:
- Avoid stack overflow
- Better performance
- More control

## Tail Recursion

Recursion where recursive call is last operation.
Can be optimized to iteration by compiler.`,
        visualizationType: "stack",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
  {
    id: "stacks-queues-module",
    title: "Stacks & Queues",
    description: "Learn LIFO and FIFO data structures",
    difficulty: "beginner",
    category: "data-structures",
    estimatedTime: 50,
    isCompleted: false,
    progress: 0,
    prerequisites: ["arrays-module"],
    topics: [
      {
        id: "stacks",
        title: "Stacks (LIFO)",
        content: `A stack is a Last-In-First-Out (LIFO) data structure.

## Operations

- **Push**: Add element to top - O(1)
- **Pop**: Remove element from top - O(1)
- **Peek/Top**: View top element - O(1)
- **isEmpty**: Check if empty - O(1)

## Applications

- Function call stack
- Expression evaluation
- Undo mechanisms
- Backtracking algorithms
- Balanced parentheses checking`,
        visualizationType: "stack",
        isCompleted: false,
        exercises: [
          {
            id: "ex-stack-1",
            type: "visualization",
            question: "Push 1, 2, 3 then pop twice. What's on top?",
            correctAnswer: "1",
            explanation: "After pushing 1, 2, 3 the stack is [1, 2, 3]. Popping twice removes 3 and 2, leaving 1 on top.",
            points: 15,
          },
        ],
      },
      {
        id: "queues",
        title: "Queues (FIFO)",
        content: `A queue is a First-In-First-Out (FIFO) data structure.

## Operations

- **Enqueue**: Add element to rear - O(1)
- **Dequeue**: Remove element from front - O(1)
- **Front**: View front element - O(1)
- **isEmpty**: Check if empty - O(1)

## Applications

- Task scheduling
- Print spooling
- BFS traversal
- Message queues
- Buffer for streaming data

## Variations

- **Circular Queue**: Efficient array-based implementation
- **Priority Queue**: Elements ordered by priority
- **Deque**: Double-ended queue`,
        visualizationType: "queue",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
  {
    id: "trees-module",
    title: "Trees & Binary Trees",
    description: "Master hierarchical data structures",
    difficulty: "intermediate",
    category: "data-structures",
    estimatedTime: 90,
    isCompleted: false,
    progress: 0,
    prerequisites: ["stacks-queues-module"],
    topics: [
      {
        id: "binary-trees",
        title: "Binary Trees",
        content: `A binary tree is a hierarchical structure where each node has at most two children.

## Terminology

- **Root**: Top node with no parent
- **Leaf**: Node with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to node
- **Subtree**: Tree formed by a node and descendants

## Tree Traversals

1. **Inorder** (Left, Root, Right): Gives sorted order for BST
2. **Preorder** (Root, Left, Right): Used for copying trees
3. **Postorder** (Left, Right, Root): Used for deletion
4. **Level Order**: BFS traversal`,
        visualizationType: "binary-tree",
        isCompleted: false,
        exercises: [
          {
            id: "ex-tree-1",
            type: "quiz",
            question: "In a complete binary tree with 7 nodes, what is the height?",
            options: ["1", "2", "3", "4"],
            correctAnswer: 1,
            explanation: "A complete binary tree with 7 nodes has height 2 (levels 0, 1, 2).",
            points: 10,
          },
        ],
      },
      {
        id: "bst",
        title: "Binary Search Trees",
        content: `A BST maintains the property: left subtree values < root < right subtree values.

## Operations

| Operation | Average | Worst |
|-----------|---------|-------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |

## Why Worst Case is O(n)?

When the tree becomes skewed (essentially a linked list), operations become linear.

## Balanced BSTs

- AVL Trees
- Red-Black Trees
- B-Trees`,
        visualizationType: "bst",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
  {
    id: "sorting-module",
    title: "Sorting Algorithms",
    description: "Learn and compare different sorting techniques",
    difficulty: "intermediate",
    category: "algorithms",
    estimatedTime: 120,
    isCompleted: false,
    progress: 0,
    prerequisites: ["arrays-module"],
    topics: [
      {
        id: "comparison-sorts",
        title: "Comparison-Based Sorting",
        content: `These algorithms sort by comparing elements.

## Simple Sorts (O(n²))

- **Bubble Sort**: Repeatedly swap adjacent elements
- **Selection Sort**: Find min and place at beginning
- **Insertion Sort**: Build sorted array one element at a time

## Efficient Sorts (O(n log n))

- **Merge Sort**: Divide, sort, merge
- **Quick Sort**: Partition around pivot
- **Heap Sort**: Use heap data structure

## Comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |`,
        visualizationType: "sorting",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
  {
    id: "graphs-module",
    title: "Graphs",
    description: "Explore graph representations and algorithms",
    difficulty: "advanced",
    category: "data-structures",
    estimatedTime: 150,
    isCompleted: false,
    progress: 0,
    prerequisites: ["trees-module"],
    topics: [
      {
        id: "graph-basics",
        title: "Graph Fundamentals",
        content: `A graph G = (V, E) consists of vertices V and edges E connecting them.

## Types of Graphs

- **Directed vs Undirected**: Edges have direction or not
- **Weighted vs Unweighted**: Edges have values or not
- **Cyclic vs Acyclic**: Contains cycles or not
- **Connected vs Disconnected**: All vertices reachable or not

## Representations

### Adjacency Matrix
- Space: O(V²)
- Edge lookup: O(1)
- Good for dense graphs

### Adjacency List
- Space: O(V + E)
- Edge lookup: O(degree)
- Good for sparse graphs`,
        visualizationType: "graph",
        isCompleted: false,
        exercises: [],
      },
      {
        id: "graph-traversals",
        title: "BFS and DFS",
        content: `Two fundamental graph traversal algorithms.

## Breadth-First Search (BFS)

- Uses a queue
- Explores level by level
- Finds shortest path in unweighted graphs
- Time: O(V + E)

## Depth-First Search (DFS)

- Uses a stack (or recursion)
- Explores as deep as possible first
- Used for topological sort, cycle detection
- Time: O(V + E)

## Applications

- BFS: Shortest path, level-order traversal, web crawling
- DFS: Topological sort, cycle detection, maze solving`,
        visualizationType: "graph-traversal",
        isCompleted: false,
        exercises: [],
      },
    ],
  },
];

export const achievements = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first topic",
    icon: "🎯",
    category: "learning" as const,
  },
  {
    id: "array-master",
    title: "Array Master",
    description: "Complete all array topics",
    icon: "📊",
    category: "mastery" as const,
  },
  {
    id: "tree-climber",
    title: "Tree Climber",
    description: "Complete all tree topics",
    icon: "🌳",
    category: "mastery" as const,
  },
  {
    id: "graph-explorer",
    title: "Graph Explorer",
    description: "Complete all graph topics",
    icon: "🕸️",
    category: "mastery" as const,
  },
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    category: "streak" as const,
  },
  {
    id: "quiz-ace",
    title: "Quiz Ace",
    description: "Score 100% on 10 quizzes",
    icon: "🏆",
    category: "practice" as const,
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Complete a module in under 30 minutes",
    icon: "⚡",
    category: "practice" as const,
  },
];

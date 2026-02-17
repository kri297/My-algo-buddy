'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Zap,
  Code,
  Lightbulb,
  AlertCircle,
  Play,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
  Target,
  Trophy,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressSync } from '@/hooks/useProgressSync';

// ============================================
// LANGUAGE SUPPORT
// ============================================
type CodeLanguage = 'c' | 'javascript' | 'python' | 'java' | 'cpp';

const languageConfig: Record<CodeLanguage, { label: string; color: string; icon: string }> = {
  c: { label: 'C', color: 'bg-gray-500', icon: 'C' },
  javascript: { label: 'JavaScript', color: 'bg-yellow-500', icon: 'JS' },
  python: { label: 'Python', color: 'bg-blue-500', icon: 'PY' },
  java: { label: 'Java', color: 'bg-orange-500', icon: 'JV' },
  cpp: { label: 'C++', color: 'bg-purple-500', icon: 'C++' },
};

interface MultiLangCode {
  c: string;
  javascript: string;
  python: string;
  java: string;
  cpp: string;
}

interface LessonSection {
  type: 'text' | 'code' | 'tip' | 'warning' | 'example' | 'video';
  title?: string;
  content: string | MultiLangCode;
  language?: 'multi' | string;
  videoId?: string; // YouTube video ID
}

interface LessonContent {
  id: string;
  title: string;
  topic: string;
  category: string; // Main category like 'arrays', 'stacks', 'trees'
  duration: string;
  xp: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  objectives: string[];
  videoUrl?: string; // Main lesson video
  sections: LessonSection[];
  nextLesson?: string;
  prevLesson?: string;
}

const lessonsData: Record<string, LessonContent> = {
  'arrays-intro': {
    id: 'arrays-intro',
    title: 'Introduction to Arrays',
    topic: 'Arrays & Strings',
    category: 'arrays',
    duration: '10 min',
    xp: 50,
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/QJNwK2uJyGs',
    objectives: [
      'Understand what arrays are and why they matter',
      'Learn how arrays store data in memory',
      'Master basic array operations',
      'Know time complexity of operations'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Arrays Explained',
        content: 'Watch this video for a visual explanation of arrays and how they work in memory.',
        videoId: 'QJNwK2uJyGs'
      },
      {
        type: 'text',
        title: 'What is an Array?',
        content: `An **array** is a fundamental data structure that stores elements of the same type in contiguous memory locations. Think of it like a row of boxes, where each box holds one item and has an index starting from 0.

Arrays are powerful because they provide:
• **O(1) access** - Get any element instantly by index
• **Efficient memory** - Elements stored together in memory
• **Simple to use** - Built into every programming language`
      },
      {
        type: 'code',
        title: 'Creating Arrays',
        language: 'multi',
        content: {
          c: `// Creating arrays in C
#include <stdio.h>

int main() {
    // Static array declaration
    int numbers[] = {1, 2, 3, 4, 5};
    char fruits[][10] = {"apple", "banana", "orange"};
    
    // Create array with size
    int zeros[5] = {0}; // All elements initialized to 0
    
    // Access by index (0-based)
    printf("%d\\n", numbers[0]); // 1
    printf("%d\\n", numbers[2]); // 3
    
    // Get length
    int length = sizeof(numbers) / sizeof(numbers[0]);
    printf("%d\\n", length); // 5
    
    return 0;
}`,
          javascript: `// Creating arrays in JavaScript
const numbers = [1, 2, 3, 4, 5];
const fruits = ['apple', 'banana', 'orange'];

// Create array with size
const zeros = new Array(5).fill(0);
// [0, 0, 0, 0, 0]

// Access by index (0-based)
console.log(numbers[0]); // 1
console.log(numbers[2]); // 3

// Get length
console.log(numbers.length); // 5`,
          python: `# Creating arrays (lists) in Python
numbers = [1, 2, 3, 4, 5]
fruits = ['apple', 'banana', 'orange']

# Create array with size
zeros = [0] * 5
# [0, 0, 0, 0, 0]

# Access by index (0-based)
print(numbers[0])  # 1
print(numbers[2])  # 3

# Get length
print(len(numbers))  # 5`,
          java: `// Creating arrays in Java
int[] numbers = {1, 2, 3, 4, 5};
String[] fruits = {"apple", "banana", "orange"};

// Create array with size
int[] zeros = new int[5];
Arrays.fill(zeros, 0);
// [0, 0, 0, 0, 0]

// Access by index (0-based)
System.out.println(numbers[0]); // 1
System.out.println(numbers[2]); // 3

// Get length
System.out.println(numbers.length); // 5`,
          cpp: `// Creating arrays in C++
#include <vector>
using namespace std;

int numbers[] = {1, 2, 3, 4, 5};
string fruits[] = {"apple", "banana", "orange"};

// Using vector (dynamic array)
vector<int> zeros(5, 0);
// [0, 0, 0, 0, 0]

// Access by index (0-based)
cout << numbers[0] << endl; // 1
cout << numbers[2] << endl; // 3

// Get length
cout << zeros.size() << endl; // 5`
        }
      },
      {
        type: 'tip',
        title: 'Pro Tip',
        content: 'In JavaScript, arrays are dynamic - they can grow and shrink. In languages like Java and C++, traditional arrays have fixed sizes, so use ArrayList or vector for dynamic sizing.'
      },
      {
        type: 'text',
        title: 'Memory Layout',
        content: `Arrays store elements in **contiguous memory**. This means all elements sit next to each other in RAM.

**Why does this matter?**

The computer can calculate any element's location instantly:
\`address = base_address + (index × element_size)\`

This is why **accessing by index is O(1)** - no searching needed!`
      },
      {
        type: 'code',
        title: 'Common Operations',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <string.h>

int main() {
    int arr[10] = {10, 20, 30, 40, 50};
    int size = 5;
    int capacity = 10;
    
    // TRAVERSAL - O(n)
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    
    // ADD to end (if space available) - O(1)
    if (size < capacity) {
        arr[size++] = 60;
    }
    
    // SEARCH - O(n)
    int target = 30;
    int idx = -1;
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            idx = i;
            break;
        }
    }
    
    // UPDATE - O(1)
    arr[2] = 35;
    
    return 0;
}`,
          javascript: `const arr = [10, 20, 30, 40, 50];

// TRAVERSAL - O(n)
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// ADD elements
arr.push(60);      // End - O(1)
arr.unshift(5);    // Start - O(n)

// REMOVE elements
arr.pop();         // End - O(1)
arr.shift();       // Start - O(n)

// SEARCH
const idx = arr.indexOf(30);  // O(n)
const has = arr.includes(20); // O(n)

// UPDATE - O(1)
arr[2] = 35;`,
          python: `arr = [10, 20, 30, 40, 50]

# TRAVERSAL - O(n)
for num in arr:
    print(num)

# ADD elements
arr.append(60)     # End - O(1)
arr.insert(0, 5)   # Start - O(n)

# REMOVE elements
arr.pop()          # End - O(1)
arr.pop(0)         # Start - O(n)

# SEARCH
idx = arr.index(30) if 30 in arr else -1  # O(n)
has = 20 in arr    # O(n)

# UPDATE - O(1)
arr[2] = 35`,
          java: `ArrayList<Integer> arr = new ArrayList<>(
    Arrays.asList(10, 20, 30, 40, 50)
);

// TRAVERSAL - O(n)
for (int num : arr) {
    System.out.println(num);
}

// ADD elements
arr.add(60);       // End - O(1)
arr.add(0, 5);     // Start - O(n)

// REMOVE elements
arr.remove(arr.size()-1);  // End - O(1)
arr.remove(0);             // Start - O(n)

// SEARCH
int idx = arr.indexOf(30);     // O(n)
boolean has = arr.contains(20); // O(n)

// UPDATE - O(1)
arr.set(2, 35);`,
          cpp: `vector<int> arr = {10, 20, 30, 40, 50};

// TRAVERSAL - O(n)
for (int num : arr) {
    cout << num << endl;
}

// ADD elements
arr.push_back(60);           // End - O(1)
arr.insert(arr.begin(), 5);  // Start - O(n)

// REMOVE elements
arr.pop_back();              // End - O(1)
arr.erase(arr.begin());      // Start - O(n)

// SEARCH
auto it = find(arr.begin(), arr.end(), 30);
int idx = (it != arr.end()) ? it - arr.begin() : -1;

// UPDATE - O(1)
arr[2] = 35;`
        }
      },
      {
        type: 'warning',
        title: 'Watch Out!',
        content: 'Inserting or deleting at the beginning of an array is O(n) because all elements must shift. If you need frequent insertions at both ends, consider using a Deque or Linked List instead.'
      },
      {
        type: 'example',
        title: 'Time Complexity Summary',
        content: `| Operation | Time | Notes |
|-----------|------|-------|
| Access arr[i] | O(1) | Direct calculation |
| Search | O(n) | Must check each element |
| Insert at end | O(1) | Amortized |
| Insert at start | O(n) | Shift all elements |
| Delete at end | O(1) | Simple removal |
| Delete at start | O(n) | Shift all elements |`
      },
      {
        type: 'tip',
        title: 'When to Use Arrays',
        content: `✅ **Use arrays when:**
• You need fast index-based access
• Size is known or mostly fixed
• Iterating through elements in order

❌ **Avoid when:**
• Frequent insertions/deletions in middle
• Unknown or rapidly changing size
• Need to frequently search (use Set/Map)`
      }
    ],
    nextLesson: 'arrays-operations',
    prevLesson: undefined
  },
  'arrays-operations': {
    id: 'arrays-operations',
    title: 'Array Operations & Methods',
    topic: 'Arrays & Strings',
    category: 'arrays',
    duration: '15 min',
    xp: 75,
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/oigfaZ5ApsM',
    objectives: [
      'Master array manipulation methods',
      'Understand mutating vs non-mutating operations',
      'Learn functional programming patterns',
      'Write cleaner, more efficient code'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Array Methods Deep Dive',
        content: 'Learn about array methods like map, filter, reduce and more.',
        videoId: 'oigfaZ5ApsM'
      },
      {
        type: 'text',
        title: 'Array Methods Overview',
        content: `Modern programming languages provide powerful built-in array methods. These can be categorized as:

**Mutating Methods** - Change the original array
**Non-Mutating Methods** - Return a new array, original unchanged

Knowing the difference is crucial for writing bug-free code!`
      },
      {
        type: 'code',
        title: 'Mutating Methods',
        language: 'multi',
        content: {
          javascript: `const arr = [3, 1, 4, 1, 5, 9];

// push/pop - add/remove from end
arr.push(2, 6);  // [3,1,4,1,5,9,2,6]
arr.pop();       // returns 6

// shift/unshift - add/remove from start
arr.unshift(0);  // [0,3,1,4,1,5,9,2]
arr.shift();     // returns 0

// splice - insert/remove at position
arr.splice(2, 1);     // remove 1 at index 2
arr.splice(2, 0, 'x'); // insert 'x' at index 2

// sort - sort in place
arr.sort((a, b) => a - b);

// reverse - reverse in place
arr.reverse();`,
          python: `arr = [3, 1, 4, 1, 5, 9]

# append/pop - add/remove from end
arr.append(2)    # [3,1,4,1,5,9,2]
arr.pop()        # returns 2

# insert/pop(0) - add/remove from start  
arr.insert(0, 0) # [0,3,1,4,1,5,9]
arr.pop(0)       # returns 0

# remove - remove first occurrence
arr.remove(1)    # removes first 1

# sort - sort in place
arr.sort()

# reverse - reverse in place
arr.reverse()`,
          java: `ArrayList<Integer> arr = new ArrayList<>(
    Arrays.asList(3, 1, 4, 1, 5, 9)
);

// add/remove from end
arr.add(2);
arr.remove(arr.size() - 1);

// add/remove from start
arr.add(0, 0);
arr.remove(0);

// remove at index
arr.remove(2);

// sort
Collections.sort(arr);

// reverse
Collections.reverse(arr);`,
          cpp: `vector<int> arr = {3, 1, 4, 1, 5, 9};

// push_back/pop_back - end operations
arr.push_back(2);
arr.pop_back();

// insert/erase - position operations
arr.insert(arr.begin(), 0);
arr.erase(arr.begin());
arr.erase(arr.begin() + 2);

// sort
sort(arr.begin(), arr.end());

// reverse
reverse(arr.begin(), arr.end());`
        }
      },
      {
        type: 'code',
        title: 'Non-Mutating Methods',
        language: 'multi',
        content: {
          javascript: `const arr = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = arr.map(x => x * 2);
// [2, 4, 6, 8, 10]

// filter - keep matching elements
const evens = arr.filter(x => x % 2 === 0);
// [2, 4]

// reduce - accumulate to single value
const sum = arr.reduce((acc, x) => acc + x, 0);
// 15

// slice - extract portion
const middle = arr.slice(1, 4);
// [2, 3, 4]

// concat - combine arrays
const combined = arr.concat([6, 7]);
// [1, 2, 3, 4, 5, 6, 7]

// find/findIndex
const found = arr.find(x => x > 3);    // 4
const idx = arr.findIndex(x => x > 3); // 3`,
          python: `arr = [1, 2, 3, 4, 5]

# map equivalent - list comprehension
doubled = [x * 2 for x in arr]
# [2, 4, 6, 8, 10]

# filter equivalent
evens = [x for x in arr if x % 2 == 0]
# [2, 4]

# reduce equivalent
from functools import reduce
total = reduce(lambda acc, x: acc + x, arr, 0)
# 15

# slice - extract portion
middle = arr[1:4]
# [2, 3, 4]

# concatenate
combined = arr + [6, 7]
# [1, 2, 3, 4, 5, 6, 7]

# find equivalent
found = next((x for x in arr if x > 3), None)`,
          java: `List<Integer> arr = Arrays.asList(1, 2, 3, 4, 5);

// Stream API for functional operations
// map
List<Integer> doubled = arr.stream()
    .map(x -> x * 2)
    .collect(Collectors.toList());

// filter
List<Integer> evens = arr.stream()
    .filter(x -> x % 2 == 0)
    .collect(Collectors.toList());

// reduce
int sum = arr.stream()
    .reduce(0, (acc, x) -> acc + x);

// find
Optional<Integer> found = arr.stream()
    .filter(x -> x > 3)
    .findFirst();`,
          cpp: `vector<int> arr = {1, 2, 3, 4, 5};

// transform (map equivalent)
vector<int> doubled(arr.size());
transform(arr.begin(), arr.end(), 
          doubled.begin(), [](int x) { return x * 2; });

// copy_if (filter equivalent)
vector<int> evens;
copy_if(arr.begin(), arr.end(), 
        back_inserter(evens), [](int x) { return x % 2 == 0; });

// accumulate (reduce)
int sum = accumulate(arr.begin(), arr.end(), 0);

// find_if
auto it = find_if(arr.begin(), arr.end(), 
                  [](int x) { return x > 3; });`
        }
      },
      {
        type: 'tip',
        title: 'Method Chaining',
        content: `Chain non-mutating methods for elegant, readable code:

\`\`\`javascript
const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .join(', ');
\`\`\`

This reads like English: "Get active users, extract names, join with comma."`
      }
    ],
    nextLesson: 'two-pointer',
    prevLesson: 'arrays-intro'
  },
  'two-pointer': {
    id: 'two-pointer',
    title: 'Two Pointer Technique',
    topic: 'Arrays & Strings',
    category: 'arrays',
    duration: '20 min',
    xp: 100,
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/-gjxg6Pln50',
    objectives: [
      'Understand the two-pointer pattern',
      'Reduce O(n²) to O(n) solutions',
      'Solve classic two-pointer problems',
      'Recognize when to apply this technique'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Two Pointer Technique',
        content: 'Master the two pointer technique with visual examples.',
        videoId: '-gjxg6Pln50'
      },
      {
        type: 'text',
        title: 'What is Two Pointer?',
        content: `The **Two Pointer** technique uses two indices to traverse an array or string simultaneously. This often transforms O(n²) brute force solutions into O(n) efficient ones.

**Common Patterns:**
• **Opposite ends** - Pointers start at both ends, move toward center
• **Same direction** - Both start at beginning, one moves faster
• **Two arrays** - One pointer per array for merging/comparing`
      },
      {
        type: 'code',
        title: 'Two Sum (Sorted Array)',
        language: 'multi',
        content: {
          c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int left = 0;
    int right = numsSize - 1;
    int* result = (int*)malloc(2 * sizeof(int));
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        
        if (sum == target) {
            result[0] = left;
            result[1] = right;
            *returnSize = 2;
            return result;  // Found!
        }
        
        if (sum < target) {
            left++;   // Need bigger sum
        } else {
            right--;  // Need smaller sum
        }
    }
    
    result[0] = -1;
    result[1] = -1;
    *returnSize = 2;
    return result;  // No solution
}

// Example: [2, 7, 11, 15], target = 9
// Returns [0, 1] (2 + 7 = 9)
// Time: O(n), Space: O(1)`,
          javascript: `function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    
    if (sum === target) {
      return [left, right]; // Found!
    }
    
    if (sum < target) {
      left++;   // Need bigger sum
    } else {
      right--;  // Need smaller sum
    }
  }
  
  return [-1, -1]; // No solution
}

// Example: [2, 7, 11, 15], target = 9
// Returns [0, 1] (2 + 7 = 9)
// Time: O(n), Space: O(1)`,
          python: `def two_sum(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left < right:
        curr_sum = nums[left] + nums[right]
        
        if curr_sum == target:
            return [left, right]  # Found!
        
        if curr_sum < target:
            left += 1   # Need bigger sum
        else:
            right -= 1  # Need smaller sum
    
    return [-1, -1]  # No solution

# Example: [2, 7, 11, 15], target = 9
# Returns [0, 1] (2 + 7 = 9)
# Time: O(n), Space: O(1)`,
          java: `public int[] twoSum(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        
        if (sum == target) {
            return new int[]{left, right};
        }
        
        if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[]{-1, -1};
}

// Time: O(n), Space: O(1)`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        
        if (sum == target) {
            return {left, right};
        }
        
        if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return {-1, -1};
}

// Time: O(n), Space: O(1)`
        }
      },
      {
        type: 'tip',
        title: 'When to Use Two Pointers',
        content: `Look for these clues:
• **Sorted array** - Usually opposite ends pattern
• **Finding pairs** - That satisfy some condition
• **Palindrome check** - Compare from both ends
• **Removing duplicates** - In-place modification
• **Merging sorted arrays** - One pointer each`
      }
    ],
    nextLesson: 'sliding-window',
    prevLesson: 'arrays-operations'
  },
  'stack-intro': {
    id: 'stack-intro',
    title: 'Introduction to Stacks',
    topic: 'Stacks & Queues',
    category: 'stacks',
    duration: '12 min',
    xp: 50,
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/I37kGX-nZEI',
    objectives: [
      'Understand the LIFO principle',
      'Learn core stack operations',
      'Implement a stack from scratch',
      'Solve classic stack problems'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Stack Data Structure',
        content: 'Learn about stacks visually with real-world examples.',
        videoId: 'I37kGX-nZEI'
      },
      {
        type: 'text',
        title: 'What is a Stack?',
        content: `A **Stack** is a linear data structure that follows the **LIFO** principle: **Last In, First Out**.

Think of a stack of plates:
• You add (push) plates to the top
• You remove (pop) plates from the top
• You can only access the top plate

**Core Operations:**
• **push(x)** - Add element to top
• **pop()** - Remove top element
• **peek/top()** - View top element
• **isEmpty()** - Check if empty`
      },
      {
        type: 'code',
        title: 'Stack Implementation',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int items[MAX_SIZE];
    int top;
} Stack;

void initStack(Stack* s) {
    s->top = -1;
}

void push(Stack* s, int x) {
    if (s->top < MAX_SIZE - 1) {
        s->items[++(s->top)] = x;
    }
}

int pop(Stack* s) {
    if (s->top >= 0) {
        return s->items[(s->top)--];
    }
    return -1;  // Error value
}

int peek(Stack* s) {
    if (s->top >= 0) {
        return s->items[s->top];
    }
    return -1;
}

bool isEmpty(Stack* s) {
    return s->top == -1;
}

int main() {
    Stack stack;
    initStack(&stack);
    
    push(&stack, 1);
    push(&stack, 2);
    push(&stack, 3);
    // stack = {1, 2, 3} (3 is top)
    
    int top = pop(&stack);      // returns 3
    int peekVal = peek(&stack); // 2
    bool empty = isEmpty(&stack); // false
    
    return 0;
}`,
          javascript: `// Using array as stack
const stack = [];

stack.push(1);
stack.push(2);
stack.push(3);
// stack = [1, 2, 3] (3 is top)

const top = stack.pop(); // returns 3
const peek = stack[stack.length - 1]; // 2
const empty = stack.length === 0; // false

// Class implementation
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(x)   { this.items.push(x); }
  pop()     { return this.items.pop(); }
  peek()    { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}`,
          python: `# Using list as stack
stack = []

stack.append(1)
stack.append(2)
stack.append(3)
# stack = [1, 2, 3] (3 is top)

top = stack.pop()  # returns 3
peek = stack[-1]   # 2
empty = len(stack) == 0  # False

# Class implementation
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, x):
        self.items.append(x)
    
    def pop(self):
        return self.items.pop()
    
    def peek(self):
        return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0`,
          java: `import java.util.Stack;

Stack<Integer> stack = new Stack<>();

stack.push(1);
stack.push(2);
stack.push(3);

int top = stack.pop(); // returns 3
int peek = stack.peek(); // 2
boolean empty = stack.isEmpty();

// Better: use Deque
Deque<Integer> stack2 = new ArrayDeque<>();
stack2.push(1);
stack2.pop();
stack2.peek();`,
          cpp: `#include <stack>
using namespace std;

stack<int> st;

st.push(1);
st.push(2);
st.push(3);

st.pop(); // removes 3 (no return!)
int top = st.top(); // 2
bool empty = st.empty();`
        }
      },
      {
        type: 'code',
        title: 'Valid Parentheses',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

#define MAX_SIZE 1000

bool isValid(char* s) {
    char stack[MAX_SIZE];
    int top = -1;
    
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        
        if (c == '(' || c == '[' || c == '{') {
            stack[++top] = c;
        } else {
            if (top == -1) return false;
            
            char last = stack[top--];
            if ((c == ')' && last != '(') ||
                (c == ']' && last != '[') ||
                (c == '}' && last != '{')) {
                return false;
            }
        }
    }
    
    return top == -1;
}

int main() {
    printf("%d\\n", isValid("({[]})")); // 1 (true)
    printf("%d\\n", isValid("([)]"));   // 0 (false)
    return 0;
}`,
          javascript: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  
  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}

isValid("({[]})"); // true
isValid("([)]");   // false`,
          python: `def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    
    for char in s:
        if char in '([{':
            stack.append(char)
        else:
            if not stack or stack.pop() != pairs[char]:
                return False
    
    return len(stack) == 0

is_valid("({[]})")  # True
is_valid("([)]")    # False`,
          java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> pairs = Map.of(
        ')', '(', ']', '[', '}', '{'
    );
    
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}`,
          cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {
        {')', '('}, {']', '['}, {'}', '{'}
    };
    
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty() || st.top() != pairs[c]) {
                return false;
            }
            st.pop();
        }
    }
    
    return st.empty();
}`
        }
      },
      {
        type: 'tip',
        title: 'Stack Applications',
        content: `• **Undo/Redo** - Text editors, browsers
• **Function calls** - Call stack in programs
• **Expression evaluation** - Calculators
• **Syntax parsing** - Compilers
• **Backtracking** - DFS, maze solving`
      }
    ],
    nextLesson: 'queue-intro',
    prevLesson: undefined
  },
  'queue-intro': {
    id: 'queue-intro',
    title: 'Introduction to Queues',
    topic: 'Stacks & Queues',
    category: 'queues',
    duration: '12 min',
    xp: 50,
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/XuCbpw6Bj1U',
    objectives: [
      'Understand the FIFO principle',
      'Learn core queue operations',
      'Implement a queue from scratch',
      'Understand when to use queues'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Queue Data Structure',
        content: 'Learn how queues work with animations and examples.',
        videoId: 'XuCbpw6Bj1U'
      },
      {
        type: 'text',
        title: 'What is a Queue?',
        content: `A **Queue** is a linear data structure that follows the **FIFO** principle: **First In, First Out**.

Think of a line at a coffee shop:
• First person in line is served first
• New people join at the back
• People leave from the front

**Core Operations:**
• **enqueue(x)** - Add element to back
• **dequeue()** - Remove element from front
• **front/peek()** - View front element
• **isEmpty()** - Check if empty`
      },
      {
        type: 'code',
        title: 'Queue Implementation',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int items[MAX_SIZE];
    int front;
    int rear;
    int size;
} Queue;

void initQueue(Queue* q) {
    q->front = 0;
    q->rear = -1;
    q->size = 0;
}

void enqueue(Queue* q, int x) {
    if (q->size < MAX_SIZE) {
        q->rear = (q->rear + 1) % MAX_SIZE;
        q->items[q->rear] = x;
        q->size++;
    }
}

int dequeue(Queue* q) {
    if (q->size > 0) {
        int item = q->items[q->front];
        q->front = (q->front + 1) % MAX_SIZE;
        q->size--;
        return item;
    }
    return -1;  // Error value
}

int peek(Queue* q) {
    if (q->size > 0) {
        return q->items[q->front];
    }
    return -1;
}

bool isEmpty(Queue* q) {
    return q->size == 0;
}

int main() {
    Queue queue;
    initQueue(&queue);
    
    enqueue(&queue, 1);
    enqueue(&queue, 2);
    int first = dequeue(&queue);  //  returns 1
    int front = peek(&queue);     // 2
    
    return 0;
}`,
          javascript: `// Using array as queue (simple but O(n) dequeue)
const queue = [];
queue.push(1);    // enqueue
queue.push(2);
queue.shift();    // dequeue - returns 1

// Better: Use a class with linked list
class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(x) { this.items[this.tail++] = x; }
  dequeue() { 
    const item = this.items[this.head];
    delete this.items[this.head++];
    return item;
  }
  peek() { return this.items[this.head]; }
  isEmpty() { return this.head === this.tail; }
}`,
          python: `from collections import deque

# Using deque (optimal - O(1) operations)
queue = deque()
queue.append(1)     # enqueue
queue.append(2)
queue.popleft()     # dequeue - returns 1

# Or simple list (O(n) dequeue)
queue = []
queue.append(1)
queue.pop(0)  # O(n) - avoid for large queues

# Class implementation
class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, x):
        self.items.append(x)
    
    def dequeue(self):
        return self.items.popleft()
    
    def peek(self):
        return self.items[0]`,
          java: `import java.util.LinkedList;
import java.util.Queue;

// Using LinkedList (implements Queue)
Queue<Integer> queue = new LinkedList<>();
queue.offer(1);    // enqueue
queue.offer(2);
queue.poll();      // dequeue - returns 1
queue.peek();      // view front

// ArrayDeque is faster for most cases
Deque<Integer> queue2 = new ArrayDeque<>();
queue2.addLast(1);
queue2.removeFirst();`,
          cpp: `#include <queue>
using namespace std;

queue<int> q;
q.push(1);      // enqueue
q.push(2);
q.pop();        // dequeue (no return!)
int front = q.front();  // view front
bool empty = q.empty();

// Size
int size = q.size();`
        }
      },
      {
        type: 'tip',
        title: 'Queue Applications',
        content: `• **BFS** - Breadth-First Search algorithm
• **Task scheduling** - Print queues, CPU scheduling
• **Buffering** - Keyboard buffer, IO buffers
• **Message queues** - Async communication
• **Level-order traversal** - Trees and graphs`
      }
    ],
    nextLesson: 'linked-list-intro',
    prevLesson: 'stack-intro'
  },
  'linked-list-intro': {
    id: 'linked-list-intro',
    title: 'Introduction to Linked Lists',
    topic: 'Linked Lists',
    category: 'linked-lists',
    duration: '15 min',
    xp: 75,
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/N6dOwBde7-M',
    objectives: [
      'Understand linked list structure',
      'Learn singly vs doubly linked lists',
      'Implement basic operations',
      'Compare with arrays'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Linked Lists Explained',
        content: 'Visual explanation of linked lists and their operations.',
        videoId: 'N6dOwBde7-M'
      },
      {
        type: 'text',
        title: 'What is a Linked List?',
        content: `A **Linked List** is a linear data structure where elements (nodes) are connected via pointers.

Unlike arrays:
• **Not contiguous** - Nodes can be anywhere in memory
• **Dynamic size** - Easily grows and shrinks
• **No indexing** - Must traverse to find elements

**Types:**
• **Singly Linked** - Each node points to next
• **Doubly Linked** - Nodes point to next AND previous
• **Circular** - Last node points to first`
      },
      {
        type: 'code',
        title: 'Node & List Implementation',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
    int val;
    struct ListNode* next;
} ListNode;

typedef struct {
    ListNode* head;
} LinkedList;

ListNode* createNode(int val) {
    ListNode* node = (ListNode*)malloc(sizeof(ListNode));
    node->val = val;
    node->next = NULL;
    return node;
}

// Add to front - O(1)
void prepend(LinkedList* list, int val) {
    ListNode* node = createNode(val);
    node->next = list-> head;
    list->head = node;
}

// Add to end - O(n)
void append(LinkedList* list, int val) {
    ListNode* node = createNode(val);
    if (!list->head) {
        list->head = node;
        return;
    }
    ListNode* curr = list->head;
    while (curr->next) {
        curr = curr->next;
    }
    curr->next = node;
}

// Remove first occurrence
void removeValue(LinkedList* list, int val) {
    if (!list->head) return;
    
    if (list->head->val == val) {
        ListNode* temp = list->head;
        list->head = list->head->next;
        free(temp);
        return;
    }
    
    ListNode* curr = list->head;
    while (curr->next && curr->next->val != val) {
        curr = curr->next;
    }
    
    if (curr->next) {
        ListNode* temp = curr->next;
        curr->next = curr->next->next;
        free(temp);
    }
}

int main() {
    LinkedList list = {NULL};
    append(&list, 1);
    append(&list, 2);
    prepend(&list, 0);
    removeValue(&list, 1);
    return 0;
}`,
          javascript: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  
  // Add to front - O(1)
  prepend(val) {
    const node = new ListNode(val);
    node.next = this.head;
    this.head = node;
  }
  
  // Add to end - O(n)
  append(val) {
    const node = new ListNode(val);
    if (!this.head) {
      this.head = node;
      return;
    }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = node;
  }
  
  // Remove first occurrence
  remove(val) {
    if (!this.head) return;
    if (this.head.val === val) {
      this.head = this.head.next;
      return;
    }
    let curr = this.head;
    while (curr.next && curr.next.val !== val) {
      curr = curr.next;
    }
    if (curr.next) curr.next = curr.next.next;
  }
}`,
          python: `class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    # Add to front - O(1)
    def prepend(self, val):
        node = ListNode(val)
        node.next = self.head
        self.head = node
    
    # Add to end - O(n)
    def append(self, val):
        node = ListNode(val)
        if not self.head:
            self.head = node
            return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = node
    
    # Remove first occurrence
    def remove(self, val):
        if not self.head:
            return
        if self.head.val == val:
            self.head = self.head.next
            return
        curr = self.head
        while curr.next and curr.next.val != val:
            curr = curr.next
        if curr.next:
            curr.next = curr.next.next`,
          java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class LinkedList {
    ListNode head;
    
    // Add to front - O(1)
    void prepend(int val) {
        ListNode node = new ListNode(val);
        node.next = head;
        head = node;
    }
    
    // Add to end - O(n)
    void append(int val) {
        ListNode node = new ListNode(val);
        if (head == null) { head = node; return; }
        ListNode curr = head;
        while (curr.next != null) curr = curr.next;
        curr.next = node;
    }
    
    // Remove first occurrence
    void remove(int val) {
        if (head == null) return;
        if (head.val == val) { head = head.next; return; }
        ListNode curr = head;
        while (curr.next != null && curr.next.val != val) {
            curr = curr.next;
        }
        if (curr.next != null) curr.next = curr.next.next;
    }
}`,
          cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

class LinkedList {
public:
    ListNode* head = nullptr;
    
    // Add to front - O(1)
    void prepend(int val) {
        ListNode* node = new ListNode(val);
        node->next = head;
        head = node;
    }
    
    // Add to end - O(n)
    void append(int val) {
        ListNode* node = new ListNode(val);
        if (!head) { head = node; return; }
        ListNode* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = node;
    }
    
    // Remove first occurrence
    void remove(int val) {
        if (!head) return;
        if (head->val == val) { 
            head = head->next; 
            return; 
        }
        ListNode* curr = head;
        while (curr->next && curr->next->val != val) {
            curr = curr->next;
        }
        if (curr->next) curr->next = curr->next->next;
    }
};`
        }
      },
      {
        type: 'example',
        title: 'Arrays vs Linked Lists',
        content: `| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) ✅ | O(n) ❌ |
| Insert at start | O(n) | O(1) ✅ |
| Insert at end | O(1)* | O(n) or O(1)** |
| Delete at start | O(n) | O(1) ✅ |
| Memory | Contiguous | Scattered |

*Amortized **With tail pointer`
      }
    ],
    nextLesson: 'tree-intro',
    prevLesson: 'queue-intro'
  },
  'tree-intro': {
    id: 'tree-intro',
    title: 'Introduction to Trees',
    topic: 'Trees',
    category: 'trees',
    duration: '15 min',
    xp: 75,
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/oSWTXtMglKE',
    objectives: [
      'Understand tree structure and terminology',
      'Learn about binary trees',
      'Master tree traversals',
      'Implement basic tree operations'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Trees Data Structure',
        content: 'Visual introduction to tree data structures.',
        videoId: 'oSWTXtMglKE'
      },
      {
        type: 'text',
        title: 'What is a Tree?',
        content: `A **Tree** is a hierarchical data structure with nodes connected by edges.

**Key Terms:**
• **Root** - Top node (no parent)
• **Parent/Child** - Connected nodes
• **Leaf** - Node with no children
• **Height** - Longest path from root to leaf
• **Depth** - Distance from root to node

**Binary Tree**: Each node has at most 2 children (left & right)`
      },
      {
        type: 'code',
        title: 'Binary Tree Implementation',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

TreeNode* createNode(int val) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->val = val;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// Create a tree:
//       1
//      / \\
//     2   3
//    / \\
//   4   5
int main() {
    TreeNode* root = createNode(1);
    root->left = createNode(2);
    root->right = createNode(3);
    root->left->left = createNode(4);
    root->left->right = createNode(5);
    
    return 0;
}`,
          javascript: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Create a tree:
//       1
//      / \\
//     2   3
//    / \\
//   4   5
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);`,
          python: `class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

# Create a tree:
#       1
#      / \\
#     2   3
#    / \\
#   4   5
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)`,
          java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

// Create a tree:
//       1
//      / \\
//     2   3
//    / \\
//   4   5
TreeNode root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);`,
          cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

// Create a tree:
//       1
//      / \\
//     2   3
//    / \\
//   4   5
TreeNode* root = new TreeNode(1);
root->left = new TreeNode(2);
root->right = new TreeNode(3);
root->left->left = new TreeNode(4);
root->left->right = new TreeNode(5);`
        }
      },
      {
        type: 'code',
        title: 'Tree Traversals',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int val;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

// Inorder: Left → Root → Right
void inorder(TreeNode* node) {
    if (node == NULL) return;
    inorder(node->left);
    printf("%d ", node->val);  // 4, 2, 5, 1, 3
    inorder(node->right);
}

// Preorder: Root → Left → Right
void preorder(TreeNode* node) {
    if (node == NULL) return;
    printf("%d ", node->val);  // 1, 2, 4, 5, 3
    preorder(node->left);
    preorder(node->right);
}

// Postorder: Left → Right → Root
void postorder(TreeNode* node) {
    if (node == NULL) return;
    postorder(node->left);
    postorder(node->right);
    printf("%d ", node->val);  // 4, 5, 2, 3, 1
}

// Level Order (BFS) - using queue
#define MAX_QUEUE 100
void levelOrder(TreeNode* root) {
    if (root == NULL) return;
    
    TreeNode* queue[MAX_QUEUE];
    int front = 0, rear = 0;
    queue[rear++] = root;
    
    while (front < rear) {
        TreeNode* node = queue[front++];
        printf("%d ", node->val);  // 1, 2, 3, 4, 5
        
        if (node->left) queue[rear++] = node->left;
        if (node->right) queue[rear++] = node->right;
    }
}`,
          javascript: `// Inorder: Left → Root → Right
function inorder(node) {
  if (!node) return;
  inorder(node.left);
  console.log(node.val);  // 4, 2, 5, 1, 3
  inorder(node.right);
}

// Preorder: Root → Left → Right
function preorder(node) {
  if (!node) return;
  console.log(node.val);  // 1, 2, 4, 5, 3
  preorder(node.left);
  preorder(node.right);
}

// Postorder: Left → Right → Root
function postorder(node) {
  if (!node) return;
  postorder(node.left);
  postorder(node.right);
  console.log(node.val);  // 4, 5, 2, 3, 1
}

// Level Order (BFS)
function levelOrder(root) {
  if (!root) return [];
  const queue = [root];
  const result = [];
  while (queue.length) {
    const node = queue.shift();
    result.push(node.val);  // 1, 2, 3, 4, 5
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}`,
          python: `# Inorder: Left → Root → Right
def inorder(node):
    if not node:
        return
    inorder(node.left)
    print(node.val)  # 4, 2, 5, 1, 3
    inorder(node.right)

# Preorder: Root → Left → Right
def preorder(node):
    if not node:
        return
    print(node.val)  # 1, 2, 4, 5, 3
    preorder(node.left)
    preorder(node.right)

# Postorder: Left → Right → Root
def postorder(node):
    if not node:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.val)  # 4, 5, 2, 3, 1

# Level Order (BFS)
from collections import deque
def level_order(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node.val)  # 1, 2, 3, 4, 5
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result`,
          java: `// Inorder: Left → Root → Right
void inorder(TreeNode node) {
    if (node == null) return;
    inorder(node.left);
    System.out.print(node.val + " ");  // 4, 2, 5, 1, 3
    inorder(node.right);
}

// Preorder: Root → Left → Right
void preorder(TreeNode node) {
    if (node == null) return;
    System.out.print(node.val + " ");  // 1, 2, 4, 5, 3
    preorder(node.left);
    preorder(node.right);
}

// Level Order (BFS)
List<Integer> levelOrder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        result.add(node.val);  // 1, 2, 3, 4, 5
        if (node.left != null) queue.offer(node.left);
        if (node.right != null) queue.offer(node.right);
    }
    return result;
}`,
          cpp: `// Inorder: Left → Root → Right
void inorder(TreeNode* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->val << " ";  // 4, 2, 5, 1, 3
    inorder(node->right);
}

// Preorder: Root → Left → Right  
void preorder(TreeNode* node) {
    if (!node) return;
    cout << node->val << " ";  // 1, 2, 4, 5, 3
    preorder(node->left);
    preorder(node->right);
}

// Level Order (BFS)
vector<int> levelOrder(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        result.push_back(node->val);  // 1, 2, 3, 4, 5
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return result;
}`
        }
      },
      {
        type: 'tip',
        title: 'When to Use Each Traversal',
        content: `• **Inorder** - Get sorted order (BST), expression trees
• **Preorder** - Copy a tree, serialize, prefix notation
• **Postorder** - Delete tree, evaluate expressions
• **Level Order** - Level-by-level processing, find depth`
      }
    ],
    nextLesson: 'graph-intro',
    prevLesson: 'linked-list-intro'
  },
  'graph-intro': {
    id: 'graph-intro',
    title: 'Introduction to Graphs',
    topic: 'Graphs',
    category: 'graphs',
    duration: '18 min',
    xp: 100,
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/tWVWeAqZ0WU',
    objectives: [
      'Understand graph terminology',
      'Learn different graph representations',
      'Implement BFS and DFS',
      'Know when to use graphs'
    ],
    sections: [
      {
        type: 'video',
        title: 'Video: Graph Data Structures',
        content: 'Complete introduction to graphs with visual examples.',
        videoId: 'tWVWeAqZ0WU'
      },
      {
        type: 'text',
        title: 'What is a Graph?',
        content: `A **Graph** is a collection of **vertices (nodes)** connected by **edges**.

**Types:**
• **Directed** - Edges have direction (A → B)
• **Undirected** - Edges go both ways (A — B)
• **Weighted** - Edges have values/costs
• **Cyclic** - Contains cycles
• **Connected** - All nodes reachable

**Representations:**
• **Adjacency List** - Map of node → neighbors (space efficient)
• **Adjacency Matrix** - 2D array (fast lookup)`
      },
      {
        type: 'code',
        title: 'Graph Representation',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdlib.h>

#define MAX_NODES 100

// Adjacency List using array of arrays
typedef struct {
    int neighbors[MAX_NODES];
    int count;
} AdjList;

AdjList graph[MAX_NODES];

void addEdge(int u, int v) {
    // Add v to u's list
    graph[u].neighbors[graph[u].count++] = v;
    // For undirected, add u to v's list too
    graph[v].neighbors[graph[v].count++] = u;
}

// Adjacency Matrix
int matrix[MAX_NODES][MAX_NODES] = {0};

void addEdgeMatrix(int u, int v) {
    matrix[u][v] = 1;
    matrix[v][u] = 1;  // For undirected graph
}

// Example for nodes 0-5
void initGraph() {
    // Initialize all counts to 0
    for (int i = 0; i < MAX_NODES; i++) {
        graph[i].count = 0;
    }
    
    // Add edges (0=A, 1=B, 2=C, etc.)
    addEdge(0, 1);  // A-B
    addEdge(0, 2);  // A-C
    addEdge(1, 3);  // B-D
}`,
          javascript: `// Adjacency List (most common)
const graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D', 'E'],
  'C': ['A', 'F'],
  'D': ['B'],
  'E': ['B', 'F'],
  'F': ['C', 'E']
};

// Or using Map
const graphMap = new Map();
graphMap.set('A', ['B', 'C']);
graphMap.set('B', ['A', 'D', 'E']);
// ...

// Adjacency Matrix
//     A  B  C  D  E  F
// A [ 0, 1, 1, 0, 0, 0 ]
// B [ 1, 0, 0, 1, 1, 0 ]
// C [ 1, 0, 0, 0, 0, 1 ]
// ...`,
          python: `# Adjacency List (most common)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# Using defaultdict for dynamic graphs
from collections import defaultdict
graph = defaultdict(list)
graph['A'].append('B')
graph['A'].append('C')
graph['B'].append('A')

# Adjacency Matrix (for dense graphs)
# 0 = no edge, 1 = edge exists
matrix = [
    [0, 1, 1, 0, 0, 0],  # A
    [1, 0, 0, 1, 1, 0],  # B
    [1, 0, 0, 0, 0, 1],  # C
    # ...
]`,
          java: `// Adjacency List
Map<String, List<String>> graph = new HashMap<>();
graph.put("A", Arrays.asList("B", "C"));
graph.put("B", Arrays.asList("A", "D", "E"));
graph.put("C", Arrays.asList("A", "F"));

// For integer nodes
List<List<Integer>> adjList = new ArrayList<>();
for (int i = 0; i < n; i++) {
    adjList.add(new ArrayList<>());
}
// Add edge 0 → 1
adjList.get(0).add(1);

// Adjacency Matrix
int[][] matrix = new int[n][n];
matrix[0][1] = 1;  // Edge from 0 to 1`,
          cpp: `// Adjacency List (vector of vectors)
vector<vector<int>> adjList(n);
adjList[0].push_back(1);  // 0 → 1
adjList[0].push_back(2);  // 0 → 2
adjList[1].push_back(0);  // 1 → 0

// Using unordered_map for string nodes
unordered_map<string, vector<string>> graph;
graph["A"] = {"B", "C"};
graph["B"] = {"A", "D", "E"};

// Adjacency Matrix
vector<vector<int>> matrix(n, vector<int>(n, 0));
matrix[0][1] = 1;  // Edge from 0 to 1`
        }
      },
      {
        type: 'code',
        title: 'BFS & DFS',
        language: 'multi',
        content: {
          c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_NODES 100
#define MAX_QUEUE 1000

// Using the AdjList structure from previous example
extern AdjList graph[MAX_NODES];

// BFS - Level by level, uses Queue
void bfs(int start, int n) {
    bool visited[MAX_NODES] = {false};
    int queue[MAX_QUEUE];
    int front = 0, rear = 0;
    
    visited[start] = true;
    queue[rear++] = start;
    
    printf("BFS: ");
    while (front < rear) {
        int node = queue[front++];
        printf("%d ", node);
        
        for (int i = 0; i < graph[node].count; i++) {
            int neighbor = graph[node].neighbors[i];
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue[rear++] = neighbor;
            }
        }
    }
    printf("\\n");
}

// DFS - Recursive
void dfsHelper(int node, bool visited[]) {
    visited[node] = true;
    printf("%d ", node);
    
    for (int i = 0; i < graph[node].count; i++) {
        int neighbor = graph[node].neighbors[i];
        if (!visited[neighbor]) {
            dfsHelper(neighbor, visited);
        }
    }
}

void dfs(int start, int n) {
    bool visited[MAX_NODES] = {false};
    printf("DFS: ");
    dfsHelper(start, visited);
    printf("\\n");
}`,
          javascript: `// BFS - Level by level, uses Queue
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];
  
  while (queue.length) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}

// DFS - Go deep first, uses Stack/Recursion
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
          python: `from collections import deque

# BFS - Level by level, uses Queue
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result

# DFS - Go deep first, uses Stack/Recursion
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)`,
          java: `// BFS - Level by level
List<String> bfs(Map<String, List<String>> graph, String start) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    List<String> result = new ArrayList<>();
    
    visited.add(start);
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        String node = queue.poll();
        result.add(node);
        
        for (String neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
    return result;
}

// DFS - Recursive
void dfs(Map<String, List<String>> graph, String node, Set<String> visited) {
    visited.add(node);
    System.out.println(node);
    
    for (String neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}`,
          cpp: `// BFS
vector<int> bfs(vector<vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    vector<int> result;
    
    visited.insert(start);
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);
        
        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return result;
}

// DFS - Recursive
void dfs(vector<vector<int>>& graph, int node, 
         unordered_set<int>& visited) {
    visited.insert(node);
    cout << node << " ";
    
    for (int neighbor : graph[node]) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(graph, neighbor, visited);
        }
    }
}`
        }
      },
      {
        type: 'tip',
        title: 'BFS vs DFS',
        content: `**Use BFS when:**
• Finding shortest path (unweighted)
• Level-by-level processing
• Closest nodes first

**Use DFS when:**
• Detecting cycles
• Topological sort
• Path finding (all paths)
• Backtracking problems`
      }
    ],
    nextLesson: undefined,
    prevLesson: 'tree-intro'
  }
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;
  const lesson = lessonsData[slug];
  
  const { syncLesson, isLessonCompleted, getCompletedLessons } = useProgressSync();
  
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('c');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if lesson is already completed
  useEffect(() => {
    if (slug && session) {
      setIsCompleted(isLessonCompleted(slug));
    }
  }, [slug, session, isLessonCompleted]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCompleteLesson = async () => {
    if (!session || !lesson || isCompleted) return;
    
    setIsCompleting(true);
    try {
      await syncLesson(lesson.id, lesson.xp);
      setIsCompleted(true);
      
      // Navigate to next lesson after a short delay
      if (lesson.nextLesson) {
        setTimeout(() => {
          router.push(`/learn/${lesson.nextLesson}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lesson Not Found</h1>
          <p className="text-slate-600 mb-6">This lesson doesn&apos;t exist yet.</p>
          <Link href="/learn" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Learning
          </Link>
        </div>
      </div>
    );
  }

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const progress = (completedSections.size / lesson.sections.length) * 100;

  const difficultyColors = {
    beginner: 'bg-emerald-500/20 text-emerald-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/learn" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Language Selector - Fixed with ref */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl text-violet-700 transition-all"
              >
                <div className={cn("w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center text-white", languageConfig[codeLanguage].color)}>
                  {languageConfig[codeLanguage].icon}
                </div>
                <span className="hidden sm:inline">{languageConfig[codeLanguage].label}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showLangMenu && "rotate-180")} />
              </button>

              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {(Object.keys(languageConfig) as CodeLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCodeLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors",
                        codeLanguage === lang && "bg-violet-50"
                      )}
                    >
                      <div className={cn("w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center text-white", languageConfig[lang].color)}>
                        {languageConfig[lang].icon}
                      </div>
                      <span className={codeLanguage === lang ? "text-violet-700" : "text-slate-700"}>
                        {languageConfig[lang].label}
                      </span>
                      {codeLanguage === lang && <Check className="w-4 h-4 text-violet-600 ml-auto" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-4 h-4" />
                {lesson.duration}
              </div>
              <div className="flex items-center gap-1.5 text-amber-600">
                <Zap className="w-4 h-4" />
                +{lesson.xp} XP
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-sky-400 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <span>{lesson.topic}</span>
            <span>•</span>
            <span className={cn("px-2 py-0.5 rounded-full text-xs", difficultyColors[lesson.difficulty])}>
              {lesson.difficulty}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{lesson.title}</h1>
          
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
            <div className="flex items-center gap-2 text-violet-700 font-medium mb-3">
              <Target className="w-5 h-5" />
              What You&apos;ll Learn
            </div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {lesson.sections.map((section, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              {section.type === 'video' && section.videoId && (
                <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border-b border-red-500/20">
                    <Play className="w-4 h-4 text-red-400" />
                    <span className="font-medium text-red-300">{section.title}</span>
                  </div>
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${section.videoId}`}
                      title={section.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="px-4 py-3 text-sm text-slate-600">
                    {section.content as string}
                  </div>
                </div>
              )}

              {section.type === 'text' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  {section.title && <h2 className="text-xl font-bold text-slate-900 mb-4">{section.title}</h2>}
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: (section.content as string)
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-violet-50 border border-violet-200 rounded text-violet-700 text-sm">$1</code>')
                      .replace(/\n\n/g, '</p><p class="mt-4">')
                      .replace(/\n•/g, '<br />•')
                    }}
                  />
                </div>
              )}

              {section.type === 'code' && (
                <div className="bg-slate-900 border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-violet-400" />
                      <span className="font-medium text-white">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.language === 'multi' && (
                        <div className={cn("w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center text-white", languageConfig[codeLanguage].color)}>
                          {languageConfig[codeLanguage].icon}
                        </div>
                      )}
                      <button onClick={() => {
                        const code = section.language === 'multi' ? (section.content as MultiLangCode)[codeLanguage] : section.content as string;
                        copyCode(code, index);
                      }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Copy code">
                        {copiedIndex === index ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-slate-300 leading-relaxed">
                      {section.language === 'multi' ? (section.content as MultiLangCode)[codeLanguage] : section.content as string}
                    </code>
                  </pre>
                </div>
              )}

              {section.type === 'tip' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-emerald-800 mb-2">{section.title}</h3>
                      <div className="text-emerald-900 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: (section.content as string)
                          .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-emerald-100 rounded text-emerald-800 text-xs">$1</code>')
                          .replace(/\n/g, '<br />')
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {section.type === 'warning' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">{section.title}</h3>
                      <div className="text-amber-900 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: (section.content as string).replace(/\n/g, '<br />') }} />
                    </div>
                  </div>
                </div>
              )}

              {section.type === 'example' && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Play className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-violet-800 mb-3">{section.title}</h3>
                      <div className="text-violet-900 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: (section.content as string)
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-violet-800">$1</strong>')
                          .replace(/\| Operation \| Time \| Notes \|[\s\S]*?(?=\n\n|$)/g, (match) => {
                            // Convert markdown table to HTML
                            const lines = match.trim().split('\n').filter(line => !line.match(/^[\|\-\s]+$/));
                            if (lines.length === 0) return match;
                            
                            const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
                            const rows = lines.slice(1).map(line => 
                              line.split('|').map(cell => cell.trim()).filter(cell => cell)
                            );
                            
                            return `<div class="overflow-x-auto my-3">
                              <table class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                                <thead>
                                  <tr class="bg-violet-100">
                                    ${headers.map(h => `<th class="px-3 py-2 text-left text-xs font-semibold text-violet-900 uppercase tracking-wider border-b-2 border-violet-200">${h}</th>`).join('')}
                                  </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                  ${rows.map((row, i) => `
                                    <tr class="hover:bg-violet-50 transition-colors">
                                      ${row.map((cell, j) => {
                                        const isFirst = j === 0;
                                        const isComplexity = j === 1 && cell.match(/O\(.*?\)/);
                                        let cellClass = 'px-3 py-2 text-sm text-slate-700';
                                        let content = cell;
                                        
                                        if (isFirst) {
                                          cellClass += ' font-medium text-violet-900';
                                        } else if (isComplexity) {
                                          const complexityColor = 
                                            cell.includes('O(1)') ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                            cell.includes('O(log') ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                            cell.includes('O(n)') && !cell.includes('O(n²)') ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                            'bg-red-100 text-red-800 border-red-300';
                                          content = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold border ${complexityColor}">${cell}</span>`;
                                        }
                                        
                                        return `<td class="${cellClass}">${content}</td>`;
                                      }).join('')}
                                    </tr>
                                  `).join('')}
                                </tbody>
                              </table>
                            </div>`;
                          })
                          .replace(/\n/g, '<br />')
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center gap-6 mt-12 pt-8 border-t border-slate-200">
          {/* Complete Lesson Button */}
          {session ? (
            <div className="w-full max-w-md">
              {isCompleted ? (
                <div className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-300">Lesson Completed!</div>
                    <div className="text-sm text-emerald-400">+{lesson.xp} XP earned</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCompleteLesson}
                  disabled={isCompleting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-sky-400/25 hover:shadow-xl hover:shadow-sky-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Complete Lesson & Earn {lesson.xp} XP
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="w-full max-w-md p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-amber-200 font-medium">Sign in to track progress</p>
                <p className="text-amber-200/60 text-sm">Complete lessons and earn XP</p>
              </div>
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between w-full">
            {lesson.prevLesson ? (
              <Link href={`/learn/${lesson.prevLesson}`} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Link>
            ) : <div />}
            
            {lesson.nextLesson ? (
              <Link href={`/learn/${lesson.nextLesson}`} className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl font-medium transition-all">
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/learn" className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl font-medium transition-all">
                Back to Lessons
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

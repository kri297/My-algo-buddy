import type { ProgrammingLanguage } from "@/types";

// ============================================
// SORTING ALGORITHMS CODE SNIPPETS
// ============================================

export const sortingAlgorithms = {
  bubbleSort: {
    id: "bubble-sort",
    name: "Bubble Sort",
    description: "Repeatedly swaps adjacent elements if they are in wrong order",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    code: {
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,

      javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`,

      java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
  },

  quickSort: {
    id: "quick-sort",
    name: "Quick Sort",
    description: "Divide and conquer algorithm using pivot partitioning",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    code: {
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,

      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,

      java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,

      cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
}

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
    },
  },

  mergeSort: {
    id: "merge-sort",
    name: "Merge Sort",
    description: "Divide and conquer algorithm that splits and merges",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    code: {
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,

      javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return [...result, ...left.slice(i), ...right.slice(j)];
}`,

      java: `public static void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

private static void merge(int[] arr, int left, int mid, int right) {
    int[] leftArr = Arrays.copyOfRange(arr, left, mid + 1);
    int[] rightArr = Arrays.copyOfRange(arr, mid + 1, right + 1);
    
    int i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }
    
    while (i < leftArr.length) arr[k++] = leftArr[i++];
    while (j < rightArr.length) arr[k++] = rightArr[j++];
}`,

      cpp: `void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> leftArr(arr.begin() + left, arr.begin() + mid + 1);
    vector<int> rightArr(arr.begin() + mid + 1, arr.begin() + right + 1);
    
    int i = 0, j = 0, k = left;
    
    while (i < leftArr.size() && j < rightArr.size()) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }
    
    while (i < leftArr.size()) arr[k++] = leftArr[i++];
    while (j < rightArr.size()) arr[k++] = rightArr[j++];
}`,
    },
  },

  insertionSort: {
    id: "insertion-sort",
    name: "Insertion Sort",
    description: "Builds sorted array one element at a time",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    code: {
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        arr[j + 1] = key
    return arr`,

      javascript: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
    return arr;
}`,

      java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
}`,

      cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
}`,
    },
  },

  selectionSort: {
    id: "selection-sort",
    name: "Selection Sort",
    description: "Finds minimum element and places at beginning",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    code: {
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,

      javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,

      java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,

      cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
    },
  },
};

// ============================================
// SEARCHING ALGORITHMS CODE SNIPPETS
// ============================================

export const searchingAlgorithms = {
  binarySearch: {
    id: "binary-search",
    name: "Binary Search",
    description: "Efficiently finds element in sorted array by halving search space",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    iterative: {
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,

      javascript: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}`,

      java: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}`,

      cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}`,
    },
    recursive: {
      python: `def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = left + (right - left) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)`,

      javascript: `function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return -1;
    
    const mid = Math.floor(left + (right - left) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    }
    return binarySearchRecursive(arr, target, left, mid - 1);
}`,

      java: `public static int binarySearchRecursive(int[] arr, int target, int left, int right) {
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    }
    return binarySearchRecursive(arr, target, left, mid - 1);
}`,

      cpp: `int binarySearchRecursive(vector<int>& arr, int target, int left, int right) {
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    }
    return binarySearchRecursive(arr, target, left, mid - 1);
}`,
    },
  },

  linearSearch: {
    id: "linear-search",
    name: "Linear Search",
    description: "Sequentially checks each element until found",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    code: {
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,

      javascript: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}`,

      java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,

      cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
    },
  },
};

// ============================================
// GRAPH ALGORITHMS CODE SNIPPETS
// ============================================

export const graphAlgorithms = {
  bfs: {
    id: "bfs",
    name: "Breadth-First Search",
    description: "Explores neighbors level by level using a queue",
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    code: {
      python: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    result = []
    
    while queue:
        vertex = queue.popleft()
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            
            for neighbor in graph[vertex]:
                if neighbor not in visited:
                    queue.append(neighbor)
    
    return result`,

      javascript: `function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        if (!visited.has(vertex)) {
            visited.add(vertex);
            result.push(vertex);
            
            for (const neighbor of graph[vertex]) {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }
    }
    
    return result;
}`,

      java: `public List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    List<Integer> result = new ArrayList<>();
    
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        int vertex = queue.poll();
        if (!visited.contains(vertex)) {
            visited.add(vertex);
            result.add(vertex);
            
            for (int neighbor : graph.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    queue.offer(neighbor);
                }
            }
        }
    }
    
    return result;
}`,

      cpp: `vector<int> bfs(unordered_map<int, vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    vector<int> result;
    
    q.push(start);
    
    while (!q.empty()) {
        int vertex = q.front();
        q.pop();
        
        if (visited.find(vertex) == visited.end()) {
            visited.insert(vertex);
            result.push_back(vertex);
            
            for (int neighbor : graph[vertex]) {
                if (visited.find(neighbor) == visited.end()) {
                    q.push(neighbor);
                }
            }
        }
    }
    
    return result;
}`,
    },
  },

  dfs: {
    id: "dfs",
    name: "Depth-First Search",
    description: "Explores as far as possible before backtracking",
    timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
    spaceComplexity: "O(V)",
    iterative: {
      python: `def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        vertex = stack.pop()
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            
            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result`,

      javascript: `function dfsIterative(graph, start) {
    const visited = new Set();
    const stack = [start];
    const result = [];
    
    while (stack.length > 0) {
        const vertex = stack.pop();
        if (!visited.has(vertex)) {
            visited.add(vertex);
            result.push(vertex);
            
            for (const neighbor of graph[vertex].reverse()) {
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                }
            }
        }
    }
    
    return result;
}`,

      java: `public List<Integer> dfsIterative(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Stack<Integer> stack = new Stack<>();
    List<Integer> result = new ArrayList<>();
    
    stack.push(start);
    
    while (!stack.isEmpty()) {
        int vertex = stack.pop();
        if (!visited.contains(vertex)) {
            visited.add(vertex);
            result.add(vertex);
            
            List<Integer> neighbors = new ArrayList<>(graph.get(vertex));
            Collections.reverse(neighbors);
            for (int neighbor : neighbors) {
                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                }
            }
        }
    }
    
    return result;
}`,

      cpp: `vector<int> dfsIterative(unordered_map<int, vector<int>>& graph, int start) {
    unordered_set<int> visited;
    stack<int> s;
    vector<int> result;
    
    s.push(start);
    
    while (!s.empty()) {
        int vertex = s.top();
        s.pop();
        
        if (visited.find(vertex) == visited.end()) {
            visited.insert(vertex);
            result.push_back(vertex);
            
            vector<int> neighbors = graph[vertex];
            reverse(neighbors.begin(), neighbors.end());
            for (int neighbor : neighbors) {
                if (visited.find(neighbor) == visited.end()) {
                    s.push(neighbor);
                }
            }
        }
    }
    
    return result;
}`,
    },
    recursive: {
      python: `def dfs_recursive(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))
    
    return result`,

      javascript: `function dfsRecursive(graph, start, visited = new Set()) {
    visited.add(start);
    const result = [start];
    
    for (const neighbor of graph[start]) {
        if (!visited.has(neighbor)) {
            result.push(...dfsRecursive(graph, neighbor, visited));
        }
    }
    
    return result;
}`,

      java: `public void dfsRecursive(Map<Integer, List<Integer>> graph, int start, 
                          Set<Integer> visited, List<Integer> result) {
    visited.add(start);
    result.add(start);
    
    for (int neighbor : graph.get(start)) {
        if (!visited.contains(neighbor)) {
            dfsRecursive(graph, neighbor, visited, result);
        }
    }
}`,

      cpp: `void dfsRecursive(unordered_map<int, vector<int>>& graph, int start,
                    unordered_set<int>& visited, vector<int>& result) {
    visited.insert(start);
    result.push_back(start);
    
    for (int neighbor : graph[start]) {
        if (visited.find(neighbor) == visited.end()) {
            dfsRecursive(graph, neighbor, visited, result);
        }
    }
}`,
    },
  },

  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description: "Finds shortest paths from source to all vertices",
    timeComplexity: { best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O((V+E) log V)" },
    spaceComplexity: "O(V)",
    code: {
      python: `import heapq

def dijkstra(graph, start):
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current in visited:
            continue
        visited.add(current)
        
        for neighbor, weight in graph[current]:
            distance = current_dist + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances`,

      javascript: `function dijkstra(graph, start) {
    const distances = {};
    const visited = new Set();
    const pq = new MinPriorityQueue();
    
    for (const vertex in graph) {
        distances[vertex] = Infinity;
    }
    distances[start] = 0;
    pq.enqueue(start, 0);
    
    while (!pq.isEmpty()) {
        const { element: current } = pq.dequeue();
        
        if (visited.has(current)) continue;
        visited.add(current);
        
        for (const [neighbor, weight] of graph[current]) {
            const distance = distances[current] + weight;
            
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                pq.enqueue(neighbor, distance);
            }
        }
    }
    
    return distances;
}`,

      java: `public Map<Integer, Integer> dijkstra(Map<Integer, List<int[]>> graph, int start) {
    Map<Integer, Integer> distances = new HashMap<>();
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    Set<Integer> visited = new HashSet<>();
    
    for (int vertex : graph.keySet()) {
        distances.put(vertex, Integer.MAX_VALUE);
    }
    distances.put(start, 0);
    pq.offer(new int[]{start, 0});
    
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int current = curr[0];
        
        if (visited.contains(current)) continue;
        visited.add(current);
        
        for (int[] edge : graph.get(current)) {
            int neighbor = edge[0], weight = edge[1];
            int distance = distances.get(current) + weight;
            
            if (distance < distances.get(neighbor)) {
                distances.put(neighbor, distance);
                pq.offer(new int[]{neighbor, distance});
            }
        }
    }
    
    return distances;
}`,

      cpp: `unordered_map<int, int> dijkstra(unordered_map<int, vector<pair<int, int>>>& graph, int start) {
    unordered_map<int, int> distances;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    unordered_set<int> visited;
    
    for (auto& [vertex, _] : graph) {
        distances[vertex] = INT_MAX;
    }
    distances[start] = 0;
    pq.push({0, start});
    
    while (!pq.empty()) {
        auto [dist, current] = pq.top();
        pq.pop();
        
        if (visited.count(current)) continue;
        visited.insert(current);
        
        for (auto& [neighbor, weight] : graph[current]) {
            int distance = dist + weight;
            
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                pq.push({distance, neighbor});
            }
        }
    }
    
    return distances;
}`,
    },
  },
};

export function getCodeByLanguage(
  algorithm: { code?: Record<ProgrammingLanguage, string> },
  language: ProgrammingLanguage
): string {
  return algorithm.code?.[language] ?? "";
}

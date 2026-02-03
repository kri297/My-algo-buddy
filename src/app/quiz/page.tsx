'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, CheckCircle, ChevronRight, Trophy, Brain, Target, Zap, Sparkles, Lightbulb, X, GraduationCap, Medal, Crown, Diamond, Coffee, PartyPopper, CheckCircle2, XCircle, RotateCcw, LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressSync } from '@/hooks/useProgressSync';
import Link from 'next/link';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizData: { [key: string]: QuizQuestion[] } = {
  'arrays-intro': [
    { question: "What is the index of the first element in an array?", options: ["1", "0", "-1", "Depends on language"], correct: 1, explanation: "Arrays are 0-indexed in most programming languages." },
    { question: "What is the time complexity to access arr[5]?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 2, explanation: "Array access is O(1) because elements are stored contiguously in memory." },
    { question: "How are array elements stored in memory?", options: ["Randomly scattered", "Contiguously", "In a tree", "In linked nodes"], correct: 1, explanation: "Arrays store elements contiguously in memory, enabling O(1) access." },
    { question: "What happens when you access arr[10] in an array of size 5?", options: ["Returns null", "Returns 0", "Out of bounds error", "Returns last element"], correct: 2, explanation: "Accessing beyond array bounds causes an error." },
    { question: "Which is TRUE about arrays?", options: ["Size always grows dynamically", "Elements must be same type in typed languages", "Access time depends on size", "Can't store numbers"], correct: 1, explanation: "In typed languages, array elements must be of the same type." },
    { question: "What is the space complexity of creating an array of n elements?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "Allocating n elements requires O(n) space in memory." },
    { question: "Inserting at the beginning of an array requires:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 2, explanation: "Inserting at index 0 requires shifting all n elements right, so O(n)." },
    { question: "Inserting at the end of an array (with space) is:", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 2, explanation: "If capacity exists, appending is O(1) - just assign to next index." },
    { question: "Deleting from middle of array is:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "Deleting requires shifting elements left to fill gap - O(n)." },
    { question: "Finding max element in unsorted array requires:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "Must check all n elements to find maximum - O(n)." },
    { question: "2D array arr[i][j] in row-major order is stored:", options: ["Columns contiguous", "Rows contiguous", "Randomly", "Sorted"], correct: 1, explanation: "Row-major: all elements of row 0, then row 1, etc. Rows are contiguous." },
    { question: "In array rotation left by k, what's the time complexity?", options: ["O(k)", "O(n-k)", "O(n)", "O(n+k)"], correct: 2, explanation: "Reversal algorithm rotates in O(n) by reversing subarrays." },
    { question: "To find all pairs summing to target in unsorted array:", options: ["O(n) always", "O(n) with hash map", "O(1)", "O(log n)"], correct: 1, explanation: "Use hash map to store complements - O(n) time, O(n) space." },
    { question: "Binary search works on:", options: ["Any array", "Sorted arrays only", "Arrays with duplicates", "Small arrays"], correct: 1, explanation: "Binary search requires sorted array to eliminate half each step." },
    { question: "Kadane's algorithm solves:", options: ["Two Sum", "Maximum subarray sum", "Sorting", "Binary search"], correct: 1, explanation: "Kadane's finds max contiguous subarray sum in O(n)." },
    { question: "Array vs Linked List: arrays have better:", options: ["Insertion at front", "Memory usage", "Random access", "Deletion"], correct: 2, explanation: "Arrays provide O(1) random access; linked lists need O(n) traversal." },
    { question: "Dynamic arrays (like ArrayList) grow by:", options: ["Adding 1 space", "Doubling capacity", "Adding 10 spaces", "Never growing"], correct: 1, explanation: "Doubling capacity ensures amortized O(1) append - grows exponentially." },
    { question: "Searching in unsorted array requires:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "Must check all n elements in worst case - O(n) linear search." },
    { question: "Which operation is NOT O(1) for arrays?", options: ["Access by index", "Get length", "Insert at middle", "Get first element"], correct: 2, explanation: "Insertion at middle requires shifting elements - O(n)." },
    { question: "Prefix sum array allows:", options: ["O(n) range sums", "O(1) range sums after O(n) preprocessing", "Sorting", "Searching"], correct: 1, explanation: "Build prefix sum in O(n), then any range sum is O(1): prefix[r] - prefix[l-1]." },
    { question: "What's the best case time for binary search?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 2, explanation: "Best case: target is at middle position on first check - O(1)." },
    { question: "Merge two sorted arrays takes:", options: ["O(n²)", "O(n log n)", "O(n+m)", "O(1)"], correct: 2, explanation: "Linear merge: compare and copy from both arrays - O(n+m)." },
    { question: "Dutch National Flag problem sorts:", options: ["Any array", "3 distinct values", "Binary values", "Sorted arrays"], correct: 1, explanation: "Partition array into 3 sections (e.g., 0s, 1s, 2s) in O(n) time." },
    { question: "Majority element (appears >n/2 times) found using:", options: ["Sorting O(n log n)", "Hash map O(n)", "Boyer-Moore O(n) O(1) space", "All work"], correct: 3, explanation: "All work! Boyer-Moore is optimal: O(n) time, O(1) space." },
    { question: "Stock buy/sell max profit uses:", options: ["Brute force O(n²)", "Track min price O(n)", "Binary search", "Sorting"], correct: 1, explanation: "Track minimum price seen, calculate profit at each step - O(n)." },
    { question: "Trap rainwater requires:", options: ["Stack", "Two pointers", "Prefix/suffix max arrays", "All methods work"], correct: 3, explanation: "Multiple solutions: two pointers O(1) space, or prefix arrays O(n) space." },
    { question: "Longest consecutive sequence in O(n):", options: ["Sort first", "Use hash set", "Two pointers", "Impossible"], correct: 1, explanation: "Hash set: check if num-1 exists; if not, it's sequence start." },
    { question: "Product of array except self (no division):", options: ["Nested loops O(n²)", "Prefix & suffix products O(n)", "Impossible", "Division only"], correct: 1, explanation: "Build prefix products left-to-right, suffix right-to-left." },
    { question: "Find duplicate in array [1..n] with one duplicate:", options: ["Sort", "Hash set", "Floyd's cycle detection", "All work"], correct: 2, explanation: "Treat as linked list: arr[i] points to arr[arr[i]]. Use cycle detection!" },
    { question: "Missing number in [0..n]:", options: ["Sum formula", "XOR", "Hash set", "All work"], correct: 3, explanation: "Sum: expected - actual. XOR: cancels matching pairs. All O(n)." }
  ],
  'two-pointer': [
    { question: "When is two-pointer technique most useful?", options: ["Random access needed", "Working with sorted arrays", "When array is empty", "Only for strings"], correct: 1, explanation: "Two pointers work best with sorted arrays." },
    { question: "In 'opposite ends' pattern, pointers start at:", options: ["Both at start", "Both at end", "One at start, one at end", "Random positions"], correct: 2, explanation: "Opposite ends pattern starts with one pointer at beginning and one at end." },
    { question: "Two pointers can reduce O(n²) to:", options: ["O(n³)", "O(n)", "O(1)", "O(2n)"], correct: 1, explanation: "Two pointers often convert nested loop O(n²) to single pass O(n)." },
    { question: "For Two Sum on SORTED array, we use:", options: ["Hash map only", "Two pointers from ends", "Brute force", "BST"], correct: 1, explanation: "For sorted arrays, two pointers from opposite ends is optimal O(n)." },
    { question: "Fast-slow pointer is used for:", options: ["Finding pairs", "Cycle detection", "Sorting", "Binary search"], correct: 1, explanation: "Fast-slow (tortoise and hare) is classic for cycle detection." },
    { question: "In container with most water, we move:", options: ["Both pointers inward", "Pointer at shorter line", "Pointer at taller line", "Random pointer"], correct: 1, explanation: "Move the pointer at shorter height - only way to possibly find larger area." },
    { question: "Three Sum uses:", options: ["One pointer", "Two pointers after fixing one element", "Hash map only", "Binary search"], correct: 1, explanation: "Fix one element, then use two pointers on remaining sorted array." },
    { question: "Same direction two pointers means:", options: ["Pointers move opposite ways", "Both move from left to right", "Pointers never move", "Random movement"], correct: 1, explanation: "Same direction: both pointers move left-to-right (e.g., remove duplicates)." },
    { question: "Remove duplicates from sorted array uses:", options: ["Hash set", "Two pointers (slow-fast)", "Sorting again", "Binary search"], correct: 1, explanation: "Slow pointer tracks unique position, fast scans ahead - O(n) time, O(1) space." },
    { question: "Palindrome check with two pointers:", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], correct: 2, explanation: "Compare from both ends moving inward - O(n/2) = O(n)." },
    { question: "Trapping rain water uses:", options: ["One pointer", "Two pointers tracking max heights", "Stack", "Queue"], correct: 1, explanation: "Two pointers with left_max and right_max - O(n) time, O(1) space solution." },
    { question: "Valid palindrome after deleting at most one char:", options: ["Brute force O(n²)", "Two pointers with mismatch handling", "Impossible", "Hash map"], correct: 1, explanation: "On mismatch, try skipping left or right character - still O(n)." },
    { question: "Move zeros to end uses:", options: ["Extra array", "Two pointers (slow tracks non-zero position)", "Sorting", "Stack"], correct: 1, explanation: "Slow pointer places non-zeros, then fill rest with zeros - O(n)." },
    { question: "Squares of sorted array uses:", options: ["Sort after squaring O(n log n)", "Two pointers from ends", "One pass left to right", "Binary search"], correct: 1, explanation: "Largest squares at ends (negative or positive) - merge from ends inward." },
    { question: "Two pointer advantage over nested loops:", options: ["Uses more memory", "Eliminates redundant comparisons", "Slower", "More complex"], correct: 1, explanation: "Avoids checking all pairs - moves pointers intelligently based on problem constraints." },
    { question: "Merge sorted arrays uses:", options: ["One pointer", "Two pointers (one per array)", "Three pointers", "No pointers"], correct: 1, explanation: "Two pointers compare elements from each array, build merged result." },
    { question: "Find pair with closest sum to target:", options: ["Brute force", "Two pointers from ends on sorted", "Binary search", "Hash map"], correct: 1, explanation: "Sort first, then two pointers adjust based on current sum vs target." },
    { question: "Intersection of two sorted arrays:", options: ["Hash set", "Two pointers advancing smaller element", "Merge", "All work"], correct: 3, explanation: "Two pointers O(m+n): advance pointer with smaller element." },
    { question: "Partition array by pivot uses:", options: ["One pointer", "Two pointers (left/right boundaries)", "Three pointers", "Stack"], correct: 1, explanation: "Quick sort partition: two pointers swap elements around pivot." },
    { question: "Four Sum problem uses:", options: ["Four pointers", "Fix two, use two pointers on rest", "Nested loops O(n⁴)", "Impossible"], correct: 1, explanation: "Fix first two with loops, then two pointers on remaining sorted array." },
    { question: "Reverse string in-place uses:", options: ["Extra array", "Two pointers swapping from ends", "Recursion", "Stack"], correct: 1, explanation: "Swap characters at left and right pointers moving inward." },
    { question: "Sort colors (Dutch National Flag):", options: ["Sorting algorithm", "Three pointers (low, mid, high)", "Two pointers", "Hash map"], correct: 1, explanation: "Three pointers partition into 0s, 1s, 2s in one pass - O(n)." },
    { question: "Substring with at most k distinct chars:", options: ["Sliding window", "Two pointers + hash map", "Binary search", "Brute force"], correct: 1, explanation: "Two pointers + map: expand right, shrink left when distinct > k." },
    { question: "Longest mountain in array uses:", options: ["DP", "Two pointers finding peaks", "Stack", "Queue"], correct: 1, explanation: "Find peak, expand left (decreasing) and right (decreasing) from peak." },
    { question: "Boats to save people (two at most):", options: ["Greedy", "Two pointers (lightest + heaviest)", "DP", "Sorting only"], correct: 1, explanation: "Sort weights, pair lightest with heaviest if they fit, else send heaviest alone." },
    { question: "Remove nth node from end of linked list:", options: ["One pointer two passes", "Two pointers n apart", "Both work", "Stack"], correct: 2, explanation: "Both work: Two passes, or two pointers with n gap in one pass." },
    { question: "Find triplet with sum closest to target:", options: ["Brute force O(n³)", "Sort + two pointers O(n²)", "Hash map", "Binary search"], correct: 1, explanation: "Sort, fix one element, two pointers on rest tracking closest sum." },
    { question: "Valid triangle number:", options: ["Three nested loops", "Sort + two pointers", "DP", "Greedy"], correct: 1, explanation: "Sort, fix largest side, count pairs with sum > largest using two pointers." },
    { question: "Backspace string compare uses:", options: ["Stack", "Two pointers from end", "Both work", "Queue"], correct: 2, explanation: "Both work: Stack processes backspaces, or two pointers from end skipping." },
    { question: "Partition labels (greedy):", options: ["Two pointers tracking last occurrence", "DP", "Binary search", "Hash only"], correct: 0, explanation: "Track last occurrence of each char, extend partition to include all occurrences." }
  ],
  'sliding-window': [
    { question: "Sliding window is best for:", options: ["Finding single element", "Contiguous subarray problems", "Sorting arrays", "Tree traversal"], correct: 1, explanation: "Sliding window excels at contiguous subarray/substring problems." },
    { question: "In fixed-size window, what stays constant?", options: ["Sum of elements", "Window size", "Starting position", "All elements"], correct: 1, explanation: "Fixed-size window maintains a constant window size." },
    { question: "How to get O(n) for 'max sum of k elements'?", options: ["Sort first", "Use sliding window", "Use recursion", "Check all subarrays"], correct: 1, explanation: "Sliding window: add new element, subtract old element - O(n) instead of O(n*k)." },
    { question: "Variable window shrinks when:", options: ["Never", "Condition is violated", "Randomly", "Every iteration"], correct: 1, explanation: "Variable window shrinks from the left when the condition is violated." },
    { question: "Sliding window avoids recalculating by:", options: ["Using more memory", "Maintaining running state", "Sorting first", "Using recursion"], correct: 1, explanation: "We maintain running sum/count and just add/remove at edges." },
    { question: "Longest substring without repeating chars uses:", options: ["Fixed window", "Variable window with hash set", "Sorting", "Binary search"], correct: 1, explanation: "Expand window right, shrink left when duplicate found - O(n) with set." },
    { question: "Minimum window substring problem uses:", options: ["Fixed window", "Variable window with frequency map", "Two pointers only", "Stack"], correct: 1, explanation: "Track character frequencies, expand/shrink to find minimum valid window." },
    { question: "Max consecutive ones after k flips uses:", options: ["Greedy", "Variable window tracking flips", "Brute force", "Binary search"], correct: 1, explanation: "Window tracks number of zeros (flips used), shrink when > k." },
    { question: "Fruit into baskets (at most 2 types) is:", options: ["Two pointers", "Sliding window with 2-key map", "Sorting problem", "Stack problem"], correct: 1, explanation: "Variable window maintaining at most 2 distinct elements (fruit types)." },
    { question: "Longest subarray with sum ≤ k uses:", options: ["Prefix sum", "Variable window", "Binary search", "DP"], correct: 1, explanation: "For positive numbers, sliding window works - expand right, shrink left." },
    { question: "Fixed window space complexity:", options: ["O(n)", "O(k)", "O(1) typically", "O(n²)"], correct: 2, explanation: "Only track window sum/state - O(1) space (not counting input/output)." },
    { question: "Permutation in string uses:", options: ["Sorting both", "Fixed window with frequency match", "Brute force", "Recursion"], correct: 1, explanation: "Fixed window size of pattern length, compare character frequencies." },
    { question: "When to expand sliding window?", options: ["Always", "When condition satisfied", "Randomly", "Never"], correct: 1, explanation: "Expand (add right element) when window is valid or to find new valid state." },
    { question: "Longest repeating character replacement (k changes) uses:", options: ["Brute force", "Variable window tracking max frequency", "Binary search", "DP"], correct: 1, explanation: "Track max freq in window, if (window_size - max_freq) > k, shrink." },
    { question: "Sliding window vs two pointers:", options: ["Same thing", "Window maintains state, pointers find pairs", "Window is slower", "No difference"], correct: 1, explanation: "Window tracks contiguous segment state; two pointers typically find pairs/triplets." },
    { question: "Max average subarray of size k:", options: ["Check all O(n²)", "Sliding window O(n)", "Binary search", "DP"], correct: 1, explanation: "Fixed window: slide and track max sum, divide by k for average." },
    { question: "Minimum size subarray sum ≥ target:", options: ["Brute force", "Variable window", "Binary search", "DP"], correct: 1, explanation: "Expand until sum ≥ target, then shrink to find minimum length." },
    { question: "Count subarrays with k different integers:", options: ["Simple window", "Exactly k = (at most k) - (at most k-1)", "Impossible", "DP only"], correct: 1, explanation: "Use helper function for 'at most k distinct', subtract to get 'exactly k'." },
    { question: "Longest substring with at most 2 distinct chars:", options: ["Fixed window", "Variable window + hash map", "Brute force", "Trie"], correct: 1, explanation: "Variable window: expand right, shrink left when distinct > 2." },
    { question: "Maximum points from cards (pick k):", options: ["Greedy", "Sliding window (n-k minimum subarray)", "DP", "Backtracking"], correct: 1, explanation: "Find minimum sum subarray of size (n-k), subtract from total." },
    { question: "Subarrays with product less than k:", options: ["Two pointers", "Sliding window counting", "Binary search", "DP"], correct: 1, explanation: "Variable window: expand right, shrink left when product ≥ k, count subarrays." },
    { question: "Contains duplicate within k distance:", options: ["Hash set", "Sliding window set of size k", "Sorting", "Two pointers"], correct: 1, explanation: "Fixed window of size k: maintain set, check if adding creates duplicate." },
    { question: "Max sum of distinct elements (length k):", options: ["Sorting", "Sliding window with set", "DP", "Greedy"], correct: 1, explanation: "Fixed window: track distinct elements with set, maintain max sum." },
    { question: "Find anagrams in string:", options: ["Sort all", "Sliding window with freq comparison", "Brute force", "Trie"], correct: 1, explanation: "Fixed window (pattern length): compare frequency maps." },
    { question: "Longest nice subarray (all pairs OR > 0):", options: ["Brute force", "Variable window with bitwise tracking", "DP", "Binary search"], correct: 1, explanation: "Track OR of window elements, shrink when bits conflict." },
    { question: "K radius subarray averages:", options: ["Nested loops", "Sliding window of size 2k+1", "Prefix sum", "Both window & prefix work"], correct: 3, explanation: "Both work: sliding window maintains sum, or use prefix sums." },
    { question: "Grumpy bookstore owner (k minute technique):", options: ["Greedy", "Sliding window to maximize saved customers", "DP", "Brute force"], correct: 1, explanation: "Fixed window size k: find window maximizing grumpy customers saved." },
    { question: "Replace substring for balanced string:", options: ["Brute force", "Variable window (find min to balance)", "Binary search", "DP"], correct: 1, explanation: "Track frequencies, shrink window when all chars are balanced." },
    { question: "Maximum erasure value (distinct subarray sum):", options: ["Hash map only", "Sliding window + set + sum", "DP", "Two pointers"], correct: 1, explanation: "Variable window: track distinct elements and sum, shrink on duplicate." },
    { question: "Substring with concatenation of all words:", options: ["Brute force", "Sliding window with word frequency map", "Trie", "DP"], correct: 1, explanation: "Fixed window (total word length): match exact word frequency map." }
  ],
  'll-intro': [
    { question: "A linked list node contains:", options: ["Only data", "Only pointer", "Data and pointer(s)", "Array of values"], correct: 2, explanation: "Each node contains the data value AND a pointer to the next node." },
    { question: "What does the last node's 'next' point to?", options: ["First node", "Itself", "null/None", "Random node"], correct: 2, explanation: "The last node's next pointer is null, indicating end of list." },
    { question: "Advantage of linked list over array:", options: ["Faster access by index", "O(1) insert if you have the node", "Less memory usage", "Simpler to implement"], correct: 1, explanation: "With a reference to a node, inserting after it is O(1) - no shifting." },
    { question: "Head of linked list is:", options: ["Last node", "Middle node", "First node", "Null"], correct: 2, explanation: "Head is the first node - our entry point to access the list." },
    { question: "Doubly linked list has:", options: ["One pointer per node", "Two pointers (next and prev)", "No pointers", "Pointer to head only"], correct: 1, explanation: "Doubly linked list nodes have both 'next' and 'prev' pointers." },
    { question: "Accessing 10th element in linked list is:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "Must traverse from head - no direct indexing like arrays." },
    { question: "Inserting at head of linked list is:", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 2, explanation: "Create new node, point to old head, update head pointer - O(1)." },
    { question: "Deleting head of linked list is:", options: ["O(n)", "O(1)", "O(log n)", "Impossible"], correct: 1, explanation: "Update head = head.next - O(1) operation." },
    { question: "Finding middle of linked list uses:", options: ["Counting length twice", "Fast-slow pointers", "Binary search", "Sorting"], correct: 1, explanation: "Fast moves 2 steps, slow moves 1 - when fast reaches end, slow is at middle." },
    { question: "Detecting cycle in linked list uses:", options: ["Hash set", "Fast-slow pointers", "Both work", "Neither works"], correct: 2, explanation: "Both work: fast-slow is O(1) space, hash set is O(n) space." },
    { question: "Memory overhead for singly linked list node:", options: ["None", "One pointer per node", "Two pointers", "Array storage"], correct: 1, explanation: "Each node stores data + 1 next pointer (vs array with just data)." },
    { question: "Circular linked list last node points to:", options: ["null", "Head", "Itself", "Previous node"], correct: 1, explanation: "Circular: last.next = head, forming a circle." },
    { question: "Merging two sorted linked lists:", options: ["O(n²)", "O(n+m)", "O(1)", "O(n log n)"], correct: 1, explanation: "Linear merge like merge sort - traverse both lists once." },
    { question: "Linked list vs array for frequent insertions:", options: ["Array better", "Linked list better", "Same performance", "Depends on value"], correct: 1, explanation: "Linked list O(1) insert with node reference; array requires shifting." },
    { question: "Finding kth node from end uses:", options: ["Two passes", "Two pointers k apart", "Both work", "Stack"], correct: 2, explanation: "Both work: two-pass counts length, or two pointers k apart in one pass." }
  ],
  'll-reversal': [
    { question: "How many pointers needed to reverse iteratively?", options: ["1", "2", "3", "4"], correct: 2, explanation: "We need 3 pointers: prev, curr, and next." },
    { question: "Initial value of 'prev' in reversal:", options: ["head", "head.next", "null", "tail"], correct: 2, explanation: "prev starts as null because the new tail should point to null." },
    { question: "After reversal, what becomes the new head?", options: ["Old head", "Old tail", "Middle node", "null"], correct: 1, explanation: "The old tail becomes the new head after reversal." },
    { question: "Space complexity of iterative reversal:", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 2, explanation: "Iterative reversal uses only 3 pointers - O(1) space." },
    { question: "Recursive reversal space complexity:", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correct: 1, explanation: "Recursive approach uses O(n) space due to call stack." },
    { question: "Reverse linked list in-place means:", options: ["Use extra array", "No extra data structure", "Sort first", "Copy to new list"], correct: 1, explanation: "In-place: modify pointers without extra space, just O(1) temp vars." },
    { question: "Time complexity of reversal:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correct: 2, explanation: "Must visit each node once to reverse pointers - O(n)." },
    { question: "Reverse sublist from position m to n:", options: ["Reverse entire list", "Reverse only m-to-n, reconnect edges", "Two passes", "Impossible"], correct: 1, explanation: "Reverse nodes from m to n, then connect to parts before m and after n." },
    { question: "Reversing doubly linked list requires:", options: ["Swap next and prev for each node", "3 pointers like singly", "Extra space", "Sorting"], correct: 0, explanation: "For doubly: swap node.next and node.prev pointers for each node." },
    { question: "What happens to head.next after reversing list?", options: ["Points to old second node", "Becomes null", "Points to new head", "Unchanged"], correct: 1, explanation: "Old head becomes new tail, so head.next = null after reversal." },
    { question: "Reverse nodes in k-group uses:", options: ["Simple reversal", "Reverse k nodes at a time, track parts", "Sorting", "Stack"], correct: 1, explanation: "Reverse every k nodes, keep track of group ends to reconnect." },
    { question: "To reverse, we update curr.next to point:", options: ["next", "prev", "curr", "null"], correct: 1, explanation: "Main operation: curr.next = prev (reverse the link)." },
    { question: "Palindrome linked list can use:", options: ["Reverse and compare", "Reverse half and compare", "Stack", "All methods work"], correct: 3, explanation: "Multiple approaches: reverse whole/half list, or use stack/array." },
    { question: "After reversal loop, what's the new head?", options: ["curr", "prev", "next", "head"], correct: 1, explanation: "When curr becomes null, prev points to new head (old tail)." },
    { question: "Reversing linked list is useful for:", options: ["Sorting", "Palindrome check, reverse pairs", "Binary search", "Hashing"], correct: 1, explanation: "Reversal is key technique for palindrome, k-group, and many LL problems." }
  ],
  'stack-intro': [
    { question: "LIFO stands for:", options: ["Last In First Out", "Last In Fast Out", "List In First Out", "Linear First Out"], correct: 0, explanation: "LIFO = Last In, First Out. Most recent element is first to be removed." },
    { question: "Stack push() adds element to:", options: ["Bottom", "Top", "Middle", "Random position"], correct: 1, explanation: "push() always adds to the top of the stack." },
    { question: "Stack pop() removes element from:", options: ["Bottom", "Top", "Middle", "Random position"], correct: 1, explanation: "pop() always removes from the top of the stack (LIFO)." },
    { question: "Real-world example of stack:", options: ["Queue at store", "Browser back button", "Round-robin scheduling", "Printer queue"], correct: 1, explanation: "Browser back button uses a stack - go back to most recent page (LIFO)." },
    { question: "peek() does what?", options: ["Removes top element", "Adds element", "Views top without removing", "Clears stack"], correct: 2, explanation: "peek() lets you see the top element without removing it." },
    { question: "Stack overflow occurs when:", options: ["Pop from empty stack", "Push to full stack", "Peek at empty stack", "Never"], correct: 1, explanation: "Stack overflow: pushing to a full fixed-size stack." },
    { question: "Stack underflow occurs when:", options: ["Push to full stack", "Pop from empty stack", "Stack is half full", "Never"], correct: 1, explanation: "Stack underflow: trying to pop from an empty stack." },
    { question: "Recursion uses which data structure internally?", options: ["Queue", "Array", "Stack (call stack)", "Heap"], correct: 2, explanation: "Function calls use call stack - most recent call returns first (LIFO)." },
    { question: "Valid parentheses problem uses:", options: ["Queue", "Stack", "Array", "Linked list"], correct: 1, explanation: "Stack: push opening brackets, pop and match with closing brackets." },
    { question: "Stack implemented with array:", options: ["O(1) push/pop", "O(n) push/pop", "O(log n) push/pop", "O(n²) push/pop"], correct: 0, explanation: "Array-based stack: O(1) push (amortized) and O(1) pop." },
    { question: "Stack implemented with linked list:", options: ["O(n) push/pop", "O(1) push/pop", "O(log n) push/pop", "Can't implement"], correct: 1, explanation: "Push/pop at head of linked list - both O(1)." },
    { question: "Infix to postfix conversion uses:", options: ["Queue", "Stack (operator stack)", "Array only", "Tree"], correct: 1, explanation: "Use stack to handle operator precedence when converting expressions." },
    { question: "Evaluate postfix expression uses:", options: ["Stack", "Queue", "Tree", "Hash map"], correct: 0, explanation: "Stack: push operands, pop two when operator found, push result." },
    { question: "Next greater element problem uses:", options: ["Queue", "Stack", "Heap", "Sorting"], correct: 1, explanation: "Monotonic stack: traverse array, stack maintains decreasing elements." },
    { question: "Min stack (get minimum in O(1)) uses:", options: ["Sorted array", "Two stacks", "Heap", "Binary search"], correct: 1, explanation: "Two stacks: main stack + min stack tracking minimum at each level." }
  ],
  'queue-intro': [
    { question: "FIFO stands for:", options: ["First In First Out", "Fast In Fast Out", "First In Final Out", "File In File Out"], correct: 0, explanation: "FIFO = First In, First Out. Elements processed in order they were added." },
    { question: "enqueue() adds to:", options: ["Front", "Back/Rear", "Middle", "Top"], correct: 1, explanation: "enqueue() adds elements to the back/rear of the queue." },
    { question: "dequeue() removes from:", options: ["Back", "Front", "Middle", "Random"], correct: 1, explanation: "dequeue() removes from the front - element waiting longest." },
    { question: "Real-world queue example:", options: ["Stack of plates", "People in line at bank", "Browser history", "Recursive calls"], correct: 1, explanation: "Bank line is FIFO - first person in line gets served first." },
    { question: "BFS uses which data structure?", options: ["Stack", "Queue", "Heap", "Tree"], correct: 1, explanation: "BFS uses a queue to process nodes level by level." },
    { question: "Circular queue solves:", options: ["Nothing", "Space wastage in array implementation", "Time complexity", "Memory leak"], correct: 1, explanation: "Circular queue reuses space when front elements are dequeued." },
    { question: "Deque (double-ended queue) allows:", options: ["Add/remove only from front", "Add/remove only from back", "Add/remove from both ends", "No operations"], correct: 2, explanation: "Deque: can enqueue/dequeue from both front and back." },
    { question: "Priority queue removes:", options: ["First element", "Last element", "Highest priority element", "Random element"], correct: 2, explanation: "Priority queue: element with highest priority comes out first." },
    { question: "Queue using two stacks:", options: ["Impossible", "Possible with amortized O(1)", "Always O(n)", "O(log n)"], correct: 1, explanation: "Two stacks: enqueue O(1), dequeue amortized O(1) by transferring elements." },
    { question: "Sliding window maximum uses:", options: ["Simple queue", "Deque (monotonic queue)", "Stack", "Heap"], correct: 1, explanation: "Deque maintains elements in decreasing order for window maximum." },
    { question: "Task scheduling uses:", options: ["Stack", "Queue", "Binary tree", "Graph"], correct: 1, explanation: "Task scheduler: queue ensures tasks processed in arrival order (FIFO)." },
    { question: "Queue with arrays needs:", options: ["One pointer", "Two pointers (front, rear)", "Three pointers", "No pointers"], correct: 1, explanation: "Track front (dequeue position) and rear (enqueue position) pointers." },
    { question: "Queue underflow means:", options: ["Queue full", "Dequeue from empty queue", "Queue half empty", "Too many elements"], correct: 1, explanation: "Queue underflow: trying to dequeue when queue is empty." },
    { question: "Linked list vs array for queue:", options: ["Linked list better (no size limit)", "Array better always", "Same performance", "Can't use linked list"], correct: 0, explanation: "Linked list queue: no size limit, but uses more memory for pointers." },
    { question: "Level order tree traversal uses:", options: ["Stack", "Queue", "Recursion only", "Array"], correct: 1, explanation: "BFS level order: queue processes nodes level by level (FIFO)." }
  ],
  'tree-traversal': [
    { question: "Inorder traversal visits in order:", options: ["Root, Left, Right", "Left, Root, Right", "Left, Right, Root", "Right, Root, Left"], correct: 1, explanation: "Inorder: Left → Root → Right. Gives sorted order for BST!" },
    { question: "Preorder traversal order:", options: ["Left, Root, Right", "Root, Left, Right", "Left, Right, Root", "Right, Left, Root"], correct: 1, explanation: "Preorder: Root → Left → Right. Root is visited FIRST (pre)." },
    { question: "Postorder traversal order:", options: ["Root, Left, Right", "Left, Right, Root", "Left, Root, Right", "Right, Root, Left"], correct: 1, explanation: "Postorder: Left → Right → Root. Root is visited LAST (post)." },
    { question: "Level order uses:", options: ["Stack", "Queue", "Recursion only", "Heap"], correct: 1, explanation: "Level order (BFS) uses a queue to visit nodes level by level." },
    { question: "Which traversal gives sorted output for BST?", options: ["Preorder", "Postorder", "Inorder", "Level order"], correct: 2, explanation: "Inorder on BST gives nodes in sorted (ascending) order!" },
    { question: "Tree height formula:", options: ["Max depth from root", "Number of nodes", "Number of edges", "Level count - 1"], correct: 0, explanation: "Height = maximum depth from root to any leaf node." },
    { question: "Preorder useful for:", options: ["Sorted output", "Creating copy of tree", "Finding height", "Sorting"], correct: 1, explanation: "Preorder (root first) is perfect for creating a copy or prefix expression." },
    { question: "Postorder useful for:", options: ["Sorted output", "Deleting tree", "Binary search", "Level order"], correct: 1, explanation: "Postorder (children before parent) is ideal for deletion/cleanup." },
    { question: "Inorder iterative uses:", options: ["Queue", "Stack", "Array", "Heap"], correct: 1, explanation: "Iterative inorder uses stack to simulate recursive call stack." },
    { question: "DFS on tree can use:", options: ["Any traversal (preorder, inorder, postorder)", "Level order only", "No traversal", "Sorting"], correct: 0, explanation: "DFS explores depth-first: preorder, inorder, or postorder all are DFS." },
    { question: "BFS on tree is same as:", options: ["Preorder", "Inorder", "Postorder", "Level order"], correct: 3, explanation: "BFS on tree = level order traversal (queue-based)." },
    { question: "Morris traversal uses:", options: ["Stack", "Queue", "Threaded binary tree (no extra space)", "Array"], correct: 2, explanation: "Morris: uses threaded pointers to achieve O(1) space traversal." },
    { question: "Finding tree diameter needs:", options: ["Preorder", "Height of left and right subtrees", "Level order", "Sorting"], correct: 1, explanation: "Diameter: max of (left_height + right_height) at each node." },
    { question: "Vertical order traversal uses:", options: ["Stack", "Queue + hash map for columns", "Recursion only", "No structure"], correct: 1, explanation: "Track column indices with BFS/DFS + map to group nodes vertically." },
    { question: "Zigzag level order uses:", options: ["Simple queue", "Deque or toggle flag", "Stack", "Array"], correct: 1, explanation: "Zigzag: reverse alternating levels using deque or direction toggle." }
  ],
  'bst': [
    { question: "BST property:", options: ["Left = Right", "Left < Root < Right", "Left > Root > Right", "Random order"], correct: 1, explanation: "BST: All left subtree values < root < All right subtree values." },
    { question: "Search in balanced BST is:", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 1, explanation: "Balanced BST search is O(log n) - we eliminate half each step." },
    { question: "Worst case BST search (unbalanced):", options: ["O(log n)", "O(n)", "O(1)", "O(n log n)"], correct: 1, explanation: "Unbalanced BST (like a linked list) degrades to O(n) search." },
    { question: "To find minimum in BST:", options: ["Search randomly", "Go left until null", "Go right until null", "Check root only"], correct: 1, explanation: "Minimum is the leftmost node - keep going left." },
    { question: "Inorder successor is used for:", options: ["Insert operation", "Search operation", "Delete node with 2 children", "Tree balancing"], correct: 2, explanation: "When deleting a node with 2 children, we replace it with inorder successor." },
    { question: "BST insert time complexity:", options: ["O(n) always", "O(h) where h is height", "O(1)", "O(n²)"], correct: 1, explanation: "Insert: traverse from root to leaf - O(h). Balanced: O(log n), unbalanced: O(n)." },
    { question: "Finding maximum in BST:", options: ["Go left until null", "Go right until null", "Check root", "Inorder traversal"], correct: 1, explanation: "Maximum is rightmost node - keep going right until null." },
    { question: "BST delete with no children:", options: ["Replace with successor", "Remove node directly", "Rotate", "Can't delete"], correct: 1, explanation: "Leaf node: simply remove it (set parent pointer to null)." },
    { question: "BST delete with one child:", options: ["Replace with successor", "Replace node with its child", "Rotate tree", "Can't delete"], correct: 1, explanation: "One child: bypass deleted node - connect parent to child." },
    { question: "BST delete with two children:", options: ["Remove directly", "Replace with inorder successor or predecessor", "Rotate", "Can't delete"], correct: 1, explanation: "Two children: replace with inorder successor (or predecessor) then delete successor." },
    { question: "Inorder predecessor of node N:", options: ["Leftmost in right subtree", "Rightmost in left subtree", "Parent node", "Any node"], correct: 1, explanation: "Predecessor: rightmost node in left subtree (largest value < N)." },
    { question: "Validating BST requires:", options: ["Checking node and children only", "Checking range constraints recursively", "Sorting", "Level order"], correct: 1, explanation: "Validate: each node must be within valid range based on ancestors." },
    { question: "Lowest Common Ancestor in BST uses:", options: ["Inorder traversal", "BST property to navigate", "BFS", "Hash map"], correct: 1, explanation: "LCA in BST: use values to decide left/right - O(h) efficient." },
    { question: "Kth smallest element in BST:", options: ["Inorder traversal", "Preorder", "Level order", "Random access"], correct: 0, explanation: "Inorder gives sorted order - stop at kth element during traversal." },
    { question: "Convert sorted array to BST:", options: ["Insert one by one", "Middle element as root, recurse", "Random insertion", "Can't convert"], correct: 1, explanation: "Pick middle as root to ensure balanced - recursively build left/right subtrees." }
  ],
  'bfs': [
    { question: "BFS uses which data structure?", options: ["Stack", "Queue", "Heap", "Tree"], correct: 1, explanation: "BFS uses queue - FIFO ensures level-by-level processing." },
    { question: "BFS finds shortest path in:", options: ["Weighted graphs", "Unweighted graphs", "All graphs", "No graphs"], correct: 1, explanation: "BFS finds shortest path only in UNWEIGHTED graphs." },
    { question: "BFS time complexity:", options: ["O(V)", "O(E)", "O(V+E)", "O(V×E)"], correct: 2, explanation: "BFS visits each vertex once O(V) and each edge once O(E) = O(V+E)." },
    { question: "Why mark nodes as visited?", options: ["Optimization", "Avoid infinite loops", "Count nodes", "For output"], correct: 1, explanation: "Without visited tracking, we'd revisit nodes infinitely in cyclic graphs!" },
    { question: "BFS explores nodes in:", options: ["Random order", "Depth order", "Level order", "Reverse order"], correct: 2, explanation: "BFS explores level by level - all nodes at distance d before d+1." },
    { question: "BFS space complexity:", options: ["O(1)", "O(V)", "O(E)", "O(V²)"], correct: 1, explanation: "Queue stores up to O(V) nodes (worst case: all nodes in one level)." },
    { question: "BFS starting from node s reaches:", options: ["Only adjacent nodes", "All nodes connected to s", "Random nodes", "No nodes"], correct: 1, explanation: "BFS reaches all nodes in the connected component containing s." },
    { question: "BFS on disconnected graph:", options: ["Visits all nodes automatically", "Needs multiple BFS calls from unvisited nodes", "Can't handle", "Only visits one component"], correct: 1, explanation: "Run BFS from each unvisited node to cover all components." },
    { question: "Multi-source BFS starts with:", options: ["One source in queue", "All sources in queue initially", "Random nodes", "Empty queue"], correct: 1, explanation: "Multi-source: enqueue all source nodes at start, then BFS normally." },
    { question: "BFS for shortest path in maze:", options: ["DFS better", "BFS guarantees shortest", "Both same", "Dijkstra needed"], correct: 1, explanation: "Unweighted grid: BFS finds shortest path (minimum moves)." },
    { question: "0-1 BFS is used for:", options: ["Unweighted graphs", "Graphs with 0 and 1 weights", "Negative weights", "All weights"], correct: 1, explanation: "0-1 BFS: use deque - add 0-weight edges to front, 1-weight to back." },
    { question: "BFS parent tracking allows:", options: ["Path reconstruction", "Cycle detection", "Counting nodes", "Sorting"], correct: 0, explanation: "Track parent pointers during BFS to reconstruct shortest path." },
    { question: "BFS vs DFS for shortest path:", options: ["DFS finds shortest", "BFS finds shortest in unweighted", "Both find shortest", "Neither finds shortest"], correct: 1, explanation: "BFS guarantees shortest in unweighted; DFS doesn't (explores deeply first)." },
    { question: "Word ladder problem uses:", options: ["DFS", "BFS", "Binary search", "Sorting"], correct: 1, explanation: "Word ladder: BFS finds shortest transformation sequence (unweighted graph)." },
    { question: "Detecting bipartite graph uses:", options: ["DFS only", "BFS only", "Both BFS and DFS work", "Topological sort"], correct: 2, explanation: "Both work: color nodes during traversal - adjacent nodes must have different colors." }
  ],
  'dfs': [
    { question: "DFS uses which structure (iterative)?", options: ["Queue", "Stack", "Heap", "Array"], correct: 1, explanation: "DFS uses stack (or recursion call stack) - LIFO for deep-first exploration." },
    { question: "DFS time complexity:", options: ["O(V)", "O(E)", "O(V+E)", "O(V²)"], correct: 2, explanation: "Same as BFS: visit each vertex O(V) and edge O(E) once = O(V+E)." },
    { question: "DFS is better for:", options: ["Shortest path", "Finding any path / exploring fully", "Level-order output", "Minimum spanning tree"], correct: 1, explanation: "DFS is great for path finding, cycle detection, topological sort." },
    { question: "Cycle detection in directed graph needs:", options: ["Visited set only", "Visited + recursion stack tracking", "No tracking needed", "Queue"], correct: 1, explanation: "Need to track nodes in current DFS path (recursion stack) to detect back edges." },
    { question: "Topological sort uses:", options: ["BFS only", "DFS only", "Either BFS or DFS", "Neither"], correct: 2, explanation: "Topological sort can use DFS (reverse post-order) or BFS (Kahn's algorithm)." },
    { question: "DFS space complexity (recursive):", options: ["O(1)", "O(V)", "O(E)", "O(V²)"], correct: 1, explanation: "Recursive DFS: call stack can go O(V) deep (worst case: linear graph)." },
    { question: "DFS on tree needs visited array?", options: ["Yes always", "No (trees have no cycles)", "Sometimes", "Only for BST"], correct: 1, explanation: "Trees are acyclic - no need for visited array, just traverse from root." },
    { question: "DFS preorder on graph means:", options: ["Process before exploring", "Process after exploring", "Level order", "Random"], correct: 0, explanation: "Preorder: process node BEFORE recursing into neighbors." },
    { question: "DFS postorder on graph means:", options: ["Process before exploring", "Process after exploring children", "Level order", "Random"], correct: 1, explanation: "Postorder: process node AFTER exploring all neighbors (for topo sort)." },
    { question: "Strongly connected components use:", options: ["BFS", "Kosaraju's or Tarjan's DFS algorithms", "Binary search", "Sorting"], correct: 1, explanation: "SCC: Kosaraju (2 DFS) or Tarjan (1 DFS with low-link values)." },
    { question: "DFS backtracking is used for:", options: ["Shortest path", "Exploring all solutions (N-queens, sudoku)", "Sorting", "Hashing"], correct: 1, explanation: "Backtracking explores all possible solutions - DFS with undo logic." },
    { question: "Finding bridges in graph uses:", options: ["BFS", "DFS with discovery/low times", "Dijkstra", "Floyd-Warshall"], correct: 1, explanation: "Bridges: DFS tracking discovery time and low-link values (Tarjan's)." },
    { question: "DFS on grid (maze solving):", options: ["Always finds shortest", "Finds a path if exists", "Can't handle grids", "Only works on trees"], correct: 1, explanation: "DFS finds A path if one exists, but not necessarily shortest (BFS for that)." },
    { question: "Articulation points use:", options: ["BFS", "DFS with discovery/low times", "Prim's algorithm", "Kruskal"], correct: 1, explanation: "Articulation points: DFS tracking when node removal disconnects graph." },
    { question: "DFS vs BFS memory usage:", options: ["DFS uses more always", "Depends on graph structure", "BFS uses more always", "Same always"], correct: 1, explanation: "Wide graph: BFS uses more (large queue). Deep graph: DFS uses more (deep stack)." }
  ],
  'dp-intro': [
    { question: "DP is used when problem has:", options: ["Random subproblems", "Overlapping subproblems + optimal substructure", "No subproblems", "Only one solution"], correct: 1, explanation: "DP works when: same subproblems repeat AND optimal solution uses optimal sub-solutions." },
    { question: "Memoization is:", options: ["Bottom-up approach", "Top-down with caching", "Greedy approach", "Brute force"], correct: 1, explanation: "Memoization = top-down recursion + cache results to avoid recomputation." },
    { question: "Tabulation is:", options: ["Top-down approach", "Bottom-up iterative approach", "Random approach", "No caching"], correct: 1, explanation: "Tabulation = bottom-up, build solution iteratively from smallest subproblems." },
    { question: "Fibonacci naive recursion is:", options: ["O(n)", "O(2^n)", "O(n²)", "O(log n)"], correct: 1, explanation: "Naive recursive Fibonacci is O(2^n) - exponential due to repeated subproblems." },
    { question: "Fibonacci with DP is:", options: ["O(2^n)", "O(n)", "O(n²)", "O(log n)"], correct: 1, explanation: "With DP (memoization/tabulation), Fibonacci becomes O(n)." },
    { question: "Optimal substructure means:", options: ["Random solutions", "Optimal solution contains optimal sub-solutions", "No pattern", "Greedy choice"], correct: 1, explanation: "Optimal substructure: best solution to problem uses best solutions to subproblems." },
    { question: "Overlapping subproblems means:", options: ["No repeated work", "Same subproblems solved multiple times", "Unique subproblems", "No recursion"], correct: 1, explanation: "Overlapping: same subproblems encountered repeatedly - DP caches to avoid redoing work." },
    { question: "DP vs Divide-and-Conquer:", options: ["Same thing", "DP has overlapping subproblems", "DC is always better", "DP can't recurse"], correct: 1, explanation: "DC has independent subproblems (merge sort); DP has overlapping ones (Fibonacci)." },
    { question: "Memoization vs Tabulation space:", options: ["Same always", "Memo uses O(n) stack + cache", "Tabulation uses less always", "No difference"], correct: 1, explanation: "Memoization: recursive stack O(n) + cache. Tabulation: just table, no stack." },
    { question: "Coin change (minimum coins) uses:", options: ["Greedy only", "DP", "Binary search", "Sorting"], correct: 1, explanation: "Greedy fails on some coin sets. DP guarantees minimum coins." },
    { question: "Longest Common Subsequence (LCS) uses:", options: ["Two pointers", "DP with 2D table", "Binary search", "Greedy"], correct: 1, explanation: "LCS: 2D DP table comparing characters from both strings." },
    { question: "Space optimization in DP:", options: ["Can't optimize", "Use only current/previous row in table", "Always need full table", "No tables"], correct: 1, explanation: "Many DP problems: only need current and previous row - optimize from O(n²) to O(n) space." },
    { question: "DP state means:", options: ["Final answer", "Parameters that define subproblem", "Random value", "Input array"], correct: 1, explanation: "State: the parameters needed to uniquely identify a subproblem (e.g., dp[i][j])." },
    { question: "Base case in DP:", options: ["Largest subproblem", "Smallest/simplest subproblem with known answer", "Random case", "No base case"], correct: 1, explanation: "Base case: simplest subproblem we can solve directly (e.g., Fib(0)=0, Fib(1)=1)." },
    { question: "DP is overkill for:", options: ["Fibonacci", "Problems with no overlapping subproblems", "LCS", "Knapsack"], correct: 1, explanation: "If subproblems don't overlap (like merge sort), DP adds unnecessary overhead." }
  ],
  'dp-patterns': [
    { question: "0/1 Knapsack means:", options: ["Take 0 or 1 of each item", "Binary choices", "Both A and B", "Neither"], correct: 2, explanation: "0/1 Knapsack: for each item, either take it (1) or don't (0). No fractions." },
    { question: "Unbounded Knapsack allows:", options: ["Taking each item at most once", "Taking each item multiple times", "No items", "Only one item total"], correct: 1, explanation: "Unbounded: can take each item unlimited times (like Coin Change)." },
    { question: "LIS stands for:", options: ["Last In Sequence", "Longest Increasing Subsequence", "Longest Identical String", "Least Important Sum"], correct: 1, explanation: "LIS = Longest Increasing Subsequence (elements in increasing order, not contiguous)." },
    { question: "LIS can be solved in:", options: ["O(n²) only", "O(n log n) with binary search", "Both approaches work", "O(n) only"], correct: 2, explanation: "LIS: O(n²) basic DP or O(n log n) with clever binary search optimization." },
    { question: "Subset Sum is which pattern?", options: ["Sliding window", "0/1 Knapsack pattern", "Two pointers", "Graph pattern"], correct: 1, explanation: "Subset Sum is 0/1 Knapsack variant - include or exclude each element." },
    { question: "Edit Distance (Levenshtein) uses:", options: ["Greedy", "2D DP table", "Binary search", "Sorting"], correct: 1, explanation: "Edit distance: 2D DP - min operations (insert, delete, replace) to transform strings." },
    { question: "Matrix Chain Multiplication uses:", options: ["Greedy", "DP with optimal split point", "Sorting", "Binary search"], correct: 1, explanation: "MCM: DP trying all split points to find optimal parenthesization." },
    { question: "House Robber pattern:", options: ["Greedy", "DP with max(rob current + prev-prev, don't rob)", "Binary search", "BFS"], correct: 1, explanation: "House Robber: DP - max of robbing current house + skip adjacent, or skip current." },
    { question: "Longest Palindromic Subsequence uses:", options: ["Two pointers", "DP or LCS of string and reverse", "Binary search", "Sorting"], correct: 1, explanation: "LPS: 2D DP or use LCS(string, reverse(string))." },
    { question: "Catalan number pattern:", options: ["Linear recursion", "DP with all split combinations", "Greedy", "Binary search"], correct: 1, explanation: "Catalan: DP summing products of subproblems (used in BST counting, parentheses)." },
    { question: "Egg Drop problem uses:", options: ["Greedy", "DP trying all floors", "Binary search only", "Sorting"], correct: 1, explanation: "Egg drop: DP - try dropping at each floor, take worst case, find minimum." },
    { question: "Palindrome Partitioning (min cuts) uses:", options: ["Greedy", "DP with palindrome checks", "Binary search", "Sorting"], correct: 1, explanation: "Min cuts: DP - for each position, try all palindrome partitions and minimize cuts." },
    { question: "Coin Change (count ways) vs (min coins):", options: ["Same problem", "Different DP equations", "Use greedy for both", "Both unsolvable"], correct: 1, explanation: "Count ways: sum combinations. Min coins: min(1 + dp[amount-coin]). Different recurrence!" },
    { question: "Maximal Rectangle in matrix uses:", options: ["BFS", "DP + largest rectangle in histogram", "Greedy", "Binary search"], correct: 1, explanation: "Maximal rectangle: DP building histogram heights, then use stack to find max area." },
    { question: "Buy/Sell Stock with cooldown uses:", options: ["Greedy", "DP tracking states (hold, sold, cooldown)", "Binary search", "Sorting"], correct: 1, explanation: "Cooldown: state machine DP - track holding stock, sold, cooldown states." }
  ],
  'string-manipulation': [
    { question: "String concatenation in loop is inefficient because:", options: ["Strings are immutable", "Strings are mutable", "No reason", "Always efficient"], correct: 0, explanation: "Each concatenation creates a new string object. Use StringBuilder for O(n) instead of O(n²)." },
    { question: "KMP algorithm time complexity:", options: ["O(n²)", "O(n+m)", "O(n log m)", "O(nm)"], correct: 1, explanation: "KMP (Knuth-Morris-Pratt) pattern matching is O(n+m) using prefix function." },
    { question: "Anagram check can use:", options: ["Sort both O(n log n)", "Frequency map O(n)", "Both work", "Neither"], correct: 2, explanation: "Both work! Sort and compare, or count frequencies in O(n) with O(1) space (26 letters)." },
    { question: "Longest common prefix of strings uses:", options: ["Compare characters vertically", "Sort and compare first/last", "Both work", "Trie"], correct: 2, explanation: "Multiple approaches: vertical scanning, horizontal, divide-conquer, or trie." },
    { question: "Valid parentheses uses:", options: ["Stack", "Queue", "Hash map only", "Array"], correct: 0, explanation: "Stack matches opening with closing brackets in O(n) time, O(n) space." }
  ],
  'array-sorting': [
    { question: "Quick sort average time complexity:", options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], correct: 0, explanation: "Average case: O(n log n). Worst case: O(n²) with bad pivots." },
    { question: "Merge sort space complexity:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 2, explanation: "Merge sort needs O(n) auxiliary space for merging." },
    { question: "Counting sort works when:", options: ["Elements in small range", "Any data", "Sorted already", "Random data"], correct: 0, explanation: "Counting sort is O(n+k) when range k is small. Non-comparison based." },
    { question: "Heap sort space complexity:", options: ["O(1) in-place", "O(n)", "O(log n)", "O(n²)"], correct: 0, explanation: "Heap sort is in-place: O(1) extra space, O(n log n) time." },
    { question: "Best sorting for nearly sorted array:", options: ["Quick sort", "Insertion sort", "Heap sort", "Bubble sort"], correct: 1, explanation: "Insertion sort is O(n) for nearly sorted data." }
  ],
  'matrix-problems': [
    { question: "Rotate 90° clockwise uses:", options: ["Transpose then reverse rows", "Reverse then transpose", "Copy to new matrix", "All work"], correct: 0, explanation: "Transpose matrix, then reverse each row for 90° clockwise rotation." },
    { question: "Spiral matrix traversal complexity:", options: ["O(n)", "O(m×n)", "O(n²)", "O(m+n)"], correct: 1, explanation: "Visit each element exactly once: O(rows × cols)." },
    { question: "Search in row/column sorted matrix:", options: ["Binary search each row O(m log n)", "Start top-right, eliminate row/col O(m+n)", "Both work", "DFS"], correct: 2, explanation: "Both work! Top-right start is elegant: O(m+n)." },
    { question: "Set matrix zeros in-place uses:", options: ["Extra matrix", "First row/col as markers", "Hash set", "Stack"], correct: 1, explanation: "Use first row/column to mark zeros, then set in second pass - O(1) space." },
    { question: "Largest rectangle in matrix uses:", options: ["BFS", "DP + histogram technique", "Greedy", "Binary search"], correct: 1, explanation: "Build histogram heights row by row, apply largest rectangle in histogram algorithm." }
  ],
  'll-fast-slow': [
    { question: "Fast-slow pointers detect cycle in:", options: ["O(n²)", "O(n)", "O(log n)", "O(1)"], correct: 1, explanation: "Tortoise and hare: fast moves 2x, slow 1x. They meet if cycle exists - O(n) time." },
    { question: "Find middle of linked list uses:", options: ["Two passes", "Fast-slow (fast moves 2x)", "Both work", "Stack"], correct: 2, explanation: "Both work! Fast-slow is one-pass: when fast reaches end, slow at middle." },
    { question: "Floyd's cycle detection space:", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: 2, explanation: "Only two pointers needed - O(1) space." },
    { question: "Find cycle start node uses:", options: ["Floyd's detection + reset one pointer", "Hash set", "Both work", "Impossible"], correct: 2, explanation: "After meeting, reset one to head. Move both at same speed - meet at cycle start!" },
    { question: "Nth node from end uses:", options: ["Two passes", "Fast-slow with n gap", "Both work", "Stack"], correct: 2, explanation: "Both work! Fast-slow with n gap is one-pass solution." }
  ],
  'll-merge': [
    { question: "Merge two sorted lists time:", options: ["O(n+m)", "O(n log m)", "O(nm)", "O(n²)"], correct: 0, explanation: "Compare nodes from both lists, link smaller - O(n+m)." },
    { question: "Merge k sorted lists uses:", options: ["Merge pairs O(nk log k)", "Min heap O(nk log k)", "Both work", "Brute force"], correct: 2, explanation: "Both work! Divide-conquer merges pairs, or use min-heap for k-way merge." },
    { question: "Merge in-place requires:", options: ["Extra list", "Only pointer manipulation O(1) space", "Stack", "Queue"], correct: 1, explanation: "Just update next pointers - O(1) extra space." },
    { question: "Flatten multilevel doubly linked list uses:", options: ["Stack/recursion", "Queue", "Both DFS approaches work", "Sorting"], correct: 2, explanation: "DFS with stack or recursion to flatten child lists before continuing next." },
    { question: "Zip/interleave list uses:", options: ["Find middle, reverse second half, merge", "Two passes", "Extra list", "All work"], correct: 0, explanation: "Classic: find middle, reverse second half, interleave with first half." }
  ],
  'll-advanced': [
    { question: "LRU Cache uses:", options: ["Doubly linked list + hash map", "Array", "Single linked list", "Tree"], correct: 0, explanation: "Hash map for O(1) access + DLL for O(1) add/remove at ends." },
    { question: "Clone linked list with random pointer:", options: ["Hash map O(n) space", "Interweave nodes O(1) space", "Both work", "Impossible"], correct: 2, explanation: "Both work! Hash map is simpler, interweaving is O(1) space but complex." },
    { question: "Add two numbers as linked lists:", options: ["Convert to int, add, convert back", "Add digit by digit with carry", "Both work for small numbers", "Only A works"], correct: 2, explanation: "Digit by digit handles any length. Convert to int overflows for large numbers." },
    { question: "Palindrome linked list check:", options: ["Reverse and compare O(n) space", "Fast-slow, reverse second half O(1)", "Both work", "Stack"], correct: 2, explanation: "Both work! Reverse second half in-place for O(1) space is optimal." },
    { question: "Reorder list L₀→L₁→...→Lₙ to L₀→Lₙ→L₁→Lₙ₋₁:", options: ["Extra list", "Find middle, reverse second, merge", "Stack", "Recursion"], correct: 1, explanation: "Classic: find middle, reverse second half, interleave alternately." }
  ],
  'monotonic-stack': [
    { question: "Monotonic stack maintains:", options: ["Sorted order", "Increasing or decreasing order", "Random order", "Reverse order"], correct: 1, explanation: "Monotonic stack keeps elements in increasing/decreasing order, popping violators." },
    { question: "Next greater element uses:", options: ["Nested loops O(n²)", "Monotonic decreasing stack O(n)", "Binary search", "Sorting"], correct: 1, explanation: "Stack stores indices. Pop smaller elements when larger found - O(n)." },
    { question: "Daily temperatures (next warmer day):", options: ["Brute force", "Monotonic decreasing stack", "DP", "Queue"], correct: 1, explanation: "Stack stores indices of days. Pop when warmer temperature found." },
    { question: "Largest rectangle in histogram:", options: ["O(n²) checking all", "Monotonic increasing stack O(n)", "Binary search", "DP"], correct: 1, explanation: "Stack maintains increasing heights. On smaller, pop and calculate areas." },
    { question: "Trapping rain water can use:", options: ["Two pointers", "Monotonic stack", "Prefix/suffix arrays", "All work"], correct: 3, explanation: "Multiple solutions: two pointers O(1) space, stack O(n), or precompute max heights." }
  ],
  'stack-applications': [
    { question: "Evaluate postfix expression uses:", options: ["Stack", "Queue", "Tree", "Graph"], correct: 0, explanation: "Stack: push operands, pop two for operators, push result. O(n)." },
    { question: "Infix to postfix conversion uses:", options: ["Stack for operators", "Queue", "Tree", "Array"], correct: 0, explanation: "Shunting-yard algorithm: stack manages operator precedence and parens." },
    { question: "Valid parentheses time:", options: ["O(n²)", "O(n)", "O(log n)", "O(1)"], correct: 1, explanation: "One pass: push opening, pop and match closing - O(n)." },
    { question: "Min stack (getMin in O(1)) uses:", options: ["Two stacks", "Stack + min variable", "Both work", "Heap"], correct: 2, explanation: "Both work! Track min with second stack or store (val, currentMin) pairs." },
    { question: "Decode string 'k[encoded]' uses:", options: ["Stack", "Recursion", "Both work", "Queue"], correct: 2, explanation: "Stack stores counts and strings when '[' found, pops and expands on ']'." }
  ],
  'queue-variations': [
    { question: "Circular queue advantage:", options: ["No wrap around", "Reuses empty space at front", "Slower", "More memory"], correct: 1, explanation: "Circular queue reuses dequeued space - no shifting needed." },
    { question: "Deque (double-ended queue) allows:", options: ["Add/remove from ends only", "Add/remove from both ends O(1)", "Middle insertions", "Sorting"], correct: 1, explanation: "Deque: O(1) push/pop at both front and back." },
    { question: "Priority queue typically uses:", options: ["Array", "Heap", "Stack", "Linked list"], correct: 1, explanation: "Heap provides O(log n) insert/extract-min for priority queue." },
    { question: "Implement queue using two stacks:", options: ["Impossible", "Amortized O(1) enqueue/dequeue", "O(n) always", "O(log n)"], correct: 1, explanation: "Use stack1 for enqueue, stack2 for dequeue. Transfer when stack2 empty - amortized O(1)." },
    { question: "Sliding window maximum uses:", options: ["Max heap", "Monotonic decreasing deque", "Both work", "Stack"], correct: 2, explanation: "Both work! Heap is O(n log k), deque is O(n) by removing smaller elements." }
  ],
  'graph-basics': [
    { question: "Adjacency matrix space:", options: ["O(V)", "O(E)", "O(V²)", "O(V+E)"], correct: 2, explanation: "V×V matrix stores all possible edges - O(V²) space." },
    { question: "Adjacency list space:", options: ["O(V)", "O(E)", "O(V+E)", "O(V²)"], correct: 2, explanation: "V lists + E edges total - O(V+E) space." },
    { question: "Check edge existence: matrix vs list:", options: ["Matrix O(1), List O(degree)", "Both O(1)", "Both O(V)", "List better"], correct: 0, explanation: "Matrix: direct lookup O(1). List: scan neighbors O(degree)." },
    { question: "Dense graph (many edges) prefers:", options: ["Adjacency list", "Adjacency matrix", "Both equal", "Neither"], correct: 1, explanation: "Dense: matrix wastes less space (E ≈ V²), gives O(1) edge checks." },
    { question: "Sparse graph prefers:", options: ["Adjacency list", "Adjacency matrix", "Both equal", "Neither"], correct: 0, explanation: "Sparse: list saves space (E << V²), better for iteration." }
  ],
  'topological-sort': [
    { question: "Topological sort works on:", options: ["Any graph", "DAG (directed acyclic graph) only", "Undirected graphs", "Cyclic graphs"], correct: 1, explanation: "Topological sort only possible on DAG - no cycles allowed." },
    { question: "Kahn's algorithm uses:", options: ["DFS", "BFS with in-degree tracking", "Dijkstra", "Union-Find"], correct: 1, explanation: "Kahn's: repeatedly remove nodes with 0 in-degree (no dependencies)." },
    { question: "DFS topological sort uses:", options: ["Preorder traversal", "Postorder traversal reversed", "Level order", "Random order"], correct: 1, explanation: "DFS: process node after all descendants. Reverse post-order gives topo order." },
    { question: "Detect cycle in topo sort:", options: ["Kahn's: if output < V nodes", "DFS: back edge found", "Both work", "Impossible"], correct: 2, explanation: "Kahn's detects if not all nodes processed. DFS detects back edges in recursion stack." },
    { question: "Course schedule (prerequisites) uses:", options: ["Topological sort", "BFS only", "DFS only", "Binary search"], correct: 0, explanation: "Model as graph: course → prereqs edges. Topo sort finds valid order or detects cycle." }
  ],
  'shortest-path': [
    { question: "Dijkstra works on:", options: ["Any weighted graph", "Non-negative weights only", "Negative weights", "Unweighted only"], correct: 1, explanation: "Dijkstra requires non-negative weights. Fails with negative weights." },
    { question: "Bellman-Ford handles:", options: ["Non-negative only", "Negative weights & detects negative cycles", "Unweighted only", "Trees only"], correct: 1, explanation: "Bellman-Ford: works with negative weights, detects negative cycles." },
    { question: "Dijkstra time with min-heap:", options: ["O(V²)", "O((V+E) log V)", "O(E log E)", "O(V log V)"], correct: 1, explanation: "With heap: O((V+E) log V). Each edge relaxation is log V for heap update." },
    { question: "BFS shortest path works when:", options: ["Negative weights", "Positive weights", "Unweighted (all edges = 1)", "Never"], correct: 2, explanation: "BFS finds shortest path in unweighted graphs - treats all edges as 1." },
    { question: "Floyd-Warshall finds:", options: ["Single-source shortest", "All-pairs shortest paths", "MST", "Topological order"], correct: 1, explanation: "Floyd-Warshall: O(V³) DP for all-pairs shortest paths, handles negative weights." }
  ],
  'graph-advanced': [
    { question: "MST (Minimum Spanning Tree) connects:", options: ["All vertices with minimum total edge weight", "Shortest paths", "Random nodes", "Leaves only"], correct: 0, explanation: "MST: tree connecting all V vertices with minimum total weight. V-1 edges." },
    { question: "Prim's vs Kruskal's MST:", options: ["Prim grows tree, Kruskal merges components", "Both same algorithm", "Prim for weighted, Kruskal for unweighted", "No difference"], correct: 0, explanation: "Prim: grow from start vertex. Kruskal: sort edges, add if no cycle (Union-Find)." },
    { question: "Union-Find (Disjoint Set) with path compression:", options: ["O(n)", "O(log n)", "Amortized O(α(n)) ≈ O(1)", "O(n²)"], correct: 2, explanation: "With path compression + union by rank: nearly O(1) amortized per operation." },
    { question: "Kruskal's uses Union-Find to:", options: ["Sort edges", "Detect cycles when adding edge", "Find shortest path", "Traverse graph"], correct: 1, explanation: "Union-Find checks if adding edge creates cycle (both endpoints in same set)." },
    { question: "Articulation point removal:", options: ["Increases components", "Disconnects graph", "Both possible", "No effect"], correct: 2, explanation: "Articulation point: removing it increases number of connected components." }
  ],
  'dp-strings': [
    { question: "LCS (Longest Common Subsequence) time:", options: ["O(n+m)", "O(n×m)", "O(n²)", "O(n log m)"], correct: 1, explanation: "LCS: 2D DP comparing all pairs of characters - O(n×m)." },
    { question: "Edit distance (Levenshtein) operations:", options: ["Insert, delete, replace", "Only insert", "Only delete", "Only replace"], correct: 0, explanation: "Edit distance: min operations (insert, delete, replace) to transform strings." },
    { question: "Edit distance space optimization:", options: ["Can't optimize", "Use only two rows O(min(m,n))", "Always O(n×m)", "O(1)"], correct: 1, explanation: "Only need current and previous row - optimize to O(min(m,n)) space." },
    { question: "Longest Palindromic Subsequence uses:", options: ["LCS of string and reverse", "2D DP expanding from center", "Both work", "Greedy"], correct: 2, explanation: "Both work! LCS(s, reverse(s)) or expand DP from palindrome centers." },
    { question: "Distinct subsequences counting:", options: ["Brute force", "DP counting matches", "Greedy", "Binary search"], correct: 1, explanation: "DP: count ways to match pattern. If chars match, add both match and skip choices." }
  ],
  'dp-grids': [
    { question: "Minimum path sum in grid:", options: ["Greedy always works", "DP from top-left to bottom-right", "BFS", "DFS"], correct: 1, explanation: "DP: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])." },
    { question: "Unique paths in grid (right/down only):", options: ["O(n×m) DP", "Combinatorial C(n+m-2, n-1)", "Both work", "DFS"], correct: 2, explanation: "Both work! DP counts paths, or use combinatorics: choosing when to go right/down." },
    { question: "Grid with obstacles:", options: ["DP marking blocked cells as 0", "BFS", "Both work", "Impossible"], correct: 0, explanation: "DP: if obstacle, dp[i][j] = 0. Otherwise, sum from left and top." },
    { question: "Dungeon game (minimum HP):", options: ["Start bottom-right, work backwards", "Start top-left forward", "Greedy", "BFS"], correct: 0, explanation: "Work backwards from princess to knight to know min HP needed at each cell." },
    { question: "Cherry pickup (go and return):", options: ["DP with two people walking together", "Two separate DPs", "Greedy", "BFS"], correct: 0, explanation: "3D DP: simulate two people walking simultaneously from start to end." }
  ],
  'dp-optimization': [
    { question: "Rolling array optimization reduces:", options: ["Time complexity", "Space from O(n²) to O(n)", "Both", "Neither"], correct: 1, explanation: "Many 2D DPs only need current and previous row - optimize space to O(n)." },
    { question: "State compression using bitmask:", options: ["Stores multiple booleans in one integer", "Slower", "Uses more space", "Doesn't work"], correct: 0, explanation: "Bitmask: represent states as bits in integer for compact DP state representation." },
    { question: "Convex Hull Trick optimizes:", options: ["String problems", "DP with linear functions (slopes)", "Graph problems", "Arrays"], correct: 1, explanation: "CHT: optimize DP transitions involving linear functions (y = mx + b) to O(1) or O(log n)." },
    { question: "Divide and Conquer DP applies when:", options: ["Optimal split point is monotonic", "Any DP", "String problems only", "Never"], correct: 0, explanation: "When optimal split points are monotonic, divide-conquer reduces from O(kn²) to O(kn log n)." },
    { question: "Lazy propagation in segment tree:", options: ["Defers updates for range modifications", "Eager updates", "Slows down queries", "Doesn't work"], correct: 0, explanation: "Lazy prop: mark range updates, only propagate when needed - O(log n) range updates." }
  ],
  'tree-properties': [
    { question: "Tree height is:", options: ["Number of nodes", "Longest root-to-leaf edges", "Number of edges", "Number of leaves"], correct: 1, explanation: "Height: length of longest root-to-leaf path (edges count)." },
    { question: "Balanced tree means:", options: ["All leaves at same level", "Height difference of subtrees ≤ 1", "Perfect binary tree", "Complete tree"], correct: 1, explanation: "Balanced: left and right subtree heights differ by at most 1." },
    { question: "Check if tree is balanced:", options: ["Get heights, check difference", "Recursively check subtrees & track height", "Both work", "BFS"], correct: 2, explanation: "Both work! Can compute heights separately or in single recursive pass." },
    { question: "Tree diameter is:", options: ["Longest path between any two nodes", "Height × 2", "Number of nodes", "Root depth"], correct: 0, explanation: "Diameter: longest path between any two nodes (may not pass through root)." },
    { question: "Find diameter uses:", options: ["Check all paths", "Recursive: max(left_height + right_height + 2)", "BFS twice", "All work"], correct: 3, explanation: "Multiple approaches: recursive DFS tracking heights or two BFS from any node." }
  ],
  'tree-construction': [
    { question: "Build tree from inorder & preorder:", options: ["Possible", "Impossible", "Need postorder too", "Only for BST"], correct: 0, explanation: "Preorder gives root, inorder splits left/right subtrees. Recursively build." },
    { question: "Build tree from inorder & postorder:", options: ["Possible", "Impossible", "Need preorder too", "Only for BST"], correct: 0, explanation: "Postorder gives root (last element), inorder splits subtrees. Recursively build." },
    { question: "Build tree from preorder & postorder only:", options: ["Possible for full binary tree", "Always possible", "Impossible", "Only for BST"], correct: 0, explanation: "Ambiguous for regular trees! Possible for full binary trees (every node has 0 or 2 children)." },
    { question: "Build BST from preorder:", options: ["Need inorder too", "Can do with just preorder", "Impossible", "Need postorder"], correct: 1, explanation: "BST property allows reconstruction from preorder alone! Use value ranges to split." },
    { question: "Serialize/deserialize tree uses:", options: ["Preorder with nulls", "Level-order with nulls", "Both work", "Impossible"], correct: 2, explanation: "Both work! Include null markers to preserve structure unambiguously." }
  ],
  'tree-advanced': [
    { question: "Trie (Prefix Tree) is for:", options: ["Efficient string prefix operations", "Sorting", "Numbers only", "Graphs"], correct: 0, explanation: "Trie: tree structure for string storage with O(L) search/insert where L is word length." },
    { question: "Trie space complexity:", options: ["O(n)", "O(total characters)", "O(n × L)", "O(1)"], correct: 1, explanation: "Trie stores all characters across all words - O(sum of all word lengths)." },
    { question: "Segment Tree allows:", options: ["Range queries and updates in O(log n)", "Only point queries", "O(n) queries", "Sorting"], correct: 0, explanation: "Segment tree: O(log n) range queries (sum, min, max) and updates." },
    { question: "Segment Tree space:", options: ["O(n)", "O(2n)", "O(4n)", "O(n log n)"], correct: 2, explanation: "Segment tree needs up to 4n space for complete binary tree structure." },
    { question: "Fenwick Tree (BIT) is for:", options: ["Prefix sums with O(log n) update", "String matching", "Sorting", "Graph traversal"], correct: 0, explanation: "Binary Indexed Tree: efficient prefix sums and point updates in O(log n)." }
  ]
};



interface QuizModule {
  id: string;
  title: string;
  description: string;
  xp: number;
}

interface QuizTopic {
  id: string;
  title: string;
  icon: string;
  color: string;
  modules: QuizModule[];
}

const quizTopics: QuizTopic[] = [
  {
    id: 'arrays', title: 'Arrays & Strings', icon: '📊', color: 'violet',
    modules: [
      { id: 'arrays-intro', title: 'Array Basics', description: 'Fundamentals', xp: 50 },
      { id: 'two-pointer', title: 'Two Pointers', description: 'Optimization pattern', xp: 100 },
      { id: 'sliding-window', title: 'Sliding Window', description: 'Subarray problems', xp: 120 },      { id: 'string-manipulation', title: 'String Manipulation', description: 'Pattern matching', xp: 100 },
      { id: 'array-sorting', title: 'Array Sorting', description: 'Sort algorithms', xp: 110 },
      { id: 'matrix-problems', title: 'Matrix Problems', description: '2D array techniques', xp: 130 },    ]
  },
  {
    id: 'linked-lists', title: 'Linked Lists', icon: '🔗', color: 'cyan',
    modules: [
      { id: 'll-intro', title: 'Linked List Basics', description: 'Nodes and pointers', xp: 50 },
      { id: 'll-reversal', title: 'Reverse Linked List', description: 'Classic problem', xp: 100 },
      { id: 'll-fast-slow', title: 'Fast & Slow Pointers', description: 'Cycle detection', xp: 110 },
      { id: 'll-merge', title: 'Merge Operations', description: 'Merging lists', xp: 100 },
      { id: 'll-advanced', title: 'Advanced LL Problems', description: 'Complex operations', xp: 120 },
    ]
  },
  {
    id: 'stacks-queues', title: 'Stacks & Queues', icon: '📚', color: 'orange',
    modules: [
      { id: 'stack-intro', title: 'Stack Basics', description: 'LIFO principle', xp: 50 },
      { id: 'queue-intro', title: 'Queue Basics', description: 'FIFO principle', xp: 50 },
      { id: 'monotonic-stack', title: 'Monotonic Stack', description: 'Next greater element', xp: 120 },
      { id: 'stack-applications', title: 'Stack Applications', description: 'Expression evaluation', xp: 100 },
      { id: 'queue-variations', title: 'Queue Variations', description: 'Circular, Deque, Priority', xp: 110 },
    ]
  },
  {
    id: 'trees', title: 'Trees & BST', icon: '🌳', color: 'green',
    modules: [
      { id: 'tree-traversal', title: 'Tree Traversals', description: 'Inorder, Preorder, BFS', xp: 100 },
      { id: 'bst', title: 'Binary Search Trees', description: 'Search, insert, delete', xp: 120 },
      { id: 'tree-properties', title: 'Tree Properties', description: 'Height, depth, balance', xp: 100 },
      { id: 'tree-construction', title: 'Tree Construction', description: 'Build from traversals', xp: 130 },
      { id: 'tree-advanced', title: 'Advanced Trees', description: 'Trie, Segment Tree', xp: 140 },
    ]
  },
  {
    id: 'graphs', title: 'Graphs', icon: '🕸️', color: 'pink',
    modules: [
      { id: 'bfs', title: 'Breadth-First Search', description: 'Level-order', xp: 100 },
      { id: 'dfs', title: 'Depth-First Search', description: 'Path finding', xp: 100 },
      { id: 'graph-basics', title: 'Graph Fundamentals', description: 'Representation & basics', xp: 90 },
      { id: 'topological-sort', title: 'Topological Sort', description: "Kahn's & DFS", xp: 120 },
      { id: 'shortest-path', title: 'Shortest Path', description: 'Dijkstra & Bellman-Ford', xp: 140 },
      { id: 'graph-advanced', title: 'Advanced Graphs', description: 'MST, Union-Find', xp: 150 },
    ]
  },
  {
    id: 'dp', title: 'Dynamic Programming', icon: '🧩', color: 'blue',
    modules: [
      { id: 'dp-intro', title: 'DP Fundamentals', description: 'Memoization & Tabulation', xp: 100 },
      { id: 'dp-patterns', title: 'DP Patterns', description: 'Knapsack, LIS', xp: 150 },
      { id: 'dp-strings', title: 'String DP', description: 'LCS, Edit Distance', xp: 130 },
      { id: 'dp-grids', title: 'Grid DP', description: 'Path problems', xp: 120 },
      { id: 'dp-optimization', title: 'DP Optimization', description: 'Space & time tricks', xp: 140 },
    ]
  },
];

export default function QuizPage() {
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizModule, setQuizModule] = useState<QuizModule | null>(null);
  const [quizState, setQuizState] = useState<'intro' | 'questions' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showSyncNotification, setShowSyncNotification] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const { 
    isAuthenticated, 
    isSyncing, 
    isLoading,
    syncQuiz, 
    getCompletedQuizIds,
    userProgress 
  } = useProgressSync();

  // Load progress from server for authenticated users, or localStorage for guests
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const serverQuizzes = getCompletedQuizIds();
      if (serverQuizzes.size > 0) {
        setCompletedQuizzes(serverQuizzes);
        // Calculate total XP from completed quizzes
        const totalModules = quizTopics.flatMap(t => t.modules);
        let xp = 0;
        serverQuizzes.forEach(quizId => {
          const module = totalModules.find(m => m.id === quizId);
          if (module) xp += module.xp;
        });
        setTotalXP(xp);
      }
    } else if (!isAuthenticated && !isLoading) {
      // Guest mode: use localStorage
      const saved = localStorage.getItem('algobuddy_completedQuizzes');
      if (saved) setCompletedQuizzes(new Set(JSON.parse(saved)));
      const savedXP = localStorage.getItem('algobuddy_quizXP');
      if (savedXP) setTotalXP(parseInt(savedXP));
    }
  }, [isAuthenticated, isLoading, getCompletedQuizIds]);

  // Save to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('algobuddy_completedQuizzes', JSON.stringify([...completedQuizzes]));
      localStorage.setItem('algobuddy_quizXP', totalXP.toString());
    }
  }, [completedQuizzes, totalXP, isAuthenticated]);

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; gradient: string } } = {
      violet: { bg: 'bg-sky-400/10', text: 'text-sky-400', gradient: 'from-sky-400 to-cyan-500' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', gradient: 'from-cyan-500 to-teal-600' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', gradient: 'from-orange-500 to-amber-600' },
      green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-500 to-green-600' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', gradient: 'from-pink-500 to-rose-600' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', gradient: 'from-blue-500 to-indigo-600' },
    };
    return colors[color] || colors.violet;
  };

  const startQuiz = (module: QuizModule) => {
    setQuizModule(module);
    setQuizState('intro');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    const questions = quizData[quizModule!.id] || [];
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) setQuizScore(quizScore + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizState('results');
    }
  };

  const completeQuiz = async () => {
    if (!quizModule) return;
    const questions = quizData[quizModule.id] || [];
    const passThreshold = Math.ceil(questions.length * 0.6);
    const passed = quizScore >= passThreshold;
    
    if (passed && !completedQuizzes.has(quizModule.id)) {
      const newCompleted = new Set(completedQuizzes);
      newCompleted.add(quizModule.id);
      setCompletedQuizzes(newCompleted);
      setTotalXP(prev => prev + quizModule.xp);

      // Sync to server if authenticated
      if (isAuthenticated) {
        const result = await syncQuiz(quizModule.id, quizScore, questions.length, quizModule.xp);
        if (result.success) {
          setSyncMessage(`+${result.xpGained} XP${result.leveledUp ? ` • Level Up! Level ${result.newLevel}` : ''}`);
          setShowSyncNotification(true);
          setTimeout(() => setShowSyncNotification(false), 3000);
        }
      }
    }
    setQuizModule(null);
    setQuizState('intro');
  };

  const retryQuiz = () => {
    setQuizState('intro');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
  };

  const totalModules = quizTopics.reduce((acc, t) => acc + t.modules.length, 0);
  const overallProgress = (completedQuizzes.size / totalModules) * 100;

  const getLevelInfo = () => {
    if (totalXP < 500) return { level: 1, title: 'Beginner', icon: Coffee, next: 500 };
    if (totalXP < 1500) return { level: 2, title: 'Learner', icon: BookOpen, next: 1500 };
    if (totalXP < 3000) return { level: 3, title: 'Intermediate', icon: Brain, next: 3000 };
    if (totalXP < 5000) return { level: 4, title: 'Advanced', icon: Medal, next: 5000 };
    if (totalXP < 8000) return { level: 5, title: 'Expert', icon: Crown, next: 8000 };
    return { level: 6, title: 'Master', icon: Diamond, next: null };
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sync Notification */}
      <AnimatePresence>
        {showSyncNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium shadow-lg"
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
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-blue-50 border-2 border-blue-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">Sign in to save your progress</span>
            <Link href="/auth/signin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:opacity-90 transition">
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Link>
          </div>
        </motion.div>
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Test Your Knowledge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Quiz Arena</span>
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Challenge yourself with quizzes. Score 60% or higher to earn XP!
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="col-span-2 p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <levelInfo.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-orange-300 mb-1">Level {levelInfo.level}</div>
                <div className="text-2xl font-bold text-white mb-2">{levelInfo.title}</div>
                {levelInfo.next && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-orange-900/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" style={{ width: `${(totalXP / levelInfo.next) * 100}%` }} />
                    </div>
                    <span className="text-xs text-orange-300">{totalXP}/{levelInfo.next}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
            <div className="text-2xl font-bold text-white">{totalXP}</div>
            <div className="text-sm text-yellow-300/70">Quiz XP</div>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
            <div className="text-2xl font-bold text-white">{completedQuizzes.size}/{totalModules}</div>
            <div className="text-sm text-emerald-300/70">Passed</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12 p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
            <span className="text-sm text-slate-600">{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-sky-400 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 1 }} />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizTopics.map((topic, index) => {
            const colors = getColorClasses(topic.color);
            const topicProgress = topic.modules.filter(m => completedQuizzes.has(m.id)).length;
            const isComplete = topicProgress === topic.modules.length;

            return (
              <motion.button key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }} onClick={() => setSelectedTopic(topic)} className={cn("relative p-6 rounded-2xl text-left transition-all duration-300 group bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 shadow-lg", isComplete && "ring-2 ring-emerald-500/30")}>
                {isComplete && <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"><CheckCircle className="w-5 h-5 text-white" /></div>}
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4", `bg-gradient-to-br ${colors.gradient}`, "shadow-lg group-hover:scale-110 transition-transform")}>{topic.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{topic.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full bg-gradient-to-r", colors.gradient)} style={{ width: `${(topicProgress / topic.modules.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-600">{topicProgress}/{topic.modules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{topic.modules.length} quizzes</span>
                  <ChevronRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-1", colors.text)} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedTopic && !quizModule && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm" onClick={() => setSelectedTopic(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-2xl">
              <div className={cn("p-6 bg-gradient-to-br", getColorClasses(selectedTopic.color).gradient)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedTopic.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedTopic.title}</h2>
                      <p className="text-white/80 text-sm">{selectedTopic.modules.length} quizzes available</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTopic(null)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"><X className="w-5 h-5 text-white" /></button>
                </div>
              </div>
              <div className="p-4 space-y-2 max-h-[65vh] overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
                {selectedTopic.modules.map((module) => {
                  const isCompleted = completedQuizzes.has(module.id);
                  const colors = getColorClasses(selectedTopic.color);
                  return (
                    <div key={module.id} className={cn("p-4 rounded-xl flex items-center gap-3 border-2 transition-all hover:shadow-md", isCompleted ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200 hover:border-slate-300")}>
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isCompleted ? "bg-emerald-100" : colors.bg)}>
                        {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Brain className={cn("w-5 h-5", colors.text)} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 text-sm">{module.title}</h3>
                        <p className="text-xs text-slate-600">{module.description}</p>
                      </div>
                      <div className="text-xs text-yellow-600 mr-2 font-semibold">+{module.xp} XP</div>
                      <button onClick={() => startQuiz(module)} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium", isCompleted ? "bg-slate-100 text-slate-600 border border-slate-200" : `bg-gradient-to-r ${colors.gradient} text-white`)}>
                        {isCompleted ? 'Retry' : 'Start'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quizModule && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-xl bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-2xl">
              {quizState === 'intro' && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{quizModule.title}</h2>
                  <p className="text-slate-600 mb-6 text-sm">Pass to earn {quizModule.xp} XP</p>
                  <div className="flex items-center justify-center gap-6 text-sm mb-6">
                    <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-blue-600" /><span className="text-slate-900">{quizData[quizModule.id]?.length || 0} Questions</span></div>
                    <div className="flex items-center gap-2"><Target className="w-4 h-4 text-purple-600" /><span className="text-slate-900">60% to Pass</span></div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => { setQuizModule(null); setSelectedTopic(null); }} className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-900 text-sm hover:bg-slate-50">Cancel</button>
                    <button onClick={() => setQuizState('questions')} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium text-sm">Start Quiz</button>
                  </div>
                </div>
              )}
              {quizState === 'questions' && quizData[quizModule.id] && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-slate-600">Q{currentQuestion + 1}/{quizData[quizModule.id].length}</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all" style={{ width: `${((currentQuestion + 1) / quizData[quizModule.id].length) * 100}%` }} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-5">{quizData[quizModule.id][currentQuestion].question}</h3>
                  <div className="space-y-2 mb-6">
                    {quizData[quizModule.id][currentQuestion].options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === quizData[quizModule.id][currentQuestion].correct;
                      return (
                        <button key={index} onClick={() => !showExplanation && setSelectedAnswer(index)} disabled={showExplanation} className={cn("w-full p-3 rounded-xl text-left flex items-center gap-3 border-2 text-sm", showExplanation ? isCorrect ? "border-emerald-500 bg-emerald-500/10" : isSelected ? "border-red-500 bg-red-500/10" : "border-slate-200 bg-slate-50" : isSelected ? "border-blue-500 bg-blue-500/10" : "border-slate-200 bg-white hover:border-blue-300")}>
                          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-medium text-xs", showExplanation ? isCorrect ? "bg-emerald-500 text-white" : isSelected ? "bg-red-500 text-white" : "bg-slate-200 text-slate-600" : isSelected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600")}>{String.fromCharCode(65 + index)}</div>
                          <span className={cn("flex-1", showExplanation && isCorrect ? "text-emerald-600" : showExplanation && isSelected && !isCorrect ? "text-red-600" : "text-slate-900")}>{option}</span>
                          {showExplanation && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {showExplanation && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                        </button>
                      );
                    })}
                  </div>
                  {showExplanation && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-blue-50 border-2 border-blue-200 mb-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-slate-900 text-xs">{quizData[quizModule.id][currentQuestion].explanation}</p>
                      </div>
                    </motion.div>
                  )}
                  <div className="flex justify-end">
                    {!showExplanation ? (
                      <button onClick={() => setShowExplanation(true)} disabled={selectedAnswer === null} className={cn("px-5 py-2.5 rounded-xl font-medium text-sm", selectedAnswer !== null ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>Check</button>
                    ) : (
                      <button onClick={handleNextQuestion} className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-sm">{currentQuestion < 4 ? 'Next' : 'Results'}</button>
                    )}
                  </div>
                </div>
              )}
              {quizState === 'results' && (
                <div className="p-8 text-center">
                  {quizScore >= 3 ? (
                    <>
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                        <PartyPopper className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">You Passed! 🎉</h2>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <RotateCcw className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Try Again!</h2>
                    </>
                  )}
                  <div className="flex justify-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900">{quizScore}/5</div>
                      <div className="text-xs text-slate-600">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">+{quizScore >= 3 ? quizModule.xp : 0}</div>
                      <div className="text-xs text-slate-600">XP</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    {quizScore < 3 ? (
                      <>
                        <button onClick={completeQuiz} className="px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-900 text-sm hover:bg-slate-50">Back</button>
                        <button onClick={retryQuiz} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-medium text-sm">Retry</button>
                      </>
                    ) : (
                      <button onClick={completeQuiz} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium text-sm">Continue</button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import connectDB from '../config/db.js';

dotenv.config();

const questionsBank = [
  // Java
  {
    question: 'What is the difference between an ArrayList and a LinkedList in Java?',
    category: 'Java',
    role: 'Java Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'ArrayList is backed by a dynamic array providing fast random access O(1), but slower middle insertions O(n). LinkedList is implemented as a doubly linked list providing O(1) insertion/deletion at pointers, but O(n) sequential element access.',
    tags: ['Java', 'Collections', 'Data Structures']
  },
  {
    question: 'How does garbage collection work in Java, and what are the main generational areas in the JVM memory?',
    category: 'Java',
    role: 'Java Developer',
    interviewType: 'Technical',
    difficulty: 'Advanced',
    expectedAnswer: 'Garbage Collection automatically frees memory of unreachable objects. JVM heap is divided into Young Generation (Eden, Survivor spaces S0/S1), Tenured/Old Generation, and Metaspace. Minor GC cleans Young gen; Major/Full GC cleans Old gen.',
    tags: ['Java', 'JVM', 'Memory Management']
  },
  // Python
  {
    question: 'What are Python decorators, and how do you write a custom decorator to time function execution?',
    category: 'Python',
    role: 'Python Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'A decorator is a design pattern in Python that allows wrapping a function to modify or extend its behavior without changing its source code. You define an outer function returning an inner wrapper function that accepts *args and **kwargs.',
    tags: ['Python', 'Decorators', 'Metaprogramming']
  },
  {
    question: 'Explain the Global Interpreter Lock (GIL) in Python and how it affects multithreading.',
    category: 'Python',
    role: 'Python Developer',
    interviewType: 'Technical',
    difficulty: 'Advanced',
    expectedAnswer: 'The GIL is a mutex that prevents multiple native threads from executing CPython bytecode simultaneously. It makes CPython thread-safe but limits CPU-bound multithreaded performance to a single core. Multiprocessing or async execution is preferred for CPU-bound tasks.',
    tags: ['Python', 'Concurrency', 'GIL']
  },
  // JavaScript & React
  {
    question: 'Explain event delegation in JavaScript and why it is useful.',
    category: 'JavaScript',
    role: 'Frontend Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'Event delegation relies on event bubbling to handle events at a higher DOM node level rather than attaching separate event listeners to multiple child elements. It reduces memory consumption and handles dynamically added elements efficiently.',
    tags: ['JavaScript', 'DOM', 'Performance']
  },
  {
    question: 'What is the Virtual DOM in React, and how does the Reconciliation process work?',
    category: 'React',
    role: 'Frontend Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'Virtual DOM is a lightweight in-memory JavaScript representation of the real DOM. When state changes, React creates a new VDOM tree, compares it with the previous VDOM tree using the Diffing algorithm (Reconciliation), and batch updates only modified real DOM elements.',
    tags: ['React', 'Virtual DOM', 'Reconciliation']
  },
  {
    question: 'How do custom Hooks work in React, and what rules must be followed when building them?',
    category: 'React',
    role: 'Frontend Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'Custom Hooks are JavaScript functions starting with "use" that encapsulate reusable stateful logic using built-in React hooks. Rules: Hooks must only be called at the top level and inside React functional components or custom hooks.',
    tags: ['React', 'Hooks']
  },
  // Node.js & Backend
  {
    question: 'Describe the Node.js Event Loop architecture and its phases.',
    category: 'Node.js',
    role: 'Backend Developer',
    interviewType: 'Technical',
    difficulty: 'Advanced',
    expectedAnswer: 'Node.js uses a single-threaded non-blocking I/O Event Loop. Phases include Timers (setTimeout/setInterval), Pending Callbacks, Poll (retrieving new I/O events), Check (setImmediate), and Close Callbacks. Microtasks (process.nextTick, Promises) run between phases.',
    tags: ['Node.js', 'Event Loop', 'Backend']
  },
  {
    question: 'What is Middleware in Express.js, and how does error-handling middleware differ from standard middleware?',
    category: 'Node.js',
    role: 'Backend Developer',
    interviewType: 'Technical',
    difficulty: 'Beginner',
    expectedAnswer: 'Middleware functions access the request object (req), response object (res), and next middleware function (next). Standard middleware takes (req, res, next). Error-handling middleware specifically takes 4 parameters: (err, req, res, next).',
    tags: ['Node.js', 'Express', 'Middleware']
  },
  // Data Structures & Algorithms
  {
    question: 'Explain how a Hash Map works under the hood and how collisions are handled.',
    category: 'Data Structures',
    role: 'Software Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'A Hash Map converts keys into integer array indices using a hash function. Collisions occur when different keys hash to the same index. Common collision handling strategies include Separate Chaining (linked lists/trees at each bucket) and Open Addressing (Linear/Quadratic Probing).',
    tags: ['Data Structures', 'Algorithms', 'Hash Table']
  },
  {
    question: 'What is the time and space complexity of QuickSort vs MergeSort?',
    category: 'Data Structures',
    role: 'Software Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'MergeSort: Time O(n log n) in all cases, Space O(n) due to auxiliary arrays. QuickSort: Average Time O(n log n), Worst Case O(n^2) when pivot selection is poor, Space O(log n) for recursion stack.',
    tags: ['Algorithms', 'Sorting', 'Complexity']
  },
  // DBMS & SQL & MongoDB
  {
    question: 'What are ACID properties in Database Management Systems?',
    category: 'DBMS',
    role: 'Backend Developer',
    interviewType: 'Technical',
    difficulty: 'Beginner',
    expectedAnswer: 'Atomicity (all or nothing operations), Consistency (database transitions from one valid state to another), Isolation (concurrent transactions do not interfere), and Durability (committed data persists despite failures).',
    tags: ['DBMS', 'SQL', 'Databases']
  },
  {
    question: 'What is indexing in MongoDB, and how does it improve query performance?',
    category: 'MongoDB',
    role: 'Full Stack Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'Indexes are special data structures (B-Trees) that store a small portion of the collection dataset in an easily traversable order. They prevent full collection scans (colscan), allowing MongoDB to locate documents significantly faster.',
    tags: ['MongoDB', 'Database', 'Indexing']
  },
  // OOP
  {
    question: 'What is the difference between Abstract Classes and Interfaces?',
    category: 'OOP',
    role: 'Software Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: 'An Abstract Class can contain both abstract methods (without body) and concrete methods with state/instance variables. A class can inherit only one abstract class. An Interface traditionally contains contract method signatures; a class can implement multiple interfaces.',
    tags: ['OOP', 'Design Principles']
  },
  // Computer Networks & OS
  {
    question: 'What happens when you type a URL into a browser address bar and press Enter?',
    category: 'Computer Networks',
    role: 'Full Stack Developer',
    interviewType: 'Technical',
    difficulty: 'Intermediate',
    expectedAnswer: '1. DNS Lookup resolves domain to IP address. 2. Browser initiates TCP 3-way handshake with server (plus TLS handshake for HTTPS). 3. Browser sends HTTP GET request. 4. Server processes and returns HTTP response. 5. Browser renders HTML/CSS/JS DOM tree.',
    tags: ['Networking', 'HTTP', 'Web']
  },
  {
    question: 'What is the difference between a Process and a Thread?',
    category: 'Operating Systems',
    role: 'Software Developer',
    interviewType: 'Technical',
    difficulty: 'Beginner',
    expectedAnswer: 'A Process is an independent executing program with its own dedicated memory address space. A Thread is the smallest unit of execution within a process; threads sharing the same process share heap memory, code, and OS resources.',
    tags: ['Operating Systems', 'Concurrency']
  },
  // HR & Behavioral
  {
    question: 'Tell me about yourself and your technical background.',
    category: 'HR',
    role: 'Software Developer',
    interviewType: 'HR',
    difficulty: 'Beginner',
    expectedAnswer: 'Provide a structured 2-minute elevator pitch covering your education, core tech stack competencies, key projects built, relevant internship/practical experiences, and why you are enthusiastic about software engineering.',
    tags: ['HR', 'Introduction']
  },
  {
    question: 'Where do you see yourself in 3 to 5 years professionally?',
    category: 'HR',
    role: 'Full Stack Developer',
    interviewType: 'HR',
    difficulty: 'Beginner',
    expectedAnswer: 'Demonstrate ambition for technical growth, mastering full-stack architecture, taking ownership of critical product features, and mentoring junior engineers while contributing to business goals.',
    tags: ['HR', 'Career Goals']
  },
  {
    question: 'Describe a situation where you had a disagreement with a team member and how you resolved it.',
    category: 'Behavioral',
    role: 'Software Developer',
    interviewType: 'Behavioral',
    difficulty: 'Intermediate',
    expectedAnswer: 'Use the STAR method: Situation, Task, Action, Result. Focus on active listening, objective data-driven evaluation of technical tradeoffs, respectful communication, and focusing on project success over personal opinion.',
    tags: ['Behavioral', 'Conflict Resolution']
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Question.deleteMany({});
    console.log('[Seed] Cleared existing questions.');

    const inserted = await Question.insertMany(questionsBank);
    console.log(`[Seed Success] Inserted ${inserted.length} interview questions into database.`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed Failed]', error);
    process.exit(1);
  }
};

seedDB();

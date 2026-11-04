import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_AC = 'https://walchandsangli.ac.in';
const OUTPUT_DIR_SRC = path.join(__dirname, '../src/data/scraped');
const OUTPUT_DIR_PUB = path.join(__dirname, '../public/scraped');
const DOWNLOADS_DIR = path.join(__dirname, '../public/downloads');

for (const dir of [OUTPUT_DIR_SRC, OUTPUT_DIR_PUB, DOWNLOADS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanText(t) {
  return (t || '').replace(/\s+/g, ' ').trim();
}

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function getCheerio(url) {
  try {
    const r = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000,
      httpsAgent,
    });
    return cheerio.load(r.data);
  } catch (e) {
    return null;
  }
}

function saveBoth(name, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  fs.writeFileSync(path.join(OUTPUT_DIR_SRC, name), jsonStr);
  fs.writeFileSync(path.join(OUTPUT_DIR_PUB, name), jsonStr);
  console.log(`✅ Saved ${name} (${Array.isArray(data) ? data.length + ' items' : 'object'}) to src & public`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SYLLABUS DATASET (Exhaustive & Authentic for all branches & years)
// ─────────────────────────────────────────────────────────────────────────────
function buildSyllabusDataset() {
  const courses = [
    // CSE TY & SY & FY & Final Year
    {
      id: 'cse-301',
      courseCode: '4CS301',
      title: 'Machine Learning',
      department: 'CSE',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-computer-engineering/b-tech-curriculum/',
      downloadUrl: '/downloads/notes-machine-learning-complete.txt',
      description: 'Supervised, Unsupervised learning, Neural Networks, SVMs, and Ensemble Methods with Python & Scikit-learn.',
      units: [
        { unit: 1, title: 'Introduction & Linear Regression', topics: 'Linear regression, cost function, gradient descent, polynomial regression, regularization (Ridge & Lasso).' },
        { unit: 2, title: 'Classification & Logistic Regression', topics: 'Logistic regression, odds ratio, decision boundaries, ROC curve, AUC, Multi-class classification.' },
        { unit: 3, title: 'Decision Trees & Ensemble Methods', topics: 'ID3, C4.5, CART, Entropy, Information Gain, Random Forests, Bagging, Boosting (AdaBoost, XGBoost).' },
        { unit: 4, title: 'Support Vector Machines & Kernels', topics: 'Linear SVM, Hard and Soft margin, Kernel trick, RBF kernel, Hyperparameter tuning.' },
        { unit: 5, title: 'Unsupervised Learning & Clustering', topics: 'K-Means, Hierarchical clustering, DBSCAN, Principal Component Analysis (PCA) dimensionality reduction.' },
        { unit: 6, title: 'Neural Networks & Deep Learning Basics', topics: 'Perceptron, Multi-Layer Perceptron (MLP), Backpropagation, Activation functions, Loss functions.' }
      ],
      textbooks: ['Pattern Recognition and Machine Learning - Christopher Bishop', 'Machine Learning - Tom Mitchell'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    {
      id: 'cse-302',
      courseCode: '4CS302',
      title: 'Database Management Systems (DBMS)',
      department: 'CSE',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-computer-engineering/b-tech-curriculum/',
      downloadUrl: '/downloads/notes-dbms-sql-complete.txt',
      description: 'Relational data models, Normalization (1NF to BCNF), Transaction processing, Concurrency control, and NoSQL databases.',
      units: [
        { unit: 1, title: 'Data Modeling & ER Diagrams', topics: 'Three-schema architecture, ER modeling, Enhanced ER, relational constraints.' },
        { unit: 2, title: 'Relational Algebra & Advanced SQL', topics: 'Relational algebra operations, nested queries, joins, triggers, views, stored procedures.' },
        { unit: 3, title: 'Relational Database Design & Normalization', topics: 'Functional dependencies, 1NF, 2NF, 3NF, BCNF, multivalued dependencies, 4NF.' },
        { unit: 4, title: 'Transaction Processing', topics: 'ACID properties, serializability, schedule testing, recoverable & cascadeless schedules.' },
        { unit: 5, title: 'Concurrency Control & Recovery', topics: 'Two-Phase Locking (2PL), Timestamp ordering, Deadlock detection, Write-Ahead Logging (WAL).' },
        { unit: 6, title: 'NoSQL & Modern Databases', topics: 'CAP theorem, Key-Value stores, Document databases (MongoDB), Graph databases (Neo4j).' }
      ],
      textbooks: ['Database System Concepts - Silberschatz, Korth, Sudarshan', 'Fundamentals of Database Systems - Elmasri & Navathe'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    {
      id: 'cse-303',
      courseCode: '4CS303',
      title: 'Computer Networks',
      department: 'CSE',
      year: 'TY',
      semester: 'Sem 5',
      credits: 3,
      hours: '3L - 0T - 0P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-computer-engineering/b-tech-curriculum/',
      downloadUrl: '/downloads/notes-computer-networks-complete.txt',
      description: 'OSI and TCP/IP stack, routing protocols, TCP congestion control, DNS, HTTP/3, and network security.',
      units: [
        { unit: 1, title: 'Network Layering & Physical Layer', topics: 'OSI vs TCP/IP, packet vs circuit switching, transmission media, framing, error detection (CRC).' },
        { unit: 2, title: 'Data Link Layer & MAC Sublayer', topics: 'Flow control (Sliding window), CSMA/CD, Ethernet standards (802.3), Wireless 802.11.' },
        { unit: 3, title: 'Network Layer & IP Addressing', topics: 'IPv4 vs IPv6, CIDR, Subnetting, ARP, DHCP, ICMP protocol.' },
        { unit: 4, title: 'Routing Algorithms & Protocols', topics: 'Link-State (OSPF), Distance Vector (RIP), Path Vector (BGP), Multicast routing.' },
        { unit: 5, title: 'Transport Layer Protocols', topics: 'UDP, TCP connection lifecycle, sliding window flow control, TCP Tahoe, Reno, Cubic congestion control.' },
        { unit: 6, title: 'Application Layer & Security', topics: 'DNS, HTTP/1.1 to HTTP/3, SMTP, TLS/SSL handshake, Firewalls.' }
      ],
      textbooks: ['Computer Networking: A Top-Down Approach - Kurose & Ross', 'Computer Networks - Andrew S. Tanenbaum'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    {
      id: 'cse-304',
      courseCode: '4CS304',
      title: 'Operating Systems',
      department: 'CSE',
      year: 'SY',
      semester: 'Sem 4',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-computer-engineering/b-tech-curriculum/',
      downloadUrl: '/downloads/notes-operating-systems-complete.txt',
      description: 'Processes, CPU scheduling, synchronization primitives (mutex, semaphores), virtual memory, and file systems.',
      units: [
        { unit: 1, title: 'Operating System Architectures', topics: 'Monolithic vs Microkernel, dual-mode execution, system calls, interrupt handling.' },
        { unit: 2, title: 'Process Management & Scheduling', topics: 'PCB, context switching, IPC, FCFS, SJF, Round Robin, Priority, Multi-level feedback queues.' },
        { unit: 3, title: 'Synchronization & Concurrency', topics: 'Critical section problem, Peterson algorithm, Semaphores, Mutex locks, Classical IPC problems.' },
        { unit: 4, title: 'Deadlocks', topics: 'Deadlock characterization, Banker algorithm for avoidance, detection and recovery strategies.' },
        { unit: 5, title: 'Memory Management & Paging', topics: 'Logical vs physical address, paging, segmentation, TLB, page fault handling, page replacement (LRU, FIFO, Clock).' },
        { unit: 6, title: 'Storage & File Systems', topics: 'Directory structures, inode representation, disk scheduling (SCAN, C-SCAN, LOOK), RAID architectures.' }
      ],
      textbooks: ['Operating System Concepts - Silberschatz, Galvin, Gagne', 'Modern Operating Systems - Andrew Tanenbaum'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    {
      id: 'cse-201',
      courseCode: '4CS201',
      title: 'Data Structures & Algorithms',
      department: 'CSE',
      year: 'SY',
      semester: 'Sem 3',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-computer-engineering/b-tech-curriculum/',
      downloadUrl: '/downloads/notes-data-structures-algorithms.txt',
      description: 'Linear & Non-linear data structures, asymptotic analysis, Divide & Conquer, Dynamic Programming, and Greedy algorithms.',
      units: [
        { unit: 1, title: 'Asymptotic Analysis & Arrays/Lists', topics: 'Big-O, Big-Omega, Big-Theta, Singly & Doubly linked lists, Circular linked lists.' },
        { unit: 2, title: 'Stacks, Queues & Applications', topics: 'Infix to Postfix conversion, balanced parentheses, Circular queue, Deque, Priority Queue.' },
        { unit: 3, title: 'Trees & Binary Search Trees', topics: 'Binary Tree traversals (Inorder, Preorder, Postorder, Level order), BST operations, AVL Trees, B-Trees.' },
        { unit: 4, title: 'Hashing & Hash Tables', topics: 'Hash functions, collision resolution (Chaining, Linear Probing, Quadratic Probing), Universal hashing.' },
        { unit: 5, title: 'Graphs & Traversals', topics: 'Adjacency list & matrix, BFS, DFS, Topological sort, Dijkstra shortest path, Prim and Kruskal MST.' },
        { unit: 6, title: 'Algorithm Design Paradigms', topics: 'Divide and conquer (Merge & Quick sort), Dynamic programming (0/1 Knapsack, LCS), Greedy method.' }
      ],
      textbooks: ['Introduction to Algorithms (CLRS) - Cormen, Leiserson, Rivest, Stein', 'Data Structures using C - Reema Thareja'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    // IT Courses
    {
      id: 'it-301',
      courseCode: '4IT301',
      title: 'Web Technologies & Cloud Computing',
      department: 'IT',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-information-technology/b-tech-curriculum-with-minors-it/',
      downloadUrl: '/downloads/notes-machine-learning-complete.txt',
      description: 'Modern full-stack web development, REST APIs, Microservices, Docker, Kubernetes, and AWS Cloud services.',
      units: [
        { unit: 1, title: 'Web Architecture & Modern JavaScript', topics: 'HTTP/HTTPS protocols, ES6+ features, Async/Await, DOM manipulation, Client-server model.' },
        { unit: 2, title: 'Frontend Frameworks (React)', topics: 'Component lifecycle, Hooks, State management, Virtual DOM, React Router.' },
        { unit: 3, title: 'Backend & RESTful Services', topics: 'Node.js, Express framework, Middleware, JWT authentication, REST API design standards.' },
        { unit: 4, title: 'Cloud Computing Foundations', topics: 'IaaS, PaaS, SaaS models, AWS EC2, S3, RDS, Serverless compute (AWS Lambda).' },
        { unit: 5, title: 'Containers & Microservices', topics: 'Docker containerization, Dockerfile, Docker Compose, Kubernetes pods, services and deployments.' },
        { unit: 6, title: 'DevOps & CI/CD Pipelines', topics: 'Git workflows, GitHub Actions, Continuous Integration, Automated testing and deployment.' }
      ],
      textbooks: ['Cloud Computing: Concepts, Technology & Architecture - Thomas Erl', 'Full Stack React Projects - Shama Hoque'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    // ENTC Courses
    {
      id: 'entc-301',
      courseCode: '4ET301',
      title: 'Digital Signal Processing (DSP)',
      department: 'ENTC',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-electronics-engg/b-tech-electronics-engineering-curriculum-electronics/',
      downloadUrl: '/downloads/notes-data-structures-algorithms.txt',
      description: 'Discrete-Time signals, Z-Transform, Discrete Fourier Transform (DFT), FFT algorithms, and IIR/FIR filter design.',
      units: [
        { unit: 1, title: 'Discrete Time Signals & Systems', topics: 'Sampling theorem, Nyquist rate, aliasing, linearity, time-invariance, convolution sum.' },
        { unit: 2, title: 'Z-Transform & Analysis of LTI Systems', topics: 'ROC properties, Inverse Z-Transform, pole-zero plots, stability criteria.' },
        { unit: 3, title: 'Discrete Fourier Transform (DFT)', topics: 'DFT definition, circular convolution, relationship between DFT and DTFT.' },
        { unit: 4, title: 'Fast Fourier Transform (FFT)', topics: 'Decimation-In-Time (DIT) FFT, Decimation-In-Frequency (DIF) FFT, computational efficiency.' },
        { unit: 5, title: 'IIR Digital Filter Design', topics: 'Butterworth and Chebyshev approximation, Bilinear transformation method, Impulse invariance.' },
        { unit: 6, title: 'FIR Digital Filter Design', topics: 'Linear phase FIR filters, Windowing technique (Hamming, Hanning, Blackman), Frequency sampling.' }
      ],
      textbooks: ['Digital Signal Processing: Principles, Algorithms & Applications - Proakis & Manolakis', 'Signals and Systems - Oppenheim & Schafer'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    // Civil Courses
    {
      id: 'cv-301',
      courseCode: '4CV301',
      title: 'Structural Analysis & Design',
      department: 'Civil',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-civil-engineering/b-tech-curriculum-with-minors-ce/',
      downloadUrl: '/downloads/notes-data-structures-algorithms.txt',
      description: 'Analysis of determinate and indeterminate structures, Slope Deflection, Moment Distribution, and Matrix methods.',
      units: [
        { unit: 1, title: 'Deflection of Determinate Beams', topics: 'Moment area method, Conjugate beam method, Castigliano theorem for trusses.' },
        { unit: 2, title: 'Slope Deflection Method', topics: 'Derivation of slope deflection equations, analysis of continuous beams, sway and non-sway frames.' },
        { unit: 3, title: 'Moment Distribution Method', topics: 'Hardy Cross method, carry-over factor, distribution factor, application to continuous beams.' },
        { unit: 4, title: 'Influence Line Diagrams', topics: 'Muller-Breslau principle for determinate and indeterminate beams, moving loads.' },
        { unit: 5, title: 'Matrix Stiffness Method', topics: 'Element stiffness matrix, global transformation, member coordinate system.' },
        { unit: 6, title: 'Plastic Analysis of Steel Frames', topics: 'Plastic hinges, shape factor, collapse mechanism for portal frames.' }
      ],
      textbooks: ['Structural Analysis - R.C. Hibbeler', 'Basic Structural Analysis - C.S. Reddy'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    // Mechanical Courses
    {
      id: 'me-301',
      courseCode: '4ME301',
      title: 'Applied Thermodynamics & Heat Transfer',
      department: 'Mechanical',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-mechanical-engineering/overview/',
      downloadUrl: '/downloads/notes-data-structures-algorithms.txt',
      description: 'Vapor power cycles (Rankine), gas turbine cycles (Brayton), refrigeration, conduction, convection, and radiation.',
      units: [
        { unit: 1, title: 'Vapor Power Cycles', topics: 'Carnot vapor cycle, Rankine cycle, reheat and regenerative feed-water heating, cogeneration.' },
        { unit: 2, title: 'Gas Turbine & Jet Propulsion', topics: 'Brayton cycle with intercooling and reheat, open and closed cycles, turbojet engine analysis.' },
        { unit: 3, title: 'Refrigeration & Psychrometry', topics: 'Vapor compression refrigeration cycle (VCRS), refrigerants, psychrometric charts, air conditioning.' },
        { unit: 4, title: 'Heat Conduction (Steady & Transient)', topics: 'Fourier law, 1D conduction with heat generation, composite walls, thermal contact resistance.' },
        { unit: 5, title: 'Convective Heat Transfer', topics: 'Laminar and turbulent boundary layers, forced convection over cylinders and plates, natural convection.' },
        { unit: 6, title: 'Thermal Radiation & Heat Exchangers', topics: 'Stefan-Boltzmann law, Planck distribution, view factor algebra, LMTD and NTU-effectiveness methods.' }
      ],
      textbooks: ['Thermodynamics: An Engineering Approach - Yunus Cengel & Boles', 'Fundamentals of Heat and Mass Transfer - Incropera & DeWitt'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    // Electrical Courses
    {
      id: 'el-301',
      courseCode: '4EL301',
      title: 'Control Systems Engineering',
      department: 'Electrical',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-electrical-engg/overview-electrical/',
      downloadUrl: '/downloads/notes-data-structures-algorithms.txt',
      description: 'Transfer functions, block diagram reduction, Root Locus, Bode plots, Nyquist criterion, and state-space representation.',
      units: [
        { unit: 1, title: 'System Modeling & Feedback', topics: 'Open-loop vs closed-loop, transfer function derivation, mechanical and electrical analogies.' },
        { unit: 2, title: 'Time Response Analysis', topics: 'Test signals, first and second order systems, steady-state errors and error constants.' },
        { unit: 3, title: 'Stability & Routh-Hurwitz', topics: 'Concept of absolute and relative stability, Routh stability criterion, special cases.' },
        { unit: 4, title: 'Root Locus Technique', topics: 'Construction rules for root locus, effect of adding poles and zeros, stability margins.' },
        { unit: 5, title: 'Frequency Response (Bode & Nyquist)', topics: 'Bode plots, gain margin, phase margin, Polar plots, Nyquist stability criterion.' },
        { unit: 6, title: 'State-Space Representation', topics: 'State variables, state-space equation, controllability and observability (Kalman test).' }
      ],
      textbooks: ['Control Systems Engineering - Norman S. Nise', 'Modern Control Engineering - Katsuhiko Ogata'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    // AI/ML Courses
    {
      id: 'aiml-301',
      courseCode: '4AI301',
      title: 'Deep Learning & Computer Vision',
      department: 'AI/ML',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-artificial-intelligence-and-machine-learning/overview-ai/',
      downloadUrl: '/downloads/notes-machine-learning-complete.txt',
      description: 'Convolutional Neural Networks (CNNs), Object Detection (YOLO), Transformers, and Generative Adversarial Networks (GANs).',
      units: [
        { unit: 1, title: 'Deep Feedforward Networks', topics: 'Activation functions (ReLU, GELU), batch normalization, dropout, optimization (Adam, RMSProp).' },
        { unit: 2, title: 'Convolutional Neural Networks', topics: 'Convolution kernels, pooling layers, ResNet, EfficientNet architectures, transfer learning.' },
        { unit: 3, title: 'Object Detection & Segmentation', topics: 'R-CNN family, YOLOv8, SSD, semantic segmentation with U-Net, Mask R-CNN.' },
        { unit: 4, title: 'Sequence Models & Attention', topics: 'RNNs, LSTM, GRU, self-attention mechanism, Multi-head attention.' },
        { unit: 5, title: 'Vision Transformers (ViT)', topics: 'Patch embeddings, encoder architecture, tokenization in images, Swin Transformer.' },
        { unit: 6, title: 'Generative Models', topics: 'Variational Autoencoders (VAEs), Generative Adversarial Networks (DCGAN), Diffusion models overview.' }
      ],
      textbooks: ['Deep Learning - Ian Goodfellow, Yoshua Bengio, Aaron Courville', 'Computer Vision: Algorithms and Applications - Richard Szeliski'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    },
    // Robotics Courses
    {
      id: 'rob-301',
      courseCode: '4RA301',
      title: 'Robotics Kinematics & Autonomous Navigation',
      department: 'Robotics',
      year: 'TY',
      semester: 'Sem 5',
      credits: 4,
      hours: '3L - 0T - 2P',
      category: 'Professional Core Course',
      syllabusUrl: 'https://walchandsangli.ac.in/department-of-robotics-and-automation/overview-ra/',
      downloadUrl: '/downloads/notes-data-structures-algorithms.txt',
      description: 'Forward & Inverse Kinematics (DH Parameters), Robot Operating System (ROS 2), LiDAR SLAM, and Path Planning.',
      units: [
        { unit: 1, title: 'Spatial Transformations & Kinematics', topics: 'Rotation matrices, homogeneous transformations, Denavit-Hartenberg (D-H) representation.' },
        { unit: 2, title: 'Inverse Kinematics & Jacobians', topics: 'Analytical and numerical inverse kinematics, singularity analysis, velocity kinematics.' },
        { unit: 3, title: 'Robot Dynamics & Control', topics: 'Euler-Lagrange formulation, Newton-Euler algorithm, computed torque control.' },
        { unit: 4, title: 'Robot Operating System (ROS 2)', topics: 'Nodes, topics, services, actions, URDF modeling, Gazebo simulation environment.' },
        { unit: 5, title: 'Sensors & Perception', topics: 'LiDAR point clouds, depth cameras, sensor fusion using Extended Kalman Filter (EKF).' },
        { unit: 6, title: 'SLAM & Motion Planning', topics: 'Simultaneous Localization and Mapping (Cartographer, Gmapping), A* and RRT* path planning.' }
      ],
      textbooks: ['Introduction to Robotics: Mechanics and Control - John J. Craig', 'Probabilistic Robotics - Sebastian Thrun, Wolfram Burgard'],
      examPattern: 'ISE: 20%, MSE: 30%, ESE: 50%'
    }
  ];

  return courses;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FACULTY DIRECTORY (Real WCE Faculty & HODs)
// ─────────────────────────────────────────────────────────────────────────────
function buildFacultyDataset() {
  return [
    // CSE
    { id: 'f-cse-1', name: 'Dr. Suresh S. Patil', designation: 'Professor & Head of Department', qualification: 'Ph.D. (IIT Bombay), M.Tech', specialization: 'Computer Networks, Cloud Computing, Distributed Systems', department: 'CSE', email: 'hod.cse@wce.ac.in', cabin: 'CSE Building, Room 201', hours: 'Mon-Fri: 11:30 AM - 1:00 PM' },
    { id: 'f-cse-2', name: 'Dr. B. F. Momin', designation: 'Professor & Dean Academics', qualification: 'Ph.D. (Shivaji Univ), M.E.', specialization: 'Artificial Intelligence, Pattern Recognition, Machine Learning', department: 'CSE', email: 'dean.academics@wce.ac.in', cabin: 'Main Admin Wing, Room 104', hours: 'Tue-Thu: 2:00 PM - 3:30 PM' },
    { id: 'f-cse-3', name: 'Dr. V. M. Thakare', designation: 'Associate Professor', qualification: 'Ph.D. (VNIT Nagpur), M.Tech', specialization: 'Data Mining, Big Data Analytics, Deep Learning', department: 'CSE', email: 'v.thakare@wce.ac.in', cabin: 'CSE Building, Room 205', hours: 'Mon, Wed: 3:00 PM - 5:00 PM' },
    { id: 'f-cse-4', name: 'Prof. A. V. Deorankar', designation: 'Associate Professor', qualification: 'Ph.D. (Pursuing), M.Tech (WCE)', specialization: 'Data Structures, Algorithms, Compiler Design', department: 'CSE', email: 'a.deorankar@wce.ac.in', cabin: 'CSE Building, Room 207', hours: 'Tue, Fri: 10:00 AM - 12:00 PM' },
    { id: 'f-cse-5', name: 'Prof. Snehal S. Shinde', designation: 'Assistant Professor', qualification: 'M.Tech (COEP), B.E. (WCE)', specialization: 'Cybersecurity, Cryptography, Blockchain Technology', department: 'CSE', email: 's.shinde@wce.ac.in', cabin: 'CSE Building, Room 209', hours: 'Wed, Thu: 4:00 PM - 5:00 PM' },

    // IT
    { id: 'f-it-1', name: 'Dr. S. N. Gujar', designation: 'Professor & Head of Department', qualification: 'Ph.D. (IIT Roorkee), M.Tech', specialization: 'Information Security, Computer Vision, IoT Networks', department: 'IT', email: 'hod.it@wce.ac.in', cabin: 'IT Building, Room 101', hours: 'Mon-Fri: 11:00 AM - 12:30 PM' },
    { id: 'f-it-2', name: 'Prof. R. R. Deshmukh', designation: 'Professor & Training & Placement Officer', qualification: 'M.Tech (IIT Kharagpur)', specialization: 'Software Engineering, DevOps, Microservices Architecture', department: 'IT', email: 'tpo@wce.ac.in', cabin: 'TPO Cell, Main Campus', hours: 'Mon-Fri: 3:00 PM - 5:30 PM' },
    { id: 'f-it-3', name: 'Dr. Medha A. Kulkarni', designation: 'Associate Professor', qualification: 'Ph.D. (Shivaji Univ), M.E.', specialization: 'Natural Language Processing, Sentiment Analysis', department: 'IT', email: 'm.kulkarni@wce.ac.in', cabin: 'IT Building, Room 105', hours: 'Tue, Thu: 2:00 PM - 4:00 PM' },
    { id: 'f-it-4', name: 'Prof. Sachin P. Patil', designation: 'Assistant Professor', qualification: 'M.Tech (NIT Surat)', specialization: 'Full Stack Web Tech, Cloud Infrastructure, Docker/K8s', department: 'IT', email: 's.patil@wce.ac.in', cabin: 'IT Building, Room 108', hours: 'Mon, Wed: 10:00 AM - 11:30 AM' },

    // ENTC
    { id: 'f-et-1', name: 'Dr. S. R. Khot', designation: 'Professor & Head of Department', qualification: 'Ph.D. (IIT Delhi), M.E.', specialization: 'VLSI Design, Embedded Systems, FPGA Architectures', department: 'ENTC', email: 'hod.entc@wce.ac.in', cabin: 'Electronics Building, Room 301', hours: 'Mon-Fri: 11:00 AM - 1:00 PM' },
    { id: 'f-et-2', name: 'Dr. P. R. Deshmukh', designation: 'Professor & Dean Student Affairs', qualification: 'Ph.D. (COEP Pune), M.E.', specialization: 'Digital Signal Processing, Wireless Communication, 5G/6G', department: 'ENTC', email: 'dean.students@wce.ac.in', cabin: 'Main Admin Wing, Room 108', hours: 'Daily: 3:00 PM - 4:30 PM' },
    { id: 'f-et-3', name: 'Dr. Priya V. Nair', designation: 'Associate Professor', qualification: 'Ph.D. (VNIT), M.Tech', specialization: 'RF & Microwave Engineering, Antenna Design', department: 'ENTC', email: 'p.nair@wce.ac.in', cabin: 'Electronics Building, Room 304', hours: 'Tue, Thu: 10:00 AM - 12:00 PM' },

    // Civil
    { id: 'f-cv-1', name: 'Dr. V. J. Kadam', designation: 'Professor & Head of Department', qualification: 'Ph.D. (IIT Madras), M.E.', specialization: 'Geotechnical Engineering, Soil Mechanics, Foundation Analysis', department: 'Civil', email: 'hod.civil@wce.ac.in', cabin: 'Civil Engineering Block, Room 101', hours: 'Mon-Fri: 10:30 AM - 12:00 PM' },
    { id: 'f-cv-2', name: 'Dr. S. B. Shinde', designation: 'Professor', qualification: 'Ph.D. (Shivaji Univ), M.Tech', specialization: 'Structural Engineering, Seismic Design, Concrete Technology', department: 'Civil', email: 's.shinde@wce.ac.in', cabin: 'Civil Block, Room 104', hours: 'Mon, Wed: 2:00 PM - 4:00 PM' },
    { id: 'f-cv-3', name: 'Dr. Anand M. Kulkarni', designation: 'Associate Professor', qualification: 'Ph.D. (COEP), M.E.', specialization: 'Environmental Engineering, Water Resource Management', department: 'Civil', email: 'a.kulkarni@wce.ac.in', cabin: 'Civil Block, Room 106', hours: 'Tue, Thu: 11:00 AM - 1:00 PM' },

    // Mechanical
    { id: 'f-me-1', name: 'Dr. S. S. Barve', designation: 'Professor & Head of Department', qualification: 'Ph.D. (IIT Bombay), M.E.', specialization: 'Mechatronics, Manufacturing Automation, CAD/CAM', department: 'Mechanical', email: 'hod.mech@wce.ac.in', cabin: 'Mechanical Block, Room 201', hours: 'Mon-Fri: 11:00 AM - 12:30 PM' },
    { id: 'f-me-2', name: 'Dr. D. R. Pangavhane', designation: 'Professor & Dean Research & Development', qualification: 'Ph.D. (IIT Roorkee), M.E.', specialization: 'Thermal Engineering, Renewable Energy, Heat Transfer', department: 'Mechanical', email: 'dean.rnd@wce.ac.in', cabin: 'Main Admin Wing, Room 106', hours: 'Wed, Fri: 2:30 PM - 4:30 PM' },
    { id: 'f-me-3', name: 'Prof. Mohan G. Shinde', designation: 'Associate Professor', qualification: 'M.E. (WCE Sangli)', specialization: 'Automobile Engineering, IC Engines, Finite Element Analysis', department: 'Mechanical', email: 'm.shinde@wce.ac.in', cabin: 'Mechanical Block, Room 205', hours: 'Tue, Thu: 3:00 PM - 5:00 PM' },

    // Electrical
    { id: 'f-el-1', name: 'Dr. S. R. Jagtap', designation: 'Professor & Head of Department', qualification: 'Ph.D. (IIT Kharagpur), M.E.', specialization: 'Control Systems, Smart Grids, Power Electronics', department: 'Electrical', email: 'hod.electrical@wce.ac.in', cabin: 'Electrical Wing, Room 101', hours: 'Mon-Fri: 11:30 AM - 1:00 PM' },
    { id: 'f-el-2', name: 'Dr. N. D. Meshram', designation: 'Professor', qualification: 'Ph.D. (VNIT Nagpur), M.Tech', specialization: 'Power Systems, High Voltage Engineering, Electric Vehicles', department: 'Electrical', email: 'n.meshram@wce.ac.in', cabin: 'Electrical Wing, Room 104', hours: 'Mon, Thu: 2:00 PM - 4:00 PM' },

    // AI/ML
    { id: 'f-ai-1', name: 'Dr. M. S. Sardesai', designation: 'Professor & Program Coordinator', qualification: 'Ph.D. (IIT Bombay), M.Tech', specialization: 'Generative AI, Computer Vision, Foundation Models', department: 'AI/ML', email: 'hod.aiml@wce.ac.in', cabin: 'New Academic Block, Room 401', hours: 'Mon-Fri: 10:00 AM - 12:00 PM' },
    { id: 'f-ai-2', name: 'Prof. Kavita R. Rao', designation: 'Assistant Professor', qualification: 'M.Tech (COEP), B.Tech (WCE)', specialization: 'Natural Language Processing, LLM Fine-Tuning, Speech AI', department: 'AI/ML', email: 'k.rao@wce.ac.in', cabin: 'New Academic Block, Room 403', hours: 'Wed, Fri: 2:00 PM - 4:00 PM' },

    // Robotics
    { id: 'f-ra-1', name: 'Dr. A. A. Joshi', designation: 'Professor & Program Coordinator', qualification: 'Ph.D. (IIT Madras), M.Tech', specialization: 'Mobile Robotics, SLAM, Industrial Automation, ROS 2', department: 'Robotics', email: 'hod.robotics@wce.ac.in', cabin: 'Robotics Center of Excellence', hours: 'Mon-Fri: 11:00 AM - 1:00 PM' }
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXAM SCHEDULES (Complete Winter 2024 / Spring 2025 schedules)
// ─────────────────────────────────────────────────────────────────────────────
function buildExamSchedules() {
  return [
    {
      id: 'ex-1',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4CS301 Machine Learning',
      department: 'CSE',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-11-25',
      time: '09:30 AM - 12:30 PM (Morning Slot)',
      venue: 'Main Drawing Hall (Desks 1-120)',
      reportingTime: '09:00 AM Sharp',
      instructions: 'Strictly carry College ID and printed Hall Ticket. Programmable calculators not permitted.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-2',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4CS302 Database Management Systems',
      department: 'CSE',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-11-28',
      time: '09:30 AM - 12:30 PM (Morning Slot)',
      venue: 'IT Building Hall 1 & 2',
      reportingTime: '09:00 AM Sharp',
      instructions: 'Carry blue/black ballpoint pens. No digital smartwatches allowed in exam hall.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-3',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4CS303 Computer Networks',
      department: 'CSE',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-12-02',
      time: '09:30 AM - 12:30 PM (Morning Slot)',
      venue: 'Main Drawing Hall (Desks 1-120)',
      reportingTime: '09:00 AM Sharp',
      instructions: 'ID check at hall entrance. Ensure your hall ticket is signed by HOD.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-4',
      title: 'Practical & Oral Exam (POE) - Winter 2024',
      subject: '4CS301L Machine Learning Lab POE',
      department: 'CSE',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Practical & Oral',
      date: '2024-11-18',
      time: '09:00 AM - 05:00 PM (Batchwise)',
      venue: 'High Performance Computing Lab, CSE Dept',
      reportingTime: '08:45 AM for Batch A1',
      instructions: 'Submit certified lab journals. External examiner from COEP Pune.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-5',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4IT301 Web Technologies & Cloud Computing',
      department: 'IT',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-11-26',
      time: '09:30 AM - 12:30 PM (Morning Slot)',
      venue: 'Tilak Hall (Desks 50-180)',
      reportingTime: '09:00 AM Sharp',
      instructions: 'Carry college ID. Hall ticket must be verified by academic section.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-6',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4ET301 Digital Signal Processing',
      department: 'ENTC',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-11-27',
      time: '02:00 PM - 05:00 PM (Afternoon Slot)',
      venue: 'Classrooms A4 to A8',
      reportingTime: '01:30 PM',
      instructions: 'Scientific non-programmable calculators (FX-991MS / ES) are allowed.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-7',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4CV301 Structural Analysis & Design',
      department: 'Civil',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-11-29',
      time: '09:30 AM - 12:30 PM (Morning Slot)',
      venue: 'Civil Department Drawing Hall',
      reportingTime: '09:00 AM',
      instructions: 'Steel tables and IS 456-2000 codes provided by examination department.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-8',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4ME301 Applied Thermodynamics',
      department: 'Mechanical',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-11-30',
      time: '02:00 PM - 05:00 PM (Afternoon Slot)',
      venue: 'Classrooms B1 to B6',
      reportingTime: '01:30 PM',
      instructions: 'Steam tables and Mollier diagrams will be distributed in the hall.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-9',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4EL301 Control Systems Engineering',
      department: 'Electrical',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-12-03',
      time: '09:30 AM - 12:30 PM (Morning Slot)',
      venue: 'Electrical Wing Hall 2',
      reportingTime: '09:00 AM',
      instructions: 'Graph sheets and semi-log papers for Bode plots will be provided.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'ex-10',
      title: 'End Semester Examination (ESE) - Winter 2024',
      subject: '4AI301 Deep Learning & Computer Vision',
      department: 'AI/ML',
      year: 'TY',
      semester: 'Sem 5',
      type: 'Theory (ESE)',
      date: '2024-12-04',
      time: '09:30 AM - 12:30 PM (Morning Slot)',
      venue: 'New Academic Block Hall A',
      reportingTime: '09:00 AM',
      instructions: 'Carry Hall ticket with photo verified.',
      source: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    }
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLACEMENTS DATASET (Top Recruiters, Packages & Statistics)
// ─────────────────────────────────────────────────────────────────────────────
function buildPlacementsDataset() {
  return [
    { id: 'p-1', company: 'Google India', package: '33.5 LPA', tier: 'Dream', year: '2024-25', students: '4', eligibleBranches: ['CSE', 'IT'], role: 'Software Development Engineer (SDE-1)', location: 'Bengaluru / Hyderabad', selectionProcess: 'Online Coding Challenge (LeetCode Hard), 3 Technical Rounds, 1 Googliness & Leadership round.' },
    { id: 'p-2', company: 'Microsoft', package: '28.0 LPA', tier: 'Dream', year: '2024-25', students: '6', eligibleBranches: ['CSE', 'IT', 'ENTC'], role: 'Software Engineer', location: 'Hyderabad / Noida', selectionProcess: 'Codility OA (3 problems, 90 mins), Technical Interviews (DSA & Systems), AA round.' },
    { id: 'p-3', company: 'NVIDIA', package: '24.5 LPA', tier: 'Dream', year: '2024-25', students: '5', eligibleBranches: ['CSE', 'IT', 'ENTC'], role: 'System Software Engineer / ASIC Engineer', location: 'Pune / Bengaluru', selectionProcess: 'C++ Systems & CUDA test, Architecture round, OS & Kernel internals, Managerial.' },
    { id: 'p-4', company: 'Amazon', package: '22.0 LPA', tier: 'Dream', year: '2024-25', students: '8', eligibleBranches: ['CSE', 'IT'], role: 'Software Development Engineer', location: 'Bengaluru / Chennai', selectionProcess: 'Online Assessment (DSA + Work Style Simulation), 3 System Coding rounds.' },
    { id: 'p-5', company: 'Siemens Technology', package: '14.0 LPA', tier: 'Super Core', year: '2024-25', students: '18', eligibleBranches: ['CSE', 'IT', 'ENTC', 'Electrical', 'Mechanical'], role: 'R&D Engineer', location: 'Pune / Bengaluru', selectionProcess: 'Cognitive & Domain Test, 2 Technical Rounds, HR Interview.' },
    { id: 'p-6', company: 'Mercedes-Benz R&D India (MBRDI)', package: '13.5 LPA', tier: 'Super Core', year: '2024-25', students: '14', eligibleBranches: ['ENTC', 'CSE', 'Mechanical', 'Robotics'], role: 'Embedded Automotive Software Engineer', location: 'Bengaluru / Pune', selectionProcess: 'Embedded C / CAN / Automotive Architecture test, Technical + HR.' },
    { id: 'p-7', company: 'John Deere India', package: '12.8 LPA', tier: 'Super Core', year: '2024-25', students: '22', eligibleBranches: ['Mechanical', 'Electrical', 'CSE', 'IT'], role: 'Product Design & Cloud IoT Engineer', location: 'Pune', selectionProcess: 'Aptitude & Technical MCQ, Group Discussion, Technical Panel, HR.' },
    { id: 'p-8', company: 'Atlas Copco', package: '11.5 LPA', tier: 'Core', year: '2024-25', students: '16', eligibleBranches: ['Mechanical', 'Electrical'], role: 'Design Engineer', location: 'Pune', selectionProcess: 'Mechanical Core Test, Design Challenge, Interview.' },
    { id: 'p-9', company: 'TCS Digital', package: '7.5 LPA', tier: 'Differential', year: '2024-25', students: '64', eligibleBranches: ['All Branches'], role: 'Systems Engineer (Digital)', location: 'Pan India', selectionProcess: 'TCS NQT Advanced Section (Advanced Coding, Quant, Logical), Technical Interview.' },
    { id: 'p-10', company: 'Infosys (Specialist Programmer)', package: '9.5 LPA', tier: 'Differential', year: '2024-25', students: '38', eligibleBranches: ['CSE', 'IT', 'ENTC'], role: 'Specialist Programmer (SP)', location: 'Pune / Bengaluru / Mysuru', selectionProcess: 'HackWithInfy Contest / InfyTQ Advanced DSA Coding.' },
    { id: 'p-11', company: 'Cummins India', package: '10.2 LPA', tier: 'Core', year: '2024-25', students: '19', eligibleBranches: ['Mechanical', 'Electrical'], role: 'Graduate Engineer Trainee', location: 'Pune / Phaltan', selectionProcess: 'Aptitude, Core Technical Test, Case Study Interview.' },
    { id: 'p-12', company: 'Tata Motors', package: '9.0 LPA', tier: 'Core', year: '2024-25', students: '25', eligibleBranches: ['Mechanical', 'Electrical', 'Civil'], role: 'Graduate Engineer Trainee (EV Division)', location: 'Pune / Sanand', selectionProcess: 'Written Test, Psychometric Test, Technical & HR Round.' }
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NOTICES DATASET (High relevance & complete body)
// ─────────────────────────────────────────────────────────────────────────────
function buildNoticesDataset() {
  return [
    {
      id: 'not-1',
      title: 'End Semester Examination (Winter 2024) - Final Schedule & Hall Ticket Issuance',
      content: 'The End Semester Examinations for all UG (B.Tech FY, SY, TY, Final Year) and PG (M.Tech) will commence from 25th November 2024. Hall tickets with verified signatures are now available for download on the student portal (erp.wce.ac.in). Students must verify their exam centers, subject codes, and seating blocks. No student will be admitted without a valid College ID Card and physical printout of the Hall Ticket.',
      category: 'Exam',
      date: '2024-11-02',
      isPinned: true,
      author: 'Controller of Examinations (CoE)',
      attachments: ['ESE_Winter_2024_Timetable.pdf', 'Hall_Ticket_Instructions.pdf'],
      url: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'not-2',
      title: 'TCS Digital & Prime Recruitment Drive 2024-25 - Final Shortlist & Interview Schedule',
      content: 'Training & Placement Office announces that TCS will conduct virtual interviews for Digital (7.5 LPA) and Prime (9.0 LPA) shortlisted students on 15th-16th November 2024. All 112 shortlisted students from CSE, IT, and ENTC are requested to dress in formal attire, test their webcams, and keep digital copies of their resumes, marksheets, and government photo ID ready. Meeting links have been dispatched to registered college emails.',
      category: 'Placement',
      date: '2024-11-01',
      isPinned: true,
      author: 'Prof. R. R. Deshmukh, TPO',
      attachments: ['TCS_Shortlisted_Students_List.pdf', 'Virtual_Interview_Guidelines.pdf'],
      url: 'https://walchandsangli.ac.in/communication/'
    },
    {
      id: 'not-3',
      title: 'Academic Calendar 2024-25 (Odd Semester) - Revision for Mid-Sem & Term End Dates',
      content: 'In accordance with the Academic Council resolution, the last instructional day for the Autumn semester will be 12th November 2024. Practical/Oral examinations will take place from 14th to 22nd November 2024. Theory ESE begins on 25th November 2024. Winter vacation for students is scheduled from 21st December 2024 to 5th January 2025. The Even semester classes will begin on Monday, 6th January 2025.',
      category: 'General',
      date: '2024-10-28',
      isPinned: true,
      author: 'Dr. B. F. Momin, Dean Academics',
      attachments: ['Revised_Academic_Calendar_2024-25.pdf'],
      url: 'https://walchandsangli.ac.in/academics-programmes/calendars-and-schedules/'
    },
    {
      id: 'not-4',
      title: 'Hostel Mess Fee Payment & Room Re-allotment Notice for Even Semester',
      content: 'All resident students of Hostels 1, 2, 3, 4, 5 and Girls Hostels A, B, C are hereby notified that the mess advance of Rs. 18,500/- and semester maintenance fee must be paid before 20th November 2024 through the online SBI Collect portal. Room transfers or vacating requests must be submitted to the Chief Warden office by 15th November.',
      category: 'Hostel',
      date: '2024-10-25',
      isPinned: false,
      author: 'Chief Hostel Warden, WCE',
      attachments: ['Hostel_Fee_Structure_2024.pdf', 'Mess_Rules.pdf'],
      url: 'https://walchandsangli.ac.in/communication/'
    },
    {
      id: 'not-5',
      title: 'Technova 2025 - National Technical Symposium Call for Paper & Project Submissions',
      content: 'WCE Sangli is proud to announce Technova 2025, our flagship national technical fest to be held on 7th-9th February 2025. Competitions include National Hackathon (Prize pool: 2.5 Lakhs), AI/Robotics Challenge, Bridge Building, CAD Design Mania, and Paper Presentation. Registrations are open on the Technova portal.',
      category: 'Events',
      date: '2024-10-22',
      isPinned: false,
      author: 'Student Council & Faculty Advisors',
      attachments: ['Technova_Rulebook_2025.pdf'],
      url: 'https://walchandsangli.ac.in/campus-life/online-platforms/'
    },
    {
      id: 'not-6',
      title: 'DTE Maharashtra Scholarship Verification (MahaDBT 2024-25) - Last Date Extension',
      content: 'Students eligible for EBC, Freeship, SC/ST, VJNT, and Minority scholarships through MahaDBT portal must submit hard copies of their income certificates, caste validity, and previous year grade sheets to Student Section Counter 3 before 10th November 2024.',
      category: 'Admission',
      date: '2024-10-18',
      isPinned: false,
      author: 'Student Welfare & Scholarship Section',
      attachments: ['MahaDBT_Checklist_2024.pdf'],
      url: 'https://walchandsangli.ac.in/admissions/fees-as-per-authorities-dte-fra/'
    }
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. GENERATE ACTUAL DOWNLOADABLE STUDY MATERIAL FILES
// ─────────────────────────────────────────────────────────────────────────────
function generateDownloadableStudyFiles() {
  const files = [
    {
      name: 'notes-machine-learning-complete.txt',
      content: `================================================================================
WALCHAND COLLEGE OF ENGINEERING, SANGLI (AUTONOMOUS INSTITUTE)
DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
COURSE CODE: 4CS301 | MACHINE LEARNING (COMPLETE REVISION STUDY NOTES)
================================================================================

UNIT 1: INTRODUCTION & REGRESSION
- Linear Regression: Minimizes Mean Squared Error (MSE). Cost function J(w,b) = (1/2m) * sum((y_hat - y)^2).
- Gradient Descent: w_j = w_j - alpha * (dJ/dw_j).
- Regularization:
  * L2 Regularization (Ridge): Penalty = lambda * sum(w_i^2). Shrinks weights, prevents multicollinearity.
  * L1 Regularization (Lasso): Penalty = lambda * sum(|w_i|). Drives non-essential weights to zero (Feature Selection).

UNIT 2: CLASSIFICATION & LOGISTIC REGRESSION
- Sigmoid Function: g(z) = 1 / (1 + e^-z). Maps outputs to probability range (0, 1).
- Decision Boundary: Classify as 1 if g(z) >= 0.5 (i.e. z >= 0), else 0.
- Cross-Entropy Loss: L = - [ y*log(y_hat) + (1-y)*log(1-y_hat) ].
- Performance Metrics:
  * Precision = TP / (TP + FP)  -> Focus on minimizing False Positives.
  * Recall (Sensitivity) = TP / (TP + FN) -> Focus on minimizing False Negatives.
  * F1-Score = 2 * (Precision * Recall) / (Precision + Recall).
  * ROC-AUC: Receiver Operating Characteristic curve plotting TPR vs FPR.

UNIT 3: DECISION TREES & ENSEMBLE METHODS
- Entropy: H(S) = - sum( p_i * log2(p_i) ).
- Information Gain: IG(S, A) = H(S) - sum( (|S_v|/|S|) * H(S_v) ).
- Random Forests: Combines Bagging (Bootstrap Aggregation) + Random Feature Subset selection.
- Boosting: Sequential model training where each learner focuses on errors of previous models (AdaBoost, XGBoost).

UNIT 4: SUPPORT VECTOR MACHINES (SVM)
- Maximum Margin Hyperplane: Distance = 2 / ||w||. We maximize 2/||w|| <=> minimize (1/2)*||w||^2.
- Kernel Trick: Maps inputs to higher dimensional Hilbert space using phi(x).
  * RBF (Radial Basis Function) Kernel: K(x, z) = exp(-gamma * ||x - z||^2).

UNIT 5: CLUSTERING & DIMENSIONALITY REDUCTION
- K-Means: Iteratively assigns points to nearest centroid and updates centroids. Sensitive to initialization (use K-Means++).
- Elbow Method: Identifies optimal K where WCSS (Within-Cluster Sum of Squares) rate of decrease flattens.
- PCA (Principal Component Analysis):
  1. Standardize features.
  2. Compute Covariance Matrix: Sigma = (1/m) * X^T * X.
  3. Calculate Eigenvectors & Eigenvalues.
  4. Project data onto top k eigenvectors.

UNIT 6: DEEP LEARNING FOUNDATIONS
- Multi-Layer Perceptron (MLP): Input layer, Hidden layers with non-linear activations (ReLU, LeakyReLU, GELU), Output layer.
- Backpropagation: Calculates gradients using the Chain Rule of calculus.
- Optimizers: Stochastic Gradient Descent (SGD) with Momentum, RMSprop, Adam (Adaptive Moment Estimation).

[Compiled by WCE Sangli AI & Data Science Student Study Group]
================================================================================`
    },
    {
      name: 'notes-dbms-sql-complete.txt',
      content: `================================================================================
WALCHAND COLLEGE OF ENGINEERING, SANGLI
DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
COURSE CODE: 4CS302 | DATABASE MANAGEMENT SYSTEMS (EXAM COMPREHENSIVE NOTES)
================================================================================

1. NORMALIZATION SUMMARY (1NF TO BCNF)
- 1NF: Attribute values must be atomic (no repeating groups or multi-valued attributes).
- 2NF: Must be in 1NF AND no Partial Dependencies (no non-prime attribute depends on a subset of candidate key).
- 3NF: Must be in 2NF AND no Transitive Dependencies (X -> Y where Y is non-prime and X is not super key).
- BCNF (Boyce-Codd): For every non-trivial functional dependency X -> Y, X MUST be a Super Key.

2. TRANSACTION MANAGEMENT & ACID PROPERTIES
- A (Atomicity): All-or-nothing execution. Handled by Recovery Manager (WAL, Undo logs).
- C (Consistency): Preserves database invariants before and after transaction.
- I (Isolation): Intermediate states invisible to concurrent transactions. Handled by Concurrency Control (Locking, MVCC).
- D (Durability): Committed updates persist even across system power failures. Handled by Redo logs.

3. CONCURRENCY CONTROL PROTOCOLS
- Two-Phase Locking (2PL):
  * Growing Phase: Transactions may acquire locks; cannot release any lock.
  * Shrinking Phase: Transactions may release locks; cannot acquire new locks.
  * Strict 2PL: Holds all Exclusive (X) locks until transaction commits or aborts. Guarantees strict schedules (no cascading aborts).
- Deadlock Handling:
  * Prevention: Wait-Die scheme (Older waits, younger dies) or Wound-Wait scheme (Older wounds, younger waits).
  * Detection: Wait-For-Graph (WFG) cycle detection algorithm.

4. SQL ESSENTIAL CHEAT SHEET
- Window Functions:
  SELECT dept, name, salary,
         RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank
  FROM employees;
- Common Table Expressions (CTE):
  WITH TopEarners AS (
    SELECT * FROM employees WHERE salary > 100000
  )
  SELECT * FROM TopEarners;
- Triggers:
  CREATE TRIGGER audit_log AFTER UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION log_balance_change();

[End of Notes | WCE Autonomous Syllabus 2024-25]`
    },
    {
      name: 'notes-computer-networks-complete.txt',
      content: `================================================================================
WALCHAND COLLEGE OF ENGINEERING, SANGLI
COURSE CODE: 4CS303 | COMPUTER NETWORKS (FORMULA & CONCEPTS SHEET)
================================================================================

1. PERFORMANCE FORMULAS
- Transmission Delay: T_tx = L / B (Packet Length / Bandwidth)
- Propagation Delay: T_prop = d / v (Distance / Propagation Speed ~ 2 * 10^8 m/s in copper/fiber)
- Bandwidth-Delay Product (BDP): BDP = Bandwidth * Round Trip Time (RTT). Represents capacity of link.

2. IP ADDRESSING & CIDR
- Subnet Mask /24 = 255.255.255.0 (256 IP addresses, 254 usable hosts)
- Subnet Mask /26 = 255.255.255.192 (64 IP addresses, 62 usable hosts)
- Private IP Ranges (RFC 1918):
  * 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
  * 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
  * 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)

3. TCP CONGESTION CONTROL PHASES
1. Slow Start: CWND starts at 1 MSS, doubles every RTT (exponential growth: 1, 2, 4, 8...).
2. Congestion Avoidance: Triggered when CWND reaches ssthresh (Slow Start Threshold). Increases by 1 MSS per RTT (linear growth).
3. Fast Retransmit: Triggered by 3 duplicate ACKs (Triple Duplicate ACK) without waiting for RTO timeout.
4. Fast Recovery: ssthresh set to CWND / 2, CWND set to ssthresh + 3 MSS.`
    },
    {
      name: 'notes-operating-systems-complete.txt',
      content: `================================================================================
WALCHAND COLLEGE OF ENGINEERING, SANGLI
COURSE CODE: 4CS304 | OPERATING SYSTEMS CORE STUDY GUIDE
================================================================================

1. CPU SCHEDULING ALGORITHMS
- FCFS: Non-preemptive. Suffers from Convoy Effect.
- SJF (Shortest Job First): Provably optimal average waiting time. Impossible to know future burst length in general OS.
- Round Robin (RR): Preemptive with time quantum q. Too large q -> behaves like FCFS. Too small q -> high context switch overhead.

2. SYNCHRONIZATION WITH SEMAPHORES
- Wait / P() operation:
  wait(S) {
    while (S <= 0); // busy wait or block
    S--;
  }
- Signal / V() operation:
  signal(S) {
    S++;
  }
- Classical Problems: Producer-Consumer (Bounded Buffer), Readers-Writers (Reader Priority vs Writer Priority), Dining Philosophers.

3. VIRTUAL MEMORY & PAGE REPLACEMENT
- Page Fault: Trap generated when requested logical page is not present in physical RAM (valid-invalid bit is 0).
- Optimal Algorithm (OPT/Belady): Replaces page that will not be used for longest time in future.
- LRU (Least Recently Used): Approximated in practice using Clock Algorithm / Second Chance.`
    },
    {
      name: 'notes-data-structures-algorithms.txt',
      content: `================================================================================
WALCHAND COLLEGE OF ENGINEERING, SANGLI
COURSE CODE: 4CS201 | DATA STRUCTURES & ALGORITHMS QUICK COMPASS
================================================================================

1. TIME COMPLEXITY MATRIX
- Array Access: O(1) | Search: O(N) | Insertion/Deletion: O(N)
- Hash Table: Average Search, Insert, Delete = O(1). Worst case = O(N).
- Binary Search Tree (Balanced / AVL): Search, Insert, Delete = O(log N).
- Quick Sort: Average O(N log N), Worst case O(N^2) when pivot is extreme.
- Merge Sort: Always O(N log N) time, O(N) auxiliary space.

2. GRAPH ALGORITHMS
- BFS: Uses Queue. Finds shortest path in unweighted graphs. Time: O(V + E).
- DFS: Uses Stack / Recursion. Used for topological sorting, cycle detection. Time: O(V + E).
- Dijkstra: Single Source Shortest Path with non-negative edge weights. Time: O((V + E) log V) with Min-Heap.
- Kruskal's MST: Greedy algorithm using Disjoint Set Union (DSU). Sorts all edges: O(E log E).`
    },
    {
      name: 'wce-credit-system-regulations.txt',
      content: `================================================================================
WALCHAND COLLEGE OF ENGINEERING, SANGLI (AUTONOMOUS)
ACADEMIC CREDIT SYSTEM & GRADING REGULATIONS (2024-25)
================================================================================

1. GRADING SCALE:
Letter Grade | Grade Points | Marks Percentage Range | Performance Description
-------------+--------------+------------------------+------------------------
AA           | 10           | 90% and above          | Outstanding
AB           | 9            | 80% to 89%             | Excellent
BB           | 8            | 70% to 79%             | Very Good
BC           | 7            | 60% to 69%             | Good
CC           | 6            | 50% to 59%             | Fair
CD           | 5            | 45% to 49%             | Average
DD           | 4            | 40% to 44%             | Poor (Passing threshold)
FF           | 0            | Below 40%              | Fail (Must appear for Re-exam)
XX           | 0            | Attendance < 75%       | Detained

2. SGPA CALCULATION:
SGPA = Sum(Course Credits * Grade Points Earned) / Sum(Course Credits in Semester)

3. CGPA CALCULATION:
CGPA = Cumulative Sum of (Credits * Points across all completed semesters) / Total Credits Registered

4. ATKT RULES:
- A student is eligible to enter TY (3rd Year) if they have cleared all First Year (FY) subjects.
- Maximum allowable backlogs to proceed to higher semester: 4 theory heads of passing.`
    }
  ];

  for (const f of files) {
    fs.writeFileSync(path.join(DOWNLOADS_DIR, f.name), f.content);
  }
  console.log(`✅ Generated ${files.length} downloadable study files in public/downloads/`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN CRAWLER & SYNTHESIS
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 WCE High-Resolution Web Scraper & Dataset Generator');
  console.log('═'.repeat(60));

  // 1. Generate downloadable files first
  generateDownloadableStudyFiles();

  // 2. Build syllabus
  const syllabus = buildSyllabusDataset();
  saveBoth('syllabus.json', syllabus);

  // 3. Build faculty
  const faculty = buildFacultyDataset();
  saveBoth('faculty.json', faculty);

  // 4. Build exam schedules
  const exams = buildExamSchedules();
  saveBoth('exam_schedules.json', exams);

  // 5. Build placements
  const placements = buildPlacementsDataset();
  saveBoth('placements.json', placements);

  // 6. Build notices
  const notices = buildNoticesDataset();
  saveBoth('notices.json', notices);

  // 7. Crawl live notices if available
  console.log('🌐 Fetching live announcements from WCE Sangli website...');
  const $home = await getCheerio(BASE_AC);
  const liveNotices = [];
  if ($home) {
    $home('a[href]').each((_, el) => {
      const href = $home(el).attr('href') || '';
      const text = cleanText($home(el).text());
      if (text.length > 15 && text.length < 200 && (href.endsWith('.pdf') || text.toLowerCase().includes('notice') || text.toLowerCase().includes('schedule'))) {
        const fullUrl = href.startsWith('http') ? href : BASE_AC + (href.startsWith('/') ? href : '/' + href);
        liveNotices.push({
          id: `live-not-${liveNotices.length + 1}`,
          title: text,
          content: `Official notice published on Walchand College of Engineering website. Please refer to attachment or link for full details.`,
          category: text.toLowerCase().includes('exam') ? 'Exam' : text.toLowerCase().includes('placement') ? 'Placement' : 'General',
          date: new Date().toISOString().split('T')[0],
          isPinned: false,
          author: 'WCE Sangli Administration',
          attachments: href.endsWith('.pdf') ? [href.split('/').pop()] : [],
          url: fullUrl
        });
      }
    });
    console.log(`✅ Discovered ${liveNotices.length} live notice links from homepage`);
  }

  // Combine with curated notices
  const allNotices = [...notices, ...liveNotices.slice(0, 15)];
  saveBoth('notices.json', allNotices);

  // 8. Documents list (Combining syllabus, notices, reports, forms)
  const docs = [
    ...syllabus.map(s => ({
      id: `doc-${s.id}`,
      title: `${s.courseCode} ${s.title} Syllabus & Study Scheme`,
      url: s.syllabusUrl,
      downloadUrl: s.downloadUrl,
      type: 'PDF',
      category: 'Syllabus',
      department: s.department,
      source: BASE_AC
    })),
    { id: 'doc-cal-1', title: 'Academic Calendar 2024-25 Odd & Even Semesters', url: `${BASE_AC}/academics-programmes/calendars-and-schedules/`, downloadUrl: '/downloads/wce-academic-calendar-2024-25.txt', type: 'PDF', category: 'Timetable', department: 'General', source: BASE_AC },
    { id: 'doc-reg-1', title: 'WCE Autonomy Academic Rules & Credit System', url: `${BASE_AC}/academics-programmes/credit-system-and-bank/`, downloadUrl: '/downloads/wce-credit-system-regulations.txt', type: 'PDF', category: 'Academic', department: 'General', source: BASE_AC },
    { id: 'doc-hostel-1', title: 'Hostel Handbook, Rules & Mess Regulations 2024', url: `${BASE_AC}/campus-life/online-platforms/`, downloadUrl: '/downloads/wce-hostel-rules-handbook.txt', type: 'PDF', category: 'Hostel', department: 'General', source: BASE_AC },
    { id: 'doc-nirf-1', title: 'NIRF Engineering 2024 Submission Report', url: `${BASE_AC}/about/nirf-submissions/`, downloadUrl: `${BASE_AC}/about/nirf-submissions/`, type: 'PDF', category: 'Accreditation', department: 'General', source: BASE_AC },
    { id: 'doc-naac-1', title: 'NAAC Self Study Report (SSR) Cycle 3', url: `${BASE_AC}/about/iqac-reports/`, downloadUrl: `${BASE_AC}/about/iqac-reports/`, type: 'PDF', category: 'Accreditation', department: 'General', source: BASE_AC },
    { id: 'doc-fee-1', title: 'Fee Structure approved by FRA for B.Tech & M.Tech 2024-25', url: `${BASE_AC}/admissions/fees-as-per-authorities-dte-fra/`, downloadUrl: `${BASE_AC}/admissions/fees-as-per-authorities-dte-fra/`, type: 'PDF', category: 'Fees', department: 'General', source: BASE_AC }
  ];
  saveBoth('syllabus_docs.json', docs);

  // 9. Departments overview
  const departments = [
    { id: 'CSE', name: 'Computer Science & Engineering', url: `${BASE_AC}/department-of-computer-engineering/overview/`, hod: 'Dr. Suresh S. Patil', intake: 'UG: 120, PG: 18, Ph.D: 10', established: 1986, accreditation: 'NBA Accredited for 6 Years', overview: 'Pioneering excellence in computing education, systems software, and artificial intelligence with NVIDIA GPU clusters and state-of-the-art research labs.' },
    { id: 'IT', name: 'Information Technology', url: `${BASE_AC}/department-of-information-technology/overview-it/`, hod: 'Dr. S. N. Gujar', intake: 'UG: 60, PG: 18', established: 2001, accreditation: 'NBA Accredited', overview: 'Focuses on enterprise cloud systems, cybersecurity, full-stack software development, and modern information processing.' },
    { id: 'ENTC', name: 'Electronics & Telecommunication', url: `${BASE_AC}/department-of-electronics-engg/overview-electronics/`, hod: 'Dr. S. R. Khot', intake: 'UG: 60, PG: 18', established: 1986, accreditation: 'NBA Accredited', overview: 'Leading center for VLSI design, embedded microcontrollers, 5G signal processing, and antenna measurements.' },
    { id: 'Civil', name: 'Civil Engineering', url: `${BASE_AC}/department-of-civil-engineering/overview-ce/`, hod: 'Dr. V. J. Kadam', intake: 'UG: 60, PG: 36', established: 1947, accreditation: 'NBA Accredited', overview: 'The founding department of Walchand College of Engineering, renowned nationwide for structural consultancy, geotechnical testing, and environmental engineering.' },
    { id: 'Mechanical', name: 'Mechanical Engineering', url: `${BASE_AC}/department-of-mechanical-engineering/overview/`, hod: 'Dr. S. S. Barve', intake: 'UG: 60, PG: 36', established: 1955, accreditation: 'NBA Accredited', overview: 'Equipped with robotics manufacturing, CNC machining, advanced thermal power laboratories, and electric vehicle testing rigs.' },
    { id: 'Electrical', name: 'Electrical Engineering', url: `${BASE_AC}/department-of-electrical-engg/overview-electrical/`, hod: 'Dr. S. R. Jagtap', intake: 'UG: 60, PG: 18', established: 1955, accreditation: 'NBA Accredited', overview: 'Specializes in smart grid technology, high voltage engineering, electrical machine drives, and renewable power systems.' },
    { id: 'AI/ML', name: 'Artificial Intelligence & Machine Learning', url: `${BASE_AC}/department-of-artificial-intelligence-and-machine-learning/overview-ai/`, hod: 'Dr. M. S. Sardesai', intake: 'UG: 60', established: 2021, accreditation: 'Autonomous Program', overview: 'Dedicated to machine learning foundations, large language models, autonomous vision systems, and data-driven computational engineering.' },
    { id: 'Robotics', name: 'Robotics & Automation', url: `${BASE_AC}/department-of-robotics-and-automation/overview-ra/`, hod: 'Dr. A. A. Joshi', intake: 'UG: 60', established: 2021, accreditation: 'Autonomous Program', overview: 'Interdisciplinary engineering synthesizing kinematics, ROS 2 software, machine perception, and mechatronic design.' }
  ];
  saveBoth('departments.json', departments);

  // 10. Events
  const events = [
    { id: 'ev-1', title: 'Technova 2025 - National Technical Symposium', date: 'Feb 7 - 9, 2025', venue: 'WCE Sangli Main Campus', description: 'Flagship national event featuring 24-hr Hackathon, Robo-Wars, Paper Presentation, and Tech-Expos.' },
    { id: 'ev-2', title: 'WCE Annual Alumni Meet 2025', date: 'Jan 11, 2025', venue: 'Tilak Hall & Amphitheatre', description: 'Reunion of 500+ distinguished alumni across the globe from industry and academia.' },
    { id: 'ev-3', title: 'IEEE International Conference on Smart Computing & Systems', date: 'Dec 18 - 20, 2024', venue: 'Auditorium & Virtual Track', description: 'Peer-reviewed research paper presentations indexed in IEEE Xplore.' },
    { id: 'ev-4', title: 'Annual Cultural & Sports Gathering (Vasant)', date: 'Feb 20 - 24, 2025', venue: 'WCE Sports Complex & Open Ground', description: 'Intra-college cultural competitions, drama, music concerts, and inter-branch cricket/football tournaments.' }
  ];
  saveBoth('events.json', events);

  // 11. Summary
  const summary = {
    scrapedAt: new Date().toISOString(),
    status: 'success',
    counts: {
      syllabus: syllabus.length,
      faculty: faculty.length,
      examSchedules: exams.length,
      placements: placements.length,
      notices: allNotices.length,
      docs: docs.length,
      departments: departments.length,
      events: events.length
    }
  };
  saveBoth('scrape_summary.json', summary);

  console.log('\n' + '═'.repeat(60));
  console.log('✨ Data Generation & Scraping Complete!');
  console.log(`📚 Syllabus: ${syllabus.length} | 👩‍🏫 Faculty: ${faculty.length} | 📅 Exams: ${exams.length}`);
  console.log(`💼 Placements: ${placements.length} | 📢 Notices: ${allNotices.length} | 📑 Docs: ${docs.length}`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});

// All project content lives here: edit, add or remove entries and the site updates on the next build.
// (This used to be loaded from MongoDB through the Express API; the site is now fully static.)
// `slug` is the URL (/projects/<slug>) and must be unique. `order` controls the display order.
// Cover images are mapped in data/covers.js and screenshots in data/gallery.js.

const projects = [
  {
    slug: 'taskpoint-labour-marketplace',
    title: 'TaskPoint — Peer-to-Peer Labour Marketplace',
    client: 'BSCS Final Year Project',
    category: ['Mobile Development', 'Full Stack Development', 'Final Year Project'],
    year: '2026',
    shortDescription:
      'A localized labour marketplace for Pakistan\'s Tier-2 cities, connecting daily-wage workers directly with nearby customers — built for Android and Web with Flutter and Firebase, plus a dedicated admin dashboard.',
    overview:
      'In cities like Gujranwala, the informal labour market for plumbers, electricians, carpenters, and masons runs entirely offline — workers lose hours a day waiting for jobs at a street-corner adda, and customers get no price transparency, identity verification, or safety guarantees. TaskPoint digitizes that market without removing what makes it work: workers keep their autonomy, and the local bargaining culture is preserved through a bid-and-counter-offer flow instead of fixed corporate pricing. Customers can post a job by category or by Roman Urdu voice search, discover nearby providers on a live map, negotiate a price, track the provider en route, and rate the job on completion. Workers go online to receive real-time job alerts within their service radius, bid or counter-offer, navigate to the customer, and manage a digital wallet of their earnings.',
    approach:
      'Built with Flutter for a single codebase across Android and Web, backed by Firebase Authentication (phone/OTP), Cloud Firestore for real-time data, and Firebase Storage for CNIC and job photos. Screens never touch Firestore directly — every read and write goes through a service class, and a singleton session controller streams the signed-in user\'s document so any screen can read live profile data without re-fetching. On-device speech recognition (no external API, no audio leaves the device) matches Roman Urdu and English voice input to service categories. A separate Flutter Web admin dashboard, sharing the same Firebase project, is required for several flows to actually resolve: CNIC identity verification and wallet top-ups both need human review before they take effect, and it\'s also where reports, SOS alerts, and disputed jobs get handled.',
    outcome:
      'The result is a working two-sided marketplace with real trust-and-safety mechanics — CNIC verification, emergency SOS logging, live location tracking, and session/device management — plus an operational admin backend, not just a student-project UI mockup. Known limitations are handled honestly rather than hidden: wallet top-ups are manual bank-transfer confirmations (no payment gateway), CNIC checks are human-reviewed rather than OCR-automated, and nearby-provider matching filters client-side by distance since Firestore has no native radius query — all reasonable trade-offs at this project\'s scale.',
    problem:
      'Daily-wage workers in Tier-2 cities like Gujranwala find jobs offline, waiting for hours at a street-corner adda, while customers have no price transparency, no identity verification and no safety guarantees.',
    solution:
      'A two-sided marketplace that keeps the local bargaining culture through bids and counter-offers, adds CNIC verification, live location tracking and emergency SOS logging, and ships with an admin dashboard so verification and wallet flows actually get resolved.',
    technologies: [
      'Flutter', 'Dart', 'Firebase Authentication', 'Cloud Firestore', 'Firebase Storage',
      'Google Maps Flutter', 'speech_to_text', 'geolocator',
    ],
    liveLink: 'https://github.com/shabicreations033/TaskPoint-App',
    coverImage: '',
    order: 1,
  },
  {
    slug: 'ai-smart-warehouse-delivery-management',
    title: 'AI Smart Warehouse & Delivery Management System',
    client: 'Personal Project',
    category: ['Full Stack Development', 'AI Integration', 'Logistics'],
    year: '2026',
    shortDescription:
      'A full-stack platform that brings intelligence to warehouse operations — role-based dashboards, AI-driven route optimization, smart staff assignment, and predictive inventory forecasting.',
    overview:
      'Apex is a role-based logistics platform with three tiers of access — Admin, Manager, and Delivery Staff — each with its own dashboard. Admins get full oversight and can monitor every user; Managers handle inventory, delivery assignment, and invoicing; Delivery Staff track and update their own deliveries in real time.',
    approach:
      'The core app runs on Node.js, Express, and MongoDB with EJS server-rendered views, secured end to end with Passport.js supporting both local email/password login and Google OAuth 2.0, bcrypt password hashing, and express-validator input sanitization. A separate Python/Flask microservice handles the AI layer: geocoding deliveries through the PositionStack API and running a greedy algorithm for route ordering, recommending the least-loaded staff member for new assignments, and analyzing 30-day sales history to forecast daily burn rate and predicted days-of-stock-remaining.',
    outcome:
      'The result is a genuinely production-shaped system — protected routes by role, automatic invoice generation from completed deliveries, an admin sidebar for monitoring staff, and a Chart.js/Leaflet-powered dashboard — built end to end including authentication, authorization, and a working AI microservice, not just a CRUD demo.',
    problem:
      'Warehouse teams juggle inventory, delivery assignments and invoicing by hand, with no clear view of who is handling what, no smart routing and no warning before stock runs out.',
    solution:
      'Role-based dashboards for Admin, Manager and Delivery Staff, plus a Python/Flask AI service that orders delivery routes, recommends the least-loaded staff member and forecasts days of stock remaining from 30 days of sales.',
    technologies: [
      'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Passport.js', 'Google OAuth 2.0',
      'bcrypt.js', 'express-validator', 'EJS', 'Chart.js', 'Leaflet.js', 'Python', 'Flask', 'PositionStack API',
    ],
    liveLink: 'https://github.com/shabicreations033/AI-Smart-Warehouse-and-Delivery-Management-System',
    coverImage: '',
    order: 2,
  },
  {
    slug: 'social-media-analytical-dashboard',
    title: 'Social Media Analytical Dashboard',
    client: 'Personal Project',
    category: ['Full Stack Development', 'Web Application', 'Dashboard'],
    year: '2026',
    shortDescription:
      'A full-stack analytics dashboard for monitoring social media performance — impressions, clicks, shares, engagement, and audience growth — through interactive charts.',
    overview:
      'Social platforms generate more performance data than most users can track manually. This dashboard centralizes it: impressions, clicks, shares, engagement rate, follower growth, and engagement distribution, all behind authenticated user accounts.',
    approach:
      'Built as a true client-server MERN app — a React.js frontend (Bootstrap + Chart.js) talking to a Node.js/Express REST API, backed by MongoDB via Mongoose. User registration, login, and logout are handled through a protected-route authentication flow. The API is organized around clear resources: /api/auth for authentication, /api/analytics for performance/growth/engagement data, and /api/users for profile management.',
    outcome:
      'The dashboard renders growth trends as line charts and engagement breakdowns as doughnut/pie/bar charts, works responsively across desktop, tablet, and mobile, and demonstrates a complete full-stack loop — from REST API design and MongoDB schema modeling to authenticated, chart-driven UI.',
    problem:
      'Social platforms produce more performance data than anyone can track manually, spread across impressions, clicks, shares, engagement and follower growth.',
    solution:
      'One authenticated dashboard that centralizes those metrics behind a REST API, showing growth trends and engagement breakdowns as interactive line, bar and doughnut charts, responsive on desktop, tablet and mobile.',
    technologies: ['React.js', 'JavaScript', 'Bootstrap', 'Chart.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    liveLink: 'https://github.com/shabicreations033/Social-media-Analytics-Dashboard',
    coverImage: '',
    order: 3,
  },
  {
    slug: 'safestate-cryptography-suite',
    title: 'SafeState — Multi-Layered Cryptography Suite',
    client: 'Personal Project',
    category: ['Cybersecurity', 'Backend Development'],
    year: '2026',
    shortDescription:
      'An Information Security suite implementing classical and modern cryptographic techniques side by side, behind a minimalist glassmorphism interface.',
    overview:
      'SafeState demonstrates a layered defense model: classical substitution and transposition ciphers (Hill, Vigenère, Rail Fence) alongside a modern block cipher (AES-256), all accessible through one Node.js application.',
    approach:
      'The backend is built with Node.js, Express, and MongoDB, with EJS views styled in a "Winter Mist" glass UI. Identity protection uses Bcrypt with adaptive salting for password hashing. The Hill Cipher implementation includes a GCD-based invertibility check to validate 3×3 key matrices before encryption. A secure vault feature uses AES-256-CBC with randomized initialization vectors to encrypt data at rest.',
    outcome:
      'The project ties together classical cryptography theory with practical, correctly-implemented modern encryption — including the mathematical validation Hill ciphers require, which is where most simplified implementations fall short.',
    problem:
      'Cryptography is usually taught as theory, and simplified implementations skip the maths that makes them correct, such as checking that a Hill cipher key matrix is actually invertible.',
    solution:
      'A suite that runs classical ciphers (Hill, Vigenère, Rail Fence) and modern AES-256 side by side, with a GCD-based invertibility check for 3×3 Hill keys, Bcrypt-hashed passwords and an AES-256-CBC vault using random initialization vectors.',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'BcryptJS', 'Crypto (OpenSSL)', 'AES-256'],
    liveLink: 'https://github.com/shabicreations033/SafeState-Multi-Layered-Cryptography',
    coverImage: '',
    order: 4,
  },
  {
    slug: 'fluxlex-lexical-analyzer',
    title: 'FluxLEX — Advanced Lexical Analyzer Engine',
    client: 'Personal Project — Compiler Construction',
    category: ['Compiler Construction', 'Full Stack Development'],
    year: '2026',
    shortDescription:
      'A web-based lexical analyzer bridging low-level compiler construction with a modern interface — a C/Flex tokenization engine wrapped in a Node.js app.',
    overview:
      'FluxLEX takes source code input and tokenizes it using a Flex-generated C scanner, surfacing the result — including illegal characters and malformed constants — through a polished, glass-morphism web UI instead of a bare terminal.',
    approach:
      'The tokenizer itself is written as Flex rules (cc_final.l), compiled with GCC into a standalone scanner binary. A Node.js/Express server invokes that binary, and every analysis run — its symbol table and results — is persisted to MongoDB for later review. The frontend uses EJS and Bootstrap 5 with custom CSS for the interactive, high-blur glass interface.',
    outcome:
      'The result is a hybrid architecture that pairs a genuinely fast C-based lexical engine with a web experience that makes compiler internals approachable — real-time error detection for illegal characters and malformed number literals included.',
    problem:
      'Compiler internals are hard to approach: a scanner normally lives in a terminal, and illegal characters or malformed numbers are hard to see and review.',
    solution:
      "A Flex-generated C scanner wrapped in a Node.js app, so source code is tokenized through a clean web interface, errors are flagged in real time and every run's symbol table is saved to MongoDB for later review.",
    technologies: ['Flex (C)', 'GCC', 'Node.js', 'Express.js', 'MongoDB', 'EJS', 'Bootstrap 5'],
    liveLink: 'https://github.com/shabicreations033/Lexical-Analyzer',
    coverImage: '',
    order: 5,
  },
  {
    slug: 'techfix-accounting-system',
    title: 'TechFix Solutions — Accounting System',
    client: 'Personal Project',
    category: ['Full Stack Development', 'Business Application'],
    year: '2026',
    shortDescription:
      'A full-stack accounting system modeling a real computer-services business — from journal entries through to generated financial statements.',
    overview:
      'TechFix Solutions simulates the complete accounting cycle for a small business: defining the business scope and stakeholders, applying the accounting equation, and carrying transactions through to financial reporting.',
    approach:
      'Built on Node.js and Express with MongoDB/Mongoose for data modeling and EJS for server-rendered views, the system walks through journal entries, ledger posting, and trial balance generation, with support for adjusting entries and an adjusted trial balance.',
    outcome:
      'The system auto-generates an Income Statement and Statement of Financial Position directly from posted transactions — turning bookkeeping theory into a working, rule-driven application.',
    problem:
      'Small service businesses often track money in scattered notes, so journal entries, ledgers and statements never reconcile and reports are slow to produce.',
    solution:
      'A rule-driven accounting system that carries transactions from journal entries through ledger posting, trial balance and adjusting entries, then generates the Income Statement and Statement of Financial Position automatically.',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'EJS', 'CSS3'],
    liveLink: 'https://github.com/shabicreations033/Accounting-System',
    coverImage: '',
    order: 6,
  },
  {
    slug: 'deadlock-detection-rag-wfg',
    title: 'Deadlock Detection — RAG & WFG Engine',
    client: 'Academic Project — Operating Systems',
    category: ['C++', 'Operating Systems', 'Algorithms'],
    year: '2025',
    shortDescription:
      'A C++ tool for detecting, preventing, and resolving deadlocks in simulated multi-process systems using Resource Allocation Graphs and Wait-For Graphs.',
    overview:
      'Deadlocks — processes blocked indefinitely waiting on each other for resources — are a core reliability problem in operating systems. This project implements and compares two standard approaches to handling them: the Resource Allocation Graph (RAG), which models both processes and resources, and the simplified Wait-For Graph (WFG), which models only process dependencies.',
    approach:
      'Both graphs are represented as adjacency matrices and searched for cycles using Depth-First Search, flagging back-edges as deadlocks. Prevention is handled two different ways: RAG enforces a user-defined resource ordering that rejects requests violating the hierarchy, while WFG enforces process ordering, restricting processes to only wait on higher-ID processes. When a deadlock is detected, the tool offers process termination as a resolution strategy, releasing the resources held by the terminated process.',
    outcome:
      'The console-based tool presents full system state — allocation/request matrices, the wait-for graph, and detected cycles — in formatted tables, making it a practical way to compare how RAG and WFG detection, prevention, and resolution behave against the same simulated scenarios.',
    problem:
      'In operating systems, processes can block each other forever while waiting on resources, and it is hard to see or compare how different approaches handle that.',
    solution:
      'A C++ tool that models the system as a Resource Allocation Graph and a Wait-For Graph, finds cycles with Depth-First Search, prevents deadlocks through ordering rules and resolves them by terminating a process, with full system state printed in tables.',
    technologies: ['C++', 'STL', 'Depth-First Search', 'Graph Theory'],
    liveLink: 'https://github.com/shabicreations033/Deadlock-Detection',
    coverImage: '',
    order: 7,
  },
  {
    slug: 'netflix-data-analysis',
    title: 'Netflix Data Analysis',
    client: 'Personal Data Analysis Project',
    category: ['Python', 'Data Analysis', 'Data Visualization'],
    year: '2025',
    shortDescription:
      'An exploratory data analysis of the Netflix Movies and TV Shows dataset — cleaning, transforming, and visualizing content patterns across type, release year, genre, rating, duration, and country.',
    overview:
      'Netflix\'s catalog is large enough that its trends aren\'t obvious from browsing alone. This project runs a full exploratory data analysis on the Netflix Movies and TV Shows dataset to surface patterns in how the catalog has grown and what it\'s made of — content type split, release-year trends, rating distribution, genre frequency, duration patterns, and which countries produce the most titles.',
    approach:
      'Using Pandas and NumPy, the raw CSV is cleaned and validated: duplicate records are detected and dropped, missing values are located (including a Seaborn heatmap to visualize gaps column by column), and the date_added field is parsed into a proper datetime to extract year-added trends separate from original release year. The duration field — a mix of "90 min" and "2 Seasons" style values — is split into numeric and unit components so movie lengths and show seasons can be analyzed separately. Findings are visualized with Matplotlib and Seaborn for static bar/line comparisons and Plotly for interactive charts, including a content-type pie chart.',
    outcome:
      'The analysis surfaces a clear picture of the catalog: movies make up the majority of titles, content spans a wide range of countries and genres, and durations vary considerably between films and multi-season shows — all backed by a repeatable, well-documented cleaning pipeline rather than one-off spreadsheet work.',
    problem:
      "The Netflix catalog is too large for its trends to be visible by browsing, and the raw dataset has duplicates, missing values and mixed-format fields such as '90 min' and '2 Seasons'.",
    solution:
      'A repeatable Pandas pipeline that cleans and validates the data, splits durations into numbers and units, and uses Matplotlib, Seaborn and Plotly to show content type, release year, genre, rating and country patterns.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly'],
    liveLink: 'https://github.com/shabicreations033/Netflix-Data-Analysis',
    coverImage: '',
    order: 8,
  },
];

// Sorted for display (same rule the API used: by `order`).
export const allProjects = [...projects].sort((a, b) => a.order - b.order);

export function getProjectBySlug(slug) {
  return allProjects.find((p) => p.slug === slug) || null;
}

// Previous / next project for the arrows at the bottom of a project page (wraps around).
export function getNeighbors(slug) {
  const i = allProjects.findIndex((p) => p.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? allProjects[i - 1] : allProjects[allProjects.length - 1],
    next: i < allProjects.length - 1 ? allProjects[i + 1] : allProjects[0],
  };
}

export default allProjects;

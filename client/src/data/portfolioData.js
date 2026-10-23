// All project content lives here: edit, add or remove entries and the site updates on the next build.
// (This used to be loaded from MongoDB through the Express API; the site is now fully static.)
// `slug` is the URL (/projects/<slug>) and must be unique. `order` controls the display order.
// Cover images are mapped in data/covers.js and screenshots in data/gallery.js.

const projects = [
  {
    slug: 'taskpoint-labour-marketplace',
    title: "TaskPoint: Peer-to-Peer Labour Marketplace",
    client: 'BSCS Final Year Project',
    category: ['Mobile Development', 'Full Stack Development', 'Final Year Project'],
    year: '2026',
    shortDescription:
      "A labour marketplace for Pakistan's Tier-2 cities that connects daily-wage workers with nearby customers. It runs on Android and Web, is built with Flutter and Firebase, and has its own admin dashboard.",
    overview:
      "In cities like Gujranwala, the labour market for plumbers, electricians, carpenters and masons runs offline. Workers lose hours a day waiting for jobs at a street-corner adda, and customers get no price transparency, identity verification or safety guarantees. TaskPoint moves that market online and keeps what already works about it. Workers stay independent, and the local bargaining culture survives through bids and counter-offers instead of fixed prices. Customers post a job by category or by Roman Urdu voice search, find nearby providers on a live map, agree a price, track the provider on the way and rate the job when it's done. Workers go online to get real-time job alerts within their service radius, bid or counter-offer, navigate to the customer and manage a digital wallet of their earnings.",
    approach:
      "Flutter gives one codebase for Android and Web. Firebase Authentication handles phone/OTP sign-in, Cloud Firestore holds the real-time data, and Firebase Storage keeps CNIC and job photos. Screens never touch Firestore directly. Every read and write goes through a service class, and a singleton session controller streams the signed-in user's document so any screen can read live profile data without fetching it again. Speech recognition runs on the device, with no external API and no audio leaving the phone, and it matches Roman Urdu and English voice input to service categories. A separate Flutter Web admin dashboard shares the same Firebase project. Several flows need it: CNIC verification and wallet top-ups both need human review before they take effect, and the dashboard is also where reports, SOS alerts and disputed jobs get handled.",
    outcome:
      "TaskPoint is a working two-sided marketplace with real trust and safety features: CNIC verification, emergency SOS logging, live location tracking, and session and device management. It has a working admin backend too, so it is more than a UI mockup. The limits are plain. Wallet top-ups are manual bank-transfer confirmations because there is no payment gateway. CNIC checks are reviewed by a person, not by OCR. Nearby-provider matching filters by distance on the client, since Firestore has no native radius query. All three are reasonable trade-offs at this scale.",
    problem:
      'Daily-wage workers in Tier-2 cities like Gujranwala find jobs offline, waiting for hours at a street-corner adda, while customers have no price transparency, no identity verification and no safety guarantees.',
    solution:
      "A two-sided marketplace that keeps the local bargaining culture through bids and counter-offers, and adds CNIC verification, live location tracking and emergency SOS logging. An admin dashboard resolves the verification and wallet flows.",
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
      "A full-stack warehouse and delivery platform with role-based dashboards, AI route ordering, staff assignment recommendations and stock forecasting.",
    overview:
      "Apex is a logistics platform with three access levels: Admin, Manager and Delivery Staff. Each has its own dashboard. Admins see everything and can monitor every user. Managers handle inventory, delivery assignment and invoicing. Delivery Staff track and update their own deliveries in real time.",
    approach:
      "The core app runs on Node.js, Express and MongoDB, with server-rendered EJS views. Passport.js handles local email/password login and Google OAuth 2.0, passwords are hashed with bcrypt, and express-validator sanitizes input. A separate Python/Flask microservice does the AI work. It geocodes deliveries through the PositionStack API and orders routes with a greedy algorithm. It recommends the least-loaded staff member for new assignments. It also analyzes 30 days of sales history to forecast the daily burn rate and the days of stock remaining.",
    outcome:
      "The system is close to production shape. Routes are protected by role, invoices are generated automatically from completed deliveries, and admins get a sidebar to monitor staff. The dashboard uses Chart.js and Leaflet. The project covers authentication, authorization and a working AI microservice, so it is more than a CRUD demo.",
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
      "A full-stack analytics dashboard for social media performance. It tracks impressions, clicks, shares, engagement and audience growth in interactive charts.",
    overview:
      "Social platforms produce more performance data than most people can track by hand. This dashboard puts it in one place: impressions, clicks, shares, engagement rate, follower growth and engagement distribution, behind authenticated user accounts.",
    approach:
      "A client-server MERN app. The React.js frontend (Bootstrap and Chart.js) talks to a Node.js/Express REST API, backed by MongoDB through Mongoose. Registration, login and logout run through a protected-route authentication flow. The API is split by resource: /api/auth for authentication, /api/analytics for performance, growth and engagement data, and /api/users for profile management.",
    outcome:
      "Growth trends show as line charts and engagement breakdowns as doughnut, pie and bar charts, and the layout is responsive on desktop, tablet and mobile. The project covers the full stack, from REST API design and MongoDB schema modeling to an authenticated, chart-driven UI.",
    problem:
      'Social platforms produce more performance data than anyone can track manually, spread across impressions, clicks, shares, engagement and follower growth.',
    solution:
      "One authenticated dashboard that puts those metrics behind a REST API and shows growth trends and engagement breakdowns as interactive line, bar and doughnut charts, responsive on desktop, tablet and mobile.",
    technologies: ['React.js', 'JavaScript', 'Bootstrap', 'Chart.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    liveLink: 'https://github.com/shabicreations033/Social-media-Analytics-Dashboard',
    coverImage: '',
    order: 3,
  },
  {
    slug: 'safestate-cryptography-suite',
    title: "SafeState: Multi-Layered Cryptography Suite",
    client: 'Personal Project',
    category: ['Cybersecurity', 'Backend Development'],
    year: '2026',
    shortDescription:
      "An information security suite that runs classical and modern ciphers side by side, behind a minimalist glass-style interface.",
    overview:
      "SafeState shows a layered defense model. It combines classical substitution and transposition ciphers (Hill, Vigenère, Rail Fence) with a modern block cipher (AES-256), all in one Node.js application.",
    approach:
      "The backend uses Node.js, Express and MongoDB, with EJS views in a \"Winter Mist\" glass UI. Passwords are hashed with Bcrypt using adaptive salting. The Hill Cipher includes a GCD-based invertibility check that validates 3×3 key matrices before encryption. The secure vault encrypts data at rest with AES-256-CBC and randomized initialization vectors.",
    outcome:
      "The project connects classical cryptography theory to correctly implemented modern encryption. That includes the math validation Hill ciphers need, which simplified implementations often skip.",
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
    title: "FluxLEX: Advanced Lexical Analyzer Engine",
    client: "Personal Project, Compiler Construction",
    category: ['Compiler Construction', 'Full Stack Development'],
    year: '2026',
    shortDescription:
      "A web-based lexical analyzer: a C/Flex tokenization engine wrapped in a Node.js app, so a compiler's first stage runs behind a web interface.",
    overview:
      "FluxLEX takes source code, tokenizes it with a Flex-generated C scanner, and shows the result in a glass-style web UI instead of a bare terminal. Illegal characters and malformed constants are flagged in the output.",
    approach:
      "The tokenizer is written as Flex rules (cc_final.l) and compiled with GCC into a standalone scanner binary. A Node.js/Express server runs that binary and saves every analysis, with its symbol table and results, to MongoDB for later review. The frontend uses EJS and Bootstrap 5 with custom CSS for the high-blur glass interface.",
    outcome:
      "The architecture pairs a fast C lexical engine with a web interface that makes compiler internals easier to follow. It detects illegal characters and malformed number literals in real time.",
    problem:
      'Compiler internals are hard to approach: a scanner normally lives in a terminal, and illegal characters or malformed numbers are hard to see and review.',
    solution:
      "A Flex-generated C scanner wrapped in a Node.js app. Source code is tokenized through a clean web interface, errors are flagged in real time and every run's symbol table is saved to MongoDB for later review.",
    technologies: ['Flex (C)', 'GCC', 'Node.js', 'Express.js', 'MongoDB', 'EJS', 'Bootstrap 5'],
    liveLink: 'https://github.com/shabicreations033/Lexical-Analyzer',
    coverImage: '',
    order: 5,
  },
  {
    slug: 'techfix-accounting-system',
    title: "TechFix Solutions: Accounting System",
    client: 'Personal Project',
    category: ['Full Stack Development', 'Business Application'],
    year: '2026',
    shortDescription:
      "A full-stack accounting system that models a computer-services business, from journal entries to generated financial statements.",
    overview:
      "TechFix Solutions simulates the full accounting cycle for a small business: defining the business scope and stakeholders, applying the accounting equation, and carrying transactions through to financial reporting.",
    approach:
      "The system runs on Node.js and Express, with MongoDB and Mongoose for data modeling and EJS for server-rendered views. It covers journal entries, ledger posting and trial balance generation, plus adjusting entries and an adjusted trial balance.",
    outcome:
      "The Income Statement and the Statement of Financial Position are generated straight from posted transactions. It turns bookkeeping theory into a working, rule-driven application.",
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
    title: "Deadlock Detection: RAG & WFG Engine",
    client: "Academic Project, Operating Systems",
    category: ['C++', 'Operating Systems', 'Algorithms'],
    year: '2025',
    shortDescription:
      "A C++ tool that detects, prevents and resolves deadlocks in simulated multi-process systems using Resource Allocation Graphs and Wait-For Graphs.",
    overview:
      "A deadlock happens when processes block each other indefinitely while waiting for resources, and it is a core reliability problem in operating systems. This project implements and compares two standard approaches. The Resource Allocation Graph (RAG) models both processes and resources. The Wait-For Graph (WFG) is simpler and models only process dependencies.",
    approach:
      "Both graphs are adjacency matrices, searched for cycles with Depth-First Search, and back-edges are flagged as deadlocks. Prevention works differently in each. RAG enforces a user-defined resource ordering and rejects requests that break the hierarchy. WFG enforces process ordering, so a process can only wait on higher-ID processes. When the tool detects a deadlock, it can terminate a process and release the resources that process held.",
    outcome:
      "The console tool prints the full system state in formatted tables: allocation and request matrices, the wait-for graph and the detected cycles. That makes it practical to compare how RAG and WFG detection, prevention and resolution behave on the same scenarios.",
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
      "An exploratory data analysis of the Netflix Movies and TV Shows dataset. It cleans the data and charts content by type, release year, genre, rating, duration and country.",
    overview:
      "Netflix's catalog is too large to read trends from browsing. This project runs a full exploratory analysis on the Movies and TV Shows dataset to show how the catalog has grown and what it contains: content type split, release-year trends, rating distribution, genre frequency, duration patterns and the countries that produce the most titles.",
    approach:
      "Pandas and NumPy clean and validate the raw CSV. Duplicate records are found and dropped, and missing values are located, with a Seaborn heatmap showing the gaps column by column. The date_added field is parsed into a datetime so year-added trends can be separated from release year. The duration field mixes values like \"90 min\" and \"2 Seasons\", so it is split into a number and a unit to analyze movie lengths and show seasons separately. Matplotlib and Seaborn draw the static bar and line comparisons, and Plotly draws the interactive charts, including a content-type pie chart.",
    outcome:
      "Movies make up most of the titles, content comes from many countries and genres, and durations vary widely between films and multi-season shows. The cleaning pipeline is documented and repeatable, so the results can be reproduced.",
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

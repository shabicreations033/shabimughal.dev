// Edit this file to update your personal info, skills, experience, and
// contact/social links. Projects live in the database instead (see
// server/seed/projects.data.js) since that list is expected to grow.

const profile = {
  name: 'Shabi Mughal',
  title: 'Full Stack Software Engineer',
  tagline: 'Bold Ideas, Flawless Execution',
  bio: `Full Stack Software Engineer bridging the gap between complex system architecture and user-facing application
development. I specialize in architecting scalable platforms across web and mobile, engineering secure
core systems, and extracting actionable insights from data. I approach engineering with a focus on
performance and reliability, driven to deliver robust solutions that solve complex real-world challenges.`,
  location: 'Gujranwala, Pakistan',
  // Shown next to the location, plus a live clock, so remote recruiters can see working hours.
  timezone: { label: 'PKT (UTC+5)', iana: 'Asia/Karachi' },
  availability: 'I am currently open to new full-time opportunities and excited to join a collaborative team building impactful products.',

  aboutHeadline: "I'm Shabi — a Full Stack Software Engineer who builds scalable products across web, mobile, and core system architectures.",
  aboutBio: [
    "I transform complex challenges into intuitive, real-world applications by bridging the gap between high-level user interfaces and robust, low-level logic. Whether I am architecting a full-stack platform, analyzing data, or developing core algorithms, my focus is on delivering complete, end-to-end solutions.",
    "While my expertise spans modern web frameworks, database architectures, and data analysis, my true strength is adaptable problem-solving. I don't just rely on one set of tools; I evaluate the unique needs of each project to design secure, efficient systems from the ground up.",
    "Ultimately, I am driven by a passion for clean, maintainable engineering. My goal is to bring reliable digital tools to life that solve actual business challenges while providing a seamless experience for the end user.",
  ],
  // TODO: replace these with your real details
  email: 'hi.shabimughal@gmail.com',
  phone: '+92 324 1771864',
  // Replaces the raw phone number on the Contact page. Format: wa.me/<number with country code, digits only>.
  whatsapp: 'https://wa.me/923241771864',
  whatsappMessage: "Hi Shabi, I found your portfolio and would like to talk.",
  // Resume PDF lives at client/public/Shabi-Mughal-Resume.pdf. Replace that file to update it, or set this to '' to hide the button.
  resume: '/Shabi-Mughal-Resume.pdf',
  socials: {
    linkedin: 'https://www.linkedin.com/in/shabi-mughal',
    github: 'https://github.com/shabicreations033',
    githubTaskpoint: 'https://github.com/shabicreations033/TaskPoint-App',
    instagram: '',
    twitter: '',
  },

  skills: {
    core: [
      'Full Stack Web Development',
      'Frontend Development',
      'Backend Development',
      'Responsive Web Design',
      'UI Development',
      'REST API Development',
      'Database Management',
      'Authentication & Authorization',
      'CRUD Applications',
      'Dashboard Development',
      'Data Visualization',
      'Git & Version Control',
    ],
    frontend: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Bootstrap', 'Chart.js'],
    backend: ['Node.js', 'Express.js', 'REST APIs'],
    database: ['MongoDB'],
    firebase: ['Firebase Authentication', 'Cloud Firestore', 'Firebase Storage'],
    apis: ['Google Maps API', 'Geolocation Services', 'REST API Integration'],
    languages: ['JavaScript', 'Python', 'C++', 'C#'],
    mobile: ['Flutter', 'Dart'],
    tools: ['Visual Studio Code', 'Git', 'GitHub', 'Postman', 'Figma', 'Anaconda / Spyder', 'Dev-C++'],
  },

  // Shown on the Services page. Each example links to a project page by its slug
  // (see server/seed/projects.data.js).
  servicesIntro:
    'From first idea to a deployed product — web, mobile, data, and core systems — built with clean architecture and a focus on reliability.',
  services: [
    {
      title: 'Full Stack Web Applications',
      description:
        'End-to-end web apps on the MERN stack: responsive React interfaces, Node and Express APIs, and MongoDB databases, delivered as one coherent product.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
      examples: [{ label: 'TechFix', slug: 'techfix-accounting-system' }],
    },
    {
      title: 'Mobile App Development',
      description:
        'Cross-platform apps in Flutter, backed by Firebase for authentication, live data, and storage, with maps and location wherever the product needs them.',
      tags: ['Flutter', 'Dart', 'Firebase', 'Google Maps API'],
      examples: [{ label: 'TaskPoint', slug: 'taskpoint-labour-marketplace' }],
    },
    {
      title: 'REST APIs & Backend Systems',
      description:
        'Secure, well-structured backends: RESTful APIs, authentication and authorization, and database design that stays maintainable as your product grows.',
      tags: ['REST APIs', 'Authentication', 'MongoDB', 'Node.js'],
      examples: [{ label: 'AI Warehouse', slug: 'ai-smart-warehouse-delivery-management' }],
    },
    {
      title: 'Dashboards & Data Visualization',
      description:
        'Raw data turned into clear, interactive dashboards and analyses, so decisions are made on what the numbers actually show.',
      tags: ['Chart.js', 'Python', 'Data Analysis'],
      examples: [{ label: 'Social Dashboard', slug: 'social-media-analytical-dashboard' }],
    },
    {
      title: 'Business & Management Systems',
      description:
        'Custom CRUD-based tools such as accounting, delivery, and inventory-style management, with admin panels and secure sign-in built in.',
      tags: ['CRUD Apps', 'Admin Panels', 'Authentication & Authorization'],
      examples: [{ label: 'TechFix', slug: 'techfix-accounting-system' }],
    },
    {
      title: 'Secure & Core Systems Engineering',
      description:
        'Algorithm-heavy and security-focused software: cryptography, compiler components, and operating-systems logic written in C++ and Python.',
      tags: ['C++', 'Python', 'Cryptography', 'Algorithms'],
      examples: [{ label: 'SafeState', slug: 'safestate-cryptography-suite' }],
    },
  ],
  process: [
    { title: 'Discuss', description: 'We align on goals, scope, and timeline before any code is written.' },
    { title: 'Design', description: 'I plan the architecture, data model, and interface so the build stays clean.' },
    { title: 'Build', description: 'Iterative development with regular updates, version-controlled in Git.' },
    { title: 'Deliver', description: 'Deployment and handover, so you can run and extend what was built.' },
  ],

  // Certifications: shown as the carousel on the Home page and as the list on the About page.
  // Preview images and PDFs live in client/public/certificates/ (same file name, .webp and .pdf).
  // Each card links to `verifyUrl` with the label `verifyLabel`. If `verifyUrl` is empty the link
  // opens the PDF copy instead, with `viewLabel`. To use a public verification page instead
  // (Credly, Simplilearn, n8n, ...), paste its address into `verifyUrl`.
  certifications: [
    {
      slug: 'google-ai-essentials',
    field: 'Artificial Intelligence',
      name: 'AI Essentials',
      issuer: 'Google',
      title: 'AI Essentials',
      kind: 'Specialization · 5 courses',
      issued: 'Sep 13, 2026',
      credentialId: 'JPAC2M47AFS3',
      via: 'Coursera',
      details:
        'Five courses developed by Google on using AI tools responsibly and improving productivity: introduction to AI, maximizing productivity with AI tools, the art of prompting, using AI responsibly, and staying ahead of the AI curve.',
      width: 1100,
      height: 850,
      verifyUrl: 'https://coursera.org/verify/specialization/JPAC2M47AFS3',
      verifyLabel: 'Verify on Coursera ↗',
    },
    {
      slug: 'google-ux-design',
    field: 'UI/UX Design',
      name: 'UX Design',
      issuer: 'Google',
      title: 'UX Design Professional',
      kind: 'Professional Certificate · 8 courses',
      issued: 'Sep 24, 2026',
      credentialId: 'DGJWKQ6MCRGD',
      via: 'Coursera',
      details:
        'Eight courses developed by Google covering the whole UX design process: empathizing with users, defining pain points, ideating, wireframes and prototypes, UX research and testing, and high-fidelity designs in Figma.',
      width: 1100,
      height: 850,
      verifyUrl: 'https://coursera.org/verify/professional-cert/DGJWKQ6MCRGD',
      verifyLabel: 'Verify on Coursera ↗',
    },
    {
      slug: 'azure-fundamentals',
    field: 'Cloud Architecture',
      name: 'Azure',
      issuer: 'Microsoft',
      title: 'Azure Fundamentals',
      kind: 'Course completion',
      issued: 'Sep 17, 2026',
      credentialId: '10737818',
      via: 'Simplilearn SkillUp',
      details: 'Online course on Microsoft Azure fundamentals, completed on the Simplilearn SkillUp portal.',
      width: 1100,
      height: 778,
      verifyUrl: '', // TODO: paste the Simplilearn verification link for certificate 10737818
      verifyLabel: 'Verify (ID: 10737818) ↗',
      viewLabel: 'View certificate (ID: 10737818) ↗',
    },
    {
      slug: 'n8n-your-first-workflows',
    field: 'API & Automation',
      name: 'n8n',
      issuer: 'n8n Academy',
      title: 'Your First Workflows',
      kind: 'Essentials course · passing grade',
      issued: 'Oct 8, 2026',
      credentialId: '',
      via: 'n8n Academy',
      details:
        'Completed the n8n Essentials course "Your First Workflows" and received a passing grade, awarded by the n8n Education Team.',
      width: 1100,
      height: 778,
      verifyUrl: '', // TODO: paste the credential link (credential.net or badges.n8n.io)
      verifyLabel: 'View Credential ➔',
      viewLabel: 'View certificate ↗',
    },
    {
      slug: 'aws-foundations-of-prompt-engineering',
    field: 'Generative AI',
      name: 'AWS Prompting',
      issuer: 'Amazon Web Services (AWS)',
      title: 'Foundations of Prompt Engineering',
      kind: 'Completion certificate',
      issued: 'Sep 24, 2026',
      credentialId: '',
      via: 'AWS Training & Certification',
      details: 'Completion certificate for the Foundations of Prompt Engineering course from AWS Training & Certification.',
      width: 1100,
      height: 850,
      verifyUrl: '/certificates/aws-foundations-of-prompt-engineering.pdf',
      verifyLabel: 'View Certificate ↗',
    },
    {
      slug: 'google-cloud-trust-and-security',
    field: 'Cloud Security',
      name: 'Trust & Security',
      issuer: 'Google Cloud',
      title: 'Trust and Security',
      kind: 'Course completion',
      issued: 'Sep 7, 2026',
      credentialId: '10704632',
      via: 'Simplilearn SkillUp',
      details: 'Online course on Trust and Security with Google Cloud, completed on the Simplilearn SkillUp portal.',
      width: 1100,
      height: 778,
      verifyUrl: '', // TODO: paste the Simplilearn verification link for certificate 10704632
      verifyLabel: 'Verify (ID: 10704632) ↗',
      viewLabel: 'View certificate (ID: 10704632) ↗',
    },
    {
      slug: 'google-cloud-image-captioning',
    field: 'Machine Learning',
      name: 'Image Captioning',
      issuer: 'Google Cloud',
      title: 'Create Image Captioning Models',
      kind: 'Course completion',
      issued: 'Sep 6, 2026',
      credentialId: '10701346',
      via: 'Simplilearn SkillUp',
      details: 'Online course on creating image captioning models with Google Cloud, completed on the Simplilearn SkillUp portal.',
      width: 1100,
      height: 778,
      verifyUrl: '', // TODO: paste the Simplilearn verification link for certificate 10701346
      verifyLabel: 'Verify (ID: 10701346) ↗',
      viewLabel: 'View certificate (ID: 10701346) ↗',
    },
    {
      slug: 'dubai-1-million-prompters',
    field: 'AI Engineering',
      name: '1M Prompters',
      issuer: 'Dubai Future Foundation',
      title: '1 Million Prompters Initiative',
      kind: 'Certificate of completion',
      issued: '',
      credentialId: '',
      via: 'Dubai Future Foundation',
      details:
        'Completed the One Million Prompters initiative launched by H.H. Sheikh Hamdan bin Mohammed bin Rashid Al Maktoum, Crown Prince of Dubai, which trains people in prompt engineering for AI systems.',
      width: 1100,
      height: 779,
      verifyUrl: 'https://omp.dub.ai/certificate/NW8pqeOHOS2Y',
      verifyLabel: 'View Certificate ↗',
    },
  ],

  // Testimonials: shown three at a time with previous / next buttons (components/TestimonialSlider.jsx).
  // `topic` is the small label on top, `name` the bold line and `role` the line under it.
  testimonials: [
    {
      topic: "Cross-platform development",
      quote:
        "Shoaib took on a heavy workload for TaskPoint by handling both the mobile frontend and the web admin portal. He didn't just string APIs together; he built a real-time Flutter and Firebase architecture that actually scaled under testing. He’s a practical, sharp developer who gets things done.",
      name: "Prof. Hamza Afzal",
      role: "FYP Supervisor",
    },
    {
      topic: "System architecture",
      quote:
        "During his presentation for TaskPoint, Shoaib proved he understands real-world architecture. Building a Flutter app for end-users while syncing live Firebase data to a web admin dashboard is a complex challenge. He handled the system logic and cross-platform communication really well. Solid, reliable engineering.",
      name: "Prof. Umer Iftikhar",
      role: "FYP Evaluator",
    },
    {
      topic: "Secure application logic",
      quote:
        "What impressed me about Shoaib’s work on TaskPoint was his focus on actual user requirements. Implementing automated CNIC verification and live SOS logging shows he thinks beyond just writing code—he thinks about trust and safety in a production environment. He builds software that solves actual problems.",
      name: "Prof. Adnan Akram",
      role: "FYP Evaluator",
    },
    {
      topic: "REST APIs & backend systems",
      quote:
        "What stood out about Shoaib on the AI Warehouse project was his backend structure. He doesn't cut corners on security or database design. He built REST APIs and a Python microservice for route optimization that were logical, clean, and easy for the rest of the team to consume.",
      name: "Prof. Hamza Afzal",
      role: "Project Mentor",
    },
    {
      topic: "Secure systems engineering",
      quote:
        "SafeState was a mathematically heavy project, and Shoaib handled the cryptography logic exceptionally well. Implementing AES-256 alongside classical ciphers requires strict attention to memory and algorithmic efficiency, and his implementations were spot-on. He writes secure, optimized code and understands what is actually happening under the hood.",
      name: "Prof. Muzammil Sadiq",
      role: "Project Evaluator",
    },
    {
      topic: "Data visualization & analytics",
      quote:
        "Shoaib has a very pragmatic approach to data visualization. For the Social Dashboard, he took raw backend metrics and mapped them into clean, interactive Chart.js components. It’s rare to find a developer who can write heavy PHP and MySQL logic and still care about how the end-user interacts with the data.",
      name: "Prof. Hamza Afzal",
      role: "Academic Evaluator",
    },
    {
      topic: "Business & management systems",
      quote:
        "Accounting systems leave no room for error, and Shoaib handled the business logic for TechFix perfectly. He built a solid CRUD architecture with secure admin panels that actually made sense for financial record-keeping. He is quick to grasp complex business rules and translates them into highly reliable, functional software.",
      name: "Prof. Saad Anwar",
      role: "Project Supervisor",
    },
  ],

  // Home page stat strip. Projects count comes from the database when it loads.
  stats: {
    careerStartYear: 2023,
    projectsFallback: 8,
    stacks: ['Flutter', 'MERN', 'Python', 'C++'],
  },

  education: [
    {
      institution: 'University of Central Punjab',
      degree: 'BS Computer Science',
      years: '2023 — 2026',
    },
    {
      institution: 'Punjab Group of Colleges',
      degree: 'ICS Statistics',
      years: '2020 — 2022',
    },
  ],

  experience: [
    {
      role: 'Full Stack Developer — Personal & Academic Projects',
      years: '2023 — 2026',
      description:
        'Developed full-stack web and software projects as part of academic coursework and personal development. Worked across frontend interfaces, backend APIs, databases, authentication, dashboards, and application logic while gaining practical experience with modern development technologies.',
    },
    {
      role: 'Full Stack / Application Developer — Academic Projects (BS Computer Science)',
      years: '2023 — 2026',
      description:
        'Designed and developed software applications using different programming languages and frameworks, including web applications, data-driven dashboards, management systems, and a Flutter-based mobile application with a web-based administration system.',
    },
  ],
};

export default profile;

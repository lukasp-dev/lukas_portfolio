interface NavLink {
  id: number;
  name: string;
  href: string;
}

interface ClientReview {
  id: number;
  name: string;
  position: string;
  img: string;
  review: string;
}

interface ProjectTag {
  id: number;
  name: string;
  path: string;
}

export interface Project {
  title: string;
  desc: string;
  subdesc: string;
  href: string;
  pageId?: string;
  texture?: string;
  logo: string;
  logoStyle: {
    backgroundColor: string;
    border: string;
    boxShadow: string;
  };
  spotlight: string;
  tags: ProjectTag[];
  picture?: string;
  type?: string;
  role?: string;
  technologies?: string[];
  results?: string;
  links?: {
    github?: {
      frontend?: string;
      backend?: string;
      fullstack?: string;
      mobile?: string;
      desktop?: string;
      api?: string;
      machinelearning?: string;
      ai?: string;
    };
    live?: string;
    youtube?: string;
  };
}

export interface Experience {
  id: number;
  name: string;
  pos: string;
  duration: string;
  startDate: string;
  title: string;
  icon: string;
  animation: string;
  type: "work" | "research" | "project";
  companyLink?: string;
  companyInfo?: string;
  techStack: string[];
  achievements: {
    title: string;
    description: string;
    details?: string | string[];
  }[];
  iconClassName?: string;
}

export const navLinks: NavLink[] = [
  { id: 1, name: "Home", href: "#home" },
  { id: 2, name: "Work", href: "#work" },
  { id: 3, name: "Projects", href: "#projects" },
  { id: 4, name: "Gallery", href: "/gallery" },
  { id: 6, name: "Contact", href: "#contact" },
];

export const clientReviews: ClientReview[] = [
  {
    id: 1,
    name: "Emily Johnson",
    position: "Marketing Director at GreenLeaf",
    img: "assets/review1.png",
    review: "Working with Adrian was a fantastic experience...",
  },
  {
    id: 2,
    name: "Mark Rogers",
    position: "Founder of TechGear Shop",
    img: "assets/review2.png",
    review: "Adrian's expertise in web development is truly impressive...",
  },
  {
    id: 3,
    name: "John Dohsas",
    position: "Project Manager at UrbanTech",
    img: "assets/review3.png",
    review: "I can't say enough good things about Adrian...",
  },
  {
    id: 4,
    name: "Ether Smith",
    position: "CEO of BrightStar Enterprises",
    img: "assets/review4.png",
    review: "Adrian was a pleasure to work with...",
  },
];

export const myProjects: Project[] = [
  {
    title:
      "BuzzLine (Winner of Google Built With AI and overall software track at WooHacks 2025)",
    desc: "a platform for fire survivors, providing emergency support, safe routes, and a live walkability maps",
    subdesc:
      "Built with Next.js with JavaScript, 10+ external APIs, Google OAuth, Firebase, and deployed on Vercel",
    pageId: "1a7a96ff12e680a5920bce87a1afa141",
    href: "https://devpost.com/software/buzz-innovations?ref_content=user-portfolio&ref_feature=in_progress",
    logo: "/assets/electron.png",
    logoStyle: {
      backgroundColor: "#1C1A43",
      border: "0.2px solid #252262",
      boxShadow: "0px 0px 60px 0px #635BFF4D",
    },
    spotlight: "/assets/spotlight5.png",
    tags: [
      {
        id: 1,
        name: "JavaScript",
        path: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      },
      {
        id: 2,
        name: "Next.js",
        path: "https://icon.icepanel.io/Technology/png-shadow-512/Next.js.png",
      },
      {
        id: 3,
        name: "Google Oauth",
        path: "https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png",
      },
      {
        id: 4,
        name: "Gemini API",
        path: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
      },
      {
        id: 5,
        name: "Axios",
        path: "https://cdn.worldvectorlogo.com/logos/axios.svg",
      },
      {
        id: 6,
        name: "Firebase",
        path: "https://img.icons8.com/?size=100&id=87330&format=png&color=000000",
      },
      {
        id: 7,
        name: "Vercel",
        path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAAZ0lEQVR4AWMYwkBICI/krCm45eQ/ftfCKbnp//9FuOTsfv3//98Fh+TB/0BwELtc8H8wiMMqeRUieRWbXPF/KCjGIvkYJvkYU27KfzjoxAi4jwjJ7/KY/keA1ahy3E2dSKCJm2FEAQAD1l2xzdeQ1AAAAABJRU5ErkJggg==",
      },
      {
        id: 8,
        name: "TailwindCSS",
        path: "https://w7.pngwing.com/pngs/293/485/png-transparent-tailwind-css-hd-logo-thumbnail.png",
      },
      {
        id: 9,
        name: "DaisyUI",
        path: "https://raw.githubusercontent.com/saadeghi/daisyui-images/master/images/daisyui-logo/favicon-192.png",
      },
      {
        id: 10,
        name: "NASA Landsat API",
        path: "https://img.icons8.com/?size=100&id=63673&format=png&color=000000",
      },
      {
        id: 11,
        name: "Open Source Routing API",
        path: "https://pbs.twimg.com/profile_images/952551296506134528/u0DkjfzD_400x400.jpg",
      },
      {
        id: 12,
        name: "Google Maps, Places, Directions API",
        path: "https://img.icons8.com/?size=100&id=DcygmpZqBEd9&format=png&color=000000",
      },
      {
        id: 13,
        name: "Turf.js",
        path: "https://images.opencollective.com/turf/2579a53/logo/256.png?height=256",
      },
    ],
    picture: "https://i.ibb.co/9k46vTtK/tmp.webp",
    type: "Hackathon Project",
    role: "Full Stack Developer",
    links: {
      github: {
        fullstack: "https://github.com/lukasp-dev/woohacks25",
      },
      live: "https://woohacks25-blush.vercel.app/",
    },
  },

  {
    title:
      "FinCompare (Top 3 in the UGAHacks Gamification of Financial Analysis Track by Truist)",
    desc: "A platform that simplifies financial analysis through interactive visualizations and gamified learning",
    subdesc:
      "Built with React (JavaScript), MongoDB, Express.js backend, and Axios for API requests",
    pageId: "1a3a96ff12e680ef8041f5a225740354",
    href: "https://devpost.com/software/ugahacksxfincompare",
    logo: "/assets/javascript.png",
    logoStyle: {
      backgroundColor: "#1C1A43",
      border: "0.2px solid #252262",
      boxShadow: "0px 0px 60px 0px #635BFF4D",
    },
    spotlight: "/assets/spotlight5.png",
    tags: [
      {
        id: 1,
        name: "JavaScript",
        path: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      },
      { id: 2, name: "React", path: "/assets/react.svg" },
      { id: 3, name: "Express", path: "/assets/express.png" },
      { id: 4, name: "Vite", path: "/assets/vite.png" },
      { id: 5, name: "Axios", path: "/assets/axios.png" },
      { id: 6, name: "OpenAI API", path: "/assets/chatgpt.png" },
      {
        id: 7,
        name: "MongoDB",
        path: "https://w7.pngwing.com/pngs/956/695/png-transparent-mongodb-original-wordmark-logo-icon-thumbnail.png",
      },
      { id: 8, name: "Tesseract.js", path: "/assets/python.png" },
      {
        id: 9,
        name: "Chart.js",
        path: "https://upload.wikimedia.org/wikipedia/commons/8/86/Chart.js_logo.svg",
      },
    ],
    picture:
      "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/260/831/datas/original.png",
    type: "Hackathon Project",
    role: "Full Stack Developer",
    links: {
      github: {
        frontend: "https://github.com/lukasp-dev/ugaHacks",
        backend: "https://github.com/lukasp-dev/FinCompare",
      },
    },
  },
  {
    title: "SOMA Notify",
    desc: "A desktop application allowing the user to simultaneously message multiple clients",
    subdesc:
      "SOMA Notify is a desktop application that allows the user to simultaneously message multiple clients. It is built with Electron and uses the React library for the User Interface. It also uses the Kakaotalk API to authenticate the user and send messages to the clients.",
    pageId: "169a96ff12e680a4ba4bceebcda2dda0",
    href: "https://genuinelukas.notion.site/SOMA-Notify-169a96ff12e680a4ba4bceebcda2dda0?pvs=73",
    texture: "/textures/project/project2.mp4",
    logo: "/assets/java.png",
    logoStyle: {
      backgroundColor: "#13202F",
      border: "0.2px solid #17293E",
      boxShadow: "0px 0px 60px 0px #2F6DB54D",
    },
    spotlight: "/assets/spotlight2.png",
    tags: [
      { id: 1, name: "TypeScript", path: "/assets/typescript.png" },
      { id: 2, name: "React", path: "/assets/react.svg" },
      { id: 3, name: "Docker", path: "/assets/docker.png" },
      { id: 4, name: "Express", path: "/assets/express.png" },
      { id: 5, name: "Vite", path: "/assets/vite.png" },
      { id: 6, name: "Axios", path: "/assets/axios.png" },
      { id: 7, name: "Amazon S3", path: "/assets/amazons3.png" },
      { id: 8, name: "Amazon EC2", path: "/assets/amazonec2.png" },
      { id: 9, name: "Electron", path: "/assets/electron.png" },
    ],
    picture: "/assets/notify-soma-thumbnail.png",
    type: "Personally led Company Project",
    role: "Full Stack Developer",
    links: {
      github: {
        frontend: "https://github.com/lukasp-dev/kakao-message-client",
        backend: "https://github.com/lukasp-dev/express-kakao-server",
      },
    },
  },
  {
    title: "Purchease API",
    desc: "A RESTful API that allows users to purchase products from a website",
    subdesc:
      "This Advanced E-Commerce Backend System is designed to meet the increasing demands of online businesses. Driven by Spring Boot MVC and best practices in software design, this system presents a secure, scalable, and user-friendly platform.",
    pageId: "15ea96ff12e6809dbeaddb6995a5440c",
    href: "https://github.com/lukasp-dev/e-commerce-backend",
    texture: "/textures/project/project2.mp4",
    logo: "/assets/java.png",
    logoStyle: {
      backgroundColor: "#13202F",
      border: "0.2px solid #17293E",
      boxShadow: "0px 0px 60px 0px #2F6DB54D",
    },
    spotlight: "/assets/spotlight2.png",
    tags: [
      { id: 1, name: "Java", path: "/assets/java.png" },
      { id: 2, name: "Spring Boot", path: "/assets/springboot.png" },
      { id: 3, name: "Gradle", path: "/assets/gradle.png" },
      { id: 4, name: "Docker", path: "/assets/docker.png" },
      { id: 5, name: "MySQL", path: "/assets/mysql.png" },
    ],
    picture: "/assets/shopping-api.webp",
    type: "Personal Project",
    role: "Java API Developer",
    links: {
      github: {
        backend: "https://github.com/lukasp-dev/PurcheaseAPI",
      },
    },
  },
  {
    title: "WanderSync",
    desc: "A platform that allows users to sync their travel plans",
    subdesc:
      "WanderSync is an Android app built with Java and MVVM architecture, enabling users to sync travel plans, manage reservations and accommodations, and share itineraries and posts with friends.",
    pageId: "15da96ff12e68088b99dfe1feb86f13b",
    href: "https://travelsync.vercel.app",
    texture: "/textures/project/project7.mp4",
    logo: "/assets/typescript.png",
    logoStyle: {
      backgroundColor: "#1C1A43",
      border: "0.2px solid #252262",
      boxShadow: "0px 0px 60px 0px #635BFF4D",
    },
    spotlight: "/assets/spotlight5.png",
    tags: [
      { id: 1, name: "Java", path: "/assets/java.png" },
      { id: 2, name: "Android Studio", path: "/assets/android-studio.png" },
      { id: 3, name: "JUnit5", path: "assets/junit.png" },
      { id: 4, name: "Firebase", path: "/assets/firebase.png" },
    ],
    picture: "/assets/wandersync.png",
    type: "Group Project",
    role: "Java Developer",
    links: {
      github: {
        mobile: "https://github.com/lukasp-dev/WanderSync",
      },
      youtube: "vvpLFVyG7yM",
    },
  },

  {
    title: "Jewook Portfolio",
    desc: "My portfolio website",
    subdesc:
      "Jewook's Portfolio is a full-stack React and Express website hosted on AWS, showcasing my experience and projects by integrating Notion content and managing images via S3.",
    href: "https://jewook.dev",
    texture: "/textures/project/project6.mp4",
    pageId: "15ea96ff12e68054abbfc29d17a926c4",
    logo: "/assets/typescript.png",
    logoStyle: {
      backgroundColor: "#1C1A43",
      border: "0.2px solid #252262",
      boxShadow: "0px 0px 60px 0px #635BFF4D",
    },
    spotlight: "/assets/spotlight5.png",
    tags: [
      { id: 1, name: "TypeScript", path: "/assets/typescript.png" },
      { id: 2, name: "React.js", path: "/assets/react.svg" },
      { id: 3, name: "Express", path: "/assets/express.png" },
      { id: 4, name: "tailwindCSS", path: "assets/tailwindcss.png" },
      { id: 5, name: "Vite", path: "/assets/vite.png" },
      { id: 6, name: "Axios", path: "/assets/axios.png" },
      { id: 7, name: "Amazon S3", path: "/assets/amazons3.png" },
      { id: 8, name: "Amazon EC2", path: "/assets/amazonec2.png" },
    ],
    picture: "/assets/portfolio_thumbnail.png",
    type: "Personal Project",
    role: "Full Stack Developer",
    links: {
      github: {
        frontend: "https://github.com/lukasp-dev/lukas_portfolio",
        backend: "https://github.com/lukasp-dev/notion-server",
      },
      live: "https://jewook.dev",
    },
  },
  {
    title: "StreamFlix - AI Movie Recommendation System",
    desc: "An AI-powered movie recommendation system utilizing advanced machine-learning techniques",
    subdesc:
      "StreamFlix is an AI-powered web app that recommends movies based on your preferences. Using machine learning, it analyzes your favorite films and suggests new ones you might love.",
    href: "https://github.com/lukasp-dev/movie-recommendation",
    pageId: "15ea96ff12e680f5bd24de0e492351ab",
    texture: "/textures/project/project3.mp4",
    logo: "/assets/python.png",
    logoStyle: {
      backgroundColor: "#2A1816",
      border: "0.2px solid #36201D",
      boxShadow: "0px 0px 60px 0px #AA3C304D",
    },
    spotlight: "/assets/spotlight3.png",
    tags: [
      { id: 1, name: "Python", path: "/assets/python.png" },
      { id: 2, name: "Scikit-learn", path: "/assets/scikit.png" },
      { id: 3, name: "Anaconda", path: "assets/anaconda.png" },
    ],
    picture: "/assets/movie-rec.png",
    type: "Personal Project",
    role: "Full Stack Developer",
    links: {
      youtube: "Ccm11V1EwGE",
      github: {
        fullstack: "https://github.com/lukasp-dev/StreamFlix",
      },
    },
  },
];

export const experiences: Experience[] = [
  {
    id: 1,
    type: "work" as const,
    startDate: "2026-04",
    name: "Microsoft",
    pos: "Software Engineer Intern",
    duration: "Apr 2026 - Present",
    title: "Software Engineer Intern at Microsoft",
    companyLink: "https://www.microsoft.com",
    companyInfo: "Incoming SWE intern at Microsoft Azure Compute, Redmond, Washington",
    techStack: ["Azure", "Azure Compute", "C#", "Distributed Systems"],
    animation: "fade-left",
    achievements: [
      {
        title: "Azure Compute",
        description: "Incoming SWE intern @ Azure Compute",
        details: [
          "Starting April 2026 at Microsoft Azure Compute, Redmond, WA — On-site",
        ],
      },
    ],
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    id: 2,
    type: "work" as const,
    startDate: "2026-01",
    name: "Itential",
    pos: "Software Engineering Intern",
    duration: "Jan 2026 - Present",
    title: "Software Engineering Intern at Itential",
    companyLink: "https://www.itential.com",
    companyInfo: "Network automation software company specializing in enterprise network orchestration and automation for Fortune 500 companies",
    techStack: ["Python", "FastMCP", "Snowflake", "AWS", "Amazon ECR", "Claude API", "SQL", "Salesforce", "ETL"],
    animation: "fade-left",
    achievements: [
      {
        title: "MCP Server & LLM Gateway",
        description: "Engineered an MCP server and high-throughput LLM Gateway on AWS for autonomous sales intelligence",
        details: [
          "Engineered an MCP server using FastMCP to abstract complex Snowflake schemas into LLM-ready tools, enabling autonomous retrieval of sales intelligence and synthesis of domain-specific insights",
          "Architected a high-throughput LLM Gateway on Amazon ECR within a private AWS VPC, orchestrating MCP-compliant tool execution",
          "Built a scalable ETL pipeline integrating Snowflake and Salesforce via Python, with 8 parallel workers and queue-based result aggregation",
          "Optimized complex SQL queries using CTEs and indexed views to filter call transcripts, reducing execution time for high-volume batch processing",
          "Designed a distributed LLM system with multi-stage inference (extraction → synthesis → aggregation) to automate MEDDPICC field population",
        ],
      },
    ],
    icon: "/assets/itential-logo-stacked-r.png",
  },
  {
    id: 3,
    type: "work" as const,
    startDate: "2025-05",
    name: "Genuine Parts Company",
    pos: "Software Engineering Intern",
    duration: "May 2025 - Aug 2025",
    title: "Software Engineering Intern at Genuine Parts Company (NAPA Auto Parts)",
    companyLink: "https://www.genpt.com/",
    companyInfo: "Global distributor of automotive and industrial replacement parts, best known for owning NAPA Auto Parts",
    techStack: ["React", "FastAPI", "Redux", "GraphQL", "GCP", "Vertex AI", "Gemini", "Vector DB", "Pydantic"],
    animation: "fade-right",
    achievements: [
      {
        title: "Frontend Developer",
        description: "Developed a full-stack React + FastAPI web app enabling customers to refine searches via Natural Language filters",
        details: [
          "Reduced API calls by 94% (18→1) and projected $10M in annual savings by implementing React memoization, webhook-driven real-time updates, and centralized GraphQL variable management in Redux",
        ],
      },
      {
        title: "Back End Developer",
        description: "Built a GCP vector DB + Vertex AI RAG service for product search accuracy",
        details: [
          "Built GCP vector DB + Vertex AI (Gemini 2.5 Flash Lite) RAG service using top-10 nearest-neighbor matches on catalog embeddings to fix typos/abbreviations in user input",
          "Increased backend reliability by adding unit tests for 50+ Pydantic models, achieving 100% schema validation coverage and preventing malformed data from reaching production APIs",
        ],
      },
    ],
    icon: "https://www.genpt.com/images/GPC_LOGO.svg",
  },
  {
    id: 5,
    type: "research" as const,
    startDate: "2025-01",
    name: "Georgia Tech VIP Program",
    pos: "Undergraduate Researcher",
    duration: "Jan 2025 - Present",
    title: "Undergraduate Researcher at Georgia Tech VIP Program",
    companyLink: "https://www.vip.gatech.edu",
    companyInfo: "Georgia Tech Vertically Integrated Projects — interdisciplinary research program",
    techStack: ["Python", "PyTorch", "Deep Learning", "Machine Learning", "Reinforcement Learning"],
    animation: "fade-right",
    achievements: [
      {
        title: "SC-OPF AI Agent",
        description: "Developing an AI agent to optimize power flow in grid systems (SC-OPF)",
        details: [
          "Applying practical machine learning and optimization techniques to solve Security-Constrained Optimal Power Flow (SC-OPF) problems",
          "Developing reinforcement learning-based agents for intelligent grid control and real-time power flow optimization",
        ],
      },
    ],
    icon: "/assets/responsible_ai.png",
  },
  {
    id: 6,
    type: "work" as const,
    startDate: "2024-10",
    name: "Stride Labs",
    pos: "Software Engineer",
    duration: "Oct 2024 - Apr 2025",
    title: "Software Engineer at Stride Labs",
    companyLink: "https://www.stride-labs.com",
    companyInfo: "Series A BioTech Startup | AI-powered custom orthotics design platform",
    techStack: ["React", "Three.js", "Redux Toolkit", "Express.js", "Python", "GCP", "Linear"],
    animation: "fade-right",
    achievements: [
      {
        title: "Back End Developer",
        description: "Implemented computer vision and data pipeline systems for the orthotics platform",
        details: [
          "Implemented a computer vision system in Python to analyze 3D foot scans and generate personalized orthotic designs, enhancing accuracy and efficiency",
          "Developed an Express.js pipeline to collect user error reports, store them in Google Storage, and automatically notify the team via Linear",
          "Fine-tuned the AI model to dynamically adjust triangular mesh resolution, optimizing data size for transmission while preserving critical geometric details",
        ],
      },
      {
        title: "Frontend Developer",
        description: "Built 3D model visualization and state management for custom orthotics",
        details: [
          "Integrated a 3D model viewer using React and Three.js, enabling interactive zoom and rotation for custom orthotics",
          "Integrated Redux Toolkit with Redux Persist to manage global state for 3D mesh CSV data, reducing unnecessary API calls",
          "Asynchronously ran RESTful API endpoints to optimize data fetching, ensuring seamless UX with minimal latency",
        ],
      },
    ],
    icon: "/assets/stride_labs.png",
  },
  {
    id: 7,
    type: "work" as const,
    startDate: "2024-05",
    name: "Gallery SOMA",
    pos: "Software Engineer Intern",
    duration: "May 2024 - Aug 2024",
    title: "Software Engineer Intern at Gallery SOMA",
    companyLink: "https://www.gallerysoma.co.kr",
    companyInfo: "Contemporary Art Gallery | Online Artwork Trading Platform",
    techStack: ["React", "Redux", "TypeScript", "Figma", "OAuth 2.0", "JWT"],
    animation: "fade-right",
    achievements: [
      {
        title: "SOMA Artistry",
        description: "Independently designed and developed the entire frontend web page using React & Redux",
        details: [
          "Designed application logic in Figma for a web app with end-to-end transactions and smooth API/database integration",
          "Integrated React purchase logic with backend and APIs, streamlining checkout by auto-filling address fields based on Zipcode",
        ],
      },
      {
        title: "Optimization",
        description: "Enhanced web performance and security",
        details: [
          "Implemented OAuth 2.0 with JWT authentication, ensuring efficient token management and secure access control",
          "Reduced server costs by 30% through local caching of user data, minimizing API calls and optimizing token usage",
        ],
      },
    ],
    icon: "/assets/gallery_soma_logo.jpeg",
  },
  {
    id: 8,
    type: "work" as const,
    startDate: "2022-09",
    name: "Ministry of National Defense",
    pos: "Network Technician",
    duration: "Sep 2022 - Mar 2024",
    title: "Network Technician · Republic of Korea Armed Forces",
    companyLink: "https://www.mnd.go.kr",
    companyInfo: "Republic of Korea Armed Forces — mandatory military service",
    techStack: ["LAN/WAN", "5G", "Optical Cable", "Network Infrastructure", "Firewalls"],
    animation: "fade-right",
    achievements: [
      {
        title: "Network Operations",
        description: "Maintained secure military network infrastructure and led a 12-soldier team",
        details: [
          "Installed, configured, and maintained secure military network infrastructure (LAN/WAN, routers, switches, and firewalls)",
          "Diagnosed and resolved connectivity issues under time-sensitive operational constraints",
          "Deployed and repaired 5G optical cable networks, ensuring high-speed and resilient battlefield communication systems",
          "Led and trained a 12-soldier team in network operations and emergency response drills for wartime readiness",
        ],
      },
    ],
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Ministry_of_National_Defense_of_the_Republic_of_Korea_Logo_%28vertical%29.svg/960px-Ministry_of_National_Defense_of_the_Republic_of_Korea_Logo_%28vertical%29.svg.png?_=20250306192232",
  },
  {
    id: 9,
    type: "work" as const,
    startDate: "2022-02",
    name: "Worcester Polytechnic Institute",
    pos: "Drupal Developer",
    duration: "Feb 2022 - May 2022",
    title: "Drupal Developer at Worcester Polytechnic Institute",
    companyLink: "https://www.wpi.edu",
    companyInfo: "Research university in Worcester, Massachusetts",
    techStack: ["Drupal", "PHP", "HTML", "CSS", "WCAG"],
    animation: "fade-right",
    achievements: [
      {
        title: "Web Development",
        description: "Designed and maintained Drupal modules and themes for university websites",
        details: [
          "Designed and maintained Drupal modules and themes to support university websites",
          "Customized content workflows and optimized backend queries to improve site performance",
          "Collaborated with staff to implement user-friendly UI and optimize web accessibility (WCAG compliance)",
          "Enhanced site reliability by debugging legacy PHP code and integrating modern web practices",
        ],
      },
    ],
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRavZLAWSMsh7Y7XPZbHs6JkoY_mCPcytCedg&s",
  },
].sort(
  (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
);

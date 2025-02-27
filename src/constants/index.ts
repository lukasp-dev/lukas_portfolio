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
  type: "work" | "research";
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
  { id: 5, name: "CODOC", href: "/codoc" },
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
    title: "BuzzLine (Winner of Google Built With AI and overall software track at WooHacks 2025)",
    desc: "a platform for fire survivors, providing emergency support, safe routes, and a live walkability maps",
    subdesc: "Built with Next.js with JavaScript, 10+ external APIs, Google OAuth, Firebase, and deployed on Vercel",
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
      { id: 1, name: "JavaScript", path: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" },
      { id: 2, name: "Next.js", path: "https://icon.icepanel.io/Technology/png-shadow-512/Next.js.png" },
      { id: 3, name: "Google Oauth", path: "https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png" },
      { id: 4, name: "Gemini API", path: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" },
      { id: 5, name: "Axios", path: "https://cdn.worldvectorlogo.com/logos/axios.svg" },
      { id: 6, name: "Firebase", path: "https://img.icons8.com/?size=100&id=87330&format=png&color=000000" },
      { id: 7, name: "Vercel", path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAAZ0lEQVR4AWMYwkBICI/krCm45eQ/ftfCKbnp//9FuOTsfv3//98Fh+TB/0BwELtc8H8wiMMqeRUieRWbXPF/KCjGIvkYJvkYU27KfzjoxAi4jwjJ7/KY/keA1ahy3E2dSKCJm2FEAQAD1l2xzdeQ1AAAAABJRU5ErkJggg==" },
      { id: 8, name: "TailwindCSS", path: "https://w7.pngwing.com/pngs/293/485/png-transparent-tailwind-css-hd-logo-thumbnail.png" },
      { id: 9, name: "DaisyUI", path: "https://raw.githubusercontent.com/saadeghi/daisyui-images/master/images/daisyui-logo/favicon-192.png" },
      { id: 10, name: "NASA Landsat API", path: "https://img.icons8.com/?size=100&id=63673&format=png&color=000000" },
      { id: 11, name: "Open Source Routing API", path: "https://pbs.twimg.com/profile_images/952551296506134528/u0DkjfzD_400x400.jpg" },
      { id: 12, name: "Google Maps, Places, Directions API", path: "https://img.icons8.com/?size=100&id=DcygmpZqBEd9&format=png&color=000000" },
      { id: 13, name: "Turf.js", path: "https://images.opencollective.com/turf/2579a53/logo/256.png?height=256" },
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
    title: "FinCompare (Top 3 in the UGAHacks Gamification of Financial Analysis Track by Truist)",
    desc: "A platform that simplifies financial analysis through interactive visualizations and gamified learning",
    subdesc: "Built with React (JavaScript), MongoDB, Express.js backend, and Axios for API requests",
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
      { id: 1, name: "JavaScript", path: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" },
      { id: 2, name: "React", path: "/assets/react.svg"   },
      { id: 3, name: "Express", path: "/assets/express.png" },
      { id: 4, name: "Vite", path: "/assets/vite.png" },
      { id: 5, name: "Axios", path: "/assets/axios.png" },
      { id: 6, name: "OpenAI API", path: "/assets/chatgpt.png" },
      { id: 7, name: "MongoDB", path: "https://w7.pngwing.com/pngs/956/695/png-transparent-mongodb-original-wordmark-logo-icon-thumbnail.png" },
      { id: 8, name: "Tesseract.js", path: "/assets/python.png" },
      { id: 9, name: "Chart.js", path: "https://upload.wikimedia.org/wikipedia/commons/8/86/Chart.js_logo.svg" },
    ],
    picture: "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/260/831/datas/original.png",
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
    subdesc: "SOMA Notify is a desktop application that allows the user to simultaneously message multiple clients. It is built with Electron and uses the React library for the User Interface. It also uses the Kakaotalk API to authenticate the user and send messages to the clients.",
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
  {
    title: "Quiz Trivia - Online Quiz Platform",
    desc: "A platform that offers users a chance to test their knowledge",
    subdesc:
      "Quiz Trivia is a fun React-based app where users answer True/False questions, track their scores, and enjoy a smooth, interactive quiz experience on any device.",
    href: "https://lukasp-dev.github.io/quiz-app/",
    pageId: "15ea96ff12e6807a9126d09a2f4e71ba",
    texture: "/textures/project/project5.mp4",
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
      { id: 3, name: "chakraUI", path: "assets/chakra.png" },
      { id: 4, name: "Vite", path: "/assets/vite.png" },
      { id: 5, name: "Github Pages", path: "/assets/github.png" },
    ],
    picture: "/assets/trivia.png",
    type: "Personal Project",
    role: "Frontend Developer",
    links: {
      github: {
        frontend: "https://github.com/lukasp-dev/QuizTrivia?tab=readme-ov-file",
      },
      live: "https://lukasp-dev.github.io/QuizTrivia/",
    },
  },
];

export const experiences: Experience[] = [
  {
    id: 1,
    type: "research" as const,
    startDate: "2024-10",
    name: "Stride Labs",
    pos: "Software Engineer",
    duration: "October 2024 - Present",
    title: "Software Engineer at Stride Labs",
    companyLink: "https://www.stride-labs.com",
    companyInfo:
      "Series A HealthTech Startup | AI-powered custom orthotics design platform that automates 3D design for insoles",
    techStack: ["React", "Three.js", "Express.js", "GCP", "Node.js"],
    animation: "fade-right",
    achievements: [
      {
        title: "Frontend Revamp",
        description:
          "Enhanced the frontend with 3D visualization for seamless user interaction and AI-driven functionality",
        details: [
          "Integrated Three.js to render scanned foot models (STL) in 3D space",
          "Implemented interactive point selection system for precise measurements",
          "Developed data pipeline to transmit selected points to AI backend for insole generation",
        ],
      },
      {
        title: "User Report System",
        description:
          "Integrated GCP user data processing and Slack notification system",
        details: [
          "Built Express.js module for handling user-reported data uploads to GCP bucket",
          "Implemented automatic public URL generation for uploaded files",
          "Created Slack integration for real-time team notifications with formatted messages",
        ],
      },
    ],
    icon: "/assets/stride_labs.png",
  },
  {
    id: 2,
    type: "work" as const,
    startDate: "2024-05",
    name: "Gallery SOMA",
    pos: "Software Engineer Intern",
    duration: "May 2024 - August 2024",
    title: "Software Engineer Intern at Gallery SOMA",
    companyLink: "https://www.gallerysoma.co.kr",
    companyInfo: "Contemporary Art Gallery | Online Artwork Trading Platform",
    techStack: ["React", "Redux", "TypeScript", "Figma", "OAuth 2.0"],
    animation: "fade-right",
    achievements: [
      {
        title: "SOMA Artistry",
        description:
          "Independently designed and developed the entire frontend web page using React & Redux",
        details: [
          "Designed application logic in Figma for a web app with end-to-end transactions and smooth API/database integration",
          "Integrated React purchase logic with backend and APIs, streamlining checkout by auto-filling address fields based on Zipcode, reducing manual errors",
        ],
      },
      {
        title: "Optimization",
        description: "Enhanced Web Performance and Security",
        details: [
          "Implemented OAuth 2.0 with JWT authentication, ensuring efficient token management and secure access control",
          "Reduced server costs by 30% through local caching of user data, minimizing API calls and optimizing token usage",
        ],
      },
    ],
    icon: "/assets/gallery_soma_logo.jpeg",
  },
  {
    id: 3,
    type: "work" as const,
    startDate: "2024-03",
    name: "360 Energy",
    pos: "Software Engineer Intern",
    duration: "March 2024 - May 2024",
    title: "Software Engineer Intern at 360 Energy",
    animation: "fade-right",
    companyLink: "https://www.360energy.io",
    companyInfo:
      "Series A Clean Energy Startup | Providing sustainable energy solutions for Indonesian industries",
    techStack: ["MongoDB", "Express", "Node.js", "Docker"],
    achievements: [
      {
        title: "Dashboard for Stores",
        description:
          "Created a real-time dashboard with the MERN stack for store owners to monitor batteries",
        details: [
          "Provided visual analytics for battery levels & charging status through data fetching from sensors",
          "Used MongoDB Change Streams to achieve real-time battery data updates directly from the database",
        ],
      },
      {
        title: "SolarCharge Optimizer",
        description:
          "Simulated battery charging/discharging based on sunlight using Pandas & Matplotlib",
      },
    ],
    icon: "/assets/360energy_logo.png",
  },
  {
    id: 4,
    type: "research" as const,
    startDate: "2025-01",
    name: "Responsible AI for Decision Making",
    pos: "Research Assistant",
    duration: "January 2025 - Present (Upcoming)",
    title: "VIP: Responsible AI Research Team",
    companyLink: "https://www.gatech.edu",
    companyInfo:
      "Georgia Tech VIP Program | Developing trustworthy AI tools for engineering and healthcare decisions",
    techStack: [
      "Python",
      "PyTorch",
      "Machine Learning",
      "Deep Learning",
      "LLMs",
    ],
    animation: "fade-right",
    achievements: [
      {
        title: "Research Focus",
        description:
          "Development of AI tools for responsible decision-making in engineering and healthcare",
        details: [
          "Specialized Language Models: Tailoring LLMs for domain-specific knowledge extraction",
          "Multi-modal Data Analysis: Creating AI systems to integrate various data sources",
          "Time Series Forecasting: Developing robust predictive models using historical data",
          "AI-based Optimization: Leveraging AI for complex optimization problems",
        ],
      },
      {
        title: "Project Scope",
        description:
          "Applications across multiple sectors including supply chain, manufacturing, and healthcare",
        details: [
          "Focus on developing confidence-aware and interpretable AI systems",
          "Integration of uncertainty quantification in decision-making processes",
          "Implementation of robust and reliable AI methods for high-stakes decisions",
        ],
      },
    ],
    icon: "/assets/responsible_ai.png",
  },
].sort(
  (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
);

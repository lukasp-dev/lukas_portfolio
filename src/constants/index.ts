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
}

export interface WorkExperience {
    id: number;
    name: string;
    pos: string;
    duration: string;
    title: string;
    icon: string;
    animation: string;
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

export interface ResearchExperience {
    id: number;
    name: string;
    pos: string;
    duration: string;
    title: string;
    icon: string;
    animation: string;
    companyLink?: string;
    companyInfo?: string;
    techStack: string[];
    achievements: {
        title: string;
        description: string;
        details?: string | string[];
    }[];
}

export const navLinks: NavLink[] = [
    { id: 1, name: 'Home', href: '#home' },
    { id: 2, name: 'About', href: '#about' },
    { id: 3, name: 'Work', href: '#work' },
    { id: 4, name: 'Gallery', href: '/gallery' },
    { id: 5, name: 'UCamCode', href: '/ucamcode' },
    { id: 6, name: 'Contact', href: '#contact' },
];

export const clientReviews: ClientReview[] = [
    {
        id: 1,
        name: 'Emily Johnson',
        position: 'Marketing Director at GreenLeaf',
        img: 'assets/review1.png',
        review: 'Working with Adrian was a fantastic experience...'
    },
    {
        id: 2,
        name: 'Mark Rogers',
        position: 'Founder of TechGear Shop',
        img: 'assets/review2.png',
        review: 'Adrian’s expertise in web development is truly impressive...'
    },
    {
        id: 3,
        name: 'John Dohsas',
        position: 'Project Manager at UrbanTech',
        img: 'assets/review3.png',
        review: 'I can’t say enough good things about Adrian...'
    },
    {
        id: 4,
        name: 'Ether Smith',
        position: 'CEO of BrightStar Enterprises',
        img: 'assets/review4.png',
        review: 'Adrian was a pleasure to work with...'
    },
];

export const myProjects: Project[] = [
    {
        title: 'Online Retail Data Analysis',
        desc: 'An online retail data analysis project using Python.',
        subdesc: 'The Online Retail Data Analysis Project conducts comprehensive EDA on retail data to understand customer behavior and sales trends. Using Python, it employs libraries like pandas, numpy, matplotlib, and seaborn, along with machine learning techniques such as RFM analysis and K-Means clustering for customer segmentation. The project aims to support data-driven decisions and lay the groundwork for predictive modeling, interactive dashboards, and integration of additional data sources.',
        href: 'https://github.com/lukasp-dev/online-sale-data-analysis/tree/main',
        texture: '/textures/project/project1.mp4',
        logo: '/assets/python.png',
        logoStyle: {
            backgroundColor: '#2A1816',
            border: '0.2px solid #36201D',
            boxShadow: '0px 0px 60px 0px #AA3C304D',
        },
        spotlight: '/assets/spotlight1.png',
        tags: [
            { id: 1, name: 'Pandas', path: '/assets/pandas.png' },
            { id: 2, name: 'Numpy', path: 'assets/numpy.png' },
            { id: 3, name: 'Scikit-learn', path: '/assets/scikit.png' },
            { id: 4, name: 'Seaborn', path: '/assets/seaborn.png' },
            { id: 5, name: 'Jupyter', path: '/assets/jupyter.png' },
        ],
        picture: '',
    },
    {
        title: 'StreamFlix - AI Movie Recommendation System',
        desc: 'AI-powered movie recommendation system utilizing advanced machine-learning techniques.',
        subdesc: 'Developed an AI-powered movie recommendation system using machine learning to analyze metrics like average ratings and script word similarity. Achieved 90% accuracy in delivering personalized movie suggestions, enhancing recommendation relevance. Details on the machine learning techniques are available in the GitHub repository.',
        href: 'https://github.com/lukasp-dev/movie-recommendation',
        texture: '/textures/project/project3.mp4',
        logo: '/assets/python.png',
        logoStyle: {
            backgroundColor: '#2A1816',
            border: '0.2px solid #36201D',
            boxShadow: '0px 0px 60px 0px #AA3C304D',
        },
        spotlight: '/assets/spotlight3.png',
        tags: [
            { id: 1, name: 'Scikit-learn', path: '/assets/scikit.png' },
            { id: 2, name: 'Anaconda', path: 'assets/anaconda.png' },
        ],
        picture: '/assets/movie-rec.png',
    },
    {
        title: 'Purchease API - API for Online Shopping Platform',
        desc: 'Purchase API is a RESTful API that allows users to purchase products from a website.',
        subdesc: 'Developed a Spring Boot MVC e-commerce backend, emphasizing Object-Oriented Principles for scalability and maintainability. The application features a REST API integrated with MySQL for user authentication and transactions, with JWT-based authentication to ensure secure access control.',
        href: 'https://github.com/lukasp-dev/e-commerce-backend',
        texture: '/textures/project/project2.mp4',
        logo: '/assets/java.png',
        logoStyle: {
            backgroundColor: '#13202F',
            border: '0.2px solid #17293E',
            boxShadow: '0px 0px 60px 0px #2F6DB54D',
        },
        spotlight: '/assets/spotlight2.png',
        tags: [
            { id: 1, name: 'Spring Boot', path: '/assets/springboot.png' },
            { id: 3, name: 'Gradle', path: '/assets/gradle.png' },
            { id: 4, name: 'Docker', path: '/assets/docker.png' },
            { id: 5, name: 'MySQL', path: '/assets/mysql.png' },
        ],
        picture: '',
    },
    {
        title: 'Quiz Trivia - Online Quiz Platform',
        desc: 'Quiz Trivia is a platform that offers users a chance to test their knowledge.',
        subdesc: 'Built a Quiz Trivia web application using React.js, chakraUI, and Vite. The application features a responsive design and animations to enhance user experience. The application is deployed using Vercel.',
        href: 'https://lukasp-dev.github.io/quiz-app/',
        texture: '/textures/project/project5.mp4',
        logo: '/assets/typescript.png',
        logoStyle: {
            backgroundColor: '#1C1A43',
            border: '0.2px solid #252262',
            boxShadow: '0px 0px 60px 0px #635BFF4D',
        },
        spotlight: '/assets/spotlight5.png',
        tags: [
            { id: 1, name: 'React.js', path: '/assets/react.svg' },
            { id: 2, name: 'chakraUI', path: 'assets/chakra.png' },
            { id: 4, name: 'Vite', path: '/assets/vite.png' },
        ],
        picture: '/assets/trivia.png',
    },
];

export const workExperiences: WorkExperience[] = [
    {
        id: 1,
        name: 'UCamCode',
        pos: 'Co-founder & CTO',
        duration: 'July 2024 - Present',
        title: 'Leading Technical Development at UCamCode',
        companyLink: '/ucamcode',
        companyInfo: 'Georgia Tech CREATE-X Startup | Bridging the IT education gap in Cambodia through innovative learning platforms',
        techStack: ['React', 'Node.js', 'AWS', 'OpenAI API', 'TypeScript', 'Python'],
        animation: 'fade-right',
        achievements: [
            {
                title: "Technical Leadership",
                description: "Leading the development of AI-powered educational platform",
                details: [
                    "Architecting scalable cloud infrastructure using AWS services",
                    "Implementing GPT-4 integration for personalized learning feedback",
                    "Developing adaptive learning algorithms to customize student experiences",
                    "Managing technical team and establishing development workflows"
                ]
            },
            {
                title: "Platform Development",
                description: "Building comprehensive learning platform with offline capabilities",
                details: [
                    "Creating interactive coding environments with real-time feedback",
                    "Implementing offline-first architecture for areas with limited connectivity",
                    "Designing mobile-responsive interface for universal access",
                    "Integrating analytics dashboard for tracking student progress"
                ]
            }
        ],
        icon: '/assets/ucamcode_small_logo.png',
        iconClassName: "w-32 h-32 rounded-lg object-contain bg-gray-700/30 p-4"
    },
    {
        id: 2,
        name: 'Stride Labs',
        pos: 'Software Engineer Intern',
        duration: 'October 2024 - Present',
        title: 'Software Engineer Intern at Stride Labs',
        companyLink: 'https://www.stride-labs.com',
        companyInfo: 'Series A HealthTech Startup | AI-powered custom orthotics design platform that automates 3D design for insoles',
        techStack: ['React', 'Three.js', 'Express.js', 'GCP', 'Node.js'],
        animation: 'fade-right',
        achievements: [
            {
                title: "Frontend Revamp",
                description: "Enhanced the frontend with 3D visualization for seamless user interaction and AI-driven functionality",
                details: [
                    "Integrated Three.js to render scanned foot models (STL) in 3D space",
                    "Implemented interactive point selection system for precise measurements",
                    "Developed data pipeline to transmit selected points to AI backend for insole generation"
                ]
            },
            {
                title: "User Report System",
                description: "Integrated GCP user data processing and Slack notification system",
                details: [
                    "Built Express.js module for handling user-reported data uploads to GCP bucket",
                    "Implemented automatic public URL generation for uploaded files",
                    "Created Slack integration for real-time team notifications with formatted messages"
                ]
            }
        ],
        icon: '/assets/stride_labs.png'
    },
    {
        id: 3,
        name: 'Gallery SOMA',
        pos: 'Software Engineer Intern',
        duration: 'May 2024 - August 2024',
        title: 'Software Engineer Intern at Gallery SOMA',
        companyLink: 'https://www.gallerysoma.co.kr',
        companyInfo: 'Contemporary Art Gallery | Online Artwork Trading Platform',
        techStack: ['React', 'Redux', 'TypeScript', 'Figma', 'OAuth 2.0'],
        animation: 'fade-right',
        achievements: [
            {
                title: "SOMA Artistry",
                description: "Independently designed and developed the entire frontend web page using React & Redux",
                details: [
                    "Designed application logic in Figma for a web app with end-to-end transactions and smooth API/database integration",
                    "Integrated React purchase logic with backend and APIs, streamlining checkout by auto-filling address fields based on Zipcode, reducing manual errors"
                ]
            },
            {
                title: "Optimization",
                description: "Enhanced Web Performance and Security",
                details: [
                    "Implemented OAuth 2.0 with JWT authentication, ensuring efficient token management and secure access control",
                    "Reduced server costs by 30% through local caching of user data, minimizing API calls and optimizing token usage"
                ]
            }
        ],
        icon: '/assets/gallery_soma_logo.jpeg'
    },
    {
        id: 4,
        name: '360 Energy',
        pos: 'Software Engineer Intern',
        duration: 'March 2024 - May 2024',
        title: 'Software Engineer Intern at 360 Energy', 
        animation: 'fade-right',
        companyLink: 'https://www.360energy.io',
        companyInfo: 'Series A Clean Energy Startup | Providing sustainable energy solutions for Indonesian industries',
        techStack: ['MongoDB', 'Express', 'Node.js', 'Docker'],
        achievements: [
            {
                title: "Dashboard for Stores",
                description: "Created a real-time dashboard with the MERN stack for store owners to monitor batteries",
                details: [
                    "Provided visual analytics for battery levels & charging status through data fetching from sensors",
                    "Used MongoDB Change Streams to achieve real-time battery data updates directly from the database"
                ]
            },
            {
                title: "SolarCharge Optimizer",
                description: "Simulated battery charging/discharging based on sunlight using Pandas & Matplotlib"
            }
        ],
        icon: '/assets/360energy_logo.png'
    }
];

export const researchExperiences: ResearchExperience[] = [
    {
        id: 1,
        name: 'Georgia Tech Automotive LiDAR Lab',
        pos: 'Student Researcher',
        duration: 'August 2024 - December 2024',
        title: 'VisionLiDAR: Enhanced Safety and Performance in Automotive Systems',
        companyLink: 'https://www.gatech.edu',
        companyInfo: 'Research Laboratory | Advancing autonomous vehicle technology through LiDAR innovation',
        techStack: ['C++', 'Python', 'ROS2', 'Docker', 'TensorFlow', 'OpenCV'],
        animation: 'fade-right',
        achievements: [
            {
                title: "Autonomous Vehicle Research",
                description: "Enhanced vehicle autonomy and safety through LiDAR technology integration",
                details: [
                    "Researched advanced automotive systems to enhance vehicle autonomy and safety through LiDAR technology",
                    "Implemented and tested vehicle autonomy on a Dockerized ROS2 setup using C++ and Python",
                    "Developed Python-based edge detection algorithms using Tensorflow and OpenCV on Virtual Machine",
                    "Collaborated with the electrical team to test and optimize sensor data for enhancing driving performance"
                ]
            }
        ],
        icon: '/assets/automotive.png'
    },
    {
        id: 2,
        name: 'Responsible AI for Decision Making',
        pos: 'Research Assistant',
        duration: 'January 2025 - Present (Upcoming)',
        title: 'VIP: Responsible AI Research Team',
        companyLink: 'https://www.gatech.edu',
        companyInfo: 'Georgia Tech VIP Program | Developing trustworthy AI tools for engineering and healthcare decisions',
        techStack: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'LLMs'],
        animation: 'fade-right',
        achievements: [
            {
                title: "Research Focus",
                description: "Development of AI tools for responsible decision-making in engineering and healthcare",
                details: [
                    "Specialized Language Models: Tailoring LLMs for domain-specific knowledge extraction",
                    "Multi-modal Data Analysis: Creating AI systems to integrate various data sources",
                    "Time Series Forecasting: Developing robust predictive models using historical data",
                    "AI-based Optimization: Leveraging AI for complex optimization problems"
                ]
            },
            {
                title: "Project Scope",
                description: "Applications across multiple sectors including supply chain, manufacturing, and healthcare",
                details: [
                    "Focus on developing confidence-aware and interpretable AI systems",
                    "Integration of uncertainty quantification in decision-making processes",
                    "Implementation of robust and reliable AI methods for high-stakes decisions"
                ]
            }
        ],
        icon: '/assets/responsible_ai.png'
    }
];


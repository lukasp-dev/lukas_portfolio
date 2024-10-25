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

interface Project {
    title: string;
    desc: string;
    subdesc: string;
    href: string;
    texture: string;
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

interface WorkExperience {
    id: number;
    name: string;
    pos: string;
    duration: string;
    title: string;
    icon: string;
    animation: string;
}

export const navLinks: NavLink[] = [
    { id: 1, name: 'Home', href: '#home' },
    { id: 2, name: 'About', href: '#about' },
    { id: 3, name: 'Work', href: '#work' },
    { id: 4, name: 'Contact', href: '#contact' },
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
        subdesc: 'The Online Retail Data Analysis Project is designed...',
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
        subdesc: 'The system analyzes key metrics, such as average ratings...',
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
        subdesc: 'Built with Spring Boot, Java, MySQL and Docker...',
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
        subdesc: 'Built with React.js, TypeScript, ChakraUI, and Vite...',
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
        picture: '',
    },
];

export const workExperiences: WorkExperience[] = [
    {
        id: 1,
        name: 'Stride Labs',
        pos: 'Software Engineer',
        duration: 'Oct 2024 - Present',
        title: "Developed an AI-driven automated system...",
        icon: '/assets/stride_labs.png',
        animation: 'victory',
    },
    {
        id: 2,
        name: 'Georgia Tech',
        pos: 'Undergraduate Researcher',
        duration: 'Aug 2024 - Present',
        title: "Enhanced vehicle autonomy and safety using LiDAR technology...",
        icon: '/assets/gt_logo.png',
        animation: 'victory',
    },
    {
        id: 3,
        name: '360 Energy',
        pos: 'Software Engineer',
        duration: 'Jul 2024 - Present',
        title: "Built a real-time dashboard for store owners...",
        icon: '/assets/360energy_logo.png',
        animation: 'clapping',
    },
    {
        id: 4,
        name: 'Gallery SOMA',
        pos: 'Software Engineer Intern',
        duration: 'March 2024 - Aug 2024',
        title: "Designed and developed the SOMA Artistry frontend using React & Redux, with end-to-end transactions and smooth API integration. Improved performance by implementing OAuth 2.0 JWT authentication and reduced server costs by 30% through local data caching",
        icon: '/assets/gallery_soma_logo.jpeg',
        animation: 'salute',
    },
    {
        id: 5,
        name: 'Worcester Polytechnic Institute',
        pos: 'Content Management Software Assistant',
        duration: 'Feb 2022 - May 2022',
        title: "Managed the WPI website, handling 5-10 daily requests for feature updates using WordPress. Published the daily school newspaper, creating content with HTML, CSS, and MailChimp",
        icon: '/assets/WPI_logo.svg',
        animation: 'salute',
    },
];


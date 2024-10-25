export const navLinks = [
    {
        id: 1,
        name: 'Home',
        href: '#home',
    },
    {
        id: 2,
        name: 'About',
        href: '#about',
    },
    {
        id: 3,
        name: 'Work',
        href: '#work',
    },
    {
        id: 4,
        name: 'Contact',
        href: '#contact',
    },
];

export const clientReviews = [
    {
        id: 1,
        name: 'Emily Johnson',
        position: 'Marketing Director at GreenLeaf',
        img: 'assets/review1.png',
        review:
            'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
    },
    {
        id: 2,
        name: 'Mark Rogers',
        position: 'Founder of TechGear Shop',
        img: 'assets/review2.png',
        review:
            'Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
    },
    {
        id: 3,
        name: 'John Dohsas',
        position: 'Project Manager at UrbanTech ',
        img: 'assets/review3.png',
        review:
            'I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
    },
    {
        id: 4,
        name: 'Ether Smith',
        position: 'CEO of BrightStar Enterprises',
        img: 'assets/review4.png',
        review:
            'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
    },
];

export const myProjects = [
    {
        title: 'Online Retail Data Analysis',
        desc: 'An online retail data analysis project using Python.',
        subdesc:
            'The Online Retail Data Analysis Project is designed to perform a comprehensive exploratory data analysis (EDA) on retail data, with a primary focus on understanding customer behavior and sales trends. Using Python, the project leverages data analysis libraries such as pandas and numpy, visualization tools like matplotlib and seaborn, and machine learning techniques, including RFM Analysis and K-Means clustering, to gain insights into customer segmentation. The project aims to enhance data-driven decision-making and prepare for future predictive modeling, interactive dashboards, and integration of additional data sources to enrich the analysis.',
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
            {
                id: 1,
                name: 'Pandas',
                path: '/assets/pandas.png',
            },
            {
                id: 2,
                name: 'Numpy',
                path: 'assets/numpy.png',
            },
            {
                id: 3,
                name: 'Scikit-learn',
                path: '/assets/scikit.png',
            },
            {
                id: 4,
                name: 'Seaborn',
                path: '/assets/seaborn.png',
            },
            {
                id: 5,
                name: 'Jupyter',
                path: '/assets/jupyter.png',
            },
        ],
        picture: '',
    },
    {
        title: 'StreamFlix - AI Movie Recommendation System',
        desc: 'AI-powered movie recommendation system utilizing advanced machine-learning techniques.',
        subdesc:
            'The system analyzes key metrics, such as average ratings and script word similarity, to provide highly accurate and personalized movie suggestions tailored to user preferences. Leveraged a machine-learning algorithm that achieved an impressive 90% accuracy in generating recommendations, significantly enhancing the relevance and quality of movie selections for users.',
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
            {
                id: 1,
                name: 'Scikit-learn',
                path: '/assets/scikit.png',
            },
            {
                id: 2,
                name: 'Anaconda',
                path: 'assets/anaconda.png',
            },
        ],
        picture: '/assets/movie-rec.png',
    },
    {
        title: 'Purchease API - API for Online Shopping Platform',
        desc: 'Purchase API is a RESTful API that allows users to purchase products from a website. It is designed to be scalable and efficient, and it provides a seamless and secure online shopping experience.',
        subdesc:
            'Built with Spring Boot, Java, MySQL and Docker, Purchase API is a robust and scalable solution for online shopping. It offers a seamless and secure online shopping experience.',
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
            {
                id: 1,
                name: 'Spring Boot',
                path: '/assets/springboot.png',
            },
            {
                id: 3,
                name: 'Gradle',
                path: '/assets/gradle.png',
            },
            {
                id: 4,
                name: 'Docker',
                path: '/assets/docker.png',
            },
            {
                id: 5,
                name: 'MySQL',
                path: '/assets/mysql.png',
            }
        ],
        picture: '',
    },
    {
        title: 'Quiz Trivia - Online Quiz Platform',
        desc: 'Quiz Trivia is a platform that offers users a chance to test their knowledge. It provides a range of trivia questions and answers, allowing users to test their knowledge in a fun and engaging way.',
        subdesc:
            'Built with React.js, TypeScript, ChakraUI, and Vite, Quiz Trivia is a user-friendly platform that offers a range of trivia questions and answers, allowing users to test their knowledge in a fun and engaging way.',
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
            {
                id: 1,
                name: 'React.js',
                path: '/assets/react.svg',
            },
            {
                id: 2,
                name: 'chakraUI',
                path: 'assets/chakra.png',
            },
            {
                id: 4,
                name: 'Vite',
                path: '/assets/vite.png',
            },
        ],
        picture: '',
    },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
    return {
        deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
        deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
        cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
        reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
        ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
        targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
    };
};

export const workExperiences = [
    {
        id: 1,
        name: 'Stride Labs',
        pos: 'Software Engineer',
        duration: 'Oct 2024 - Present',
        title: "\n" +
            "Developed an AI-driven automated system for custom medical brace manufacturing, integrating CAD and padiform orthotics design. Utilized WebGL-based 3D rendering with Three.js to create precise and customizable models, improving accuracy and efficiency in the production of patient-specific orthotic devices",
        icon: '/assets/stride_labs.png',
        animation: 'victory',
    },
    {
        id: 2,
        name: 'Georgia Tech',
        pos: 'Undergraduate Researcher',
        duration: 'Aug 2024 - Present',
        title: "\n" +
            "Enhanced vehicle autonomy and safety using LiDAR technology. Developed Python-based edge detection algorithms with OpenCV and TensorFlow, integrated into a Dockerized ROS2 setup",
        icon: '/assets/gt_logo.png',
        animation: 'victory',
    },
    {
        id: 3,
        name: '360 Energy',
        pos: 'Software Engineer',
        duration: 'Jul 2024 - Present',
        title: "\n" +
            "Built a real-time dashboard for store owners to monitor battery levels, integrating sensor data for live updates. Developed a SolarCharge Optimizer to simulate efficient battery charging based on sunlight, enhancing renewable energy management",
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
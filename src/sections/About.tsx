import { useState } from 'react';
import { motion } from 'framer-motion';
import WelcomeModal from '../components/WelcomeModal';

const techStackIcons = [
    { 
        name: "Java", 
        path: "/assets/java.png", 
        color: "#f89820",
        level: "Advanced",
        description: "Spring Boot, JPA, Microservices"
    },
    { 
        name: "TypeScript", 
        path: "/assets/typescript.png", 
        color: "#3178C6",
        level: "Advanced",
        description: "React, Next.js, Node.js"
    },
    { 
        name: "Python", 
        path: "/assets/python.png", 
        color: "#3776AB",
        level: "Advanced",
        description: "ML/DL, Data Analysis, FastAPI"
    },
    { 
        name: "Spring Boot", 
        path: "/assets/springboot.png", 
        color: "#6DB33F",
        level: "Advanced",
        description: "REST APIs, Security, JPA/Hibernate"
    },
    { 
        name: "React", 
        path: "/assets/react.svg", 
        color: "#61DAFB",
        level: "Advanced",
        description: "Redux, Hooks, Next.js"
    },
    { 
        name: "Tailwind", 
        path: "/assets/tailwindcss.png", 
        color: "#38B2AC",
        level: "Advanced",
        description: "Custom Components, Responsive Design"
    },
    { 
        name: "Numpy", 
        path: "/assets/numpy.png", 
        color: "#013243",
        level: "Intermediate",
        description: "Data Analysis, Scientific Computing"
    },
    { 
        name: "TensorFlow", 
        path: "/assets/tensor.png", 
        color: "#FF6F00",
        level: "Intermediate",
        description: "Deep Learning, Neural Networks"
    },
    { 
        name: "C++", 
        path: "/assets/cpp.png", 
        color: "#00599C",
        level: "Advanced",
        description: "Systems Programming, Data Structures"
    },
    { 
        name: "Unity", 
        path: "/assets/unity.png", 
        color: "#000000",
        level: "Intermediate",
        description: "Game Development, 3D Graphics"
    },
    { 
        name: "Docker", 
        path: "/assets/docker_logo.png", 
        color: "#2496ED",
        level: "Intermediate",
        description: "Containerization, Microservices"
    },
    { 
        name: "AWS", 
        path: "/assets/aws_logo.png", 
        color: "#FF9900",
        level: "Intermediate",
        description: "Cloud Computing, Services"
    }
];

const About = () => {
    const [hasCopied, setHasCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('lukas.park.dev@gmail.com');
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <section className="c-space my-20" id="about" onClick={handleOpenModal}>
            <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 h-full">
                {/* 섹션 1: 소개 */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="col-span-1 row-span-2"
                >
                    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-blue-800 to-yellow-500 rounded-3xl shadow-xl h-full justify-center border border-gray-800 backdrop-blur-sm transition-transform transform hover:scale-105">
                        <img
                            src="/assets/me.jpeg"
                            alt="profile"
                            className="w-48 h-48 object-cover rounded-full shadow-2xl mb-6 ring-4 ring-gray-800"
                        />
                        <h2 className="text-5xl font-bold text-white mb-3 text-center">Hi, I'm <span className="text-yellow-300">Lukas Park</span></h2>
                        <p className="text-lg text-gray-200 text-center leading-relaxed">
                            Studying Computer Science at <span className="font-bold text-yellow-300">Georgia Tech</span>, I have developed strong skills in frontend
                            and backend development, machine learning, and system architecture.
                        </p>
                    </div>
                </motion.div>

                {/* 섹션 2: Tech Stack */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="col-span-1 row-span-2"
                >
                    <div className="flex flex-col p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl h-full border border-gray-800 backdrop-blur-sm transition-transform transform hover:scale-105">
                        <h3 className="text-3xl font-bold text-white mb-4">Tech Stack</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {techStackIcons.map((icon, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    className="group relative flex flex-col items-center"
                                >
                                    <img
                                        src={icon.path}
                                        alt={icon.name}
                                        className="w-20 h-20 transition-all duration-300 group-hover:shadow-lg"
                                        style={{ filter: 'brightness(0.9)' }}
                                    />
                                    <div className="mt-2 text-center text-gray-300">
                                        <div className="font-semibold">{icon.name}</div>
                                        <div className="text-sm">{icon.level}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* 섹션 3: Contact */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="col-span-1 row-span-2"
                >
                    <div className="flex flex-col p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl h-full border border-gray-800 backdrop-blur-sm transition-transform transform hover:scale-105">
                        <h3 className="text-3xl font-bold text-white mb-4">Let's Connect</h3>
                        <motion.img
                            src="/assets/contact-removebg.png"
                            alt="contact"
                            className="w-64 h-auto object-cover shadow-2xl transition-transform duration-300 hover:scale-110"
                        />
                        <div className="flex items-center gap-6 mb-4 justify-center">
                            <div>
                                <div 
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-all duration-300 group transform hover:scale-105"
                                >
                                    <img 
                                        src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'} 
                                        alt="copy" 
                                        className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-transform duration-300"
                                    />
                                    <p className="text-gray-300 group-hover:text-white">lukas.park.dev@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
import { motion } from 'framer-motion';
import { useState } from 'react';
import WelcomeModal from '../components/WelcomeModal';
import HeroCamera from '../components/HeroCamera';

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="home">
            <div 
                className="absolute inset-0 z-0 cursor-pointer" 
                onClick={() => setIsModalOpen(true)}
            >
                <HeroCamera />
            </div>

            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <h1 className="hero_tag text-white">
                        Hi, I'm Lukas Park <span className="waving-hand">👋</span>
                        <br />
                        Software Engineer
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        I'm a software engineer specializing in building exceptional digital experiences.
                        Currently, I'm focused on building accessible, human-centered products.
                    </p>
                </motion.div>
            </div>

            <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};

export default Hero;

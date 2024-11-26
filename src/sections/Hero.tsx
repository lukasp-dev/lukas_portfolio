import { motion } from 'framer-motion';
import { useState } from 'react';
import WelcomeModal from '../components/WelcomeModal';
import HeroCamera from '../components/HeroCamera';
import { TypeAnimation } from 'react-type-animation';

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
                        <TypeAnimation
                            sequence={[
                                'Software Engineer',
                                1000,
                                'CTO of UcamCode',
                                1000,
                                'Team Player',
                                1000,
                                'Fast Learner',
                                1000,
                                'Artist',
                                1000,
                            ]}
                            wrapper="span"
                            speed={40}
                            repeat={Infinity}
                        />
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        I'm a software engineer specializing in building beneficial products. <br/>
                        Currently, I'm focused on building UcamCode, an effective way to learn coding.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                        Navigate through my portfolio
                    </button>
                </motion.div>
            </div>

            <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};

export default Hero;

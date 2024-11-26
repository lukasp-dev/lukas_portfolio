import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UCamCode = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });
    
    const navigate = useNavigate();
    
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1.1, 1.1, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900" ref={containerRef}>
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-sm z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-300 hover:text-white flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Portfolio
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.section 
                style={{ opacity, scale, y }}
                className="min-h-screen flex items-center justify-center relative overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
                    <motion.img
                        src="/assets/ucamcode_small_logo.png"
                        alt="UCamCode Background"
                        className="w-full h-full object-cover opacity-30"
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    />
                </div>
                
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <motion.img
                        src="/assets/ucamcode_big_logo.png"
                        alt="UCamCode Logo"
                        className="w-48 h-auto mx-auto mb-8 object-contain"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    />
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        UCamCode
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-300 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        Bridging the IT education gap in Cambodia
                    </motion.p>
                </div>

                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </motion.section>

            {/* Content Sections */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto space-y-32">
                    {/* 비디오 임베드 */}
                    <div style={{ padding: "56.25% 0 0 0", position: "relative", borderRadius: "10px", overflow: "hidden" }}>
                        <iframe 
                            src="https://player.vimeo.com/video/1033641487?h=28663a1b8a&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
                            frameBorder="0" 
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write" 
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} 
                            title="ucamcode">
                        </iframe>
                    </div>
                    
                    {/* Background Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-white text-center">Our Story</h2>
                        <p className="text-gray-300 text-lg leading-relaxed text-center max-w-2xl mx-auto">
                            UCamCode was founded in July 2024 at Georgia Tech with a mission to revolutionize IT education in Cambodia. 
                            We believe in not just teaching code, but fostering creative thinking and problem-solving skills essential 
                            for success in the global IT market.
                        </p>
                    </motion.div>

                    {/* Partners Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-white text-center">Key Partners</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-lg transition-transform duration-300 hover:scale-105">
                                <h3 className="text-xl font-semibold text-white mb-3">Cambodian Government</h3>
                                <p className="text-gray-300">Working closely with government institutions to ensure widespread access to quality IT education.</p>
                            </div>
                            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-lg transition-transform duration-300 hover:scale-105">
                                <h3 className="text-xl font-semibold text-white mb-3">EBC</h3>
                                <p className="text-gray-300">Partnering with Educational Broadcasting Cambodia for efficient content distribution across the country.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Target Users Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-white text-center">Who We Serve</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-lg transition-transform duration-300 hover:scale-105">
                                <h3 className="text-xl font-semibold text-white mb-3">Students</h3>
                                <p className="text-gray-300">Middle and high school students looking to start their journey in tech.</p>
                            </div>
                            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-lg transition-transform duration-300 hover:scale-105">
                                <h3 className="text-xl font-semibold text-white mb-3">University</h3>
                                <p className="text-gray-300">Both CS majors and non-majors seeking to enhance their technical skills.</p>
                            </div>
                            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-lg transition-transform duration-300 hover:scale-105">
                                <h3 className="text-xl font-semibold text-white mb-3">Underserved</h3>
                                <p className="text-gray-300">Individuals with limited access to traditional technical education.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* CREATE-X Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-lg backdrop-blur-sm shadow-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">Georgia Tech CREATE-X</h2>
                            <p className="text-gray-300 text-lg">
                                We're proud to announce that UCamCode has successfully passed the first round of 
                                Georgia Tech's CREATE-X Startup Launch program and is currently in the interview process.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-t from-black to-transparent">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Help us make quality IT education accessible to everyone in Cambodia.
                        </p>
                        <a
                            href="https://ucamcode.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Visit UCamCode →
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default UCamCode; 
import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WelcomeModal: FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black"
                            onClick={onClose}
                        />
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-gradient-to-br from-blue-900 to-yellow-600 border border-gray-300 rounded-xl p-8 max-w-md w-full mx-4 relative z-10 shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    Welcome to My Portfolio
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-neutral-400 hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <a href="#about" onClick={onClose} className="block">
                                        <div className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>About Me</span>
                                        </div>
                                    </a>

                                    <a href="#work" onClick={onClose} className="block">
                                        <div className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>Experience</span>
                                        </div>
                                    </a>

                                    <a href="#projects" onClick={onClose} className="block">
                                        <div className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            <span>Projects</span>
                                        </div>
                                    </a>

                                    <button 
                                        onClick={() => {
                                            onClose();
                                            navigate('/gallery');
                                        }} 
                                        className="w-full"
                                    >
                                        <div className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Art Gallery</span>
                                        </div>
                                    </button>

                                    <a href="#contact" onClick={onClose} className="block">
                                        <div className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>Contact</span>
                                        </div>
                                    </a>
                                </div>

                                <div className="border-t border-gray-700 pt-6">
                                    <div className="flex items-start gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <div>
                                            <span className="text-blue-400 font-medium">Fun fact!</span>
                                            <p className="mt-1 text-gray-300">I love drawing in my free time. Check out my art gallery in the navigation bar!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="w-full mt-8 btn bg-gradient-to-r from-black-500 to-black-400"
                            >
                                Get Started
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default WelcomeModal;
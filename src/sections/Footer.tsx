const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400">
                    © {currentYear} Lukas Park. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a 
                        href="https://github.com/lukasp-dev" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        GitHub
                    </a>
                    <a 
                        href="https://www.linkedin.com/in/jewookpark/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

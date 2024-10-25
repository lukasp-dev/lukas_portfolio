const Footer = () => {
    return (
        <footer className="flex justify-center c-space pt-7 pb-3 border-t border-black-300 items-center flex-wrap gap-5">
            <div className="flex gap-3">
                <div className="social-icon">
                    <a href="https://github.com/lukasp-dev" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/github.svg" alt="github" className="w-8 h-8 mx-auto" />
                    </a>
                </div>
                <div className="social-icon">
                    <a href="https://www.linkedin.com/in/jewookpark/" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/linkedin.svg" alt="linkedin" className="w-8 h-8 mx-auto" />
                    </a>
                </div>
                <div className="social-icon">
                    <a href="https://www.instagram.com/__woogi22/" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/instagram.svg" alt="instagram" className="w-8 h-8 mx-auto" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

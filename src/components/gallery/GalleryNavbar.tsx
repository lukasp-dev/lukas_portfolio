import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GITHUB_URL = "https://github.com/lukasp-dev";
// TODO: replace with your LinkedIn profile URL
const LINKEDIN_URL = "";

const skills = [
  "React", "TypeScript", "Python", "Java", "Three.js",
  "Spring Boot", "Next.js", "FastAPI", "AWS", "GCP",
  "PyTorch", "Docker", "PostgreSQL", "Machine Learning",
];

const GithubIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const AboutPanel = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex justify-end"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="relative h-full w-full max-w-sm overflow-y-auto"
        style={{ background: "#0e0c0a", borderLeft: "1px solid #2a2218" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-500 hover:text-stone-200 text-2xl leading-none transition-colors"
        >
          ×
        </button>

        <div className="p-8 pt-16">
          <div className="w-8 h-px mb-6" style={{ background: "#6a5030" }} />

          <p
            className="text-[10px] tracking-[0.4em] uppercase mb-1"
            style={{ color: "#6a5830", fontFamily: "Georgia, serif" }}
          >
            Developer · Artist
          </p>
          <h2
            className="text-3xl font-light tracking-wide mb-1"
            style={{ color: "#e8e0d0", fontFamily: "Georgia, serif" }}
          >
            Jewook Park
          </h2>
          <p className="text-sm mb-6" style={{ color: "#7a6848" }}>
            CS @ Georgia Tech
          </p>

          <div
            className="mb-6 p-4 rounded-lg"
            style={{ background: "#181410", border: "1px solid #2a2018" }}
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-1"
              style={{ color: "#6a5030" }}
            >
              Currently
            </p>
            <p className="text-sm font-medium" style={{ color: "#c8b880" }}>
              ML Engineer Co-Op
            </p>
            <p className="text-xs" style={{ color: "#4a3c28" }}>
              Itential · Network Automation
            </p>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "#7a6e60" }}>
            Building AI-powered products across full-stack and ML domains.
            Previously at Genuine Parts Company (NAPA Auto Parts), Stride Labs,
            and Dotori. Hackathon winner at WooHacks 2025 and UGAHacks.
          </p>

          <div className="mb-8">
            <p
              className="text-[10px] tracking-[0.35em] uppercase mb-3"
              style={{ color: "#4a3c28", fontFamily: "Georgia, serif" }}
            >
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-[11px] rounded"
                  style={{
                    background: "#1e1a14",
                    border: "1px solid #2e2618",
                    color: "#9a8860",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:border-amber-900/60"
              style={{ background: "#181410", border: "1px solid #2a2018" }}
            >
              <GithubIcon className="w-5 h-5 flex-shrink-0" style={{ color: "#9a8860" } as React.CSSProperties} />
              <div>
                <p className="text-xs font-medium" style={{ color: "#c8b880" }}>
                  GitHub
                </p>
                <p className="text-[11px]" style={{ color: "#4a3c28" }}>
                  lukasp-dev
                </p>
              </div>
            </a>

            {LINKEDIN_URL && (
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:border-amber-900/60"
                style={{ background: "#181410", border: "1px solid #2a2018" }}
              >
                <LinkedInIcon className="w-5 h-5 flex-shrink-0" style={{ color: "#9a8860" } as React.CSSProperties} />
                <div>
                  <p className="text-xs font-medium" style={{ color: "#c8b880" }}>
                    LinkedIn
                  </p>
                  <p className="text-[11px]" style={{ color: "#4a3c28" }}>
                    Jewook Park
                  </p>
                </div>
              </a>
            )}
          </div>

          <div
            className="mt-8 pt-6"
            style={{ borderTop: "1px solid #1e1a14" }}
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-center"
              style={{ color: "#2e2618", fontFamily: "Georgia, serif" }}
            >
              © 2026 Jewook Park
            </p>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
};

const GalleryNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { name: "PROJECTS", path: "/" },
    { name: "SKETCHBOOK", path: "/gallery" },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              JP
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium tracking-wider relative group transition-colors ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-cyan-400 hover:text-pink-400"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300 ${
                    isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}

            <button
              onClick={() => setAboutOpen(true)}
              className="font-medium tracking-wider relative group transition-colors text-cyan-400 hover:text-pink-400"
            >
              ABOUT
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-cyan-400 to-pink-400 transition-all duration-300" />
            </button>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-pink-400 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-cyan-400 hover:text-pink-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-black/90 backdrop-blur-md border border-cyan-400/30 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-medium tracking-wider py-2 transition-colors ${
                      isActive(item.path)
                        ? "text-white border-l-2 border-pink-400 pl-2"
                        : "text-cyan-400 hover:text-pink-400"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => { setIsOpen(false); setAboutOpen(true); }}
                  className="text-left font-medium tracking-wider py-2 text-cyan-400 hover:text-pink-400 transition-colors"
                >
                  ABOUT
                </button>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium tracking-wider py-2 text-cyan-400 hover:text-pink-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <GithubIcon className="w-4 h-4" />
                  GITHUB
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {aboutOpen && <AboutPanel onClose={() => setAboutOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default GalleryNavbar;

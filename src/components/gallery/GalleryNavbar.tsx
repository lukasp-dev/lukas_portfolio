import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GITHUB_URL = "https://github.com/lukasp-dev";
const LINKEDIN_URL = "https://www.linkedin.com/in/jewookpark/";

const skills = [
  "React",
  "TypeScript",
  "Python",
  "Java",
  "Three.js",
  "Spring Boot",
  "Next.js",
  "FastAPI",
  "AWS",
  "GCP",
  "PyTorch",
  "Docker",
  "PostgreSQL",
  "Machine Learning",
];

// --- common style ---
const COLORS = {
  bg: "#0a0a0a",
  panel: "#111111",
  border: "rgba(255, 255, 255, 0.08)",
  accent: "#d4af37",
  textPrimary: "#e5e5e5",
  textSecondary: "#a3a3a3",
  textMuted: "#666666",
};

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const AboutPanel = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex justify-end"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative h-full w-full max-w-sm overflow-y-auto shadow-2xl"
        style={{
          background: COLORS.panel,
          borderLeft: `1px solid ${COLORS.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-10 pt-20">
          <p
            className="text-[10px] tracking-[0.5em] uppercase mb-2"
            style={{ color: COLORS.accent }}
          >
            Portfolio 2026
          </p>
          <h2
            className="text-4xl font-light tracking-tight mb-2 text-white italic"
            style={{ fontFamily: "serif" }}
          >
            Jewook Park
          </h2>
          <p
            className="text-sm mb-10 font-light"
            style={{ color: COLORS.textSecondary }}
          >
            CS @ Georgia Institute of Technology
          </p>

          <div
            className="mb-10 p-6 rounded-sm border"
            style={{
              borderColor: COLORS.border,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p className="text-[9px] tracking-[0.3em] uppercase mb-2 text-neutral-500">
              Current Role
            </p>
            <p className="text-sm font-medium text-white mb-1">
              ML Engineer Co-Op
            </p>
            <p
              className="text-xs italic"
              style={{ color: COLORS.textSecondary }}
            >
              Itential · Network Automation
            </p>
          </div>

          <div className="space-y-6 mb-12">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-bold">
              Biography
            </h3>
            <p
              className="text-sm leading-relaxed font-light"
              style={{ color: COLORS.textSecondary }}
            >
              Building AI-powered products across full-stack and ML domains.
              Focusing on the intersection of{" "}
              <span style={{ color: COLORS.accent }}>aesthetic design</span> and{" "}
              <span style={{ color: COLORS.accent }}>robust engineering</span>.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-4 font-bold">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 text-[10px] uppercase tracking-wider"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.textSecondary,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-2 p-4 border hover:bg-white/5 transition-all group"
              style={{ borderColor: COLORS.border }}
            >
              <GithubIcon className="w-5 h-5 text-neutral-400 group-hover:text-white" />
              <span className="text-[10px] tracking-widest uppercase text-neutral-500">
                GitHub
              </span>
            </a>
            {LINKEDIN_URL && (
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-2 p-4 border hover:bg-white/5 transition-all group"
                style={{ borderColor: COLORS.border }}
              >
                <LinkedInIcon className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                <span className="text-[10px] tracking-widest uppercase text-neutral-500">
                  LinkedIn
                </span>
              </a>
            )}
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
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl tracking-tighter font-light group">
            <span className="text-white">JEWOOK</span>
            <span
              style={{ color: COLORS.accent }}
              className="ml-1 opacity-70 group-hover:opacity-100 transition-opacity"
            >
              PARK
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-[11px] tracking-[0.3em] transition-all duration-300 relative py-1 ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-200"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{ background: COLORS.accent }}
                  />
                )}
              </Link>
            ))}

            <button
              onClick={() => setAboutOpen(true)}
              className="text-[11px] tracking-[0.3em] text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              ABOUT
            </button>

            <div className="h-4 w-[1px] bg-neutral-800" />

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-400"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-px w-6 bg-current transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-px w-6 bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-6 bg-current transition-transform ${isOpen ? "-rotate-45 -translate-y-1" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-6 p-6 border rounded-sm"
              style={{ background: COLORS.panel, borderColor: COLORS.border }}
            >
              <div className="flex flex-col gap-6 text-center">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-[10px] tracking-[0.4em] ${isActive(item.path) ? "text-white" : "text-neutral-500"}`}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setAboutOpen(true);
                  }}
                  className="text-[10px] tracking-[0.4em] text-neutral-500"
                >
                  ABOUT
                </button>
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

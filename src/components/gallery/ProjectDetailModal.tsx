import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../../constants";

interface HolographicUIProps {
  selectedProject: Project | null;
  onClose: () => void;
}

const HolographicUI = ({ selectedProject, onClose }: HolographicUIProps) => {
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject, onClose]);

  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero image */}
            {selectedProject.picture ? (
              <div className="w-full h-56 sm:h-64 overflow-hidden bg-stone-100">
                <img
                  src={selectedProject.picture}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-stone-200 to-stone-300" />
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-stone-100 text-stone-500 hover:text-stone-700 shadow transition-colors text-lg leading-none"
            >
              ×
            </button>

            <div className="p-6 sm:p-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProject.type && (
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full border border-amber-200 uppercase tracking-wider">
                    {selectedProject.type}
                  </span>
                )}
                {selectedProject.role && (
                  <span className="px-2.5 py-0.5 bg-stone-100 text-stone-600 text-[11px] font-semibold rounded-full border border-stone-200 uppercase tracking-wider">
                    {selectedProject.role}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 leading-tight">
                {selectedProject.title}
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-2">
                {selectedProject.desc}
              </p>
              <p className="text-stone-400 text-sm leading-relaxed mb-5">
                {selectedProject.subdesc}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selectedProject.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg"
                  >
                    <img
                      src={tag.path}
                      alt={tag.name}
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span className="text-stone-700 text-xs font-medium">
                      {tag.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action links */}
              <div className="flex flex-wrap gap-3">
                {selectedProject.links?.github && (
                  <a
                    href={Object.values(selectedProject.links.github)[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    View Code
                  </a>
                )}
                {selectedProject.links?.live && (
                  <a
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Live Demo
                  </a>
                )}
                {selectedProject.links?.youtube && (
                  <a
                    href={selectedProject.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-500 transition-colors"
                  >
                    Watch Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HolographicUI;

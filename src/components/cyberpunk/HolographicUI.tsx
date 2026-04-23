import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../../constants";

interface HolographicUIProps {
  selectedProject: Project | null;
  onClose: () => void;
}

const HolographicUI = ({ selectedProject, onClose }: HolographicUIProps) => {
  return (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="relative max-w-4xl w-full bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border-2 border-cyan-400 rounded-lg p-8 shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(255, 0, 255, 0.2)",
            }}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scan" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-cyan-400 hover:text-pink-400 transition-colors text-2xl font-bold"
            >
              ✕
            </button>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                {selectedProject.title}
              </h2>

              {selectedProject.picture && (
                <img
                  src={selectedProject.picture}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 border-2 border-cyan-400/50"
                  style={{
                    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                  }}
                />
              )}

              <p className="text-cyan-100 text-lg mb-4">
                {selectedProject.desc}
              </p>
              <p className="text-cyan-200/80 mb-6">{selectedProject.subdesc}</p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-400/20 border border-cyan-400/50 rounded-full"
                  >
                    <img src={tag.path} alt={tag.name} className="w-5 h-5" />
                    <span className="text-cyan-300 text-sm">{tag.name}</span>
                  </div>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {selectedProject.links?.github && (
                  <a
                    href={Object.values(selectedProject.links.github)[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    style={{
                      boxShadow: "0 0 15px rgba(255, 0, 255, 0.5)",
                    }}
                  >
                    View Code
                  </a>
                )}
                {selectedProject.links?.live && (
                  <a
                    href={selectedProject.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all"
                    style={{
                      boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
                    }}
                  >
                    Live Demo
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

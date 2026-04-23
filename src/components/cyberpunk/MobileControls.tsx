import { motion } from "framer-motion";

interface MobileControlsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MobileControls = ({
  onRotateLeft,
  onRotateRight,
  onZoomIn,
  onZoomOut,
}: MobileControlsProps) => {
  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 md:hidden">
      {/* Zoom controls */}
      <div className="flex flex-col gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onZoomIn}
          className="w-12 h-12 bg-cyan-400/20 border-2 border-cyan-400 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400/30 transition-colors backdrop-blur-sm"
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
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onZoomOut}
          className="w-12 h-12 bg-cyan-400/20 border-2 border-cyan-400 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400/30 transition-colors backdrop-blur-sm"
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
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </motion.button>
      </div>

      {/* Rotation controls */}
      <div className="flex gap-2 mt-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRotateLeft}
          className="w-12 h-12 bg-pink-400/20 border-2 border-pink-400 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-400/30 transition-colors backdrop-blur-sm"
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
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onRotateRight}
          className="w-12 h-12 bg-pink-400/20 border-2 border-pink-400 rounded-lg flex items-center justify-center text-pink-400 hover:bg-pink-400/30 transition-colors backdrop-blur-sm"
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
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default MobileControls;

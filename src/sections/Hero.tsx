import { motion } from "framer-motion";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import WelcomeModal from "../components/WelcomeModal";
import { TypeAnimation } from "react-type-animation";
import About from "../components/About";

const GARDEN_URL = "https://garden.jewook.com";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="home"
    >
      {/* Ambient background — CSS only, no WebGL */}
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,168,32,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(212,129,58,0.05) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 text-center w-full px-4 pt-20 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="hero_tag text-white">
            Hi, I'm Jewook Park <span className="waving-hand">👋</span>
            <br />
            <TypeAnimation
              sequence={[
                "Software Engineer",
                1000,
                "Team Player",
                1000,
                "Fast Learner",
                1000,
                "Artist",
                1000,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
            />
          </h1>
          <About />
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Navigate through my portfolio
          </button>
          <a
            href="https://drive.google.com/file/d/1K5KkUG7clXLlDm7q2AP_Ni8it-nYKpku/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 mt-4 px-4 py-3 text-white rounded transition bg-blue-800 hover:bg-blue-900"
          >
            Resume
          </a>

          {/* Interactive world preview */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-3"
          >
            <p className="text-xs tracking-widest uppercase text-white/50 font-light">
              or explore me interactively
            </p>

            {isMobile ? (
              <a
                href={GARDEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur text-white hover:bg-white/10 transition w-full max-w-sm justify-center"
              >
                <span className="text-lg">🌿</span>
                <span className="text-sm font-medium">Enter the Botanical Garden</span>
                <span className="text-white/50 text-sm">→</span>
              </a>
            ) : (
              <div className="relative group w-full max-w-2xl mx-auto">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
                  <iframe
                    src={GARDEN_URL}
                    title="Interactive Botanical Garden"
                    className="w-full"
                    style={{ height: "380px", border: "none" }}
                    loading="lazy"
                    allow="accelerometer; gyroscope; webgl; webgl2"
                  />
                </div>
                <a
                  href={GARDEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-2xl backdrop-blur-sm"
                >
                  <span className="px-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-white text-sm font-medium tracking-wide">
                    Open in full screen →
                  </span>
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <WelcomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Hero;

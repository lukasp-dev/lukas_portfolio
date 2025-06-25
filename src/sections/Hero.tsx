import { motion } from "framer-motion";
import { useState } from "react";
import WelcomeModal from "../components/WelcomeModal";
import HeroCamera from "../components/HeroCamera";
import { TypeAnimation } from "react-type-animation";
import About from "../components/About";
const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="home"
    >
      <div
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <HeroCamera />
      </div>

      <div className="relative z-10 text-center">
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
            href="https://drive.google.com/file/d/1gOglzg-LOt-UuSsGxTRQei2kq9p4PsTn/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 mt-4 px-4 py-3 text-white rounded transition bg-blue-800 hover:bg-blue-900"
          >
            Resume
          </a>
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

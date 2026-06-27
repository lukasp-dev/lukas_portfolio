import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="c-space my-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center justify-center space-y-6"
      >
        <p className="text-lg text-white text-center leading-relaxed max-w-xl">
          Studying Computer Science at{" "}
          <span className="font-bold text-gray_gradient">Georgia Tech</span>,
          <br></br>I am a software engineer blending a strong foundation in
          full-stack development with a deep focus on systems programming and
          low-latency infrastructure.
        </p>
      </motion.div>
    </section>
  );
};

export default About;

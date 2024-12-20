import { motion } from "framer-motion";
import { useState } from "react";
import { experiences } from "../constants";
import WorkModal from "../components/WorkModal";
import { Experience as ExperienceType } from "../constants";

const Experience = () => {
  const [selectedWork, setSelectedWork] = useState<ExperienceType | null>(null);

  const TimelineItem = ({
    item,
    onClick,
    index,
    isLeft = true,
  }: {
    item: ExperienceType;
    onClick: () => void;
    index: number;
    isLeft?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`flex w-full ${isLeft ? "justify-start" : "justify-end"} mb-8`}
    >
      <div
        className={`w-full md:w-5/12 relative cursor-pointer group`}
        onClick={onClick}
      >
        <div
          className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 
                    group-hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex gap-4">
            <img
              className="w-12 h-12 rounded-lg object-contain bg-gray-700/30 p-2"
              src={item.icon}
              alt={`${item.name} logo`}
            />
            <div>
              <h3 className="text-xl font-bold text-white">{item.name}</h3>
              <p className="text-gray-400 text-sm">{item.pos}</p>
              <p className="text-gray-500 text-sm">{item.duration}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-300 group-hover:text-white transition-colors">
            {item.title}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const allExperiences = experiences.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <section className="c-space my-20 w-full" id="work">
      <p className="head-text mb-16">Experience Timeline</p>

      <div className="relative max-w-5xl mx-auto">
        {/* Center timeline */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gray-700" />

        {allExperiences.map((exp, index) => (
          <TimelineItem
            key={exp.id}
            item={exp}
            onClick={() => setSelectedWork(exp)}
            index={index}
            isLeft={index % 2 === 0}
          />
        ))}
      </div>

      <WorkModal
        work={selectedWork || allExperiences[0]}
        isOpen={selectedWork !== null}
        onClose={() => setSelectedWork(null)}
      />
    </section>
  );
};

export default Experience;

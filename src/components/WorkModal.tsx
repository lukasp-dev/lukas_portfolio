import { WorkExperience } from "../constants";

interface WorkModalProps {
    work: WorkExperience;
    isOpen: boolean;
    onClose: () => void;
}

const WorkModal = ({ work, isOpen, onClose }: WorkModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-white"
                >
                    <span className="text-2xl">×</span>
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={work.icon} 
                        alt={work.name} 
                        className={work.iconClassName || "w-16 h-16 rounded-lg object-contain bg-gray-700/30 p-2"}
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-white">{work.name}</h2>
                        <p className="text-gray-300">{work.pos}</p>
                        <p className="text-gray-400">{work.duration}</p>
                    </div>
                </div>

                {work.companyInfo && (
                    <p className="text-gray-300 mb-4">{work.companyInfo}</p>
                )}

                {work.companyLink && (
                    <a 
                        href={work.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mb-6 text-blue-400 hover:text-blue-300"
                    >
                        Visit Company Website →
                    </a>
                )}

                <div className="space-y-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                            {work.techStack.map((tech, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Key Achievements</h3>
                        <ul className="space-y-4">
                            {work.achievements.map((achievement, index) => (
                                <li key={index} className="text-gray-300">
                                    <h4 className="font-medium text-white mb-1">{achievement.title}</h4>
                                    <p className="text-gray-300 mb-2">{achievement.description}</p>
                                    {achievement.details && (
                                        <div className="text-gray-400 mt-1 space-y-1">
                                            {Array.isArray(achievement.details) 
                                                ? achievement.details.map((detail, i) => (
                                                    <span key={i} className="block ml-4 before:content-['•'] before:mr-2">
                                                        {detail}
                                                    </span>
                                                ))
                                                : achievement.details
                                            }
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkModal;
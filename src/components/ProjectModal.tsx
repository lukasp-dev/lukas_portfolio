import { Project } from "../constants";

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-white"
                >
                    <span className="text-2xl">×</span>
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center"
                        style={project.logoStyle}
                    >
                        <img src={project.logo} alt="logo" className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{project.title}</h2>
                        <p className="text-gray-300">{project.desc}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                        <p className="text-gray-300">{project.subdesc}</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full">
                                    <img src={tag.path} alt={tag.name} className="w-4 h-4" />
                                    <span className="text-sm text-gray-200">{tag.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {project.picture && (
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-3">Preview</h3>
                            <img 
                                src={project.picture} 
                                alt="preview" 
                                className="w-full rounded-lg border border-gray-700"
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-amber-glow hover:text-amber-gold transition-colors"
                        >
                            View Project →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
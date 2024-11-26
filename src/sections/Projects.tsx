import { useState } from 'react';
import ProjectModal from '../components/ProjectModal';
import { Project } from '../constants';
import { myProjects } from '../constants';

const Projects: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section className="c-space my-20">
            <p className="head-text">My Selected Work</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {myProjects.map((project, index) => (
                    <div 
                        key={index}
                        className="relative cursor-pointer group overflow-hidden rounded-xl shadow-xl border border-gray-800 hover:border-gray-700 transition-all duration-300"
                        onClick={() => setSelectedProject(project)}
                    >
                        <div className="relative h-72">
                            <img 
                                src={project.spotlight} 
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />
                            <div className="absolute bottom-0 p-6 text-white">
                                <div className="flex items-center gap-3 mb-3">
                                    <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={project.logoStyle}
                                    >
                                        <img src={project.logo} alt="logo" className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{project.title}</h3>
                                </div>
                                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{project.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedProject && (
                <ProjectModal 
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
};

export default Projects;
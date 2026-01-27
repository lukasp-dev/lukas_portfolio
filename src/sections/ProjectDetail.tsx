import { useParams } from 'react-router-dom';
import { myProjects } from '../constants';
import NotionPage from '../components/NotionPage'; 
import { Project } from '../constants';

const ProjectDetail = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const project = myProjects.find(p => p.title === projectId) as Project;

    if (!project) {
        return <div className="p-6 text-white">Project not found</div>;
    }

    return (
        <div className="p-6 text-white rounded-lg shadow-lg h-screen mx-4 mb-6">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg mb-2">{project.desc}</p>
            <div className="flex flex-row mb-4 rounded-lg shadow-md">
                <div className="type bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-2">{project.type}</div>
                <div className="role bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{project.role}</div>
            </div>
            {project.links?.youtube && (
                <div className="mb-4 flex justify-center">
                    <iframe 
                        width="560" 
                        height="315" 
                        src={`https://www.youtube.com/embed/${project.links.youtube}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                    ></iframe>
                </div>
            )}
            <div className="flex flex-row gap-4 mb-4">
                {project.links?.live && (
                    <a 
                        href={project.links.live} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-500 transition"
                    >
                        Live
                    </a>
                )}
                {project.links?.github && (
                    <>
                        {project.links.github.frontend && (
                            <a 
                                href={project.links.github.frontend} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
                            >
                                <img src="/assets/github.svg" alt="GitHub" className="w-4 h-4 mr-2" />
                                <span>GitHub Frontend Code</span>
                            </a>
                        )}
                        {project.links.github.backend && (
                            <a 
                                href={project.links.github.backend} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
                            >
                                <img src="/assets/github.svg" alt="GitHub" className="w-4 h-4 mr-2" />
                                <span>GitHub Backend Code</span>
                            </a>
                        )}
                        {project.links.github.fullstack && (
                            <a 
                                href={project.links.github.fullstack} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition"
                            >
                                <img src="/assets/github.svg" alt="GitHub" className="w-4 h-4 mr-2" />
                                <span>GitHub Fullstack Code</span>
                            </a>
                        )}
                    </>
                )}
            </div>

            <NotionPage pageId={project.pageId || ''} />
        </div>
    );
};

export default ProjectDetail;
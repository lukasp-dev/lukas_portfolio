import { Link } from "react-router-dom";
import { myProjects } from "../constants";

const Projects = () => {
  return (
    <section className="c-space my-20" id="projects">
      <p className="head-text">My Projects</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {myProjects.map((project, index) => (
          <div
            key={index}
            className="relative cursor-pointer group overflow-hidden rounded-xl transition-all duration-300 p-6"
            style={{
              background: 'linear-gradient(135deg, #131020, #1c1828)',
              border: '1px solid rgba(200, 168, 32, 0.18)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(200, 168, 32, 0.14)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            <Link to={`/project/${project.title}`} className="block h-full">
              <div className="relative h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <h3
                    className="text-xl font-bold transition-colors"
                    style={{ color: '#f0e8d0' }}
                  >
                    {project.title}
                  </h3>
                </div>
                {project.picture && (
                  <img
                    src={project.picture}
                    alt={`${project.title} thumbnail`}
                    className="w-full h-[180px] object-cover rounded-lg shadow-md mb-4"
                    style={{ border: '1px solid rgba(200, 168, 32, 0.15)' }}
                  />
                )}
                <p className="text-sm mb-4 font-semibold" style={{ color: '#d4c4a0' }}>
                  {project.desc}
                </p>
                <p className="text-sm mb-4" style={{ color: '#a898b8' }}>
                  {project.subdesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center px-2 py-1 rounded-full text-sm"
                      style={{ background: 'rgba(200, 168, 32, 0.1)', border: '1px solid rgba(200, 168, 32, 0.2)', color: '#c8a820' }}
                    >
                      <img
                        src={tag.path}
                        alt={tag.name}
                        className="w-4 h-4 mr-1"
                      />
                      <span>{tag.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;

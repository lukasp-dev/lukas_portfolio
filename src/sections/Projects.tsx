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
            className="relative cursor-pointer group overflow-hidden rounded-xl shadow-md border border-gray-700 transition-all duration-300 p-6 bg-gradient-to-br from-white-700 to-gray-900"
          >
            <Link to={`/project/${project.title}`} className="block h-full">
              <div className="relative h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold group-hover:text-blue-300 transition-colors text-white">
                    {project.title}
                  </h3>
                </div>
                {project.picture && (
                  <img
                    src={project.picture}
                    alt={`${project.title} thumbnail`}
                    className="w-full h-[180px] object-cover rounded-lg shadow-md mb-4"
                  />
                )}
                <p className="text-sm text-gray-100 group-hover:text-white transition-colors mb-4 font-bold">
                  {project.desc}
                </p>
                <p className="text-sm text-gray-100 group-hover:text-white transition-colors mb-4">
                  {project.subdesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-700"
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

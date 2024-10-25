import { workExperiences } from '../constants/index.js';

const Experience = () => {

    return (
        <section className="c-space my-20 w-full" id="work">
            <div className="w-full text-white-600">
                <p className="head-text">My Work Experience</p>

                <div className="work-container flex flex-col gap-10">
                    {workExperiences.map((item, index) => (
                        <div
                            key={index}
                            className="work-content_container group hover:scale-105 transition-transform ease-in-out duration-300 cursor-pointer mb-5 p-4 rounded-lg bg-gray-800 bg-opacity-75 mx-auto w-full max-w-3xl">
                            <div className="flex flex-col h-full justify-start items-start py-2">
                                <div className="work-content_logo mb-4">
                                    <img className="w-12 h-12" src={item.icon} alt="" />
                                </div>

                                <div className="sm:p-5 px-2.5 py-5">
                                    <p className="font-bold text-white-800">{item.name}</p>
                                    <p className="text-sm mb-5">
                                        {item.pos}  <div>{item.duration}</div>
                                    </p>
                                    <p className="group-hover:text-white transition-all ease-in-out duration-500">{item.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;

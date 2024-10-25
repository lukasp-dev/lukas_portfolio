import { useState } from 'react';
import Globe from 'react-globe.gl';
import Button from '../components/Button.jsx';

const techStackIcons = [
    { name: "Java", path: "/assets/java.png" },
    { name: "Spring Boot", path: "/assets/springboot.png" },
    { name: "TypeScript", path: "/assets/typescript.png" },
    { name: "React", path: "/assets/react.svg" },
    { name: "Tailwind", path: "/assets/tailwindcss.png" },
    { name: "Python", path: "/assets/python.png" },
    { name: "Numpy", path: "/assets/numpy.png" },
    { name: "Tensor", path: "/assets/tensor.png" },
    { name: "Cpp", path: "/assets/cpp.png" },
    { name: "Unity", path: "/assets/unity.png" }
];

const About = () => {
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('lukas.park.dev@gmail.com');
        setHasCopied(true);

        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    };

    return (
        <section className="c-space my-20" id="about">
            <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">

                {/* 섹션 1: 소개 */}
                <div className="col-span-1 xl:row-span-3">
                    <div
                        className="grid-container flex flex-col items-center p-6 sm:p-8 bg-black rounded-lg shadow-md h-full justify-end">
                        <img
                            src="/assets/me.jpeg"
                            alt="grid-1"
                            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg hover:scale-105 transition-transform duration-300 mb-6"
                        />
                        <div className="text-left w-full">
                            <p className="text-2xl font-bold text-white mb-2">Hi, I’m Lukas Park</p>
                            <p className="text-base grid-subtext">
                                Studying Computer Science at Georgia Tech, I have developed strong skills in frontend
                                and backend development, machine learning, and system architecture.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 섹션 2: Tech Stack */}
                <div className="col-span-1 xl:row-span-3">
                    <div className="grid-container flex flex-col p-6 sm:p-8 bg-black rounded-lg shadow-md h-full">
                        <div className="flex flex-wrap justify-center items-center gap-3 mb-4 h-full"> {/* h-full 추가 */}
                            <div className="grid grid-cols-5 gap-4">
                                {techStackIcons.map((icon, index) => (
                                    <img
                                        key={index}
                                        src={icon.path}
                                        alt={icon.name}
                                        className="w-12 h-12 hover:scale-110 transition-transform duration-300 mx-auto"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mt-auto">
                            <p className="text-2xl font-bold text-white mb-2 text-left">Tech Stack</p>
                            <p className="text-base text-gray-400 text-left">
                                I specialize in a variety of languages, frameworks, and tools that allow me to build
                                robust and scalable applications.
                            </p>
                        </div>
                    </div>
                </div>


                {/* 섹션 3: Globe */}
                <div className="col-span-1 xl:row-span-4">
                    <div className="grid-container">
                        <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
                            <Globe
                                height={326}
                                width={326}
                                backgroundColor="rgba(0, 0, 0, 0)"
                                backgroundImageOpacity={0.5}
                                showAtmosphere
                                showGraticules
                                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                labelsData={[{
                                    lat: 33.7756,
                                    lng: -84.3963,
                                    text: "I'm here!",
                                    color: 'white',
                                    size: 15
                                }]}
                            />
                        </div>
                        <div>
                            <p className="grid-headtext">I’m very flexible with time zone communications & locations</p>
                            <p className="grid-subtext">I&apos;m based in Rjieka, Croatia and open to remote work
                                worldwide.</p>
                            <Button name="Contact Me" isBeam containerClass="w-full mt-10"/>
                        </div>
                    </div>
                </div>

                {/* 섹션 4: Coding Passion */}
                <div className="xl:col-span-2 xl:row-span-3">
                    <div
                        className="grid-container flex flex-col justify-between p-6 sm:p-8 bg-black rounded-lg shadow-md h-full">
                        <img
                            src="/assets/grid3.png"
                            alt="grid-3"
                            className="w-full sm:h-[266px] h-fit object-contain mb-4"
                        />
                        <div>
                            <p className="text-2xl font-bold text-white mb-2">My Passion for Coding</p>
                            <p className="text-base text-gray-400">
                                I love solving problems and building things through code. Programming isn&apos;t just my
                                profession—it&apos;s my passion. I enjoy exploring new technologies, and enhancing my
                                skills.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 섹션 5: Contact */}
                <div className="xl:col-span-1 xl:row-span-2">
                    <div className="grid-container">
                        <img
                            src="/assets/grid4.png"
                            alt="grid-4"
                            className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"
                        />
                        <div className="space-y-2">
                            <p className="grid-subtext text-center">Contact me</p>
                            <div className="copy-container cursor-pointer" onClick={handleCopy}>
                                <img src={hasCopied ? 'assets/tick.svg' : 'assets/copy.svg'} alt="copy"/>
                                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">lukas.park.dev@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

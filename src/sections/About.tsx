import { useState } from 'react';
import Globe from 'react-globe.gl';

import Button from '../components/Button';
import Skills from "../components/Skills";

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
            <Skills />
            <div className="mt-20 grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
                <div className="col-span-1 xl:row-span-3">
                    <div className="grid-container flex flex-col items-center p-6 sm:p-8 bg-black rounded-lg shadow-md h-full justify-end">
                        <img
                            src="/assets/me.jpeg"
                            alt="grid-1"
                            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full shadow-lg hover:scale-105 transition-transform duration-300 mb-6"
                        />
                        <div className="text-left w-full">
                            <p className="text-2xl font-bold text-white mb-2">Hi, I’m Lukas.</p>
                            <p className="text-base grid-subtext">
                                Studying Computer Science at Georgia Tech, I have developed strong skills in frontend and backend development, machine learning, and system architecture.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 xl:row-span-3">
                    <div className="grid-container flex flex-col items-center p-6 sm:p-8 bg-black rounded-lg shadow-md h-full justify-between">
                        <div className="flex-grow grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 items-center justify-center">
                            {/* ... 기술 스택 아이콘들 */}
                        </div>
                        <div className="text-left w-full mt-auto">
                            <p className="text-2xl font-bold text-white mb-2">Tech Stack</p>
                            <p className="text-base text-gray-400">
                                I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 xl:row-span-4">
                    <div className="grid-container">
                        <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
                            <Globe
                                height={326}
                                width={326}
                                backgroundColor="rgba(0, 0, 0, 0)"
                                showAtmosphere
                                showGraticules
                                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                labelsData={[{
                                    lat: 33.7756,
                                    lng: -84.3963,
                                    text: "I'm here!",
                                    color: 'white',
                                    size: 20
                                }]}
                            />
                        </div>
                        <div>
                            <p className="grid-headtext">I’m very flexible with time zone communications & locations</p>
                            <p className="grid-subtext">I&apos;m based in Rjieka, Croatia and open to remote work worldwide.</p>
                            <a href="#contact"><Button name="Contact Me" isBeam containerClass="w-full mt-10"/></a>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-1 xl:row-span-2">
                    <div className="grid-container">
                        <img
                            src="assets/grid4.png"
                            alt="grid-4"
                            className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"
                        />
                        <div className="space-y-2">
                            <p className="grid-subtext text-center">Contact me</p>
                            <div className="copy-container cursor-pointer" onClick={handleCopy}>
                                <img src={hasCopied ? 'assets/tick.svg' : 'assets/copy.svg'} alt="copy" />
                                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">lukas.park.dev@gmail.com</p>
                            </div>
                            {hasCopied && <p className="text-sm text-green-500">Email copied to clipboard!</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

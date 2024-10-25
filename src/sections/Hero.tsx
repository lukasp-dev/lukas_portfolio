import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import HackerRoom from '../components/HackerRoom.tsx';
import CanvasLoader from '../components/CanvasLoader.tsx';
import { Leva, useControls } from 'leva';
import { useMediaQuery } from 'react-responsive';
import Target from "../components/Target.tsx";
import ReactLogo from "../components/ReactLogo.tsx";
import PythonLogo from "../components/PythonLogo.tsx";
import CppLogo from "../components/CppLogo.tsx";
import JavaLogo from "../components/JavaLogo.tsx";
import HeroCamera from "../components/HeroCamera.tsx";
import Button from "../components/Button.tsx";

const Hero = () => {
    const isSmall = useMediaQuery({ maxWidth: 440 });
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });

    // `calculateSizes` 함수 선언 수정 및 사용 위치 변경
    const calculateSizes = (isSmall: boolean, isMobile: boolean, isTablet: boolean) => {
        return {
            deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
            deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
            cppPosition: isSmall ? [-3.5, 4, 0] : isMobile ? [8, 3, 0] : isTablet ? [-7, 5, 0] : [-11, 2, 0], // C++ 로고 위치 추가
            reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [11, 3, 0],
            ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
            javaPosition: isSmall ? [-5, -11, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-9.5, -9, -10] : [-13, -10, -10],
            pythonLogoPosition: isSmall ? [4, -7, 0] : isMobile ? [5, -5, 0] : isTablet ? [7, -5, 0] : [9, -5.5, 0],
        };
    };

    const sizes = calculateSizes(isSmall, isMobile, isTablet);

    // isBeam 변수 정의
    const isBeam = true;
    const name = "Let's work together";

    return (
        <section className="min-h-screen w-full relative flex flex-col justify-between">
            <div className="w-full mx-auto flex flex-col mt-20 sm:mt-36 gap-3 c-space items-center justify-start">
                <p className="sm:text-2xl text-xl font-medium text-white text-center font-generalsans">
                    Hello, I'm Lukas<span className="waving-hand">👋</span>
                </p>
                <p className="hero_tag text-gray_gradient text-center">
                    SW/ML Engineer
                </p>
                <p className="grid-subtext"> Computer Science Student at Georgia Tech</p>
            </div>
            <div className="w-full h-full absolute inset-0">
                {/*<Leva />*/}
                <Canvas className="w-full h-full">
                    <Suspense fallback={<CanvasLoader/>}>
                        <PerspectiveCamera makeDefault position={[0, 0, 30]}/>
                        <HeroCamera isMobile={isMobile}>
                            <HackerRoom
                                scale={sizes.deskScale}
                                position={sizes.deskPosition}
                                rotation={[0, -Math.PI, 0]}
                            />
                        </HeroCamera>
                        <group>
                            <PythonLogo position={sizes.pythonLogoPosition}/>
                            <ReactLogo position={sizes.reactLogoPosition}/>
                            <CppLogo position={sizes.cppPosition}/>
                            <JavaLogo position={sizes.javaPosition}/>
                        </group>
                        <ambientLight intensity={2}/>
                        <directionalLight intensity={3} position={[10, 10, 10]}/>
                    </Suspense>
                </Canvas>
            </div>
            <div className="absolute bottom-7 left-0 right-0 w-full z-10 c-space">
                <a href="#about" className="w-fit">
                    <Button name="Let's work together" isBeam containerClass="sm:w-fit w-full sm:min-w-96"/>
                </a>
            </div>
        </section>
    );
};

export default Hero;

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import CyberpunkCity from "../components/cyberpunk/CyberpunkCity";
import NeonLights from "../components/cyberpunk/NeonLights";
import RainEffect from "../components/cyberpunk/RainEffect";
import ProjectBuilding from "../components/cyberpunk/ProjectBuilding";
import HolographicUI from "../components/cyberpunk/HolographicUI";
import CyberpunkNavbar from "../components/cyberpunk/CyberpunkNavbar";
import MobileControls from "../components/cyberpunk/MobileControls";
import { myProjects, Project } from "../constants";
import Loading from "../components/Loading";

const CyberpunkScene = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const controlsRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  // Mobile control handlers
  const handleRotateLeft = () => {
    if (controlsRef.current) {
      controlsRef.current.rotateLeft(0.5);
    }
  };

  const handleRotateRight = () => {
    if (controlsRef.current) {
      controlsRef.current.rotateLeft(-0.5);
    }
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
    }
  };

  // Position projects in a circle around the center
  const projectPositions: [number, number, number][] = myProjects
    .slice(0, 8)
    .map((_, index) => {
      const angle = (index / 8) * Math.PI * 2;
      const radius = isMobile ? 25 : 30;
      return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
    });

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Navbar */}
      <CyberpunkNavbar />

      {/* Title overlay */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 text-center px-4 pointer-events-none">
        <h1
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 mb-2"
          style={{
            textShadow:
              "0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.6)",
          }}
        >
          JEWOOK PARK
        </h1>
        <p className="text-cyan-300 text-sm sm:text-base md:text-xl tracking-widest">
          SOFTWARE ENGINEER • CYBERPUNK PORTFOLIO
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center px-4">
        <p className="text-cyan-400 text-xs sm:text-sm">
          {isMobile
            ? "Tap buildings to explore projects"
            : "Click on buildings to explore projects • Drag to rotate • Scroll to zoom"}
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 20, 50], fov: 75 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <NeonLights />

          {/* Background stars */}
          <Stars
            radius={300}
            depth={60}
            count={5000}
            factor={7}
            saturation={0}
            fade
            speed={1}
          />

          {/* City */}
          <CyberpunkCity />

          {/* Project buildings */}
          {myProjects.slice(0, 8).map((project, index) => (
            <ProjectBuilding
              key={project.title}
              position={projectPositions[index]}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}

          {/* Rain effect - fewer particles on mobile */}
          <RainEffect count={isMobile ? 1000 : 3000} />

          {/* Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={isMobile ? 30 : 25}
            maxDistance={isMobile ? 90 : 120}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 5, 0]}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Holographic UI for project details */}
      <HolographicUI
        selectedProject={selectedProject}
        onClose={handleCloseProject}
      />

      {/* Mobile controls */}
      {isMobile && (
        <MobileControls
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      )}

      {/* Loading fallback */}
      <Suspense fallback={<Loading />} />
    </div>
  );
};

export default CyberpunkScene;

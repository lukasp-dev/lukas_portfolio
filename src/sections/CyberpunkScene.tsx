import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import NeonLights from "../components/cyberpunk/NeonLights";
import RainEffect from "../components/cyberpunk/RainEffect";
import DetailedBuilding from "../components/cyberpunk/DetailedBuilding";
import BuildingModel from "../components/cyberpunk/BuildingModel";
import CityRoads from "../components/cyberpunk/CityRoads";
import HolographicUI from "../components/cyberpunk/HolographicUI";
import CyberpunkNavbar from "../components/cyberpunk/CyberpunkNavbar";
import MobileControls from "../components/cyberpunk/MobileControls";
import { myProjects, Project } from "../constants";
import {
  useProceduralBuildings,
  getProjectBuildingModel,
  getRandomBackgroundModel,
} from "../constants/buildingModels";
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

  // Grid-based city layout
  const gridSize = 3; // 3x3 grid of blocks
  const blockSize = 15; // Size of each city block
  const roadWidth = 4; // Width of roads between blocks

  // Position projects in a grid layout
  const projectPositions: [number, number, number][] = [];
  const projects = myProjects.slice(0, 8);

  let projectIndex = 0;
  for (let x = 0; x < gridSize && projectIndex < projects.length; x++) {
    for (let z = 0; z < gridSize && projectIndex < projects.length; z++) {
      const posX = (x - gridSize / 2) * (blockSize + roadWidth);
      const posZ = (z - gridSize / 2) * (blockSize + roadWidth);
      projectPositions.push([posX, 0, posZ]);
      projectIndex++;
    }
  }

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
            ? "Tap buildings to explore projects • Use controls to navigate"
            : "Click buildings to explore • Drag to pan & rotate • Scroll to zoom • SimCity-style view"}
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [50, 50, 50],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
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

          {/* City roads and infrastructure */}
          <CityRoads
            gridSize={gridSize}
            blockSize={blockSize}
            roadWidth={roadWidth}
          />

          {/* Ground plane */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[300, 300]} />
            <meshStandardMaterial
              color="#0a0a0f"
              metalness={0.3}
              roughness={0.9}
            />
          </mesh>

          {/* Project buildings - use models if available, otherwise procedural */}
          {projects.map((project, index) => {
            const modelConfig = getProjectBuildingModel(index);

            if (modelConfig && !useProceduralBuildings) {
              return (
                <BuildingModel
                  key={project.title}
                  position={projectPositions[index]}
                  modelPath={modelConfig.path}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                  scale={modelConfig.scale || 1}
                  rotation={modelConfig.rotation || [0, 0, 0]}
                />
              );
            }

            return (
              <DetailedBuilding
                key={project.title}
                position={projectPositions[index]}
                project={project}
                onClick={() => handleProjectClick(project)}
                seed={index * 100}
              />
            );
          })}

          {/* Background filler buildings - use models if available, otherwise procedural */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 60 + Math.random() * 20;
            const position: [number, number, number] = [
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius,
            ];

            const modelConfig = getRandomBackgroundModel();

            if (modelConfig && !useProceduralBuildings) {
              return (
                <BuildingModel
                  key={`filler-${i}`}
                  position={position}
                  modelPath={modelConfig.path}
                  scale={modelConfig.scale || 0.8}
                  rotation={
                    modelConfig.rotation || [0, Math.random() * Math.PI * 2, 0]
                  }
                />
              );
            }

            return (
              <DetailedBuilding
                key={`filler-${i}`}
                position={position}
                seed={i * 50 + 1000}
              />
            );
          })}

          {/* Rain effect - fewer particles on mobile */}
          <RainEffect count={isMobile ? 500 : 2000} />

          {/* Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={isMobile ? 40 : 30}
            maxDistance={isMobile ? 120 : 150}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 6}
            target={[0, 0, 0]}
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

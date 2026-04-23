import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { Vector3 } from "three";
import HolographicUI from "../components/cyberpunk/HolographicUI";
import CyberpunkNavbar from "../components/cyberpunk/CyberpunkNavbar";
import { myProjects, Project } from "../constants";
import Loading from "../components/Loading";

// Picture Frame Component with HTML Image (avoids CORS issues)
const PictureFrame = ({
  position,
  rotation,
  project,
  onClick,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  project: Project;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  // Use picture field for actual screenshots, fallback to spotlight
  const imageUrl = project.picture || project.spotlight;

  return (
    <group position={position} rotation={rotation}>
      {/* Frame border */}
      <mesh>
        <boxGeometry args={[3.2, 2.2, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Clickable mesh with image background */}
      <mesh
        position={[0, 0, 0.06]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial
          color={hovered ? "#00ffff" : "#ffffff"}
          emissive={hovered ? "#00ffff" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />

        {/* HTML Image Overlay on the mesh */}
        <Html
          center
          distanceFactor={1.5}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <img
            src={imageUrl}
            alt={project.title}
            style={{
              width: "300px",
              height: "200px",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
              borderRadius: "2px",
            }}
            onError={(e) => {
              // Fallback to spotlight if picture fails
              if (imageUrl === project.picture && project.spotlight) {
                e.currentTarget.src = project.spotlight;
              }
            }}
          />
        </Html>
      </mesh>

      {/* Project title plate below frame */}
      <mesh position={[0, -1.3, 0.06]}>
        <planeGeometry args={[3, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Spotlight on frame */}
      <spotLight
        position={[0, 0, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={hovered ? 2 : 1}
        color={hovered ? "#00ffff" : "#ffffff"}
        target-position={[0, 0, 0]}
      />
    </group>
  );
};

// Gallery Room Component
const GalleryRoom = ({
  onFrameClick,
}: {
  onFrameClick: (project: Project) => void;
}) => {
  const projects = myProjects.slice(0, 8);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* North Wall */}
      <mesh position={[0, 3, -20]} receiveShadow>
        <planeGeometry args={[100, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* South Wall */}
      <mesh position={[0, 3, 20]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[100, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* East Wall */}
      <mesh position={[20, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[100, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* West Wall */}
      <mesh position={[-20, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[100, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>

      {/* Picture Frames on North Wall */}
      {projects.slice(0, 2).map((project, i) => (
        <PictureFrame
          key={`north-${i}`}
          position={[-8 + i * 16, 3, -19.5]}
          rotation={[0, 0, 0]}
          project={project}
          onClick={() => onFrameClick(project)}
        />
      ))}

      {/* Picture Frames on South Wall */}
      {projects.slice(2, 4).map((project, i) => (
        <PictureFrame
          key={`south-${i}`}
          position={[-8 + i * 16, 3, 19.5]}
          rotation={[0, Math.PI, 0]}
          project={project}
          onClick={() => onFrameClick(project)}
        />
      ))}

      {/* Picture Frames on East Wall */}
      {projects.slice(4, 6).map((project, i) => (
        <PictureFrame
          key={`east-${i}`}
          position={[19.5, 3, -8 + i * 16]}
          rotation={[0, -Math.PI / 2, 0]}
          project={project}
          onClick={() => onFrameClick(project)}
        />
      ))}

      {/* Picture Frames on West Wall */}
      {projects.slice(6, 8).map((project, i) => (
        <PictureFrame
          key={`west-${i}`}
          position={[-19.5, 3, -8 + i * 16]}
          rotation={[0, Math.PI / 2, 0]}
          project={project}
          onClick={() => onFrameClick(project)}
        />
      ))}
    </group>
  );
};

// WASD Movement Controller - Completely free movement
const WASDControls = () => {
  const { camera } = useThree();
  const moveSpeed = 10;
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const velocity = new Vector3();

    if (keys.current.forward) {
      velocity.add(direction);
    }
    if (keys.current.backward) {
      velocity.sub(direction);
    }
    if (keys.current.left) {
      // Fixed: A should move left
      const left = new Vector3();
      left.crossVectors(direction, new Vector3(0, 1, 0));
      velocity.add(left);
    }
    if (keys.current.right) {
      // Fixed: D should move right
      const right = new Vector3();
      right.crossVectors(new Vector3(0, 1, 0), direction);
      velocity.add(right);
    }

    if (velocity.length() > 0) {
      velocity.normalize().multiplyScalar(moveSpeed * delta);
      camera.position.add(velocity);
      // NO BOUNDS - completely free movement!
    }
  });

  return null;
};

const CyberpunkScene = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleFrameClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

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
          INTERACTIVE GALLERY
        </h1>
        <p className="text-cyan-300 text-sm sm:text-base md:text-xl tracking-widest">
          Walk around and click frames to explore projects
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center px-4">
        <div className="bg-black/70 border border-cyan-400/50 rounded-lg px-6 py-3 backdrop-blur-sm">
          <p className="text-cyan-300 text-sm">
            {isMobile
              ? "Touch to rotate • Pinch to zoom • Tap frames to view projects"
              : "WASD: Move • Mouse Drag: Look around • Scroll: Zoom • Click Frames: View Projects"}
          </p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{
          position: [0, 1.6, 15],
          fov: 75,
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
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={0.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Gallery Room */}
          <GalleryRoom onFrameClick={handleFrameClick} />

          {/* WASD Movement Controls */}
          {!isMobile && <WASDControls />}

          {/* Orbit Controls - Completely free */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.1}
            maxDistance={1000}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            target={[0, 1.6, 0]}
            enableDamping
            dampingFactor={0.05}
          />

          {/* Background stars */}
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Project Details Modal */}
      <HolographicUI
        selectedProject={selectedProject}
        onClose={handleCloseProject}
      />

      {/* Loading fallback */}
      <Suspense fallback={<Loading />} />
    </div>
  );
};

export default CyberpunkScene;

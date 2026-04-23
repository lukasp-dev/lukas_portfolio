import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import React, { Suspense, useState, useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { Vector3 } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { motion, AnimatePresence } from "framer-motion";
import HolographicUI from "../components/gallery/ProjectDetailModal";
import GalleryNavbar from "../components/gallery/GalleryNavbar";
import { myProjects, Project } from "../constants";

// Unique color palette for each frame canvas
const CANVAS_COLORS = [
  { bg: "#0d1f2d", accent: "#1a7a9e" },
  { bg: "#0d2a18", accent: "#1a9e5a" },
  { bg: "#1e0d2a", accent: "#7a1a9e" },
  { bg: "#2a0d0d", accent: "#9e1a1a" },
  { bg: "#2a1a0d", accent: "#9e5a1a" },
  { bg: "#0d0d2a", accent: "#1a1a9e" },
  { bg: "#0d1e0d", accent: "#2a9e0d" },
  { bg: "#2a0d1a", accent: "#9e0d4e" },
];

// Single artwork frame with gold border and abstract canvas
const ArtworkFrame = ({
  position,
  rotation,
  project,
  colorIndex,
  onHover,
  onUnhover,
  onClick,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  project: Project;
  colorIndex: number;
  onHover: (project: Project) => void;
  onUnhover: () => void;
  onClick: (project: Project) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const c = CANVAS_COLORS[colorIndex % CANVAS_COLORS.length];

  const FW = 5.4;
  const FH = 3.8;
  const IW = 4.7;
  const IH = 3.1;

  return (
    <group position={position} rotation={rotation}>
      {/* Shadow catcher behind frame */}
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <planeGeometry args={[FW + 0.3, FH + 0.3]} />
        <meshStandardMaterial color="#d4c8b0" roughness={1} />
      </mesh>

      {/* Outer gold frame */}
      <mesh castShadow>
        <boxGeometry args={[FW, FH, 0.16]} />
        <meshStandardMaterial
          color={hovered ? "#d4a830" : "#a88820"}
          metalness={0.88}
          roughness={0.12}
          emissive={hovered ? "#7a5500" : "#2a1800"}
          emissiveIntensity={hovered ? 0.45 : 0.12}
        />
      </mesh>

      {/* Inner canvas */}
      <mesh
        position={[0, 0, 0.09]}
        onClick={(e) => {
          e.stopPropagation();
          onClick(project);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(project);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onUnhover();
          document.body.style.cursor = "default";
        }}
      >
        <planeGeometry args={[IW, IH]} />
        <meshStandardMaterial
          color={c.bg}
          emissive={c.accent}
          emissiveIntensity={hovered ? 0.35 : 0.08}
          roughness={0.85}
        />
      </mesh>

      {/* Top accent stripe */}
      <mesh position={[0, IH / 2 - 0.18, 0.1]}>
        <planeGeometry args={[IW, 0.28]} />
        <meshStandardMaterial
          color={c.accent}
          emissive={c.accent}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.5}
        />
      </mesh>

      {/* Bottom accent stripe */}
      <mesh position={[0, -(IH / 2) + 0.18, 0.1]}>
        <planeGeometry args={[IW, 0.28]} />
        <meshStandardMaterial
          color={c.accent}
          emissive={c.accent}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.5}
        />
      </mesh>

      {/* Name plaque */}
      <mesh position={[0, -(FH / 2 + 0.34), 0.06]}>
        <boxGeometry args={[3.8, 0.52, 0.08]} />
        <meshStandardMaterial
          color={hovered ? "#2a1f0a" : "#1c1408"}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Spotlight from above */}
      <spotLight
        position={[0, 8, 1.8]}
        angle={0.2}
        penumbra={0.55}
        intensity={hovered ? 4.5 : 2.2}
        color={hovered ? "#fff8e0" : "#ffe8c0"}
        castShadow
        distance={18}
        decay={1.6}
      />
    </group>
  );
};

// Interactive door at the north end of the corridor
const GalleryDoor = ({ onEnter }: { onEnter: () => void }) => {
  const [hovered, setHovered] = useState(false);
  // Must match MuseumRoom's L constant
  const L = 82;
  const DW = 2.6;
  const DH = 3.8;
  const z = -L / 2 + 0.22;

  return (
    <group>
      {/* Dark void behind the opening — suggests another room */}
      <mesh position={[0, DH / 2, -L / 2 - 0.1]}>
        <planeGeometry args={[DW - 0.1, DH - 0.1]} />
        <meshStandardMaterial color="#070604" roughness={1} />
      </mesh>

      {/* Wooden door frame */}
      <mesh position={[0, DH / 2, z - 0.06]} castShadow>
        <boxGeometry args={[DW + 0.46, DH + 0.36, 0.32]} />
        <meshStandardMaterial
          color={hovered ? "#4a3218" : "#342210"}
          roughness={0.78}
          metalness={0.08}
          emissive={hovered ? "#2a1800" : "#0a0500"}
          emissiveIntensity={hovered ? 0.4 : 0.08}
        />
      </mesh>

      {/* Door panel — clickable */}
      <mesh
        position={[0, DH / 2, z + 0.08]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
      >
        <boxGeometry args={[DW - 0.08, DH - 0.1, 0.1]} />
        <meshStandardMaterial
          color={hovered ? "#3d2810" : "#271908"}
          roughness={0.7}
          metalness={0.06}
          emissive={hovered ? "#5a3818" : "#180e00"}
          emissiveIntensity={hovered ? 0.5 : 0.06}
        />
      </mesh>

      {/* Horizontal wood-grain panels */}
      {[0.9, 0, -0.9].map((yOff, i) => (
        <mesh key={i} position={[0, DH / 2 + yOff, z + 0.14]}>
          <boxGeometry args={[DW - 0.5, 0.018, 0.01]} />
          <meshStandardMaterial
            color={hovered ? "#7a4820" : "#1a0e00"}
            emissive={hovered ? "#7a4820" : "#1a0e00"}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Door handle */}
      <mesh position={[DW / 2 - 0.32, DH / 2, z + 0.2]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial
          color={hovered ? "#daa830" : "#a08018"}
          metalness={0.95}
          roughness={0.04}
          emissive={hovered ? "#7a5500" : "#201200"}
          emissiveIntensity={hovered ? 0.7 : 0.1}
        />
      </mesh>

      {/* Warm amber glow bleeding through from the other room */}
      <pointLight
        position={[0, DH * 0.55, z - 1.2]}
        intensity={hovered ? 3.5 : 1.5}
        color="#ffe090"
        distance={9}
        decay={2}
      />

      {/* Plaque above the door */}
      <Html position={[0, DH + 0.72, z + 0.24]} center transform occlude>
        <div
          style={{
            background: "#1a1208",
            border: "1px solid #7a6030",
            borderRadius: "3px",
            padding: "4px 14px",
            color: hovered ? "#e0b840" : "#a07820",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "Georgia, serif",
            whiteSpace: "nowrap",
            transition: "color 0.2s",
            pointerEvents: "none",
            boxShadow: hovered
              ? "0 0 12px rgba(200,150,40,0.4)"
              : "0 0 4px rgba(100,70,10,0.2)",
          }}
        >
          Art Gallery
        </div>
      </Html>
    </group>
  );
};

// Museum corridor room
const MuseumRoom = ({
  onFrameHover,
  onFrameUnhover,
  onFrameClick,
  onDoorClick,
}: {
  onFrameHover: (project: Project) => void;
  onFrameUnhover: () => void;
  onFrameClick: (project: Project) => void;
  onDoorClick: () => void;
}) => {
  const projects = myProjects.slice(0, 8);
  const L = 82;
  const W = 30;
  const H = 12;
  const frameY = 4.8;
  const frameZs: [number, number, number, number] = [-28, -9, 9, 28];

  return (
    <group>
      {/* FLOOR - polished stone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial
          color="#c9bfb0"
          roughness={0.22}
          metalness={0.06}
        />
      </mesh>

      {/* CEILING */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#f0eae2" roughness={1} />
      </mesh>

      {/* NORTH WALL — split around door opening (3.0 wide × 4.1 tall) */}
      {/* Left strip */}
      <mesh position={[-8.25, H / 2, -L / 2]}>
        <planeGeometry args={[13.5, H]} />
        <meshStandardMaterial color="#eae4dc" roughness={1} />
      </mesh>
      {/* Right strip */}
      <mesh position={[8.25, H / 2, -L / 2]}>
        <planeGeometry args={[13.5, H]} />
        <meshStandardMaterial color="#eae4dc" roughness={1} />
      </mesh>
      {/* Top strip (above doorway) */}
      <mesh position={[0, 8.05, -L / 2]}>
        <planeGeometry args={[3.0, 7.9]} />
        <meshStandardMaterial color="#eae4dc" roughness={1} />
      </mesh>

      {/* GALLERY DOOR */}
      <GalleryDoor onEnter={onDoorClick} />

      {/* SOUTH WALL */}
      <mesh position={[0, H / 2, L / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#eae4dc" roughness={1} />
      </mesh>

      {/* WEST WALL */}
      <mesh
        position={[-W / 2, H / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial color="#f2ede5" roughness={1} />
      </mesh>

      {/* EAST WALL */}
      <mesh
        position={[W / 2, H / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial color="#f2ede5" roughness={1} />
      </mesh>

      {/* BASEBOARDS */}
      <mesh position={[-W / 2 + 0.06, 0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[L, 0.44]} />
        <meshStandardMaterial color="#8c7558" />
      </mesh>
      <mesh position={[W / 2 - 0.06, 0.22, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[L, 0.44]} />
        <meshStandardMaterial color="#8c7558" />
      </mesh>

      {/* CEILING TRACK LIGHTS */}
      {frameZs.map((z, i) => (
        <group key={`track-${i}`} position={[0, H - 0.08, z]}>
          {/* Rail */}
          <mesh>
            <boxGeometry args={[W - 3, 0.08, 0.22]} />
            <meshStandardMaterial
              color="#1e1e1e"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Fixtures pointing at both walls */}
          {([-W / 2 + 4, W / 2 - 4] as number[]).map((x, j) => (
            <group key={j} position={[x, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.11, 0.09, 0.26, 8]} />
                <meshStandardMaterial
                  color="#111"
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              <pointLight
                position={[0, -0.22, 0]}
                intensity={1.0}
                color="#fff8e0"
                distance={11}
                decay={2}
              />
            </group>
          ))}
        </group>
      ))}

      {/* AMBIENT + FILL */}
      <ambientLight intensity={0.52} color="#fff8f0" />
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.25}
        color="#ffffff"
      />

      {/* WEST WALL FRAMES */}
      {projects.slice(0, 4).map((p, i) => (
        <ArtworkFrame
          key={`w${i}`}
          position={[-W / 2 + 0.14, frameY, frameZs[i]]}
          rotation={[0, Math.PI / 2, 0]}
          project={p}
          colorIndex={i}
          onHover={onFrameHover}
          onUnhover={onFrameUnhover}
          onClick={onFrameClick}
        />
      ))}

      {/* EAST WALL FRAMES */}
      {projects.slice(4, 8).map((p, i) => (
        <ArtworkFrame
          key={`e${i}`}
          position={[W / 2 - 0.14, frameY, frameZs[i]]}
          rotation={[0, -Math.PI / 2, 0]}
          project={p}
          colorIndex={i + 4}
          onHover={onFrameHover}
          onUnhover={onFrameUnhover}
          onClick={onFrameClick}
        />
      ))}

      {/* WOODEN BENCHES */}
      {([-9, 9] as number[]).map((z, i) => (
        <group key={`bench-${i}`} position={[0, 0, z]}>
          <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 0.14, 0.95]} />
            <meshStandardMaterial
              color="#7a5c32"
              roughness={0.7}
              metalness={0.08}
            />
          </mesh>
          {([-1.8, 1.8] as number[]).map((x, j) => (
            <mesh key={j} position={[x, 0.36, 0]}>
              <boxGeometry args={[0.2, 0.72, 0.75]} />
              <meshStandardMaterial color="#614a27" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Free WASD movement — also slides the OrbitControls target so distance
// constraints never block forward movement.
const WASDControls = ({
  orbitRef,
}: {
  orbitRef: React.RefObject<{ target: Vector3 }>;
}) => {
  const { camera } = useThree();
  const keys = useRef({ w: false, s: false, a: false, d: false });

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = true;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = true;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = true;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.w = false;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.s = false;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.a = false;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.d = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, dt) => {
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const vel = new Vector3();
    if (keys.current.w) vel.add(dir);
    if (keys.current.s) vel.sub(dir);
    if (keys.current.a)
      vel.add(new Vector3().crossVectors(dir, new Vector3(0, 1, 0)));
    if (keys.current.d)
      vel.add(new Vector3().crossVectors(new Vector3(0, 1, 0), dir));

    if (vel.length() > 0) {
      camera.position.addScaledVector(vel.normalize(), 9 * dt);
      camera.position.y = 1.8;
      // Keep OrbitControls target 4 units in front of the camera so
      // minDistance never blocks forward movement.
      if (orbitRef.current) {
        orbitRef.current.target.copy(camera.position).addScaledVector(dir, 4);
        orbitRef.current.target.y = 1.8;
      }
    }
  });

  return null;
};

// Hover preview card (HTML overlay, appears on frame hover)
const PreviewCard = ({ project }: { project: Project | null }) => (
  <AnimatePresence>
    {project && (
      <motion.div
        key={project.title}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.18 }}
        className="fixed right-5 top-1/2 -translate-y-1/2 z-20 w-76 pointer-events-none select-none"
        style={{ width: "300px" }}
      >
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-stone-100">
          {project.picture ? (
            <div className="w-full h-48 overflow-hidden bg-stone-100">
              <img
                src={project.picture}
                alt={project.title}
                className="w-full h-full object-cover"
                style={{ imageRendering: "auto" }}
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-stone-200 to-stone-300" />
          )}

          <div className="p-5">
            {project.type && (
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1.5">
                {project.type}
              </p>
            )}
            <h3 className="text-[15px] font-bold text-stone-900 leading-snug mb-2">
              {project.title.includes("(")
                ? project.title.split("(")[0].trim()
                : project.title}
            </h3>
            <p className="text-stone-500 text-xs leading-relaxed mb-3 line-clamp-2">
              {project.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[11px] rounded-full border border-stone-200"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <p className="text-stone-400 text-[11px] tracking-wide">
              Click frame to view details →
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const CyberpunkScene = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const navigate = useNavigate();

  const handleDoorClick = () => {
    setTransitioning(true);
    setTimeout(() => navigate("/gallery"), 650);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#18140f" }}
    >
      <GalleryNavbar />

      {/* Gallery title */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none px-4">
        <p className="text-stone-500 text-[10px] tracking-[0.4em] uppercase mb-2">
          Jewook Park
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-[2.4rem] font-light tracking-[0.25em] uppercase text-stone-100">
          Project Gallery
        </h1>
        <div className="mt-3 w-20 h-px bg-gradient-to-r from-transparent via-amber-500/80 to-transparent mx-auto" />
        <p className="mt-2.5 text-stone-500 text-xs tracking-widest">
          {myProjects.slice(0, 8).length} works on display
        </p>
      </div>

      {/* Controls hint */}
      {!selectedProject && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-black/40 border border-stone-700/50 rounded-full px-6 py-2 backdrop-blur-sm">
            <p className="text-stone-500 text-[11px] tracking-wider">
              {isMobile
                ? "Drag to look · Pinch to zoom · Tap a frame to explore"
                : "WASD to move · Drag to look · Hover frames to preview · Click to explore"}
            </p>
          </div>
        </div>
      )}

      {/* 3D canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 38], fov: 68, near: 0.1, far: 500 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <MuseumRoom
            onFrameHover={setHoveredProject}
            onFrameUnhover={() => setHoveredProject(null)}
            onFrameClick={setSelectedProject}
            onDoorClick={handleDoorClick}
          />

          {!isMobile && <WASDControls orbitRef={orbitRef} />}

          <OrbitControls
            ref={orbitRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.5}
            maxDistance={55}
            maxPolarAngle={Math.PI / 1.85}
            minPolarAngle={Math.PI / 8}
            target={[0, 1.8, 0]}
            enableDamping
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>

      {/* Hover preview panel */}
      <PreviewCard project={hoveredProject} />

      {/* Full detail modal */}
      <HolographicUI
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Room-transition fade overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ background: "#0c0b0a" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberpunkScene;

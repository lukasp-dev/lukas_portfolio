import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import React, { Suspense, useState, useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { Vector3 } from "three";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import GalleryNavbar from "../components/gallery/GalleryNavbar";

interface Artwork {
  id: number;
  title: string;
  medium: string;
  description: string;
  image: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    title: "Bee Study",
    medium: "Graphite on paper",
    description: "A detailed study of bee anatomy and movement.",
    image: "/assets/drawing/bee.jpg",
  },
  {
    id: 2,
    title: "Black Panther",
    medium: "Graphite on paper",
    description: "A powerful portrait capturing strength and majesty.",
    image: "/assets/drawing/blackpather.jpg",
  },
  {
    id: 3,
    title: "Classic Car",
    medium: "Graphite on paper",
    description: "Vintage automobile study exploring elegant lines.",
    image: "/assets/drawing/car.jpg",
  },
  {
    id: 4,
    title: "Medieval Castle",
    medium: "Graphite on paper",
    description: "Architectural study of a medieval fortress.",
    image: "/assets/drawing/castle.jpg",
  },
  {
    id: 5,
    title: "Curious Cat",
    medium: "Graphite on paper",
    description: "A playful cat portrait capturing feline grace.",
    image: "/assets/drawing/cat.jpg",
  },
  {
    id: 6,
    title: "Majestic Eagle",
    medium: "Graphite on paper",
    description: "Eagle in flight — power and grace in linework.",
    image: "/assets/drawing/eagle.jpg",
  },
  {
    id: 7,
    title: "Einstein",
    medium: "Graphite on paper",
    description: "Tribute to the legendary physicist.",
    image: "/assets/drawing/einstein.jpg",
  },
  {
    id: 8,
    title: "Elephant Study",
    medium: "Graphite on paper",
    description: "A gentle giant — texture and grandeur.",
    image: "/assets/drawing/elephant.jpg",
  },
  {
    id: 9,
    title: "Wild Horse",
    medium: "Graphite on paper",
    description: "Dynamic portrait capturing strength and freedom.",
    image: "/assets/drawing/horse.jpg",
  },
  {
    id: 10,
    title: "LeBron James",
    medium: "Graphite on paper",
    description: "Portrait of the basketball legend.",
    image: "/assets/drawing/lebron.jpg",
  },
  {
    id: 11,
    title: "Lion Portrait",
    medium: "Graphite on paper",
    description: "King of the jungle's fierce beauty.",
    image: "/assets/drawing/lion.jpg",
  },
  {
    id: 12,
    title: "Morgan Freeman",
    medium: "Graphite on paper",
    description: "Capturing the actor's distinctive presence.",
    image: "/assets/drawing/morganfreeman.jpg",
  },
  {
    id: 13,
    title: "Mountain Landscape",
    medium: "Graphite on paper",
    description: "Serene landscape exploring light and atmosphere.",
    image: "/assets/drawing/mountain.jpg",
  },
  {
    id: 14,
    title: "Turtle Study",
    medium: "Graphite on paper",
    description: "Shell geometry and organic pattern in form.",
    image: "/assets/drawing/turtle.jpg",
  },
  {
    id: 15,
    title: "Sprite Character",
    medium: "Graphite on paper",
    description: "Character design — form, silhouette, personality.",
    image: "/assets/drawing/sprite.jpg",
  },
];

// ─── Single textured drawing frame ────────────────────────────────────────────
const DrawingFrame = ({
  position,
  rotation,
  artwork,
  onHover,
  onUnhover,
  onClick,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  artwork: Artwork;
  onHover: (a: Artwork) => void;
  onUnhover: () => void;
  onClick: (a: Artwork) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(artwork.image);
  const FW = 2.7;
  const FH = 3.5;
  const IW = 2.4;
  const IH = 3.1;

  return (
    <group position={position} rotation={rotation}>
      {/* Thin dark metal frame */}
      <mesh castShadow>
        <boxGeometry args={[FW, FH, 0.07]} />
        <meshStandardMaterial
          color={hovered ? "#3a3a3a" : "#111111"}
          metalness={0.88}
          roughness={0.18}
          emissive={hovered ? "#1a1a1a" : "#000000"}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>

      {/* Drawing — actual image texture */}
      <mesh
        position={[0, 0, 0.05]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(artwork);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onUnhover();
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(artwork);
        }}
      >
        <planeGeometry args={[IW, IH]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered ? 0.04 : 0}
        />
      </mesh>

      {/* light is handled externally in world space */}
    </group>
  );
};

// Gray placeholder while texture loads
const FramePlaceholder = ({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <boxGeometry args={[2.7, 3.5, 0.07]} />
      <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0, 0.05]}>
      <planeGeometry args={[2.4, 3.1]} />
      <meshStandardMaterial color="#1e1e1e" roughness={1} />
    </mesh>
  </group>
);

// ─── Art-fair spotlight — positioned in world space, properly aimed at frame ──
const ArtFairLight = ({
  lightPos,
  targetPos,
  side,
}: {
  lightPos: [number, number, number];
  targetPos: [number, number, number];
  side: "west" | "east";
}) => {
  const lightRef = useRef<THREE.SpotLight>(null);
  const { scene } = useThree();

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    light.target.position.set(...targetPos);
    scene.add(light.target);
    return () => { scene.remove(light.target); };
  }, [scene, targetPos[0], targetPos[1], targetPos[2]]);

  const [lx, ly, lz] = lightPos;
  // small arm from ceiling to fixture, angled toward the wall
  const armEndX = side === "west" ? lx + 0.6 : lx - 0.6;

  return (
    <group>
      {/* Ceiling mount */}
      <mesh position={[armEndX, ly + 0.22, lz]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 6]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Light housing — angled cone shape */}
      <mesh position={[lx, ly, lz]}>
        <cylinderGeometry args={[0.06, 0.13, 0.26, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.12} />
      </mesh>

      {/* Warm inner glow on the housing face */}
      <mesh position={[lx, ly - 0.14, lz]}>
        <circleGeometry args={[0.07, 8]} />
        <meshStandardMaterial
          color="#ffe8b0"
          emissive="#ffe8b0"
          emissiveIntensity={2}
        />
      </mesh>

      <spotLight
        ref={lightRef}
        position={lightPos}
        angle={0.2}
        penumbra={0.38}
        intensity={5}
        color="#fff6d6"
        distance={22}
        decay={1.8}
      />
    </group>
  );
};

// ─── Door back to project museum ──────────────────────────────────────────────
const MuseumDoor = ({ onEnter }: { onEnter: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const L = 62;
  const DW = 2.6;
  const DH = 3.8;
  const z = L / 2 - 0.22;

  return (
    <group>
      {/* Opening darkness */}
      <mesh position={[0, DH / 2, L / 2 + 0.1]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[DW - 0.1, DH - 0.1]} />
        <meshStandardMaterial color="#10100e" roughness={1} />
      </mesh>

      {/* Door frame */}
      <mesh position={[0, DH / 2, z + 0.06]} rotation={[0, Math.PI, 0]} castShadow>
        <boxGeometry args={[DW + 0.46, DH + 0.36, 0.32]} />
        <meshStandardMaterial
          color={hovered ? "#3a2810" : "#221608"}
          roughness={0.78}
          metalness={0.08}
          emissive={hovered ? "#1a0e00" : "#050300"}
          emissiveIntensity={hovered ? 0.4 : 0.08}
        />
      </mesh>

      {/* Door panel */}
      <mesh
        position={[0, DH / 2, z - 0.08]}
        rotation={[0, Math.PI, 0]}
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
          color={hovered ? "#3d2810" : "#1c1005"}
          roughness={0.7}
          metalness={0.06}
          emissive={hovered ? "#5a3818" : "#0e0800"}
          emissiveIntensity={hovered ? 0.5 : 0.06}
        />
      </mesh>

      {/* Handle */}
      <mesh position={[-(DW / 2 - 0.32), DH / 2, z - 0.18]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial
          color={hovered ? "#daa830" : "#a08018"}
          metalness={0.95}
          roughness={0.04}
          emissive={hovered ? "#7a5500" : "#201200"}
          emissiveIntensity={hovered ? 0.7 : 0.1}
        />
      </mesh>

      {/* Warm glow from museum side */}
      <pointLight
        position={[0, DH * 0.55, z + 1.5]}
        intensity={hovered ? 3 : 1.2}
        color="#ffe4b0"
        distance={9}
        decay={2}
      />

      {/* Plaque */}
      <Html position={[0, DH + 0.72, z - 0.2]} center transform occlude rotation={[0, Math.PI, 0]}>
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
          }}
        >
          Project Gallery
        </div>
      </Html>
    </group>
  );
};

// ─── Gallery room ──────────────────────────────────────────────────────────────
const ArtRoom = ({
  onHover,
  onUnhover,
  onClick,
  onDoorClick,
}: {
  onHover: (a: Artwork) => void;
  onUnhover: () => void;
  onClick: (a: Artwork) => void;
  onDoorClick: () => void;
}) => {
  const L = 62;
  const W = 22;
  const H = 9;

  // 8 west + 7 east = 15
  const westZ = [-27, -20, -13, -6, 1, 8, 15, 22];
  const eastZ = [-24, -17, -10, -3, 4, 11, 18];
  const frameY = 4.2;

  // South wall split for museum door
  const DW = 2.6;
  const DH = 3.8;

  return (
    <group>
      {/* FLOOR — dark hardwood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#1a1108" roughness={0.55} metalness={0.05} />
      </mesh>

      {/* CEILING */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#0c0b0a" roughness={1} />
      </mesh>

      {/* NORTH WALL */}
      <mesh position={[0, H / 2, -L / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#161412" roughness={1} />
      </mesh>

      {/* SOUTH WALL — split for door */}
      {/* Left */}
      <mesh position={[-(W / 2 - (W - DW - 0.5) / 4), H / 2, L / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[(W - DW - 0.5) / 2, H]} />
        <meshStandardMaterial color="#161412" roughness={1} />
      </mesh>
      {/* Right */}
      <mesh position={[(W / 2 - (W - DW - 0.5) / 4), H / 2, L / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[(W - DW - 0.5) / 2, H]} />
        <meshStandardMaterial color="#161412" roughness={1} />
      </mesh>
      {/* Top */}
      <mesh position={[0, H - (H - DH - 0.15) / 2, L / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[DW + 0.5, H - DH - 0.15]} />
        <meshStandardMaterial color="#161412" roughness={1} />
      </mesh>

      {/* WEST WALL */}
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial color="#181614" roughness={1} />
      </mesh>

      {/* EAST WALL */}
      <mesh position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial color="#181614" roughness={1} />
      </mesh>

      {/* FLOOR TRIM */}
      <mesh position={[-W / 2 + 0.05, 0.18, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[L, 0.36]} />
        <meshStandardMaterial color="#2a1f0e" />
      </mesh>
      <mesh position={[W / 2 - 0.05, 0.18, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[L, 0.36]} />
        <meshStandardMaterial color="#2a1f0e" />
      </mesh>

      {/* AMBIENT — very low so spotlights do the work */}
      <ambientLight intensity={0.12} color="#f0e8d8" />

      {/* WEST WALL DRAWINGS + individual spotlights */}
      {artworks.slice(0, 8).map((art, i) => (
        <React.Fragment key={`w${i}`}>
          <Suspense fallback={<FramePlaceholder position={[-W / 2 + 0.12, frameY, westZ[i]]} rotation={[0, Math.PI / 2, 0]} />}>
            <DrawingFrame
              position={[-W / 2 + 0.12, frameY, westZ[i]]}
              rotation={[0, Math.PI / 2, 0]}
              artwork={art}
              onHover={onHover}
              onUnhover={onUnhover}
              onClick={onClick}
            />
          </Suspense>
          <ArtFairLight
            lightPos={[-W / 2 + 2.6, H - 1.0, westZ[i]]}
            targetPos={[-W / 2 + 0.12, frameY, westZ[i]]}
            side="west"
          />
        </React.Fragment>
      ))}

      {/* EAST WALL DRAWINGS + individual spotlights */}
      {artworks.slice(8, 15).map((art, i) => (
        <React.Fragment key={`e${i}`}>
          <Suspense fallback={<FramePlaceholder position={[W / 2 - 0.12, frameY, eastZ[i]]} rotation={[0, -Math.PI / 2, 0]} />}>
            <DrawingFrame
              position={[W / 2 - 0.12, frameY, eastZ[i]]}
              rotation={[0, -Math.PI / 2, 0]}
              artwork={art}
              onHover={onHover}
              onUnhover={onUnhover}
              onClick={onClick}
            />
          </Suspense>
          <ArtFairLight
            lightPos={[W / 2 - 2.6, H - 1.0, eastZ[i]]}
            targetPos={[W / 2 - 0.12, frameY, eastZ[i]]}
            side="east"
          />
        </React.Fragment>
      ))}

      {/* ATTRIBUTION PLAQUE — south wall, left of the door */}
      <group position={[-5.8, 2.6, L / 2 - 0.12]} rotation={[0, Math.PI, 0]}>
        {/* Dark metal backing */}
        <mesh>
          <boxGeometry args={[3.0, 1.6, 0.04]} />
          <meshStandardMaterial color="#141008" metalness={0.45} roughness={0.55} />
        </mesh>
        {/* Subtle inset border */}
        <mesh position={[0, 0, 0.021]}>
          <boxGeometry args={[2.84, 1.44, 0.01]} />
          <meshStandardMaterial color="#1e1810" metalness={0.3} roughness={0.7} />
        </mesh>
        <Html position={[0, 0, 0.04]} center transform occlude>
          <div style={{ width: "200px", textAlign: "center", pointerEvents: "none", padding: "6px" }}>
            <div style={{ width: "20px", height: "1px", background: "#8a7040", margin: "0 auto 8px" }} />
            <p style={{ color: "#9a8050", fontSize: "7px", letterSpacing: "0.45em", textTransform: "uppercase", fontFamily: "Georgia, serif", marginBottom: "5px" }}>
              All works by
            </p>
            <p style={{ color: "#d4b870", fontSize: "13px", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Georgia, serif", fontWeight: "600", marginBottom: "5px" }}>
              Jewook Park
            </p>
            <p style={{ color: "#6a5830", fontSize: "7px", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "Georgia, serif", marginBottom: "8px" }}>
              Graphite on paper · 2026
            </p>
            <div style={{ width: "20px", height: "1px", background: "#8a7040", margin: "0 auto" }} />
          </div>
        </Html>
        {/* Warm downlight on the plaque */}
        <pointLight position={[0, 1.2, 0.4]} intensity={1.2} color="#ffe8a0" distance={3} decay={2} />
      </group>

      {/* DOOR back to museum */}
      <MuseumDoor onEnter={onDoorClick} />
    </group>
  );
};

// ─── WASD movement ─────────────────────────────────────────────────────────────
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
      vel.add(new Vector3().crossVectors(new Vector3(0, 1, 0), dir));
    if (keys.current.d)
      vel.add(new Vector3().crossVectors(dir, new Vector3(0, 1, 0)));

    if (vel.length() > 0) {
      camera.position.addScaledVector(vel.normalize(), 9 * dt);
      camera.position.y = 1.8;
      if (orbitRef.current) {
        orbitRef.current.target.copy(camera.position).addScaledVector(dir, 4);
        orbitRef.current.target.y = 1.8;
      }
    }
  });

  return null;
};

// ─── Hover preview card ────────────────────────────────────────────────────────
const PreviewCard = ({ artwork }: { artwork: Artwork | null }) => (
  <AnimatePresence>
    {artwork && (
      <motion.div
        key={artwork.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.18 }}
        className="fixed right-5 top-1/2 -translate-y-1/2 z-20 pointer-events-none select-none"
        style={{ width: "260px" }}
      >
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "#1a1814",
            border: "1px solid #2a2520",
            boxShadow: "0 8px 40px rgba(0,0,0,0.8)",
          }}
        >
          <div
            className="w-full overflow-hidden"
            style={{ background: "#111", height: "200px" }}
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1.5"
              style={{ color: "#7a6840" }}
            >
              {artwork.medium}
            </p>
            <h3
              className="text-sm font-medium leading-snug mb-2"
              style={{ color: "#e0d8cc" }}
            >
              {artwork.title}
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "#4a4035" }}
            >
              {artwork.description}
            </p>
            <p
              className="mt-3 text-[10px] tracking-wide"
              style={{ color: "#3a3028" }}
            >
              Click to view →
            </p>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Artwork lightbox modal ────────────────────────────────────────────────────
const ArtworkModal = ({
  artwork,
  onClose,
}: {
  artwork: Artwork | null;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {artwork && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{
          background: "rgba(6,5,4,0.92)",
          backdropFilter: "blur(10px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative flex flex-col sm:flex-row items-center gap-8 max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute -top-8 right-0 text-stone-500 hover:text-stone-200 text-2xl transition-colors leading-none"
          >
            ×
          </button>

          {/* Mounted print */}
          <div
            className="flex-shrink-0 w-full sm:w-auto sm:max-w-xs"
            style={{
              background: "#f4f0e8",
              padding: "10px",
              boxShadow: "0 12px 60px rgba(0,0,0,0.9)",
            }}
          >
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full max-h-[65vh] object-contain block"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-left">
            <p
              className="text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ color: "#7a6840" }}
            >
              {artwork.medium}
            </p>
            <h2
              className="text-2xl sm:text-3xl font-light mb-4"
              style={{ color: "#e8e0d0", letterSpacing: "0.05em" }}
            >
              {artwork.title}
            </h2>
            <div className="w-6 h-px mb-4" style={{ background: "#3a3028" }} />
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#6a5e50" }}
            >
              {artwork.description}
            </p>
            <p
              className="mt-5 text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "#3a3028", fontFamily: "Georgia, serif" }}
            >
              © Jewook Park · 2026
            </p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main component ────────────────────────────────────────────────────────────
const Gallery = () => {
  const [hoveredArt, setHoveredArt] = useState<Artwork | null>(null);
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const orbitRef = useRef<{ target: Vector3 }>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedArt) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedArt(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedArt]);

  const handleDoorClick = () => {
    setTransitioning(true);
    setTimeout(() => navigate("/"), 650);
  };

  return (
    <div
      className="overflow-hidden"
      style={{ position: "fixed", inset: 0, background: "#0c0a08" }}
    >
      <GalleryNavbar />

      {/* Title */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none px-4">
        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-2"
          style={{ color: "#4a4035" }}
        >
          Jewook Park
        </p>
        <h1
          className="text-2xl sm:text-3xl font-light tracking-[0.25em] uppercase"
          style={{ color: "#c8c0b0" }}
        >
          Sketchbook
        </h1>
        <div
          className="mt-3 mx-auto"
          style={{
            width: "28px",
            height: "1px",
            background: "linear-gradient(to right, transparent, #6a5830, transparent)",
          }}
        />
        <p
          className="mt-2.5 text-xs tracking-widest"
          style={{ color: "#3a3028" }}
        >
          {artworks.length} works · graphite on paper
        </p>
      </div>

      {/* Controls hint */}
      {!selectedArt && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div
            className="rounded-full px-6 py-2 backdrop-blur-sm"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(80,70,55,0.4)",
            }}
          >
            <p
              className="text-[11px] tracking-wider"
              style={{ color: "#4a4035" }}
            >
              {isMobile
                ? "Drag to look · Pinch to zoom · Tap frames to view"
                : "WASD to walk · Drag to look · Hover to preview · Click to view"}
            </p>
          </div>
        </div>
      )}

      {/* 3D canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 28], fov: 68, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ArtRoom
            onHover={setHoveredArt}
            onUnhover={() => setHoveredArt(null)}
            onClick={setSelectedArt}
            onDoorClick={handleDoorClick}
          />

          {!isMobile && <WASDControls orbitRef={orbitRef} />}

          <OrbitControls
            ref={orbitRef as React.RefObject<React.ComponentRef<typeof OrbitControls>>}
            enablePan={false}
            enableZoom
            enableRotate
            minDistance={0.5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 1.85}
            minPolarAngle={Math.PI / 8}
            target={[0, 1.8, 0]}
            enableDamping
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>

      {/* Hover preview */}
      <PreviewCard artwork={hoveredArt} />

      {/* Click modal */}
      <ArtworkModal artwork={selectedArt} onClose={() => setSelectedArt(null)} />

      {/* Corner copyright */}
      <div
        className="fixed bottom-5 right-5 z-10 text-right pointer-events-none select-none"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <p style={{ color: "#2e2518", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase" }}>
          © 2026 Jewook Park
        </p>
        <p style={{ color: "#1e180e", fontSize: "8px", letterSpacing: "0.2em", marginTop: "2px" }}>
          All rights reserved
        </p>
      </div>

      {/* Transition fade */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ background: "#18140f" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

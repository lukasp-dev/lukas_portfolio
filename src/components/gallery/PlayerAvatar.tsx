import { useEffect, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { joystick } from "../MobileJoystick";

// Shared first-person / third-person view for every scene:
//  - one persisted view mode (V key or the corner button)
//  - a blocky walking avatar
//  - OrbitWalker: WASD + joystick walking for the OrbitControls-based rooms

export type ViewMode = "first" | "third";

let mode: ViewMode = (() => {
  try {
    return localStorage.getItem("garden-view") === "first" ? "first" : "third";
  } catch {
    return "third";
  }
})();
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export const getViewMode = () => mode;
export const toggleView = () => {
  mode = mode === "first" ? "third" : "first";
  try {
    localStorage.setItem("garden-view", mode);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
};
export const useViewMode = () => useSyncExternalStore(subscribe, getViewMode);

export interface PlayerState {
  pos: THREE.Vector3; // eye position
  charYaw: number;
  moving: boolean;
}
export const createPlayer = (x: number, y: number, z: number): PlayerState => ({
  pos: new THREE.Vector3(x, y, z),
  charYaw: 0,
  moving: false,
});

// ── Corner button ────────────────────────────────────────────────────────────
export const ViewToggleButton = ({ isMobile = false }: { isMobile?: boolean }) => {
  const m = useViewMode();
  return (
    <button
      onClick={toggleView}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(201,162,74,0.45)",
        borderRadius: "8px",
        color: "rgba(255,240,205,0.9)",
        fontSize: "12px",
        fontFamily: "Georgia, serif",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: "pointer",
      }}
    >
      <span>{m === "third" ? "3rd person" : "1st person"}</span>
      {!isMobile && (
        <span
          style={{
            opacity: 0.6,
            fontFamily: "monospace",
            fontSize: "10px",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "3px",
            padding: "0 5px",
          }}
        >
          V
        </span>
      )}
    </button>
  );
};

// ── Avatar ───────────────────────────────────────────────────────────────────
export const PlayerAvatar = ({ player }: { player: PlayerState }) => {
  const root = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const phase = useRef(0);
  const amp = useRef(0);

  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  useFrame((_, dtRaw) => {
    const g = root.current;
    if (!g) return;
    const show = getViewMode() === "third";
    g.visible = show;
    if (!show) return;
    const dt = Math.min(dtRaw, 0.05);
    g.position.set(player.pos.x, 0, player.pos.z);
    g.rotation.y = player.charYaw;
    amp.current += ((player.moving ? 1 : 0) - amp.current) * Math.min(1, dt * 10);
    if (player.moving) phase.current += dt * 9;
    const sw = Math.sin(phase.current) * 0.85 * amp.current;
    if (legL.current) legL.current.rotation.x = sw;
    if (legR.current) legR.current.rotation.x = -sw;
    if (armL.current) armL.current.rotation.x = -sw;
    if (armR.current) armR.current.rotation.x = sw;
    if (body.current)
      body.current.position.y = Math.abs(Math.cos(phase.current)) * 0.045 * amp.current;
  });

  const SKIN = "#e0b48a";
  const HOODIE = "#5d616d";
  const HOODIE_DARK = "#4a4d57";
  const JEANS = "#3d5f94";
  const JEANS_LIGHT = "#5a7db0";
  return (
    <group ref={root}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.5, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.32} depthWrite={false} />
      </mesh>
      <group ref={body}>
        {/* jeans + white sneakers */}
        {([
          [-0.125, legL],
          [0.125, legR],
        ] as [number, React.RefObject<THREE.Group>][]).map(([x, ref], i) => (
          <group key={i} ref={ref} position={[x, 0.75, 0]}>
            <mesh position={[0, -0.34, 0]}>
              <boxGeometry args={[0.25, 0.68, 0.25]} />
              <meshStandardMaterial color={JEANS} roughness={0.95} />
            </mesh>
            {/* lighter worn thigh + seam + turned-up cuff */}
            <mesh position={[0, -0.18, 0.126]}>
              <boxGeometry args={[0.17, 0.3, 0.01]} />
              <meshStandardMaterial color={JEANS_LIGHT} roughness={0.95} />
            </mesh>
            <mesh position={[x > 0 ? 0.126 : -0.126, -0.34, 0]}>
              <boxGeometry args={[0.01, 0.68, 0.02]} />
              <meshStandardMaterial color="#c8a15a" roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.64, 0]}>
              <boxGeometry args={[0.27, 0.07, 0.27]} />
              <meshStandardMaterial color="#4b6ea3" roughness={0.95} />
            </mesh>
            <mesh position={[0, -0.7, 0.02]}>
              <boxGeometry args={[0.27, 0.09, 0.32]} />
              <meshStandardMaterial color="#ececec" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.745, 0.02]}>
              <boxGeometry args={[0.28, 0.03, 0.33]} />
              <meshStandardMaterial color="#b9b9b9" roughness={0.9} />
            </mesh>
          </group>
        ))}
        {/* jeans waistband */}
        <mesh position={[0, 0.78, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.25]} />
          <meshStandardMaterial color={JEANS} roughness={0.95} />
        </mesh>
        {/* hoodie body, ribbed hem, kangaroo pocket, drawstrings */}
        <mesh position={[0, 1.13, 0]}>
          <boxGeometry args={[0.52, 0.7, 0.27]} />
          <meshStandardMaterial color={HOODIE} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.84, 0]}>
          <boxGeometry args={[0.54, 0.08, 0.29]} />
          <meshStandardMaterial color={HOODIE_DARK} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.98, 0.138]}>
          <boxGeometry args={[0.34, 0.2, 0.015]} />
          <meshStandardMaterial color={HOODIE_DARK} roughness={0.95} />
        </mesh>
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 1.32, 0.14]}>
            <boxGeometry args={[0.025, 0.2, 0.012]} />
            <meshStandardMaterial color="#efece4" roughness={0.9} />
          </mesh>
        ))}
        {/* hood resting behind the neck */}
        <mesh position={[0, 1.56, -0.12]}>
          <boxGeometry args={[0.46, 0.2, 0.24]} />
          <meshStandardMaterial color={HOODIE} roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.52, -0.22]}>
          <boxGeometry args={[0.4, 0.3, 0.1]} />
          <meshStandardMaterial color={HOODIE_DARK} roughness={0.95} />
        </mesh>
        {/* sleeves with cuffs, bare hands */}
        {([
          [-0.385, armL],
          [0.385, armR],
        ] as [number, React.RefObject<THREE.Group>][]).map(([x, ref], i) => (
          <group key={i} ref={ref} position={[x, 1.46, 0]}>
            <mesh position={[0, -0.27, 0]}>
              <boxGeometry args={[0.26, 0.56, 0.26]} />
              <meshStandardMaterial color={HOODIE} roughness={0.95} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <boxGeometry args={[0.27, 0.07, 0.27]} />
              <meshStandardMaterial color={HOODIE_DARK} roughness={0.95} />
            </mesh>
            <mesh position={[0, -0.68, 0]}>
              <boxGeometry args={[0.23, 0.18, 0.23]} />
              <meshStandardMaterial color={SKIN} roughness={0.85} />
            </mesh>
          </group>
        ))}
        {/* head */}
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={SKIN} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.99, -0.01]}>
          <boxGeometry args={[0.53, 0.16, 0.53]} />
          <meshStandardMaterial color="#2a1c12" roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.8, -0.22]}>
          <boxGeometry args={[0.53, 0.4, 0.12]} />
          <meshStandardMaterial color="#2a1c12" roughness={0.95} />
        </mesh>
        {[-0.12, 0.12].map((x) => (
          <group key={x} position={[x, 1.78, 0.255]}>
            <mesh>
              <boxGeometry args={[0.11, 0.07, 0.01]} />
              <meshStandardMaterial color="#f2efe8" roughness={0.9} />
            </mesh>
            <mesh position={[x > 0 ? -0.02 : 0.02, 0, 0.008]}>
              <boxGeometry args={[0.05, 0.065, 0.01]} />
              <meshStandardMaterial color="#1c1c24" roughness={0.9} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.65, 0.255]}>
          <boxGeometry args={[0.14, 0.03, 0.01]} />
          <meshStandardMaterial color="#8a5a45" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// ── Walker for OrbitControls-based rooms ─────────────────────────────────────
export interface Bounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const OrbitWalker = ({
  orbitRef,
  player,
  speed = 9,
  bounds,
  eyeY = 1.8,
}: {
  orbitRef: React.RefObject<{ target: THREE.Vector3 } | null>;
  player: PlayerState;
  speed?: number;
  bounds?: Bounds;
  eyeY?: number;
}) => {
  const { camera } = useThree();
  const keys = useRef({ w: false, s: false, a: false, d: false });
  const prevMode = useRef<ViewMode>("first");
  const saved = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const set = (code: string, v: boolean) => {
      if (code === "KeyW" || code === "ArrowUp") keys.current.w = v;
      if (code === "KeyS" || code === "ArrowDown") keys.current.s = v;
      if (code === "KeyA" || code === "ArrowLeft") keys.current.a = v;
      if (code === "KeyD" || code === "ArrowRight") keys.current.d = v;
    };
    const dn = (e: KeyboardEvent) => {
      if (e.code === "KeyV" && !e.repeat) toggleView();
      set(e.code, true);
    };
    const up = (e: KeyboardEvent) => set(e.code, false);
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // start the player where the camera starts
  useEffect(() => {
    player.pos.set(camera.position.x, eyeY, camera.position.z);
    player.moving = false;
    const d = new THREE.Vector3();
    camera.getWorldDirection(d);
    player.charYaw = Math.atan2(d.x, d.z);
  }, [camera, player, eyeY]);

  // undo last frame's render-only camera clamp before OrbitControls updates
  useFrame(() => {
    if (saved.current) camera.position.copy(saved.current);
  }, -2);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const ctrl = orbitRef.current;
    const m = getViewMode();

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    // switch views
    if (ctrl && prevMode.current !== m) {
      prevMode.current = m;
      saved.current = null;
      if (m === "third") {
        player.pos.set(camera.position.x, eyeY, camera.position.z);
        player.charYaw = Math.atan2(dir.x, dir.z);
        const e = 0.3;
        const D = 5.2;
        ctrl.target.set(player.pos.x, 1.5, player.pos.z);
        camera.position.set(
          player.pos.x - dir.x * D * Math.cos(e),
          1.5 + D * Math.sin(e),
          player.pos.z - dir.z * D * Math.cos(e)
        );
      } else {
        camera.position.set(player.pos.x, eyeY, player.pos.z);
        ctrl.target.set(player.pos.x + dir.x * 4, eyeY, player.pos.z + dir.z * 4);
      }
      camera.lookAt(ctrl.target);
    }

    // input
    const vel = new THREE.Vector3();
    if (keys.current.w || joystick.dy < -0.2) vel.add(dir);
    if (keys.current.s || joystick.dy > 0.2) vel.sub(dir);
    if (keys.current.a || joystick.dx < -0.2)
      vel.add(new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir));
    if (keys.current.d || joystick.dx > 0.2)
      vel.add(new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)));
    const moving = vel.length() > 0;
    player.moving = moving;

    if (moving) {
      vel.normalize();
      const dx = vel.x * speed * dt;
      const dz = vel.z * speed * dt;
      const target = Math.atan2(vel.x, vel.z);
      let diff = target - player.charYaw;
      diff = ((((diff + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
      player.charYaw += diff * Math.min(1, dt * 12);

      if (m === "first") {
        camera.position.x += dx;
        camera.position.z += dz;
        if (bounds) {
          camera.position.x = clamp(camera.position.x, bounds.minX, bounds.maxX);
          camera.position.z = clamp(camera.position.z, bounds.minZ, bounds.maxZ);
        }
        camera.position.y = eyeY;
        if (ctrl) {
          ctrl.target.copy(camera.position).addScaledVector(dir, 4);
          ctrl.target.y = eyeY;
        }
      } else {
        const ox = player.pos.x;
        const oz = player.pos.z;
        player.pos.x += dx;
        player.pos.z += dz;
        if (bounds) {
          player.pos.x = clamp(player.pos.x, bounds.minX, bounds.maxX);
          player.pos.z = clamp(player.pos.z, bounds.minZ, bounds.maxZ);
        }
        camera.position.x += player.pos.x - ox;
        camera.position.z += player.pos.z - oz;
      }
    }

    if (m === "first") {
      player.pos.set(camera.position.x, eyeY, camera.position.z);
      saved.current = null;
    } else if (ctrl) {
      player.pos.y = eyeY;
      ctrl.target.set(player.pos.x, 1.5, player.pos.z);
      // keep the render camera inside the room without disturbing OrbitControls
      saved.current = (saved.current ?? new THREE.Vector3()).copy(camera.position);
      if (bounds) {
        camera.position.x = clamp(camera.position.x, bounds.minX - 0.1, bounds.maxX + 0.1);
        camera.position.z = clamp(camera.position.z, bounds.minZ - 0.1, bounds.maxZ + 0.1);
      }
      camera.position.y = Math.max(0.5, camera.position.y);
      camera.lookAt(ctrl.target);
    }
  });

  return null;
};

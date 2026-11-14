import { useMemo } from "react";
import * as THREE from "three";
import { basaltMat, bronzeMat, makeStone, stoneMat } from "./StoneMaterials";

// Matte stylised statuary: Olympian gods on plinths, winged Nike, Gorgoneion,
// dolphins and a Greek-key (meander) frieze texture. Everything is primitives
// so it stays light, and every material is matte.

export const STONE = "#d8cfba";
export const BASALT = "#2a2622";
export const GOLD = "#b8964a";

const stone = (_r = 0.95) => <primitive object={stoneMat} attach="material" />;
const basalt = () => <primitive object={basaltMat} attach="material" />;
const gold = () => <primitive object={bronzeMat} attach="material" />;

export type GodKind =
  | "zeus"
  | "poseidon"
  | "athena"
  | "apollo"
  | "hermes"
  | "artemis"
  | "hera"
  | "ares"
  | "nike";

// ── Greek key / meander texture ──────────────────────────────────────────────
export const makeMeander = () => {
  const cell = 64;
  const cells = 8;
  const c = document.createElement("canvas");
  c.width = cell * cells;
  c.height = cell;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#cfc6b2";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "#7d7563";
  ctx.lineWidth = 5;
  ctx.lineCap = "square";
  for (let i = 0; i < cells; i++) {
    const x = i * cell;
    ctx.beginPath();
    ctx.moveTo(x + 4, 60);
    ctx.lineTo(x + 4, 4);
    ctx.lineTo(x + 60, 4);
    ctx.lineTo(x + 60, 44);
    ctx.lineTo(x + 24, 44);
    ctx.lineTo(x + 24, 24);
    ctx.lineTo(x + 42, 24);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
};

export const MeanderBand = ({
  width,
  height,
  texture,
  position,
  rotation = [0, 0, 0],
}: {
  width: number;
  height: number;
  texture: THREE.Texture | null;
  position: [number, number, number];
  rotation?: [number, number, number];
}) => {
  const tex = useMemo(() => {
    if (!texture) return null;
    const t = texture.clone();
    t.repeat.set(width / (height * 8), 1);
    t.needsUpdate = true;
    return t;
  }, [texture, width, height]);
  const mat = useMemo(
    () => makeStone({ color: "#ffffff", map: tex, bump: 14 }),
    [tex]
  );
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
};

// ── Gorgoneion (Medusa) ──────────────────────────────────────────────────────
export const Gorgoneion = ({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) => (
  <group position={position} scale={scale}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.55, 0.55, 0.14, 32]} />
      {gold()}
    </mesh>
    {/* face relief */}
    <mesh position={[0, 0, 0.1]}>
      <sphereGeometry args={[0.38, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      {stone()}
    </mesh>
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.2, 0]} />
    </group>
    {[-0.14, 0.14].map((x) => (
      <mesh key={x} position={[x, 0.08, 0.4]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        {basalt()}
      </mesh>
    ))}
    <mesh position={[0, -0.14, 0.42]}>
      <boxGeometry args={[0.2, 0.05, 0.05]} />
      {basalt()}
    </mesh>
    {/* snakes */}
    {Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      return (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0.06]}
          rotation={[0, 0, a - Math.PI / 2]}
        >
          <coneGeometry args={[0.07, 0.34, 6]} />
          {gold()}
        </mesh>
      );
    })}
  </group>
);

// ── Dolphin ──────────────────────────────────────────────────────────────────
export const Dolphin = ({
  position,
  rotationY = 0,
  scale = 1,
}: {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}) => (
  <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
    <mesh rotation={[0, 0, 0]}>
      <torusGeometry args={[0.5, 0.13, 10, 24, Math.PI * 0.95]} />
      {gold()}
    </mesh>
    <mesh position={[-0.5, 0.0, 0]}>
      <sphereGeometry args={[0.15, 12, 12]} />
      {gold()}
    </mesh>
    <mesh position={[-0.72, 0.02, 0]} rotation={[0, 0, Math.PI / 2 + 0.2]}>
      <coneGeometry args={[0.07, 0.3, 8]} />
      {gold()}
    </mesh>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[0.5, 0.0, s * 0.13]} rotation={[0.4 * s, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.3, 0.22]} />
        {gold()}
      </mesh>
    ))}
    <mesh position={[0.1, 0.5, 0]} rotation={[0, 0, -0.3]}>
      <coneGeometry args={[0.07, 0.22, 4]} />
      {gold()}
    </mesh>
  </group>
);

// ── Statues ──────────────────────────────────────────────────────────────────
const Arm = ({
  side,
  theta = 0,
  psi = 0,
  phi = 0,
}: {
  side: 1 | -1;
  theta?: number;
  psi?: number;
  phi?: number;
}) => (
  <group position={[side * 0.34, 1.82, 0]} rotation={[theta, 0, psi]}>
    <mesh position={[0, -0.25, 0]}>
      <cylinderGeometry args={[0.075, 0.065, 0.5, 10]} />
      {stone()}
    </mesh>
    <group position={[0, -0.5, 0]} rotation={[phi, 0, 0]}>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.062, 0.05, 0.45, 10]} />
        {stone()}
      </mesh>
      <mesh position={[0, -0.47, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        {stone()}
      </mesh>
    </group>
  </group>
);

const Staff = ({
  position,
  height = 3,
  tip,
}: {
  position: [number, number, number];
  height?: number;
  tip: "trident" | "spear" | "caduceus" | "scepter";
}) => (
  <group position={position}>
    <mesh position={[0, height / 2 - 0.9, 0]}>
      <cylinderGeometry args={[0.03, 0.035, height, 8]} />
      {gold()}
    </mesh>
    <group position={[0, height - 0.9, 0]}>
      {tip === "trident" && (
        <>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.46, 0.05, 0.05]} />
            {gold()}
          </mesh>
          {[-0.21, 0, 0.21].map((x) => (
            <mesh key={x} position={[x, 0.26, 0]}>
              <coneGeometry args={[0.04, 0.42, 6]} />
              {gold()}
            </mesh>
          ))}
        </>
      )}
      {tip === "spear" && (
        <mesh position={[0, 0.25, 0]}>
          <coneGeometry args={[0.07, 0.5, 6]} />
          {gold()}
        </mesh>
      )}
      {tip === "scepter" && (
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          {gold()}
        </mesh>
      )}
      {tip === "caduceus" && (
        <>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            {gold()}
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.13, 0.04, 0]} rotation={[0, 0, s * -0.4]}>
              <boxGeometry args={[0.2, 0.05, 0.02]} />
              {gold()}
            </mesh>
          ))}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, -0.25 - i * 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.06, 0.016, 6, 14]} />
              {gold()}
            </mesh>
          ))}
        </>
      )}
    </group>
  </group>
);

export const Statue = ({
  kind,
  position,
  rotationY = 0,
  scale = 1,
}: {
  kind: GodKind;
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}) => {
  const robe = useMemo(() => {
    const pts = [
      [0.46, 0],
      [0.44, 0.1],
      [0.36, 0.5],
      [0.27, 0.95],
      [0.25, 1.15],
      [0.3, 1.5],
      [0.33, 1.78],
      [0.2, 1.9],
      [0.09, 1.94],
      [0.001, 1.94],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 28);
  }, []);

  const bolt = useMemo(
    () => [
      { p: [0, 0.2, 0] as [number, number, number], r: 0.5, s: [0.06, 0.34, 0.06] as [number, number, number] },
      { p: [0.08, 0.02, 0] as [number, number, number], r: -0.6, s: [0.06, 0.3, 0.06] as [number, number, number] },
      { p: [-0.02, -0.18, 0] as [number, number, number], r: 0.5, s: [0.06, 0.3, 0.06] as [number, number, number] },
    ],
    []
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* plinth with a meander cornice */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[1.45, 0.28, 1.45]} />
        {stone()}
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[1.12, 1.0, 1.12]} />
        {stone()}
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[1.16, 0.18, 1.16]} />
        {basalt()}
      </mesh>
      <mesh position={[0, 1.38, 0]}>
        <boxGeometry args={[1.38, 0.2, 1.38]} />
        {stone()}
      </mesh>
      <mesh position={[0, 1.49, 0]}>
        <boxGeometry args={[1.42, 0.04, 1.42]} />
        {gold()}
      </mesh>

      <group position={[0, 1.5, 0]} rotation={[0, 0, 0.03]}>
        {/* draped body */}
        <mesh geometry={robe}>{stone()}</mesh>
        {/* drapery folds */}
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const r = 0.39 - (i % 3) * 0.015;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * r, 0.55, Math.sin(a) * r]}
              rotation={[0, Math.PI / 2 - a, 0.03 * Math.sin(i * 2.1)]}
            >
              <boxGeometry args={[0.035, 0.85 - (i % 4) * 0.08, 0.06]} />
              {stone()}
            </mesh>
          );
        })}
        {/* upper drapery over the chest */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.12, 1.55, 0.27]} rotation={[0.1, 0, s * -0.5]}>
            <boxGeometry args={[0.05, 0.5, 0.06]} />
            {stone()}
          </mesh>
        ))}
        {/* sash */}
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0.5]}>
          <torusGeometry args={[0.27, 0.025, 6, 20]} />
          {gold()}
        </mesh>
        {/* head */}
        <mesh position={[0, 2.1, 0]} scale={[0.95, 1.12, 1]}>
          <sphereGeometry args={[0.17, 16, 14]} />
          {stone()}
        </mesh>
        {/* nose and brow */}
        <mesh position={[0, 2.09, 0.165]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.035, 0.1, 0.045]} />
          {stone()}
        </mesh>
        <mesh position={[0, 2.15, 0.15]}>
          <boxGeometry args={[0.22, 0.025, 0.04]} />
          {stone()}
        </mesh>
        {/* curled hair */}
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.17, 2.14 + (i % 2) * 0.03, Math.sin(a) * 0.17 - 0.02]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              {stone()}
            </mesh>
          );
        })}
        <mesh position={[0, 2.16, -0.03]} scale={[1, 0.8, 1]}>
          <sphereGeometry args={[0.185, 14, 12, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          {stone()}
        </mesh>

        {kind === "zeus" && (
          <>
            <mesh position={[0, 1.95, 0.1]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.13, 0.28, 8]} />
              {stone()}
            </mesh>
            <Arm side={1} psi={2.6} />
            <Arm side={-1} theta={0.25} phi={0.5} />
            <group position={[0.83, 2.63, 0]}>
              {bolt.map((b, i) => (
                <mesh key={i} position={b.p} rotation={[0, 0, b.r]} scale={b.s}>
                  <boxGeometry args={[1, 1, 1]} />
                  {gold()}
                </mesh>
              ))}
            </group>
          </>
        )}

        {kind === "poseidon" && (
          <>
            <mesh position={[0, 1.95, 0.1]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.13, 0.3, 8]} />
              {stone()}
            </mesh>
            <Arm side={1} theta={-0.5} phi={-0.5} />
            <Arm side={-1} theta={0.1} />
            <Staff position={[0.45, 1.0, 0.66]} height={3.6} tip="trident" />
          </>
        )}

        {kind === "athena" && (
          <>
            {/* helmet with crest */}
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.2, 14, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              {gold()}
            </mesh>
            <mesh position={[0, 2.38, -0.02]} scale={[0.4, 1, 1.5]}>
              <boxGeometry args={[0.1, 0.16, 0.34]} />
              {gold()}
            </mesh>
            <Arm side={1} theta={-0.35} phi={-0.4} />
            <Arm side={-1} theta={-0.3} phi={-0.9} />
            <Staff position={[0.42, 1.0, 0.45]} height={3.7} tip="spear" />
            {/* shield with gorgoneion boss */}
            <group position={[-0.58, 1.18, 0.38]} rotation={[0, 0.5, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.46, 0.46, 0.07, 28]} />
                {gold()}
              </mesh>
              <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.36, 0.025, 6, 28]} />
                {basalt()}
              </mesh>
              <mesh position={[0, 0, 0.07]}>
                <sphereGeometry args={[0.12, 10, 8]} />
                {stone()}
              </mesh>
            </group>
          </>
        )}

        {kind === "apollo" && (
          <>
            {/* laurel wreath */}
            <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.18, 0.025, 6, 20]} />
              {gold()}
            </mesh>
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(a) * 0.18, 2.2, Math.sin(a) * 0.18]}
                  rotation={[0, -a, Math.PI / 2]}
                  scale={[1, 1, 0.5]}
                >
                  <coneGeometry args={[0.035, 0.12, 5]} />
                  {gold()}
                </mesh>
              );
            })}
            <Arm side={1} theta={-0.7} phi={-1.0} />
            <Arm side={-1} theta={0.2} />
            {/* lyre */}
            <group position={[0.5, 1.4, 0.5]}>
              <mesh rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.2, 0.03, 8, 20, Math.PI]} />
                {gold()}
              </mesh>
              {[-0.2, 0.2].map((x) => (
                <mesh key={x} position={[x, 0.2, 0]}>
                  <cylinderGeometry args={[0.022, 0.022, 0.4, 6]} />
                  {gold()}
                </mesh>
              ))}
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.44, 0.04, 0.04]} />
                {gold()}
              </mesh>
            </group>
          </>
        )}

        {kind === "hermes" && (
          <>
            {/* winged petasos */}
            <mesh position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.26, 0.26, 0.03, 20]} />
              {gold()}
            </mesh>
            <mesh position={[0, 2.26, 0]}>
              <sphereGeometry args={[0.15, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              {gold()}
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.26, 2.26, 0]} rotation={[0, 0, s * -0.5]}>
                <boxGeometry args={[0.18, 0.04, 0.12]} />
                {gold()}
              </mesh>
            ))}
            <Arm side={1} theta={-0.4} phi={-0.5} />
            <Arm side={-1} theta={0.15} />
            <Staff position={[0.45, 1.0, 0.45]} height={3.2} tip="caduceus" />
          </>
        )}

        {kind === "artemis" && (
          <>
            {/* crescent diadem */}
            <mesh position={[0, 2.3, 0.05]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.09, 0.025, 6, 16, Math.PI * 1.4]} />
              {gold()}
            </mesh>
            <Arm side={1} theta={-0.5} phi={-0.6} />
            <Arm side={-1} psi={-0.3} />
            {/* bow */}
            <group position={[0.46, 1.3, 0.6]} rotation={[0, 0, 0.1]}>
              <mesh>
                <torusGeometry args={[0.7, 0.03, 8, 28, Math.PI * 0.8]} />
                {gold()}
              </mesh>
            </group>
          </>
        )}

        {kind === "hera" && (
          <>
            {/* diadem crown */}
            <mesh position={[0, 2.25, 0]}>
              <cylinderGeometry args={[0.15, 0.17, 0.12, 14]} />
              {gold()}
            </mesh>
            {[-0.1, 0, 0.1].map((x) => (
              <mesh key={x} position={[x, 2.36, 0]}>
                <coneGeometry args={[0.03, 0.1, 5]} />
                {gold()}
              </mesh>
            ))}
            <Arm side={1} theta={-0.45} phi={-0.5} />
            <Arm side={-1} theta={0.2} phi={0.3} />
            <Staff position={[0.45, 1.0, 0.5]} height={3.3} tip="scepter" />
          </>
        )}

        {kind === "ares" && (
          <>
            {/* crested helmet */}
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.2, 14, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              {gold()}
            </mesh>
            <mesh position={[0, 2.4, -0.02]} scale={[0.35, 1, 1.7]}>
              <boxGeometry args={[0.1, 0.2, 0.34]} />
              {gold()}
            </mesh>
            <Arm side={1} theta={-0.35} phi={-0.4} />
            <Arm side={-1} theta={-0.3} phi={-0.9} />
            <Staff position={[0.42, 1.0, 0.45]} height={3.6} tip="spear" />
            <group position={[-0.56, 1.18, 0.38]} rotation={[0, 0.5, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.44, 0.44, 0.07, 28]} />
                {gold()}
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <sphereGeometry args={[0.1, 10, 8]} />
                {basalt()}
              </mesh>
            </group>
          </>
        )}

        {kind === "nike" && (
          <>
            <Arm side={1} psi={2.5} />
            <Arm side={-1} theta={0.2} />
            {/* wreath held aloft */}
            <mesh position={[0.78, 2.55, 0]}>
              <torusGeometry args={[0.18, 0.03, 6, 20]} />
              {gold()}
            </mesh>
            {/* spread wings */}
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.2, 1.75, -0.2]} rotation={[0, s * 0.5, s * -0.35]}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <mesh
                    key={i}
                    position={[s * (0.24 + i * 0.14), 0.3 - i * 0.12, -0.02 * i]}
                    rotation={[0, 0, s * -0.25 * i]}
                    scale={[1, 1, 0.12]}
                  >
                    <boxGeometry args={[0.2, 1.0 - i * 0.12, 0.2]} />
                    {stone()}
                  </mesh>
                ))}
              </group>
            ))}
          </>
        )}
      </group>
    </group>
  );
};


// ── Quadriga: gold chariot drawn by four rearing horses (faces +z) ───────────
const Horse = ({ x, rear }: { x: number; rear: number }) => (
  <group position={[x, 0, 0]} rotation={[-rear * 0.18, 0, 0]}>
    {/* barrel */}
    <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <capsuleGeometry args={[0.3, 0.8, 8, 14]} />
      {gold()}
    </mesh>
    {/* neck */}
    <mesh position={[0, 1.4, 0.62]} rotation={[0.6, 0, 0]}>
      <cylinderGeometry args={[0.15, 0.24, 0.8, 10]} />
      {gold()}
    </mesh>
    {/* head */}
    <mesh position={[0, 1.78, 0.98]} rotation={[0.9, 0, 0]}>
      <boxGeometry args={[0.2, 0.52, 0.22]} />
      {gold()}
    </mesh>
    {[-0.07, 0.07].map((ex) => (
      <mesh key={ex} position={[ex, 2.02, 0.84]}>
        <coneGeometry args={[0.04, 0.12, 6]} />
        {gold()}
      </mesh>
    ))}
    {/* mane */}
    {Array.from({ length: 6 }, (_, i) => (
      <mesh key={i} position={[0, 1.62 - i * 0.1, 0.46 + (5 - i) * 0.07]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[0.05, 0.14, 0.12]} />
        {gold()}
      </mesh>
    ))}
    {/* raised forelegs, planted hind legs */}
    {[-0.14, 0.14].map((lx) => (
      <group key={lx} position={[lx, 0.9, 0.4]} rotation={[-0.9, 0, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.055, 0.04, 0.5, 8]} />
          {gold()}
        </mesh>
        <group position={[0, -0.5, 0]} rotation={[1.2, 0, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.04, 0.03, 0.4, 8]} />
            {gold()}
          </mesh>
        </group>
      </group>
    ))}
    {[-0.14, 0.14].map((lx) => (
      <mesh key={lx} position={[lx, 0.42, -0.4]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.04, 0.9, 8]} />
        {gold()}
      </mesh>
    ))}
    {/* tail */}
    <mesh position={[0, 0.95, -0.72]} rotation={[-0.6, 0, 0]}>
      <coneGeometry args={[0.09, 0.6, 8]} />
      {gold()}
    </mesh>
  </group>
);

export const Quadriga = ({
  position,
  rotationY = 0,
  scale = 1,
}: {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}) => (
  <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
    {/* horses abreast */}
    {[-1.05, -0.35, 0.35, 1.05].map((x, i) => (
      <Horse key={x} x={x} rear={i % 2 === 0 ? 1 : 0.6} />
    ))}
    {/* yoke pole */}
    <mesh position={[0, 0.95, -0.6]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
      {gold()}
    </mesh>
    {/* chariot */}
    <group position={[0, 0, -1.9]}>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.5, 0.12, 1.4]} />
        {gold()}
      </mesh>
      <mesh position={[0, 1.2, -0.62]}>
        <boxGeometry args={[1.5, 0.7, 0.12]} />
        {gold()}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.72, 1.2, 0]}>
          <boxGeometry args={[0.12, 0.6, 1.3]} />
          {gold()}
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.9, 0.62, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <torusGeometry args={[0.55, 0.07, 10, 28]} />
            {gold()}
          </mesh>
          {Array.from({ length: 8 }, (_, k) => (
            <mesh key={k} rotation={[0, 0, (k / 8) * Math.PI]}>
              <boxGeometry args={[1.05, 0.05, 0.05]} />
              {gold()}
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.14, 12]} />
            {gold()}
          </mesh>
        </group>
      ))}
      {/* standing figure of Peace with a branch */}
      <mesh position={[0, 1.75, 0.05]}>
        <cylinderGeometry args={[0.18, 0.28, 1.0, 12]} />
        {gold()}
      </mesh>
      <mesh position={[0, 2.38, 0.05]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        {gold()}
      </mesh>
      <mesh position={[0.34, 2.45, 0.05]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
        {gold()}
      </mesh>
    </group>
  </group>
);

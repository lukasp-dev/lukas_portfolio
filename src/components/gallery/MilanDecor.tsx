import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Classic neoclassical arcade for the project museum: checkerboard marble floor
// with inlaid medallions, fluted columns with acanthus capitals, pilasters,
// dentil cornice, glass-and-iron barrel vault, sconces, urns and chandeliers.
// Heavy repeated detail is instanced to keep the draw-call count low.

const MARBLE_LIGHT = "#efe7d6";
const MARBLE_WARM = "#e2d6bd";
const MARBLE_GROOVE = "#b6aa90";
const GOLD = "#b8923a";
const BRONZE = "#3b2a15";

type Vec3 = [number, number, number];
export interface Item {
  p: Vec3;
  r?: Vec3; // Euler in YXZ order
  s?: Vec3;
}

export const Instances = ({
  items,
  children,
}: {
  items: Item[];
  children: React.ReactNode;
}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const d = new THREE.Object3D();
    d.rotation.order = "YXZ";
    items.forEach((it, i) => {
      d.position.set(...it.p);
      d.rotation.set(...(it.r ?? [0, 0, 0]));
      d.scale.set(...(it.s ?? [1, 1, 1]));
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);
  return (
    <instancedMesh
      key={items.length}
      ref={ref}
      args={[undefined as never, undefined as never, items.length]}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  );
};

const goldMat = (rough = 0.35) => (
  <meshStandardMaterial color={GOLD} metalness={0.75} roughness={rough} />
);

// ── Floor texture: marble checker with veining and gold grout ────────────────
const makeFloorTexture = () => {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const half = size / 2;

  const tiles: [number, number, string, string][] = [
    [0, 0, "#f0e8d6", "#e3d9c2"],
    [half, 0, "#2c2b29", "#1f1e1c"],
    [0, half, "#2c2b29", "#1f1e1c"],
    [half, half, "#f0e8d6", "#e3d9c2"],
  ];
  tiles.forEach(([x, y, c1, c2]) => {
    const g = ctx.createLinearGradient(x, y, x + half, y + half);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fillRect(x, y, half, half);
  });

  // mottled grain
  for (let i = 0; i < 2500; i++) {
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(255,255,255,0.025)" : "rgba(80,70,55,0.03)";
    const w = 2 + Math.random() * 14;
    ctx.fillRect(Math.random() * size, Math.random() * size, w, w * 0.6);
  }

  // veining
  for (let i = 0; i < 90; i++) {
    const onLight = Math.random() > 0.45;
    ctx.strokeStyle = onLight
      ? "rgba(120,105,85,0.16)"
      : "rgba(255,255,255,0.13)";
    ctx.lineWidth = 0.6 + Math.random() * 1.2;
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + Math.random() * 200 - 100,
      y + Math.random() * 200 - 100,
      x + Math.random() * 200 - 100,
      y + Math.random() * 200 - 100,
      x + Math.random() * 260 - 130,
      y + Math.random() * 260 - 130
    );
    ctx.stroke();
  }

  // inner inlay diamond in each tile + gold grout
  tiles.forEach(([x, y, c1]) => {
    const dark = c1 === "#2c2b29";
    ctx.strokeStyle = dark ? "rgba(184,146,58,0.5)" : "rgba(140,110,50,0.35)";
    ctx.lineWidth = 2;
    const cx = x + half / 2;
    const cy = y + half / 2;
    const r = half * 0.3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
    ctx.stroke();
  });
  ctx.strokeStyle = "rgba(184,146,58,0.7)";
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, size, size);
  ctx.beginPath();
  ctx.moveTo(half, 0);
  ctx.lineTo(half, size);
  ctx.moveTo(0, half);
  ctx.lineTo(size, half);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

// ── Floor medallion: gold rings + 8-point star ───────────────────────────────
export const Medallion = ({
  x = 0,
  z,
  radius,
}: {
  x?: number;
  z: number;
  radius: number;
}) => {
  const star = useMemo(() => {
    const shape = new THREE.Shape();
    const pts = 16;
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? radius * 0.78 : radius * 0.34;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [radius]);
  return (
    <group position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <ringGeometry args={[radius * 0.9, radius * 0.97, 64]} />
        {goldMat()}
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <ringGeometry args={[radius * 0.8, radius * 0.83, 64]} />
        {goldMat()}
      </mesh>
      <mesh geometry={star} position={[0, 0, 0.006]}>
        <meshStandardMaterial color="#2b2a28" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[radius * 0.2, 40]} />
        {goldMat()}
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <circleGeometry args={[radius * 0.1, 32]} />
        <meshStandardMaterial color="#5e1a26" roughness={0.5} />
      </mesh>
    </group>
  );
};

// ── Chandelier with tiers, arms, candle bulbs and crystal drops ──────────────
export const Chandelier = ({
  z,
  withLight,
  y = 10.4,
}: {
  z: number;
  withLight: boolean;
  y?: number;
}) => {
  const bulbs = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      out.push({ p: [Math.cos(a) * 1.9, 0.32, Math.sin(a) * 1.9] });
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      out.push({ p: [Math.cos(a) * 1.15, -0.2, Math.sin(a) * 1.15] });
    }
    return out;
  }, []);
  const candles = useMemo<Item[]>(
    () => bulbs.map((b) => ({ p: [b.p[0], b.p[1] - 0.2, b.p[2]] })),
    [bulbs]
  );
  const drops = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      out.push({
        p: [Math.cos(a) * 1.9, -0.18 - (i % 3) * 0.1, Math.sin(a) * 1.9],
        s: [1, 1.6 + (i % 2) * 0.5, 1],
      });
    }
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      out.push({ p: [Math.cos(a) * 1.15, -0.62, Math.sin(a) * 1.15] });
    }
    return out;
  }, []);
  const arms = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      out.push({
        p: [Math.cos(a) * 0.95, -0.3, Math.sin(a) * 0.95],
        r: [0, Math.PI / 2 - a, 0],
      });
    }
    return out;
  }, []);

  return (
    <group position={[0, y, z]}>
      {/* chain & canopy */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 6.8, 6]} />
        <meshStandardMaterial color={BRONZE} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        {goldMat(0.25)}
      </mesh>
      {/* tiers */}
      {[1.9, 1.15, 0.55].map((r, i) => (
        <mesh
          key={i}
          position={[0, 0.3 - i * 0.5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[r, 0.055, 8, 56]} />
          {goldMat(0.25)}
        </mesh>
      ))}
      {/* scrolling arms from the hub to the outer ring */}
      <Instances items={arms}>
        <torusGeometry args={[0.5, 0.025, 6, 20, Math.PI]} />
        {goldMat(0.3)}
      </Instances>
      <Instances items={candles}>
        <cylinderGeometry args={[0.05, 0.05, 0.28, 8]} />
        <meshStandardMaterial color="#f4ecd8" roughness={0.6} />
      </Instances>
      <Instances items={bulbs}>
        <sphereGeometry args={[0.085, 10, 10]} />
        <meshStandardMaterial
          color="#fff2c8"
          emissive="#ffd98a"
          emissiveIntensity={1.8}
        />
      </Instances>
      <Instances items={drops}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial
          color="#fff6dc"
          emissive="#ffe6aa"
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.1}
        />
      </Instances>
      {/* hanging finial */}
      <mesh position={[0, -1.2, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#fff6dc"
          emissive="#ffe6aa"
          emissiveIntensity={0.9}
          roughness={0.1}
        />
      </mesh>
      {withLight && (
        <pointLight
          position={[0, -0.6, 0]}
          intensity={2.2}
          color="#ffdca0"
          distance={22}
          decay={2}
        />
      )}
    </group>
  );
};

const MilanDecor = ({ W, L, H }: { W: number; L: number; H: number }) => {
  const root = useRef<THREE.Group>(null);
  const floorTex = useMemo(() => {
    const t = makeFloorTexture();
    if (t) t.repeat.set(W / 6, L / 6);
    return t;
  }, [W, L]);

  // Decoration must never swallow pointer events meant for the frames/doors.
  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  const colX = W / 2 - 4; // 11
  const wallX = W / 2;
  const colZs = useMemo(() => [-37.5, -18.5, 0, 18.5, 37.5], []);
  const R = W / 2;
  const VAULT_SQUASH = 0.42;

  const ribZs = useMemo(() => {
    const out: number[] = [];
    for (let z = -L / 2 + 2; z <= L / 2 - 2; z += 4.1) out.push(z);
    return out;
  }, [L]);
  const longAngles = useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => 0.18 + (i / 12) * (Math.PI - 0.36)),
    []
  );

  // ── Instanced detail sets ─────────────────────────────────────────────────
  const flutes = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const s of [-1, 1])
      for (const z of colZs)
        for (let k = 0; k < 24; k++) {
          const a = (k / 24) * Math.PI * 2;
          out.push({
            p: [s * colX + Math.cos(a) * 0.5, 4.9, z + Math.sin(a) * 0.5],
            r: [0, Math.PI / 2 - a, 0],
          });
        }
    return out;
  }, [colX, colZs]);

  const leaves = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const s of [-1, 1])
      for (const z of colZs) {
        for (let k = 0; k < 16; k++) {
          const a = (k / 16) * Math.PI * 2;
          out.push({
            p: [s * colX + Math.cos(a) * 0.66, 9.42, z + Math.sin(a) * 0.66],
            r: [0.28, Math.PI / 2 - a, 0],
          });
        }
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
          out.push({
            p: [s * colX + Math.cos(a) * 0.78, 9.58, z + Math.sin(a) * 0.78],
            r: [0.5, Math.PI / 2 - a, 0],
            s: [1.2, 1.15, 1.2],
          });
        }
      }
    return out;
  }, [colX, colZs]);

  const volutes = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const s of [-1, 1])
      for (const z of colZs)
        for (const [dx, dz] of [
          [0.82, 0.82],
          [-0.82, 0.82],
          [0.82, -0.82],
          [-0.82, -0.82],
        ])
          out.push({
            p: [s * colX + dx, 9.7, z + dz],
            r: [Math.PI / 2, Math.atan2(dx, dz), 0],
          });
    return out;
  }, [colX, colZs]);

  const dentils = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const s of [-1, 1])
      for (let z = -L / 2 + 0.5; z <= L / 2 - 0.5; z += 0.46)
        out.push({ p: [s * (wallX - 0.42), H - 0.86, z] });
    return out;
  }, [L, wallX, H]);

  const eggs = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const s of [-1, 1])
      for (let z = -L / 2 + 0.6; z <= L / 2 - 0.6; z += 0.34)
        out.push({ p: [s * (wallX - 0.5), H - 1.1, z] });
    return out;
  }, [L, wallX, H]);

  const ribFinials = useMemo<Item[]>(() => {
    const out: Item[] = [];
    ribZs.forEach((z) =>
      longAngles.forEach((a) =>
        out.push({ p: [Math.cos(a) * (R - 0.05), Math.sin(a) * (R - 0.05), z] })
      )
    );
    return out;
  }, [ribZs, longAngles, R]);

  const pilasters = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const s of [-1, 1])
      for (const z of colZs) out.push({ p: [s * (wallX - 0.25), 0, z] });
    return out;
  }, [wallX, colZs]);

  const sconceBrackets = useMemo<Item[]>(
    () =>
      pilasters.map((it) => ({
        p: [it.p[0] + (it.p[0] > 0 ? -0.4 : 0.4), 3.6, it.p[2]],
      })),
    [pilasters]
  );
  const sconceFlames = useMemo<Item[]>(
    () =>
      sconceBrackets.map((it) => ({
        p: [it.p[0] + (it.p[0] > 0 ? -0.18 : 0.18), 4.05, it.p[2]],
        s: [1, 1.6, 1],
      })),
    [sconceBrackets]
  );

  const urn = useMemo(() => {
    const pts = [
      [0.001, 0],
      [0.42, 0.04],
      [0.46, 0.14],
      [0.34, 0.26],
      [0.44, 0.55],
      [0.5, 0.78],
      [0.38, 1.0],
      [0.22, 1.12],
      [0.26, 1.2],
      [0.4, 1.3],
      [0.001, 1.3],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 28);
  }, []);

  return (
    <group ref={root}>
      {/* CHECKERBOARD MARBLE FLOOR */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        receiveShadow
      >
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial
          map={floorTex ?? undefined}
          color="#ffffff"
          roughness={0.14}
          metalness={0.1}
        />
      </mesh>

      {/* Floor border: dark marble band + gold inlay lines */}
      {([-1, 1] as number[]).map((s) => (
        <group key={s}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[s * (wallX - 0.75), 0.012, 0]}
          >
            <planeGeometry args={[1.5, L]} />
            <meshStandardMaterial color="#25423a" roughness={0.2} />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[s * (wallX - 1.55), 0.015, 0]}
          >
            <planeGeometry args={[0.1, L]} />
            {goldMat()}
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[s * (wallX - 1.75), 0.015, 0]}
          >
            <planeGeometry args={[0.04, L]} />
            {goldMat()}
          </mesh>
        </group>
      ))}

      {/* BURGUNDY RUNNER with double gold edging */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[4.6, L - 4]} />
        <meshStandardMaterial color="#5e1a26" roughness={0.9} />
      </mesh>
      {([-2.3, 2.3, -2.0, 2.0] as number[]).map((x, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.025, 0]}
        >
          <planeGeometry args={[i < 2 ? 0.14 : 0.05, L - 4]} />
          {goldMat()}
        </mesh>
      ))}

      {/* Inlaid medallions */}
      <Medallion z={0} radius={2.1} />
      <Medallion z={-18.5} radius={1.6} />
      <Medallion z={18.5} radius={1.6} />
      <Medallion z={-33} radius={1.3} />
      <Medallion z={33} radius={1.3} />

      {/* GREEN MARBLE DADO + chair rail on both side walls */}
      {([-1, 1] as number[]).map((s) => (
        <group key={s} position={[s * (wallX - 0.04), 0, 0]}>
          <mesh position={[0, 1.15, 0]} rotation={[0, (-s * Math.PI) / 2, 0]}>
            <planeGeometry args={[L - 0.2, 2.3]} />
            <meshStandardMaterial
              color="#27463a"
              roughness={0.22}
              metalness={0.1}
            />
          </mesh>
          {/* raised panel moldings */}
          {Array.from({ length: 12 }, (_, i) => {
            const z = -L / 2 + 4 + i * 6.7;
            return (
              <group key={i} position={[-s * 0.03, 1.15, z]}>
                {[
                  [0, 0.9, 5.2, 0.06],
                  [0, -0.9, 5.2, 0.06],
                ].map(([, y, w, h], j) => (
                  <mesh key={j} position={[0, y, 0]}>
                    <boxGeometry args={[0.05, h, w]} />
                    {goldMat()}
                  </mesh>
                ))}
                {[-2.6, 2.6].map((dz, j) => (
                  <mesh key={j} position={[0, 0, dz]}>
                    <boxGeometry args={[0.05, 1.8, 0.06]} />
                    {goldMat()}
                  </mesh>
                ))}
              </group>
            );
          })}
          {/* chair rail */}
          <mesh position={[-s * 0.06, 2.35, 0]}>
            <boxGeometry args={[0.2, 0.14, L - 0.2]} />
            {goldMat()}
          </mesh>
          <mesh position={[-s * 0.04, 2.5, 0]}>
            <boxGeometry args={[0.1, 0.1, L - 0.2]} />
            <meshStandardMaterial color={MARBLE_WARM} roughness={0.4} />
          </mesh>
          {/* stacked cornice */}
          <mesh position={[-s * 0.25, H - 0.35, 0]}>
            <boxGeometry args={[0.6, 0.5, L - 0.2]} />
            <meshStandardMaterial color={MARBLE_WARM} roughness={0.5} />
          </mesh>
          <mesh position={[-s * 0.5, H - 0.7, 0]}>
            <boxGeometry args={[0.35, 0.18, L - 0.2]} />
            {goldMat()}
          </mesh>
          <mesh position={[-s * 0.4, H - 1.0, 0]}>
            <boxGeometry args={[0.3, 0.16, L - 0.2]} />
            <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.45} />
          </mesh>
          <mesh position={[-s * 0.3, H - 1.25, 0]}>
            <boxGeometry args={[0.2, 0.1, L - 0.2]} />
            {goldMat()}
          </mesh>
        </group>
      ))}

      {/* dentils and egg-and-dart rows */}
      <Instances items={dentils}>
        <boxGeometry args={[0.2, 0.22, 0.2]} />
        <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.5} />
      </Instances>
      <Instances items={eggs}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.4} />
      </Instances>

      {/* PILASTERS flush on the side walls, in rhythm with the columns */}
      <Instances items={pilasters.map((p) => ({ p: [p.p[0], 0.2, p.p[2]] }))}>
        <boxGeometry args={[0.5, 0.4, 1.35]} />
        <meshStandardMaterial color={MARBLE_WARM} roughness={0.35} />
      </Instances>
      <Instances items={pilasters.map((p) => ({ p: [p.p[0], 4.95, p.p[2]] }))}>
        <boxGeometry args={[0.34, 8.5, 1.0]} />
        <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.3} />
      </Instances>
      <Instances
        items={pilasters.flatMap((p) =>
          [-0.3, -0.1, 0.1, 0.3].map<Item>((dz) => ({
            p: [p.p[0] + (p.p[0] > 0 ? -0.175 : 0.175), 4.95, p.p[2] + dz],
          }))
        )}
      >
        <boxGeometry args={[0.04, 8.3, 0.05]} />
        <meshStandardMaterial color={MARBLE_GROOVE} roughness={0.5} />
      </Instances>
      <Instances items={pilasters.map((p) => ({ p: [p.p[0], 9.4, p.p[2]] }))}>
        <boxGeometry args={[0.6, 0.5, 1.35]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.38} />
      </Instances>

      {/* ARCADE: fluted columns with acanthus capitals */}
      {([-1, 1] as number[]).map((s) => (
        <group key={s}>
          {colZs.map((z) => (
            <group key={z} position={[s * colX, 0, z]}>
              {/* stepped plinth + torus base */}
              <mesh position={[0, 0.12, 0]}>
                <boxGeometry args={[1.9, 0.24, 1.9]} />
                <meshStandardMaterial color={MARBLE_WARM} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0.34, 0]}>
                <boxGeometry args={[1.6, 0.2, 1.6]} />
                <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.52, 0]}>
                <torusGeometry args={[0.62, 0.1, 10, 28]} />
                <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.7, 0]}>
                <torusGeometry args={[0.56, 0.07, 10, 28]} />
                {goldMat()}
              </mesh>
              {/* shaft */}
              <mesh position={[0, 4.9, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 8.5, 32]} />
                <meshStandardMaterial
                  color={MARBLE_LIGHT}
                  roughness={0.26}
                  metalness={0.04}
                />
              </mesh>
              {/* astragal rings */}
              <mesh position={[0, 9.12, 0]}>
                <torusGeometry args={[0.52, 0.05, 8, 28]} />
                {goldMat()}
              </mesh>
              <mesh position={[0, 9.22, 0]}>
                <torusGeometry args={[0.52, 0.03, 8, 28]} />
                {goldMat()}
              </mesh>
              {/* capital bell */}
              <mesh position={[0, 9.5, 0]}>
                <cylinderGeometry args={[0.86, 0.55, 0.55, 28]} />
                <meshStandardMaterial
                  color={GOLD}
                  metalness={0.65}
                  roughness={0.38}
                />
              </mesh>
              {/* abacus */}
              <mesh position={[0, 9.88, 0]}>
                <boxGeometry args={[1.95, 0.2, 1.95]} />
                <meshStandardMaterial color={MARBLE_WARM} roughness={0.35} />
              </mesh>
              <mesh position={[0, 10.0, 0]}>
                <boxGeometry args={[2.05, 0.06, 2.05]} />
                {goldMat()}
              </mesh>
            </group>
          ))}

          {/* architrave: three fascia + frieze + gold cap */}
          <mesh position={[s * colX, 10.25, 0]}>
            <boxGeometry args={[1.1, 0.34, L - 3]} />
            <meshStandardMaterial color={MARBLE_WARM} roughness={0.4} />
          </mesh>
          <mesh position={[s * colX, 10.55, 0]}>
            <boxGeometry args={[1.25, 0.26, L - 3]} />
            <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.4} />
          </mesh>
          <mesh position={[s * colX, 10.78, 0]}>
            <boxGeometry args={[1.4, 0.2, L - 3]} />
            {goldMat()}
          </mesh>

          {/* shallow arches with keystones and spandrel rosettes */}
          {colZs.slice(0, -1).map((z, i) => {
            const mid = (z + colZs[i + 1]) / 2;
            const span = (colZs[i + 1] - z) / 2 - 0.9;
            return (
              <group key={i} position={[s * colX, 10.0, mid]}>
                <mesh rotation={[0, Math.PI / 2, 0]} scale={[1, 0.3, 1]}>
                  <torusGeometry args={[span, 0.24, 10, 48, Math.PI]} />
                  <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.35} />
                </mesh>
                <mesh
                  rotation={[0, Math.PI / 2, 0]}
                  scale={[1, 0.3, 1]}
                  position={[0, -0.02, 0]}
                >
                  <torusGeometry args={[span - 0.3, 0.06, 8, 48, Math.PI]} />
                  {goldMat()}
                </mesh>
                <mesh position={[0, span * 0.3 + 0.12, 0]}>
                  <boxGeometry args={[0.5, 0.6, 0.55]} />
                  {goldMat(0.4)}
                </mesh>
                {[-1, 1].map((d) => (
                  <mesh
                    key={d}
                    position={[0, 0.5, d * (span * 0.62)]}
                    rotation={[0, Math.PI / 2, 0]}
                  >
                    <circleGeometry args={[0.28, 24]} />
                    {goldMat(0.3)}
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>
      ))}

      {/* column flutes, acanthus leaves and volutes (instanced) */}
      <Instances items={flutes}>
        <boxGeometry args={[0.075, 8.3, 0.05]} />
        <meshStandardMaterial color={MARBLE_GROOVE} roughness={0.5} />
      </Instances>
      <Instances items={leaves}>
        <coneGeometry args={[0.13, 0.62, 6]} />
        <meshStandardMaterial color="#d3b256" metalness={0.6} roughness={0.4} />
      </Instances>
      <Instances items={volutes}>
        <torusGeometry args={[0.13, 0.04, 8, 18]} />
        {goldMat(0.4)}
      </Instances>

      {/* WALL SCONCES on the pilasters */}
      <Instances items={sconceBrackets}>
        <cylinderGeometry args={[0.05, 0.08, 0.36, 8]} />
        {goldMat(0.3)}
      </Instances>
      <Instances items={sconceFlames}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial
          color="#fff2c8"
          emissive="#ffd488"
          emissiveIntensity={2.0}
        />
      </Instances>

      {/* URNS on pedestals */}
      {([-1, 1] as number[]).flatMap((s) =>
        [-18.5, 0, 18.5].map((z) => (
          <group key={`${s}-${z}`} position={[s * (wallX - 2.3), 0, z + 2.6]}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.9, 1.0, 0.9]} />
              <meshStandardMaterial color={MARBLE_LIGHT} roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.04, 0]}>
              <boxGeometry args={[1.05, 0.1, 1.05]} />
              {goldMat()}
            </mesh>
            <mesh geometry={urn} position={[0, 1.1, 0]} scale={0.95}>
              <meshStandardMaterial
                color="#a47c2c"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))
      )}

      {/* GLASS-AND-IRON BARREL VAULT (replaces the flat ceiling) */}
      <group position={[0, H, 0]} scale={[1, VAULT_SQUASH, 1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry
            args={[R, R, L, 64, 1, true, Math.PI / 2, Math.PI]}
          />
          <meshStandardMaterial
            color="#f7e9c6"
            emissive="#ffe8b0"
            emissiveIntensity={0.22}
            transparent
            opacity={0.32}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {ribZs.map((z) => (
          <group key={z} position={[0, 0, z]}>
            <mesh>
              <torusGeometry args={[R - 0.05, 0.15, 8, 64, Math.PI]} />
              <meshStandardMaterial
                color={BRONZE}
                metalness={0.75}
                roughness={0.35}
              />
            </mesh>
            <mesh position={[0, 0, 0.0]}>
              <torusGeometry args={[R - 0.9, 0.06, 8, 64, Math.PI]} />
              {goldMat(0.4)}
            </mesh>
          </group>
        ))}
        {longAngles.map((a) => (
          <mesh
            key={a}
            position={[Math.cos(a) * (R - 0.05), Math.sin(a) * (R - 0.05), 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.06, 0.06, L, 6]} />
            <meshStandardMaterial
              color={BRONZE}
              metalness={0.75}
              roughness={0.35}
            />
          </mesh>
        ))}
        <Instances items={ribFinials}>
          <sphereGeometry args={[0.16, 10, 10]} />
          {goldMat(0.3)}
        </Instances>
      </group>
      <directionalLight position={[0, 24, 6]} intensity={0.8} color="#fff0d0" />

      {/* faint light shafts through the glass */}
      {[
        [-5, -34],
        [5, -14],
        [-5, 14],
        [5, 34],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 9, z]} rotation={[0, 0, x > 0 ? 0.08 : -0.08]}>
          <cylinderGeometry args={[0.4, 3.2, 18, 20, 1, true]} />
          <meshBasicMaterial
            color="#ffe9b8"
            transparent
            opacity={0.035}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* CHANDELIERS */}
      {[-28, 0, 28].map((z) => (
        <Chandelier key={z} z={z} withLight />
      ))}
      {[-14, 14].map((z) => (
        <Chandelier key={z} z={z} withLight={false} />
      ))}
    </group>
  );
};

export default MilanDecor;

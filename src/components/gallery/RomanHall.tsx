import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Chandelier, Instances, type Item } from "./MilanDecor";
import { makeTravertine } from "./ColosseumArena";

// Luxurious Roman hall for the sketchbook room: polished black marble floor
// with gold veining, travertine upper walls over a black-marble dado with gold
// panels, fluted columns with gilded acanthus capitals, a midnight vault with
// gold ribs and rosettes, crystal chandeliers, velvet ropes, leather benches,
// round skylights and an arched niche at the far end.

const STONE = "#cbbb97";
const STONE_DARK = "#a99a78";
const GOLD = "#c9a24a";
const ROPE = "#6b1520";
const VOID = "#14100a";

// ── textures ─────────────────────────────────────────────────────────────────
const veins = (
  ctx: CanvasRenderingContext2D,
  s: number,
  n: number,
  colors: string[],
  maxW = 1.8
) => {
  for (let i = 0; i < n; i++) {
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 0.4 + Math.random() * maxW;
    ctx.beginPath();
    const x = Math.random() * s;
    const y = Math.random() * s;
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + Math.random() * 300 - 150,
      y + Math.random() * 300 - 150,
      x + Math.random() * 300 - 150,
      y + Math.random() * 300 - 150,
      x + Math.random() * 380 - 190,
      y + Math.random() * 380 - 190
    );
    ctx.stroke();
  }
};

const finish = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
};

// Black marble with gold + white veining, laid as a 2x2 pattern with a pale
// inlaid diamond and gold ring in each tile.
const makeFloor = () => {
  const s = 1024;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const h = s / 2;
  const tones = [
    ["#15130f", "#1f1b16"],
    ["#1d1a15", "#0f0d0a"],
    ["#1d1a15", "#0f0d0a"],
    ["#15130f", "#1f1b16"],
  ];
  const cells: [number, number][] = [
    [0, 0],
    [h, 0],
    [0, h],
    [h, h],
  ];
  cells.forEach(([x, y], i) => {
    const g = ctx.createLinearGradient(x, y, x + h, y + h);
    g.addColorStop(0, tones[i][0]);
    g.addColorStop(1, tones[i][1]);
    ctx.fillStyle = g;
    ctx.fillRect(x, y, h, h);
  });
  veins(
    ctx,
    s,
    90,
    ["rgba(201,162,74,0.28)", "rgba(235,225,205,0.16)", "rgba(201,162,74,0.16)"],
    1.6
  );
  cells.forEach(([x, y]) => {
    const cx = x + h / 2;
    const cy = y + h / 2;
    const r = h * 0.3;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0, "#e2d8c2");
    g.addColorStop(1, "#bfb298");
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.strokeStyle = "rgba(201,162,74,0.95)";
    ctx.lineWidth = 4;
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(201,162,74,0.95)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.strokeStyle = "rgba(201,162,74,0.9)";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, s, s);
  ctx.beginPath();
  ctx.moveTo(h, 0);
  ctx.lineTo(h, s);
  ctx.moveTo(0, h);
  ctx.lineTo(s, h);
  ctx.stroke();
  return finish(c);
};

const makeBlackMarble = () => {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, s, s);
  g.addColorStop(0, "#1a1815");
  g.addColorStop(1, "#0e0c0a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  veins(
    ctx,
    s,
    40,
    ["rgba(235,225,205,0.2)", "rgba(201,162,74,0.3)", "rgba(235,225,205,0.1)"],
    1.5
  );
  return finish(c);
};

const makeNavy = () => {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#1b2236";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 1200; i++) {
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.06)";
    ctx.fillRect(Math.random() * s, Math.random() * s, 3, 2);
  }
  return finish(c);
};

const goldMat = (rough = 0.28) => (
  <meshStandardMaterial color={GOLD} metalness={0.9} roughness={rough} />
);
const stoneMat = (dark = false) => (
  <meshStandardMaterial
    color={dark ? STONE_DARK : STONE}
    roughness={0.9}
    metalness={0}
  />
);

const RomanHall = ({
  L,
  W,
  H,
  westZ,
  eastZ,
}: {
  L: number;
  W: number;
  H: number;
  westZ: number[];
  eastZ: number[];
}) => {
  const root = useRef<THREE.Group>(null);
  const baseStone = useMemo(() => makeTravertine(), []);
  const floorTex = useMemo(() => {
    const t = makeFloor();
    if (t) t.repeat.set(W / 4, L / 4);
    return t;
  }, [W, L]);
  const blackBase = useMemo(() => makeBlackMarble(), []);
  const navy = useMemo(() => {
    const t = makeNavy();
    if (t) t.repeat.set(10, 10);
    return t;
  }, []);

  const clone = useMemo(
    () => (base: THREE.Texture | null, rx: number, ry: number) => {
      if (!base) return null;
      const t = base.clone();
      t.repeat.set(rx, ry);
      t.needsUpdate = true;
      return t;
    },
    []
  );
  const tNorth = useMemo(() => clone(baseStone, W / 6, H / 7), [clone, baseStone, W, H]);
  const tSide = useMemo(() => clone(baseStone, L / 6, H / 7), [clone, baseStone, L, H]);
  const tSouth = useMemo(() => clone(baseStone, W / 12, H / 7), [clone, baseStone, W, H]);
  const tDado = useMemo(() => clone(blackBase, L / 6, 2.3 / 6), [clone, blackBase, L]);
  const tStrip = useMemo(() => clone(blackBase, 1, (L - 2) / 6), [clone, blackBase, L]);

  // Decoration must never swallow pointer events meant for frames/door.
  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  const mids = (zs: number[]) => {
    const out: number[] = [zs[0] - 3.5];
    for (let i = 0; i < zs.length - 1; i++) out.push((zs[i] + zs[i + 1]) / 2);
    out.push(zs[zs.length - 1] + 3.5);
    return out;
  };
  const westMids = useMemo(() => mids(westZ), [westZ]);
  const eastMids = useMemo(() => mids(eastZ), [eastZ]);

  // ── Engaged fluted columns with gilded acanthus capitals ───────────────────
  const COLX = W / 2 - 0.6;
  const cols = useMemo(() => {
    const out: { x: number; z: number }[] = [];
    westMids.forEach((z) => out.push({ x: -COLX, z }));
    eastMids.forEach((z) => out.push({ x: COLX, z }));
    return out;
  }, [westMids, eastMids, COLX]);

  const colSets = useMemo(() => {
    const plinth: Item[] = [];
    const torus: Item[] = [];
    const shaft: Item[] = [];
    const ringTop: Item[] = [];
    const bell: Item[] = [];
    const abacus: Item[] = [];
    const flutes: Item[] = [];
    const leaves: Item[] = [];
    cols.forEach(({ x, z }) => {
      plinth.push({ p: [x, 0.175, z] });
      torus.push({ p: [x, 0.45, z], r: [Math.PI / 2, 0, 0] });
      shaft.push({ p: [x, 3.75, z] });
      ringTop.push({ p: [x, 6.98, z], r: [Math.PI / 2, 0, 0] });
      bell.push({ p: [x, 7.25, z] });
      abacus.push({ p: [x, 7.58, z] });
      for (let k = 0; k < 24; k++) {
        const a = (k / 24) * Math.PI * 2;
        flutes.push({
          p: [x + Math.cos(a) * 0.5, 3.75, z + Math.sin(a) * 0.5],
          r: [0, Math.PI / 2 - a, 0],
        });
      }
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        leaves.push({
          p: [x + Math.cos(a) * 0.62, 7.1, z + Math.sin(a) * 0.62],
          r: [0.3, Math.PI / 2 - a, 0],
        });
      }
    });
    return { plinth, torus, shaft, ringTop, bell, abacus, flutes, leaves };
  }, [cols]);

  const dentils = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const sx of [-1, 1])
      for (let z = -L / 2 + 0.6; z <= L / 2 - 0.6; z += 0.7)
        out.push({ p: [sx * (W / 2 - 0.5), 8.27, z] });
    return out;
  }, [L, W]);
  const beads = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const sx of [-1, 1])
      for (let z = -L / 2 + 0.4; z <= L / 2 - 0.4; z += 0.4)
        out.push({ p: [sx * (W / 2 - 0.52), 8.05, z] });
    return out;
  }, [L, W]);

  // ── Dado panels (gold frames between columns) ──────────────────────────────
  const panelBars = useMemo<Item[]>(() => {
    const out: Item[] = [];
    const wallX = W / 2 - 0.06;
    const make = (sx: number, zs: number[]) => {
      for (let i = 0; i < zs.length - 1; i++) {
        const a = zs[i] + 1.0;
        const b = zs[i + 1] - 1.0;
        const zc = (a + b) / 2;
        const len = b - a;
        const x = sx * wallX;
        out.push({ p: [x, 0.45, zc], s: [0.05, 0.06, len] });
        out.push({ p: [x, 1.95, zc], s: [0.05, 0.06, len] });
        out.push({ p: [x, 1.2, a], s: [0.05, 1.56, 0.06] });
        out.push({ p: [x, 1.2, b], s: [0.05, 1.56, 0.06] });
      }
    };
    make(-1, westMids);
    make(1, eastMids);
    return out;
  }, [W, westMids, eastMids]);

  // ── Velvet ropes ───────────────────────────────────────────────────────────
  const rope = useMemo(() => {
    const posts: Item[] = [];
    const balls: Item[] = [];
    const ropes: Item[] = [];
    const bases: Item[] = [];
    const z0 = -27;
    const z1 = 25.5;
    const step = (z1 - z0) / 15;
    for (const sx of [-1, 1]) {
      const x = sx * (W / 2 - 2.3);
      for (let i = 0; i <= 15; i++) {
        const z = z0 + i * step;
        posts.push({ p: [x, 0.5, z] });
        balls.push({ p: [x, 1.02, z] });
        bases.push({ p: [x, 0.03, z] });
        if (i < 15)
          ropes.push({
            p: [x, 0.8, z + step / 2],
            r: [Math.PI / 2, 0, 0],
            s: [1, step - 0.12, 1],
          });
      }
    }
    return { posts, balls, ropes, bases };
  }, [W]);

  // ── Leather benches ────────────────────────────────────────────────────────
  const benches = useMemo(() => {
    const seats: Item[] = [];
    const legs: Item[] = [];
    const buttons: Item[] = [];
    const spots: [number, number][] = [
      [-4.6, -22],
      [4.6, -12],
      [-4.6, -2],
      [4.6, 8],
      [-4.6, 18],
      [4.6, 27],
    ];
    spots.forEach(([x, z]) => {
      seats.push({ p: [x, 0.55, z] });
      for (const dx of [-0.34, 0.34])
        for (const dz of [-1.1, 1.1])
          legs.push({ p: [x + dx, 0.25, z + dz] });
      for (let i = -2; i <= 2; i++)
        for (const dx of [-0.2, 0.2])
          buttons.push({ p: [x + dx, 0.79, z + i * 0.45] });
    });
    return { seats, legs, buttons };
  }, []);

  // ── Vault ──────────────────────────────────────────────────────────────────
  const R = W / 2;
  const SQUASH = 0.4;
  const ribZs = useMemo(() => {
    const out: number[] = [];
    for (let z = -L / 2 + 1.55; z <= L / 2 - 1; z += 3.1) out.push(z);
    return out;
  }, [L]);
  const longAngles = useMemo(
    () => [0.3, 0.68, 1.05, Math.PI / 2, 2.09, 2.46, 2.84],
    []
  );
  const rosettes = useMemo(() => {
    const outer: Item[] = [];
    const inner: Item[] = [];
    const angs = [0.49, 0.865, 1.31, 1.83, 2.275, 2.65];
    for (let i = 0; i < ribZs.length - 1; i++) {
      const z = (ribZs[i] + ribZs[i + 1]) / 2;
      angs.forEach((a) => {
        const it: Item = {
          p: [Math.cos(a) * (R - 0.12), H + Math.sin(a) * (R - 0.12) * SQUASH, z],
          r: [0, 0, a + Math.PI / 2],
        };
        outer.push(it);
        inner.push({
          p: [
            Math.cos(a) * (R - 0.2),
            H + Math.sin(a) * (R - 0.2) * SQUASH,
            z,
          ],
          r: it.r,
        });
      });
    }
    return { outer, inner };
  }, [ribZs, R, H]);

  const oculusZs = [-18, 0, 18];
  const topY = H + R * SQUASH;

  return (
    <group ref={root}>
      {/* POLISHED BLACK MARBLE FLOOR with gold veining */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial
          map={floorTex ?? undefined}
          color="#ffffff"
          roughness={0.16}
          metalness={0.28}
        />
      </mesh>
      {/* processional strip: black marble with double gold edging */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[3.4, L - 2]} />
        <meshStandardMaterial
          map={tStrip ?? undefined}
          color="#7a1f2a"
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      {([-1.7, 1.7, -1.45, 1.45] as number[]).map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.026, 0]}>
          <planeGeometry args={[i < 2 ? 0.14 : 0.05, L - 2]} />
          {goldMat()}
        </mesh>
      ))}

      {/* TRAVERTINE WALL CLADDING */}
      <mesh position={[0, H / 2, -L / 2 + 0.01]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={tNorth ?? undefined} color="#a99d84" roughness={1} />
      </mesh>
      {(() => {
        const DW = 2.6;
        const DH = 3.8;
        const sideW = (W - DW - 0.5) / 2;
        return (
          <>
            <mesh
              position={[-(W / 2 - sideW / 2), H / 2, L / 2 - 0.01]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[sideW, H]} />
              <meshStandardMaterial map={tSouth ?? undefined} color="#a99d84" roughness={1} />
            </mesh>
            <mesh
              position={[W / 2 - sideW / 2, H / 2, L / 2 - 0.01]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[sideW, H]} />
              <meshStandardMaterial map={tSouth ?? undefined} color="#a99d84" roughness={1} />
            </mesh>
            <mesh
              position={[0, H - (H - DH - 0.15) / 2, L / 2 - 0.01]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[DW + 0.5, H - DH - 0.15]} />
              <meshStandardMaterial map={tSouth ?? undefined} color="#a99d84" roughness={1} />
            </mesh>
          </>
        );
      })()}
      <mesh position={[-W / 2 + 0.01, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial map={tSide ?? undefined} color="#a99d84" roughness={1} />
      </mesh>
      <mesh position={[W / 2 - 0.01, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[L, H]} />
        <meshStandardMaterial map={tSide ?? undefined} color="#a99d84" roughness={1} />
      </mesh>

      {/* BLACK MARBLE DADO with gold rail and panel frames */}
      {([-1, 1] as number[]).map((s) => (
        <group key={s}>
          <mesh
            position={[s * (W / 2 - 0.03), 1.15, 0]}
            rotation={[0, (-s * Math.PI) / 2, 0]}
          >
            <planeGeometry args={[L - 0.1, 2.3]} />
            <meshStandardMaterial
              map={tDado ?? undefined}
              color="#ffffff"
              roughness={0.2}
              metalness={0.25}
            />
          </mesh>
          <mesh position={[s * (W / 2 - 0.1), 2.36, 0]}>
            <boxGeometry args={[0.22, 0.14, L - 0.1]} />
            {goldMat()}
          </mesh>
          <mesh position={[s * (W / 2 - 0.08), 2.5, 0]}>
            <boxGeometry args={[0.14, 0.1, L - 0.1]} />
            {stoneMat(true)}
          </mesh>
          {/* stacked entablature */}
          <mesh position={[s * (W / 2 - 0.45), 7.95, 0]}>
            <boxGeometry args={[0.9, 0.55, L]} />
            {stoneMat(true)}
          </mesh>
          <mesh position={[s * (W / 2 - 0.42), 8.52, 0]}>
            <boxGeometry args={[0.84, 0.6, L]} />
            <meshStandardMaterial color="#1a1815" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[s * (W / 2 - 0.47), 8.86, 0]}>
            <boxGeometry args={[0.95, 0.1, L]} />
            {goldMat()}
          </mesh>
          <mesh position={[s * (W / 2 - 0.6), 8.97, 0]}>
            <boxGeometry args={[1.2, 0.14, L]} />
            {stoneMat(true)}
          </mesh>
          <mesh position={[s * (W / 2 - 0.5), 7.66, 0]}>
            <boxGeometry args={[0.98, 0.08, L]} />
            {goldMat()}
          </mesh>
        </group>
      ))}
      <Instances items={panelBars}>
        <boxGeometry args={[1, 1, 1]} />
        {goldMat(0.35)}
      </Instances>
      <Instances items={dentils}>
        <boxGeometry args={[0.28, 0.22, 0.28]} />
        {stoneMat(true)}
      </Instances>
      <Instances items={beads}>
        <sphereGeometry args={[0.07, 8, 8]} />
        {goldMat()}
      </Instances>

      {/* FLUTED COLUMNS with gilded acanthus capitals */}
      <Instances items={colSets.plinth}>
        <boxGeometry args={[1.35, 0.35, 1.35]} />
        {stoneMat(true)}
      </Instances>
      <Instances items={colSets.torus}>
        <torusGeometry args={[0.58, 0.09, 10, 24]} />
        {goldMat()}
      </Instances>
      <Instances items={colSets.shaft}>
        <cylinderGeometry args={[0.5, 0.5, 6.5, 28]} />
        <meshStandardMaterial color="#d8cdb4" roughness={0.3} metalness={0.05} />
      </Instances>
      <Instances items={colSets.flutes}>
        <boxGeometry args={[0.07, 6.3, 0.05]} />
        <meshStandardMaterial color="#a89a7c" roughness={0.5} />
      </Instances>
      <Instances items={colSets.ringTop}>
        <torusGeometry args={[0.52, 0.06, 8, 24]} />
        {goldMat()}
      </Instances>
      <Instances items={colSets.bell}>
        <cylinderGeometry args={[0.85, 0.55, 0.6, 24]} />
        {goldMat(0.32)}
      </Instances>
      <Instances items={colSets.leaves}>
        <coneGeometry args={[0.13, 0.66, 6]} />
        {goldMat(0.38)}
      </Instances>
      <Instances items={colSets.abacus}>
        <boxGeometry args={[1.7, 0.2, 1.7]} />
        {stoneMat(true)}
      </Instances>

      {/* GILDED MIDNIGHT VAULT */}
      <group position={[0, H, 0]} scale={[1, SQUASH, 1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R, R, L, 64, 1, true, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial
            map={navy ?? undefined}
            color="#ffffff"
            emissive="#0d1426"
            emissiveIntensity={0.35}
            roughness={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
        {ribZs.map((z) => (
          <group key={z} position={[0, 0, z]}>
            <mesh>
              <torusGeometry args={[R - 0.1, 0.22, 8, 64, Math.PI]} />
              {goldMat(0.4)}
            </mesh>
            <mesh>
              <torusGeometry args={[R - 0.1, 0.1, 8, 64, Math.PI]} />
              <meshStandardMaterial color="#e6c878" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {longAngles.map((a) => (
          <mesh
            key={a}
            position={[Math.cos(a) * (R - 0.1), Math.sin(a) * (R - 0.1), 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.16, 0.16, L, 8]} />
            {goldMat(0.4)}
          </mesh>
        ))}
      </group>
      <Instances items={rosettes.outer}>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 16]} />
        {goldMat(0.3)}
      </Instances>
      <Instances items={rosettes.inner}>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 12]} />
        <meshStandardMaterial color="#f2d994" metalness={0.9} roughness={0.2} />
      </Instances>

      {/* CRYSTAL CHANDELIERS */}
      {[-27, -9, 9, 27].map((z) => (
        <Chandelier key={z} z={z} y={9.8} withLight={false} />
      ))}

      {/* ROUND SKYLIGHTS with light shafts */}
      {oculusZs.map((z) => (
        <group key={z}>
          <mesh position={[0, topY - 0.03, z]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.5, 40]} />
            <meshBasicMaterial color="#fff4d8" toneMapped={false} />
          </mesh>
          <mesh position={[0, topY - 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.6, 0.14, 10, 40]} />
            {goldMat()}
          </mesh>
          <mesh position={[0, topY / 2, z]}>
            <cylinderGeometry args={[1.5, 2.6, topY, 28, 1, true]} />
            <meshBasicMaterial
              color="#ffe9b8"
              transparent
              opacity={0.06}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z]}>
            <circleGeometry args={[2.7, 40]} />
            <meshBasicMaterial
              color="#ffe9b8"
              transparent
              opacity={0.1}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* VELVET ROPES on gilded stanchions */}
      <Instances items={rope.bases}>
        <cylinderGeometry args={[0.2, 0.22, 0.06, 18]} />
        {goldMat()}
      </Instances>
      <Instances items={rope.posts}>
        <cylinderGeometry args={[0.04, 0.05, 1, 10]} />
        {goldMat()}
      </Instances>
      <Instances items={rope.balls}>
        <sphereGeometry args={[0.085, 12, 12]} />
        {goldMat(0.2)}
      </Instances>
      <Instances items={rope.ropes}>
        <cylinderGeometry args={[0.035, 0.035, 1, 8]} />
        <meshStandardMaterial color={ROPE} roughness={0.9} />
      </Instances>

      {/* TUFTED LEATHER BENCHES */}
      <Instances items={benches.seats}>
        <boxGeometry args={[0.95, 0.4, 2.7]} />
        <meshStandardMaterial color="#4a1a20" roughness={0.45} metalness={0.05} />
      </Instances>
      <Instances items={benches.legs}>
        <cylinderGeometry args={[0.035, 0.03, 0.5, 8]} />
        {goldMat()}
      </Instances>
      <Instances items={benches.buttons}>
        <sphereGeometry args={[0.035, 8, 8]} />
        {goldMat(0.25)}
      </Instances>

      {/* ARCHED NICHE at the north end with gilded columns */}
      <group position={[0, 0, -L / 2]}>
        <mesh position={[0, 3.1, 0.06]}>
          <boxGeometry args={[6, 6.2, 0.12]} />
          <meshStandardMaterial
            color={VOID}
            emissive="#ffb866"
            emissiveIntensity={0.25}
            roughness={1}
          />
        </mesh>
        <mesh position={[0, 6.2, 0.06]}>
          <cylinderGeometry args={[3, 3, 0.12, 36, 1, false, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial
            color={VOID}
            emissive="#ffb866"
            emissiveIntensity={0.25}
            roughness={1}
          />
        </mesh>
        <mesh position={[0, 6.2, 0.2]}>
          <torusGeometry args={[3.3, 0.22, 10, 48, Math.PI]} />
          {goldMat(0.35)}
        </mesh>
        <mesh position={[0, 6.2, 0.2]}>
          <torusGeometry args={[3.0, 0.08, 10, 48, Math.PI]} />
          {goldMat(0.25)}
        </mesh>
        {([-1, 1] as number[]).map((s) => (
          <group key={s} position={[s * 3.55, 0, 0.45]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[1.3, 0.6, 1.3]} />
              {stoneMat(true)}
            </mesh>
            <mesh position={[0, 3.3, 0]}>
              <cylinderGeometry args={[0.46, 0.5, 5.4, 24]} />
              <meshStandardMaterial color="#1b1916" roughness={0.2} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <torusGeometry args={[0.52, 0.07, 8, 24]} />
              {goldMat()}
            </mesh>
            <mesh position={[0, 6.0, 0]}>
              <torusGeometry args={[0.47, 0.07, 8, 24]} />
              {goldMat()}
            </mesh>
            <mesh position={[0, 6.35, 0]}>
              <cylinderGeometry args={[0.78, 0.5, 0.6, 24]} />
              {goldMat(0.32)}
            </mesh>
            <mesh position={[0, 6.7, 0]}>
              <boxGeometry args={[1.5, 0.3, 1.5]} />
              {stoneMat(true)}
            </mesh>
          </group>
        ))}
        <mesh position={[0, 7.3, 0.5]}>
          <boxGeometry args={[8.6, 0.8, 1.2]} />
          {stoneMat(true)}
        </mesh>
        <mesh position={[0, 7.74, 0.5]}>
          <boxGeometry args={[8.9, 0.1, 1.4]} />
          {goldMat()}
        </mesh>
        {/* great brazier on a marble plinth */}
        <mesh position={[0, 0.5, 2.4]}>
          <boxGeometry args={[1.8, 1.0, 1.8]} />
          <meshStandardMaterial color="#1b1916" roughness={0.2} metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.02, 2.4]}>
          <boxGeometry args={[2.0, 0.1, 2.0]} />
          {goldMat()}
        </mesh>
        <mesh position={[0, 1.4, 2.4]}>
          <cylinderGeometry args={[0.95, 0.45, 0.7, 24]} />
          {goldMat(0.3)}
        </mesh>
        <mesh position={[0, 2.25, 2.4]}>
          <coneGeometry args={[0.55, 1.4, 12]} />
          <meshStandardMaterial
            color="#ffb347"
            emissive="#ff7a1a"
            emissiveIntensity={2.4}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
    </group>
  );
};

export default RomanHall;

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Instances, type Item } from "./MilanDecor";
import { goldMat, makeStone } from "./StoneMaterials";

// Distant white-marble Gothic cathedral with its spires and a golden Madonnina
// on the tallest one. Built facing +z; rotate the group to face the viewer.

const marble = makeStone({ color: "#ebe2d8", bump: 7 });
const dark = makeStone({ color: "#4a4650", bump: 4 });

const Duomo = ({
  position,
  rotationY = 0,
  scale = 1,
}: {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}) => {
  const root = useRef<THREE.Group>(null);
  useEffect(() => {
    root.current?.traverse((o) => {
      o.raycast = () => null;
    });
  }, []);

  const gable = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-9, 0);
    s.lineTo(9, 0);
    s.lineTo(0, 10);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 5, bevelEnabled: false });
  }, []);

  // buttress x positions across the facade and their heights
  const buttresses = useMemo(
    () => [
      { x: -19, h: 17 },
      { x: -13.5, h: 20 },
      { x: -9, h: 25 },
      { x: -4.5, h: 21 },
      { x: 4.5, h: 21 },
      { x: 9, h: 25 },
      { x: 13.5, h: 20 },
      { x: 19, h: 17 },
    ],
    []
  );

  const spires = useMemo(() => {
    const shafts: Item[] = [];
    const mid: Item[] = [];
    const tips: Item[] = [];
    const statues: Item[] = [];
    buttresses.forEach(({ x, h }) => {
      shafts.push({ p: [x, h + 3.2, 0.6], s: [1, 6.4, 1] });
      mid.push({ p: [x, h + 7.2, 0.6], s: [1, 2.6, 1] });
      tips.push({ p: [x, h + 9.4, 0.6] });
      statues.push({ p: [x, h + 10.2, 0.6] });
    });
    return { shafts, mid, tips, statues };
  }, [buttresses]);

  const lancets = useMemo<Item[]>(() => {
    const out: Item[] = [];
    [-12.5, -7, 0, 7, 12.5].forEach((x) => out.push({ p: [x, 8.2, 3.02] }));
    return out;
  }, []);
  const lancetCaps = useMemo<Item[]>(() => lancets.map((l) => ({ p: [l.p[0], l.p[1] + 2.1, l.p[2]] })), [lancets]);
  const portals = useMemo<Item[]>(() => {
    const out: Item[] = [];
    [-16, -8, 0, 8, 16].forEach((x) => out.push({ p: [x, 2.3, 3.02] }));
    return out;
  }, []);
  const portalCaps = useMemo<Item[]>(() => portals.map((l) => ({ p: [l.p[0], l.p[1] + 1.6, l.p[2]] })), [portals]);

  return (
    <group ref={root} position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* nave facade */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[42, 16, 6]} />
        <primitive object={marble} attach="material" />
      </mesh>
      <mesh geometry={gable} position={[0, 16, -2.5]}>
        <primitive object={marble} attach="material" />
      </mesh>
      {/* stepped side roofs */}
      {([-1, 1] as number[]).map((s) => (
        <mesh key={s} position={[s * 14, 17.2, -1]} rotation={[0, 0, s * -0.25]}>
          <boxGeometry args={[14, 0.8, 5]} />
          <primitive object={marble} attach="material" />
        </mesh>
      ))}
      {/* buttresses */}
      {buttresses.map(({ x, h }) => (
        <mesh key={x} position={[x, h / 2, 0.8]}>
          <boxGeometry args={[1.4, h, 1.6]} />
          <primitive object={marble} attach="material" />
        </mesh>
      ))}
      {/* the great central spire behind the gable, with the golden Madonnina */}
      <mesh position={[0, 31, -1.5]}>
        <coneGeometry args={[2.6, 22, 8]} />
        <primitive object={marble} attach="material" />
      </mesh>
      <mesh position={[0, 42.5, -1.5]}>
        <coneGeometry args={[0.9, 6, 8]} />
        <primitive object={marble} attach="material" />
      </mesh>
      <mesh position={[0, 46, -1.5]}>
        <cylinderGeometry args={[0.3, 0.45, 2.4, 8]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      <mesh position={[0, 47.8, -1.5]}>
        <sphereGeometry args={[0.42, 12, 12]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
      {/* spires on the buttresses */}
      <Instances items={spires.shafts}>
        <coneGeometry args={[0.7, 1, 8]} />
        <primitive object={marble} attach="material" />
      </Instances>
      <Instances items={spires.tips}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <primitive object={goldMat} attach="material" />
      </Instances>
      <Instances items={spires.statues}>
        <coneGeometry args={[0.1, 0.5, 6]} />
        <primitive object={goldMat} attach="material" />
      </Instances>
      {/* tall pointed windows */}
      <Instances items={lancets}>
        <boxGeometry args={[1.6, 4.2, 0.2]} />
        <primitive object={dark} attach="material" />
      </Instances>
      <Instances items={lancetCaps}>
        <coneGeometry args={[0.8, 1.4, 3]} />
        <primitive object={dark} attach="material" />
      </Instances>
      {/* five portals */}
      <Instances items={portals}>
        <boxGeometry args={[2.6, 4.6, 0.2]} />
        <primitive object={dark} attach="material" />
      </Instances>
      <Instances items={portalCaps}>
        <coneGeometry args={[1.5, 1.8, 3]} />
        <primitive object={dark} attach="material" />
      </Instances>
      {/* gold cornice line */}
      <mesh position={[0, 16.1, 3.05]}>
        <boxGeometry args={[42.2, 0.14, 0.14]} />
        <primitive object={goldMat} attach="material" />
      </mesh>
    </group>
  );
};

export default Duomo;

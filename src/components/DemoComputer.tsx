import { useRef, useEffect, FC } from 'react';
import { useGLTF, useVideoTexture } from '@react-three/drei';
import gsap from 'gsap';
import { Group, Material, Mesh } from 'three';

interface DemoComputerProps {
    texture?: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number | [number, number, number];
}

const DemoComputer: FC<DemoComputerProps> = (props) => {
    const group = useRef<Group>(null);
    const { nodes, materials } = useGLTF('/models/computer.glb') as unknown as {
        nodes: {
            [key: string]: Mesh;
        };
        materials: {
            [key: string]: Material;
        };
    };

    const txt = useVideoTexture(props.texture || '/textures/project/project1.mp4');

    useEffect(() => {
        if (txt) {
            txt.flipY = false;
        }
    }, [txt]);

    useEffect(() => {
        if (group.current) {
            gsap.from(group.current.rotation, {
                y: Math.PI / 2,
                duration: 1,
                ease: 'power3.out',
            });
        }
    }, [txt]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <mesh
                    name="monitor-screen"
                    geometry={nodes['monitor-screen'].geometry}
                    material={nodes['monitor-screen'].material}
                    position={[0.127, 1.831, 0.511]}
                    rotation={[1.571, -0.005, 0.031]}
                    scale={[0.661, 0.608, 0.401]}>
                    <meshBasicMaterial map={txt} toneMapped={false} />
                </mesh>
                <group name="RootNode" position={[0, 1.093, 0]} rotation={[-Math.PI / 2, 0, -0.033]} scale={0.045}>
                    {[...Array(148).keys()].map(i => (
                        <group
                            key={`Screen${i + 1}`}
                            name={`Screen${String(i + 1).padStart(3, '0')}`}
                            position={[5.658, 1.644, 0.812]}
                            rotation={[Math.PI / 2, 0, 0]}
                            scale={[0.923, 0.855, 0.855]}
                        />
                    ))}
                    <group
                        name="Tower-light-007"
                        position={[16.089, -3.47, -14.495]}
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={0.963}
                    />
                    <group
                        name="Tower-light-008"
                        position={[15.155, -3.47, -14.495]}
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={0.963}
                    />
                </group>
                <group
                    name="Monitor-B-_computer_0"
                    position={[0.266, 1.132, 0.051]}
                    rotation={[0, -0.033, 0]}
                    scale={[0.042, 0.045, 0.045]}>
                    {['computer', 'base__0', 'Material_36', 'Material_35', 'Material_34', 'keys', 'keys2', 'Material_37'].map((materialName, index) => (
                        <mesh
                            key={`Monitor-B-mesh-${index}`}
                            name={`Monitor-B-_computer_0_${index + 1}`}
                            geometry={nodes[`Monitor-B-_computer_0_${index + 1}`].geometry}
                            material={materials[materialName]}
                        />
                    ))}
                </group>
            </group>
        </group>
    );
};

useGLTF.preload('/models/computer.glb');

export default DemoComputer;

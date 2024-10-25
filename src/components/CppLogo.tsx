import { Float, useGLTF } from '@react-three/drei';
import { Mesh, Material } from 'three';

interface CppLogoProps {
    position?: [number, number, number];
    scale?: number | [number, number, number];
    rotation?: [number, number, number];
}

const CppLogo: React.FC<CppLogoProps> = (props) => {
    const { nodes, materials } = useGLTF('/models/c.glb') as unknown as {
        nodes: {
            'C++_C++_0': Mesh;
        };
        materials: {
            material: Material;
        };
    };

    return (
        <Float floatIntensity={1}>
            <group {...props} dispose={null}>
                <group scale={0.0003}>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes['C++_C++_0'].geometry}
                        material={materials.material}
                        position={[0, 0, 199.569]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={100}
                    />
                </group>
            </group>
        </Float>
    );
};

useGLTF.preload('/models/c.glb');
export default CppLogo;

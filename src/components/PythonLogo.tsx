import React, { useRef } from 'react';
import { Float, useGLTF } from '@react-three/drei';

const PythonLogo = (props) => {
    const { nodes, materials } = useGLTF('/models/python.glb');

    return (
        <Float floatIntensity={1}> {/* Float 효과 추가 */}
            <group position={[9, -4, 0]} scale={0.3} dispose={null} {...props}> {/* Cube와 동일한 위치와 크기 */}
                <group scale={0.01}>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Python_Python_0.geometry}
                        material={materials.Python}
                        rotation={[-Math.PI / 2, 0, 0]}
                        scale={10}
                    />
                </group>
            </group>
        </Float>
    );
};

useGLTF.preload('/models/python.glb');
export default PythonLogo;

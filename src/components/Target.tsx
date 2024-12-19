import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { Group } from 'three';

interface TargetProps {
    rotation?: [number, number, number];
    position?: [number, number, number];
    scale?: [number, number, number];
}

const Target: React.FC<TargetProps> = (props) => {
    const targetRef = useRef<Group>(null);
    const { scene } = useGLTF(
        'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf',
    );

    useEffect(() => {
        if (targetRef.current) {
            gsap.to(targetRef.current.position, {
                y: targetRef.current.position.y + 1,
                duration: 1.5,
                repeat: -1,
                yoyo: true
            });
        }
    }, []);

    return (
        <group {...props} ref={targetRef} rotation={props.rotation || [0, Math.PI / 5, 0]}>
            <primitive object={scene} />
        </group>
    );
};

export default Target;

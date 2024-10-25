import { useRef, FC, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three'; // Importing Group from THREE
import { easing } from 'maath';

interface HeroCameraProps {
    isMobile: boolean;
    children: ReactNode;
}

const HeroCamera: FC<HeroCameraProps> = ({ isMobile, children }) => {
    const group = useRef<Group>(null); // Use imported Group type

    useFrame((state, delta) => {
        // Smoothly move the camera to the target position
        easing.damp3(state.camera.position, [0, 0, 25], 0.25, delta);

        // Rotate the group based on pointer position if not on a mobile device
        if (!isMobile && group.current) {
            easing.dampE(
                group.current.rotation,
                [-state.pointer.y / 3, state.pointer.x / 5, 0],
                0.25,
                delta
            );
        }
    });

    return <group ref={group}>{children}</group>;
};

export default HeroCamera;

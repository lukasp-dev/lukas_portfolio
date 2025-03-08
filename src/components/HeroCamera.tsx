import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const HeroCamera = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Create a cube with wireframe effect
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshStandardMaterial({
            color: '#00aaff',
            wireframe: true
        });
        const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);

        // Add lights
        const pointLight = new THREE.PointLight(0xffff00, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0xffff00, 0.5);
        scene.add(ambientLight);

        // Camera position
        camera.position.z = 5;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;

        // Create particle system for star effect
        const starCount = 200; // 별의 수 줄이기
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10; // X position
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y position
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z position

            // 별 색상 설정 (흰색)
            colors[i * 3] = 1; // Red
            colors[i * 3 + 1] = 1; // Green
            colors[i * 3 + 2] = 1; // Blue
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 0.01, // 별 크기 줄이기
            vertexColors: true,
            transparent: true,
            opacity: 1, // 불투명도
            depthWrite: false
        });

        const starSystem = new THREE.Points(particles, starMaterial);
        scene.add(starSystem);

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full min-h-screen" />;
};

export default HeroCamera;
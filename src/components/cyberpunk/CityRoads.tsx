interface CityRoadsProps {
  gridSize: number;
  blockSize: number;
  roadWidth: number;
}

const CityRoads = ({ gridSize, blockSize, roadWidth }: CityRoadsProps) => {
  const roadMaterial = (
    <meshStandardMaterial
      color="#1a1a1a"
      metalness={0.3}
      roughness={0.8}
      emissive="#0a0a0a"
      emissiveIntensity={0.1}
    />
  );

  const sidewalkMaterial = (
    <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.9} />
  );

  const roadMarkingMaterial = (
    <meshStandardMaterial
      color="#ffff00"
      emissive="#ffff00"
      emissiveIntensity={0.5}
      transparent
      opacity={0.8}
    />
  );

  const roads = [];
  const sidewalks = [];
  const markings = [];

  const totalSize = gridSize * (blockSize + roadWidth);
  const halfSize = totalSize / 2;

  // Create horizontal roads
  for (let i = 0; i <= gridSize; i++) {
    const z = i * (blockSize + roadWidth) - halfSize;

    // Main road
    roads.push(
      <mesh
        key={`road-h-${i}`}
        position={[0, 0.01, z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[totalSize, roadWidth]} />
        {roadMaterial}
      </mesh>,
    );

    // Road markings (dashed lines)
    for (let j = -gridSize; j < gridSize; j++) {
      const x = j * (blockSize + roadWidth);
      markings.push(
        <mesh
          key={`marking-h-${i}-${j}`}
          position={[x, 0.02, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[blockSize * 0.3, 0.2]} />
          {roadMarkingMaterial}
        </mesh>,
      );
    }

    // Sidewalks
    const sidewalkWidth = roadWidth * 0.2;
    sidewalks.push(
      <mesh
        key={`sidewalk-h-${i}-1`}
        position={[0, 0.02, z - roadWidth / 2 + sidewalkWidth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[totalSize, sidewalkWidth]} />
        {sidewalkMaterial}
      </mesh>,
      <mesh
        key={`sidewalk-h-${i}-2`}
        position={[0, 0.02, z + roadWidth / 2 - sidewalkWidth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[totalSize, sidewalkWidth]} />
        {sidewalkMaterial}
      </mesh>,
    );
  }

  // Create vertical roads
  for (let i = 0; i <= gridSize; i++) {
    const x = i * (blockSize + roadWidth) - halfSize;

    // Main road
    roads.push(
      <mesh
        key={`road-v-${i}`}
        position={[x, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roadWidth, totalSize]} />
        {roadMaterial}
      </mesh>,
    );

    // Road markings (dashed lines)
    for (let j = -gridSize; j < gridSize; j++) {
      const z = j * (blockSize + roadWidth);
      markings.push(
        <mesh
          key={`marking-v-${i}-${j}`}
          position={[x, 0.02, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.2, blockSize * 0.3]} />
          {roadMarkingMaterial}
        </mesh>,
      );
    }

    // Sidewalks
    const sidewalkWidth = roadWidth * 0.2;
    sidewalks.push(
      <mesh
        key={`sidewalk-v-${i}-1`}
        position={[x - roadWidth / 2 + sidewalkWidth / 2, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[sidewalkWidth, totalSize]} />
        {sidewalkMaterial}
      </mesh>,
      <mesh
        key={`sidewalk-v-${i}-2`}
        position={[x + roadWidth / 2 - sidewalkWidth / 2, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[sidewalkWidth, totalSize]} />
        {sidewalkMaterial}
      </mesh>,
    );
  }

  // Add neon street lights at intersections
  const streetLights = [];
  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      const x = i * (blockSize + roadWidth) - halfSize;
      const z = j * (blockSize + roadWidth) - halfSize;

      // Light pole
      streetLights.push(
        <group key={`light-${i}-${j}`} position={[x, 0, z]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 5, 8]} />
            <meshStandardMaterial
              color="#333333"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Light source */}
          <pointLight
            position={[0, 5, 0]}
            color="#00ffff"
            intensity={2}
            distance={15}
            castShadow
          />
          {/* Light fixture */}
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={2}
            />
          </mesh>
        </group>,
      );
    }
  }

  return (
    <group>
      {roads}
      {sidewalks}
      {markings}
      {streetLights}
    </group>
  );
};

export default CityRoads;

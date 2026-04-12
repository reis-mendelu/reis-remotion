import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";
import { Mascot } from "./Mascot";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

export const Scene: React.FC<{ action: string }> = ({ action }) => {
  const { width, height } = useVideoConfig();

  return (
    <ThreeCanvas width={width} height={height}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        
        <Mascot action={action} />
        
        <ContactShadows 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={10} 
          resolution={256} 
          color="#000000" 
        />
        <Environment preset="city" />
      </Suspense>
    </ThreeCanvas>
  );
};

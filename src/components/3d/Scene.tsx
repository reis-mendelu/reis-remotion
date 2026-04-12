import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";
import { Mascot } from "./Mascot";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

export const Scene: React.FC<{ action: string; themeColor?: string }> = ({ 
  action, 
  themeColor = "#79BE15" 
}) => {
  const { width, height } = useVideoConfig();

  return (
    <div className="absolute inset-0">
      {/* Background Gradient Glow */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 70%)`,
        }}
      />

      <ThreeCanvas width={width} height={height}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

          <Mascot />

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
    </div>
  );
};


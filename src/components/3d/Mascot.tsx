import { useRef } from "react";
import { Group } from "three";

export const Mascot: React.FC = () => {
  const group = useRef<Group>(null);
  
  return (
    <group ref={group} dispose={null}>
       {/* Placeholder: Visual representation of the mascot while the .gltf is missing */}
       <mesh position={[0, 0, 0]}>
         <sphereGeometry args={[1, 32, 32]} />
         <meshStandardMaterial color="#79BE15" />
       </mesh>
       {/* Eyes */}
       <mesh position={[0.4, 0.4, 0.8]}>
         <sphereGeometry args={[0.1, 16, 16]} />
         <meshStandardMaterial color="white" />
       </mesh>
       <mesh position={[-0.4, 0.4, 0.8]}>
         <sphereGeometry args={[0.1, 16, 16]} />
         <meshStandardMaterial color="white" />
       </mesh>
    </group>
  );
};

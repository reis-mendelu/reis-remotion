import React from "react";

interface BrandedCursorProps {
  x: number;
  y: number;
  isClicking?: boolean;
  isDragging?: boolean;
}

export const BrandedCursor: React.FC<BrandedCursorProps> = ({
  x,
  y,
  isClicking = false,
  isDragging = false,
}) => {
  // Scale down when clicking, but drive it programmatically
  // Note: We avoid CSS transitions here to ensure frame-accuracy in Remotion.
  const scale = isClicking ? 0.8 : 1.0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 1000,
        // The hotspot (tip of the arrow) is at 0,0
      }}
    >
      {/* Precision OS Pointer */}
      <div 
        style={{
           transform: `scale(${scale})`,
           filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
        }}
      >
        <svg 
           width="24" 
           height="24" 
           viewBox="0 0 24 24" 
           fill="none" 
           xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" 
            fill="white" 
            stroke="#79be15" 
            strokeWidth="2" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Subtle selection glow at the tip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          overflow: "visible"
        }}
      >
          <div
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#79be15",
              transform: "translate(-50%, -50%)",
              opacity: isDragging ? 0.4 : 0,
              boxShadow: "0 0 10px #79be15",
            }}
          />
      </div>
    </div>
  );
};

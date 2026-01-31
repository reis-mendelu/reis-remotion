import { z } from "zod";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { ProfilePopup } from "./ProfilePopup";
import { MendeluEnvironment } from "../../Environment";
import { Background } from "../Background";
import { SoundEffect } from "../SoundEffect";

export const SpolkyCompositionSchema = z.object({
  spolkyExpanded: z.boolean().default(true),
  // Comma separated IDs of subscribed societies
  subscribedIds: z.array(z.string()).default(["supef", "esn"]), 
});

export const SpolkyComposition: React.FC<z.infer<typeof SpolkyCompositionSchema>> = ({
  spolkyExpanded,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance Animation
  const entrance = spring({
    frame,
    fps,
    config: { damping: 20 },
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const y = interpolate(entrance, [0, 1], [20, 0]);

  // 3D Rotation (Slow idle drift)
  const rotX = interpolate(frame, [0, durationInFrames], [15, 5]);
  const rotY = interpolate(frame, [0, durationInFrames], [-20, -5]);

  // Focus Animation (Starts after expansion)
  // Expansion starts at frame 30 + duration ~20 = frame 50.
  // Let's start focus at frame 70.
  const FOCUS_START = 70;
  
  const focusProgress = spring({
    frame: frame - FOCUS_START,
    fps,
    config: { damping: 20, mass: 2 }, // Slower, heavier feel
  });

  // When focused, we zoom in slightly by scaling up and reducing perspective distance appearance
  // Or just translationZ
  const focusScale = interpolate(focusProgress, [0, 1], [1, 1.2]);
  const focusY = interpolate(focusProgress, [0, 1], [0, -40]); // Move up to center the list

  // Subscription Animation
  // ESN gets subscribed shortly after focus
  const SUB_FRAME = FOCUS_START + 20; // Frame 90
  
  // We manipulate the list based on frame to simulate the action
  const currentSubscribedIds = frame >= SUB_FRAME 
      ? ["supef", "esn"] 
      : ["supef"];

  // Highlight logic: Highlight ESN for 90 frames starting at SUB_FRAME (3s)
  const highlightId = (frame >= SUB_FRAME && frame < SUB_FRAME + 90) ? "esn" : undefined;

  // Lollapalooza Shadow
  const shadowDepth = interpolate(rotX, [-45, 45], [20, -20]);
  const shadowBlur = Math.abs(rotX) + Math.abs(rotY) + 20;

  return (
    <AbsoluteFill className="items-center justify-center" style={{ perspective: "1200px" }}>
      <Background preset="mendelu-dark" />
      
      {/* Entrance Swoosh */}
      <Sequence>
         <SoundEffect type="SWOOSH" volume={0.5} />
      </Sequence>
      
      {/* Subscription Tick */}
      <Sequence from={SUB_FRAME}>
         <SoundEffect type="TICK" volume={1} />
      </Sequence>
      
      {/* Focus Whoosh? Optional */}

      <MendeluEnvironment className="w-full h-full flex items-center justify-center">
        <div
            style={{
                opacity,
                transformStyle: "preserve-3d",
                transform: `
                    translateY(${y + focusY}px) 
                    scale(${scale * focusScale}) 
                    rotateX(${rotX}deg) 
                    rotateY(${rotY}deg)
                `,
                boxShadow: `
                  ${-rotY / 2}px ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,0.5),
                  0 0 40px rgba(0,0,0,0.2)
                `,
            }}
        >
            <ProfilePopup 
                spolkyExpanded={spolkyExpanded} 
                subscribedIds={currentSubscribedIds} 
                focusProgress={focusProgress}
                highlightId={highlightId}
            />
        </div>
      </MendeluEnvironment>
    </AbsoluteFill>
  );
};

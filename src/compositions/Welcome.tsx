import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { AbsoluteFill } from "remotion";

export const WelcomeSchema = z.object({
  title: z.string(),
  logoColor: zColor(),
});

export const WelcomeComposition: React.FC<z.infer<typeof WelcomeSchema>> = ({
  title,
  logoColor,
}) => {
  return (
    <AbsoluteFill className="bg-white items-center justify-center">
      <div
        style={{ color: logoColor }}
        className="text-8xl font-bold font-sans"
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { AbsoluteFill } from "remotion";

export const MyCompositionSchema = z.object({
  title: z.string(),
  logoColor: zColor(),
});

export const MyComposition: React.FC<z.infer<typeof MyCompositionSchema>> = ({
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

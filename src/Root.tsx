import "./index.css";
import { Composition } from "remotion";
import { MyComposition, MyCompositionSchema } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
        schema={MyCompositionSchema}
        defaultProps={{
          title: "Welcome to Remotion",
          logoColor: "#0b84f3",
        }}
      />
    </>
  );
};

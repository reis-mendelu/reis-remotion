import { Composition, Folder } from "remotion";
import { MyComposition, MyCompositionSchema, OutlookSyncComposition, OutlookSyncSchema } from "./Composition";
import { loadFont } from "@remotion/google-fonts/Inter";

loadFont();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Styleguide">
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
      </Folder>
      <Folder name="Component-Mocks">
        <Composition
          id="OutlookSyncToggle"
          component={OutlookSyncComposition}
          durationInFrames={30}
          fps={30}
          width={600}
          height={200}
          schema={OutlookSyncSchema}
          defaultProps={{
            enabled: true,
            loading: false,
            progress: 1,
            animate: false,
          }}
        />
      </Folder>
    </>
  );
};

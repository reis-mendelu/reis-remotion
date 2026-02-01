import { Composition, Folder } from "remotion";
import {
  OutlookSyncComposition,
  OutlookSyncSchema,
} from "./compositions/OutlookSync";
import { SpolkyComposition, SpolkyCompositionSchema } from "./components/Spolky/SpolkyComposition";
import { ReISIntroduction } from "./compositions/ReISIntroduction";
import { FilesHint } from "./compositions/SubjectDrawer/FilesHint";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Official-Sequences">
        <Composition
          id="ReIS-Intro"
          component={ReISIntroduction}
          durationInFrames={150} // 5 seconds
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SubjectDrawer-FilesHint"
          component={FilesHint}
          durationInFrames={200}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Component-Mocks">
        <Composition
          id="OutlookSyncPremium"
          component={OutlookSyncComposition}
          durationInFrames={250} 
          fps={30}
          width={600}
          height={300}
          schema={OutlookSyncSchema}
          defaultProps={{
            enabled: true,
            loading: true,
            showInfo: false,
            progress: 1,
            animate: true,
            rotationX: 0,
            rotationY: 0,
            depth: 0,
            syncStatus: "syncing",
            eventCount: 3,
            scale: 1,
            background: {
              type: "stars",
              starsCount: 300,
            },
          }}
        />
        <Composition
          id="OutlookSync3D"
          component={OutlookSyncComposition}
          durationInFrames={250} 
          fps={30}
          width={3840}
          height={2160}
          schema={OutlookSyncSchema}
          defaultProps={{
            enabled: true,
            loading: false,
            showInfo: false,
            progress: 1,
            animate: true,
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            syncStatus: "syncing",
            eventCount: 3,
            scale: 4, // 4K Upscaling
            background: {
              type: "stars",
              starsCount: 600,
            },
          }}
        />
      </Folder>

      <Folder name="Spolky-Animations">
        <Composition
          id="SpolkyExpanded"
          component={SpolkyComposition}
          durationInFrames={180}
          fps={30}
          width={1280}
          height={720}
          schema={SpolkyCompositionSchema}
          defaultProps={{
            spolkyExpanded: true,
            subscribedIds: ["supef", "esn"],
          }}
        />
      </Folder>
    </>
  );
};

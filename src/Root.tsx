import { Composition, Folder } from "remotion";
import {
  OutlookSyncComposition,
  OutlookSyncSchema,
} from "./compositions/OutlookSync";
import { SpolkyComposition, SpolkyCompositionSchema } from "./components/Spolky/SpolkyComposition";
import { ReISIntroduction } from "./compositions/ReISIntroduction";
import { SubjectDrawerComposition } from "./compositions/SubjectDrawer";
import { FilesHint } from "./compositions/SubjectDrawer/FilesHint";
import { SubjectDrawerSchema } from "./compositions/SubjectDrawer/schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Official-Sequences">
        <Composition
          id="ReIS-Intro"
          component={ReISIntroduction}
          durationInFrames={360} // 12 seconds
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
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Algoritmizace",
              code: "ALG",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
            },
            animate: true,
            background: { type: "stars", starsCount: 500 },
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            scale: 2,
          }}
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
        <Composition
          id="SubjectDrawerFiles"
          component={SubjectDrawerComposition}
          durationInFrames={120}
          fps={30}
          width={3840}
          height={2160}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Algoritmy a datové struktury",
              code: "ADS",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
              garant: "doc. Ing. Jan Novák, Ph.D.",
              vyucujici: [
                { name: "Ing. Petr Svoboda", roles: "Přednášející" },
                { name: "Mgr. Eva Černá", roles: "Cvičící" }
              ]
            },
            groups: [
              {
                name: "lektury",
                displayName: "Přednášky",
                files: [
                  { file_name: "01_Uvod_ADS.pdf", link: "l1", file_comment: "Základní pojmy a složitost" },
                  { file_name: "02_Trideni.pdf", link: "l2", file_comment: "QuickSort, MergeSort" },
                  { file_name: "03_Grafy.pdf", link: "l3", file_comment: "DFS, BFS, Dijkstra" }
                ]
              },
              {
                name: "cviceni",
                displayName: "Cvičení",
                files: [
                  { file_name: "Cviceni_01.zip", link: "c1", file_comment: "Implementace v C++" },
                  { file_name: "Cviceni_02.zip", link: "c2" }
                ]
              }
            ],
            activeTab: "files",
            background: { type: "stars", starsCount: 200 },
            animate: true,
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            scale: 4,
            scriptedSelection: true,
            selectedIds: ["l1", "l2"],
            downloadedIds: ["l1"],
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

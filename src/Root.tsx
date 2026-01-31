import { Composition, Folder, AbsoluteFill, Sequence } from "remotion";
import { WelcomeComposition, WelcomeSchema } from "./compositions/Welcome";
import {
  OutlookSyncComposition,
  OutlookSyncSchema,
} from "./compositions/OutlookSync";
import { SpolkyComposition, SpolkyCompositionSchema } from "./components/Spolky/SpolkyComposition";
import { ProfessionalText } from "./components/ProfessionalText";
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
      <Folder name="Styleguide">
        <Composition
          id="MyComp"
          component={WelcomeComposition}
          durationInFrames={60}
          fps={30}
          width={1280}
          height={720}
          schema={WelcomeSchema}
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
          durationInFrames={40} // Accelerated from 60
          fps={30}
          width={600}
          height={200}
          schema={OutlookSyncSchema}
          defaultProps={{
            enabled: true,
            loading: false,
            showInfo: false,
            progress: 1,
            animate: false,
            rotationX: 0,
            rotationY: 0,
            depth: 0,
            syncStatus: "pending",
            eventCount: 3,
            scale: 1,
            background: {
              type: "stars",
              starsCount: 150,
            },
          }}
        />
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
          width={1280}
          height={1000}
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
            progress: 1,
            animate: false,
            scale: 1,
            selectedIds: [],
            downloadedIds: [],
          }}
        />
        <Composition
          id="SubjectDrawerSyllabus"
          component={SubjectDrawerComposition}
          durationInFrames={60}
          fps={30}
          width={1280}
          height={1000}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Algoritmy a datové struktury",
              code: "ADS",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
              garant: "doc. Ing. Jan Novák, Ph.D."
            },
            activeTab: "syllabus",
            syllabus: {
              requirementsText: "Pro úspěšné absolvování předmětu je nutné získat zápočet ze cvičení a následně složit ústní zkoušku. Zápočet je udělen za vypracování tří semestrálních prací v celkové hodnotě 30 bodů (minimum 15 bodů).",
              requirementsTable: [
                { id: "A", label: "Výborně", points: "90 - 100 b." },
                { id: "B", label: "Velmi dobře", points: "80 - 89 b." },
                { id: "C", label: "Dobře", points: "70 - 79 b." },
                { id: "D", label: "Uspokojivě", points: "60 - 69 b." },
                { id: "E", label: "Dostatečně", points: "50 - 59 b." },
                { id: "F", label: "Nedostatečně", points: "0 - 49 b." }
              ]
            },
            background: { type: "stars", starsCount: 200 },
            groups: [],
            progress: 1,
            animate: false,
            scale: 1,
            selectedIds: [],
            downloadedIds: [],
          }}
        />
        <Composition
          id="SubjectDrawerStats"
          component={SubjectDrawerComposition}
          durationInFrames={120}
          fps={30}
          width={1280}
          height={1000}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Algoritmy a datové struktury",
              code: "ADS",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
              garant: "doc. Ing. Jan Novák, Ph.D."
            },
            activeTab: "stats",
            successRate: {
              stats: [
                {
                  semester: "Zima 2024",
                  totalPass: 145,
                  totalFail: 32,
                  type: "exam",
                  terms: [
                    {
                      grades: {
                        "A": 15,
                        "B": 25,
                        "C": 42,
                        "D": 38,
                        "E": 25,
                        "F": 28,
                        "FN": 4
                      }
                    }
                  ]
                }
              ]
            },
            background: { type: "stars", starsCount: 200 },
            groups: [],
            progress: 1,
            animate: false,
            scale: 1,
            selectedIds: [],
            downloadedIds: [],
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
      <Folder name="Showcase">
        <Composition
          id="KineticShowcase"
          component={OutlookSyncComposition}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
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
            eventCount: 5,
            scale: 2,
            background: {
              type: "stars",
              starsCount: 400,
            },
          }}
        />
        <Composition
          id="ProfessionalTextPresets"
          component={() => (
            <AbsoluteFill style={{ backgroundColor: "black", gap: "2em", padding: "4em" }}>
              <ProfessionalText text="*REIS* Isolated Hook" type="hook" />
              <ProfessionalText text="HEADLINE: *Cinematic* Motion" type="headline" />
              <ProfessionalText text="CONTEXT: High-energy SaaS demos" type="context" />
              <ProfessionalText text="BODY: Rapid rhythm prevents misery." type="body" />
            </AbsoluteFill>
          )}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CinematicRapidRhythm"
          component={() => (
            <AbsoluteFill style={{ backgroundColor: "black" }}>
              <Sequence from={0} durationInFrames={40}>
                <ProfessionalText text="re*IS*" type="hook" mode="typewriter" />
              </Sequence>
              <Sequence from={45} durationInFrames={60}>
                <ProfessionalText text="What is an *Artifact*?" type="headline" mode="typewriter" />
              </Sequence>
              <Sequence from={110}>
                <ProfessionalText text="Built-in animations." type="headline" mode="typewriter" />
              </Sequence>
            </AbsoluteFill>
          )}
          durationInFrames={200}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};

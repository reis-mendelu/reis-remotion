import { Composition, Folder, Still } from "remotion";
import { SubjectDrawerIntroduction } from "./compositions/SubjectDrawer/Introduction";
import { OutlookSyncIntroduction } from "./compositions/OutlookSync/Introduction";
import { FilesHint } from "./compositions/SubjectDrawer/FilesHint";
import { SubjectDrawerSchema } from "./compositions/SubjectDrawer/schema";
import { BrandedEndSlide } from "./compositions/BrandedEndSlide";
import { BrandedEndSlideSchema } from "./compositions/BrandedEndSlide/schema";
import { IntroPoster } from "./compositions/IntroPoster";
import { IntroPosterSchema } from "./compositions/IntroPoster/schema";
import { OutlookSyncHint } from "./components/OutlookSync/Hint";
import { SuccessRateHint } from "./compositions/SubjectDrawer/SuccessRateHint";
import { SuccessRateSequence } from "./compositions/SubjectDrawer/SuccessRateSequence";
import { SyllabusHint } from "./compositions/SubjectDrawer/SyllabusHint";
import { ClassmatesHint } from "./compositions/SubjectDrawer/ClassmatesHint";
import { FilesStaticHint } from "./compositions/SubjectDrawer/FilesStaticHint";
import { WeeklyCalendar } from "./components/reis/WeeklyCalendar";
import { SearchBarComposition } from "./compositions/SearchBar";
import { SearchBarSchema } from "./compositions/SearchBar/schema";
import { SearchBarIntroduction } from "./compositions/SearchBar/Introduction";
import { ReelSubjectDrawerFiles } from "./compositions/Reels/SubjectDrawerFiles";
import { ReelOutlookSync } from "./compositions/Reels/OutlookSync";
import { ReelSearchBarStats } from "./compositions/Reels/SearchBarStats";
import { ExamRegistrationComposition } from "./compositions/ExamRegistration/index";
import { ExamRegistrationSchema } from "./compositions/ExamRegistration/schema";
import { ReelExamRegistration } from "./compositions/Reels/ExamRegistration";
import { PRINT_SIZES } from "./constants/print";
import { DiningTableSequence } from "./compositions/DiningTable/Sequence";
import { DiningTableSchema } from "./compositions/DiningTable/schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Official-Sequences">
        <Composition
          id="SubjectDrawer-Intro"
          component={SubjectDrawerIntroduction}
          durationInFrames={465} // 15.5 seconds
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="OutlookSync-Intro"
          component={OutlookSyncIntroduction}
          durationInFrames={510} // 17 seconds
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SubjectDrawer-SuccessRate-Seq"
          component={SuccessRateSequence}
          durationInFrames={1074} // 17.9 seconds @ 60fps
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="SearchBar-Intro"
          component={SearchBarIntroduction}
          durationInFrames={710} // 23.7 seconds @ 30fps
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Building-Blocks">
        <Composition
          id="SubjectDrawer-FilesHint"
          component={FilesHint}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Statistika",
              code: "STA",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
            },
            groups: [
              {
                name: "ostatni",
                displayName: "OSTATNÍ",
                files: [
                  { file_name: "Cvičení 1", link: "c1" },
                  { file_name: "Cvičení 2", link: "c2" },
                  { file_name: "Harmonogram", link: "h1" },
                ],
              },
            ],
            animate: true,
            background: { type: "stars", starsCount: 500 },
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            scale: 2,
            activeTab: "files",
            activeSubTab: "all",
            progress: 1,
            selectedIds: [],
            downloadedIds: [],
            classmates: [],
            tabOffset: 0,
          }}
        />
        <Composition
          id="SubjectDrawer-FilesStatic"
          component={FilesStaticHint}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Statistika",
              code: "STA",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
              garant: "doc. Ing. Oldřich Trenz, Ph.D.",
              vyucujici: [
                { name: "doc. Dr. Ing. Jiří Rybička", roles: "přednášející" },
                { name: "doc. Ing. Oldřich Trenz, Ph.D.", roles: "garant" },
                { name: "Ing. Pavel Turčínek, Ph.D.", roles: "cvičící" }
              ]
            },
            groups: [
              {
                name: "ostatni",
                displayName: "OSTATNÍ",
                files: [
                  { file_name: "Cvičení 1", link: "c1" },
                  { file_name: "Cvičení 2", link: "c2" },
                  { file_name: "Harmonogram", link: "h1" },
                  { file_name: "Přednáška 1", link: "p1" },
                  { file_name: "Přednáška 2", link: "p2" }
                ],
              },
            ],
            animate: true,
            background: { type: "stars", starsCount: 500 },
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            scale: 2,
            activeTab: "files",
            activeSubTab: "all",
            progress: 1,
            selectedIds: [],
            downloadedIds: [],
            classmates: [],
            tabOffset: 0,
          }}
        />
        <Composition
          id="OutlookSync-Hint"
          component={OutlookSyncHint}
          durationInFrames={240}
          fps={60}
          width={1920}
          height={1080}
          defaultProps={{
            scale: 2,
          }}
        />
        <Composition
          id="SubjectDrawer-SuccessRate"
          component={SuccessRateHint}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Statistika",
              code: "STA",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
            },
            scale: 2,
            animate: true,
            background: { type: "stars", starsCount: 500 },
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            groups: [],
            activeTab: "stats",
            activeSubTab: "all",
            progress: 1,
            selectedIds: [],
            downloadedIds: [],
            classmates: [],
            tabOffset: 0,
          }}
        />
        <Composition
          id="SubjectDrawer-SyllabusHint"
          component={SyllabusHint}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Statistika",
              code: "STA",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
            },
            groups: [],
            scale: 2,
            animate: true,
            background: { type: "stars", starsCount: 500 },
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            activeTab: "syllabus",
            activeSubTab: "all",
            progress: 1,
            selectedIds: [],
            downloadedIds: [],
            classmates: [],
            tabOffset: 0,
          }}
        />
        <Composition
          id="SubjectDrawer-ClassmatesHint"
          component={ClassmatesHint}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
          schema={SubjectDrawerSchema}
          defaultProps={{
            subject: {
              name: "Statistika",
              code: "STA",
              credits: "6 KREDITŮ",
              status: "POVINNÝ",
              completion: "Zkouška",
            },
            groups: [],
            scale: 2,
            animate: true,
            background: { type: "stars", starsCount: 500 },
            rotationX: 25,
            rotationY: -15,
            depth: 50,
            activeTab: "classmates",
            activeSubTab: "all",
            progress: 1,
            selectedIds: [],
            downloadedIds: [],
            classmates: [],
            tabOffset: 0,
          }}
        />
        <Composition
          id="DiningTable-Hint"
          component={DiningTableSequence}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
          schema={DiningTableSchema}
          defaultProps={{
            scale: 2,
            animate: true,
            date: 26,
            dayName: "Čtvrtek",
            activeTab: "X",
            menus: {
              X: [
                "Zeleninová polévka s vločkami",
                "Kuřecí steak 120g",
                "Vepřový kotlet Texas",
                "Zeleninové rizoto s vepřovým masem 80g",
                "Pečená paprika plněná polentou se suš.rajčaty",
                "Kuřecí závitek s houbovou nádivkou",
                "Grilovaná dýně s paprikou a houbami Shii-take",
              ],
              KA: [
                "Kuřecí vývar s nudlemi",
                "Kuřecí řízek se špenátovým salátem",
              ],
              JAK: [
                "Zeleninový vývar",
                "Zapečená brokolice s vejci",
              ],
            },
          }}
        />
        <Composition
          id="ExamRegistration-Hint"
          component={ExamRegistrationComposition}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
          schema={ExamRegistrationSchema}
          defaultProps={{ scale: 2, animate: true }}
        />
        <Composition
          id="WeeklyCalendar"
          component={WeeklyCalendar}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SearchBar"
          component={SearchBarComposition}
          durationInFrames={260}
          fps={30}
          width={1920}
          height={1080}
          schema={SearchBarSchema}
          defaultProps={{
            query: "podnikova ekonomi",
            results: [
              { id: "1", title: "Podniková ekonomika", type: "subject", detail: "D-PODEK · ZF", subjectCode: "D-PODEK" },
              { id: "2", title: "Podniková ekonomika", type: "subject", detail: "EKO · ZS 2025/2026 · AF", subjectCode: "EKO" },
              { id: "3", title: "Podniková ekonomika", type: "subject", detail: "RRPEK · LS 2025/2026 · FRRMS", subjectCode: "RRPEK" },
              { id: "4", title: "Podniková ekonomika", type: "subject", detail: "EKO · LS 2025/2026 · AF", subjectCode: "EKO" },
              { id: "5", title: "Podniková ekonomika 1", type: "subject", detail: "EBC-PE · ZS 2025/2026 · PEF", subjectCode: "EBC-PE" },
            ],
            selectedResultIndex: 4,
            background: { type: "stars", starsCount: 500 },
            scale: 2,
          }}
        />
        <Composition
          id="End-Slide"
          component={BrandedEndSlide}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={BrandedEndSlideSchema}
          defaultProps={{
            logoScale: 1.5,
            theme: "dark",
            animate: true,
            ctaText: "Link v biu",
          }}
        />
      </Folder>

      <Folder name="Instagram-Reels">
        <Composition
          id="Reel-SubjectDrawer-Files"
          component={ReelSubjectDrawerFiles}
          durationInFrames={330}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Reel-OutlookSync"
          component={ReelOutlookSync}
          durationInFrames={299}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Reel-SearchBar-Stats"
          component={ReelSearchBarStats}
          durationInFrames={455}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Reel-ExamRegistration"
          component={ReelExamRegistration}
          durationInFrames={310}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="Posters">
        <Still
          id="Intro-Poster-A4"
          component={IntroPoster}
          width={PRINT_SIZES.A4.width}
          height={PRINT_SIZES.A4.height}
          schema={IntroPosterSchema}
          defaultProps={{
            title: "*MODERNÍ* *RE*IS",
            subtitle: "Všechny studijní materiály na dosah ruky.",
            showGuides: true,
          }}
        />
        <Still
          id="Intro-Poster-A6"
          component={IntroPoster}
          width={PRINT_SIZES.A6.width}
          height={PRINT_SIZES.A6.height}
          schema={IntroPosterSchema}
          defaultProps={{
            title: "*MODERNÍ* *RE*IS",
            subtitle: "Všechny studijní materiály na dosah ruky.",
            showGuides: true,
          }}
        />
      </Folder>
    </>
  );
};

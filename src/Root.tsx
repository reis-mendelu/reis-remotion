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
import { WeeklyCalendar } from "./components/reis/WeeklyCalendar";
import { PRINT_SIZES } from "./constants/print";

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
          durationInFrames={465} // 15.5 seconds
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
          }}
        />
        <Composition
          id="OutlookSync-Hint"
          component={OutlookSyncHint}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            scale: 2,
          }}
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

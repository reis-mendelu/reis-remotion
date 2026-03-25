import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Background } from "../../components/Background";
import { DayHeader } from "../../components/DiningTable/DayHeader";
import { MenuPanel } from "../../components/DiningTable/MenuPanel";
import type { DiningTableProps } from "./schema";
import type { BlockLesson } from "../../components/reis/types";

// --- TIMELINE (210 frames @ 30fps = 7s) ---
// 0–25:    Day header (calendar) springs in
// 25–34:   Pause (0.3s delay, reduced by 0.2s as requested)
// 34–54:   Chef hat icon pulses (simulated tap)
// 49–210:  Menu panel springs in then stays

const PULSE_START = 34;
const PULSE_END = 54;
const PANEL_START = 49;

// PEF MENDELU — generic Thursday subjects
const MOCK_LESSONS: BlockLesson[] = [
  {
    id: "mng",
    date: "20260326",
    startTime: "07:00",
    endTime: "08:50",
    courseName: "Marketing 1",
    courseCode: "MKT",
    courseId: "1",
    room: "Q42",
    roomStructured: { name: "Q42", id: "1" },
    teachers: [{ fullName: "doc. Ing. Jana Nováková, Ph.D.", shortName: "JN", id: "1" }],
    periodId: "1",
    studyId: "1",
    campus: "Q",
    isDefaultCampus: "true",
    facultyCode: "PEF",
    isSeminar: "false",
    isConsultation: "false",
  },
  {
    id: "ndane",
    date: "20260326",
    startTime: "11:00",
    endTime: "12:50",
    courseName: "Statistika",
    courseCode: "STA",
    courseId: "2",
    room: "Q02",
    roomStructured: { name: "Q02", id: "2" },
    teachers: [{ fullName: "Ing. Petr Dvořák, Ph.D.", shortName: "PD", id: "2" }],
    periodId: "1",
    studyId: "1",
    campus: "Q",
    isDefaultCampus: "true",
    facultyCode: "PEF",
    isSeminar: "false",
    isConsultation: "false",
  },
  {
    id: "obchp",
    date: "20260326",
    startTime: "13:00",
    endTime: "14:50",
    courseName: "Management",
    courseCode: "MGT",
    courseId: "3",
    room: "Q01",
    roomStructured: { name: "Q01", id: "3" },
    teachers: [{ fullName: "JUDr. Lucie Marková", shortName: "LM", id: "3" }],
    periodId: "1",
    studyId: "1",
    campus: "Q",
    isDefaultCampus: "true",
    facultyCode: "PEF",
    isSeminar: "false",
    isConsultation: "false",
  },
  {
    id: "podfinance",
    date: "20260326",
    startTime: "15:00",
    endTime: "16:50",
    courseName: "Makroekonomie",
    courseCode: "MAK",
    courseId: "4",
    room: "Q01",
    roomStructured: { name: "Q01", id: "4" },
    teachers: [{ fullName: "prof. Ing. Karel Svoboda, CSc.", shortName: "KS", id: "4" }],
    periodId: "1",
    studyId: "1",
    campus: "Q",
    isDefaultCampus: "true",
    facultyCode: "PEF",
    isSeminar: "false",
    isConsultation: "false",
  },
];

export const DiningTableComposition: React.FC<DiningTableProps> = ({
  scale = 2,
  animate = true,
  date,
  dayName,
  activeTab = "X",
  menus,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isIconPulsing = frame >= PULSE_START && frame < PULSE_END;
  const showPanel = frame >= PANEL_START;

  const sceneSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.7 },
    durationInFrames: 25,
  });
  const sceneOpacity = animate ? sceneSpring : 1;

  const items = menus[activeTab as keyof typeof menus] ?? [];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0c10" }}>
      <Background type="stars" starsCount={500} />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            opacity: sceneOpacity,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          {/* Calendar day card with chef hat + lesson events */}
          <DayHeader
            date={date}
            dayName={dayName}
            iconPulse={isIconPulsing}
            animate={animate}
            lessons={MOCK_LESSONS}
            startHour={7}
            endHour={17}
          />

          {/* Jídelníček panel, right of the header, aligned at the top */}
          {showPanel && (
            <div
              style={{
                position: "absolute",
                left: 186,
                top: 0,
                zIndex: 10,
              }}
            >
              <MenuPanel
                tabs={["X", "KA", "JAK"]}
                activeTab={activeTab}
                items={items}
                startFrame={PANEL_START}
                animate={animate}
              />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

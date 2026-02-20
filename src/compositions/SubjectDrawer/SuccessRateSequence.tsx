import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { ProfessionalText } from "../../components/ProfessionalText";
import { Background } from "../../components/Background";
import { BrandedEndSlide } from "../BrandedEndSlide";
import { SubjectDrawerComposition } from "./index";
import { SoundEffect } from "../../components/SoundEffect";

/**
 * SuccessRateSequence: Highlights the core subject features in a sequential showcase
 */
export const SuccessRateSequence: React.FC = () => {
    const frame = useCurrentFrame();

    // ============================================================================
    // TIMELINE: 16.9 seconds @ 60fps = 1014 frames
    // ============================================================================

    // INTRO (0-4.9s)
    const INTRO_LIST_DURATION = 174; // 2.9s (+0.9s)
    const INTRO_QUESTION_START = INTRO_LIST_DURATION;
    const INTRO_QUESTION_DURATION = 120; // 2s

    // FEATURE SHOWCASE (4.9s - 15.9s)
    const SHOWCASE_START = INTRO_QUESTION_START + INTRO_QUESTION_DURATION;
    const SHOWCASE_DURATION = 660; // +60 frames

    // Internal timing within showcase
    const showcaseFrame = frame - SHOWCASE_START;

    // FEATURE 1: Files (2.1s)
    const FEAT_FILES_DURATION = 126;
    // FEATURE 2: Syllabus (1.9s)
    const FEAT_SYLLABUS_DURATION = 114;
    // FEATURE 3: Success Rate (3s)
    const FEAT_SUCCESS_DURATION = 180;
    // FEATURE 4: Classmates (4s)
    const FEAT_CLASSMATES_DURATION = 240; // +60 frames (1s)

    // OUTRO (14.9s - 16.9s)
    const OUTRO_START = SHOWCASE_START + SHOWCASE_DURATION;
    const OUTRO_DURATION = 120;

    // ============================================================================
    // DYNAMIC ORCHESTRATOR DATA
    // ============================================================================

    const props = useMemo(() => {
        const subject = {
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
        };

        // Default props
        let activeTab: 'files' | 'syllabus' | 'stats' | 'classmates' = 'files';
        let groups: any[] = [];
        let syllabus: any = null;
        let successRate: any = null;
        let classmates: any[] = [];
        let activeSubTab: 'all' | 'exercise' = 'all';
        let selectedIds: string[] = [];
        let downloadedIds: string[] = [];
        let downloadProgress: Record<string, number> = {};
        let buttonState: any = 'hidden';
        let isDone = false;

        const FEAT_SYLLABUS_START = FEAT_FILES_DURATION;
        const FEAT_SUCCESS_START = FEAT_SYLLABUS_START + FEAT_SYLLABUS_DURATION;
        const FEAT_CLASSMATES_START = FEAT_SUCCESS_START + FEAT_SUCCESS_DURATION;

        let tabOffset = 0;

        if (showcaseFrame >= 0 && showcaseFrame < FEAT_FILES_DURATION) {
            // FILES TAB DATA (0-90f) - STATIC STATE
            activeTab = "files";
            tabOffset = 0;
            const files = [
                { file_name: "Cvičení 1", link: "c1" },
                { file_name: "Cvičení 2", link: "c2" },
                { file_name: "Harmonogram", link: "h1" },
                { file_name: "Přednáška 1", link: "p1" },
                { file_name: "Přednáška 2", link: "p2" }
            ];
            groups = [{ name: "ostatni", displayName: "OSTATNÍ", files }];

            // Static state: No selection, no button, no download
            selectedIds = [];
            buttonState = 'hidden';
            downloadProgress = {};
            downloadedIds = [];
            isDone = false;
        }
        else if (showcaseFrame >= FEAT_SYLLABUS_START && showcaseFrame < FEAT_SUCCESS_START) {
            // SYLLABUS TAB DATA (90-150f)
            activeTab = "syllabus";
            tabOffset = FEAT_SYLLABUS_START;
            syllabus = {
                requirementsText: "Podmínkou pro úspěšné složení zkoušky je úspěšné vykonání zápočtu. Maximální počet bodů 40. Minimální počet bodů pro úspěšné vykonání zápočtu 20. Zkouška je písemná. Minimální počet bodů pro úspěšné vykonání zkoušky 30. Maximální počet bodů 60.",
                requirementsTable: [
                    { id: "Z", label: "Absolvování průběžného testu", points: "40 %" },
                    { id: "ZK", label: "Absolvování závěrečného testu", points: "60 %" },
                ],
            };
        }
        else if (showcaseFrame >= FEAT_SUCCESS_START && showcaseFrame < FEAT_CLASSMATES_START) {
            // SUCCESS RATE TAB DATA (150-240f)
            activeTab = "stats";
            tabOffset = FEAT_SUCCESS_START;
            successRate = {
                stats: [
                    { semester: "LS 24/25", totalPass: 269, totalFail: 7, type: "exam", terms: [{ grades: { "A": 42, "B": 84, "C": 96, "D": 41, "E": 6, "F": 0, "FN": 7 } }] },
                    { semester: "LS 23/24", totalPass: 100, totalFail: 0, type: "exam", terms: [] },
                    { semester: "LS 22/23", totalPass: 96, totalFail: 4, type: "exam", terms: [] },
                    { semester: "LS 21/22", totalPass: 94, totalFail: 6, type: "exam", terms: [] },
                    { semester: "LS 20/21", totalPass: 98, totalFail: 2, type: "exam", terms: [] },
                ]
            };
        }
        else if (showcaseFrame >= FEAT_CLASSMATES_START) {
            // CLASSMATES TAB DATA (240-330f)
            activeTab = "classmates";
            tabOffset = FEAT_CLASSMATES_START;
            const relFrame = showcaseFrame - FEAT_CLASSMATES_START;
            // Switch tab at 1s more than before (now 105f = 1.75s)
            const isExercise = relFrame >= 105;
            activeSubTab = isExercise ? 'exercise' : 'all';

            const allClassmates = [
                { name: "Jan Novák", degree: "PEF B-F prez", semester: "sem 4", year: "roč 2", hasMessage: false },
                { name: "Jana Svobodová", degree: "PEF B-F prez", semester: "sem 4", year: "roč 2", hasMessage: false },
                { name: "Petr Černý", degree: "PEF B-F prez", semester: "sem 4", year: "roč 2", hasMessage: false },
                { name: "Marie Veselá", degree: "PEF B-F prez", semester: "sem 4", year: "roč 2", hasMessage: false },
                { name: "Jiří Dvořák", degree: "PEF B-FS prez", semester: "sem 4", year: "roč 2", hasMessage: false },
                { name: "Kateřina Jelínková", degree: "PEF B-FS prez", semester: "sem 4", year: "roč 2", hasMessage: false },
            ];
            const exerciseClassmates = [
                { name: "Lukáš Kovář", degree: "PEF B-F prez", semester: "sem 4", year: "roč 2", hasMessage: false },
                { name: "Veronika Blažková", degree: "PEF B-F prez", semester: "sem 4", year: "roč 2", hasMessage: false },
                { name: "Tomáš Marek", degree: "PEF B-F prez", semester: "sem 4", year: "roč 2", hasMessage: false },
            ];
            classmates = isExercise ? exerciseClassmates : allClassmates;
        }

        return {
            subject,
            activeTab,
            groups,
            syllabus,
            successRate,
            classmates,
            activeSubTab,
            selectedIds,
            downloadedIds,
            downloadProgress,
            buttonState,
            isDone,
            progress: 1,
            animate: true,
            tabOffset, // Passed to reset frame
            scale: 1.8,
            rotationX: 15,
            rotationY: -10,
            depth: 30
        };
    }, [showcaseFrame, FEAT_FILES_DURATION, FEAT_SYLLABUS_DURATION, FEAT_SUCCESS_DURATION, FEAT_CLASSMATES_DURATION]);

    return (
        <AbsoluteFill className="bg-[#0a0c10]">
            <Background type="stars" starsCount={500} />

            <AbsoluteFill>
                {/* ACT 1: Intro List */}
                <Sequence from={0} durationInFrames={INTRO_LIST_DURATION}>
                    <AbsoluteFill className="items-center justify-center">
                        <ProfessionalText
                            text="Soubory. Požadavky. Úspěšnost. Spolužáci."
                            type="problem"
                            mode="refined"
                        />
                    </AbsoluteFill>
                </Sequence>

                {/* ACT 2: Intro Question */}
                <Sequence from={INTRO_QUESTION_START} durationInFrames={INTRO_QUESTION_DURATION}>
                    <AbsoluteFill className="items-center justify-center">
                        <ProfessionalText
                            text="Co kdyby bylo všechno na jednom místě?"
                            type="question"
                            mode="refined"
                        />
                    </AbsoluteFill>
                </Sequence>

                {/* FEATURE SHOWCASE: Stable shell, dynamic contents */}
                <Sequence from={SHOWCASE_START} durationInFrames={SHOWCASE_DURATION}>
                    <SubjectDrawerComposition {...props} />

                    {/* Audio: Tab Switches (Transitions) */}
                    <Sequence from={126}><SoundEffect type="TOGGLE_ON" volume={0.2} /></Sequence>
                    <Sequence from={240}><SoundEffect type="TOGGLE_ON" volume={0.2} /></Sequence>
                    <Sequence from={420}><SoundEffect type="TOGGLE_ON" volume={0.2} /></Sequence>

                    {/* Audio: Classmates Tab switch (internal) */}
                    <Sequence from={420 + 105}><SoundEffect type="TOGGLE_ON" volume={0.3} /></Sequence>
                </Sequence>

                {/* OUTRO: Brand + CTA */}
                <Sequence from={OUTRO_START} durationInFrames={OUTRO_DURATION}>
                    <BrandedEndSlide
                        logoScale={1.5}
                        theme="dark"
                        animate={true}
                        ctaText="Link v biu"
                    />
                </Sequence>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

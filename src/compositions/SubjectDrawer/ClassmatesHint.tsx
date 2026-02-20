import React from "react";
import { useCurrentFrame } from "remotion";
import { SubjectDrawerComposition } from "./index";
import { type SubjectDrawerProps } from "./schema";

export const ClassmatesHint: React.FC<SubjectDrawerProps> = (props) => {
    const frame = useCurrentFrame();

    // ORCHESTRATION: 
    // 0s - 2s (0-60 frames): "Všichni" tab
    // 2s - 2.3s (60-69 frames): Click effect
    // 2.3s - completion: "Cvičení" tab

    const isExerciseTab = frame >= 60;
    const activeSubTab: 'all' | 'exercise' = isExerciseTab ? 'exercise' : 'all';

    const subject = {
        name: "Statistika",
        code: "STA",
        credits: "6 KREDITŮ",
        status: "POVINNÝ",
        completion: "Zkouška",
    };

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

    const currentClassmates = isExerciseTab ? exerciseClassmates : allClassmates;

    return (
        <SubjectDrawerComposition
            {...props}
            subject={subject}
            classmates={currentClassmates}
            activeTab="classmates"
            activeSubTab={activeSubTab}
        />
    );
};

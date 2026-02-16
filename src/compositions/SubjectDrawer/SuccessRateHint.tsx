import React from "react";
import { SubjectDrawerComposition } from "./index";
import { type SubjectDrawerProps } from "./schema";

export const SuccessRateHint: React.FC<SubjectDrawerProps> = (props) => {

    const subject = {
        name: "Statistika",
        code: "STA",
        credits: "6 KREDITŮ",
        status: "POVINNÝ",
        completion: "Zkouška",
    };

    const successRate = {
        stats: [
            {
                semester: "LS 24/25",
                totalPass: 269, // 97% of 276
                totalFail: 7,
                type: "exam" as const,
                terms: [
                    {
                        grades: {
                            "A": 42,
                            "B": 84,
                            "C": 96,
                            "D": 41,
                            "E": 6,
                            "F": 0,
                            "FN": 7
                        }
                    }
                ]
            },
            {
                semester: "LS 23/24",
                totalPass: 100,
                totalFail: 0,
                type: "exam" as const,
                terms: []
            },
            {
                semester: "LS 22/23",
                totalPass: 96,
                totalFail: 4,
                type: "exam" as const,
                terms: []
            },
            {
                semester: "LS 21/22",
                totalPass: 97,
                totalFail: 3,
                type: "exam" as const,
                terms: []
            },
            {
                semester: "LS 20/21",
                totalPass: 96,
                totalFail: 4,
                type: "exam" as const,
                terms: []
            }
        ]
    };

    // Entrance and stay animation logic
    const animate = props.animate ?? true;

    return (
        <SubjectDrawerComposition
            {...props}
            subject={subject}
            successRate={successRate}
            activeTab="stats"
            animate={animate}
        />
    );
};

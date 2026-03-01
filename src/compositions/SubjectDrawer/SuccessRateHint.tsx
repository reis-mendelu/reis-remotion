import React from "react";
import { SubjectDrawerComposition } from "./index";
import { type SubjectDrawerProps } from "./schema";

export const SuccessRateHint: React.FC<SubjectDrawerProps> = (props) => {

    const subject = {
        name: "Podniková ekonomika",
        code: "EBC-PE",
        credits: "6 KREDITŮ",
        status: "POVINNÝ",
        completion: "Zkouška",
    };

    const successRate = {
        stats: [
            {
                semester: "ZS 25/26",
                totalPass: 651,
                totalFail: 195,
                type: "exam" as const,
                terms: [
                    {
                        grades: {
                            "A": 51,
                            "B": 80,
                            "C": 174,
                            "D": 183,
                            "E": 163,
                            "F": 32,
                            "FN": 163
                        }
                    }
                ]
            },
            {
                semester: "ZS 24/25",
                totalPass: 528,
                totalFail: 194,
                type: "exam" as const,
                terms: [
                    {
                        grades: {
                            "A": 40,
                            "B": 59,
                            "C": 114,
                            "D": 117,
                            "E": 198,
                            "F": 50,
                            "FN": 144
                        }
                    }
                ]
            },
            {
                semester: "ZS 23/24",
                totalPass: 460,
                totalFail: 279,
                type: "exam" as const,
                terms: [
                    {
                        grades: {
                            "A": 28,
                            "B": 44,
                            "C": 102,
                            "D": 109,
                            "E": 177,
                            "F": 71,
                            "FN": 208
                        }
                    }
                ]
            },
            {
                semester: "LS 24/25",
                totalPass: 21,
                totalFail: 3,
                type: "exam" as const,
                terms: [
                    {
                        grades: {
                            "A": 0,
                            "B": 0,
                            "C": 2,
                            "D": 1,
                            "E": 18,
                            "F": 0,
                            "FN": 3
                        }
                    }
                ]
            },
            {
                semester: "LS 23/24",
                totalPass: 25,
                totalFail: 4,
                type: "exam" as const,
                terms: [
                    {
                        grades: {
                            "A": 0,
                            "B": 2,
                            "C": 4,
                            "D": 6,
                            "E": 13,
                            "F": 0,
                            "FN": 4
                        }
                    }
                ]
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

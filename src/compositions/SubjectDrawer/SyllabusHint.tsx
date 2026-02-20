import React from "react";
import { SubjectDrawerComposition } from "./index";
import { type SubjectDrawerProps } from "./schema";

export const SyllabusHint: React.FC<SubjectDrawerProps> = (props) => {
    const subject = {
        name: "Finanční účetnictví",
        code: "FU",
        credits: "6 KREDITŮ",
        status: "POVINNÝ",
        completion: "Zkouška",
    };

    const syllabus = {
        requirementsText: "Podmínkou pro úspěšné složení zkoušky je úspěšné vykonání zápočtu. Maximální počet bodů 40. Minimální počet bodů pro úspěšné vykonání zápočtu 20. Zkouška je písemná. Minimální počet bodů pro úspěšné vykonání zkoušky 30. Maximální počet bodů 60. Délka trvání zkoušky je 90 minut.",
        requirementsTable: [
            { id: "Z", label: "Absolvování průběžného testu (testů)", points: "40 %" },
            { id: "ZK", label: "Absolvování závěrečného testu", points: "60 %" },
        ],
    };

    return (
        <SubjectDrawerComposition
            {...props}
            subject={subject}
            syllabus={syllabus}
            activeTab="syllabus"
        />
    );
};

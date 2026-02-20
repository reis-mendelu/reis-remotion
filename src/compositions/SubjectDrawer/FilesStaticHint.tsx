import React from "react";
import { SubjectDrawerComposition } from "./index";
import { type SubjectDrawerProps } from "./schema";

/**
 * FilesStaticHint: A building block that shows the initial entrance animation 
 * and then stays in a static "Soubory" state matching the reference image.
 */
export const FilesStaticHint: React.FC<SubjectDrawerProps> = (props) => {
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

    const files = [
        { file_name: "Cvičení 1", link: "c1" },
        { file_name: "Cvičení 2", link: "c2" },
        { file_name: "Harmonogram", link: "h1" },
        { file_name: "Přednáška 1", link: "p1" },
        { file_name: "Přednáška 2", link: "p2" }
    ];

    const groups = [{ name: "ostatni", displayName: "OSTATNÍ", files }];

    return (
        <SubjectDrawerComposition
            {...props}
            subject={subject}
            groups={groups}
            activeTab="files"
            selectedIds={[]}
            downloadedIds={[]}
            buttonState="hidden"
            isDone={false}
            animate={true}
            tabOffset={0}
            scale={2}
            rotationX={25}
            rotationY={-15}
            depth={50}
        />
    );
};

import React from "react";
import { z } from "zod";
import { PrintWrapper } from "../../components/Print/PrintWrapper";
import { PosterLayout } from "../../components/Print/PosterLayout";
import { IntroPosterSchema } from "./schema";

export const IntroPoster: React.FC<z.infer<typeof IntroPosterSchema>> = ({
  title,
  subtitle,
  showGuides = false,
}) => {
  return (
    <PrintWrapper showGuides={showGuides}>
      <PosterLayout 
        title={title}
        subtitle={subtitle}
        date="ÚNOR 2026"
        location="PROVOZNĚ EKONOMICKÁ FAKULTA"
        ctaText="*RE*IS *PRO* *STUDENTY*"
      />
    </PrintWrapper>
  );
};

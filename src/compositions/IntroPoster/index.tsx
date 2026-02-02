import React from "react";
import { PrintWrapper } from "../../components/Print/PrintWrapper";
import { PosterLayout } from "../../components/Print/PosterLayout";

interface IntroPosterProps {
  title: string;
  subtitle?: string;
  showGuides?: boolean;
}

export const IntroPoster: React.FC<IntroPosterProps> = ({
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

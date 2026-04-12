import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { SearchBarComposition } from "../../compositions/SearchBar/index";
import { ActionProps } from "../../schemas/director";

export const SearchBarScene: React.FC<NonNullable<ActionProps['searchProps']>> = ({ 
  query, 
  selectedResultIndex,
  results = []
}) => {
  const displayResults = useMemo(() => {
    if (results.length > 0) return results;
    // Fallback if no results provided
    return [
      { id: "1", title: query, type: "subject", detail: "D-PODEK · ZF", subjectCode: "D-PODEK" },
      { id: "2", title: query, type: "subject", detail: "EKO · ZS 2025/2026 · AF", subjectCode: "EKO" },
      { id: "3", title: query, type: "subject", detail: "RRPEK · LS 2025/2026 · FRRMS", subjectCode: "RRPEK" },
      { id: "4", title: query, type: "subject", detail: "EKO · LS 2025/2026 · AF", subjectCode: "EKO" },
      { id: "5", title: query, type: "subject", detail: "EBC-PE · ZS 2025/2026 · PEF", subjectCode: "EBC-PE" },
    ];
  }, [results, query]);

  return (
    <AbsoluteFill className="flex items-center justify-center">
      <SearchBarComposition
        query={query}
        results={displayResults}
        selectedResultIndex={selectedResultIndex}
        scale={1.8}
      />
    </AbsoluteFill>
  );
};

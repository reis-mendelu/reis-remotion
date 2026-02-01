import React from "react";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: interFont } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export type TextType = "hook" | "context" | "headline" | "body" | "problem" | "question" | "cta" | "subtext";

export interface PresetStyle extends React.CSSProperties {
  fontSize: number;
}

export const PRESETS: Record<TextType, PresetStyle> = {
  hook: {
    fontSize: 120,
    fontWeight: 500,
    lineHeight: 1,
    color: "#FFFFFF",
    letterSpacing: "-0.01em",
    fontFamily: interFont,
  },
  context: {
    fontSize: 42,
    fontWeight: 400,
    lineHeight: 1.25,
    color: "#E0E0E0",
    letterSpacing: "0.01em",
    fontFamily: interFont,
  },
  headline: {
    fontSize: 80,
    fontWeight: 400,
    lineHeight: 1.1,
    color: "#FFFFFF",
    letterSpacing: "0.01em",
    fontFamily: interFont,
  },
  body: {
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#D0D0D0",
    letterSpacing: "0.01em",
    fontFamily: interFont,
  },
  problem: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 1.3,
    color: "#F8FAFC",
    letterSpacing: "0.01em",
    fontFamily: interFont,
  },
  question: {
    fontSize: 56,
    fontWeight: 600,
    lineHeight: 1.2,
    color: "#FFFFFF",
    letterSpacing: "0.005em",
    fontFamily: interFont,
  },
  cta: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.3,
    color: "#79be15",
    letterSpacing: "0.01em",
    fontFamily: interFont,
  },
  subtext: {
    fontSize: 36,
    fontWeight: 500,
    lineHeight: 1.4,
    color: "#CBD5E1",
    letterSpacing: "0.01em",
    fontFamily: interFont,
  },
} as const;

/**
 * PRINT CONSTANTS (300 DPI)
 * Math: (mm / 25.4) * 300 = pixels
 */

export const DPI = 300;

export const MM_TO_PX = (mm: number) => Math.round((mm / 25.4) * DPI);

export const PRINT_SIZES = {
  A4: {
    width: 2480, // 210mm
    height: 3508, // 297mm
    label: "A4",
  },
  A6: {
    width: 1240, // 105mm
    height: 1748, // 148mm
    label: "A6",
  },
} as const;

export const PRINT_MARGINS = {
  BLEED_MM: 3,
  SAFE_ZONE_MM: 5,
};

export const COLORS = {
  BRAND: "#79be15",
  SUCCESS: "#10b981",
  ERROR: "#ef4444",
  DARK: "#111111",
  LIGHT: "#ffffff",
};

export type PrintSize = keyof typeof PRINT_SIZES;

import { expect, test, describe } from "vitest";
import { zBackground } from "./schema";
import { Background } from "./index";
import { render } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("remotion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("remotion")>();
  return {
    ...actual,
    useCurrentFrame: () => 0,
  };
});


describe("Background Component Reliability", () => {
  test("It accepts valid solid color configuration", () => {
    const input = {
      type: "solid",
      color: "#ff0000",
    };
    const result = zBackground.safeParse(input);
    expect(result.success).toBe(true);
  });

  test("It accepts valid gradient configuration", () => {
    const input = {
      type: "gradient",
      gradientType: "linear",
      gradientColors: ["#000000", "#ffffff"],
      gradientAngle: 90,
    };
    const result = zBackground.safeParse(input);
    expect(result.success).toBe(true);
  });

  test("It rejects invalid colors (The Stupidity Filter)", () => {
    const input = {
      type: "solid",
      color: "not-a-color", // Invalid
    };
    const result = zBackground.safeParse(input);
    expect(result.success).toBe(false);
  });

  test("It accepts valid mesh configuration", () => {
    const input = {
      type: "mesh",
      meshColors: ["#000000", "#ffffff", "#79be15"],
    };
    const result = zBackground.safeParse(input);
    expect(result.success).toBe(true);
  });

  test("It accepts valid presets", () => {
    const input = {
      preset: "mendelu-green",
    };
    const result = zBackground.safeParse(input);
    expect(result.success).toBe(true);
  });

  test("It rejects invalid presets", () => {
    const input = {
      preset: "invalid-preset",
    };
    const result = zBackground.safeParse(input);
    expect(result.success).toBe(false);
  });

  test("It renders solid background correctly", () => {
    const { container } = render(<Background type="solid" color="#00ff00" />);
    const fill = container.firstChild as HTMLElement;
    expect(fill.style.backgroundColor).toBe("rgb(0, 255, 0)");
  });

  test("It accepts valid stars configuration", () => {
    const input = {
      type: "stars",
      starsCount: 300,
    };
    const result = zBackground.safeParse(input);
    expect(result.success).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { AUDIO_ASSETS } from "./AudioMap";
import fs from "fs";
import path from "path";

describe("Audio Architecture (The Stupidity Filter)", () => {
    
  it("Ensure all AUDIO_ASSETS exist on disk", () => {
    // We need to resolve the staticFile path relative to the project root
    // staticFile returns strings like "static/..." or just the relative path depending on config
    // But for our map we manually prefixed "kenney_ui-audio/..."
    
    // In Remotion staticFile() behavior during test might be identity or different
    // Let's assume the values in AUDIO_ASSETS are the relative paths from public/
    
    const publicDir = path.resolve(__dirname, "../../public");
    
    Object.entries(AUDIO_ASSETS).forEach(([key, assetPath]) => {
      // assetPath comes from staticFile(), which in node/test env often just returns the string you passed
      // logic: staticFile("foo.ogg") -> "foo.ogg"
      
      const fullPath = path.join(publicDir, assetPath);
      const exists = fs.existsSync(fullPath);
      
      expect(exists).toBe(true);
      
      if (!exists) {
        console.error(`missing asset for key ${key}: ${fullPath}`);
      }
    });
  });

  it("Ensures Keys are Mapped Correctly", () => {
      expect(AUDIO_ASSETS["TOGGLE_ON"]).toContain("switch1.ogg");
      expect(AUDIO_ASSETS["TOGGLE_OFF"]).toContain("switch2.ogg");
  })
});

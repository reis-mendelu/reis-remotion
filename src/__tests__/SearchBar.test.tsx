// @vitest-environment node
import { describe, test, expect } from "vitest";
import { SearchBarSchema } from "../compositions/SearchBar/schema";

describe("SearchBar Schema", () => {
  test("parses with all defaults", () => {
    const result = SearchBarSchema.parse({});
    expect(result.query).toBe("podnikova ekonomi");
    expect(result.results).toHaveLength(9);
    expect(result.selectedResultIndex).toBe(7);
    expect(result.scale).toBe(1);
  });

  test("accepts custom query and results", () => {
    const result = SearchBarSchema.parse({
      query: "matematika",
      results: [
        { id: "1", title: "Matematika 1", type: "subject", detail: "MAT1 · PEF" },
      ],
      selectedResultIndex: 0,
    });
    expect(result.query).toBe("matematika");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].title).toBe("Matematika 1");
  });

  test("rejects invalid result type", () => {
    expect(() =>
      SearchBarSchema.parse({
        results: [{ id: "1", title: "X", type: "invalid" }],
      })
    ).toThrow();
  });

  test("optional fields default correctly", () => {
    const result = SearchBarSchema.parse({});
    expect(result.background).toBeUndefined();
    expect(result.results[0].detail).toBeDefined();
    expect(result.results[0].personType).toBeUndefined();
  });
});

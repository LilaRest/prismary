import { describe, expect, test, it } from '@jest/globals';
import { clauses, parentClauses, extendClauses, ignoredClauses, notSupportedClauses } from "../src/clauses";

describe("Clauses", () => {
  const implementedClauses = new Set([...parentClauses, ...extendClauses, ...ignoredClauses, ...notSupportedClauses]);
  it("should be all implemented", () => {
    expect(implementedClauses).toBe(clauses);
  });
});
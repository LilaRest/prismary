import { describe, expect, it } from '@jest/globals';
import { clauses, parentClauses, extendClauses, ignoredClauses, notSupportedClauses } from "../src/clauses";

describe("clauses.ts file", () => {
  const implementedClauses = new Set([...parentClauses, ...extendClauses, ...ignoredClauses, ...notSupportedClauses]);
  it("should implement all clauses", () => {
    expect(implementedClauses).toBe(clauses);
  });
});
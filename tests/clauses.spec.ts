import { describe, expect, it } from 'vitest';
import { clauses, parentClauses, extendClauses, ignoredClauses, notSupportedClauses } from "../src/clauses";

describe("clauses.ts file", () => {
  const implementedClauses = new Set([...parentClauses, ...extendClauses, ...ignoredClauses, ...notSupportedClauses]);
  it("should implement all clauses", () => {
    const arr1 = Array.from(implementedClauses).sort();
    const arr2 = Array.from(clauses).sort();
    expect(arr1).toBe(arr2);
  });
});
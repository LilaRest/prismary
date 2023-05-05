import { describe, expect, it } from 'vitest';
import { clauses, parentClauses, extendClauses, ignoredClauses, notSupportedClauses } from "../src/clauses";

describe("clauses.ts file", () => {
  const implementedClauses = new Set([...parentClauses, ...extendClauses, ...ignoredClauses, ...notSupportedClauses]);
  it("should implement all clauses", () => {
    expect(implementedClauses).toEqual(clauses);
  });
});
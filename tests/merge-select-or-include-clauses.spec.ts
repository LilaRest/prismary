import { describe, expect, it } from 'vitest';
import { mergeSelectOrIncludeClauses } from "../src/utils/merge-select-or-include-clauses";

describe("mergeSelectOrIncludeClauses()", () => {
  describe("merging different clauses types together", () => {

    it("should discard 'select' clause if it only mentions fields already selected by an 'include' clause at the same level", () => {
      // Top-level
      expect(
        mergeSelectOrIncludeClauses(
          {
            include: {
              posts: true
            }
          },
          {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        )
      ).toEqual({
        include: {
          posts: true
        }
      });

      // Nested
      expect(
        mergeSelectOrIncludeClauses(
          {
            include: {
              posts: true
            }
          },
          {
            select: {
              posts: {
                select: {
                  title: true,        // Redundant, already selected by include
                  description: true   // Redundant, already selected by include
                }
              }
            }
          }
        )
      ).toEqual({
        include: {
          posts: true
        }
      });

      // Highly nested
      expect(
        mergeSelectOrIncludeClauses(
          {
            include: {
              posts: {
                include: {
                  comments: true
                }
              }
            }
          },
          {
            include: {
              posts: {
                select: {
                  content: true,        // Redundant, already selected by include
                  datetime: true   // Redundant, already selected by include
                }
              }
            }
          }
        )
      ).toEqual({
        include: {
          posts: {
            include: {
              comments: true
            }
          }
        }
      });
    });

    it("should discard select clause if it only mentions fields already selected by an include clause at the same level", () => {
      // TODO
    });
  });

  describe("merging two 'select' clauses together", () => {
    // TODO
  });

  describe("merging two 'include' clauses together", () => {
    // TODO
  });
});


/*
ChatGPT suggestions:
    should merge two empty select or include clauses correctly.
    should merge two non-overlapping select clauses correctly.
    should merge two non-overlapping include clauses correctly.
    should merge overlapping select clauses with scalar fields correctly.
    should merge overlapping include clauses with scalar fields correctly.
    should merge overlapping select clauses with nested sub-bodies correctly.
    should merge overlapping include clauses with nested sub-bodies correctly.
    should merge a select clause with an include clause when both have non-overlapping fields correctly.
    should merge a select clause with an include clause when both have overlapping fields correctly.
    should merge a select clause with an include clause when both have nested sub-bodies correctly.
    should merge complex select and include clauses with multiple levels of nested sub-bodies correctly.
    should merge select or include clauses with a mix of scalar fields and nested sub-bodies correctly.
    should return the correct type of merged clause (select or include) based on input clauses.
    should preserve the original input clauses while merging.
*/
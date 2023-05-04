import { describe, expect, it } from '@jest/globals';
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

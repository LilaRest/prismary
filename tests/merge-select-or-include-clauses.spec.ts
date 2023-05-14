/**
 * @packageDocumentation
 * 
 * ## Notes
 * - As you may have noticed each test is also performed in a "reversed" version. What 
 * "reversed" means here is that the test is exactly the same expect that we switched 
 * qBody1 and qBody2 together. This is especially relevant because the 
 * `mergeSelectOrIncludeClauses()` function don't sort received qBody by clause type,
 *  which may lead to different behaviors if a qBody is given after or before the other.
 * - All tests are performed on clauses of the same level (unless otherwise stated).
 * 
 * ## Overview
 * Here is an overview of what is tested here:
 * 
 * - [returned clause type]
 *   - should return an `include` clause when merging a `select` and an `include` clause together
 *   - should return an `include` clause when merging two `include` clauses together
 *   - should return a `select` clause when mergin two `select` clauses together
 * 
 * - [merging a `select` and `include` clauses together]
 *   - should discard `select` scalar fields already implicitely selected by `include`
 *   - should merge relations fields of both clauses
 *   - should give priority to a sub-QueryBody over a 'true' value if it contains relations fields
 * 
 * - [merging two `select` clauses together]
 *   - should discard select scalar fields already implicitely selected by a parent-level select
 *   - should merge scalar and relations fields of both clauses
 *   - should give priority to a sub-QueryBody over a 'true' value if it contains relations fields
 * 
 * - [merging two `include` clauses together]
 *   - should merge relations fields of both clauses
 *   - should give priority to a sub-QueryBody over a 'true' value if it contains relations fields
 */

import { describe, expect, it } from 'vitest';
import { QueryBody, mergeSelectOrIncludeClauses } from "../src/utils/merge-select-or-include-clauses";
import "../prisma/prismary.config";
import { getConfig } from "prismary";

type Args = [string, QueryBody, QueryBody];
const reverseQueryBodies = (args: Args): Args => [args[0], args[2], args[1]];

describe("mergeSelectOrIncludeClauses()", () => {
  console.error(Object.keys(getConfig()!));

  describe("returned clause type", () => {
    it("should return an `include` clause when merging a `select` and an `include` clause together",
      () => {
        // include + select = include
        const args: Args = ["user", { include: {} }, { select: {} }];
        expect(mergeSelectOrIncludeClauses(...args)).toEqual({ include: {} });
        expect(mergeSelectOrIncludeClauses(...(reverseQueryBodies(args)))).toEqual({ include: {} });
      });

    it("should return an `include` clause when merging two `include` clauses together", () => {
      // include + include = include
      expect(mergeSelectOrIncludeClauses("user", { include: {} }, { include: {} })).toEqual({ include: {} });

    });

    it("should return a `select` clause when mergin two `select` clauses together", () => {
      // select + select = select
      expect(mergeSelectOrIncludeClauses("user", { select: {} }, { select: {} })).toEqual({ select: {} });
    });
  });

  describe("merging a `select` and `include` clauses together", () => {

    it("should discard `select` scalar fields already implicitely selected by `include`", () => {
      // Top-level
      const args1: Args = [
        "user",
        {
          include: {
            posts: true
          }
        },
        {
          select: {
            name: true,   // Redundant (already implicitely selected by `include`)
            email: true,  // Redundant (already implicitely selected by `include`)
          }
        }
      ];
      const expected1 = {
        include: {
          posts: true
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expected1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expected1);

      // Nested
      const args2: Args = [
        "user",
        {
          include: {
            posts: true
          }
        },
        {
          select: {
            posts: {
              select: {
                title: true,    // Redundant (already implicitely selected by `include`)
                content: true   // Redundant (already implicitely selected by `include`)
              }
            }
          }
        }
      ];
      const expected2 = {
        include: {
          posts: true
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expected2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expected2);
    });

    it("should merge relations fields of both clauses", () => {
      // Top-level
      const args1: Args = [
        "user",
        {
          include: {
            posts: true
          }
        },
        {
          select: {
            posts: true,        // Redundant (already explicitely selected by `include`)
            friends: true,      // Relation not selected by `include`
            comments: {         // Relation not selected by `include`
              select: {
                message: true
              }
            }
          }
        }
      ];
      const expected1 = {
        include: {
          posts: true,
          friends: true,
          comments: {
            select: {
              message: true
            },
          },
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expected1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expected1);

      // Nested
      const args2: Args = [
        "user",
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
          select: {
            posts: {
              select: {
                author: true,       // Relation not selected by `include`
                comments: {
                  select: {
                    message: true,  // Redundant (already explicitely selected by `include`)
                    author: true    // Relation not selected by `include`
                  }
                }
              }
            }
          }
        }
      ];
      const expected2 = {
        include: {
          posts: {
            include: {
              author: true,
              comments: {
                select: {
                  author: true
                },
              },
            }
          },
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expected2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expected2);
    });

    it("should give priority to a sub-QueryBody over a 'true' value if it contains relations fields", () => {

      // Top-level
      const args1: Args = [
        "user",
        {
          include: {
            posts: true,
            friends: true,
            comments: true
          }
        },
        {
          select: {
            posts: {           // Contains 'author' relation field
              select: {
                author: true
              }
            },
            friends: {         // Contains 'posts' relation field
              include: {
                posts: true
              }
            },
            comments: {       // Doesn't contain any relation field
              select: {
                message: true
              }
            }
          }
        }
      ];
      const expected1 = {
        include: {
          posts: {
            select: {
              author: true
            }
          },
          friends: {
            include: {
              posts: true
            }
          },
          comments: true
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expected1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expected1);

      // Nested
      const args2: Args = [
        "user",
        {
          include: {
            friends: {
              include: {
                posts: true,
                friends: true,
                comments: true
              }
            }
          }
        },
        {
          select: {
            friends: {
              select: {
                posts: {           // Contains 'author' relation field
                  select: {
                    author: true
                  }
                },
                friends: {         // Contains 'posts' relation field
                  include: {
                    posts: true
                  }
                },
                comments: {       // Doesn't contain any relation field
                  select: {
                    message: true
                  }
                }
              }
            }
          }
        }
      ];
      const expected2 = {
        include: {
          friends: {
            include: {
              posts: {
                select: {
                  author: true
                }
              },
              friends: {
                include: {
                  posts: true
                }
              },
              comments: true
            }
          }
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expected2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expected2);
    });
  });

  describe("merging two `select` clauses together", () => {

    it("should discard select scalar fields already implicitely selected by a parent-level select", () => {
      // Top-level
      const args1: Args = [
        "user",
        {
          select: {
            posts: true
          }
        },
        {
          select: {
            posts: {
              select: {
                title: true,   // Redundant (already implicitely include by above 'posts: true')
                content: true  // Redundant (already implicitely include by above 'posts: true')
              }
            }
          }
        }
      ];
      const expected1 = {
        select: {
          posts: true
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expected1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expected1);

      // Nested
      const args2: Args = [
        "user",
        {
          select: {
            posts: {
              select: {
                comments: true
              }
            }
          }
        },
        {
          select: {
            posts: {
              select: {
                comments: {
                  select: {
                    message: true   // Redundant (already implicitely include by above 'posts: true')
                  }
                }
              }
            }
          }
        }
      ];
      const expected2 = {
        select: {
          posts: {
            select: {
              comments: true
            }
          }
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expected2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expected2);
    });

    it("should merge scalar and relations fields of both clauses", () => {

      // Top-level
      const args1: Args = [
        "user",
        {
          select: {
            email: true,    // Redundant
            name: true,     // Redundant
            comments: true  // Unique
          }
        },
        {
          select: {
            email: true,     // Redundant
            name: true,      // Redundant   
            friends: true,   // Unique
          }
        }
      ];
      const expected1 = {
        select: {
          email: true,
          name: true,
          comments: true,
          friends: true,
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expected1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expected1);

      // Nested
      const args2: Args = [
        "user",
        {
          select: {
            friends: {
              select: {
                email: true,    // Redundant
                name: true,     // Redundant
                comments: true, // Unique
              }
            }
          }
        },
        {
          select: {
            friends: {
              select: {
                email: true,   // Redundant
                name: true,    // Redundant
                friends: true, // Unique
              }
            }
          }
        }
      ];
      const expected2 = {
        select: {
          friends: {
            select: {
              email: true,
              name: true,
              comments: true,
              friends: true
            }
          }
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expected2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expected2);
    });

    it("should give priority to a sub-QueryBody over a 'true' value if it contains relations fields", () => {
      // Top-level
      const args1: Args = [
        "user",
        {
          select: {
            friends: {      // Mentions 'posts' relation field
              include: {
                posts: true
              }
            },
          }
        },
        {
          select: {
            friends: true,
          }
        }
      ];
      const expected1 = {
        select: {
          friends: {
            include: {
              posts: true
            }
          },
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expected1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expected1);

      // Nested
      const args2: Args = [
        "user",
        {
          select: {
            friends: {
              select: {
                posts: {       // Doesn't mention any relation field
                  select: {
                    title: true
                  }
                },
                comments: {    // Mention 'post' relation field
                  select: {
                    post: true
                  }
                }
              }
            },
          }
        },
        {
          select: {
            friends: {
              select: {
                posts: true,
                comments: true
              }
            },
          }
        },
      ];
      const expected2 = {
        select: {
          friends: {
            select: {
              posts: true,
              comments: {
                select: {
                  post: true
                }
              }
            }
          },
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expected2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expected2);
    });
  });

  describe("merging two `include` clauses together", () => {

    it("should merge relations fields of both clauses", () => {

      // Top-level
      const args1: Args = [
        "user",
        {
          include: {
            profile: true,  // Unique
            friends: true   // Redundant
          }
        },
        {
          include: {
            friends: true,  // Redundant
            comments: true  // Unique
          }
        }
      ];
      const expect1 = {
        include: {
          profile: true,
          friends: true,
          comments: true
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expect1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expect1);

      // Nested
      const args2: Args = [
        "user",
        {
          include: {
            friends: {
              include: {
                profile: true,  // Unique
                friends: true   // Redundant
              }
            }
          }
        },
        {
          include: {
            friends: {
              include: {
                friends: true,  // Redundant
                comments: true  // Unique
              }
            }
          }
        }
      ];
      const expect2 = {
        include: {
          friends: {
            include: {
              profile: true,
              friends: true,
              comments: true
            }
          }
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expect2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expect2);
    });

    it("should give priority to a sub-QueryBody over a 'true' value if it contains relations fields", () => {

      // Top-level
      const args1: Args = [
        "user",
        {
          include: {
            friends: true,
            posts: true
          }
        },
        {
          include: {
            friends: {    // Doesn't mention any relation field
              select: {
                name: true,
                email: true,
              }
            },
            posts: {      // Mentions 'comments' relation field
              select: {
                comments: true
              }
            }
          }
        }
      ];
      const expected1 = {
        include: {
          friends: true,
          posts: {
            select: {
              comments: true
            }
          }
        }
      };
      expect(mergeSelectOrIncludeClauses(...args1)).toEqual(expected1);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args1))).toEqual(expected1);

      // Nested
      const args2: Args = [
        "user",
        {
          include: {
            friends: {
              include: {
                friends: true,
                posts: true
              }
            }
          }
        },
        {
          include: {
            friends: {
              include: {
                friends: {    // Doesn't mention any relation field
                  select: {
                    name: true,
                    email: true,
                  }
                },
                posts: {      // Mentions 'comments' relation field
                  select: {
                    comments: true
                  }
                }
              }
            }
          }
        }
      ];
      const expected2 = {
        include: {
          friends: {
            include: {
              friends: true,
              posts: {
                select: {
                  comments: true
                }
              }
            }
          }
        }
      };
      expect(mergeSelectOrIncludeClauses(...args2)).toEqual(expected2);
      expect(mergeSelectOrIncludeClauses(...reverseQueryBodies(args2))).toEqual(expected2);
    });
  });
});

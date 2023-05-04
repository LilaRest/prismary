/** 
 * @packageDocumentation
 * 
 * This utils file handle merging Prisma Client `include` and `select` clauses.
 * 
 * ## Standard 
 * 
 * The below code aims to strictly respect the following specifications of the Prisma Client API reference:
 * - `include` clause: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#include 
 * - `select` clause: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#select
 * 
 * Additional documentation on the usage of those clauses can be found here:
 * - https://www.prisma.io/docs/concepts/components/prisma-client/select-fields
 * 
 * Based on those resources, here is the valid format of a "select or include" clause:
 * 
 * ```text
 * ["select"|"include"]: {
 *   data: true | {
 *     include?: {...}
 *     select?: {...}
 *   }
 * }
 * ```
 * 
 * Where {...} is just another nested object of this type.
 * 
 * 
 * ## Performances & validation
 * 
 * Note that to keep those pieces of code as performant as possible, only the minimum necessary validations 
 * are performed at runtime on the given values.
 * TS is enforcing type safety at write and compile time only.
 * 
 * 
 * ## Terminology
 * 
 * - **query body**: object given as argument of Prisma Client model method
 *   @example 
 *   ```ts
 *   prisma.user.findMany(x)
 *   ```
 *   where x is a "query body" object
 * 
 * - **sub-body**: object given as value of a scalar field keys in `include` or `select` clause
 *   @example 
 *   ```ts
 *   prisma.user.findMany({ select: { posts: x } })
 *   ```
 *   where x is a "sub body"
 */


/**
 * Represents a {@link queryBody} object that only supports `include` and `select` clauses.
 * Is also used to represnent sub-body nested in `include` and `select clauses.
 */
interface QueryBody {
  select?: SelectOrIncludeBody;
  include?: SelectOrIncludeBody;
  [key: string | "select" | "include"]: SelectOrIncludeBody | string | undefined;
}

/**
 * Represents the body of a `select` or `include` clause.
 */
interface SelectOrIncludeBody {
  [key: string]: true | QueryBody;
}

/**
 * Represents the clause format awaited by the below functions
 */
interface SelectOrIncludeClause extends QueryBody {
  type: "include" | "select";
};

/** 
 * Represents the partial query body object passed between nested calls of 
 * `_mergeSelectOrIncludeClauses()` function.
 */
type Receiver = Partial<QueryBody>;

/**
 * This function merges two given `include` or `select` clauses.
 * Useful for bundling many read requests in a single one.
 * @param clause1 
 * @param clause2 
 * @returns 
 */
export function mergeSelectOrIncludeClauses (clause1: SelectOrIncludeClause, clause2: SelectOrIncludeClause) {
  const startTime = performance.now();
  const mergedClauseBody: Receiver = {};
  _mergeSelectOrIncludeClauses(clause1, clause2, mergedClauseBody);
  console.log("In: ", performance.now() - startTime, "ms");
  return mergedClauseBody;
}

function _mergeSelectOrIncludeClauses (clause1: SelectOrIncludeClause, clause2: SelectOrIncludeClause, receiver: Receiver) {

  // Retrieve the main type of the merged clause
  const mergedClauseType = [clause1.type, clause2.type].includes("include") ? "include" : "select";
  receiver[mergedClauseType] = {};

  // If there is one `select` and one `include` clause
  if (clause1.type !== clause2.type) {
    const selectBody: SelectOrIncludeBody = clause1.type === "select" ? clause1.select! : clause2.select!;
    const includeBody: SelectOrIncludeBody = clause1.type === "include" ? clause1.include! : clause2.include!;

    for (const key in selectBody) {

      // Ignore top-level scalar fields of `select` body, they are already all included by the include clause
      if (selectBody[key] !== true) {

        // If key is also included in the `include` clause body
        if (key in includeBody) {

          // And if it nest some sub-body
          if (includeBody[key] !== true) {

            // Merge the two sub-bodies together
            receiver[mergedClauseType]![key] = {};
            _mergeSelectOrIncludeClauses(
              {
                type: "select",
                select: selectBody[key] as SelectOrIncludeBody
              },
              {
                type: "include",
                include: includeBody[key] as SelectOrIncludeBody
              },
              receiver[mergedClauseType]![key] as Receiver);
          }

          else {
            // Retrieve all non-scalar fiels of the `select` body
            const nonScalarFields: any = {};
            for (const [k, v] of Object.entries(selectBody[key] as SelectOrIncludeBody)) {
              if (v !== true) nonScalarFields[k] = v;
            }
            // If some non-scalar fields have been found, append the sub-select body
            if (Object.keys(nonScalarFields).length) receiver[mergedClauseType]![key] = nonScalarFields;

            // Else simply set key to true to mean "include all"
            else receiver[mergedClauseType]![key] = true;
          }
          delete includeBody[key];
        }

        // Else
      }
    }
    receiver[mergedClauseType] = { ...receiver[mergedClauseType], ...includeBody };
  }

  // Else if both clauses have same type
  else {
    const type = clause1.type;
    for (const key in clause1[type]) {
      if (key in clause2[type]!) {
        if (clause1[type]![key] === true) {
          receiver[mergedClauseType]![key] = true;
          delete clause2[type]![key];
        }
        else {
          receiver[mergedClauseType]![key] = {};
          _mergeSelectOrIncludeClauses(
            {
              type: type,
              [type]: clause1[type]![key] as SelectOrIncludeBody
            },
            {
              type: type,
              [type]: clause2[type]![key] as SelectOrIncludeBody
            },
            receiver[mergedClauseType]![key] as Receiver);
        }
      }
      else receiver[mergedClauseType]![key] = clause1[type]![key];
    }
    receiver[mergedClauseType] = { ...receiver[mergedClauseType], ...clause2[type] };
  }
}





console.log(JSON.stringify(mergeSelectOrIncludeClauses(
  {
    type: "include",
    include: {
      posts: true
    }
  },
  {
    type: "select",
    select: {
      posts: {
        select: {
          title: true,
          comments: {
            select: {
              content: true
            }
          },
          likes: true
        }
      }
    }
  }
), null, 2));

console.log(JSON.stringify(mergeSelectOrIncludeClauses(
  {
    type: "select",
    select: {
      email: true
    }
  },
  {
    type: "select",
    select: {
      name: true
    }
  }
), null, 2));

console.log(JSON.stringify(mergeSelectOrIncludeClauses(
  {
    type: "include",
    include: {
      posts: true
    }
  },
  {
    type: "select",
    select: {
      posts: {
        select: {
          title: true,
          comments: {
            select: {
              content: true
            }
          },
          likes: true
        }
      }
    }
  }
), null, 2));
/**
 * Should give:
{
  include: {
    posts: {
    
    }
  }
}
 * 
 */
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
interface SelectQueryBody {
  select: SelectOrIncludeBody;
  include?: never;
  [key: string]: SelectOrIncludeBody | string | undefined;
}

interface IncludeQueryBody {
  select?: never;
  include: SelectOrIncludeBody;
  [key: string]: SelectOrIncludeBody | string | undefined;
}

type QueryBody = SelectQueryBody | IncludeQueryBody;

/**
 * Represents the body of a `select` or `include` clause.
 */
interface SelectOrIncludeBody {
  [key: string]: true | QueryBody;
}


/**
 * This function merges two given `include` or `select` clauses.
 * Useful for bundling many read requests in a single one.
 * @param body1 
 * @param body2 
 * @returns 
 */
export function mergeSelectOrIncludeClauses (body1: QueryBody, body2: QueryBody): QueryBody {
  // const startTime = performance.now();
  const mergedBody = _mergeSelectOrIncludeClauses(body1, body2);
  // console.log("In: ", performance.now() - startTime, "ms");
  return mergedBody;
}


function _mergeSelectOrIncludeClauses (body1: QueryBody, body2: QueryBody): QueryBody {

  const mergedBody: Partial<QueryBody> = {};

  // Retrieve given clauses types
  const type1 = body1.include ? "include" : "select";
  const type2 = body2.include ? "include" : "select";

  // Retrieve the type of the merged clause and provides an empty body
  const typeMerged = body1.include || body2.include ? "include" : "select";
  mergedBody[typeMerged] = {};

  // If there is one `select` and one `include` clause to be merged
  if (type1 !== type2) {

    // Identify the `select` and `include` clause bodies
    const [selectBody, includeBody] = type1 === "select"
      ? [body1.select!, body2.include!]
      : [body2.select!, body1.include!];

    // Iterate over entries of `select` clause body
    for (const [key, value] of Object.entries(selectBody)) {

      // Ignore top-level scalar fields of `select` body, as they are already implicitely included by the include clause
      if (value !== true) {

        // If key is also included in the `include` clause body
        if (key in includeBody) {

          // And if it also contains a sub-body
          const includedBodyValue = includeBody[key];
          if (includedBodyValue !== true) {

            // Merge the two sub-bodies together
            mergedBody[typeMerged]![key] = _mergeSelectOrIncludeClauses(value, includedBodyValue);
          }

          // Else, if the `select` clause key holds detailed relationships selectors reflect those in the
          // new `include`
          else {
            if (value.include) {
              mergedBody[typeMerged]![key] = {
                include: value.include
              };
            }
            else if (value.select) {

              // Retrieve all non-scalar fiels of the sub `select` body
              const nonScalarFields: any = {};
              for (const [k, v] of Object.entries(value.select)) {
                if (v !== true) nonScalarFields[k] = v;
              }

              // If some non-scalar fields have been found, append the sub-select body
              if (Object.keys(nonScalarFields).length) mergedBody[typeMerged]![key] = {
                select: nonScalarFields
              };

              // Else simply set key to true to mean "include all"
              else mergedBody[typeMerged]![key] = true;
            }
          }
          delete includeBody[key];
        }
      }
    }
    mergedBody[typeMerged] = { ...mergedBody[typeMerged], ...includeBody };
  }

  // Or if both clauses have the same type
  else {

    // Retrieve common type and iterate over body1 keys
    const type = type1;
    for (const key in body1[type]) {

      // If key is also in body2
      if (key in body2[type]!) {

        // If key value is true in body1
        if (body1[type]![key] === true) {
          // And also true in body 2, set it to true
          if (body2[type]![key] === true) mergedBody[typeMerged]![key] = true;
          // Else, use the body2 value
          else mergedBody[typeMerged]![key] = body2[type]![key];
        }

        // Or if key value is true in body2 but not in body1
        else if (body2[type]![key] === true) {

          // Use body1 value
          mergedBody[typeMerged]![key] = body2[type]![key];
        }

        // Else if they are both sub-bodies
        else {

          // Merge the sub-bodies  together
          mergedBody[typeMerged]![key] = _mergeSelectOrIncludeClauses(
            body1[type]![key] as QueryBody,
            body2[type]![key] as QueryBody
          );
        }
        delete body2[type]![key];
      }
      // Else simply append it to mergedBody;
      else mergedBody[typeMerged]![key] = body1[type]![key];
    }
    mergedBody[typeMerged] = { ...mergedBody[typeMerged], ...body2[type] };
  }


  return mergedBody as QueryBody;
}

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
 * Where:
 * - {...} is just another nested object of this type,
 * - data must be a relationship field in 'include' clause
 * 
 * 
 * ## Performances & validation
 * 
 * TS is enforcing type safety at write and compile time only.
 * In order to keep those pieces of code as performant as possible, only the minimum necessary validations 
 * are performed at runtime on the given inputs.
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

import { modelsSpecs } from "../.generated";

/**
 * Represents a {@link queryBody} object that only supports `include` and `select` clauses.
 * Is also used to represent sub-body nested in `include` and `select clauses.
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

export type QueryBody = SelectQueryBody | IncludeQueryBody;

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
export function mergeSelectOrIncludeClauses (
  model: string,
  qBody1: QueryBody,
  qBody2: QueryBody
): QueryBody {

  // Retrieve given clauses types
  const type1 = qBody1.include ? "include" : "select";
  const type2 = qBody2.include ? "include" : "select";
  const body1 = { ...qBody1[type1]! };
  const body2 = { ...qBody2[type2]! };

  // Retrieve the type of the merged clause and provides an empty body
  const typeMerged = [type1, type2].includes("include") ? "include" : "select";
  let bodyMerged: SelectOrIncludeBody = {};

  // Iterate over all fields of body1
  for (const [key1, value1] of Object.entries(body1)) {
    // Try to retrieve the relation model associated with this key (else is undefined)
    const relationModel = modelsSpecs[model].relations[key1];

    // If the field is also mentionned in body2
    if (key1 in body2) {
      const value2 = body2[key1];

      // If both values are true, set field to true
      if (value1 === true && value2 === true) bodyMerged[key1] = true;

      // If one of both values is a sub-body
      else if (value1 === true || value2 === true) {
        // Retrieve concerned sub-QueryBody, its type and its body
        const value: QueryBody = value1 === true ? value2 as QueryBody : value1;
        const type = value.include ? "include" : "select";
        const body = value[type]!;

        // Filter only relations fields from body
        const relationsFields = Object.entries(body).filter(([k]) => modelsSpecs[relationModel].relations[k]);

        // If there are some relations fields
        if (relationsFields.length) {
          // And set the sub-query body with objects that contains relations fields
          bodyMerged[key1] = {
            [type]: Object.fromEntries(relationsFields)
          } as QueryBody;
        }

        // Else set it to true
        else bodyMerged[key1] = true;
      }

      // Else if both values are sub-bodies, merge them together
      else bodyMerged[key1] = mergeSelectOrIncludeClauses(relationModel, value1, value2);

      delete body2[key1];
    }

    // Of if the field is only in body1
    else {
      if (typeMerged === "include") {
        // Append field if it's a relationship one
        if (relationModel) bodyMerged[key1] = value1;
      }
      else bodyMerged[key1] = value1;
    }
  }

  // Handle body2 remaining fields
  if (typeMerged === "include") {
    // If type2 is also "include", include all remaining fields
    if (type2 === "include") bodyMerged = { ...bodyMerged, ...body2 };

    // Else appends relations fields only
    else {
      const relationFields = Object.entries(body2).filter(([key]) => modelsSpecs[model].relations[key]);
      if (relationFields.length) bodyMerged = { ...bodyMerged, ...Object.fromEntries(relationFields) };
    }
  }
  else bodyMerged = { ...bodyMerged, ...body2 };

  // Build and return a QueryBody object from typeMerged and bodyMerged
  return { [typeMerged]: bodyMerged } as QueryBody;
}
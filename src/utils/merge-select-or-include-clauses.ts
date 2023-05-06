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

import { modelsSpecs } from "../toGenerate";

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
export function mergeSelectOrIncludeClauses (model: string, body1: QueryBody, body2: QueryBody): QueryBody {
  const mergedBody = _mergeSelectOrIncludeClauses(model, body1, body2);
  return mergedBody;
}

function _mergeSelectOrIncludeClauses (
  model: string,
  qBody1: QueryBody,
  qBody2: QueryBody
): QueryBody {

  // Retrieve given clauses types
  const type1 = qBody1.include ? "include" : "select";
  const type2 = qBody2.include ? "include" : "select";
  const body1 = qBody1[type1]!;
  const body2 = qBody2[type2]!;

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
        // Retrieve concerned sub-body
        const value = value1 === true ? value2 : value1;

        if (typeMerged === "include") {
          // Set field value to sub-body if this one includes relations fields
          if (Object.keys(value).filter(k => modelsSpecs[model].relations[k]).length) {
            bodyMerged[key1] = value;
          }

          // Else set it to true
          else bodyMerged[key1] = true;
        }
        else bodyMerged[key1] = value;
      }

      // Else if both values are sub-bodies, merge them together
      else bodyMerged[key1] = _mergeSelectOrIncludeClauses(relationModel, value1, value2);

      delete body2[key1];
    }

    // Of if the field is only in body1
    else {

      if (typeMerged === "include") {
        // Append field if it is relationshipone
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
  else if (typeMerged === "select") bodyMerged = { ...bodyMerged, ...body2 };
  else throw new Error("Unhandled scenario");

  // Build and return a QueryBody object from typeMerged and bodyMerged
  return { [typeMerged]: bodyMerged } as QueryBody;
}




console.log(JSON.stringify(mergeSelectOrIncludeClauses(
  "user",
  {
    include: {
      bases: true,
      friends: true
    }
  },
  {
    select: {
      name: true,
      bases: true,
      friends: {
        select: {
          email: true
        }
      }
    }
  }
), null, 2));








function _mergeSelectOrIncludeClausesOld (model: string, body1: QueryBody, body2: QueryBody): QueryBody {

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
      const relationModel = modelsSpecs[model].relations[key];
      if (value !== true || relationModel) {

        // If key is also included in the `include` clause body
        if (key in includeBody) {

          // And if they both contains a sub-body
          const includedBodyValue = includeBody[key];
          if (value !== true && includedBodyValue !== true) {

            // Merge the two sub-bodies together
            mergedBody[typeMerged]![key] = _mergeSelectOrIncludeClauses(relationModel, value, includedBodyValue);
          }

          // If only `include` contains a sub-body.
          else if (value === true && includedBodyValue !== true) {
            mergedBody[typeMerged]![key] = includedBodyValue;
          }

          // If only `select` contains a sub-body
          else if (value !== true && includedBodyValue === true) {
            // Else, if the `select` clause key holds detailed relationships selectors reflect those in the new `include`
            if (value.include) {
              mergedBody[typeMerged]![key] = {
                include: value.include
              };
            }
            else if (value.select) {

              // Retrieve all non-scalar fiels of the sub `select` body
              const nonScalarFields: any = {};
              for (const [k, v] of Object.entries(value.select)) {
                const subRelationModel = modelsSpecs[key].relations[k];
                if (v !== true || subRelationModel) nonScalarFields[k] = v;
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

        // Else simply append it to the mergedBody as is
        else mergedBody[typeMerged]![key] = value;
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
          const relationModel = modelsSpecs[model].relations[key];
          mergedBody[typeMerged]![key] = _mergeSelectOrIncludeClauses(
            relationModel,
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

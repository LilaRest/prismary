import { DMMF } from "@prisma/generator-helper";

export interface Variant {
  namePrefix: string;
  isFieldIgnored (field: DMMF.Field): boolean;
  isFieldOptional (field: DMMF.Field): boolean;
}

export const Variants: Record<string, Variant> = {
  default: {
    namePrefix: "",
    isFieldIgnored: () => false,
    isFieldOptional: () => false,
  },
  create: {
    namePrefix: "Create",
    isFieldIgnored: (field) => field.isId && field.hasDefaultValue,
    isFieldOptional: (field) => field.hasDefaultValue,
  },
  update: {
    namePrefix: "Update",
    isFieldIgnored: (field) => field.isId,
    isFieldOptional: () => true,
  },
} as const;
// To be generated from schema for somewhere else
export const modelsSpecs = {
  user: {
    fields: new Set(["id", "email", "name", "bases"]),
    relations: {
      bases: "base",
      friends: "user",
      posts: "post"
    }
  },
  base: {
    fields: new Set(["user", "userId"]),
    relations: {
      user: "user",
    }
  }
} as { [key: string]: any; };
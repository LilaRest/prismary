// To be generated from schema for somewhere else
export const modelsSpecs = {
  user: {
    scalars: new Set(["id", "email", "name", "bases"]),
    relations: {
      bases: "base",
      friends: "user",
      posts: "post"
    }
  },
  base: {
    scalars: new Set(["user", "userId"]),
    relations: {
      user: "user",
    }
  }
} as { [key: string]: any; };
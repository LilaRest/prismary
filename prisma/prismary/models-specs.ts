export const modelsSpecs: { [key: string]: any } = {
    user: {
        fields: new Set(["id", "email", "password", "profileId", "profile", "friends", "friendOf", "posts", "comments"]),
        relations: { "profile": "profile", "friends": "user", "friendOf": "user", "posts": "post", "comments": "comment" }
    }, profile: {
        fields: new Set(["id", "bio", "isPrivate", "age", "userId", "user"]),
        relations: { "user": "user" }
    }, post: {
        fields: new Set(["id", "title", "content", "rating", "authorId", "createdAt", "author", "comments"]),
        relations: { "author": "user", "comments": "comment" }
    }, comment: {
        fields: new Set(["id", "text", "createdAt", "postId", "authorId", "post", "author"]),
        relations: { "post": "post", "author": "user" }
    },
};

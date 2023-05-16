"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "modelsSpecs", {
    enumerable: true,
    get: function() {
        return modelsSpecs;
    }
});
const _UserSchema = require("./UserSchema");
const _ProfileSchema = require("./ProfileSchema");
const _PostSchema = require("./PostSchema");
const _CommentSchema = require("./CommentSchema");
const modelsSpecs = {
    user: {
        fields: new Set([
            "id",
            "email",
            "name",
            "password",
            "profileId",
            "profile",
            "friends",
            "friendOf",
            "posts",
            "comments"
        ]),
        relations: {
            "profile": "profile",
            "friends": "user",
            "friendOf": "user",
            "posts": "post",
            "comments": "comment"
        },
        schema: _UserSchema.UserSchema
    },
    profile: {
        fields: new Set([
            "id",
            "bio",
            "isPrivate",
            "age",
            "userId",
            "user"
        ]),
        relations: {
            "user": "user"
        },
        schema: _ProfileSchema.ProfileSchema
    },
    post: {
        fields: new Set([
            "id",
            "title",
            "content",
            "rating",
            "authorId",
            "createdAt",
            "author",
            "comments"
        ]),
        relations: {
            "author": "user",
            "comments": "comment"
        },
        schema: _PostSchema.PostSchema
    },
    comment: {
        fields: new Set([
            "id",
            "message",
            "createdAt",
            "postId",
            "authorId",
            "post",
            "author"
        ]),
        relations: {
            "post": "post",
            "author": "user"
        },
        schema: _CommentSchema.CommentSchema
    }
};

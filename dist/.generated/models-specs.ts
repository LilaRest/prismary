import { UserSchema } from "./UserSchema";
import { ProfileSchema } from "./ProfileSchema";
import { PostSchema } from "./PostSchema";
import { CommentSchema } from "./CommentSchema";

export const modelsSpecs: { [key: string]: any } = {user: {
          fields: new Set(["id","email","name","password","profileId","profile","friends","friendOf","posts","comments"]),
          relations: {"profile":"profile","friends":"user","friendOf":"user","posts":"post","comments":"comment"},
          schema: UserSchema
        },profile: {
          fields: new Set(["id","bio","isPrivate","age","userId","user"]),
          relations: {"user":"user"},
          schema: ProfileSchema
        },post: {
          fields: new Set(["id","title","content","rating","authorId","createdAt","author","comments"]),
          relations: {"author":"user","comments":"comment"},
          schema: PostSchema
        },comment: {
          fields: new Set(["id","message","createdAt","postId","authorId","post","author"]),
          relations: {"post":"post","author":"user"},
          schema: CommentSchema
        },};

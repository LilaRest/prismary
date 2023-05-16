import { Prisma } from "@prisma/client";
import { UserSchema } from "./UserSchema";
import { ProfileSchema } from "./ProfileSchema";
import { PostSchema } from "./PostSchema";
import { CommentSchema } from "./CommentSchema";

export const modelsSpecs: { [key: string]: any } = {user: {
          fields: new Set(["id","email","name","password","profileId","profile","friends","friendOf","posts","comments"]),
          relations: {"profile":"profile","friends":"user","friendOf":"user","posts":"post","comments":"comment"},
          schema: UserSchema,
          argsTypes: {
            findUnique: {} as Prisma.UserFindUniqueArgs,
            findUniqueOrThrow: {} as Prisma.UserFindUniqueOrThrowArgs,
            findFirst: {} as Prisma.UserFindFirstArgs,
            findFirstOrThrow: {} as Prisma.UserFindFirstOrThrowArgs,
            findMany: {} as Prisma.UserFindManyArgs,
            create: {} as Prisma.UserCreateArgs,
            update: {} as Prisma.UserUpdateArgs,
            upsert: {} as Prisma.UserUpsertArgs,
            delete: {} as Prisma.UserDeleteArgs,
            createMany: {} as Prisma.UserCreateManyArgs,
            updateMany: {} as Prisma.UserUpdateManyArgs,
            deleteMany: {} as Prisma.UserDeleteManyArgs,
            count: {} as Prisma.UserCountArgs,
            aggregate: {} as Prisma.UserAggregateArgs,
            groupBy: {} as Prisma.UserGroupByArgs,
          }
        },profile: {
          fields: new Set(["id","bio","isPrivate","age","userId","user"]),
          relations: {"user":"user"},
          schema: ProfileSchema,
          argsTypes: {
            findUnique: {} as Prisma.ProfileFindUniqueArgs,
            findUniqueOrThrow: {} as Prisma.ProfileFindUniqueOrThrowArgs,
            findFirst: {} as Prisma.ProfileFindFirstArgs,
            findFirstOrThrow: {} as Prisma.ProfileFindFirstOrThrowArgs,
            findMany: {} as Prisma.ProfileFindManyArgs,
            create: {} as Prisma.ProfileCreateArgs,
            update: {} as Prisma.ProfileUpdateArgs,
            upsert: {} as Prisma.ProfileUpsertArgs,
            delete: {} as Prisma.ProfileDeleteArgs,
            createMany: {} as Prisma.ProfileCreateManyArgs,
            updateMany: {} as Prisma.ProfileUpdateManyArgs,
            deleteMany: {} as Prisma.ProfileDeleteManyArgs,
            count: {} as Prisma.ProfileCountArgs,
            aggregate: {} as Prisma.ProfileAggregateArgs,
            groupBy: {} as Prisma.ProfileGroupByArgs,
          }
        },post: {
          fields: new Set(["id","title","content","rating","authorId","createdAt","author","comments"]),
          relations: {"author":"user","comments":"comment"},
          schema: PostSchema,
          argsTypes: {
            findUnique: {} as Prisma.PostFindUniqueArgs,
            findUniqueOrThrow: {} as Prisma.PostFindUniqueOrThrowArgs,
            findFirst: {} as Prisma.PostFindFirstArgs,
            findFirstOrThrow: {} as Prisma.PostFindFirstOrThrowArgs,
            findMany: {} as Prisma.PostFindManyArgs,
            create: {} as Prisma.PostCreateArgs,
            update: {} as Prisma.PostUpdateArgs,
            upsert: {} as Prisma.PostUpsertArgs,
            delete: {} as Prisma.PostDeleteArgs,
            createMany: {} as Prisma.PostCreateManyArgs,
            updateMany: {} as Prisma.PostUpdateManyArgs,
            deleteMany: {} as Prisma.PostDeleteManyArgs,
            count: {} as Prisma.PostCountArgs,
            aggregate: {} as Prisma.PostAggregateArgs,
            groupBy: {} as Prisma.PostGroupByArgs,
          }
        },comment: {
          fields: new Set(["id","message","createdAt","postId","authorId","post","author"]),
          relations: {"post":"post","author":"user"},
          schema: CommentSchema,
          argsTypes: {
            findUnique: {} as Prisma.CommentFindUniqueArgs,
            findUniqueOrThrow: {} as Prisma.CommentFindUniqueOrThrowArgs,
            findFirst: {} as Prisma.CommentFindFirstArgs,
            findFirstOrThrow: {} as Prisma.CommentFindFirstOrThrowArgs,
            findMany: {} as Prisma.CommentFindManyArgs,
            create: {} as Prisma.CommentCreateArgs,
            update: {} as Prisma.CommentUpdateArgs,
            upsert: {} as Prisma.CommentUpsertArgs,
            delete: {} as Prisma.CommentDeleteArgs,
            createMany: {} as Prisma.CommentCreateManyArgs,
            updateMany: {} as Prisma.CommentUpdateManyArgs,
            deleteMany: {} as Prisma.CommentDeleteManyArgs,
            count: {} as Prisma.CommentCountArgs,
            aggregate: {} as Prisma.CommentAggregateArgs,
            groupBy: {} as Prisma.CommentGroupByArgs,
          }
        },};

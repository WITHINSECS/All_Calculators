import mongoose, { Document, Schema } from "mongoose";

export interface IAuthUser extends Document {
    id: string;
    email: string;
    name?: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AuthUserSchema: Schema<IAuthUser> = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            default: null,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        // IMPORTANT: Better Auth Mongo adapter uses "user" collection (not "users")
        collection: "user",
    }
);

const AuthUser =
    mongoose.models.AuthUser ||
    mongoose.model<IAuthUser>("AuthUser", AuthUserSchema);

export default AuthUser;

import mongoose, { Document, Schema } from "mongoose";

export interface IAdminAccount extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdminAccountSchema = new Schema<IAdminAccount>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: [true, "Password hash is required"],
        },
        role: {
            type: String,
            default: "admin",
            trim: true,
        },
    },
    {
        timestamps: true,
        collection: "admin_accounts",
    }
);

const AdminAccount =
    mongoose.models.AdminAccount ||
    mongoose.model<IAdminAccount>("AdminAccount", AdminAccountSchema);

export default AdminAccount;

import mongoose, { Document, Schema } from "mongoose";

export interface IInquiry extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    createdAt: Date;
}

const InquirySchema: Schema<IInquiry> = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            default: "",
        },
        message: {
            type: String,
            required: [true, "Message is required"],
        },
    },
    {
        timestamps: true,
    }
);

const Inquiry =
    mongoose.models.Inquiry ||
    mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
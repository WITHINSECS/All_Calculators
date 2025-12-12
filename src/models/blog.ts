import mongoose, { Document, Schema } from "mongoose";

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    category: string;
    date: string;        // you currently store "April 18, 2023" as a string
    imageUrl: string;
    excerpt: string;

    // Optional (nice to have for real blog pages)
    content?: string;    // full article body
    isPublished?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema<IBlogPost> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        date: {
            type: String,
            required: [true, "Date is required"],
            trim: true,
        },
        imageUrl: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
        excerpt: {
            type: String,
            required: [true, "Excerpt is required"],
            trim: true,
        },

        // Optional fields
        content: {
            type: String,
            default: "",
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const BlogPost =
    mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;

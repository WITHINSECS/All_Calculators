import mongoose, { Document, Schema } from "mongoose";

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    category: string;
    date: string;
    imageUrl: string;
    excerpt: string;
    content?: string;
    isPublished?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema<IBlogPost> = new Schema(
    {
        title: { type: String, required: [true, "Title is required"], trim: true },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        category: { type: String, required: [true, "Category is required"], trim: true },
        date: { type: String, required: [true, "Date is required"], trim: true },
        imageUrl: { type: String, required: [true, "Image URL is required"], trim: true },
        excerpt: { type: String, required: [true, "Excerpt is required"], trim: true },
        content: { type: String, default: "" },
        isPublished: { type: Boolean, default: true },
    },
    { timestamps: true }
);

BlogPostSchema.index({
    title: "text",
    excerpt: "text",
    content: "text",
    category: "text",
});

const BlogPost =
    mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;

import mongoose, { Document, Schema } from "mongoose";
import type { SitemapChangeFrequency } from "@/config/sitemap";

export interface IStaticPageOverride {
    path: string;
    included: boolean;
    priority: number;
    changeFrequency: SitemapChangeFrequency;
}

export interface ISitemapSettings extends Document {
    key: string;
    includeStaticPages: boolean;
    includeBlogPosts: boolean;
    includeCalculators: boolean;
    homePriority: number;
    calculatorIndexPriority: number;
    blogIndexPriority: number;
    staticDefaultPriority: number;
    calculatorPriority: number;
    blogPriority: number;
    homeChangeFrequency: SitemapChangeFrequency;
    calculatorIndexChangeFrequency: SitemapChangeFrequency;
    blogIndexChangeFrequency: SitemapChangeFrequency;
    staticDefaultChangeFrequency: SitemapChangeFrequency;
    calculatorChangeFrequency: SitemapChangeFrequency;
    blogChangeFrequency: SitemapChangeFrequency;
    staticPageOverrides: IStaticPageOverride[];
    createdAt: Date;
    updatedAt: Date;
}

const staticPageOverrideSchema = new Schema<IStaticPageOverride>(
    {
        path: {
            type: String,
            required: true,
            trim: true,
        },
        included: {
            type: Boolean,
            default: true,
        },
        priority: {
            type: Number,
            default: 0.7,
            min: 0,
            max: 1,
        },
        changeFrequency: {
            type: String,
            default: "monthly",
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const sitemapSettingsSchema = new Schema<ISitemapSettings>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: "primary",
            trim: true,
        },
        includeStaticPages: {
            type: Boolean,
            default: true,
        },
        includeBlogPosts: {
            type: Boolean,
            default: true,
        },
        includeCalculators: {
            type: Boolean,
            default: true,
        },
        homePriority: {
            type: Number,
            default: 1,
            min: 0,
            max: 1,
        },
        calculatorIndexPriority: {
            type: Number,
            default: 0.9,
            min: 0,
            max: 1,
        },
        blogIndexPriority: {
            type: Number,
            default: 0.9,
            min: 0,
            max: 1,
        },
        staticDefaultPriority: {
            type: Number,
            default: 0.7,
            min: 0,
            max: 1,
        },
        calculatorPriority: {
            type: Number,
            default: 0.8,
            min: 0,
            max: 1,
        },
        blogPriority: {
            type: Number,
            default: 0.8,
            min: 0,
            max: 1,
        },
        homeChangeFrequency: {
            type: String,
            default: "daily",
            trim: true,
        },
        calculatorIndexChangeFrequency: {
            type: String,
            default: "weekly",
            trim: true,
        },
        blogIndexChangeFrequency: {
            type: String,
            default: "monthly",
            trim: true,
        },
        staticDefaultChangeFrequency: {
            type: String,
            default: "monthly",
            trim: true,
        },
        calculatorChangeFrequency: {
            type: String,
            default: "weekly",
            trim: true,
        },
        blogChangeFrequency: {
            type: String,
            default: "monthly",
            trim: true,
        },
        staticPageOverrides: {
            type: [staticPageOverrideSchema],
            default: [],
        },
    },
    {
        collection: "sitemap_settings",
        timestamps: true,
    }
);

const SitemapSettings =
    (mongoose.models.SitemapSettings as mongoose.Model<ISitemapSettings> | undefined) ||
    mongoose.model<ISitemapSettings>("SitemapSettings", sitemapSettingsSchema);

export default SitemapSettings;

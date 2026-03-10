import mongoose, { Document, Schema } from "mongoose";

import { createDefaultAdsenseSettings } from "@/config/adsense";

export interface IAdsensePlacementSettings {
    enabled: boolean;
    slot: string;
    format: "auto" | "rectangle" | "horizontal" | "vertical";
    responsive: boolean;
}

export interface IAdsenseSettings extends Document {
    key: string;
    enabled: boolean;
    placements: {
        homeTop: IAdsensePlacementSettings;
        homeBottom: IAdsensePlacementSettings;
        blogTop: IAdsensePlacementSettings;
        blogBottom: IAdsensePlacementSettings;
        blogPostTop: IAdsensePlacementSettings;
        blogPostBottom: IAdsensePlacementSettings;
        calculatorsTop: IAdsensePlacementSettings;
        calculatorsBottom: IAdsensePlacementSettings;
    };
    createdAt: Date;
    updatedAt: Date;
}

const defaultSettings = createDefaultAdsenseSettings();

const PlacementSchema = new Schema<IAdsensePlacementSettings>(
    {
        enabled: {
            type: Boolean,
            default: true,
        },
        slot: {
            type: String,
            default: "",
            trim: true,
        },
        format: {
            type: String,
            enum: ["auto", "rectangle", "horizontal", "vertical"],
            default: "auto",
        },
        responsive: {
            type: Boolean,
            default: true,
        },
    },
    {
        _id: false,
    }
);

const AdsenseSettingsSchema = new Schema<IAdsenseSettings>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: "global",
        },
        enabled: {
            type: Boolean,
            default: defaultSettings.enabled,
        },
        placements: {
            homeTop: {
                type: PlacementSchema,
                default: defaultSettings.placements.homeTop,
            },
            homeBottom: {
                type: PlacementSchema,
                default: defaultSettings.placements.homeBottom,
            },
            blogTop: {
                type: PlacementSchema,
                default: defaultSettings.placements.blogTop,
            },
            blogBottom: {
                type: PlacementSchema,
                default: defaultSettings.placements.blogBottom,
            },
            blogPostTop: {
                type: PlacementSchema,
                default: defaultSettings.placements.blogPostTop,
            },
            blogPostBottom: {
                type: PlacementSchema,
                default: defaultSettings.placements.blogPostBottom,
            },
            calculatorsTop: {
                type: PlacementSchema,
                default: defaultSettings.placements.calculatorsTop,
            },
            calculatorsBottom: {
                type: PlacementSchema,
                default: defaultSettings.placements.calculatorsBottom,
            },
        },
    },
    {
        collection: "adsense_settings",
        timestamps: true,
    }
);

const AdsenseSettings =
    mongoose.models.AdsenseSettings ||
    mongoose.model<IAdsenseSettings>("AdsenseSettings", AdsenseSettingsSchema);

export default AdsenseSettings;

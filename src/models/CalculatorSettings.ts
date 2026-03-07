import mongoose, { Document, Schema } from "mongoose";

export interface ICalculatorSettings extends Document {
    key: string;
    disabledSlugs: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CalculatorSettingsSchema = new Schema<ICalculatorSettings>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: "global",
        },
        disabledSlugs: {
            type: [String],
            default: [],
        },
    },
    {
        collection: "calculator_settings",
        timestamps: true,
    }
);

const CalculatorSettings =
    mongoose.models.CalculatorSettings ||
    mongoose.model<ICalculatorSettings>("CalculatorSettings", CalculatorSettingsSchema);

export default CalculatorSettings;

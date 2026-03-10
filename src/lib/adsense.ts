import "server-only";

import {
    adsenseFormatOptions,
    adsensePlacementDefinitions,
    createDefaultAdsenseSettings,
    type AdsenseFormat,
    type AdsensePlacementKey,
    type AdsensePlacementSettings,
    type AdsenseSettingsRecord,
} from "@/config/adsense";
import { DBconnection } from "@/lib/db";
import AdsenseSettings from "@/models/AdsenseSettings";

const ADSENSE_SETTINGS_KEY = "global";

type PartialPlacementRecord = Partial<
    Record<AdsensePlacementKey, Partial<AdsensePlacementSettings>>
>;

type PartialAdsenseSettings = {
    enabled?: boolean;
    placements?: PartialPlacementRecord;
};

function isAdsenseFormat(value: unknown): value is AdsenseFormat {
    return adsenseFormatOptions.includes(value as AdsenseFormat);
}

function sanitizeSlot(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function mergePlacement(
    fallback: AdsensePlacementSettings,
    input?: Partial<AdsensePlacementSettings>
) {
    return {
        enabled: typeof input?.enabled === "boolean" ? input.enabled : fallback.enabled,
        slot: sanitizeSlot(input?.slot ?? fallback.slot),
        format: isAdsenseFormat(input?.format) ? input.format : fallback.format,
        responsive:
            typeof input?.responsive === "boolean"
                ? input.responsive
                : fallback.responsive,
    } satisfies AdsensePlacementSettings;
}

export function normalizeAdsenseSettings(
    input?: PartialAdsenseSettings | null
): AdsenseSettingsRecord {
    const defaults = createDefaultAdsenseSettings();

    const placements = Object.fromEntries(
        adsensePlacementDefinitions.map((definition) => [
            definition.key,
            mergePlacement(
                defaults.placements[definition.key],
                input?.placements?.[definition.key]
            ),
        ])
    ) as Record<AdsensePlacementKey, AdsensePlacementSettings>;

    return {
        enabled: typeof input?.enabled === "boolean" ? input.enabled : defaults.enabled,
        placements,
    };
}

export function getAdsensePublisherId() {
    return (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "").trim();
}

export function getMaskedAdsensePublisherId() {
    const publisherId = getAdsensePublisherId();

    if (!publisherId) {
        return "";
    }

    if (publisherId.length <= 8) {
        return publisherId;
    }

    return `${publisherId.slice(0, 7)}...${publisherId.slice(-4)}`;
}

export async function getAdsenseSettings() {
    await DBconnection();

    const settings = await AdsenseSettings.findOne({
        key: ADSENSE_SETTINGS_KEY,
    }).lean();

    return normalizeAdsenseSettings(settings);
}

export async function getAdsenseSettingsSafe() {
    try {
        return await getAdsenseSettings();
    } catch (error) {
        console.error("Failed to load AdSense settings:", error);
        return createDefaultAdsenseSettings();
    }
}

export async function updateAdsenseSettings(input: PartialAdsenseSettings | null | undefined) {
    const normalizedSettings = normalizeAdsenseSettings(input);

    await DBconnection();

    await AdsenseSettings.updateOne(
        { key: ADSENSE_SETTINGS_KEY },
        {
            $set: {
                key: ADSENSE_SETTINGS_KEY,
                enabled: normalizedSettings.enabled,
                placements: normalizedSettings.placements,
            },
        },
        { upsert: true }
    );

    return getAdsenseSettings();
}

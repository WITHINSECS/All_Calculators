"use client";

import { useEffect, useState } from "react";

import type {
    AdsensePlacementKey,
    AdsensePlacementSettings,
    AdsenseSettingsRecord,
} from "@/config/adsense";

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

type AdsenseAdProps = {
    placement: AdsensePlacementKey;
    className?: string;
    style?: React.CSSProperties;
};

type AdsensePublicApiResponse = {
    success: boolean;
    settings: AdsenseSettingsRecord;
    publisherIdConfigured: boolean;
};

const SETTINGS_TTL_MS = 10000;
let settingsCache: AdsenseSettingsRecord | null = null;
let settingsLoadedAt = 0;
let settingsRequest: Promise<AdsenseSettingsRecord | null> | null = null;

async function loadAdsenseSettings() {
    const now = Date.now();

    if (settingsCache && now - settingsLoadedAt < SETTINGS_TTL_MS) {
        return settingsCache;
    }

    if (settingsRequest) {
        return settingsRequest;
    }

    settingsRequest = fetch("/api/adsense", {
        cache: "no-store",
    })
        .then(async (response) => {
            const data: AdsensePublicApiResponse = await response.json();

            if (!response.ok || !data.success) {
                return null;
            }

            settingsCache = data.settings;
            settingsLoadedAt = Date.now();

            return data.settings;
        })
        .catch((error) => {
            console.error("Failed to load AdSense placements:", error);
            return null;
        })
        .finally(() => {
            settingsRequest = null;
        });

    return settingsRequest;
}

export default function AdsenseAd({
    placement,
    className,
    style,
}: AdsenseAdProps) {
    const [placementConfig, setPlacementConfig] = useState<AdsensePlacementSettings | null>(
        null
    );
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

    useEffect(() => {
        let isMounted = true;

        const loadPlacement = async () => {
            setPlacementConfig(null);
            const settings = await loadAdsenseSettings();

            if (!isMounted || !settings?.enabled) {
                setPlacementConfig(null);
                return;
            }

            const nextConfig = settings.placements[placement];

            if (!nextConfig || !nextConfig.enabled || !nextConfig.slot) {
                setPlacementConfig(null);
                return;
            }

            setPlacementConfig(nextConfig);
        };

        void loadPlacement();

        return () => {
            isMounted = false;
        };
    }, [placement]);

    useEffect(() => {
        if (!placementConfig || !publisherId) {
            return;
        }

        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        } catch { }
    }, [placementConfig, publisherId]);

    if (!publisherId || !placementConfig) {
        return null;
    }

    return (
        <ins
            key={`${placement}-${placementConfig.slot}`}
            className={`adsbygoogle ${className ?? ""}`.trim()}
            style={{ display: "block", ...style }}
            data-ad-client={publisherId}
            data-ad-slot={placementConfig.slot}
            data-ad-format={placementConfig.format}
            data-full-width-responsive={placementConfig.responsive ? "true" : "false"}
        />
    );
}

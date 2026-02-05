"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

type AdsenseAdProps = {
    slot: string;
    format?: "auto" | "rectangle" | "horizontal" | "vertical";
    responsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

export default function AdsenseAd({
    slot,
    format = "auto",
    responsive = true,
    className,
    style,
}: AdsenseAdProps) {
    useEffect(() => {
        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        } catch { }
    }, [slot]);

    return (
        <ins
            className={`adsbygoogle ${className ?? ""}`}
            style={{ display: "block", ...style }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
        />
    );
}

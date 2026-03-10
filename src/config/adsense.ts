export const adsenseFormatOptions = [
    "auto",
    "rectangle",
    "horizontal",
    "vertical",
] as const;

export type AdsenseFormat = (typeof adsenseFormatOptions)[number];

export const adsensePlacementDefinitions = [
    {
        key: "homeTop",
        label: "Home Top",
        description: "Shown between the homepage hero and featured sections.",
        routeHint: "/",
    },
    {
        key: "homeBottom",
        label: "Home Bottom",
        description: "Shown near the end of the homepage.",
        routeHint: "/",
    },
    {
        key: "blogTop",
        label: "Blog Listing Top",
        description: "Shown above the public blog listing grid.",
        routeHint: "/blog",
    },
    {
        key: "blogBottom",
        label: "Blog Listing Bottom",
        description: "Shown below the public blog listing grid.",
        routeHint: "/blog",
    },
    {
        key: "blogPostTop",
        label: "Blog Post Top",
        description: "Shown above individual blog post content.",
        routeHint: "/blog/[slug]",
    },
    {
        key: "blogPostBottom",
        label: "Blog Post Bottom",
        description: "Shown below individual blog post content.",
        routeHint: "/blog/[slug]",
    },
    {
        key: "calculatorsTop",
        label: "Calculators Top",
        description: "Shown above calculator listing and detail pages.",
        routeHint: "/calculators and /calculators/[slug]",
    },
    {
        key: "calculatorsBottom",
        label: "Calculators Bottom",
        description: "Shown below calculator listing and detail pages.",
        routeHint: "/calculators and /calculators/[slug]",
    },
] as const;

export type AdsensePlacementKey = (typeof adsensePlacementDefinitions)[number]["key"];

export type AdsensePlacementSettings = {
    enabled: boolean;
    slot: string;
    format: AdsenseFormat;
    responsive: boolean;
};

export type AdsenseSettingsRecord = {
    enabled: boolean;
    placements: Record<AdsensePlacementKey, AdsensePlacementSettings>;
};

const defaultPlacements: Record<AdsensePlacementKey, AdsensePlacementSettings> = {
    homeTop: {
        enabled: true,
        slot: "1234567890",
        format: "auto",
        responsive: true,
    },
    homeBottom: {
        enabled: true,
        slot: "2345678901",
        format: "auto",
        responsive: true,
    },
    blogTop: {
        enabled: true,
        slot: "3456789012",
        format: "auto",
        responsive: true,
    },
    blogBottom: {
        enabled: true,
        slot: "5678901234",
        format: "auto",
        responsive: true,
    },
    blogPostTop: {
        enabled: false,
        slot: "",
        format: "auto",
        responsive: true,
    },
    blogPostBottom: {
        enabled: false,
        slot: "",
        format: "auto",
        responsive: true,
    },
    calculatorsTop: {
        enabled: false,
        slot: "",
        format: "auto",
        responsive: true,
    },
    calculatorsBottom: {
        enabled: false,
        slot: "",
        format: "auto",
        responsive: true,
    },
};

export function createDefaultAdsenseSettings(): AdsenseSettingsRecord {
    return {
        enabled: true,
        placements: {
            homeTop: { ...defaultPlacements.homeTop },
            homeBottom: { ...defaultPlacements.homeBottom },
            blogTop: { ...defaultPlacements.blogTop },
            blogBottom: { ...defaultPlacements.blogBottom },
            blogPostTop: { ...defaultPlacements.blogPostTop },
            blogPostBottom: { ...defaultPlacements.blogPostBottom },
            calculatorsTop: { ...defaultPlacements.calculatorsTop },
            calculatorsBottom: { ...defaultPlacements.calculatorsBottom },
        },
    };
}

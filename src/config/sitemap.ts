export type SitemapChangeFrequency =
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";

export type SitemapSectionSettings = {
    includeStaticPages: boolean;
    includeBlogPosts: boolean;
    includeCalculators: boolean;
};

export type SitemapPrioritySettings = {
    homePriority: number;
    calculatorIndexPriority: number;
    blogIndexPriority: number;
    staticDefaultPriority: number;
    calculatorPriority: number;
    blogPriority: number;
};

export type SitemapFrequencySettings = {
    homeChangeFrequency: SitemapChangeFrequency;
    calculatorIndexChangeFrequency: SitemapChangeFrequency;
    blogIndexChangeFrequency: SitemapChangeFrequency;
    staticDefaultChangeFrequency: SitemapChangeFrequency;
    calculatorChangeFrequency: SitemapChangeFrequency;
    blogChangeFrequency: SitemapChangeFrequency;
};

export type SitemapStaticPageOverrideRecord = {
    path: string;
    included: boolean;
    priority: number;
    changeFrequency: SitemapChangeFrequency;
};

export type SitemapSettingsRecord = SitemapSectionSettings &
    SitemapPrioritySettings &
    SitemapFrequencySettings & {
        staticPageOverrides: SitemapStaticPageOverrideRecord[];
    };

export type SitemapDashboardPageRecord = SitemapStaticPageOverrideRecord & {
    label: string;
};

export const sitemapChangeFrequencyOptions: SitemapChangeFrequency[] = [
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
];

export function createDefaultSitemapSettings(): SitemapSettingsRecord {
    return {
        includeStaticPages: true,
        includeBlogPosts: true,
        includeCalculators: true,
        homePriority: 1,
        calculatorIndexPriority: 0.9,
        blogIndexPriority: 0.9,
        staticDefaultPriority: 0.7,
        calculatorPriority: 0.8,
        blogPriority: 0.8,
        homeChangeFrequency: "daily",
        calculatorIndexChangeFrequency: "weekly",
        blogIndexChangeFrequency: "monthly",
        staticDefaultChangeFrequency: "monthly",
        calculatorChangeFrequency: "weekly",
        blogChangeFrequency: "monthly",
        staticPageOverrides: [],
    };
}

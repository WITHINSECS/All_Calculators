const fallbackSiteUrl = "https://withinsecs.com";

function normalizeSiteUrl(value: string) {
    if (!value) {
        return fallbackSiteUrl;
    }

    const withProtocol = value.startsWith("http://") || value.startsWith("https://")
        ? value
        : `https://${value}`;

    return withProtocol.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? fallbackSiteUrl
);

import "server-only";

import type { Metadata } from "next";

import { getCachedCalculatorPageContentSafe } from "@/lib/calculator-page-content-cache";
import { siteUrl } from "@/lib/site";

export async function getCalculatorPageMetadata(slug: string): Promise<Metadata> {
    const item = await getCachedCalculatorPageContentSafe(slug);
    const title =
        item.seoTitle ||
        item.pageHeading ||
        (item.slug === "calculators" ? "All Calculators" : item.defaultTitle || item.title);
    const description =
        item.seoDescription ||
        item.pageIntro ||
        item.defaultDescription ||
        item.description;
    const canonicalUrl = `${siteUrl}${item.path}`;

    return {
        title,
        description,
        alternates: {
            canonical: item.path,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/blog";
import { calculatorCatalog } from "@/lib/calculator-catalog";
import { getVisibleCalculatorCatalogSafe } from "@/lib/calculator-visibility";
import {
    getEffectiveStaticPageSettings,
    getSitemapSettings,
} from "@/lib/sitemap-settings";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildAbsoluteUrl(pathname: string) {
    return `${siteUrl}${pathname}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const settings = await getSitemapSettings();
    const staticPageSettings = getEffectiveStaticPageSettings(settings);

    const staticEntries: MetadataRoute.Sitemap = settings.includeStaticPages
        ? staticPageSettings
              .filter((page) => page.included)
              .map((page) => ({
                  url: buildAbsoluteUrl(page.path),
                  lastModified: now,
                  changeFrequency: page.changeFrequency,
                  priority: page.priority,
              }))
        : [];

    let calculatorEntries: MetadataRoute.Sitemap = [];

    if (settings.includeCalculators) {
        try {
            const visibleCalculators = await getVisibleCalculatorCatalogSafe();

            calculatorEntries = visibleCalculators.map((calculator) => ({
                url: buildAbsoluteUrl(calculator.path),
                lastModified: now,
                changeFrequency: settings.calculatorChangeFrequency,
                priority: settings.calculatorPriority,
            }));
        } catch (error) {
            console.error("Failed to include calculator routes in sitemap:", error);

            calculatorEntries = calculatorCatalog.map((calculator) => ({
                url: buildAbsoluteUrl(calculator.path),
                lastModified: now,
                changeFrequency: settings.calculatorChangeFrequency,
                priority: settings.calculatorPriority,
            }));
        }
    }

    if (!settings.includeBlogPosts) {
        return [...staticEntries, ...calculatorEntries];
    }

    try {
        const blogPosts = await getBlogPosts({ publishedOnly: true });

        const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
            url: buildAbsoluteUrl(`/blog/${post.slug}`),
            lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
            changeFrequency: settings.blogChangeFrequency,
            priority: settings.blogPriority,
        }));

        return [...staticEntries, ...calculatorEntries, ...blogEntries];
    } catch (error) {
        console.error("Failed to include blog posts in sitemap:", error);
        return [...staticEntries, ...calculatorEntries];
    }
}

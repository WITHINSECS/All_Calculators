import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/blog";
import { calculatorCatalog } from "@/lib/calculator-catalog";
import { getVisibleCalculatorCatalogSafe } from "@/lib/calculator-visibility";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const pagesDirectory = join(process.cwd(), "src", "app", "(pages)");
const excludedTopLevelRoutes = new Set(["dashboard", "login", "signup", "home"]);

function shouldIncludePath(pathname: string) {
    if (pathname === "/") {
        return true;
    }

    if (pathname.startsWith("/calculators/")) {
        return false;
    }

    const firstSegment = pathname.split("/").filter(Boolean)[0];
    return firstSegment ? !excludedTopLevelRoutes.has(firstSegment) : true;
}

function collectStaticRoutes(directory: string, segments: string[] = []) {
    const routes: string[] = [];
    const entries = readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name.startsWith("[") && entry.name.endsWith("]")) {
                continue;
            }

            const nextSegments =
                entry.name.startsWith("(") && entry.name.endsWith(")")
                    ? segments
                    : [...segments, entry.name];

            routes.push(...collectStaticRoutes(join(directory, entry.name), nextSegments));
            continue;
        }

        if (entry.isFile() && entry.name === "page.tsx") {
            const pathname = segments.length ? `/${segments.join("/")}` : "/";

            if (shouldIncludePath(pathname)) {
                routes.push(pathname);
            }
        }
    }

    return routes;
}

function buildAbsoluteUrl(pathname: string) {
    return `${siteUrl}${pathname}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const staticRoutes = Array.from(
        new Set(["/", ...collectStaticRoutes(pagesDirectory)])
    ).sort((a, b) => a.localeCompare(b));

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((pathname) => ({
        url: buildAbsoluteUrl(pathname),
        lastModified: now,
        changeFrequency:
            pathname === "/" ? "daily" : pathname.startsWith("/calculators") ? "weekly" : "monthly",
        priority:
            pathname === "/" ? 1 : pathname === "/calculators" || pathname === "/blog" ? 0.9 : 0.7,
    }));

    let calculatorEntries: MetadataRoute.Sitemap = [];

    try {
        const visibleCalculators = await getVisibleCalculatorCatalogSafe();

        calculatorEntries = visibleCalculators.map((calculator) => ({
            url: buildAbsoluteUrl(calculator.path),
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        }));
    } catch (error) {
        console.error("Failed to include calculator routes in sitemap:", error);

        calculatorEntries = calculatorCatalog.map((calculator) => ({
            url: buildAbsoluteUrl(calculator.path),
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        }));
    }

    try {
        const blogPosts = await getBlogPosts({ publishedOnly: true });

        const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
            url: buildAbsoluteUrl(`/blog/${post.slug}`),
            lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
            changeFrequency: "monthly",
            priority: 0.8,
        }));

        return [...staticEntries, ...calculatorEntries, ...blogEntries];
    } catch (error) {
        console.error("Failed to include blog posts in sitemap:", error);
        return [...staticEntries, ...calculatorEntries];
    }
}

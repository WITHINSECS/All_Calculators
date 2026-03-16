import "server-only";

import { readdirSync } from "node:fs";
import { join } from "node:path";

import { DBconnection } from "@/lib/db";
import {
    createDefaultSitemapSettings,
    sitemapChangeFrequencyOptions,
    type SitemapChangeFrequency,
    type SitemapDashboardPageRecord,
    type SitemapSettingsRecord,
    type SitemapStaticPageOverrideRecord,
} from "@/config/sitemap";
import SitemapSettings, {
    type IStaticPageOverride,
} from "@/models/SitemapSettings";

const pagesDirectory = join(process.cwd(), "src", "app", "(pages)");
const excludedTopLevelRoutes = new Set(["dashboard", "login", "signup", "home"]);
const singletonKey = "primary";

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
                entry.name.startsWith("(") && entry.name.endsWith(")") ? segments : [...segments, entry.name];

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

export function getStaticSitemapRoutes() {
    return Array.from(new Set(["/", ...collectStaticRoutes(pagesDirectory)])).sort((a, b) =>
        a.localeCompare(b)
    );
}

function normalizeFrequency(value: unknown, fallback: SitemapChangeFrequency): SitemapChangeFrequency {
    return sitemapChangeFrequencyOptions.includes(value as SitemapChangeFrequency)
        ? (value as SitemapChangeFrequency)
        : fallback;
}

function normalizePriority(value: unknown, fallback: number) {
    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
        return fallback;
    }

    return Math.min(1, Math.max(0, Number(numeric.toFixed(2))));
}

function normalizeStaticOverrides(
    input: IStaticPageOverride[] | SitemapStaticPageOverrideRecord[] | undefined,
    validRoutes: string[],
    defaults: SitemapSettingsRecord
) {
    const validRouteSet = new Set(validRoutes);

    return (input ?? [])
        .map((item) => ({
            path: String(item?.path ?? "").trim(),
            included: Boolean(item?.included),
            priority: normalizePriority(item?.priority, defaults.staticDefaultPriority),
            changeFrequency: normalizeFrequency(
                item?.changeFrequency,
                defaults.staticDefaultChangeFrequency
            ),
        }))
        .filter((item) => validRouteSet.has(item.path));
}

function normalizeSettings(
    input: Partial<SitemapSettingsRecord> | null | undefined,
    validRoutes = getStaticSitemapRoutes()
): SitemapSettingsRecord {
    const defaults = createDefaultSitemapSettings();

    return {
        includeStaticPages:
            typeof input?.includeStaticPages === "boolean"
                ? input.includeStaticPages
                : defaults.includeStaticPages,
        includeBlogPosts:
            typeof input?.includeBlogPosts === "boolean"
                ? input.includeBlogPosts
                : defaults.includeBlogPosts,
        includeCalculators:
            typeof input?.includeCalculators === "boolean"
                ? input.includeCalculators
                : defaults.includeCalculators,
        homePriority: normalizePriority(input?.homePriority, defaults.homePriority),
        calculatorIndexPriority: normalizePriority(
            input?.calculatorIndexPriority,
            defaults.calculatorIndexPriority
        ),
        blogIndexPriority: normalizePriority(input?.blogIndexPriority, defaults.blogIndexPriority),
        staticDefaultPriority: normalizePriority(
            input?.staticDefaultPriority,
            defaults.staticDefaultPriority
        ),
        calculatorPriority: normalizePriority(input?.calculatorPriority, defaults.calculatorPriority),
        blogPriority: normalizePriority(input?.blogPriority, defaults.blogPriority),
        homeChangeFrequency: normalizeFrequency(
            input?.homeChangeFrequency,
            defaults.homeChangeFrequency
        ),
        calculatorIndexChangeFrequency: normalizeFrequency(
            input?.calculatorIndexChangeFrequency,
            defaults.calculatorIndexChangeFrequency
        ),
        blogIndexChangeFrequency: normalizeFrequency(
            input?.blogIndexChangeFrequency,
            defaults.blogIndexChangeFrequency
        ),
        staticDefaultChangeFrequency: normalizeFrequency(
            input?.staticDefaultChangeFrequency,
            defaults.staticDefaultChangeFrequency
        ),
        calculatorChangeFrequency: normalizeFrequency(
            input?.calculatorChangeFrequency,
            defaults.calculatorChangeFrequency
        ),
        blogChangeFrequency: normalizeFrequency(
            input?.blogChangeFrequency,
            defaults.blogChangeFrequency
        ),
        staticPageOverrides: normalizeStaticOverrides(input?.staticPageOverrides, validRoutes, defaults),
    };
}

export function getEffectiveStaticPageSettings(
    settings: SitemapSettingsRecord,
    validRoutes = getStaticSitemapRoutes()
): SitemapDashboardPageRecord[] {
    const overrides = new Map(settings.staticPageOverrides.map((item) => [item.path, item]));

    return validRoutes.map((path) => {
        const override = overrides.get(path);

        return {
            path,
            label: path === "/" ? "Homepage" : path.replace(/^\//, ""),
            included: override?.included ?? true,
            priority:
                override?.priority ??
                (path === "/"
                    ? settings.homePriority
                    : path === "/calculators"
                      ? settings.calculatorIndexPriority
                      : path === "/blog"
                        ? settings.blogIndexPriority
                        : settings.staticDefaultPriority),
            changeFrequency:
                override?.changeFrequency ??
                (path === "/"
                    ? settings.homeChangeFrequency
                    : path === "/calculators"
                      ? settings.calculatorIndexChangeFrequency
                      : path === "/blog"
                        ? settings.blogIndexChangeFrequency
                        : settings.staticDefaultChangeFrequency),
        };
    });
}

export async function getSitemapSettings() {
    const routes = getStaticSitemapRoutes();

    await DBconnection();

    const doc = await SitemapSettings.findOne({ key: singletonKey }).lean();
    return normalizeSettings(doc, routes);
}

export async function getSitemapDashboardSettings() {
    const routes = getStaticSitemapRoutes();
    const settings = await getSitemapSettings();

    return {
        settings,
        staticPages: getEffectiveStaticPageSettings(settings, routes),
    };
}

export async function updateSitemapSettings(input: Partial<SitemapSettingsRecord>) {
    const routes = getStaticSitemapRoutes();
    const normalized = normalizeSettings(input, routes);

    await DBconnection();

    await SitemapSettings.updateOne(
        { key: singletonKey },
        {
            $set: {
                key: singletonKey,
                ...normalized,
            },
        },
        { upsert: true }
    );

    return {
        settings: normalized,
        staticPages: getEffectiveStaticPageSettings(normalized, routes),
    };
}

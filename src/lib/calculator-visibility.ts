import "server-only";

import {
    calculatorCatalog,
    calculatorCategoryOrder,
    groupCalculatorsByCategory,
    isKnownCalculatorSlug,
    normalizeCalculatorSlug,
    type CalculatorCatalogItem,
} from "@/lib/calculator-catalog";
import { DBconnection } from "@/lib/db";
import CalculatorSettings from "@/models/CalculatorSettings";

const CALCULATOR_SETTINGS_KEY = "global";

export type ManagedCalculatorItem = CalculatorCatalogItem & {
    enabled: boolean;
};

export function buildCalculatorVisibilitySummary(items: ManagedCalculatorItem[]) {
    const enabledCount = items.filter((item) => item.enabled).length;

    return {
        total: items.length,
        enabled: enabledCount,
        disabled: items.length - enabledCount,
    };
}

function sortManagedCalculators(items: ManagedCalculatorItem[]) {
    return [...items].sort((left, right) => {
        const categoryDifference =
            calculatorCategoryOrder.indexOf(left.category) -
            calculatorCategoryOrder.indexOf(right.category);

        if (categoryDifference !== 0) {
            return categoryDifference;
        }

        return left.title.localeCompare(right.title);
    });
}

function sanitizeDisabledSlugs(slugs: string[]) {
    return Array.from(
        new Set(
            slugs
                .map((slug) => normalizeCalculatorSlug(String(slug)))
                .filter((slug) => slug.length > 0 && isKnownCalculatorSlug(slug))
        )
    );
}

async function readDisabledSlugs() {
    await DBconnection();

    const settings = await CalculatorSettings.findOne({
        key: CALCULATOR_SETTINGS_KEY,
    }).lean();

    return sanitizeDisabledSlugs(settings?.disabledSlugs ?? []);
}

export async function getDisabledCalculatorSlugs() {
    return readDisabledSlugs();
}

export async function getManagedCalculators() {
    const disabledSlugs = new Set(await readDisabledSlugs());

    return sortManagedCalculators(
        calculatorCatalog.map((item) => ({
            ...item,
            enabled: !disabledSlugs.has(item.slug),
        }))
    );
}

export async function getVisibleCalculatorCatalog() {
    const disabledSlugs = new Set(await readDisabledSlugs());

    return calculatorCatalog.filter((item) => !disabledSlugs.has(item.slug));
}

export async function getVisibleCalculatorGroups() {
    return groupCalculatorsByCategory(await getVisibleCalculatorCatalog());
}

export async function getVisibleCalculatorCatalogSafe() {
    try {
        return await getVisibleCalculatorCatalog();
    } catch (error) {
        console.error("Failed to load calculator visibility settings:", error);
        return calculatorCatalog;
    }
}

export async function getVisibleCalculatorGroupsSafe() {
    return groupCalculatorsByCategory(await getVisibleCalculatorCatalogSafe());
}

export async function getCalculatorVisibility(slug: string) {
    const normalizedSlug = normalizeCalculatorSlug(slug);

    if (!normalizedSlug || !isKnownCalculatorSlug(normalizedSlug)) {
        return {
            known: false,
            enabled: false,
            slug: normalizedSlug,
        };
    }

    const disabledSlugs = new Set(await readDisabledSlugs());

    return {
        known: true,
        enabled: !disabledSlugs.has(normalizedSlug),
        slug: normalizedSlug,
    };
}

export async function setCalculatorEnabled(slug: string, enabled: boolean) {
    const normalizedSlug = normalizeCalculatorSlug(slug);

    if (!normalizedSlug || !isKnownCalculatorSlug(normalizedSlug)) {
        throw new Error("Unknown calculator slug.");
    }

    await DBconnection();

    await CalculatorSettings.updateOne(
        { key: CALCULATOR_SETTINGS_KEY },
        enabled
            ? {
                  $setOnInsert: { key: CALCULATOR_SETTINGS_KEY },
                  $pull: { disabledSlugs: normalizedSlug },
              }
            : {
                  $setOnInsert: { key: CALCULATOR_SETTINGS_KEY },
                  $addToSet: { disabledSlugs: normalizedSlug },
              },
        { upsert: true }
    );

    const items = await getManagedCalculators();
    const updatedItem = items.find((item) => item.slug === normalizedSlug);

    if (!updatedItem) {
        throw new Error("Failed to load updated calculator settings.");
    }

    return {
        item: updatedItem,
        items,
    };
}

export async function getCalculatorVisibilitySummary() {
    return buildCalculatorVisibilitySummary(await getManagedCalculators());
}

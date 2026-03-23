import "server-only";

import { unstable_cache } from "next/cache";

import { getCalculatorPageContentSafe } from "@/lib/calculator-page-content";

const getCachedCalculatorPageContent = unstable_cache(
    async (slug: string) => getCalculatorPageContentSafe(slug),
    ["calculator-page-content"],
    {
        tags: ["calculator-page-content"],
    }
);

export function getCachedCalculatorPageContentSafe(slug: string) {
    return getCachedCalculatorPageContent(slug);
}

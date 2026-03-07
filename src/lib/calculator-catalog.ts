import {
    DATA__FINANCE,
    DATA__HEALTH,
    DATA__MATH,
    LIFESTYLE__MATH,
} from "@/mock/calculators";

export type CalculatorCategory = "finance" | "health" | "lifestyle" | "math";

type CalculatorSource = {
    title: string;
    subTitle: string;
    description: string;
    link: string;
    category: CalculatorCategory;
};

export type CalculatorCatalogItem = CalculatorSource & {
    slug: string;
    path: string;
};

export const calculatorCategoryOrder: CalculatorCategory[] = [
    "finance",
    "health",
    "lifestyle",
    "math",
];

export const calculatorCategoryLabels: Record<CalculatorCategory, string> = {
    finance: "Finance",
    health: "Health",
    lifestyle: "Lifestyle",
    math: "Math",
};

function normalizeCalculatorCategory(category: string): CalculatorCategory {
    switch (category) {
        case "health":
        case "lifestyle":
        case "math":
            return category;
        case "finance":
        default:
            return "finance";
    }
}

const catalogSources = [
    ...DATA__FINANCE,
    ...DATA__HEALTH,
    ...LIFESTYLE__MATH,
    ...DATA__MATH,
];

export const calculatorCatalog: CalculatorCatalogItem[] = catalogSources.map((item) => {
    const slug = item.link.replace(/^\/+/, "");

    return {
        ...item,
        category: normalizeCalculatorCategory(item.category),
        slug,
        path: `/calculators/${slug}`,
    };
});

const calculatorSlugSet = new Set(calculatorCatalog.map((item) => item.slug));

export function normalizeCalculatorSlug(value: string) {
    return value.replace(/^\/+|\/+$/g, "");
}

export function isKnownCalculatorSlug(slug: string) {
    return calculatorSlugSet.has(normalizeCalculatorSlug(slug));
}

export function groupCalculatorsByCategory<T extends { category: CalculatorCategory }>(items: T[]) {
    return {
        finance: items.filter((item) => item.category === "finance"),
        health: items.filter((item) => item.category === "health"),
        lifestyle: items.filter((item) => item.category === "lifestyle"),
        math: items.filter((item) => item.category === "math"),
    };
}

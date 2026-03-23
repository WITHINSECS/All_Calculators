import type { Metadata } from "next";
import type { ReactNode } from "react";

import HideLegacyCalculatorHero from "@/components/Calculators/HideLegacyCalculatorHero";
import ServerManagedCalculatorContent from "@/components/Calculators/ServerManagedCalculatorContent";
import ServerManagedCalculatorHero from "@/components/Calculators/ServerManagedCalculatorHero";
import { getCalculatorPageMetadata } from "@/lib/calculator-metadata";
import { getCachedCalculatorPageContentSafe } from "@/lib/calculator-page-content-cache";

export async function generateMetadata(): Promise<Metadata> {
    return getCalculatorPageMetadata("salary-hike-calculator");
}

export default async function CalculatorRouteLayout({
    children,
}: {
    children: ReactNode;
}) {
    const item = await getCachedCalculatorPageContentSafe("salary-hike-calculator");

    return (
        <>
            {item.hasHeroOverrides ? <ServerManagedCalculatorHero item={item} /> : null}
            {item.hasHeroOverrides ? (
                <style>{`
                    [data-managed-calculator-legacy-root] h1:first-of-type,
                    [data-managed-calculator-legacy-root] h1:first-of-type + p {
                        display: none;
                    }
                `}</style>
            ) : null}
            <div data-managed-calculator-legacy-root>
                {item.hasHeroOverrides ? <HideLegacyCalculatorHero /> : null}
                {children}
            </div>
            <ServerManagedCalculatorContent item={item} />
        </>
    );
}

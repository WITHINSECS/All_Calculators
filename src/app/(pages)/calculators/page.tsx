import type { Metadata } from "next";

import CalculatorCard from "@/components/Calculators/CalculatorCard";
import ServerManagedCalculatorContent from "@/components/Calculators/ServerManagedCalculatorContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculatorCategoryLabels, calculatorCategoryOrder } from "@/lib/calculator-catalog";
import { getCachedCalculatorPageContentSafe } from "@/lib/calculator-page-content-cache";
import { getCalculatorPageMetadata } from "@/lib/calculator-metadata";
import { getVisibleCalculatorGroupsSafe } from "@/lib/calculator-visibility";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function generateMetadata(): Promise<Metadata> {
    return getCalculatorPageMetadata("calculators");
}

export default async function CalculatorsPage() {
    const [calculatorGroups, managedPage] = await Promise.all([
        getVisibleCalculatorGroupsSafe(),
        getCachedCalculatorPageContentSafe("calculators"),
    ]);
    const sections = calculatorCategoryOrder.map((category) => ({
        category,
        label: calculatorCategoryLabels[category],
        items: calculatorGroups[category],
    }));
    const defaultTab = sections.find((section) => section.items.length > 0)?.category ?? "finance";
    const heading = managedPage.pageHeading || "All Calculators";
    const intro =
        managedPage.pageIntro ||
        "Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.";

    return (
        <>
            <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
                <div className="mx-auto mt-8 max-w-3xl text-center md:mt-16">
                    <h1 className="text-3xl font-semibold lg:text-4xl">{heading}</h1>
                    <p className="text-muted-foreground mt-4 text-xl">{intro}</p>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto p-5 md:mt-16 my-8 md:mb-20 mb-10 md:px-12 ">
                <Tabs defaultValue={defaultTab} className="max-w-7xl w-full mx-auto">
                    <div className="flex mb-8 items-center justify-center">
                        <TabsList className="">
                            {sections.map((section) => (
                                <TabsTrigger
                                    key={section.category}
                                    value={section.category}
                                    disabled={section.items.length === 0}
                                >
                                    {section.label}{" "}
                                    <span className="hidden md:inline-block">Calculator</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    {sections.map((section) => (
                        <TabsContent key={section.category} value={section.category}>
                            {section.items.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                    {section.items.map((item) => (
                                        <CalculatorCard key={item.slug} {...item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed px-6 py-14 text-center text-sm text-muted-foreground">
                                    No {section.label.toLowerCase()} calculators are enabled right
                                    now.
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <ServerManagedCalculatorContent item={managedPage} />
        </>
    );
}

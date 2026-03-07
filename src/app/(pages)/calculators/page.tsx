import Wrapper from "@/app/Wrapper";
import CalculatorCard from "@/components/Calculators/CalculatorCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVisibleCalculatorGroupsSafe } from "@/lib/calculator-visibility";
import { calculatorCategoryLabels, calculatorCategoryOrder } from "@/lib/calculator-catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function CalculatorsPage() {
    const calculatorGroups = await getVisibleCalculatorGroupsSafe();
    const sections = calculatorCategoryOrder.map((category) => ({
        category,
        label: calculatorCategoryLabels[category],
        items: calculatorGroups[category],
    }));
    const defaultTab = sections.find((section) => section.items.length > 0)?.category ?? "finance";

    return (
        <Wrapper>
            <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
                <div className="mx-auto md:mt-16 mt-8 max-w-3xl text-center">
                    <h1 className="text-3xl font-semibold lg:text-4xl">
                        All Calculators
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
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
        </Wrapper>
    );
}

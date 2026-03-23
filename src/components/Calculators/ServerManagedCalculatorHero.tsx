import type { CalculatorPageContentRecord } from "@/lib/calculator-page-content";

type ServerManagedCalculatorHeroProps = {
    item: CalculatorPageContentRecord;
};

export default function ServerManagedCalculatorHero({
    item,
}: ServerManagedCalculatorHeroProps) {
    if (!item.hasHeroOverrides) {
        return null;
    }

    const heading = item.pageHeading || item.defaultTitle || item.title;
    const intro = item.pageIntro || item.defaultDescription || item.description;

    return (
        <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
            <div className="mx-auto mt-8 max-w-4xl text-center md:mt-16">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                    {heading}
                </h1>
                {intro ? (
                    <p className="mt-4 text-lg leading-8 text-slate-600 md:text-xl">
                        {intro}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

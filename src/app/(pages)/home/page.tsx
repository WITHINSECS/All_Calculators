import Link from "next/link";
import {
    ArrowRight,
    Calculator,
    Clock3,
    HeartPulse,
    Landmark,
    Sparkles,
    Sigma,
    type LucideIcon,
} from "lucide-react";

import Wrapper from "@/app/Wrapper";
import AdsenseAd from "@/components/AdsenseAd";
import BlogSectionSlider from "@/components/BlogSectionSlider";
import HeroCalculator from "@/components/Home/HeroCalculator";
import Services from "@/components/Home/Services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    calculatorCategoryLabels,
    calculatorCategoryOrder,
    groupCalculatorsByCategory,
    type CalculatorCategory,
} from "@/lib/calculator-catalog";
import { getVisibleCalculatorCatalogSafe } from "@/lib/calculator-visibility";
import { siteConfig } from "@/lib/siteConfig";

const featuredPriority = [
    "emi-calculator",
    "401k-calculator",
    "currency-converter",
    "health/bmi-calculator",
    "math/percentage-calculator",
    "lifestyle/age-calculator",
    "mortgage-calculator",
    "health/calorie-calculator",
];

const collectionDescriptions: Record<CalculatorCategory, string> = {
    finance: "Loans, mortgages, investing, savings, tax planning, and quick money math.",
    health: "Fitness, body metrics, calories, pregnancy, and wellness tracking tools.",
    lifestyle: "Everyday calculators for time, travel, shopping, school, and planning.",
    math: "Percentages, averages, algebra, scientific math, and unit conversions.",
};

const categoryIconMap: Record<CalculatorCategory, LucideIcon> = {
    finance: Landmark,
    health: HeartPulse,
    lifestyle: Sparkles,
    math: Sigma,
};

const featureCards = [
    {
        title: "Start fast",
        description: "Open a calculator, type the numbers, and get the result without digging through cluttered menus.",
        icon: Clock3,
    },
    {
        title: "Stay in one place",
        description: "Finance, health, lifestyle, and math tools live in one catalog so you do not have to jump across sites.",
        icon: Calculator,
    },
    {
        title: "Keep it readable",
        description: "The layout is built for quick scanning, direct inputs, and simple follow-through to the tool you need.",
        icon: Sparkles,
    },
];

export default async function Page() {
    const visibleCalculators = await getVisibleCalculatorCatalogSafe();
    const groupedCalculators = groupCalculatorsByCategory(visibleCalculators);
    const prioritizedFeaturedCalculators = featuredPriority
        .map((slug) => visibleCalculators.find((calculator) => calculator.slug === slug))
        .filter(
            (calculator): calculator is (typeof visibleCalculators)[number] =>
                calculator !== undefined
        );
    const featuredCalculatorSlugs = new Set(
        prioritizedFeaturedCalculators.map((calculator) => calculator.slug)
    );
    const featuredCalculators = [
        ...prioritizedFeaturedCalculators,
        ...visibleCalculators.filter((calculator) => !featuredCalculatorSlugs.has(calculator.slug)),
    ].slice(0, 6);

    const collections = calculatorCategoryOrder.map((category) => ({
        key: category,
        title: calculatorCategoryLabels[category],
        description: collectionDescriptions[category],
        count: groupedCalculators[category].length,
    }));

    const heroStats = [
        {
            label: "Live calculators",
            value: `${visibleCalculators.length}+`,
        },
        {
            label: "Collections",
            value: `${collections.length}`,
        },
        {
            label: "Quick picks",
            value: `${featuredCalculators.length}`,
        },
    ];

    return (
        <Wrapper className="overflow-x-hidden">
            <section className="relative overflow-hidden pb-14 pt-8 md:pb-24 md:pt-12">
                <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[linear-gradient(180deg,rgba(239,246,255,0.95)_0%,rgba(255,255,255,0.9)_55%,rgba(255,255,255,0)_100%)]" />
                <div className="absolute left-0 top-10 -z-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
                <div className="absolute right-0 top-28 -z-10 h-80 w-80 rounded-full bg-slate-300/35 blur-3xl" />

                <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
                    <div className="space-y-8">
                        <Badge
                            variant="outline"
                            className="rounded-full border-slate-200 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm backdrop-blur"
                        >
                            {siteConfig.name} Calculator Studio
                        </Badge>

                        <div className="space-y-5">
                            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-balance text-slate-950 md:text-6xl xl:text-6xl">
                                Calculator answers that feel instant, not industrial.
                            </h1>
                            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                                Explore finance, health, lifestyle, and math calculators from one
                                clean hub. Use the live calculator in the hero or jump directly to
                                the tools people reach for most.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="rounded-full px-7">
                                <Link href="/calculators">
                                    Browse Calculators
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                                <Link href="/blog">Read Blog Guides</Link>
                            </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {heroStats.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[24px] border border-slate-200/80 bg-white/80 px-5 py-4 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur"
                                >
                                    <p className="text-3xl font-semibold text-slate-950">
                                        {item.value}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-[30px] border border-slate-200/80 bg-white/78 p-5 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                                        Featured Calculators
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">
                                        Jump straight to a live tool instead of scrolling the full
                                        catalog.
                                    </p>
                                </div>

                                <Link
                                    href="/calculators"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-900"
                                >
                                    View all
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                {featuredCalculators.map((calculator) => {
                                    const Icon = categoryIconMap[calculator.category];

                                    return (
                                        <Link
                                            key={calculator.slug}
                                            href={calculator.path}
                                            className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
                                        >
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span>{calculator.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <HeroCalculator />

                        <div className="grid gap-3 sm:grid-cols-3">
                            {collections.slice(0, 3).map((collection) => {
                                const Icon = categoryIconMap[collection.key];

                                return (
                                    <div
                                        key={collection.key}
                                        className="rounded-[24px] border border-slate-200/80 bg-white/85 px-4 py-4 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.4)] backdrop-blur"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-950">
                                                    {collection.title}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {collection.count} live tools
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <AdsenseAd placement="homeTop" />

            <div className="mt-14 md:mt-20">
                <Services collections={collections} />
            </div>

            <div className="container mx-auto mt-14 px-4 md:mt-20 2xl:max-w-[1400px]">
                <div className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_45%,#f8fafc_100%)] p-6 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.45)] md:p-8">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
                            Why {siteConfig.name}
                        </p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                            Built for people who want the answer, not the clutter.
                        </h2>
                    </div>

                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {featureCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.title}
                                    className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.35)]"
                                >
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-5 text-xl font-semibold text-slate-950">
                                        {card.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {card.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-14 md:mt-20">
                <BlogSectionSlider />
            </div>

            <AdsenseAd placement="homeBottom" />

            <div className="mt-14 md:mt-20 mb-10">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="overflow-hidden rounded-[36px] border border-slate-200/20 bg-[linear-gradient(140deg,#0f172a_0%,#111827_45%,#164e63_100%)] px-6 py-12 text-center shadow-[0_34px_80px_-45px_rgba(8,15,32,0.65)] md:px-10 md:py-16">
                        <p className="text-xs font-semibold uppercase tracking-[0.36em] text-sky-200">
                            Start Calculating
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                            Open the tool you need and get an answer in seconds.
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                            From EMI and mortgage planning to BMI and percentage math,
                            {` ${siteConfig.name} `}keeps the calculator catalog fast, clear, and
                            easy to browse.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg" variant="secondary" className="rounded-full px-7">
                                <Link href="/calculators">
                                    See All Calculators
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white">
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

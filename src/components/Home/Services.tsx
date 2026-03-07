import Link from "next/link";
import {
    ArrowRight,
    HeartPulse,
    Landmark,
    Sparkles,
    Sigma,
    type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalculatorCategory } from "@/lib/calculator-catalog";

type CollectionItem = {
    key: CalculatorCategory;
    title: string;
    description: string;
    count: number;
};

type ServicesProps = {
    collections: CollectionItem[];
};

const collectionMeta: Record<
    CalculatorCategory,
    {
        icon: LucideIcon;
        accentSurface: string;
        accentText: string;
        ribbon: string;
    }
> = {
    finance: {
        icon: Landmark,
        accentSurface: "bg-sky-100",
        accentText: "text-sky-700",
        ribbon: "from-sky-400 to-blue-500",
    },
    health: {
        icon: HeartPulse,
        accentSurface: "bg-rose-100",
        accentText: "text-rose-700",
        ribbon: "from-rose-400 to-pink-500",
    },
    lifestyle: {
        icon: Sparkles,
        accentSurface: "bg-slate-100",
        accentText: "text-slate-700",
        ribbon: "from-slate-400 to-zinc-500",
    },
    math: {
        icon: Sigma,
        accentSurface: "bg-cyan-100",
        accentText: "text-cyan-700",
        ribbon: "from-cyan-400 to-blue-500",
    },
};

export default function Services({ collections }: ServicesProps) {
    return (
        <section className="relative">
            <div className="absolute inset-x-0 top-10 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.10),transparent_60%)]" />

            <div className="container mx-auto px-4 2xl:max-w-[1400px]">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.36em] text-slate-500">
                        Calculator Collections
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                        Pick a lane, then calculate everything in it.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                        Browse focused calculator families for finance, health, lifestyle, and
                        math. Every collection is built to get you to an answer fast.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {collections.map((collection) => {
                        const meta = collectionMeta[collection.key];
                        const Icon = meta.icon;

                        return (
                            <Link
                                key={collection.key}
                                href="/calculators"
                                className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-38px_rgba(15,23,42,0.5)]"
                            >
                                <div
                                    className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${meta.ribbon}`}
                                />
                                <div className="relative flex h-full flex-col">
                                    <div
                                        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${meta.accentSurface} ${meta.accentText}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="text-xl font-semibold text-slate-950">
                                                {collection.title}
                                            </h3>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                {collection.count} live
                                            </span>
                                        </div>

                                        <p className="text-sm leading-7 text-slate-600">
                                            {collection.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6">
                                        <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                                            Explore collection
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Button asChild size="lg" className="rounded-full px-7">
                        <Link href="/calculators" className="inline-flex items-center gap-2">
                            Browse every calculator
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useEffect, useState } from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type CalculatorFaqItemRecord = {
    question: string;
    answer: string;
};

type CalculatorPageContentRecord = {
    slug: string;
    title: string;
    path: string;
    category: string;
    description: string;
    contentTitle: string;
    contentIntro: string;
    contentHtml: string;
    faqItems: CalculatorFaqItemRecord[];
    hasCustomContent: boolean;
    updatedAt: string;
};

type CalculatorPageContentApiResponse = {
    success: boolean;
    item?: CalculatorPageContentRecord;
    message?: string;
};

type ManagedCalculatorContentProps = {
    slug: string;
};

export default function ManagedCalculatorContent({
    slug,
}: ManagedCalculatorContentProps) {
    const [item, setItem] = useState<CalculatorPageContentRecord | null>(null);

    useEffect(() => {
        let isMounted = true;

        const controller = new AbortController();

        const loadContent = async () => {
            try {
                const params = new URLSearchParams({
                    slug,
                });
                const response = await fetch(`/api/calculator-pages?${params.toString()}`, {
                    cache: "no-store",
                    signal: controller.signal,
                });
                const data: CalculatorPageContentApiResponse = await response.json();

                if (!response.ok || !data.success || !data.item) {
                    if (isMounted) {
                        setItem(null);
                    }
                    return;
                }

                if (isMounted) {
                    setItem(data.item);
                }
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Failed to load managed calculator content:", error);
                    if (isMounted) {
                        setItem(null);
                    }
                }
            }
        };

        void loadContent();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [slug]);

    if (!item?.hasCustomContent) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 pb-10 md:px-6 2xl:max-w-[1400px]">
            <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant="secondary">Editable from dashboard</Badge>
                    </div>
                    <CardTitle className="text-2xl">
                        {item.contentTitle || `More about ${item.title}`}
                    </CardTitle>
                    {item.contentIntro ? (
                        <CardDescription className="max-w-3xl text-base leading-8">
                            {item.contentIntro}
                        </CardDescription>
                    ) : null}
                </CardHeader>

                <CardContent className="space-y-8">
                    {item.contentHtml ? (
                        <div
                            className="space-y-5 text-[1.05rem] leading-8 text-card-foreground md:text-lg [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-5 [&_blockquote]:italic [&_b]:font-semibold [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:mb-3 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:mb-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-7"
                            dangerouslySetInnerHTML={{
                                __html: item.contentHtml,
                            }}
                        />
                    ) : null}

                    {item.faqItems.length > 0 ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold tracking-tight">
                                    Frequently Asked Questions
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Managed from the calculator content dashboard.
                                </p>
                            </div>

                            <Accordion type="single" collapsible className="rounded-lg border px-4">
                                {item.faqItems.map((faqItem, index) => (
                                    <AccordionItem
                                        key={`${item.slug}-faq-${index}`}
                                        value={`${item.slug}-faq-${index}`}
                                    >
                                        <AccordionTrigger className="text-base">
                                            {faqItem.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="whitespace-pre-line leading-7 text-muted-foreground">
                                            {faqItem.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
}

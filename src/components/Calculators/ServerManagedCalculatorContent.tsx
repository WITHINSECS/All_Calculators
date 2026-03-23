import type { CalculatorPageContentRecord } from "@/lib/calculator-page-content";

type ServerManagedCalculatorContentProps = {
    item: CalculatorPageContentRecord;
};

export default function ServerManagedCalculatorContent({
    item,
}: ServerManagedCalculatorContentProps) {
    if (!item.hasCustomContent) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 pb-10 md:px-6 2xl:max-w-[1400px]">
            <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                <div className="max-w-4xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {item.category}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        {item.contentTitle || `More about ${item.title}`}
                    </h2>
                    {item.contentIntro ? (
                        <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">
                            {item.contentIntro}
                        </p>
                    ) : null}
                </div>

                {item.contentHtml ? (
                    <div
                        className="mt-8 space-y-5 text-[1.05rem] leading-8 text-card-foreground md:text-lg [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-5 [&_blockquote]:italic [&_b]:font-semibold [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:mb-3 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:mb-5 [&_strong]:font-semibold [&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-4 [&_td]:py-3 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-7"
                        dangerouslySetInnerHTML={{
                            __html: item.contentHtml,
                        }}
                    />
                ) : null}

                {item.faqItems.length > 0 ? (
                    <div className="mt-10 space-y-4">
                        <div>
                            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                                Frequently Asked Questions
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Helpful answers related to this calculator.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {item.faqItems.map((faqItem, index) => (
                                <section
                                    key={`${item.slug}-faq-${index}`}
                                    className="rounded-2xl border border-slate-200/80 bg-slate-50 px-5 py-5"
                                >
                                    <h4 className="text-lg font-semibold text-slate-950">
                                        {faqItem.question}
                                    </h4>
                                    <p className="mt-3 whitespace-pre-line text-base leading-8 text-slate-600">
                                        {faqItem.answer}
                                    </p>
                                </section>
                            ))}
                        </div>
                    </div>
                ) : null}
            </section>
        </div>
    );
}

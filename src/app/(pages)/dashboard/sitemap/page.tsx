import { BadgeCheck, ExternalLink, FileSearch, Globe, Map } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const sitemapXmlPreview = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://withinsecs.com/</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/about</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/blog</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/contact</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/terms</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/home-loan-emi-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/credit-card-payoff-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/mortgage-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/car-loan-emi-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/emi-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/401k-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/mortgage-house-affordability</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/compound-interest-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/payment-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/auto-loan-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/tvm-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/cd-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/salary-hike-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/pension-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/vat-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/savings-goal-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/annual-income</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/salary-to-hourly</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/sip-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/free-gst-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/hra-exemption-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/gratuity</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/lumpsum-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/nps-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/fd-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/inflation-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/debt-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/depreciation-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/future-value-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/currency-converter</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/refinance-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/opportunity-cost-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/business-loan-calculator</loc>
  </url>
  <url>
    <loc>http://withinsecs.com/calculators/maturity-value</loc>
  </url>
</urlset>`;

const sitemapHighlights = [
    {
        title: "Manual XML",
        description: "The sitemap is now written as a direct static XML response.",
        value: "Raw XML",
        icon: Globe,
    },
    {
        title: "Main File",
        description: "All live sitemap content now lives in one route file only.",
        value: "src/app/sitemap.xml/route.ts",
        icon: Map,
    },
    {
        title: "Dashboard Preview",
        description: "This page only shows the same XML in a readable preview.",
        value: "Static UI",
        icon: FileSearch,
    },
];

const sitemapNotes = [
    "The live sitemap is now a plain XML string, not a generated metadata sitemap.",
    "If you want to change links, edit src/app/sitemap.xml/route.ts.",
    "This dashboard page does not update the sitemap by itself.",
    "The preview here matches the manual XML structure you asked for.",
];

export default function DashboardSitemapPage() {
    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Sitemap</h1>
                    <p className="text-sm text-muted-foreground">
                        Static XML preview of the manual sitemap used on the website.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-xs">
                        Static Preview
                    </Badge>
                    <Button asChild variant="outline">
                        <Link href="/sitemap.xml" target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Live Sitemap
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {sitemapHighlights.map((item) => (
                    <Card key={item.title} className="shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base">{item.title}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {item.description}
                                    </CardDescription>
                                </div>
                                <div className="rounded-full border bg-muted/30 p-2">
                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                                {item.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Full XML Preview</CardTitle>
                        <CardDescription>
                            This preview mirrors the manual XML structure used for the live sitemap.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[720px] overflow-auto rounded-xl border bg-slate-950 p-4 text-sm text-slate-100">
                            <pre className="min-w-[680px] whitespace-pre-wrap font-mono leading-6">
                                {sitemapXmlPreview}
                            </pre>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Notes</CardTitle>
                        <CardDescription>
                            The dashboard stays simple while the sitemap stays manual.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {sitemapNotes.map((item) => (
                            <div
                                key={item}
                                className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground"
                            >
                                {item}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { ExternalLink, RefreshCw, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    createDefaultSitemapSettings,
    sitemapChangeFrequencyOptions,
    type SitemapChangeFrequency,
    type SitemapDashboardPageRecord,
    type SitemapSettingsRecord,
} from "@/config/sitemap";

type SitemapApiResponse = {
    success: boolean;
    settings: SitemapSettingsRecord;
    staticPages: SitemapDashboardPageRecord[];
    message?: string;
};

const defaultSettings = createDefaultSitemapSettings();

type SectionKey = "includeStaticPages" | "includeBlogPosts" | "includeCalculators";
type PriorityKey =
    | "homePriority"
    | "calculatorIndexPriority"
    | "blogIndexPriority"
    | "staticDefaultPriority"
    | "calculatorPriority"
    | "blogPriority";
type FrequencyKey =
    | "homeChangeFrequency"
    | "calculatorIndexChangeFrequency"
    | "blogIndexChangeFrequency"
    | "staticDefaultChangeFrequency"
    | "calculatorChangeFrequency"
    | "blogChangeFrequency";

export default function DashboardSitemapPage() {
    const [settings, setSettings] = useState<SitemapSettingsRecord>(defaultSettings);
    const [staticPages, setStaticPages] = useState<SitemapDashboardPageRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadSettings(showRefreshingState = false) {
        if (showRefreshingState) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await fetch("/api/admin/sitemap", {
                cache: "no-store",
            });
            const data: SitemapApiResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Failed to load sitemap settings.");
            }

            setSettings(data.settings ?? defaultSettings);
            setStaticPages(data.staticPages ?? []);
            setDirty(false);
            setError("");
        } catch (loadError) {
            console.error("Failed to load sitemap settings:", loadError);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load sitemap settings."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        void loadSettings();
    }, []);

    const includedStaticPages = useMemo(
        () => staticPages.filter((page) => page.included).length,
        [staticPages]
    );

    function updateSectionSetting(key: SectionKey, value: boolean) {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));
        setDirty(true);
        setError("");
        setSuccess("");
    }

    function updatePrioritySetting(key: PriorityKey, value: string) {
        const numeric = Number(value);

        setSettings((current) => ({
            ...current,
            [key]: Number.isNaN(numeric) ? 0 : Math.min(1, Math.max(0, numeric)),
        }));
        setDirty(true);
        setError("");
        setSuccess("");
    }

    function updateFrequencySetting(key: FrequencyKey, value: string) {
        setSettings((current) => ({
            ...current,
            [key]: value as SitemapChangeFrequency,
        }));
        setDirty(true);
        setError("");
        setSuccess("");
    }

    function updateStaticPage(
        path: string,
        field: "included" | "priority" | "changeFrequency",
        value: boolean | number | SitemapChangeFrequency
    ) {
        setStaticPages((current) =>
            current.map((page) =>
                page.path === path
                    ? {
                          ...page,
                          [field]: value,
                      }
                    : page
            )
        );
        setDirty(true);
        setError("");
        setSuccess("");
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/admin/sitemap", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    settings: {
                        ...settings,
                        staticPageOverrides: staticPages.map((page) => ({
                            path: page.path,
                            included: page.included,
                            priority: page.priority,
                            changeFrequency: page.changeFrequency,
                        })),
                    },
                }),
            });
            const data: SitemapApiResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Failed to save sitemap settings.");
            }

            setSettings(data.settings ?? settings);
            setStaticPages(data.staticPages ?? staticPages);
            setDirty(false);
            setSuccess(data.message ?? "Sitemap settings updated successfully.");
        } catch (saveError) {
            console.error("Failed to save sitemap settings:", saveError);
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save sitemap settings."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Sitemap Manager</h1>
                    <p className="text-sm text-muted-foreground">
                        Control which sections appear in your sitemap and tune priority and crawl
                        frequency safely from the dashboard.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href="/sitemap.xml" target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Sitemap
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void loadSettings(true)}
                        disabled={loading || refreshing || saving}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                    <Button
                        type="button"
                        onClick={() => void handleSave()}
                        disabled={loading || saving || !dirty}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Static Pages</CardTitle>
                        <CardDescription>Standard site pages like About, Contact, and Terms.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-semibold">{includedStaticPages}</p>
                                <p className="text-sm text-muted-foreground">Included routes</p>
                            </div>
                            <Switch
                                checked={settings.includeStaticPages}
                                onCheckedChange={(checked) =>
                                    updateSectionSetting("includeStaticPages", checked)
                                }
                                aria-label="Toggle static pages in sitemap"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Calculators</CardTitle>
                        <CardDescription>Calculator detail pages controlled by calculator visibility.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-semibold">{settings.calculatorPriority.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Default priority</p>
                            </div>
                            <Switch
                                checked={settings.includeCalculators}
                                onCheckedChange={(checked) =>
                                    updateSectionSetting("includeCalculators", checked)
                                }
                                aria-label="Toggle calculators in sitemap"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Blog Posts</CardTitle>
                        <CardDescription>Published blog articles generated from the CMS.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl font-semibold">{settings.blogPriority.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Default priority</p>
                            </div>
                            <Switch
                                checked={settings.includeBlogPosts}
                                onCheckedChange={(checked) =>
                                    updateSectionSetting("includeBlogPosts", checked)
                                }
                                aria-label="Toggle blog posts in sitemap"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {error ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                    {error}
                </div>
            ) : null}

            {success ? (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-emerald-700">
                    {success}
                </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Section Defaults</CardTitle>
                        <CardDescription>
                            Set the default priority and change frequency for automatically generated
                            sitemap sections.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            {
                                label: "Homepage",
                                priorityKey: "homePriority" as const,
                                frequencyKey: "homeChangeFrequency" as const,
                            },
                            {
                                label: "Calculators Index",
                                priorityKey: "calculatorIndexPriority" as const,
                                frequencyKey: "calculatorIndexChangeFrequency" as const,
                            },
                            {
                                label: "Blog Index",
                                priorityKey: "blogIndexPriority" as const,
                                frequencyKey: "blogIndexChangeFrequency" as const,
                            },
                            {
                                label: "Static Pages",
                                priorityKey: "staticDefaultPriority" as const,
                                frequencyKey: "staticDefaultChangeFrequency" as const,
                            },
                            {
                                label: "Calculator Detail Pages",
                                priorityKey: "calculatorPriority" as const,
                                frequencyKey: "calculatorChangeFrequency" as const,
                            },
                            {
                                label: "Blog Posts",
                                priorityKey: "blogPriority" as const,
                                frequencyKey: "blogChangeFrequency" as const,
                            },
                        ].map((section) => (
                            <div key={section.label} className="grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr_120px_180px]">
                                <div>
                                    <p className="font-medium">{section.label}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Used whenever a page does not have a custom override.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={settings[section.priorityKey]}
                                        onChange={(event) =>
                                            updatePrioritySetting(
                                                section.priorityKey,
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Change Frequency</Label>
                                    <Select
                                        value={settings[section.frequencyKey]}
                                        onValueChange={(value) =>
                                            updateFrequencySetting(section.frequencyKey, value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sitemapChangeFrequencyOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Static Page Overrides</CardTitle>
                        <CardDescription>
                            Include or exclude individual static pages and assign custom priority or
                            change frequency when needed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {staticPages.map((page) => (
                            <div key={page.path} className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[1.3fr_90px_120px_180px]">
                                <div>
                                    <p className="font-medium">{page.label}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{page.path}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Include</Label>
                                    <div className="flex min-h-9 items-center rounded-md border px-3">
                                        <Switch
                                            checked={page.included}
                                            onCheckedChange={(checked) =>
                                                updateStaticPage(page.path, "included", checked)
                                            }
                                            aria-label={`Toggle ${page.path} in sitemap`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={page.priority}
                                        onChange={(event) =>
                                            updateStaticPage(
                                                page.path,
                                                "priority",
                                                Number(event.target.value)
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Change Frequency</Label>
                                    <Select
                                        value={page.changeFrequency}
                                        onValueChange={(value) =>
                                            updateStaticPage(
                                                page.path,
                                                "changeFrequency",
                                                value as SitemapChangeFrequency
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sitemapChangeFrequencyOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}

                        {!loading && staticPages.length === 0 ? (
                            <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                                No static sitemap pages available.
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { ExternalLink, RefreshCw, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
    adsenseFormatOptions,
    adsensePlacementDefinitions,
    createDefaultAdsenseSettings,
    type AdsenseFormat,
    type AdsensePlacementKey,
    type AdsenseSettingsRecord,
} from "@/config/adsense";
import { Badge } from "@/components/ui/badge";
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

type AdsenseApiResponse = {
    success: boolean;
    settings: AdsenseSettingsRecord;
    publisherIdConfigured: boolean;
    publisherIdPreview: string;
    message?: string;
};

const defaultSettings = createDefaultAdsenseSettings();

export default function DashboardAdsensePage() {
    const [settings, setSettings] = useState<AdsenseSettingsRecord>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [publisherIdConfigured, setPublisherIdConfigured] = useState(false);
    const [publisherIdPreview, setPublisherIdPreview] = useState("");

    async function loadSettings(showRefreshingState = false) {
        if (showRefreshingState) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await fetch("/api/admin/adsense", {
                cache: "no-store",
            });
            const data: AdsenseApiResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Failed to load AdSense settings.");
            }

            setSettings(data.settings ?? defaultSettings);
            setPublisherIdConfigured(data.publisherIdConfigured);
            setPublisherIdPreview(data.publisherIdPreview ?? "");
            setDirty(false);
            setError("");
        } catch (loadError) {
            console.error("Failed to load AdSense settings:", loadError);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load AdSense settings."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        void loadSettings();
    }, []);

    const enabledPlacements = useMemo(
        () =>
            adsensePlacementDefinitions.filter(
                (placement) =>
                    settings.placements[placement.key].enabled &&
                    settings.placements[placement.key].slot
            ).length,
        [settings]
    );

    function updatePlacement(
        key: AdsensePlacementKey,
        field: "enabled" | "slot" | "format" | "responsive",
        value: boolean | string | AdsenseFormat
    ) {
        setSettings((current) => ({
            ...current,
            placements: {
                ...current.placements,
                [key]: {
                    ...current.placements[key],
                    [field]: value,
                },
            },
        }));
        setDirty(true);
        setError("");
        setSuccess("");
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/admin/adsense", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    settings,
                }),
            });
            const data: AdsenseApiResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Failed to save AdSense settings.");
            }

            setSettings(data.settings ?? settings);
            setPublisherIdConfigured(data.publisherIdConfigured);
            setPublisherIdPreview(data.publisherIdPreview ?? "");
            setDirty(false);
            setSuccess(data.message ?? "AdSense settings updated successfully.");
        } catch (saveError) {
            console.error("Failed to save AdSense settings:", saveError);
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save AdSense settings."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        AdSense Manager
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Control sitewide ad placements for the homepage, blog, blog posts,
                        and calculator pages from one dashboard.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">
                        {publisherIdConfigured ? "Publisher ID ready" : "Publisher ID missing"}
                    </Badge>
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
                        <CardTitle className="text-base">Global Status</CardTitle>
                        <CardDescription>Turn all AdSense placements on or off.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-3xl font-semibold">
                                {settings.enabled ? "On" : "Off"}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Master switch for the whole site
                            </p>
                        </div>
                        <Switch
                            checked={settings.enabled}
                            onCheckedChange={(checked) => {
                                setSettings((current) => ({
                                    ...current,
                                    enabled: checked,
                                }));
                                setDirty(true);
                                setSuccess("");
                                setError("");
                            }}
                            aria-label="Toggle AdSense globally"
                        />
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Active Placements</CardTitle>
                        <CardDescription>Placements that are enabled and have a slot ID.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{enabledPlacements}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {adsensePlacementDefinitions.length} total placements available
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Publisher ID</CardTitle>
                        <CardDescription>The AdSense publisher ID comes from your env file.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Status: {publisherIdConfigured ? "Configured" : "Missing"}
                        </p>
                        <p className="font-mono text-sm">
                            {publisherIdPreview || "Add NEXT_PUBLIC_ADSENSE_CLIENT to .env"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Setup Notes</CardTitle>
                    <CardDescription>
                        Keep the publisher ID in your environment and manage slot IDs here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        Add <span className="font-mono">NEXT_PUBLIC_ADSENSE_CLIENT</span> to{" "}
                        <span className="font-mono">.env</span> with your approved AdSense
                        publisher ID, for example{" "}
                        <span className="font-mono">ca-pub-xxxxxxxxxxxxxxxx</span>.
                    </p>
                    <p>
                        After approval, copy each ad slot ID from AdSense and paste it into the
                        matching placement card below.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/" target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Home
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/blog" target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Blog
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/calculators" target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Calculators
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

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
                {adsensePlacementDefinitions.map((placement) => {
                    const config = settings.placements[placement.key];

                    return (
                        <Card key={placement.key} className="shadow-sm">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-base">
                                            {placement.label}
                                        </CardTitle>
                                        <CardDescription>
                                            {placement.description}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline">{placement.routeHint}</Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3">
                                    <div>
                                        <Label htmlFor={`${placement.key}-enabled`}>
                                            Placement enabled
                                        </Label>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Toggle this ad block without affecting other pages.
                                        </p>
                                    </div>
                                    <Switch
                                        id={`${placement.key}-enabled`}
                                        checked={config.enabled}
                                        onCheckedChange={(checked) =>
                                            updatePlacement(placement.key, "enabled", checked)
                                        }
                                        aria-label={`Toggle ${placement.label}`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`${placement.key}-slot`}>Ad Slot ID</Label>
                                    <Input
                                        id={`${placement.key}-slot`}
                                        value={config.slot}
                                        onChange={(event) =>
                                            updatePlacement(
                                                placement.key,
                                                "slot",
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. 1234567890"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Paste only the numeric AdSense slot ID for this placement.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Format</Label>
                                        <Select
                                            value={config.format}
                                            onValueChange={(value) =>
                                                updatePlacement(
                                                    placement.key,
                                                    "format",
                                                    value as AdsenseFormat
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {adsenseFormatOptions.map((format) => (
                                                    <SelectItem key={format} value={format}>
                                                        {format}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`${placement.key}-responsive`}>
                                            Full-width responsive
                                        </Label>
                                        <div className="flex min-h-9 items-center justify-between rounded-md border px-3">
                                            <span className="text-sm text-muted-foreground">
                                                {config.responsive ? "Enabled" : "Disabled"}
                                            </span>
                                            <Switch
                                                id={`${placement.key}-responsive`}
                                                checked={config.responsive}
                                                onCheckedChange={(checked) =>
                                                    updatePlacement(
                                                        placement.key,
                                                        "responsive",
                                                        checked
                                                    )
                                                }
                                                aria-label={`Responsive setting for ${placement.label}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {loading ? (
                <p className="text-sm text-muted-foreground">Loading AdSense settings...</p>
            ) : null}
        </div>
    );
}

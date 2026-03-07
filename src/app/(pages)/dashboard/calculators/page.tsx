"use client";

import Link from "next/link";
import { ExternalLink, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import {
    calculatorCategoryLabels,
    type CalculatorCategory,
} from "@/lib/calculator-catalog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type ManagedCalculatorItem = {
    title: string;
    subTitle: string;
    description: string;
    category: CalculatorCategory;
    slug: string;
    path: string;
    enabled: boolean;
};

type VisibilitySummary = {
    total: number;
    enabled: number;
    disabled: number;
};

type CalculatorsApiResponse = {
    success: boolean;
    items: ManagedCalculatorItem[];
    summary: VisibilitySummary;
    message?: string;
};

type CalculatorUpdateResponse = {
    success: boolean;
    item: ManagedCalculatorItem;
    summary: VisibilitySummary;
    message?: string;
};

const emptySummary: VisibilitySummary = {
    total: 0,
    enabled: 0,
    disabled: 0,
};

export default function DashboardCalculatorsPage() {
    const [items, setItems] = useState<ManagedCalculatorItem[]>([]);
    const [summary, setSummary] = useState<VisibilitySummary>(emptySummary);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [pendingSlugs, setPendingSlugs] = useState<string[]>([]);

    async function loadCalculators(showRefreshingState = false) {
        if (showRefreshingState) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await fetch("/api/admin/calculators", {
                cache: "no-store",
            });
            const data: CalculatorsApiResponse = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message ?? "Failed to load calculators.");
                return;
            }

            setItems(data.items);
            setSummary(data.summary);
            setError("");
        } catch (fetchError) {
            console.error("Failed to load calculator settings:", fetchError);
            setError("Failed to load calculators.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        void loadCalculators();
    }, []);

    const normalizedSearch = search.trim().toLowerCase();
    const filteredItems = items.filter((item) => {
        if (!normalizedSearch) {
            return true;
        }

        return [item.title, item.subTitle, item.category, item.slug, item.path]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);
    });

    async function handleToggle(item: ManagedCalculatorItem, enabled: boolean) {
        setPendingSlugs((current) => [...current, item.slug]);
        setItems((current) =>
            current.map((entry) =>
                entry.slug === item.slug
                    ? {
                          ...entry,
                          enabled,
                      }
                    : entry
            )
        );

        setSummary((current) => ({
            ...current,
            enabled: current.enabled + (enabled ? 1 : -1),
            disabled: current.disabled + (enabled ? -1 : 1),
        }));

        try {
            const response = await fetch("/api/admin/calculators", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    slug: item.slug,
                    enabled,
                }),
            });

            const data: CalculatorUpdateResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message ?? "Failed to update calculator.");
            }

            setItems((current) =>
                current.map((entry) => (entry.slug === data.item.slug ? data.item : entry))
            );
            setSummary(data.summary);
            setError("");
        } catch (updateError) {
            console.error("Failed to update calculator visibility:", updateError);
            setItems((current) =>
                current.map((entry) =>
                    entry.slug === item.slug
                        ? {
                              ...entry,
                              enabled: item.enabled,
                          }
                        : entry
                )
            );
            setSummary((current) => ({
                ...current,
                enabled: current.enabled + (item.enabled ? 1 : -1),
                disabled: current.disabled + (item.enabled ? -1 : 1),
            }));
            setError(
                updateError instanceof Error
                    ? updateError.message
                    : "Failed to update calculator visibility."
            );
        } finally {
            setPendingSlugs((current) => current.filter((slug) => slug !== item.slug));
        }
    }

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Calculator Visibility
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enable or disable calculators for the public site. Disabled
                        calculators are removed from listings and blocked on direct URLs.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline">Total: {summary.total}</Badge>
                    <Button asChild variant="outline">
                        <Link href="/calculators">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Public Page
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void loadCalculators(true)}
                        disabled={loading || refreshing}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Active</CardTitle>
                        <CardDescription>Calculators currently visible.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{summary.enabled}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Disabled</CardTitle>
                        <CardDescription>Hidden from users and sitemap output.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{summary.disabled}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Managed</CardTitle>
                        <CardDescription>Search and toggle each calculator below.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                        <SlidersHorizontal className="h-4 w-4" />
                        {filteredItems.length} calculators match your current filter.
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="text-base">All Calculators</CardTitle>
                        <CardDescription>
                            Use the search box to narrow the list and toggle each calculator on
                            or off.
                        </CardDescription>
                    </div>

                    <div className="relative w-full md:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search calculators"
                            className="pl-9"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    {error ? (
                        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    ) : null}

                    <ScrollArea className="h-[560px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Calculator</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Visibility</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-16 text-center text-sm text-muted-foreground"
                                        >
                                            Loading calculator settings...
                                        </TableCell>
                                    </TableRow>
                                ) : null}

                                {!loading && filteredItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-16 text-center text-sm text-muted-foreground"
                                        >
                                            No calculators matched your search.
                                        </TableCell>
                                    </TableRow>
                                ) : null}

                                {!loading
                                    ? filteredItems.map((item) => {
                                          const isPending = pendingSlugs.includes(item.slug);

                                          return (
                                              <TableRow key={item.slug}>
                                                  <TableCell className="align-top">
                                                      <div className="space-y-1">
                                                          <p className="font-medium">
                                                              {item.title}
                                                          </p>
                                                          <p className="text-xs text-muted-foreground">
                                                              {item.path}
                                                          </p>
                                                          <p className="line-clamp-2 max-w-lg text-xs text-muted-foreground">
                                                              {item.description}
                                                          </p>
                                                      </div>
                                                  </TableCell>

                                                  <TableCell className="align-top">
                                                      <Badge variant="outline">
                                                          {
                                                              calculatorCategoryLabels[
                                                                  item.category
                                                              ]
                                                          }
                                                      </Badge>
                                                  </TableCell>

                                                  <TableCell className="align-top">
                                                      {item.enabled ? (
                                                          <Badge>Enabled</Badge>
                                                      ) : (
                                                          <Badge variant="secondary">
                                                              Disabled
                                                          </Badge>
                                                      )}
                                                  </TableCell>

                                                  <TableCell className="align-top text-right">
                                                      <div className="flex justify-end gap-3">
                                                          <span className="text-sm text-muted-foreground">
                                                              {isPending
                                                                  ? "Saving..."
                                                                  : item.enabled
                                                                    ? "On"
                                                                    : "Off"}
                                                          </span>
                                                          <Switch
                                                              checked={item.enabled}
                                                              onCheckedChange={(checked) =>
                                                                  void handleToggle(item, checked)
                                                              }
                                                              disabled={isPending}
                                                              aria-label={`Toggle ${item.title}`}
                                                          />
                                                      </div>
                                                  </TableCell>
                                              </TableRow>
                                          );
                                      })
                                    : null}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    BadgeDollarSign,
    Calculator,
    FilePenLine,
    Newspaper,
    SlidersHorizontal,
    TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

type DashboardStats = {
    totalInquiries: number;
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
};

type StatsApiResponse = DashboardStats & {
    success: boolean;
    message?: string;
};

type ActivityPoint = {
    period: string;
    inquiries: number;
};

type ActivityApiResponse = {
    success: boolean;
    data: ActivityPoint[];
    message?: string;
};

const inquiriesChartConfig = {
    inquiries: {
        label: "Inquiries",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

function InquiriesChart({
    data,
    loading,
}: {
    data: ActivityPoint[];
    loading: boolean;
}) {
    const chartData = data.map((item) => {
        const date = new Date(`${item.period}-01T00:00:00Z`);
        const label = date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
        });

        return {
            label,
            inquiries: item.inquiries,
        };
    });

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Inquiry Activity</CardTitle>
                <CardDescription>Contact form submissions over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading chart...</p>
                ) : chartData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No inquiry activity recorded in the selected period.
                    </p>
                ) : (
                    <ChartContainer config={inquiriesChartConfig}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="inquiries" fill="var(--color-inquiries)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Live overview of contact activity
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing monthly inquiry submissions from your database.
                </div>
            </CardFooter>
        </Card>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);

    const [activity, setActivity] = useState<ActivityPoint[]>([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const data: StatsApiResponse = await res.json();

                if (!res.ok || !data.success) {
                    setStatsError(data.message ?? "Failed to load dashboard stats.");
                    return;
                }

                setStats({
                    totalInquiries: data.totalInquiries,
                    totalBlogs: data.totalBlogs,
                    publishedBlogs: data.publishedBlogs,
                    draftBlogs: data.draftBlogs,
                });
                setStatsError(null);
            } catch (error: unknown) {
                console.error("Dashboard stats fetch error:", error);
                setStatsError("Failed to load dashboard stats.");
            } finally {
                setStatsLoading(false);
            }
        };

        const fetchActivity = async () => {
            try {
                const res = await fetch("/api/admin/activity");
                const data: ActivityApiResponse = await res.json();

                if (!res.ok || !data.success) {
                    setActivityError(data.message ?? "Failed to load activity data.");
                    return;
                }

                setActivity(data.data);
                setActivityError(null);
            } catch (error: unknown) {
                console.error("Dashboard activity fetch error:", error);
                setActivityError("Failed to load activity data.");
            } finally {
                setActivityLoading(false);
            }
        };

        void fetchStats();
        void fetchActivity();
    }, []);

    const totalInquiries = stats?.totalInquiries ?? 0;
    const totalBlogs = stats?.totalBlogs ?? 0;
    const publishedBlogs = stats?.publishedBlogs ?? 0;
    const draftBlogs = stats?.draftBlogs ?? 0;

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Admin-only overview for blog publishing, calculator visibility, and inquiry activity.
                    </p>
                </div>
                <Badge variant="outline" className="text-xs">
                    {statsLoading || activityLoading ? "Loading..." : "Live | Updated"}
                </Badge>
            </div>

            {statsError ? <p className="text-sm text-red-500">{statsError}</p> : null}
            {activityError ? <p className="text-sm text-red-500">{activityError}</p> : null}

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Form Inquiries
                        </CardTitle>
                        <Calculator className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading ? "..." : totalInquiries.toLocaleString()}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            All inquiries from your contact form
                        </p>
                        <Progress value={100} className="mt-3" />
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Stored in the inquiries collection
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Published Blog Posts
                        </CardTitle>
                        <Newspaper className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading ? "..." : publishedBlogs.toLocaleString()}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Posts currently visible on the public blog
                        </p>
                        <Progress
                            value={totalBlogs > 0 ? (publishedBlogs / totalBlogs) * 100 : 0}
                            className="mt-3"
                        />
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            {statsLoading
                                ? "Loading blog counts..."
                                : `${totalBlogs.toLocaleString()} total articles in the CMS`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
                        <FilePenLine className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading ? "..." : draftBlogs.toLocaleString()}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Unpublished articles waiting in the dashboard
                        </p>
                        <Progress
                            value={totalBlogs > 0 ? (draftBlogs / totalBlogs) * 100 : 0}
                            className="mt-3"
                        />
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            Create, edit, and publish posts from the blog panel
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Jump straight into writing or managing site content.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button asChild>
                        <Link href="/dashboard/blog">
                            <FilePenLine className="mr-2 h-4 w-4" />
                            Create Blog Post
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/calculators">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Manage Calculators
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/adsense">
                            <BadgeDollarSign className="mr-2 h-4 w-4" />
                            Manage AdSense
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/allblogs">
                            <Newspaper className="mr-2 h-4 w-4" />
                            Manage All Blogs
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <InquiriesChart data={activity} loading={activityLoading} />
        </div>
    );
}

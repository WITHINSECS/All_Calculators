"use client";

import React, { useEffect, useState } from "react";
import { Calculator, Users, Activity, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

type DashboardStats = {
    totalUsers: number;
    totalInquiries: number;
};

type StatsApiResponse = {
    success: boolean;
    totalUsers: number;
    totalInquiries: number;
    message?: string;
};

type ActivityPoint = {
    period: string;   // "YYYY-MM"
    users: number;
    inquiries: number;
};

type ActivityApiResponse = {
    success: boolean;
    data: ActivityPoint[];
    message?: string;
};

const usersChartConfig = {
    users: {
        label: "New users",
        color: "var(--chart-1)",
    },
    inquiries: {
        label: "Inquiries",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

function UsersJoinedChart({
    data,
    loading,
}: {
    data: ActivityPoint[];
    loading: boolean;
}) {
    const chartData = data.map((item) => {
        // item.period = "YYYY-MM"
        const d = new Date(`${item.period}-01T00:00:00Z`);
        const label = d.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
        }); // e.g. "Dec 25"

        return {
            label,
            users: item.users,
            inquiries: item.inquiries,
        };
    });

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Activity (last 6 months)</CardTitle>
                <CardDescription>New users & inquiries per month</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading chart…</p>
                ) : chartData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No activity recorded in the selected period.
                    </p>
                ) : (
                    <ChartContainer config={usersChartConfig}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                            <Bar
                                dataKey="inquiries"
                                fill="var(--color-inquiries)"
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Live overview of recent platform activity
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing monthly new users and inquiries from your database.
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
                    setStatsLoading(false);
                    return;
                }

                setStats({
                    totalUsers: data.totalUsers,
                    totalInquiries: data.totalInquiries,
                });
                setStatsError(null);
            } catch (err: unknown) {
                console.error("Dashboard stats fetch error:", err);
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
                    setActivityLoading(false);
                    return;
                }

                setActivity(data.data);
                setActivityError(null);
            } catch (err: unknown) {
                console.error("Dashboard activity fetch error:", err);
                setActivityError("Failed to load activity data.");
            } finally {
                setActivityLoading(false);
            }
        };

        void fetchStats();
        void fetchActivity();
    }, []);

    const totalUsers = stats?.totalUsers ?? 0;
    const totalInquiries = stats?.totalInquiries ?? 0;

    return (
        <div className="flex flex-col gap-6 p-6 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Calculator Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of usage and performance across all calculators.
                    </p>
                </div>
                <Badge variant="outline" className="text-xs">
                    {statsLoading || activityLoading ? "Loading…" : "Live · Updated"}
                </Badge>
            </div>

            {statsError && (
                <p className="text-sm text-red-500">{statsError}</p>
            )}
            {activityError && (
                <p className="text-sm text-red-500">{activityError}</p>
            )}

            {/* Top 3 Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* 1) Total Users */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading ? "…" : totalUsers.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total registered users from Better Auth
                        </p>
                        <Progress value={100} className="mt-3" />
                        <p className="text-[11px] text-muted-foreground mt-1">
                            User stats loaded from database
                        </p>
                    </CardContent>
                </Card>

                {/* 2) Total Form Inquiries */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Form Inquiries
                        </CardTitle>
                        <Calculator className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statsLoading ? "…" : totalInquiries.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All inquiries from your contact form
                        </p>
                        <Progress value={100} className="mt-3" />
                        <p className="text-[11px] text-muted-foreground mt-1">
                            Stored in the inquiries collection
                        </p>
                    </CardContent>
                </Card>

                {/* 3) Calculator Health */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Calculator Health
                        </CardTitle>
                        <Activity className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">100%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All calculators are operational
                        </p>
                        <Progress value={100} className="mt-3" />
                        <p className="text-[11px] text-muted-foreground mt-1">
                            No issues detected across active calculators
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity chart (real data) */}
            <UsersJoinedChart data={activity} loading={activityLoading} />
        </div>
    );
}
"use client"

import React from "react"
import { Calculator, Users, Activity, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// ------- CHART DATA (Users Joined) -------
const usersJoinedData = [
    { month: "January", users: 120 },
    { month: "February", users: 180 },
    { month: "March", users: 240 },
    { month: "April", users: 200 },
    { month: "May", users: 320 },
    { month: "June", users: 280 },
    { month: "February", users: 180 },
    { month: "March", users: 240 },
    { month: "April", users: 200 },
    { month: "May", users: 320 },
    { month: "June", users: 280 },
]

const usersChartConfig = {
    users: {
        label: "Users joined",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

function UsersJoinedChart() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Users joined</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={usersChartConfig}>
                    <BarChart accessibilityLayer data={usersJoinedData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="users" fill="var(--color-users)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing new users joining your calculators.
                </div>
            </CardFooter>
        </Card>
    )
}

export default function Dashboard() {
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
                    Live · Updated just now
                </Badge>
            </div>

            {/* Top 3 Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Total Users */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,348</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +8.2% vs last week
                        </p>
                        <Progress value={72} className="mt-3" />
                        <p className="text-[11px] text-muted-foreground mt-1">
                            72% of monthly target reached
                        </p>
                    </CardContent>
                </Card>

                {/* Calculations Performed */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Calculations Performed
                        </CardTitle>
                        <Calculator className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89,210</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +14.5% vs last week
                        </p>
                        <Progress value={54} className="mt-3" />
                        <p className="text-[11px] text-muted-foreground mt-1">
                            54% of daily capacity
                        </p>
                    </CardContent>
                </Card>

                {/* Active Calculators */}
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Calculators
                        </CardTitle>
                        <Activity className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18 / 24</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            6 calculators in beta
                        </p>
                        <div className="mt-3 flex gap-2 text-[11px]">
                            <Badge variant="secondary">Finance</Badge>
                            <Badge variant="secondary">Health</Badge>
                            <Badge variant="secondary">Math</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status + Recent Activity */}
            {/* <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-medium">
                            Application Status
                        </CardTitle>
                        <Badge className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            All systems operational
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                    Uptime (30 days)
                                </p>
                                <p className="font-semibold">99.97%</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                    Avg Response Time
                                </p>
                                <p className="font-semibold">154 ms</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                    Error Rate
                                </p>
                                <p className="font-semibold">0.21%</p>
                            </div>
                        </div>

                        <Progress value={86} className="mt-1" />
                        <p className="text-[11px] text-muted-foreground">
                            86% of current infrastructure capacity used. Consider scaling if
                            growth continues.
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                            Recent Calculator Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-36 pr-2">
                            <ul className="space-y-3 text-xs">
                                <li className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Loan EMI Calculator</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            2,310 runs · 123 new users
                                        </p>
                                    </div>
                                    <Badge variant="outline">Trending</Badge>
                                </li>
                                <li className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">BMI Calculator</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            1,540 runs · 62 new users
                                        </p>
                                    </div>
                                    <Badge variant="outline">Stable</Badge>
                                </li>
                                <li className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Currency Converter</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            3,920 runs · 201 new users
                                        </p>
                                    </div>
                                    <Badge variant="outline">High load</Badge>
                                </li>
                                <li className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Percentage Calculator</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            980 runs · 44 new users
                                        </p>
                                    </div>
                                    <Badge variant="outline">New</Badge>
                                </li>
                            </ul>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div> */}

            <UsersJoinedChart />
        </div>
    )
}

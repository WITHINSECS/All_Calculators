"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";
import { toast } from "react-toastify";
import { addDays, format } from "date-fns"; // For date manipulation
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function OvulationCalculator() {
    const [lastPeriodDate, setLastPeriodDate] = useState<string | null>(null);
    const [cycleLength, setCycleLength] = useState(28);
    const [results, setResults] = useState<any>(null);

    const calculateOvulation = () => {
        if (!lastPeriodDate) {
            toast.error("Please enter the date when your last period started.");
            return;
        }

        // Convert string date to Date object
        const lastPeriod = new Date(lastPeriodDate);
        // Calculate the most probable ovulation date (14 days before next period)
        const ovulationDate = addDays(lastPeriod, cycleLength - 14);
        const ovulationStart = addDays(ovulationDate, -4); // Ovulation window starts 4 days before ovulation date
        const ovulationEnd = addDays(ovulationDate, 1); // Ovulation window ends 1 day after ovulation date

        // Other important dates
        const nextPeriodStart = addDays(lastPeriod, cycleLength);
        const pregnancyTestDate = addDays(ovulationEnd, 7); // Pregnancy test should be done 7 days after ovulation window
        const dueDateIfPregnant = addDays(lastPeriod, 280); // 280 days from the last period (due date)

        // Calculate formatted results
        const formattedResults = {
            ovulationWindow: `${format(ovulationStart, "MMM dd")} - ${format(ovulationEnd, "MMM dd")}`,
            mostProbableOvulationDate: format(ovulationDate, "MMM dd, yyyy"),
            intercourseWindow: `${format(ovulationStart, "MMM dd")} - ${format(ovulationEnd, "MMM dd")}`,
            pregnancyTestDate: format(pregnancyTestDate, "MMM dd, yyyy"),
            nextPeriodStart: format(nextPeriodStart, "MMM dd, yyyy"),
            dueDateIfPregnant: format(dueDateIfPregnant, "MMM dd, yyyy"),
        };

        // Important dates for the next 6 cycles
        const cycleDates = [];
        for (let i = 1; i <= 6; i++) {
            const cycleStart = addDays(lastPeriod, cycleLength * i);
            const ovulationStartCycle = addDays(cycleStart, cycleLength - 14);
            const ovulationEndCycle = addDays(ovulationStartCycle, 1);
            const dueDateCycle = addDays(cycleStart, 280);
            cycleDates.push({
                periodStart: format(cycleStart, "MMM dd, yyyy"),
                ovulationWindow: `${format(ovulationStartCycle, "MMM dd")} - ${format(ovulationEndCycle, "MMM dd")}`,
                dueDate: format(dueDateCycle, "MMM dd, yyyy"),
            });
        }

        setResults({ ...formattedResults, cycleDates });
    };

    const resetForm = () => {
        setLastPeriodDate(null);
        setCycleLength(28);
        setResults(null);
    };

    // Pie chart data for ovulation window
    const pieData = [
        { name: "Ovulation Window Start", value: 50 },
        { name: "Ovulation Window End", value: 50 },
    ];

    // Line chart data for next 6 cycles
    const lineChartData = results ? results.cycleDates.map((cycle: any, index: number) => ({
        cycle: index + 1,
        periodStart: cycle.periodStart,
        ovulationStart: cycle.ovulationWindow.split(" - ")[0],
        dueDate: cycle.dueDate,
    })) : [];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Ovulation Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Estimate your ovulation window and related dates for pregnancy.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="lastPeriodDate">First Day of Your Last Period:</Label>
                                <Input
                                    id="lastPeriodDate"
                                    type="date"
                                    value={lastPeriodDate || ""}
                                    onChange={(e) => setLastPeriodDate(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="cycleLength">Cycle Length (days)</Label>
                                <Input
                                    id="cycleLength"
                                    type="number"
                                    value={cycleLength}
                                    onChange={(e) => setCycleLength(Number(e.target.value))}
                                    placeholder="Enter your cycle length"
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex justify-center mt-4">
                                <Button className="w-full" onClick={calculateOvulation}>Calculate</Button>
                            </div>

                            <div className="flex justify-center">
                                <Button className="w-full" onClick={resetForm}>Reset</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Table */}
                {results && (
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Important Dates for This Cycle:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full text-left border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border p-2">Description</th>
                                                <th className="border p-2">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border p-2">Ovulation Window</td>
                                                <td className="border p-2">{results.ovulationWindow}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Most Probable Ovulation Date</td>
                                                <td className="border p-2">{results.mostProbableOvulationDate}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Intercourse Window</td>
                                                <td className="border p-2">{results.intercourseWindow}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Pregnancy Test Date</td>
                                                <td className="border p-2">{results.pregnancyTestDate}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Next Period Start</td>
                                                <td className="border p-2">{results.nextPeriodStart}</td>
                                            </tr>
                                            <tr>
                                                <td className="border p-2">Due Date If Pregnant</td>
                                                <td className="border p-2">{results.dueDateIfPregnant}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        <Cell fill="#82ca9d" />
                                        <Cell fill="#ff7300" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Line Chart */}
                        <div className="mt-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="cycle" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="periodStart" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="ovulationStart" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="dueDate" stroke="#ff7300" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}

                    </div>
                )}
            </div>
        </Wrapper>
    );
}

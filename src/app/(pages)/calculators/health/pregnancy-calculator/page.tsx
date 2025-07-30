"use client"
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
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Pregnancy Due Date Calculator component
export default function PregnancyDueDateCalculator() {
    const [lastPeriodDate, setLastPeriodDate] = useState<string | null>(null);
    const [cycleLength, setCycleLength] = useState(28);
    const [dueDate, setDueDate] = useState<string | null>(null);
    
    const calculateDueDate = () => {
        if (!lastPeriodDate) {
            toast.error("Please enter the date when your last period started.");
            return;
        }

        // Calculate the due date (280 days from LMP)
        const dueDateCalculated = new Date(lastPeriodDate);
        dueDateCalculated.setDate(dueDateCalculated.getDate() + 280);

        setDueDate(dueDateCalculated.toLocaleDateString());
    };

    const resetForm = () => {
        setLastPeriodDate(null);
        setCycleLength(28);
        setDueDate(null);
    };

    // Pie chart data
    const pieData = [
        { name: "Peterson", value: 71.5 },
        { name: "Miller", value: 71.5 },
        { name: "Robinson", value: 72.6 },
        { name: "Devine", value: 75 },
        { name: "Hamwi", value: 77.3 },
    ];

    // Line chart data
    const lineChartData = [
        { height: 150, peterson: 45.5, miller: 50, robinson: 48, devine: 50, hamwi: 48.5 },
        { height: 160, peterson: 50, miller: 55, robinson: 53, devine: 55, hamwi: 53 },
        { height: 170, peterson: 55, miller: 60, robinson: 58, devine: 60, hamwi: 58.5 },
        { height: 180, peterson: 60, miller: 65, robinson: 63, devine: 65, hamwi: 63 },
        { height: 190, peterson: 65, miller: 70, robinson: 68, devine: 70, hamwi: 68 },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Pregnancy Due Date Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your estimated pregnancy due date based on your last period.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="method">Calculation Method</Label>
                                <select
                                    id="method"
                                    className="p-2 border border-gray-300 rounded-md"
                                    disabled
                                >
                                    <option value="lastPeriod">Last Period</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="lastPeriodDate">When did your last period start?</Label>
                                <input
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
                                />
                            </div>

                            <div className="flex justify-center mt-4">
                                <Button className="w-full" onClick={calculateDueDate}>Calculate</Button>
                            </div>

                            <div className="flex justify-center mt-4">
                                <Button className="w-full" onClick={resetForm}>Reset</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {dueDate && (
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Congrats! Your due date is:</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-2xl font-semibold">
                                    {dueDate}
                                </div>
                                <div className="text-green-500 text-lg mt-4">
                                    🎉 You're on your way to a new adventure! 🎉
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Pie Chart */}
                <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            >
                                <Cell fill="#82ca9d" />
                                <Cell fill="#ff7300" />
                                <Cell fill="#ffbf00" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="height" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="peterson" stroke="#8884d8" />
                            <Line type="monotone" dataKey="miller" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="robinson" stroke="#ff7300" />
                            <Line type="monotone" dataKey="devine" stroke="#ffbf00" />
                            <Line type="monotone" dataKey="hamwi" stroke="#ff0000" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Wrapper>
    );
}

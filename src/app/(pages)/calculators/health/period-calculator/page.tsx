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
import Wrapper from '@/app/Wrapper'; // Ensure this wrapper component exists
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"; // Recharts for pie chart
import { LineChart, Line, XAxis, YAxis, Tooltip as LineTooltip, Legend as LineLegend, ResponsiveContainer as LineResponsiveContainer } from "recharts"; // Recharts for line chart
import { toast } from "react-toastify"; // Import toast for error handling
import { format, addDays } from "date-fns"; // For date manipulation

// Define a type for the result state
interface PeriodResult {
    ovulationDate: Date;
    nextPeriodStart: Date;
    nextPeriodEnd: Date;
}

// Function to calculate the next period and ovulation dates
const calculatePeriodDates = (startDate: string, periodDuration: number, cycleLength: number) => {
    const start = new Date(startDate);
    const ovulationDate = addDays(start, cycleLength - 14); // Ovulation typically occurs 14 days before the next period
    const nextPeriodStart = addDays(start, cycleLength);
    const nextPeriodEnd = addDays(nextPeriodStart, periodDuration);

    return { ovulationDate, nextPeriodStart, nextPeriodEnd };
};

const PeriodCalculator = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [periodDuration, setPeriodDuration] = useState<number>(5); // Default period duration in days
    const [cycleLength, setCycleLength] = useState<number>(28); // Default cycle length in days
    const [result, setResult] = useState<PeriodResult | null>(null); // Specify the type for result

    // Handle Calculate Button Click
    const handleCalculate = () => {
        if (!startDate || !periodDuration || !cycleLength) {
            toast.error("Please fill out all fields.");
            return;
        }

        const { ovulationDate, nextPeriodStart, nextPeriodEnd } = calculatePeriodDates(startDate, periodDuration, cycleLength);
        setResult({ ovulationDate, nextPeriodStart, nextPeriodEnd });
    };

    // Pie chart data (showing different phases of the menstrual cycle)
    const data = [
        { name: "Menstruation", value: periodDuration },
        { name: "Follicular Phase", value: cycleLength - 14 - periodDuration },
        { name: "Ovulation", value: 1 },
        { name: "Luteal Phase", value: cycleLength - 15 - periodDuration },
    ];

    // Line chart data (showing the period cycle)
    const lineChartData = [
        { time: 0, phase: "Start", day: 0 },
        { time: periodDuration, phase: "Menstruation", day: periodDuration },
        { time: cycleLength - 14, phase: "Follicular Phase", day: cycleLength - 14 },
        { time: cycleLength, phase: "Ovulation", day: cycleLength },
        { time: cycleLength + periodDuration, phase: "Luteal Phase", day: cycleLength + periodDuration },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-3xl font-bold lg:text-4xl ">
                        Period Calculator: Predict Your Next Cycle
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your estimated ovulation date and period dates based on your cycle.
                    </p>
                </div>

                <Card className="shadow-lg rounded-lg border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="block mb-2 font-medium text-gray-700" htmlFor="startDate">When did your last period start?</Label>
                                <Input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <Label className="block mb-2 font-medium text-gray-700" htmlFor="periodDuration">How many days did it last?</Label>
                                <Input
                                    type="number"
                                    id="periodDuration"
                                    value={periodDuration}
                                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <Label className="block mb-2 font-medium text-gray-700" htmlFor="cycleLength">Average cycle length (days)</Label>
                                <Input
                                    type="number"
                                    id="cycleLength"
                                    value={cycleLength}
                                    onChange={(e) => setCycleLength(Number(e.target.value))}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                        </div>

                        <Button onClick={handleCalculate} className="w-full p-5">
                            See Results
                        </Button>
                    </CardContent>
                </Card>

                {result && (
                    <div className="mt-12">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-2xl font-bold text-indigo-600">Your Results</h2>
                            <div className="mt-4 text-lg text-gray-800">
                                <p>Your estimated ovulation date is: <span className="font-semibold">{format(result.ovulationDate, "MMM dd, yyyy")}</span></p>
                                <p>Your estimated period dates are: <span className="font-semibold">{format(result.nextPeriodStart, "MMM dd, yyyy")} - {format(result.nextPeriodEnd, "MMM dd, yyyy")}</span></p>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300} className="mt-6">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    <Cell key="cell1" fill="#82ca9d" />
                                    <Cell key="cell2" fill="#ff8042" />
                                    <Cell key="cell3" fill="#ffbf00" />
                                    <Cell key="cell4" fill="#ff7f00" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                        <ResponsiveContainer width="100%" height={300} className="mt-6">
                            <LineChart data={lineChartData}>
                                <Line type="monotone" dataKey="day" stroke="#8884d8" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <LineTooltip />
                                <LineLegend />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default PeriodCalculator;
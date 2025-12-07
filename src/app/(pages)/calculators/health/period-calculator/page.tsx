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
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as LineTooltip,
    Legend as LineLegend,
    ResponsiveContainer as LineResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";
import { format, addDays } from "date-fns";

// Define a type for the result state
interface PeriodResult {
    ovulationDate: Date;
    nextPeriodStart: Date;
    nextPeriodEnd: Date;
}

// Function to calculate the next period and ovulation dates
const calculatePeriodDates = (
    startDate: string,
    periodDuration: number,
    cycleLength: number
) => {
    const start = new Date(startDate);
    const ovulationDate = addDays(start, cycleLength - 14); // Ovulation typically occurs 14 days before the next period
    const nextPeriodStart = addDays(start, cycleLength);
    const nextPeriodEnd = addDays(nextPeriodStart, periodDuration);

    return { ovulationDate, nextPeriodStart, nextPeriodEnd };
};

const PeriodCalculator = () => {
    const [startDate, setStartDate] = useState<string>("");
    // use strings so fields can start truly empty
    const [periodDuration, setPeriodDuration] = useState<string>("");
    const [cycleLength, setCycleLength] = useState<string>("");
    const [result, setResult] = useState<PeriodResult | null>(null);

    const handleCalculate = () => {
        if (!startDate || !periodDuration.trim() || !cycleLength.trim()) {
            toast.error("Please fill out all fields.");
            return;
        }

        const periodDurationNum = Number(periodDuration);
        const cycleLengthNum = Number(cycleLength);

        if (!Number.isFinite(periodDurationNum) || periodDurationNum <= 0) {
            toast.error("Please enter a valid period duration.");
            return;
        }

        if (!Number.isFinite(cycleLengthNum) || cycleLengthNum <= 0) {
            toast.error("Please enter a valid cycle length.");
            return;
        }

        if (cycleLengthNum <= periodDurationNum) {
            toast.error("Cycle length must be greater than period duration.");
            return;
        }

        const {
            ovulationDate,
            nextPeriodStart,
            nextPeriodEnd,
        } = calculatePeriodDates(startDate, periodDurationNum, cycleLengthNum);

        setResult({ ovulationDate, nextPeriodStart, nextPeriodEnd });
    };

    // Parse numbers for chart only when we have a result
    const periodDurationNum = Number(periodDuration) || 0;
    const cycleLengthNum = Number(cycleLength) || 0;

    // Pie chart data (showing different phases of the menstrual cycle)
    const data =
        result && periodDurationNum > 0 && cycleLengthNum > 0
            ? [
                  { name: "Menstruation", value: periodDurationNum },
                  {
                      name: "Follicular Phase",
                      value: cycleLengthNum - 14 - periodDurationNum,
                  },
                  { name: "Ovulation", value: 1 },
                  {
                      name: "Luteal Phase",
                      value: cycleLengthNum - 15 - periodDurationNum,
                  },
              ]
            : [];

    // Line chart data (showing the period cycle timeline)
    const lineChartData =
        result && periodDurationNum > 0 && cycleLengthNum > 0
            ? [
                  { time: 0, phase: "Start", day: 0 },
                  {
                      time: periodDurationNum,
                      phase: "Menstruation",
                      day: periodDurationNum,
                  },
                  {
                      time: cycleLengthNum - 14,
                      phase: "Follicular Phase",
                      day: cycleLengthNum - 14,
                  },
                  {
                      time: cycleLengthNum,
                      phase: "Ovulation",
                      day: cycleLengthNum,
                  },
                  {
                      time: cycleLengthNum + periodDurationNum,
                      phase: "Luteal Phase",
                      day: cycleLengthNum + periodDurationNum,
                  },
              ]
            : [];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-3xl font-bold lg:text-4xl">
                        Period Calculator: Predict Your Next Cycle
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your estimated ovulation date and period dates based on your cycle.
                    </p>
                </div>

                <Card className="shadow-lg rounded-lg border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Enter Your Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label
                                    className="block mb-2 font-medium text-gray-700"
                                    htmlFor="startDate"
                                >
                                    When did your last period start?
                                </Label>
                                <Input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <Label
                                    className="block mb-2 font-medium text-gray-700"
                                    htmlFor="periodDuration"
                                >
                                    How many days did it last?
                                </Label>
                                <Input
                                    type="number"
                                    id="periodDuration"
                                    value={periodDuration}
                                    onChange={(e) => setPeriodDuration(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    placeholder="e.g. 5"
                                />
                            </div>

                            <div>
                                <Label
                                    className="block mb-2 font-medium text-gray-700"
                                    htmlFor="cycleLength"
                                >
                                    Average cycle length (days)
                                </Label>
                                <Input
                                    type="number"
                                    id="cycleLength"
                                    value={cycleLength}
                                    onChange={(e) => setCycleLength(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    placeholder="e.g. 28"
                                />
                            </div>
                        </div>

                        <Button onClick={handleCalculate} className="w-full p-5">
                            See Results
                        </Button>
                    </CardContent>
                </Card>

                {/* Only show results and charts after a successful calculation */}
                {result && (
                    <div className="mt-12">
                        <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-2xl font-bold text-indigo-600">
                                Your Results
                            </h2>
                            <div className="mt-4 text-lg text-gray-800">
                                <p>
                                    Your estimated ovulation date is:{" "}
                                    <span className="font-semibold">
                                        {format(result.ovulationDate, "MMM dd, yyyy")}
                                    </span>
                                </p>
                                <p>
                                    Your estimated period dates are:{" "}
                                    <span className="font-semibold">
                                        {format(result.nextPeriodStart, "MMM dd, yyyy")} -{" "}
                                        {format(result.nextPeriodEnd, "MMM dd, yyyy")}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Pie Chart – only has data after result exists */}
                        <div className="mt-6 h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
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
                        </div>

                        {/* Line Chart */}
                        <div className="mt-6 h-72">
                            <LineResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <LineTooltip />
                                    <LineLegend />
                                    <Line type="monotone" dataKey="day" stroke="#8884d8" />
                                </LineChart>
                            </LineResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default PeriodCalculator;

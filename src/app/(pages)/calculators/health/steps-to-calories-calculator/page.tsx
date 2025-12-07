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
import Wrapper from '@/app/Wrapper';
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
    CartesianGrid,
    Tooltip as LineTooltip,
    Legend as LineLegend,
    ResponsiveContainer as LineResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";

interface CaloriesResult {
    caloriesBurned: number;
    caloriesPerStep: number;
}

// Helper Function to Calculate Calories burned based on input parameters
const calculateCalories = (weight: number, steps: number, speed: string) => {
    // weight isn't used in this simple model but kept in signature
    let caloriesPerStep: number;
    if (speed === "Slow") {
        caloriesPerStep = 0.015;
    } else if (speed === "Average") {
        caloriesPerStep = 0.021366;
    } else {
        caloriesPerStep = 0.03;
    }

    const caloriesBurned = caloriesPerStep * steps;
    return { caloriesBurned, caloriesPerStep };
};

const StepsToCaloriesCalculator = () => {
    // use strings so fields can be empty
    const [weight, setWeight] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [steps, setSteps] = useState<string>("");
    const [speed, setSpeed] = useState<string>("Average");
    const [result, setResult] = useState<CaloriesResult | null>(null);

    const handleCalculate = () => {
        if (!weight.trim() || !height.trim() || !steps.trim()) {
            toast.error("Please fill out all fields.");
            return;
        }

        const weightNum = Number(weight);
        const heightNum = Number(height);
        const stepsNum = Number(steps);

        if (!Number.isFinite(weightNum) || weightNum <= 0) {
            toast.error("Please enter a valid weight.");
            return;
        }

        if (!Number.isFinite(heightNum) || heightNum <= 0) {
            toast.error("Please enter a valid height.");
            return;
        }

        if (!Number.isFinite(stepsNum) || stepsNum <= 0) {
            toast.error("Please enter a valid number of steps.");
            return;
        }

        const { caloriesBurned, caloriesPerStep } = calculateCalories(
            weightNum,
            stepsNum,
            speed
        );
        setResult({ caloriesBurned, caloriesPerStep });
    };

    const data = [
        {
            name: "Calories Burned",
            value: result ? result.caloriesBurned : 0,
        },
        {
            name: "Remaining Calories",
            value: result ? 500 - result.caloriesBurned : 0, // example target
        },
    ];

    const lineChartData =
        result && result.caloriesBurned > 0
            ? [
                  { steps: 1000, calories: (result.caloriesPerStep * 1000) },
                  { steps: 2000, calories: (result.caloriesPerStep * 2000) },
                  { steps: 3000, calories: (result.caloriesPerStep * 3000) },
                  { steps: 4000, calories: (result.caloriesPerStep * 4000) },
                  { steps: 5000, calories: (result.caloriesPerStep * 5000) },
              ]
            : [];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Steps to Calories Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate the calories burned based on your steps, weight, and walking speed.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-4">
                            <div>
                                <Label className="black mb-1.5" htmlFor="weight">
                                    Weight (lbs)
                                </Label>
                                <Input
                                    type="number"
                                    id="weight"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 150"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="height">
                                    Height (ft)
                                </Label>
                                <Input
                                    type="number"
                                    id="height"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 5.5"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="steps">
                                    Number of Steps
                                </Label>
                                <Input
                                    type="number"
                                    id="steps"
                                    value={steps}
                                    onChange={(e) => setSteps(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 1000"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="speed">
                                    Speed
                                </Label>
                                <select
                                    id="speed"
                                    className="border p-2 rounded-md w-full"
                                    value={speed}
                                    onChange={(e) => setSpeed(e.target.value)}
                                >
                                    <option value="Slow">Slow</option>
                                    <option value="Average">Average</option>
                                    <option value="Fast">Fast</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            onClick={handleCalculate}
                            className="mt-4 p-5 w-full"
                        >
                            Calculate Calories
                        </Button>
                    </CardContent>
                </Card>

                {/* Only show results after a successful calculation */}
                {result && (
                    <div className="mt-8">
                        <div className="text-lg bg-zinc-100 p-5 rounded-xl">
                            <h2 className="text-xl font-semibold mb-2">Your Results</h2>
                            <p>
                                Calories Burned:{" "}
                                <b>{result.caloriesBurned.toFixed(2)}</b> kcal
                            </p>
                            <p>
                                Calories per Step:{" "}
                                <b>{result.caloriesPerStep.toFixed(6)}</b> kcal
                            </p>
                        </div>

                        <div className="h-72 mt-6">
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
                                    >
                                        <Cell key="cell1" fill="#82ca9d" />
                                        <Cell key="cell2" fill="#ff8042" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {lineChartData.length > 0 && (
                            <div className="h-72 mt-6">
                                <LineResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="steps" />
                                        <YAxis />
                                        <LineTooltip />
                                        <LineLegend />
                                        <Line
                                            type="monotone"
                                            dataKey="calories"
                                            stroke="#8884d8"
                                        />
                                    </LineChart>
                                </LineResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default StepsToCaloriesCalculator;
    
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, Legend as LineLegend, ResponsiveContainer as LineResponsiveContainer } from "recharts"; // Recharts for line chart
import { toast } from "react-toastify"; // Import toast for error handling

// Helper Function to Calculate Calories burned based on input parameters
const calculateCalories = (weight: number, steps: number, speed: string) => {
    let caloriesPerStep;
    if (speed === "Slow") {
        caloriesPerStep = 0.015; // Slow walking burn rate
    } else if (speed === "Average") {
        caloriesPerStep = 0.021366; // Average walking burn rate (from your image)
    } else {
        caloriesPerStep = 0.03; // Fast walking burn rate
    }

    const caloriesBurned = caloriesPerStep * steps;
    return { caloriesBurned, caloriesPerStep };
};

const StepsToCaloriesCalculator = () => {
    const [weight, setWeight] = useState<number>(150); // Default weight in lbs
    const [height, setHeight] = useState<number>(5.5); // Default height in feet
    const [steps, setSteps] = useState<number>(1000); // Default number of steps
    const [speed, setSpeed] = useState<string>("Average"); // Default speed
    const [result, setResult] = useState<any | null>(null);

    // Handle Calculate Button Click
    const handleCalculate = () => {
        if (!weight || !steps || !height) {
            toast.error("Please fill out all fields.");
            return;
        }

        const { caloriesBurned, caloriesPerStep } = calculateCalories(weight, steps, speed);
        setResult({ caloriesBurned, caloriesPerStep });
    };

    const data = [
        { name: "Calories Burned", value: result ? result.caloriesBurned : 0 },
        { name: "Remaining Calories", value: 500 - (result ? result.caloriesBurned : 0) }, // Example remaining calories
    ];

    const lineChartData = [
        { steps: 1000, calories: result ? result.caloriesBurned : 0 },
        { steps: 2000, calories: result ? result.caloriesBurned * 2 : 0 },
        { steps: 3000, calories: result ? result.caloriesBurned * 3 : 0 },
        { steps: 4000, calories: result ? result.caloriesBurned * 4 : 0 },
        { steps: 5000, calories: result ? result.caloriesBurned * 5 : 0 },
    ];

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
                                <Label className="black mb-1.5" htmlFor="weight">Weight (lbs)</Label>
                                <Input
                                    type="number"
                                    id="weight"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="height">Height (ft)</Label>
                                <Input
                                    type="number"
                                    id="height"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="steps">Number of Steps</Label>
                                <Input
                                    type="number"
                                    id="steps"
                                    value={steps}
                                    onChange={(e) => setSteps(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="speed">Speed</Label>
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

                        <Button onClick={handleCalculate} className="mt-4 p-5 w-full">Calculate Calories</Button>
                    </CardContent>
                </Card>

                {result && (
                    <div className="mt-8">
                        <div className="text-lg bg-zinc-100 p-5 rounded-xl">
                            <h2 className="text-xl font-semibold mb-2">Your Results</h2>
                            <p>Calories Burned: <b>{result.caloriesBurned.toFixed(2)}</b> kcal</p>
                            <p>Calories per Step: <b>{result.caloriesPerStep.toFixed(6)}</b> kcal</p>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
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

                        <LineResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineChartData}>
                                <Line type="monotone" dataKey="calories" stroke="#8884d8" />
                                <XAxis dataKey="steps" />
                                <YAxis />
                                <LineTooltip />
                                <LineLegend />
                            </LineChart>
                        </LineResponsiveContainer>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default StepsToCaloriesCalculator;
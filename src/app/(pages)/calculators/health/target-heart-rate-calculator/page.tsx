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
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"; // Shadcn Table
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"; // Recharts for pie chart
import { toast } from "react-toastify"; // Import toast for error handling

// Define type for the target heart rate ranges
interface TargetHeartRateRanges {
    [key: string]: {
        min: number;
        max: number;
    };
}

// Helper Function to Calculate Target Heart Rate
const calculateTargetHeartRate = (age: number, restingHeartRate: number) => {
    const maxHeartRate = 220 - age; // Max heart rate formula
    const heartRateReserve = maxHeartRate - restingHeartRate;

    // Calculate target heart rates for different exercise intensities
    const targetRates: TargetHeartRateRanges = {
        "Very Light": { min: restingHeartRate + 0.5 * heartRateReserve, max: restingHeartRate + 0.6 * heartRateReserve },
        Light: { min: restingHeartRate + 0.6 * heartRateReserve, max: restingHeartRate + 0.7 * heartRateReserve },
        Moderate: { min: restingHeartRate + 0.7 * heartRateReserve, max: restingHeartRate + 0.8 * heartRateReserve },
        Hard: { min: restingHeartRate + 0.8 * heartRateReserve, max: restingHeartRate + 0.9 * heartRateReserve },
        "VO2 Max": { min: restingHeartRate + 0.9 * heartRateReserve, max: restingHeartRate + heartRateReserve },
    };

    return { heartRateReserve, targetRates };
};

const TargetHeartRateCalculator = () => {
    const [age, setAge] = useState<number>(30); // Default age
    const [restingHeartRate, setRestingHeartRate] = useState<number>(70); // Default resting heart rate
    const [targetRates, setTargetRates] = useState<TargetHeartRateRanges | null>(null); // Updated state type

    const handleCalculate = () => {
        if (!age || !restingHeartRate) {
            toast.error("Please fill out all fields.");
            return;
        }

        const { heartRateReserve, targetRates } = calculateTargetHeartRate(age, restingHeartRate);
        setTargetRates(targetRates);
    };

    const data = [
        { name: "Very Light", value: targetRates ? targetRates["Very Light"].max : 0 },
        { name: "Light", value: targetRates ? targetRates["Light"].max : 0 },
        { name: "Moderate", value: targetRates ? targetRates["Moderate"].max : 0 },
        { name: "Hard", value: targetRates ? targetRates["Hard"].max : 0 },
        { name: "VO2 Max", value: targetRates ? targetRates["VO2 Max"].max : 0 },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Target Heart Rate Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your target heart rate based on your age and resting heart rate.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:gap-10 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="block mb-1.5" htmlFor="age">Age (years)</Label>
                                <Input
                                    type="number"
                                    id="age"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="block mb-1.5" htmlFor="restingHeartRate">Resting Heart Rate (bpm)</Label>
                                <Input
                                    type="number"
                                    id="restingHeartRate"
                                    value={restingHeartRate}
                                    onChange={(e) => setRestingHeartRate(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <Button onClick={handleCalculate} className="mt-4 p-5 w-full">Calculate</Button>
                    </CardContent>
                </Card>

                {targetRates && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Your Target Heart Rate</h2>

                        <Table className="mt-4">
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Exercise Intensity</TableCell>
                                    <TableCell>Target Heart Rate (bpm)</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.keys(targetRates).map((intensity, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{intensity}</TableCell>
                                        <TableCell>{targetRates[intensity].min.toFixed(0)} - {targetRates[intensity].max.toFixed(0)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

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
                                    <Cell key="cell3" fill="#ffbf00" />
                                    <Cell key="cell4" fill="#ff7f00" />
                                    <Cell key="cell5" fill="#ff0000" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default TargetHeartRateCalculator;
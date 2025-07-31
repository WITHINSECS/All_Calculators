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
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Recharts for line chart
import { toast } from "react-toastify"; // Import toast for error handling

// Define a type for the result state
interface BACResult {
    bac: number;
    hoursToZeroBAC: number;
}

// Helper function to calculate BAC
const calculateBAC = (weight: number, gender: string, time: number, beerAmount: number, wineAmount: number, liquorAmount: number, otherAmount: number) => {
    const alcoholInGrams = (beerAmount * 12 * 0.6) + (wineAmount * 5 * 0.6) + (liquorAmount * 1.5 * 0.4) + (otherAmount * 0.8); // Alcohol in grams (approximated values)

    // Widmark Formula for BAC calculation
    const r = gender === "Male" ? 0.68 : 0.55; // Alcohol distribution ratio for males and females
    let bac = (alcoholInGrams / (weight * r)) - (0.015 * time); // 0.015 is average alcohol elimination rate per hour

    // Ensure BAC doesn't go below 0
    bac = Math.max(0, bac);

    const hoursToZeroBAC = bac / 0.015; // Time to reach 0% BAC

    return { bac, hoursToZeroBAC };
};

const BACCalculator = () => {
    const [gender, setGender] = useState<string>("Male");
    const [weight, setWeight] = useState<number>(155); // Default weight in lbs
    const [time, setTime] = useState<number>(2); // Default time in hours
    const [beerAmount, setBeerAmount] = useState<number>(2); // Default beer amount
    const [wineAmount, setWineAmount] = useState<number>(1); // Default wine amount
    const [liquorAmount, setLiquorAmount] = useState<number>(1.5); // Default liquor amount
    const [otherAmount, setOtherAmount] = useState<number>(250); // Default other alcohol amount (ml)
    const [result, setResult] = useState<BACResult | null>(null); // Specify the type for result

    // Handle Calculate Button Click
    const handleCalculate = () => {
        if (!weight || !beerAmount || !wineAmount || !liquorAmount || !otherAmount || !time) {
            toast.error("Please fill out all fields.");
            return;
        }

        const { bac, hoursToZeroBAC } = calculateBAC(weight, gender, time, beerAmount, wineAmount, liquorAmount, otherAmount);
        setResult({ bac, hoursToZeroBAC });
    };

    const pastBACData = [
        { time: 0, bac: result ? result.bac : 0 },
        { time: 1, bac: result ? result.bac - 0.015 : 0 },
        { time: 2, bac: result ? result.bac - 0.03 : 0 },
        { time: 3, bac: result ? result.bac - 0.045 : 0 },
        { time: 4, bac: result ? result.bac - 0.06 : 0 },
    ];

    const futureBACData = [
        { time: 0, bac: result ? result.bac : 0 },
        { time: 1, bac: result ? result.bac - 0.015 : 0 },
        { time: 2, bac: result ? result.bac - 0.03 : 0 },
        { time: 3, bac: result ? result.bac - 0.045 : 0 },
        { time: 4, bac: result ? result.bac - 0.06 : 0 },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Blood Alcohol Concentration Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your BAC and see the change over time based on your alcohol consumption.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:gap-10 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="black mb-1.5" htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="border p-2 rounded-md w-full"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="weight">Body Weight (lbs)</Label>
                                <Input
                                    type="number"
                                    id="weight"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="time">Time Since First Drink (hours)</Label>
                                <Input
                                    type="number"
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="beerAmount">Beer (12oz bottle)</Label>
                                <Input
                                    type="number"
                                    id="beerAmount"
                                    value={beerAmount}
                                    onChange={(e) => setBeerAmount(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="wineAmount">Wine (5oz cup)</Label>
                                <Input
                                    type="number"
                                    id="wineAmount"
                                    value={wineAmount}
                                    onChange={(e) => setWineAmount(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="liquorAmount">Liquor (1.5oz shot)</Label>
                                <Input
                                    type="number"
                                    id="liquorAmount"
                                    value={liquorAmount}
                                    onChange={(e) => setLiquorAmount(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="otherAmount">Other Alcohol (ml)</Label>
                                <Input
                                    type="number"
                                    id="otherAmount"
                                    value={otherAmount}
                                    onChange={(e) => setOtherAmount(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <Button onClick={handleCalculate} className="mt-4 p-5 w-full">Calculate BAC</Button>
                    </CardContent>
                </Card>

                {result && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Your Results</h2>
                        <div className="text-lg mb-10">
                            <p>BAC is around {result.bac.toFixed(3)}%</p>
                            <p>It will take around {result.hoursToZeroBAC.toFixed(1)} hours to reach 0% BAC.</p>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={pastBACData}>
                                <Line type="monotone" dataKey="bac" stroke="#8884d8" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={futureBACData}>
                                <Line type="monotone" dataKey="bac" stroke="#82ca9d" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default BACCalculator;
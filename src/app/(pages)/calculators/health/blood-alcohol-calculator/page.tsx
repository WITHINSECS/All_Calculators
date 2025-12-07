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
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";

// Define a type for the result state
interface BACResult {
    bac: number;
    hoursToZeroBAC: number;
}

// Helper function to calculate BAC
const calculateBAC = (
    weight: number,
    gender: "Male" | "Female",
    time: number,
    beerAmount: number,
    wineAmount: number,
    liquorAmount: number,
    otherAmount: number
) => {
    // Approximate total alcohol in grams (very simplified)
    const alcoholInGrams =
        beerAmount * 12 * 0.6 +
        wineAmount * 5 * 0.6 +
        liquorAmount * 1.5 * 0.4 +
        otherAmount * 0.8;

    const r = gender === "Male" ? 0.68 : 0.55; // Widmark r
    let bac = alcoholInGrams / (weight * r) - 0.015 * time;

    // Ensure BAC doesn't go below 0
    bac = Math.max(0, bac);

    const hoursToZeroBAC = bac / 0.015;

    return { bac, hoursToZeroBAC };
};

const BACCalculator = () => {
    const [gender, setGender] = useState<"Male" | "Female">("Male");

    // Use strings so the inputs can start truly empty
    const [weight, setWeight] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [beerAmount, setBeerAmount] = useState<string>("");
    const [wineAmount, setWineAmount] = useState<string>("");
    const [liquorAmount, setLiquorAmount] = useState<string>("");
    const [otherAmount, setOtherAmount] = useState<string>("");

    const [result, setResult] = useState<BACResult | null>(null);

    const handleCalculate = () => {
        // Basic empty check
        if (
            !weight.trim() ||
            !time.trim() ||
            !beerAmount.trim() ||
            !wineAmount.trim() ||
            !liquorAmount.trim() ||
            !otherAmount.trim()
        ) {
            toast.error("Please fill out all fields.");
            return;
        }

        const weightNum = Number(weight);
        const timeNum = Number(time);
        const beerNum = Number(beerAmount);
        const wineNum = Number(wineAmount);
        const liquorNum = Number(liquorAmount);
        const otherNum = Number(otherAmount);

        if (!Number.isFinite(weightNum) || weightNum <= 0) {
            toast.error("Please enter a valid body weight.");
            return;
        }
        if (!Number.isFinite(timeNum) || timeNum < 0) {
            toast.error("Please enter a valid time since first drink.");
            return;
        }
        if (
            !Number.isFinite(beerNum) ||
            beerNum < 0 ||
            !Number.isFinite(wineNum) ||
            wineNum < 0 ||
            !Number.isFinite(liquorNum) ||
            liquorNum < 0 ||
            !Number.isFinite(otherNum) ||
            otherNum < 0
        ) {
            toast.error("Drink amounts cannot be negative.");
            return;
        }

        const { bac, hoursToZeroBAC } = calculateBAC(
            weightNum,
            gender,
            timeNum,
            beerNum,
            wineNum,
            liquorNum,
            otherNum
        );
        setResult({ bac, hoursToZeroBAC });
    };

    // Build a simple “BAC over next few hours” curve when result exists
    const bacChartData =
        result !== null
            ? Array.from({ length: 6 }, (_, i) => {
                  const t = i; // hours from now
                  const bacAtT = Math.max(result.bac - 0.015 * t, 0);
                  return { time: t, bac: bacAtT };
              })
            : [];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Blood Alcohol Concentration Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Estimate your BAC and how it changes over time based on your alcohol consumption.
                        Do <b>not</b> use this to decide if it is safe to drive.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:gap-10 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="black mb-1.5" htmlFor="gender">
                                    Gender
                                </Label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as "Male" | "Female")}
                                    className="border p-2 rounded-md w-full"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="weight">
                                    Body Weight (lbs)
                                </Label>
                                <Input
                                    type="number"
                                    id="weight"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 155"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="time">
                                    Time Since First Drink (hours)
                                </Label>
                                <Input
                                    type="number"
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 2"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="beerAmount">
                                    Beer (number of 12oz bottles)
                                </Label>
                                <Input
                                    type="number"
                                    id="beerAmount"
                                    value={beerAmount}
                                    onChange={(e) => setBeerAmount(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 2"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="wineAmount">
                                    Wine (number of 5oz glasses)
                                </Label>
                                <Input
                                    type="number"
                                    id="wineAmount"
                                    value={wineAmount}
                                    onChange={(e) => setWineAmount(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 1"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="liquorAmount">
                                    Liquor (number of 1.5oz shots)
                                </Label>
                                <Input
                                    type="number"
                                    id="liquorAmount"
                                    value={liquorAmount}
                                    onChange={(e) => setLiquorAmount(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 1"
                                />
                            </div>

                            <div>
                                <Label className="black mb-1.5" htmlFor="otherAmount">
                                    Other Alcohol (ml)
                                </Label>
                                <Input
                                    type="number"
                                    id="otherAmount"
                                    value={otherAmount}
                                    onChange={(e) => setOtherAmount(e.target.value)}
                                    className="w-full"
                                    placeholder="e.g. 250"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleCalculate}
                            className="mt-4 p-5 w-full"
                        >
                            Calculate BAC
                        </Button>
                    </CardContent>
                </Card>

                {/* Only show results after successful calculation */}
                {result && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Your Results</h2>
                        <div className="text-lg mb-10 bg-zinc-100 p-5 rounded-xl">
                            <p>
                                Estimated BAC:{" "}
                                <b>{result.bac.toFixed(3)}%</b>
                            </p>
                            <p>
                                Estimated time to reach 0% BAC:{" "}
                                <b>{result.hoursToZeroBAC.toFixed(1)} hours</b>
                            </p>
                        </div>

                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={bacChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="time"
                                        label={{ value: "Hours from now", position: "insideBottom", offset: -5 }}
                                    />
                                    <YAxis
                                        label={{ value: "BAC (%)", angle: -90, position: "insideLeft" }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="bac"
                                        stroke="#8884d8"
                                        name="BAC"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </Wrapper>
    );
};

export default BACCalculator;

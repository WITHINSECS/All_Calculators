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
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InflationCalculator() {
    const [initialAmount, setInitialAmount] = useState(0);
    const [inflationRate, setInflationRate] = useState(0);
    const [years, setYears] = useState(1);
    const [inflationResult, setInflationResult] = useState({ futureCost: 0, priceIncrease: 0 });
    const [errorMessage, setErrorMessage] = useState("");

    const calculateInflation = () => {
        // Check if inflation rate exceeds 20%
        if (inflationRate > 20) {
            toast.error("Inflation rate entered can be maximum up to 20%");
            return;
        }

        // Check if fields are empty or 0
        if (initialAmount === 0 || inflationRate === 0 || years === 0) {
            toast.error("All fields are required and cannot be zero.");
            return;
        }

        const rate = inflationRate / 100;
        // Future cost calculation based on compound interest formula: A = P * (1 + r)^t
        const futureCost = initialAmount * Math.pow(1 + rate, years);
        const priceIncrease = futureCost - initialAmount;

        setInflationResult({
            futureCost: parseFloat(futureCost.toFixed(2)),
            priceIncrease: parseFloat(priceIncrease.toFixed(2)),
        });
    };

    // Data for the pie chart
    const pieData = [
        { name: "Investment Amount", value: inflationResult.priceIncrease },
        { name: "Price Increase due to Inflation", value: inflationResult.futureCost - inflationResult.priceIncrease },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Inflation Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate the future cost of a product based on inflation over time.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="initialAmount">Initial Amount</Label>
                                <Input
                                    id="initialAmount"
                                    type="number"
                                    value={initialAmount}
                                    onChange={(e) => setInitialAmount(Number(e.target.value))}
                                    placeholder="Enter Initial Amount"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="inflationRate">Inflation Rate (%)</Label>
                                <Input
                                    id="inflationRate"
                                    type="number"
                                    value={inflationRate}
                                    onChange={(e) => setInflationRate(Math.min(Number(e.target.value), 20))}
                                    placeholder="Enter Inflation Rate"
                                />
                                {inflationRate > 20 && (
                                    <p className="text-red-500 text-sm">Error: Inflation rate entered can be maximum up to 20%</p>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="years">Number of Years</Label>
                                <Input
                                    id="years"
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Number(e.target.value))}
                                    placeholder="Enter Number of Years"
                                />
                            </div>
                            <div className="flex justify-center mt-4">
                                <Button className="w-full" onClick={calculateInflation}>Calculate</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {inflationResult.futureCost > 0 && (
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Details</TableHead>
                                            <TableHead>Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Future Cost</TableCell>
                                            <TableCell>₹{inflationResult.futureCost}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Current Cost</TableCell>
                                            <TableCell>₹{initialAmount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Price Increase due to Inflation</TableCell>
                                            <TableCell>₹{inflationResult.priceIncrease}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

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
                                                label
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={index === 0 ? "#82ca9d" : "#ff7300"} // Different colors for each slice
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </Wrapper>
    );
}
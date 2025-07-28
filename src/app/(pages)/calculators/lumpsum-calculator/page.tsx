"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";

export default function InvestmentCalculator() {
    const [totalInvestment, setTotalInvestment] = useState(25000);
    const [returnRate, setReturnRate] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);
    const [investedAmount, setInvestedAmount] = useState(0);
    const [estReturns, setEstReturns] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");

    const calculateInvestment = () => {
        if (!totalInvestment || !returnRate || !timePeriod) {
            setAlertMessage("Please fill in all fields correctly.");
            return;
        }

        // Calculate Lumpsum Future Value
        const rate = returnRate / 100;
        const futureValue = totalInvestment * Math.pow(1 + rate, timePeriod);

        setInvestedAmount(totalInvestment);
        setEstReturns(parseFloat((futureValue - totalInvestment).toFixed(2)));
        setTotalValue(parseFloat(futureValue.toFixed(2)));

        setAlertMessage(""); // Reset alert message after successful calculation
    };

    const handleCalculate = () => {
        calculateInvestment();
    };

    const handleClear = () => {
        setTotalInvestment(25000);
        setReturnRate(12);
        setTimePeriod(10);
        setInvestedAmount(0);
        setEstReturns(0);
        setTotalValue(0);
        setAlertMessage(""); // Reset alert message on clear
    };

    // Pie chart data
    const pieData = [
        { name: "Invested amount", value: investedAmount },
        { name: "Est. returns", value: estReturns },
    ];

    // Line chart data (showing the growth of the investment over time)
    const lineData = Array.from({ length: timePeriod }, (_, i) => {
        const year = i + 1;
        const futureValue = totalInvestment * Math.pow(1 + returnRate / 100, year);
        return { name: `Year ${year}`, value: futureValue };
    });

    const COLORS = ["#000", "#82ca9d"];

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Lumpsum Investment Calculator</h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        Use this tool to calculate how much wealth you can generate from a lumpsum investment.
                    </p>
                </div>
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="totalInvestment">Total investment</Label>
                            <Input
                                id="totalInvestment"
                                type="number"
                                value={totalInvestment}
                                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                                placeholder="Enter Amount"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="returnRate">Expected return rate (p.a)</Label>
                            <Input
                                id="returnRate"
                                type="number"
                                value={returnRate}
                                onChange={(e) => setReturnRate(Number(e.target.value))}
                                placeholder="Enter Rate"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timePeriod">Time period (in years)</Label>
                            <Input
                                id="timePeriod"
                                type="number"
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(Number(e.target.value))}
                                placeholder="Enter Time Period"
                            />
                        </div>

                        <div className="mt-4 flex gap-4">
                            <Button onClick={handleCalculate}>Calculate</Button>
                            <Button variant="outline" onClick={handleClear}>Clear</Button>
                        </div>

                        {alertMessage && (
                            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{alertMessage}</div>
                        )}
                    </div>

                    {totalValue > 0 && (
                        <>
                            {/* Results Table */}
                            <div className="mt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Amount (₹)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Invested Amount</TableCell>
                                            <TableCell className="text-right">₹{investedAmount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Est. Returns</TableCell>
                                            <TableCell className="text-right">₹{estReturns}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Total Value</TableCell>
                                            <TableCell className="text-right font-medium">₹{totalValue}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

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
                                            paddingAngle={5}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Line Chart */}
                            <div className="mt-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={lineData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}
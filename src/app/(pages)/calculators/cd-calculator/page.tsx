"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import Wrapper from "@/app/Wrapper";
import { Label } from "@/components/ui/label";

export default function Calculator() {
    // Initialize state as empty string
    const [initialDeposit, setInitialDeposit] = useState<string>("");
    const [period, setPeriod] = useState<string>("");
    const [apy, setApy] = useState<string>("");
    const [timeUnit, setTimeUnit] = useState("Years");

    // Function to calculate compound interest based on the time period
    const calculateCompoundInterest = (principal: number, rate: number, time: number) => {
        const annualRate = rate / 100;
        const years = timeUnit === "Months" ? time / 12 : time;
        return principal * Math.pow(1 + annualRate, years);
    };

    // Handle changes for Initial Deposit
    const handleInitialDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInitialDeposit(value === "" ? "" : value); // Handle empty input
    };

    // Handle changes for Period
    const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPeriod(value === "" ? "" : value); // Handle empty input
    };

    // Handle changes for APY
    const handleApyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setApy(value === "" ? "" : value); // Handle empty input
    };

    // If initial values are entered, proceed with calculation
    const totalBalance = initialDeposit && period && apy ? calculateCompoundInterest(Number(initialDeposit), Number(apy), Number(period)) : 0;
    const totalInterest = totalBalance - (initialDeposit ? Number(initialDeposit) : 0);

    const data = Array.from({ length: Number(period) }, (_, i) => {
        const year = i + 1;
        const balance = calculateCompoundInterest(Number(initialDeposit), Number(apy), year);
        const nationalAvgBalance = calculateCompoundInterest(Number(initialDeposit), 1.5, year);
        return { name: `Year ${year}`, "Your earnings": balance, "National Average": nationalAvgBalance };
    });

    const pieData = [
        { name: "Your Earnings", value: totalInterest },
        { name: "National Average", value: calculateCompoundInterest(Number(initialDeposit), 1.5, Number(period)) - (Number(initialDeposit)) }
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">CD Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="initialDeposit">Initial Deposit:</Label>
                            <Input
                                id="initialDeposit"
                                type="number"
                                value={initialDeposit}
                                onChange={handleInitialDepositChange}
                                placeholder="Enter Initial Deposit"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Your total balance</Label>
                            <div className="text-3xl font-bold">${totalBalance.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="period">Over a period of:</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="period"
                                    type="number"
                                    value={period}
                                    onChange={handlePeriodChange}
                                    placeholder="Enter Period"
                                />
                                <select
                                    value={timeUnit}
                                    onChange={(e) => setTimeUnit(e.target.value)}
                                    className="p-2 border rounded"
                                >
                                    <option>Years</option>
                                    <option>Months</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="apy">APY:</Label>
                            <Input
                                id="apy"
                                type="number"
                                value={apy}
                                onChange={handleApyChange}
                                step="0.01"
                                placeholder="Enter APY"
                            />
                            %
                        </div>
                    </div>
                    <div className="mt-6">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Your earnings" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="National Average" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <ResponsiveContainer width="50%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    <Cell fill="#82ca9d" />
                                    <Cell fill="#8884d8" />
                                </Pie>
                                <PieTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <Table className="mt-6">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Interest earned by year {period}:</TableCell>
                                <TableCell>${totalInterest.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Your earnings:</TableCell>
                                <TableCell>${totalInterest.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>National Average:</TableCell>
                                <TableCell>${(calculateCompoundInterest(Number(initialDeposit), 1.5, Number(period)) - Number(initialDeposit)).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total interest earned =</TableCell>
                                <TableCell>${totalInterest.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Wrapper>
    );
}
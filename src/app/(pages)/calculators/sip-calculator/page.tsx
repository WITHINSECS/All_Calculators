"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";

export default function InvestmentCalculator() {
    const [frequency, setFrequency] = useState<"monthly" | "weekly" | "daily">("monthly");
    const [amount, setAmount] = useState("");
    const [rate, setRate] = useState("");
    const [tenure, setTenure] = useState("");
    const [result, setResult] = useState<{ invested: number; returns: number; wealth: number } | null>(null);

    const handleCalculate = () => {
        const P = parseFloat(amount); // Principal
        const R = parseFloat(rate) / 100; // Interest rate
        const T = parseFloat(tenure); // Tenure in years

        let n = 12;
        if (frequency === "weekly") n = 52;
        else if (frequency === "daily") n = 365;

        const totalInstallments = n * T;
        const i = R / n;
        const FV = P * (((Math.pow(1 + i, totalInstallments) - 1) / i) * (1 + i));
        const invested = P * totalInstallments;
        const returns = FV - invested;

        setResult({
            invested: parseFloat(invested.toFixed(2)),
            returns: parseFloat(returns.toFixed(2)),
            wealth: parseFloat(FV.toFixed(2)),
        });
    };

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        SIP Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        Wish to invest periodically? Calculate the amount of wealth that you can generate using our SIP Calculator.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="mb-1.5 block font-semibold">Frequency of Investment:</label>
                            <Select value={frequency} onValueChange={(val) => setFrequency(val as any)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="mb-1.5 block font-semibold">Monthly Investment Amount <span className="text-red-600">*</span></label>
                            <Input
                                placeholder="Ex: 1000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="mb-1.5 block font-semibold">Expected rate of return (P.A) <span className="text-red-600">*</span></label>
                            <Input
                                placeholder="Ex: 12%"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                type="number"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="mb-1.5 block font-semibold">
                                Tenure (in years) <span className="text-red-600">*</span> <span className="text-xs text-gray-600">(Up to 50 years)</span>
                            </label>
                            <Input
                                placeholder="Ex: 10"
                                value={tenure}
                                onChange={(e) => setTenure(e.target.value)}
                                type="number"
                                max={50}
                            />
                        </div>
                    </div>

                    <Button onClick={handleCalculate}>Plan My Wealth</Button>

                    {result && (
                        <div className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Total Invested</TableHead>
                                        <TableHead>Total Returns</TableHead>
                                        <TableHead>Total Wealth</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>₹{result.invested.toLocaleString()}</TableCell>
                                        <TableCell>₹{result.returns.toLocaleString()}</TableCell>
                                        <TableCell>₹{result.wealth.toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
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
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Label } from "@/components/ui/label";
import Wrapper from '@/app/Wrapper';

interface AmortizationInput {
    loanAmount: number;
    loanTerm: number;
    interestRate: number;
}

interface AmortizationResult {
    monthlyPayment: number;
    totalPayments: number;
    totalInterest: number;
    totalLoanCost: number; // Added to track total cost
    annualSchedule: { year: number; interest: number; principal: number; endingBalance: number }[];
    monthlySchedule: { month: number; interest: number; principal: number; balance: number }[]; // Monthly schedule added
    chartData: { year: number; balance: number; interest: number; payment: number }[];
}

const calculateAmortization = (input: AmortizationInput): AmortizationResult => {
    const monthlyInterestRate = input.interestRate / 100 / 12;
    const totalPayments = input.loanTerm * 12;
    const monthlyPayment = (input.loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
    let balance = input.loanAmount;
    let totalInterest = 0;
    let totalPrincipal = 0;
    const annualSchedule = [];
    const monthlySchedule = [];
    const chartData = [];

    // Generate annual and monthly schedules
    for (let month = 1; month <= totalPayments; month++) {
        const interest = balance * monthlyInterestRate;
        const principal = monthlyPayment - interest;
        balance -= principal;
        totalInterest += interest;
        totalPrincipal += principal;

        // Create monthly schedule data
        monthlySchedule.push({ month, interest, principal, balance });

        // Add annual breakdown
        if (month % 12 === 0) {
            const year = month / 12;
            const annualInterest = totalInterest - totalPrincipal;
            annualSchedule.push({
                year,
                interest: annualInterest,
                principal: totalPrincipal,
                endingBalance: balance,
            });

            chartData.push({
                year,
                balance,
                interest: annualInterest,
                payment: monthlyPayment * 12, // Payment is annual
            });
        }

        if (balance < 0) balance = 0;
    }

    const totalLoanCost = monthlyPayment * totalPayments;

    return {
        monthlyPayment,
        totalPayments: totalLoanCost,
        totalInterest,
        totalLoanCost, // Total loan cost
        annualSchedule,
        monthlySchedule,
        chartData,
    };
};

export default function AmortizationCalculator() {
    const [input, setInput] = useState<AmortizationInput>({
        loanAmount: 200000,
        loanTerm: 15,
        interestRate: 6,
    });
    const [result, setResult] = useState<AmortizationResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleCalculate = () => {
        const calcResult = calculateAmortization(input);
        setResult(calcResult);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Amortization Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Amortization Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Loan Amount</Label>
                                    <Input className="mt-1 mb-2" name="loanAmount" value={input.loanAmount} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Loan Term</Label>
                                    <Input className="mt-1 mb-2" name="loanTerm" value={input.loanTerm} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Interest Rate</Label>
                                    <Input className="mt-1 mb-2" name="interestRate" value={input.interestRate} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button className="w-full p-5" onClick={handleCalculate}>
                                    Calculate
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-5">
                    <CardHeader>
                        <CardTitle className="text-xl">Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 grid-cols-1 mb-5 gap-4">
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Monthly Payment</TableCell>
                                            <TableCell className="text-right">${result?.monthlyPayment.toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total Payments</TableCell>
                                            <TableCell className="text-right">${result?.totalPayments.toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total Interest</TableCell>
                                            <TableCell className="text-right">${result?.totalInterest.toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total Loan Cost</TableCell>
                                            <TableCell className="text-right">${result?.totalLoanCost.toFixed(2)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="w-full flex items-center justify-center">
                                <PieChart width={200} height={200}>
                                    <Pie
                                        data={[
                                            { name: "Principal", value: input.loanAmount },
                                            { name: "Interest", value: result?.totalInterest },
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        <Cell fill="#3498db" />
                                        <Cell fill="#e74c3c" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={result?.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="balance" stroke="#3498db" name="Balance" />
                                <Line type="monotone" dataKey="interest" stroke="#e74c3c" name="Interest" />
                                <Line type="monotone" dataKey="payment" stroke="#2ecc71" name="Payment" />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className="mt-4">
                            <h4>Amortization Schedule</h4>
                            <Tabs defaultValue="annual">
                                <TabsList>
                                    <TabsTrigger value="annual">Annual Schedule</TabsTrigger>
                                    <TabsTrigger value="monthly">Monthly Schedule</TabsTrigger>
                                </TabsList>
                                <TabsContent value="annual">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Year</TableHead>
                                                <TableHead>Interest</TableHead>
                                                <TableHead>Principal</TableHead>
                                                <TableHead>Ending Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {result?.annualSchedule.map((item) => (
                                                <TableRow key={item.year}>
                                                    <TableCell>{item.year}</TableCell>
                                                    <TableCell>${item.interest.toFixed(2)}</TableCell>
                                                    <TableCell>${item.principal.toFixed(2)}</TableCell>
                                                    <TableCell>${item.endingBalance.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="monthly">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Month</TableHead>
                                                <TableHead>Interest</TableHead>
                                                <TableHead>Principal</TableHead>
                                                <TableHead>Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {result?.monthlySchedule.map((item) => (
                                                <TableRow key={item.month}>
                                                    <TableCell>{item.month}</TableCell>
                                                    <TableCell>${item.interest.toFixed(2)}</TableCell>
                                                    <TableCell>${item.principal.toFixed(2)}</TableCell>
                                                    <TableCell>${item.balance.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}
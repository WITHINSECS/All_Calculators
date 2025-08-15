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
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'react-toastify';

export default function NPSCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState<string>("");
    const [currentAge, setCurrentAge] = useState<string>("");
    const [expectedROI, setExpectedROI] = useState<string>("");
    const [annuityPercentage, setAnnuityPercentage] = useState<string>("");
    const [expectedReturns, setExpectedReturns] = useState<string>("");
    const [npsResult, setNpsResult] = useState({
        pensionWealth: 0,
        investmentAmount: 0,
        lumpsumWithdrawn: 0,
        annuityValue: 0,
        monthlyPension: 0
    });
    const [errorMessage, setErrorMessage] = useState("");

    const calculateNPS = () => {
        // Parse string inputs to numbers
        const monthlyInvestmentNum = parseFloat(monthlyInvestment);
        const currentAgeNum = parseFloat(currentAge);
        const expectedROINum = parseFloat(expectedROI);
        const annuityPercentageNum = parseFloat(annuityPercentage);
        const expectedReturnsNum = parseFloat(expectedReturns);

        // Validation: Check if any field is empty or zero
        if (!monthlyInvestment || !currentAge || !expectedROI || !annuityPercentage || !expectedReturns || 
            monthlyInvestmentNum <= 0 || currentAgeNum <= 0 || expectedROINum <= 0 || annuityPercentageNum <= 0 || expectedReturnsNum <= 0) {
            toast.error("All fields are required and cannot be zero.");
            return;
        }

        // Ensure Expected ROI and Expected Returns do not exceed 30
        if (expectedROINum > 30 || expectedReturnsNum > 30) {
            setErrorMessage("Expected Return on Investment and Expected Returns from the Annuity cannot be more than 30.");
            toast.error("Expected ROI and Expected Returns cannot be more than 30.");
            return;
        } else {
            setErrorMessage(""); // Clear error message
        }

        const totalYears = 60 - currentAgeNum;
        const totalAmount = monthlyInvestmentNum * 12 * totalYears * (1 + expectedROINum / 100);
        const annuityAmount = totalAmount * (annuityPercentageNum / 100);
        const lumpsumAmount = totalAmount - annuityAmount;
        const pensionWealth = totalAmount + (annuityAmount * expectedReturnsNum / 100);
        const monthlyPension = annuityAmount / 12;

        setNpsResult({
            pensionWealth,
            investmentAmount: monthlyInvestmentNum * 12 * totalYears,
            lumpsumWithdrawn: lumpsumAmount,
            annuityValue: annuityAmount,
            monthlyPension
        });
    };

    const pieData = [
        { name: "Investment Amount", value: npsResult.investmentAmount },
        { name: "Lumpsum Withdrawn", value: npsResult.lumpsumWithdrawn },
        { name: "Annuity Value", value: npsResult.annuityValue },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">NPS Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your National Pension System (NPS) and visualize the results.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="monthlyInvestment">Monthly Investment</Label>
                                <Input
                                    id="monthlyInvestment"
                                    type="number"
                                    value={monthlyInvestment}
                                    onChange={(e) => setMonthlyInvestment(e.target.value)}
                                    placeholder="Enter Monthly Investment"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="currentAge">Current Age</Label>
                                <Input
                                    id="currentAge"
                                    type="number"
                                    value={currentAge}
                                    onChange={(e) => setCurrentAge(e.target.value)}
                                    placeholder="Enter Current Age"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="expectedROI">Expected Return on Investment (%)</Label>
                                <Input
                                    id="expectedROI"
                                    type="number"
                                    value={expectedROI}
                                    onChange={(e) => setExpectedROI(Math.min(Number(e.target.value), 30).toString())}
                                    placeholder="Enter Expected ROI"
                                />
                                {parseFloat(expectedROI) > 30 && (
                                    <p className="text-red-500 text-sm">Cannot be more than 30.</p>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="annuityPercentage">Percentage of Annuity Purchase (%)</Label>
                                <Input
                                    id="annuityPercentage"
                                    type="number"
                                    value={annuityPercentage}
                                    onChange={(e) => setAnnuityPercentage(e.target.value)}
                                    placeholder="Enter Annuity Percentage"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="expectedReturns">Expected Returns from the Annuity (%)</Label>
                                <Input
                                    id="expectedReturns"
                                    type="number"
                                    value={expectedReturns}
                                    onChange={(e) => setExpectedReturns(Math.min(Number(e.target.value), 30).toString())}
                                    placeholder="Enter Expected Returns"
                                />
                                {parseFloat(expectedReturns) > 30 && (
                                    <p className="text-red-500 text-sm">Cannot be more than 30.</p>
                                )}
                            </div>
                            <div className="flex justify-center mt-4">
                                <Button className="w-full" onClick={calculateNPS}>Calculate</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Table */}
                {npsResult.pensionWealth > 0 && (
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
                                            <TableCell>Pension Wealth</TableCell>
                                            <TableCell>₹{npsResult.pensionWealth.toLocaleString()}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Investment Amount</TableCell>
                                            <TableCell>₹{npsResult.investmentAmount.toLocaleString()}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Lumpsum Amount Withdrawn</TableCell>
                                            <TableCell>₹{npsResult.lumpsumWithdrawn.toLocaleString()}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Annuity Value</TableCell>
                                            <TableCell>₹{npsResult.annuityValue.toLocaleString()}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Monthly Pension</TableCell>
                                            <TableCell>₹{npsResult.monthlyPension.toLocaleString()}</TableCell>
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
                                                fill="#8884d8"
                                                label
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#82ca9d" : "#ff7300"} />
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
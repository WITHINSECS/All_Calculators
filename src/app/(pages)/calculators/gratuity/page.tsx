"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Wrapper from "@/app/Wrapper";

export default function GratuityCalculator() {
    const [salary, setSalary] = useState<number>(0);
    const [years, setYears] = useState<number>(5);
    const [months, setMonths] = useState<number>(0);
    const [totalGratuity, setTotalGratuity] = useState<number>(0);
    const [alertMessage, setAlertMessage] = useState<string>("");

    const calculateGratuity = () => {
        if (salary <= 0 || years <= 0 || months < 0) {
            setAlertMessage("Please fill all the fields correctly.");
            return;
        }

        // Calculate the total number of years worked
        const totalService = years + months / 12;

        // Gratuity formula: (Salary * 15 * years) / 26
        const gratuity = (salary * 15 * totalService) / 26;

        setTotalGratuity(Math.round(gratuity));
        setAlertMessage(""); // Reset alert message after successful calculation
    };

    const handleCalculate = () => {
        calculateGratuity();
    };

    const handleClear = () => {
        setSalary(0);
        setYears(5);
        setMonths(0);
        setTotalGratuity(0);
        setAlertMessage(""); // Reset alert message on clear
    };

    // Pie chart data
    const pieData = [
        { name: "Base Salary Contribution", value: salary * 15 },
        { name: "Years Worked Contribution", value: (salary * 15 * years) / 26 }
    ];

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Gratuity Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 md:text-lg">
                        Calculate how much gratuity you will receive after working for a certain number of years and months.
                    </p>
                </div>

                {/* Input Section */}
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="salary">Final Salary (Annual)</Label>
                            <Input
                                id="salary"
                                type="number"
                                value={salary ? salary : ""}
                                onChange={(e) => setSalary(Number(e.target.value))}
                                placeholder="Salary (PKR)"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">How long did you work?</Label>
                            <div className="flex space-x-2">
                                <Select
                                    value={years.toString()}
                                    onValueChange={(value) => setYears(Number(value))}
                                >
                                    <SelectTrigger id="years">
                                        <SelectValue placeholder="0 years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 50 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i} years
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={months.toString()}
                                    onValueChange={(value) => setMonths(Number(value))}
                                >
                                    <SelectTrigger id="months">
                                        <SelectValue placeholder="0 months" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i} months
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <div className="mt-4">
                        <Button onClick={handleCalculate} className="w-full p-5">
                            Calculate Now
                        </Button>
                    </div>

                    {/* Alert Message */}
                    {alertMessage && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{alertMessage}</div>
                    )}

                    {/* Results Table */}
                    {totalGratuity > 0 && (
                        <div className="mt-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Your Gratuity Details</h3>
                                <div className="flex justify-between">
                                    <span>Calculated Gratuity</span>
                                    <span>₹{totalGratuity.toLocaleString()}</span>
                                </div>
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
                                            <Cell fill="#0D74FF" />
                                            <Cell fill="#FF5733" />
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Clear Button */}
                            <div className="mt-4">
                                <Button variant="outline" onClick={handleClear}>Clear</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}
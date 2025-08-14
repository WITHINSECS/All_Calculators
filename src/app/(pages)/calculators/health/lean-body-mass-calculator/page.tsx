"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Wrapper from '@/app/Wrapper';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

interface LBMInput {
    gender: string;
    age: number;
    height: number;
    weight: number;
}

interface LBMResult {
    lbm: number;
    fatMass: number;
    chartData: { age: number; lbm: number; fatMass: number }[];
}

const calculateLBM = (input: LBMInput): LBMResult => {
    let lbm = 0;
    if (input.gender === "male") {
        lbm = 0.407 * input.weight + 0.267 * input.height - 19.2; // Formula for males
    } else if (input.gender === "female") {
        lbm = 0.252 * input.weight + 0.473 * input.height - 48.3; // Formula for females
    }

    const fatMass = input.weight - lbm; // Fat mass = Total weight - Lean Body Mass

    // Generate data for the line chart (LBM and Fat Mass change with age)
    const chartData = [];
    for (let i = 18; i <= input.age; i++) {
        const estimatedLBM = lbm - (0.1 * (input.age - i)); // Assuming LBM decreases slightly with age
        const estimatedFatMass = input.weight - estimatedLBM;
        chartData.push({ age: i, lbm: estimatedLBM, fatMass: estimatedFatMass });
    }

    return { lbm, fatMass, chartData };
};

export default function LBMCalculator() {
    const [input, setInput] = useState<LBMInput>({
        gender: "male",
        age: 21,
        height: 170,
        weight: 70,
    });

    const [result, setResult] = useState<LBMResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value === "" ? "" : Number(value), // Handle empty input
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleCalculate = () => {
        if (isNaN(input.age) || input.age <= 0) {
            setError("Please enter a valid age.");
            return;
        }

        if (isNaN(input.height) || input.height <= 0) {
            setError("Please enter a valid height.");
            return;
        }

        if (isNaN(input.weight) || input.weight <= 0) {
            setError("Please enter a valid weight.");
            return;
        }

        setError(null); // Clear error message if inputs are valid
        const calcResult = calculateLBM(input);
        setResult(calcResult);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Lean Body Mass (LBM) Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Enter details below to calculate your Lean Body Mass (LBM).
                    </p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                    {/* Gender Selection */}
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                            onValueChange={(value) => handleSelectChange("gender", value)}
                            defaultValue="male"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Age Input */}
                    <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                            className="mt-2 mb-3"
                            name="age"
                            value={input.age}
                            onChange={handleChange}
                            type="number"
                            inputMode="numeric"
                            placeholder="Enter your age"
                        />
                        <span>Years</span>
                    </div>

                    {/* Height Input */}
                    <div className="space-y-2">
                        <Label>Height</Label>
                        <Input
                            className="mt-2 mb-3"
                            name="height"
                            value={input.height}
                            onChange={handleChange}
                            type="number"
                            inputMode="numeric"
                            placeholder="Enter your height"
                        />
                        <span>cm</span>
                    </div>

                    {/* Weight Input */}
                    <div className="space-y-2">
                        <Label>Weight</Label>
                        <Input
                            className="mt-2 mb-3"
                            name="weight"
                            value={input.weight}
                            onChange={handleChange}
                            type="number"
                            inputMode="numeric"
                            placeholder="Enter your weight"
                        />
                        <span>kg</span>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button className="w-full p-5" onClick={handleCalculate}>
                            Calculate LBM
                        </Button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 text-red-500">{error}</div>
                )}

                {/* Results */}
                <div className="mt-4">
                    {result && (
                        <>
                            <h3 className="text-xl">Your Lean Body Mass (LBM): {result.lbm.toFixed(2)} kg</h3>
                            <h3 className="text-xl">Fat Mass: {result.fatMass.toFixed(2)} kg</h3>

                            {/* Pie Chart for Lean Body Mass and Fat Mass */}
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Lean Body Mass", value: result.lbm },
                                            { name: "Fat Mass", value: result.fatMass },
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        <Cell fill="#3498db" />
                                        <Cell fill="#e74c3c" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Line Chart for LBM and Fat Mass Change with Age */}
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={result.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="age" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="lbm" stroke="#3498db" name="Lean Body Mass" />
                                    <Line type="monotone" dataKey="fatMass" stroke="#e74c3c" name="Fat Mass" />
                                </LineChart>
                            </ResponsiveContainer>
                        </>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

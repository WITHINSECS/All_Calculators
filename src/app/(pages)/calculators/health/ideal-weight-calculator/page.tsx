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
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define literal types for gender and units to ensure type safety
type Gender = "Male" | "Female";
type Units = "Metric" | "Imperial";

export default function IdealWeightCalculator() {
    const [gender, setGender] = useState<Gender>("Male");
    const [age, setAge] = useState(20);
    const [heightFeet, setHeightFeet] = useState(5);
    const [heightInches, setHeightInches] = useState(9);
    const [heightCm, setHeightCm] = useState(180);
    const [unit, setUnit] = useState<Units>("Metric");
    const [idealWeightResult, setIdealWeightResult] = useState({
        peterson: 0,
        miller: 0,
        robinson: 0,
        devine: 0,
        hamwi: 0,
    });

    const calculateIdealWeight = () => {
        if (age <= 0 || (unit === "Metric" && heightCm <= 0) || (unit === "Imperial" && (heightFeet <= 0 || heightInches <= 0))) {
            toast.error("Please fill in all fields correctly.");
            return;
        }

        let heightInCm = unit === "Metric" ? heightCm : (heightFeet * 30.48 + heightInches * 2.54); // Convert height to cm

        // Apply formulas for Ideal Weight
        let petersonWeight = 0;
        let millerWeight = 0;
        let robinsonWeight = 0;
        let devineWeight = 0;
        let hamwiWeight = 0;

        if (gender === "Male") {
            petersonWeight = 50 + 0.91 * (heightInCm - 152.4); // Peterson formula (2016) for Men
            millerWeight = 56.2 + 1.41 * (heightInCm - 152.4); // Miller formula (1983) for Men
            robinsonWeight = 52 + 1.9 * (heightInCm - 152.4); // Robinson formula (1983) for Men
            devineWeight = 50 + 2.3 * (heightInCm - 152.4) / 2.54; // Devine formula (1974) for Men
            hamwiWeight = 48 + 2.7 * (heightInCm - 152.4) / 2.54; // Hamwi formula (1964) for Men
        } else {
            petersonWeight = 45.5 + 0.91 * (heightInCm - 152.4); // Peterson formula (2016) for Women
            millerWeight = 53.1 + 1.36 * (heightInCm - 152.4); // Miller formula (1983) for Women
            robinsonWeight = 49 + 1.7 * (heightInCm - 152.4); // Robinson formula (1983) for Women
            devineWeight = 45.5 + 2.3 * (heightInCm - 152.4) / 2.54; // Devine formula (1974) for Women
            hamwiWeight = 45.5 + 2.2 * (heightInCm - 152.4) / 2.54; // Hamwi formula (1964) for Women
        }

        // Set the calculated ideal weights
        setIdealWeightResult({
            peterson: petersonWeight,
            miller: millerWeight,
            robinson: robinsonWeight,
            devine: devineWeight,
            hamwi: hamwiWeight,
        });
    };

    const resetForm = () => {
        setGender("Male");
        setAge(20);
        setHeightFeet(5);
        setHeightInches(9);
        setHeightCm(180);
        setUnit("Metric");
        setIdealWeightResult({
            peterson: 0,
            miller: 0,
            robinson: 0,
            devine: 0,
            hamwi: 0,
        });
    };

    // Pie chart data
    const pieData = [
        { name: "Peterson", value: idealWeightResult.peterson },
        { name: "Miller", value: idealWeightResult.miller },
        { name: "Robinson", value: idealWeightResult.robinson },
        { name: "Devine", value: idealWeightResult.devine },
        { name: "Hamwi", value: idealWeightResult.hamwi },
    ];

    // Line chart data
    const lineChartData = [
        { height: 150, peterson: 45.5, miller: 50, robinson: 48, devine: 50, hamwi: 48.5 },
        { height: 160, peterson: 50, miller: 55, robinson: 53, devine: 55, hamwi: 53 },
        { height: 170, peterson: 55, miller: 60, robinson: 58, devine: 60, hamwi: 58.5 },
        { height: 180, peterson: 60, miller: 65, robinson: 63, devine: 65, hamwi: 63 },
        { height: 190, peterson: 65, miller: 70, robinson: 68, devine: 70, hamwi: 68 },
    ];

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Ideal Weight Calculator</h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Calculate your ideal weight based on various formulas.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Enter Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as "Male" | "Female")}
                                    className="p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    placeholder="Enter your age"
                                />
                            </div>

                            <div className="flex flex-col">
                                <Label className="block mb-1.5" htmlFor="height">Height</Label>
                                <div className="flex gap-4">
                                    <div>
                                        <input
                                            type="radio"
                                            id="metric"
                                            name="heightUnit"
                                            checked={unit === "Metric"}
                                            onChange={() => setUnit("Metric")}
                                        />
                                        <label htmlFor="metric">Metric (cms)</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id="imperial"
                                            name="heightUnit"
                                            checked={unit === "Imperial"}
                                            onChange={() => setUnit("Imperial")}
                                        />
                                        <label htmlFor="imperial">Imperial (feet/inches)</label>
                                    </div>
                                </div>
                                {unit === "Metric" ? (
                                    <Input
                                        id="heightCm"
                                        type="number"
                                        value={heightCm}
                                        onChange={(e) => setHeightCm(Number(e.target.value))}
                                        placeholder="Enter height in cms"
                                    />
                                ) : (
                                    <div className="flex gap-4">
                                        <Input
                                            id="heightFeet"
                                            type="number"
                                            value={heightFeet}
                                            onChange={(e) => setHeightFeet(Number(e.target.value))}
                                            placeholder="Feet"
                                        />
                                        <Input
                                            id="heightInches"
                                            type="number"
                                            value={heightInches}
                                            onChange={(e) => setHeightInches(Number(e.target.value))}
                                            placeholder="Inches"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center mt-4">
                                <Button className="w-full" onClick={calculateIdealWeight}>Calculate</Button>
                            </div>
                            <div className="flex justify-center">
                                <Button className="w-full" onClick={resetForm}>Reset</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {(idealWeightResult.peterson > 0) && (
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Ideal Weight According to:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Formula</TableHead>
                                            <TableHead>Weight (Kg) / Weight (lbs)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Peterson Formula (2016)</TableCell>
                                            <TableCell>{idealWeightResult.peterson.toFixed(2)} Kgs / {(idealWeightResult.peterson * 2.20462).toFixed(2)} Pounds</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Miller Formula (1983)</TableCell>
                                            <TableCell>{idealWeightResult.miller.toFixed(2)} Kgs / {(idealWeightResult.miller * 2.20462).toFixed(2)} Pounds</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Robinson Formula (1983)</TableCell>
                                            <TableCell>{idealWeightResult.robinson.toFixed(2)} Kgs / {(idealWeightResult.robinson * 2.20462).toFixed(2)} Pounds</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Devine Formula (1974)</TableCell>
                                            <TableCell>{idealWeightResult.devine.toFixed(2)} Kgs / {(idealWeightResult.devine * 2.20462).toFixed(2)} Pounds</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Hamwi Formula (1964)</TableCell>
                                            <TableCell>{idealWeightResult.hamwi.toFixed(2)} Kgs / {(idealWeightResult.hamwi * 2.20462).toFixed(2)} Pounds</TableCell>
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
                                                fill="#8884d8" // Add different colors if necessary
                                                label
                                            >
                                                <Cell fill="#82ca9d" />
                                                <Cell fill="#ff7300" />
                                                <Cell fill="#ffbf00" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Line Chart */}
                                <div className="mt-6">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={lineChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="height" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="peterson" stroke="#8884d8" />
                                            <Line type="monotone" dataKey="miller" stroke="#82ca9d" />
                                            <Line type="monotone" dataKey="robinson" stroke="#ff7300" />
                                            <Line type="monotone" dataKey="devine" stroke="#ffbf00" />
                                            <Line type="monotone" dataKey="hamwi" stroke="#ff0000" />
                                        </LineChart>
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
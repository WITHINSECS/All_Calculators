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
import Wrapper from '@/app/Wrapper'; // Ensure this wrapper component exists
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"; // Recharts for pie chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, Legend as LineLegend, ResponsiveContainer as LineResponsiveContainer } from "recharts"; // Recharts for line chart
import { toast } from "react-toastify"; // Import toast for error handling

// Define a type for the result state
interface VO2MaxResult {
  vo2Max: number;
  performance: string;
}

const calculateVO2Max = (weight: number, gender: string, age: number, time: number, heartRate: number) => {
  // Convert weight to kg
  const weightInKg = weight * 0.453592;

  // Gender is Male (1) or Female (0)
  const genderValue = gender === "Male" ? 1 : 0;

  // VO2 Max formula
  const vo2Max = (
    (132.853 - (0.0769 * weight) - (0.3877 * age) + (6.315 * genderValue) - (3.2649 * time) - (0.1565 * heartRate)) / weightInKg
  );

  // Return the VO2 Max value
  return vo2Max;
};

const VO2MaxCalculator = () => {
  const [gender, setGender] = useState<string>("Male");
  const [age, setAge] = useState<number>(30); // Default age
  const [weight, setWeight] = useState<number>(155); // Default weight in pounds
  const [time, setTime] = useState<number>(15); // Default duration for 1-mile walk in minutes
  const [heartRate, setHeartRate] = useState<number>(130); // Default heart rate in bpm
  const [result, setResult] = useState<VO2MaxResult | null>(null); // Updated state type

  // Handle Calculate Button Click
  const handleCalculate = () => {
    if (!weight || !time || !heartRate || !age) {
      toast.error("Please fill out all fields.");
      return;
    }

    const vo2Max = calculateVO2Max(weight, gender, age, time, heartRate);

    // Assign performance category based on VO2 Max
    let performance = "";
    if (vo2Max > 50) performance = "Excellent";
    else if (vo2Max > 40) performance = "Good";
    else if (vo2Max > 30) performance = "Average";
    else if (vo2Max > 20) performance = "Below Average";
    else performance = "Poor";

    setResult({ vo2Max, performance });
  };

  // Pie chart data (Categorized VO2 Max values)
  const data = [
    { name: "Excellent", value: result ? (result.vo2Max > 50 ? 1 : 0) : 0 },
    { name: "Good", value: result ? (result.vo2Max > 40 && result.vo2Max <= 50 ? 1 : 0) : 0 },
    { name: "Average", value: result ? (result.vo2Max > 30 && result.vo2Max <= 40 ? 1 : 0) : 0 },
    { name: "Below Average", value: result ? (result.vo2Max > 20 && result.vo2Max <= 30 ? 1 : 0) : 0 },
    { name: "Poor", value: result ? (result.vo2Max <= 20 ? 1 : 0) : 0 },
  ];

  // Line chart data (VO2 Max change over time for different durations)
  const lineChartData = [
    { time: 0, vo2Max: result ? result.vo2Max : 0 },
    { time: 1, vo2Max: result ? result.vo2Max * 1.05 : 0 }, // Example change over time
    { time: 2, vo2Max: result ? result.vo2Max * 1.1 : 0 },
    { time: 3, vo2Max: result ? result.vo2Max * 1.15 : 0 },
    { time: 4, vo2Max: result ? result.vo2Max * 1.2 : 0 },
  ];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            VO2 Max Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your VO2 Max based on your 1-mile walk performance.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:gap-10 md:grid-cols-2 gap-4">
              <div>
                <Label className="block mb-1.5" htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="age">Age (years)</Label>
                <Input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="weight">Weight (lbs)</Label>
                <Input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="time">Duration of 1 Mile Walk (in minutes)</Label>
                <Input
                  type="number"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  type="number"
                  id="heartRate"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Button onClick={handleCalculate} className="mt-4 p-5 w-full">Calculate VO2 Max</Button>
          </CardContent>
        </Card>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Your VO2 Max Result</h2>
            <div className="text-lg">
              <p>VO2 Max: {result.vo2Max.toFixed(2)} ml/kg/min</p>
              <p>Performance: {result.performance}</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell key="cell1" fill="#82ca9d" />
                  <Cell key="cell2" fill="#ff8042" />
                  <Cell key="cell3" fill="#ffbf00" />
                  <Cell key="cell4" fill="#ff7f00" />
                  <Cell key="cell5" fill="#ff0000" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <Line type="monotone" dataKey="vo2Max" stroke="#8884d8" />
                <XAxis dataKey="time" />
                <YAxis />
                <LineTooltip />
                <LineLegend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default VO2MaxCalculator;

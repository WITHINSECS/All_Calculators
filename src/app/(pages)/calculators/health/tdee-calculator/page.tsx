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
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"; // Shadcn Table
import { toast } from "react-toastify"; // Import toast for error handling
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"; // Recharts for pie chart

// Helper Function to Calculate TDEE and BMR
const calculateTDEE = (age: number, gender: string, weight: number, height: number, activityLevel: string) => {
  // BMR calculation based on the Mifflin-St Jeor Equation
  let bmr;
  if (gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Adjust BMR based on activity level
  let tdee;
  switch (activityLevel) {
    case "Sedentary":
      tdee = bmr * 1.2;
      break;
    case "Light Exercise":
      tdee = bmr * 1.375;
      break;
    case "Moderate Exercise":
      tdee = bmr * 1.55;
      break;
    case "Heavy Exercise":
      tdee = bmr * 1.725;
      break;
    case "Athlete":
      tdee = bmr * 1.9;
      break;
    default:
      tdee = bmr * 1.2;
  }

  // Calculate Calorie adjustments for different weight goals
  const weightLoss = tdee - 500;
  const mildWeightLoss = tdee - 250;
  const weightGain = tdee + 500;
  const mildWeightGain = tdee + 250;

  return { bmr, tdee, weightLoss, mildWeightLoss, weightGain, mildWeightGain };
};

const TDEECalculator = () => {
  const [age, setAge] = useState<number>(30); // Default age
  const [gender, setGender] = useState<string>("Male"); // Default gender
  const [weight, setWeight] = useState<number>(70); // Default weight in kg
  const [height, setHeight] = useState<number>(175); // Default height in cm
  const [activityLevel, setActivityLevel] = useState<string>("Sedentary"); // Default activity level
  const [result, setResult] = useState<any | null>(null);

  // Handle Calculate Button Click
  const handleCalculate = () => {
    if (!age || !weight || !height) {
      toast.error("Please fill out all fields.");
      return;
    }

    const { bmr, tdee, weightLoss, mildWeightLoss, weightGain, mildWeightGain } = calculateTDEE(
      age, gender, weight, height, activityLevel
    );

    setResult({ bmr, tdee, weightLoss, mildWeightLoss, weightGain, mildWeightGain });
  };

  const data = [
    { name: "Weight Loss", value: result ? result.weightLoss : 0 },
    { name: "Mild Weight Loss", value: result ? result.mildWeightLoss : 0 },
    { name: "Maintenance", value: result ? result.tdee : 0 },
    { name: "Mild Weight Gain", value: result ? result.mildWeightGain : 0 },
    { name: "Weight Gain", value: result ? result.weightGain : 0 },
  ];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Total Daily Energy Expenditure (TDEE) Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your daily calorie requirements based on your activity level.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="black mb-1.5" htmlFor="age">Age (years)</Label>
                <Input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="black mb-1.5" htmlFor="gender">Gender</Label>
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
                <Label className="black mb-1.5" htmlFor="weight">Weight (kg)</Label>
                <Input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="black mb-1.5" htmlFor="height">Height (cm)</Label>
                <Input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="black mb-1.5" htmlFor="activity">Activity Level</Label>
                <select
                  id="activity"
                  className="border p-2 rounded-md w-full"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="Sedentary">Sedentary (office job)</option>
                  <option value="Light Exercise">Light Exercise (1-3 days/week)</option>
                  <option value="Moderate Exercise">Moderate Exercise (3-5 days/week)</option>
                  <option value="Heavy Exercise">Heavy Exercise (6-7 days/week)</option>
                  <option value="Athlete">Athlete (2x training per day)</option>
                </select>
              </div>
            </div>

            <Button onClick={handleCalculate} className="mt-4 p-5 w-full">Calculate TDEE</Button>
          </CardContent>
        </Card>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Your Results</h2>

            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableCell>Goal</TableCell>
                  <TableCell>Calories/day</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Basal Metabolic Rate (BMR)</TableCell>
                  <TableCell>{result.bmr.toFixed(0)} calories/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maintenance</TableCell>
                  <TableCell>{result.tdee.toFixed(0)} calories/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weight Loss</TableCell>
                  <TableCell>{result.weightLoss.toFixed(0)} calories/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mild Weight Loss</TableCell>
                  <TableCell>{result.mildWeightLoss.toFixed(0)} calories/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weight Gain</TableCell>
                  <TableCell>{result.weightGain.toFixed(0)} calories/day</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mild Weight Gain</TableCell>
                  <TableCell>{result.mildWeightGain.toFixed(0)} calories/day</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
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
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default TDEECalculator;
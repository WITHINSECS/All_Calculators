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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "react-toastify"; // Import toast for error handling

// Helper Function to Calculate Water Intake
const calculateWaterIntake = (
  weight: number,
  height: number,
  age: number,
  activityLevel: string
) => {
  let intake: number = weight * 35; // Basic calculation in mL
  
  // Adjust based on activity level
  if (activityLevel === "Light") {
    intake += 500;
  } else if (activityLevel === "Moderate") {
    intake += 800;
  } else if (activityLevel === "High") {
    intake += 1000;
  } else if (activityLevel === "Extreme") {
    intake += 1200;
  }

  // Adjust based on height and age
  if (age > 50) {
    intake -= 300; // Older age may need slightly less water
  }
  if (height > 180) {
    intake += 200; // Taller individuals may need more water
  }

  return intake;
};

const DailyWaterIntakeCalculator = () => {
  const [weight, setWeight] = useState<number>(70); // Default weight in kg
  const [height, setHeight] = useState<number>(175); // Default height in cm
  const [age, setAge] = useState<number>(21); // Default age
  const [activityLevel, setActivityLevel] = useState<string>("Light");
  const [result, setResult] = useState<number | null>(null);

  // Handle Calculate Button Click
  const handleCalculate = () => {
    if (!weight || !height || !age || !activityLevel) {
      toast.error("Please fill out all fields.");
      return;
    }

    const intake = calculateWaterIntake(weight, height, age, activityLevel);
    setResult(intake);
  };

  const data = [
    {
      name: "Recommended Water Intake",
      value: result || 0,
    },
    {
      name: "Remaining Intake",
      value: 2787 - (result || 0),
    },
  ];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Daily Water Intake Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate the optimal daily water intake based on your personal details.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
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
                <Label className="black mb-1.5" htmlFor="activity">Activity Level</Label>
                <select
                  id="activity"
                  className="border p-2 rounded-md w-full"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="Light">Light (exercise 1-3 times a week)</option>
                  <option value="Moderate">Moderate (exercise 3-5 times a week)</option>
                  <option value="High">High (heavy exercise 6-7 times a week)</option>
                  <option value="Extreme">Extreme (very heavy exercise or physical job)</option>
                </select>
              </div>
            </div>

            <Button onClick={handleCalculate} className="mt-4 w-full p-5">Calculate</Button>
          </CardContent>
        </Card>

        {result !== null && (
          <div className="mt-8">
            <h2 className="text-xl text-center font-semibold">Your Recommended Water Intake: </h2>
            <p className="text-3xl font-bold mt-2 text-center">{result} mL/day</p>

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

export default DailyWaterIntakeCalculator;
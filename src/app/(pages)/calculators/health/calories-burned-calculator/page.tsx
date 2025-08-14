"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Wrapper from '@/app/Wrapper';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

interface CaloriesInput {
  exercise: string;
  duration: number;
  gender: string;
  age: number;
  weight: number;
  weightUnit: string; // 'kg' or 'lb'
}

interface CaloriesResult {
  caloriesBurned: number;
  caloriesPerMinute: number;
  chartData: { time: number; calories: number }[]; // Data for the line chart
}

const calculateCaloriesBurned = (input: CaloriesInput): CaloriesResult => {
  let baseCalories = 0;
  
  if (input.gender === "male") {
    baseCalories = 8 * input.duration * (input.weight / 70); // Example for male
  } else if (input.gender === "female") {
    baseCalories = 7 * input.duration * (input.weight / 60); // Example for female
  }

  if (input.age < 18) {
    baseCalories *= 1.1; // Younger people burn more calories, for example
  }

  const chartData = [];
  for (let i = 0; i < input.duration; i++) {
    chartData.push({ time: i + 1, calories: (baseCalories / input.duration) * (i + 1) });
  }

  const caloriesPerMinute = baseCalories / input.duration;

  return { caloriesBurned: baseCalories, caloriesPerMinute, chartData };
};

export default function CaloriesCalculator() {
  const [input, setInput] = useState<CaloriesInput>({
    exercise: "",
    duration: 60,
    gender: "male",
    age: 21,
    weight: 60,
    weightUnit: "kg",
  });

  const [result, setResult] = useState<CaloriesResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Allow only numeric input for duration, age, and weight fields
    if (name === "duration" || name === "age" || name === "weight") {
      // Check if the value is a valid number and not empty
      if (!/^\d*$/.test(value)) {
        return; // Prevent non-numeric characters
      }
    }

    setInput((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value), // Handle empty input
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    if (!input.exercise || input.exercise.trim() === "") {
      setError("Please enter a valid exercise.");
      return;
    }

    if (isNaN(input.duration) || input.duration <= 0) {
      setError("Please enter a valid duration.");
      return;
    }

    if (isNaN(input.age) || input.age <= 0) {
      setError("Please enter a valid age.");
      return;
    }

    if (isNaN(input.weight) || input.weight <= 0) {
      setError("Please enter a valid weight.");
      return;
    }

    setError(null); // Clear error message if inputs are valid
    const calcResult = calculateCaloriesBurned(input);
    setResult(calcResult);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Calories Burned Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Enter details below to calculate the calories burned during an activity.
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Exercise input */}
          <div className="space-y-2">
            <Label>Enter an exercise to calculate your calories burned</Label>
            <Input
              className="mt-2 mb-3"
              name="exercise"
              value={input.exercise}
              onChange={handleChange}
              placeholder="Search for exercise or activity"
            />
          </div>

          {/* Activity Duration */}
          <div className="space-y-2">
            <Label>Activity duration</Label>
            <Input
              className="mt-2 mb-3"
              name="duration"
              value={input.duration}
              onChange={handleChange}
              type="number"
              inputMode="numeric" // Ensures numeric input
            />
            <span>min</span>
          </div>

          {/* Gender selection */}
          <div className="space-y-2">
            <Label>What is your sex?</Label>
            <Select
              onValueChange={(value) => handleSelectChange('gender', value)}
              defaultValue="male"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age input */}
          <div className="space-y-2">
            <Label>How old are you?</Label>
            <Input
              className="mt-2 mb-3"
              name="age"
              value={input.age}
              onChange={handleChange}
              type="number"
              inputMode="numeric" // Ensures numeric input
            />
            <span>Years</span>
          </div>

          {/* Weight input */}
          <div className="space-y-2">
            <Label>How much do you weigh?</Label>
            <div className="flex space-x-2">
              <Input
                className="mt-2 mb-3"
                name="weight"
                value={input.weight}
                onChange={handleChange}
                type="number"
                inputMode="numeric" // Ensures numeric input
              />
              <Select
                onValueChange={(value) => handleSelectChange('weightUnit', value)}
                defaultValue="kg"
              >
                <SelectTrigger>
                  <SelectValue placeholder="kg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lb">lb</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button className="w-full p-5" onClick={handleCalculate}>
              Calculate your calories burned
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}

        {/* Results */}
        <div className="mt-4">
          {result && (
            <>
              <h3 className="text-xl">Calories burned: {result.caloriesBurned.toFixed(2)} kcal</h3>

              {/* Pie Chart for Calories Burned */}
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Calories Burned", value: result.caloriesBurned },
                      { name: "Remaining Calories", value: 1000 - result.caloriesBurned }, // Example remaining calories
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

              {/* Line Chart for Calories Burned Per Minute */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="calories" stroke="#3498db" name="Calories Burned" />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

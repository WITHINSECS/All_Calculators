"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Wrapper from '@/app/Wrapper';

interface FitnessInput {
  age: number | null;
  gender: string;
  restingHeartRate: number | null;
}

interface FitnessResult {
  fitnessAge: number;
}

const calculateFitnessAge = (input: FitnessInput): FitnessResult => {
  if (input.age === null || input.restingHeartRate === null) {
    return { fitnessAge: 0 }; // Return a default value if input is incomplete
  }

  // Fitness Age Calculation Formula (example based on heart rate)
  let fitnessAge = input.age;

  // Basic fitness age calculation using resting heart rate and age
  if (input.gender === "male") {
    fitnessAge += (input.restingHeartRate - 70) * 0.5; // Example calculation for males
  } else if (input.gender === "female") {
    fitnessAge += (input.restingHeartRate - 75) * 0.5; // Example calculation for females
  }

  return { fitnessAge };
};

export default function FitnessCalculator() {
  const [input, setInput] = useState<FitnessInput>({
    age: null,
    gender: "male",
    restingHeartRate: null,
  });

  const [result, setResult] = useState<FitnessResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value === "" ? null : Number(value), // Handle empty input
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    if (input.age === null || input.restingHeartRate === null) {
      alert("Please fill all the fields to calculate your fitness age.");
      return;
    }
    const calcResult = calculateFitnessAge(input);
    setResult(calcResult);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Fitness Age Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your fitness age based on your age, gender, and resting heart rate.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Age</Label>
              <Input
                className="mt-2 mb-3"
                name="age"
                value={input.age ?? ""}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div>
              <Label className="block mb-2">Gender</Label>
              <Select onValueChange={(value) => handleSelectChange('gender', value)} defaultValue="male">
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block mb-2">Resting Heart Rate</Label>
              <Input
                className="mt-2 mb-3"
                name="restingHeartRate"
                value={input.restingHeartRate ?? ""}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button className="w-full p-5" onClick={handleCalculate}>Calculate Fitness Age</Button>
          </div>
        </div>

        <div className="mt-4">
          {result && (
            <>
              <h3 className="text-xl">Your Fitness Age: {result.fitnessAge.toFixed(2)}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Your Fitness Age", value: result.fitnessAge },
                      { name: "Your Actual Age", value: input.age! - result.fitnessAge }
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
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
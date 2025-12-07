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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as PieContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BMICalculator() {
  const [gender, setGender] = useState<"Male" | "Female">("Male");

  // Use strings so inputs can be empty (no default 0 shown)
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    color: string;
  }>({ bmi: 0, category: "", color: "" });

  const calculateBMI = () => {
    // check for empty fields
    if (
      !heightFeet.trim() ||
      !heightInches.trim() ||
      !age.trim() ||
      !weight.trim()
    ) {
      toast.error("All fields are required and cannot be empty.");
      return;
    }

    const feet = Number(heightFeet);
    const inches = Number(heightInches);
    const ageNum = Number(age);
    const weightNum = Number(weight);

    if (
      !Number.isFinite(feet) ||
      !Number.isFinite(inches) ||
      !Number.isFinite(ageNum) ||
      !Number.isFinite(weightNum) ||
      feet <= 0 ||
      inches <= 0 ||
      ageNum <= 0 ||
      weightNum <= 0
    ) {
      toast.error("Please enter valid values greater than 0 in all fields.");
      return;
    }

    // Convert height to meters
    const heightInMeters = (feet * 12 + inches) * 0.0254;

    // BMI formula: weight (kg) / height (m)^2
    const bmi = weightNum / (heightInMeters * heightInMeters);

    // Categorize BMI
    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "yellow";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = "Normal";
      color = "green";
    } else if (bmi >= 25 && bmi < 29.9) {
      category = "Overweight";
      color = "orange";
    } else {
      category = "Obesity";
      color = "red";
    }

    setBmiResult({
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      color,
    });
  };

  // Data for Pie Chart
  const pieData =
    bmiResult.bmi > 0
      ? [
          { name: "BMI Value", value: bmiResult.bmi },
          { name: "Remaining", value: Math.max(0, 40 - bmiResult.bmi) }, // arbitrary cap 40 for visual ratio
        ]
      : [];

  // Data for Line Chart (trend or mock example)
  const lineData = [
    { name: "Week 1", bmi: 21.5 },
    { name: "Week 2", bmi: 22.0 },
    { name: "Week 3", bmi: 22.5 },
    { name: "Week 4", bmi: 22.3 },
    { name: "Week 5", bmi: 22.8 },
  ];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">BMI Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your Body Mass Index and check your health status.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Gender */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="gender">
                  Gender
                </Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setGender("Male")}
                    className={`py-2 px-4 rounded-full ${
                      gender === "Male"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setGender("Female")}
                    className={`py-2 px-4 rounded-full ${
                      gender === "Female"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    Female
                  </Button>
                </div>
              </div>

              {/* Height */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="height">
                  Height
                </Label>
                <div className="flex gap-4">
                  <Input
                    id="heightFeet"
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    placeholder="Feet"
                  />
                  <Input
                    id="heightInches"
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    placeholder="Inches"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="age">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age in years"
                />
              </div>

              {/* Weight */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="weight">
                  Weight (in Kgs)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Weight in Kgs"
                />
              </div>

              <div className="flex justify-center mt-4">
                <Button className="w-full" onClick={calculateBMI}>
                  Calculate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {bmiResult.bmi > 0 && (
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
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Your BMI</TableCell>
                      <TableCell>{bmiResult.bmi}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>{bmiResult.category}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {/* Pie Chart */}
                {pieData.length > 0 && (
                  <div className="mt-6">
                    <PieContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={index === 0 ? "#82ca9d" : "#ff7300"}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </PieContainer>
                  </div>
                )}

                {/* Line Chart */}
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={lineData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                      />
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

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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as PieContainer,
} from "recharts";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<"Male" | "Female">("Male");

  // Use strings so inputs can be empty (no default 0 in UI)
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [neckSize, setNeckSize] = useState<string>("");
  const [waistSize, setWaistSize] = useState<string>("");

  const [bodyFatResult, setBodyFatResult] = useState({
    bodyFatPercentage: 0,
    category: "",
    fatMass: 0,
    leanBodyMass: 0,
  });

  const calculateBodyFat = () => {
    // Basic empty checks
    if (
      !age.trim() ||
      !weight.trim() ||
      !height.trim() ||
      !neckSize.trim() ||
      !waistSize.trim()
    ) {
      toast.error("All fields are required and cannot be empty.");
      return;
    }

    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const neckNum = Number(neckSize);
    const waistNum = Number(waistSize);

    // Validate numerical values
    if (
      !Number.isFinite(ageNum) ||
      !Number.isFinite(weightNum) ||
      !Number.isFinite(heightNum) ||
      !Number.isFinite(neckNum) ||
      !Number.isFinite(waistNum) ||
      ageNum <= 0 ||
      weightNum <= 0 ||
      heightNum <= 0 ||
      neckNum <= 0 ||
      waistNum <= 0
    ) {
      toast.error("Please enter valid values greater than 0 in all fields.");
      return;
    }

    // U.S. Navy method to calculate body fat percentage
    let bodyFatPercentage = 0;
    if (gender === "Male") {
      bodyFatPercentage =
        86.01 * Math.log10(waistNum - neckNum) -
        70.041 * Math.log10(heightNum) +
        36.76;
    } else {
      bodyFatPercentage =
        163.205 * Math.log10(waistNum) -
        97.684 * Math.log10(heightNum) -
        78.387;
    }

    // Categorize Body Fat
    let category = "";
    if (bodyFatPercentage < 18.5) {
      category = "Underweight";
    } else if (bodyFatPercentage >= 18.5 && bodyFatPercentage < 24.9) {
      category = "Normal";
    } else if (bodyFatPercentage >= 25 && bodyFatPercentage < 29.9) {
      category = "Overweight";
    } else {
      category = "Obese";
    }

    // Calculate Body Fat Mass and Lean Body Mass
    const fatMass = (bodyFatPercentage / 100) * weightNum;
    const leanBodyMass = weightNum - fatMass;

    setBodyFatResult({
      bodyFatPercentage: parseFloat(bodyFatPercentage.toFixed(2)),
      category,
      fatMass: parseFloat(fatMass.toFixed(2)),
      leanBodyMass: parseFloat(leanBodyMass.toFixed(2)),
    });
  };

  // Data for Pie Chart
  const pieData = [
    { name: "Body Fat Mass", value: bodyFatResult.fatMass },
    { name: "Lean Body Mass", value: bodyFatResult.leanBodyMass },
  ];

  // Data for Line Chart (mock trend example)
  const lineData = [
    { name: "Week 1", fatMass: 30.6, leanMass: 42.4 },
    { name: "Week 2", fatMass: 31.2, leanMass: 42.0 },
    { name: "Week 3", fatMass: 32.0, leanMass: 41.5 },
    { name: "Week 4", fatMass: 32.5, leanMass: 41.0 },
    { name: "Week 5", fatMass: 33.0, leanMass: 40.6 },
  ];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Body Fat Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your body fat percentage and check your health status.
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
                  placeholder="Enter your age"
                />
              </div>

              {/* Weight */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="weight">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                />
              </div>

              {/* Height */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="height">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height"
                />
              </div>

              {/* Neck size */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="neckSize">
                  Neck Size (cm)
                </Label>
                <Input
                  id="neckSize"
                  type="number"
                  value={neckSize}
                  onChange={(e) => setNeckSize(e.target.value)}
                  placeholder="Enter your neck size"
                />
              </div>

              {/* Waist size */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="waistSize">
                  Waist Size (cm)
                </Label>
                <Input
                  id="waistSize"
                  type="number"
                  value={waistSize}
                  onChange={(e) => setWaistSize(e.target.value)}
                  placeholder="Enter your waist size"
                />
              </div>

              <div className="flex justify-center mt-4">
                <Button className="w-full" onClick={calculateBodyFat}>
                  Calculate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {bodyFatResult.bodyFatPercentage > 0 && (
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
                      <TableCell>Body Fat Percentage</TableCell>
                      <TableCell>
                        {bodyFatResult.bodyFatPercentage}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Body Fat Category</TableCell>
                      <TableCell>{bodyFatResult.category}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Body Fat Mass</TableCell>
                      <TableCell>{bodyFatResult.fatMass} Kg</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lean Body Mass</TableCell>
                      <TableCell>{bodyFatResult.leanBodyMass} Kg</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {/* Pie Chart */}
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
                        {pieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? "#ff7300" : "#82ca9d"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </PieContainer>
                </div>

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
                        dataKey="fatMass"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="leanMass"
                        stroke="#ff7300"
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

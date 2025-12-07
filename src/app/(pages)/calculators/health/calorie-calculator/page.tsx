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
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer as LineContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"Male" | "Female">("Male");

  // use strings so inputs can be truly empty
  const [age, setAge] = useState<string>("");
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const [activityType, setActivityType] = useState<
    "Sedentary" | "Light" | "Moderate" | "Active" | "VeryActive"
  >("Sedentary");

  const [calorieResult, setCalorieResult] = useState({
    bmr: 0,
    totalCalories: 0,
  });

  const activityFactors = {
    Sedentary: 1.2,
    Light: 1.375,
    Moderate: 1.55,
    Active: 1.725,
    VeryActive: 1.9,
  } as const;

  const calculateCalories = () => {
    // empty checks
    if (
      !age.trim() ||
      !heightFeet.trim() ||
      !heightInches.trim() ||
      !weight.trim()
    ) {
      toast.error("All fields are required and cannot be empty.");
      return;
    }

    const ageNum = Number(age);
    const feetNum = Number(heightFeet);
    const inchNum = Number(heightInches);
    const weightNum = Number(weight);

    if (
      !Number.isFinite(ageNum) ||
      !Number.isFinite(feetNum) ||
      !Number.isFinite(inchNum) ||
      !Number.isFinite(weightNum) ||
      ageNum <= 0 ||
      feetNum <= 0 ||
      inchNum < 0 || // inches can be 0 but not negative
      weightNum <= 0
    ) {
      toast.error("Please enter valid values greater than 0.");
      return;
    }

    // convert height to cm
    const heightInCm = (feetNum * 12 + inchNum) * 2.54;

    // BMR (Mifflin–St Jeor)
    let bmr = 0;
    if (gender === "Male") {
      bmr = 10 * weightNum + 6.25 * heightInCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightInCm - 5 * ageNum - 161;
    }

    const factor = activityFactors[activityType];
    const totalCalories = bmr * factor;

    setCalorieResult({
      bmr: parseFloat(bmr.toFixed(2)),
      totalCalories: parseFloat(totalCalories.toFixed(2)),
    });
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Calorie Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your daily caloric needs based on your activity level.
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

              {/* Activity type */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="activityType">
                  Activity Type
                </Label>
                <select
                  id="activityType"
                  value={activityType}
                  onChange={(e) =>
                    setActivityType(
                      e.target.value as
                        | "Sedentary"
                        | "Light"
                        | "Moderate"
                        | "Active"
                        | "VeryActive"
                    )
                  }
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">Light Activity</option>
                  <option value="Moderate">Moderate Activity</option>
                  <option value="Active">Active</option>
                  <option value="VeryActive">Very Active</option>
                </select>
              </div>

              <div className="flex justify-center mt-4">
                <Button className="w-full" onClick={calculateCalories}>
                  Calculate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {calorieResult.totalCalories > 0 && (
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
                      <TableCell>BMR</TableCell>
                      <TableCell>{calorieResult.bmr} kcal</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Calories</TableCell>
                      <TableCell>{calorieResult.totalCalories} kcal</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {/* Pie Chart */}
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "BMR", value: calorieResult.bmr },
                          {
                            name: "Activity",
                            value:
                              calorieResult.totalCalories - calorieResult.bmr,
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ff7300" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="mt-6">
                  <LineContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        {
                          name: "Week 1",
                          calories: calorieResult.totalCalories,
                        },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </LineContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

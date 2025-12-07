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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ActivityType = "Sedentary" | "Light" | "Moderate" | "Active" | "VeryActive";
type Goal = "Maintain weight" | "Lose weight" | "Gain muscle";

export default function MacroCalculator() {
  const [gender, setGender] = useState<"Male" | "Female">("Male");

  // make numeric inputs strings so they can be empty
  const [age, setAge] = useState<string>("");
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const [activityType, setActivityType] = useState<ActivityType>("Sedentary");
  const [goal, setGoal] = useState<Goal>("Maintain weight");
  const [macroResult, setMacroResult] = useState({
    bmr: 0,
    tdee: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    totalCalories: 0,
  });

  const activityFactors: { [key in ActivityType]: number } = {
    Sedentary: 1.2,
    Light: 1.375,
    Moderate: 1.55,
    Active: 1.725,
    VeryActive: 1.9,
  };

  const goalFactors: { [key in Goal]: number } = {
    "Maintain weight": 0,
    "Lose weight": -500,
    "Gain muscle": 500,
  };

  const calculateMacros = () => {
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

    // Convert height to cm
    const heightInCm = (feetNum * 12 + inchNum) * 2.54;

    // BMR (Mifflin–St Jeor)
    let bmr = 0;
    if (gender === "Male") {
      bmr = 10 * weightNum + 6.25 * heightInCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightInCm - 5 * ageNum - 161;
    }

    const tdee = bmr * activityFactors[activityType];
    const caloricNeed = tdee + goalFactors[goal];

    // 30% protein, 40% carbs, 30% fats
    const protein = (caloricNeed * 0.3) / 4;
    const carbs = (caloricNeed * 0.4) / 4;
    const fats = (caloricNeed * 0.3) / 9;

    setMacroResult({
      bmr: parseFloat(bmr.toFixed(0)),
      tdee: parseFloat(tdee.toFixed(0)),
      protein: parseFloat(protein.toFixed(0)),
      carbs: parseFloat(carbs.toFixed(0)),
      fats: parseFloat(fats.toFixed(0)),
      totalCalories: parseFloat(caloricNeed.toFixed(0)),
    });
  };

  const pieData = [
    { name: "Protein", value: macroResult.protein },
    { name: "Carbs", value: macroResult.carbs },
    { name: "Fats", value: macroResult.fats },
  ];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Macro Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your daily macros based on your goals and activity level.
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
                  onChange={(e) =>
                    setGender(e.target.value as "Male" | "Female")
                  }
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

              {/* Activity */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="activityType">
                  Activity Type
                </Label>
                <select
                  id="activityType"
                  value={activityType}
                  onChange={(e) =>
                    setActivityType(e.target.value as ActivityType)
                  }
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="Sedentary">
                    Sedentary - Little or No Exercise
                  </option>
                  <option value="Light">
                    Light - Exercise 1-3 Times/Week
                  </option>
                  <option value="Moderate">
                    Moderate - Exercise 4-5 Times/Week
                  </option>
                  <option value="Active">
                    Active - Daily Exercise or Intense Exercise 3-4 Times/Week
                  </option>
                  <option value="VeryActive">
                    Very Active - Exercise 6-7 Times/Week
                  </option>
                </select>
              </div>

              {/* Goal */}
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="goal">
                  Your Goal
                </Label>
                <select
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as Goal)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  <option value="Maintain weight">Maintain weight</option>
                  <option value="Lose weight">Lose weight</option>
                  <option value="Gain muscle">Gain muscle</option>
                </select>
              </div>

              <div className="flex justify-center mt-4">
                <Button className="w-full" onClick={calculateMacros}>
                  Calculate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {macroResult.totalCalories > 0 && (
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
                      <TableCell>{macroResult.bmr} kcal</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Calories</TableCell>
                      <TableCell>{macroResult.totalCalories} kcal</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Protein</TableCell>
                      <TableCell>{macroResult.protein} grams</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Carbs</TableCell>
                      <TableCell>{macroResult.carbs} grams</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fats</TableCell>
                      <TableCell>{macroResult.fats} grams</TableCell>
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
                        fill="#8884d8"
                        label
                      >
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ff7300" />
                        <Cell fill="#ffbf00" />
                      </Pie>
                    </PieChart>
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

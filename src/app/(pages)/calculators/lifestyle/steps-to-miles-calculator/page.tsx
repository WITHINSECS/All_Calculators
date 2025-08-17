"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StepsToMilesCalculator() {
  const [biologicalSex, setBiologicalSex] = useState<string>("female");
  const [heightFeet, setHeightFeet] = useState<number | string>(""); // Height in feet
  const [heightInches, setHeightInches] = useState<number | string>(""); // Height in inches
  const [pace, setPace] = useState<string>("3mph"); // Pace of walk/run
  const [stepsOrMiles, setStepsOrMiles] = useState<string>("stepsToMiles"); // Toggle between steps and miles
  const [inputValue, setInputValue] = useState<number | string>(""); // Either steps or miles input
  const [calculateCalories, setCalculateCalories] = useState<boolean>(false); // Toggle to calculate calories
  const [rememberInfo, setRememberInfo] = useState<boolean>(false); // Optional toggle (if needed)
  const [result, setResult] = useState<string>("");

  // Type the paceSpeeds object
  const paceSpeeds: Record<
    "Very slow walk (<2mph)" | "Slow walk (2mph)" | "Average walk (3mph)" | "Brisk walk (4mph)" | "Jog (5mph)" | "Run (6mph)" | "Fast run (7.5mph)" | "Very fast run (10mph)",
    number
  > = {
    "Very slow walk (<2mph)": 2,
    "Slow walk (2mph)": 2,
    "Average walk (3mph)": 3,
    "Brisk walk (4mph)": 4,
    "Jog (5mph)": 5,
    "Run (6mph)": 6,
    "Fast run (7.5mph)": 7.5,
    "Very fast run (10mph)": 10,
  };

  const calculateStepsToMiles = (steps: number, sex: string, heightFeet: number, heightInches: number, pace: string) => {
    const heightInchesTotal = heightFeet * 12 + heightInches;
    const strideLength = sex === "female" ? 0.413 * heightInchesTotal : 0.415 * heightInchesTotal;
    const miles = (steps * strideLength) / 63360; // 1 mile = 63,360 inches
    return miles;
  };

  const calculateMilesToSteps = (miles: number, sex: string, heightFeet: number, heightInches: number, pace: string) => {
    const heightInchesTotal = heightFeet * 12 + heightInches;
    const strideLength = sex === "female" ? 0.413 * heightInchesTotal : 0.415 * heightInchesTotal;
    const steps = (miles * 63360) / strideLength; // 1 mile = 63,360 inches
    return steps;
  };

  const calculateCaloriesBurned = (steps: number, pace: string, sex: string) => {
    // Ensure 'pace' is a valid key of paceSpeeds
    const caloriesPerStep = paceSpeeds[pace as keyof typeof paceSpeeds] * (sex === "female" ? 0.04 : 0.05); // Simplified assumption
    return caloriesPerStep * steps;
  };

  const handleCalculate = () => {
    let calculatedResult = 0;
    if (stepsOrMiles === "stepsToMiles" && typeof inputValue === "number") {
      calculatedResult = calculateStepsToMiles(
        inputValue,
        biologicalSex,
        Number(heightFeet),
        Number(heightInches),
        pace
      );
    } else if (stepsOrMiles === "milesToSteps" && typeof inputValue === "number") {
      calculatedResult = calculateMilesToSteps(
        inputValue,
        biologicalSex,
        Number(heightFeet),
        Number(heightInches),
        pace
      );
    }

    let finalResult = `Result: ${calculatedResult.toFixed(2)} ${stepsOrMiles === "stepsToMiles" ? "miles" : "steps"}`;

    if (calculateCalories) {
      const calories = calculateCaloriesBurned(
        Number(inputValue),
        pace,
        biologicalSex
      );
      finalResult += ` | Calories Burned: ${calories.toFixed(2)} kcal`;
    }

    setResult(finalResult);
  };

  const handleClear = () => {
    setHeightFeet("");
    setHeightInches("");
    setInputValue("");
    setResult("");
    setCalculateCalories(false);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <h1 className="text-2xl font-semibold lg:text-4xl text-center">Steps to Miles Calculator</h1>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Calculate steps to miles, or vice versa, based on your input and your walking or running pace.
        </p>

        {/* Biological sex */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Biological sex</h2>
          <Select
            onValueChange={setBiologicalSex}
            value={biologicalSex}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height Inputs */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Height</h2>
          <div className="flex space-x-4">
            <div className="flex flex-col">
              <Label>Feet</Label>
              <Input
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                type="number"
                placeholder="e.g., 5"
              />
            </div>
            <div className="flex flex-col">
              <Label>Inches</Label>
              <Input
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                type="number"
                placeholder="e.g., 9"
              />
            </div>
          </div>
        </div>

        {/* Pace Dropdown */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Pace of walk/run</h2>
          <Select
            onValueChange={setPace}
            value={pace}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Very slow walk (<2mph)">Very slow walk (&lt;2mph)</SelectItem>
              <SelectItem value="Slow walk (2mph)">Slow walk (2mph)</SelectItem>
              <SelectItem value="Average walk (3mph)">Average walk (3mph)</SelectItem>
              <SelectItem value="Brisk walk (4mph)">Brisk walk (4mph)</SelectItem>
              <SelectItem value="Jog (5mph)">Jog (5mph)</SelectItem>
              <SelectItem value="Run (6mph)">Run (6mph)</SelectItem>
              <SelectItem value="Fast run (7.5mph)">Fast run (7.5mph)</SelectItem>
              <SelectItem value="Very fast run (10mph)">Very fast run (10mph)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Steps or Miles Input */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Steps or Miles</h2>
          <Select
            onValueChange={setStepsOrMiles}
            value={stepsOrMiles}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select conversion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stepsToMiles">Steps to Miles</SelectItem>
              <SelectItem value="milesToSteps">Miles to Steps</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-4">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={stepsOrMiles === "stepsToMiles" ? "Enter steps" : "Enter miles"}
            />
          </div>
        </div>

        {/* Toggle Calculate Calories */}
        <div className="space-y-4 mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={calculateCalories}
              onChange={() => setCalculateCalories(!calculateCalories)}
              className="mr-2"
            />
            Calculate calories burned?
          </label>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4">
          {result && (
            <div className="rounded-lg shadow-lg border p-6">
              <div className="text-xl font-semibold">Result</div>
              <div className="text-lg mt-4">
                {result}
              </div>
            </div>
          )}
        </div>

        {/* Calculate and Clear Buttons */}
        <Button onClick={handleCalculate} className="mt-4">
          Calculate
        </Button>
        <Button onClick={handleClear} variant="secondary" className="mt-4">
          Clear
        </Button>
      </div>
    </Wrapper>
  );
}
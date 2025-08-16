"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StepsCalculator() {
  const [biologicalSex, setBiologicalSex] = useState<string>(""); // Default to empty
  const [heightFeet, setHeightFeet] = useState<string | number>(""); // Default to empty
  const [heightInches, setHeightInches] = useState<string | number>(""); // Default to empty
  const [steps, setSteps] = useState<string | number>(""); // Default to empty
  const [pace, setPace] = useState<string>(""); // Default to empty
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);
  const [distanceInMiles, setDistanceInMiles] = useState<number | null>(null);

  // Calculate the stride length based on height and biological sex
  const calculateStrideLength = (heightInches: number, sex: string) => {
    const heightInchesTotal = (Number(heightFeet) * 12) + heightInches; // Convert height to total inches
    return sex === "female" ? heightInchesTotal * 0.413 : heightInchesTotal * 0.415; // Adjusted for female or male
  };

  // Convert steps to miles based on stride length
  const calculateDistance = (steps: number, strideLength: number) => {
    return (steps * strideLength) / 5280; // Convert to miles
  };

  // Estimate calories burned based on steps, sex, and pace (simplified model)
  const calculateCalories = (steps: number, sex: string, pace: string) => {
    const METS = pace === "Average walk (3mph)" ? (sex === "female" ? 3.8 : 4.5) : 6; // MET for walking vs running
    const weight = 150; // Average weight (in lbs)
    const caloriesPerMinute = (METS * weight) / 60;
    const totalMinutes = (steps / 100) * 20; // Estimate the number of minutes it takes based on steps (simplified)
    return caloriesPerMinute * totalMinutes; // Total calories burned
  };

  const handleCalculate = () => {
    if (heightFeet === "" || heightInches === "" || steps === "" || biologicalSex === "" || pace === "") {
      alert("Please fill in all fields.");
      return;
    }

    const strideLength = calculateStrideLength(Number(heightInches), biologicalSex);
    const distance = calculateDistance(Number(steps), strideLength);
    const calories = calculateCalories(Number(steps), biologicalSex, pace);

    setDistanceInMiles(distance);
    setCaloriesBurned(calories);
  };

  const handleClear = () => {
    setHeightFeet("");
    setHeightInches("");
    setSteps("");
    setPace("");
    setBiologicalSex("");
    setCaloriesBurned(null);
    setDistanceInMiles(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Steps to Miles Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate the distance traveled in miles based on the number of steps and your personal information.
          </p>
        </div>

        <div className="space-y-4">
          {/* Biological Sex Selection */}
          <div className="space-y-2">
            <Label htmlFor="biological-sex">Biological Sex</Label>
            <Select
              onValueChange={setBiologicalSex}
              value={biologicalSex}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Height Input */}
          <div className="space-y-2">
            <Label htmlFor="height-feet">Height (feet)</Label>
            <Input
              id="height-feet"
              type="number"
              value={heightFeet}
              onChange={(e) => setHeightFeet(e.target.value)}
              placeholder="Enter height in feet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height-inches">Height (inches)</Label>
            <Input
              id="height-inches"
              type="number"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
              placeholder="Enter height in inches"
            />
          </div>

          {/* Steps Input */}
          <div className="space-y-2">
            <Label htmlFor="steps">Steps</Label>
            <Input
              id="steps"
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="Enter number of steps"
            />
          </div>

          {/* Pace of Walk/Run Selection */}
          <div className="space-y-2">
            <Label htmlFor="pace">Pace of walk/run</Label>
            <Select
              onValueChange={setPace}
              value={pace}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Pace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Average walk (3mph)">Average walk (3mph)</SelectItem>
                <SelectItem value="Brisk walk (4mph)">Brisk walk (4mph)</SelectItem>
                <SelectItem value="Run (6mph)">Run (6mph)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculate}>Calculate</Button>

          {/* Display Results */}
          {distanceInMiles !== null && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Distance (in miles)</div>
                <div className="text-xl font-semibold">{distanceInMiles.toFixed(2)} miles</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Calories Burned</div>
                <div className="text-xl font-semibold">{caloriesBurned?.toFixed(2)} kcal</div>
              </div>
            </div>
          )}

          {/* Clear Button */}
          <Button onClick={handleClear} variant="secondary" className="mt-4">
            Clear
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}
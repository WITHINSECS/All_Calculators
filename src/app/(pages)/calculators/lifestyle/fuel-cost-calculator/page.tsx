"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FuelCostCalculator() {
  const [fuelType, setFuelType] = useState<string>("Petrol");
  const [dailyDistance, setDailyDistance] = useState<string>(""); // Default to empty string
  const [mileage, setMileage] = useState<string>(""); // Default to empty string
  const [fuelCost, setFuelCost] = useState<string>(""); // Default to empty string

  const [result, setResult] = useState<{
    dailyCost: number;
    monthlyCost: number;
    yearlyCost: number;
  } | null>(null); // Explicitly typing the result state

  const handleCalculateFuelCost = () => {
    const dailyDistanceNum = parseFloat(dailyDistance);
    const mileageNum = parseFloat(mileage);
    const fuelCostNum = parseFloat(fuelCost);

    // Validate inputs
    if (isNaN(dailyDistanceNum) || isNaN(mileageNum) || isNaN(fuelCostNum) || dailyDistanceNum <= 0 || mileageNum <= 0 || fuelCostNum <= 0) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    // Calculate the daily fuel consumption (in litres)
    const dailyFuelConsumed = dailyDistanceNum / mileageNum;

    // Calculate costs
    const dailyCost = dailyFuelConsumed * fuelCostNum;
    const monthlyCost = dailyCost * 30; // Assuming 30 days in a month
    const yearlyCost = dailyCost * 365; // Assuming 365 days in a year

    setResult({
      dailyCost: dailyCost,
      monthlyCost: monthlyCost,
      yearlyCost: yearlyCost,
    });
  };

  const handleClear = () => {
    setDailyDistance("");
    setMileage("");
    setFuelCost("");
    setResult(null); // Hide results
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Fuel Cost Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate your daily, monthly, and yearly fuel cost based on the type of fuel, daily distance, and mileage.
          </p>
        </div>

        <div className="space-y-4">
          {/* Fuel Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="fuel-type">Fuel Type</Label>
            <Select
              onValueChange={(value) => {
                setFuelType(value);
                setFuelCost(value === "Petrol" ? "94.77" : "86.00"); // Set default costs based on fuel type
              }}
              value={fuelType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Daily Distance Input */}
          <div className="space-y-2">
            <Label htmlFor="daily-distance">Daily Distance Travelled (km)</Label>
            <Input
              id="daily-distance"
              type="number"
              value={dailyDistance}
              onChange={(e) => setDailyDistance(e.target.value)}
              placeholder="Enter daily distance"
            />
          </div>

          {/* Mileage Input */}
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage (km/ltr)</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="Enter mileage"
            />
          </div>

          {/* Fuel Cost Input */}
          <div className="space-y-2">
            <Label htmlFor="fuel-cost">Fuel Cost (₹/L)</Label>
            <Input
              id="fuel-cost"
              type="number"
              value={fuelCost}
              onChange={(e) => setFuelCost(e.target.value)}
              placeholder="Enter fuel cost per litre"
            />
          </div>

          {/* Calculate Fuel Cost Button */}
          <Button onClick={handleCalculateFuelCost}>Calculate Fuel Cost</Button>

          {/* Display Results */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Daily Fuel Cost</div>
                <div className="text-xl font-semibold">₹{result.dailyCost.toFixed(2)}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Monthly Fuel Cost</div>
                <div className="text-xl font-semibold">₹{result.monthlyCost.toFixed(2)}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Yearly Fuel Cost</div>
                <div className="text-xl font-semibold">₹{result.yearlyCost.toFixed(2)}</div>
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
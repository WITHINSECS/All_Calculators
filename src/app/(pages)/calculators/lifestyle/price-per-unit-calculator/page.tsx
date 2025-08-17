"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the conversion type based on the conversions object
type WeightUnit = keyof typeof conversions;

// Conversion rates to pounds for weight units
const conversions = {
  microgram: 2.20462e-9,    // Micrograms to Pounds
  milligram: 2.20462e-6,    // Milligrams to Pounds
  gram: 0.00220462,         // Grams to Pounds
  kilogram: 2.20462,        // Kilograms to Pounds
  "metric ton": 2204.62,    // Metric tons to Pounds
  grain: 0.000142857,       // Grains to Pounds
  drachm: 0.0625,           // Drachms to Pounds
  ounce: 0.0625,            // Ounces to Pounds
  pound: 1,                 // Pounds (base unit)
  stone: 14,                // Stones to Pounds
  "US ton": 2204.62,        // US Short tons to Pounds
  "imperial ton": 2204.62,  // Imperial tons to Pounds
  "troy ounce": 0.0685714   // Troy Ounces to Pounds
};

export default function PricePerUnitCalculator() {
  const [type, setType] = useState<string>("select");
  const [weight, setWeight] = useState<number | string>(""); 
  const [volume, setVolume] = useState<number | string>(0); // Initialize with 0 for better validation
  const [cost, setCost] = useState<number | string>(""); 
  const [unit, setUnit] = useState<WeightUnit>("pound"); // Restrict unit to valid keys
  const [unitPrice, setUnitPrice] = useState<number | string>("");

  // Density of water (1 g/cm³ = 1000 kg/m³)
  const densityWater = 1; // 1g/cm³ (assuming the volume is in liters for simplicity)

  const handleCalculate = () => {
    // Validate weight, volume, and cost inputs
    if (isNaN(Number(weight)) || isNaN(Number(cost)) || Number(weight) <= 0 || Number(cost) <= 0) {
      alert("Please enter valid numbers for weight and cost.");
      return;
    }

    // Validate volume input
    if (isNaN(Number(volume)) || parseFloat(String(volume)) <= 0) { // Ensure volume is treated as a string
      alert("Please enter a valid volume.");
      return;
    }

    let convertedWeight = 0;
    let volumeInWeight = 0;

    // Convert volume to weight (assuming density is 1 g/cm³ for water by default)
    if (type === "volume") {
      volumeInWeight = Number(volume) * 1000; // Convert Liters to grams (1L = 1000g)
    }

    // Convert to the selected weight unit
    if (type === "weight") {
      convertedWeight = Number(weight) * conversions[unit];
    } else if (type === "volume") {
      convertedWeight = volumeInWeight * conversions[unit]; // Convert volume to weight and then to the selected unit
    }

    const calculatedUnitPrice = Number(cost) / convertedWeight;
    setUnitPrice(calculatedUnitPrice.toFixed(2)); // Display result
  };

  const handleClear = () => {
    setType("select");
    setWeight("");
    setVolume(0);
    setCost("");
    setUnitPrice("");
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl text-center">Price Per Unit Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Enter the details below to calculate the unit price based on weight, volume, and cost.
          </p>
        </div>

        <div className="space-y-4">
          {/* Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="type" className="font-bold">Select Type</Label>
            <Select onValueChange={setType} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Weight input if selected */}
          {type === "weight" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex space-x-2">
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight"
                  />
                  <Select onValueChange={setUnit as (value: WeightUnit) => void} value={unit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="microgram">Micrograms (µg)</SelectItem>
                      <SelectItem value="milligram">Milligrams (mg)</SelectItem>
                      <SelectItem value="gram">Grams (g)</SelectItem>
                      <SelectItem value="kilogram">Kilograms (kg)</SelectItem>
                      <SelectItem value="metric ton">Metric Tons (t)</SelectItem>
                      <SelectItem value="grain">Grains (gr)</SelectItem>
                      <SelectItem value="drachm">Drachms (dr)</SelectItem>
                      <SelectItem value="ounce">Ounces (oz)</SelectItem>
                      <SelectItem value="pound">Pounds (lb)</SelectItem>
                      <SelectItem value="stone">Stones (st)</SelectItem>
                      <SelectItem value="US ton">US Short Tons (US ton)</SelectItem>
                      <SelectItem value="imperial ton">Imperial Tons (long ton)</SelectItem>
                      <SelectItem value="troy ounce">Troy Ounces (oz t)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Show Volume input if selected */}
          {type === "volume" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="volume">Volume (L)</Label>
                <Input
                  id="volume"
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="Enter volume in liters"
                />
              </div>
            </>
          )}

          {/* Cost Input */}
          <div className="space-y-2">
            <Label htmlFor="cost">Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Enter total cost in dollars"
            />
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculate}>Calculate Unit Price</Button>

          {/* Display Result */}
          {unitPrice && (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg shadow-lg border p-6">
                <div className="text-xl font-semibold">Unit Price</div>
                <div className="text-lg mt-4">
                  ${unitPrice} / unit
                </div>
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
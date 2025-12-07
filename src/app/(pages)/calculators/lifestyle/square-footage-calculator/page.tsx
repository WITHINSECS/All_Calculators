"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define types explicitly for the result and courses
interface Result {
  squareFootage: number;
  squareInches: number;
  squareYards: number;
  squareMeters: number;
  acres: number;
}

const calculateArea = (
  shape: string,
  length: number,
  width: number,
  quantity: number
): Result => {
  let squareFootage = 0;

  if (shape === "Rectangle") {
    squareFootage = length * width;
  } else if (shape === "Circle") {
    squareFootage = Math.PI * Math.pow(length / 2, 2);
  } else if (shape === "Triangle") {
    squareFootage = (length * width) / 2;
  }

  // Convert square footage to other units
  const squareInches = squareFootage * 144; // 1 sqft = 144 square inches
  const squareYards = squareFootage / 9; // 1 sqft = 1/9 square yards
  const squareMeters = squareFootage * 0.092903; // 1 sqft = 0.092903 square meters
  const acres = squareFootage / 43560; // 1 sqft = 1/43560 acres

  return {
    squareFootage,
    squareInches,
    squareYards,
    squareMeters,
    acres,
  };
};

export default function SquareFootageCalculator() {
  const [shape, setShape] = useState<string>("");
  const [length, setLength] = useState<number | "">("");
  const [width, setWidth] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [costPerSquareFoot, setCostPerSquareFoot] = useState<number | "">("");
  const [result, setResult] = useState<Result | null>(null);

  const handleCalculate = () => {
    if (!shape || length === "" || width === "" || quantity === "") {
      return;
    }

    const areaResult = calculateArea(
      shape,
      Number(length),
      Number(width),
      Number(quantity)
    );
    setResult(areaResult);
  };

  const handleReset = () => {
    setShape("");
    setLength("");
    setWidth("");
    setQuantity("");
    setCostPerSquareFoot("");
    setResult(null);
  };

  const calculatedCost =
    result && typeof costPerSquareFoot === "number"
      ? result.squareFootage * costPerSquareFoot
      : 0;

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Square Footage Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate the area and its conversions for different shapes.
          </p>
        </div>

        <div className="space-y-4">
          {/* Area Shape Selection */}
          <div className="space-y-2">
            <Label htmlFor="area-shape">Area Shape</Label>
            <Select
              onValueChange={setShape}
              value={shape}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rectangle">Rectangle</SelectItem>
                <SelectItem value="Circle">Circle</SelectItem>
                <SelectItem value="Triangle">Triangle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Length and Width Inputs */}
          <div className="space-y-2">
            <Label htmlFor="length">Length (ft)</Label>
            <Input
              id="length"
              type="number"
              value={length === "" ? "" : length}
              onChange={(e) => {
                const value = e.target.value;
                setLength(value === "" ? "" : Number(value));
              }}
              placeholder="Enter Length"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="width">Width (ft)</Label>
            <Input
              id="width"
              type="number"
              value={width === "" ? "" : width}
              onChange={(e) => {
                const value = e.target.value;
                setWidth(value === "" ? "" : Number(value));
              }}
              placeholder="Enter Width"
            />
          </div>

          {/* Quantity and Cost Inputs */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity === "" ? "" : quantity}
              onChange={(e) => {
                const value = e.target.value;
                setQuantity(value === "" ? "" : Number(value));
              }}
              placeholder="Enter Quantity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost per Square Foot</Label>
            <Input
              id="cost"
              type="number"
              value={costPerSquareFoot === "" ? "" : costPerSquareFoot}
              onChange={(e) => {
                const value = e.target.value;
                setCostPerSquareFoot(value === "" ? "" : Number(value));
              }}
              placeholder="Enter Cost"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="outline" type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-8 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Square Footage</div>
                <div className="text-xl font-semibold">
                  {result.squareFootage.toFixed(2)} sq ft
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Square Inches</div>
                <div className="text-xl font-semibold">
                  {result.squareInches.toFixed(2)} in²
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Square Yards</div>
                <div className="text-xl font-semibold">
                  {result.squareYards.toFixed(2)} yd²
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Square Meters</div>
                <div className="text-xl font-semibold">
                  {result.squareMeters.toFixed(2)} m²
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Acres</div>
                <div className="text-xl font-semibold">
                  {result.acres.toFixed(6)} acres
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Cost</div>
                <div className="text-xl font-semibold">
                  ${calculatedCost.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

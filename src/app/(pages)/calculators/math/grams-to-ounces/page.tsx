"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Conversion factor (1 gram = 0.035274 ounces)
const gramsToOz = 0.035274;

export default function GramsToOzCalculator() {
  const [grams, setGrams] = useState<number | string>("");
  const [ounces, setOunces] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<string | null>(null);

  const onCalculate = () => {
    setError(null);
    setOunces(null);
    setSteps(null);

    if (grams === "") {
      setError("Please enter a value in grams.");
      return;
    }

    const g = Number(grams);
    if (isNaN(g) || g < 0) {
      setError("Please enter a valid number for grams.");
      return;
    }

    const oz = g * gramsToOz;
    setOunces(oz);

    // Join the array into a single string before setting it
    setSteps(`
      Grams: ${g}
      Formula: Grams × 0.035274 = Ounces
      Ounces = ${g} × 0.035274 = ${oz.toFixed(4)}
    `);
  };

  const onClear = () => {
    setGrams("");
    setError(null);
    setOunces(null);
    setSteps(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Grams to Ounces Calculator</h1>
        </div>

        <div className="space-y-3">
          <Label htmlFor="grams">Enter Grams</Label>
          <div className="flex gap-2">
            <Input
              id="grams"
              className="flex-1"
              placeholder="Grams (e.g., 100)"
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
            />
            <Button onClick={onCalculate}>Calculate</Button>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        {ounces !== null && (
          <div className="mt-8 space-y-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground mb-1">Result</div>
              <div className="text-xl font-semibold">{ounces.toFixed(4)} US liquid ounces</div>
            </div>

            {steps && (
              <div className="rounded-md border p-4">
                <div className="mb-2 font-medium">Steps</div>
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {steps} {/* Directly render the string */}
                </pre>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={onClear} variant="secondary">Clear</Button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
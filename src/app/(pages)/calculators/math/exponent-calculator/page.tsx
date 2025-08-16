"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Function to calculate exponent
const calculateExponent = (base: number, exponent: number) => {
  if (base === 0 && exponent <= 0) {
    throw new Error("0 cannot be raised to a non-positive exponent.");
  }
  return Math.pow(base, exponent);
};

export default function ExponentCalculator() {
  const [base, setBase] = useState<number | string>("");
  const [exponent, setExponent] = useState<number | string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<string | null>(null);

  const onCalculate = () => {
    setError(null);
    setResult(null);
    setSteps(null);

    if (base === "" || exponent === "") {
      setError("Please enter both base and exponent.");
      return;
    }

    const baseNum = Number(base);
    const exponentNum = Number(exponent);

    if (isNaN(baseNum) || isNaN(exponentNum)) {
      setError("Please enter valid numbers for both base and exponent.");
      return;
    }

    try {
      const calculatedResult = calculateExponent(baseNum, exponentNum);
      setResult(calculatedResult);
      setSteps(`
        Base: ${baseNum}
        Exponent: ${exponentNum}
        Result: ${calculatedResult}
      `);
    } catch {
      setError("An error occurred with the calculation.");
    }
  };

  const onClear = () => {
    setBase("");
    setExponent("");
    setError(null);
    setResult(null);
    setSteps(null);
  };

  const onExample = () => {
    setBase("2");
    setExponent("3");
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Exponent Calculator</h1>
        </div>

        <div className="space-y-3">
          <Label htmlFor="base">Enter Base and Exponent</Label>
          <div className="flex gap-2">
            <Input
              id="base"
              className="flex-1"
              placeholder="Base (e.g., 2)"
              type="number"
              value={base}
              onChange={(e) => setBase(e.target.value)}
            />
            <Input
              id="exponent"
              className="flex-1"
              placeholder="Exponent (e.g., 3)"
              type="number"
              value={exponent}
              onChange={(e) => setExponent(e.target.value)}
            />
            <Button onClick={onCalculate}>Calculate It!</Button>
          </div>
          <div className="text-sm text-muted-foreground">Example: 2^3</div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="text-xl font-semibold">Example (Click to try)</div>
          <Button variant="secondary" onClick={onExample} className="font-semibold">
            2^3
          </Button>
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        {result !== null && (
          <div className="mt-8 space-y-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground mb-1">Result</div>
              <div className="text-xl font-semibold">{result}</div>
            </div>

            {steps && (
              <div className="rounded-md border p-4">
                <div className="mb-2 font-medium">Steps</div>
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {steps}
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
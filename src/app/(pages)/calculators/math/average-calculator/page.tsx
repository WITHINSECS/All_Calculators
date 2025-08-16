"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";

export default function AverageCalculator() {
  const [numbers, setNumbers] = useState<string>("");
  const [average, setAverage] = useState<number | null>(null);
  const [sum, setSum] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    if (!numbers.trim()) {
      setError("Please enter some numbers separated by commas.");
      setAverage(null);
      setSum(null);
      setCount(null);
      return;
    }

    // Build array safely
    const parsed = numbers
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    // Validate all tokens are numbers
    const asNums: number[] = [];
    for (const token of parsed) {
      const val = Number(token);
      if (Number.isNaN(val)) {
        setError(`"${token}" is not a valid number.`);
        setAverage(null);
        setSum(null);
        setCount(null);
        return;
      }
      asNums.push(val);
    }

    const s = asNums.reduce((a, b) => a + b, 0);
    const c = asNums.length;
    const avg = s / c;

    setError(null);
    setSum(s);
    setCount(c);
    setAverage(avg);
  };

  const handleClear = () => {
    setNumbers("");
    setAverage(null);
    setSum(null);
    setCount(null);
    setError(null);
  };

  // For the pretty formula
  const formulaLines =
    average !== null && sum !== null && count !== null
      ? [
          "Average = (x₁ + x₂ + … + xₙ) / n",
          `        = (${numbers
            .split(",")
            .map((n) => n.trim())
            .filter((n) => n.length > 0)
            .join(" + ")}) / ${count}`,
          `        = ${sum} / ${count}`,
          `        = ${average}`,
        ]
      : null;

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-2xl">
        <div className="mx-auto text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Average Calculator</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Please provide numbers separated by a comma to calculate the average of the numbers.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter numbers</Label>
            <textarea
              id="numbers"
              className="w-full border rounded-md p-3"
              rows={3}
              placeholder="e.g. 10, 2, 38, 23, 38, 23, 21"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {average !== null && sum !== null && count !== null && (
            <div className="space-y-3">
              <div className="text-lg font-semibold">
                Average: {average.toFixed(2)}
              </div>

              {/* Formula block */}
              <div className="rounded-md border p-3">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {formulaLines?.join("\n")}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

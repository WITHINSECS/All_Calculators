"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Function to convert mixed number to improper fraction
const mixedToImproper = (whole: number, numerator: number, denominator: number) => {
  return whole * denominator + numerator; // whole + numerator/denominator
};

// Function to convert improper fraction back to mixed number
const improperToMixed = (numerator: number, denominator: number) => {
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  return `${whole} ${remainder ? remainder + '/' + denominator : ''}`;
};

// Function to handle the operations on fractions
const performOperation = (num1: number, denom1: number, num2: number, denom2: number, operation: string) => {
  let resultNumerator = 0;
  let resultDenominator = denom1 * denom2;

  switch (operation) {
    case "+":
      resultNumerator = num1 * denom2 + num2 * denom1;
      break;
    case "-":
      resultNumerator = num1 * denom2 - num2 * denom1;
      break;
    case "*":
      resultNumerator = num1 * num2;
      resultDenominator = denom1 * denom2;
      break;
    case "/":
      resultNumerator = num1 * denom2;
      resultDenominator = denom1 * num2;
      break;
    default:
      break;
  }

  return improperToMixed(resultNumerator, resultDenominator);
};

export default function MixedNumbersCalculator() {
  const [firstMixedNumber, setFirstMixedNumber] = useState<string>("");
  const [secondMixedNumber, setSecondMixedNumber] = useState<string>("");
  const [operation, setOperation] = useState<string>(""); // Operator from dropdown
  const [result, setResult] = useState<string>("");

  const handleCalculate = () => {
    // Split the mixed numbers into whole and fraction parts
    const firstParts = firstMixedNumber.trim().split(" ");
    const secondParts = secondMixedNumber.trim().split(" ");

    const [firstWhole, firstFraction] = firstParts;
    const [secondWhole, secondFraction] = secondParts;

    // Extracting whole, numerator, and denominator for both mixed numbers
    const firstWholeNum = firstWhole ? parseInt(firstWhole) : 0;
    const firstFractionParts = firstFraction ? firstFraction.split("/") : ["0", "1"]; // Ensure it's a string array
    const firstNumerator = parseInt(firstFractionParts[0]);
    const firstDenominator = parseInt(firstFractionParts[1]);

    const secondWholeNum = secondWhole ? parseInt(secondWhole) : 0;
    const secondFractionParts = secondFraction ? secondFraction.split("/") : ["0", "1"]; // Ensure it's a string array
    const secondNumerator = parseInt(secondFractionParts[0]);
    const secondDenominator = parseInt(secondFractionParts[1]);

    // Convert mixed numbers to improper fractions
    const firstImproper = mixedToImproper(firstWholeNum, firstNumerator, firstDenominator);
    const secondImproper = mixedToImproper(secondWholeNum, secondNumerator, secondDenominator);

    // Perform the operation
    const finalResult = performOperation(firstImproper, firstDenominator, secondImproper, secondDenominator, operation);
    setResult(finalResult);
  };

  const handleClear = () => {
    setFirstMixedNumber("");
    setSecondMixedNumber("");
    setOperation("");
    setResult("");
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Mixed Numbers Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter mixed numbers, fractions, or decimals and perform basic arithmetic operations.
          </p>
        </div>

        <div className="space-y-4">
          {/* First Mixed Number Input */}
          <div className="space-y-2">
            <Label htmlFor="first-mixed-number">First Mixed Number</Label>
            <Input
              id="first-mixed-number"
              value={firstMixedNumber}
              onChange={(e) => setFirstMixedNumber(e.target.value)}
              placeholder="e.g. 1 3/4"
            />
          </div>

          {/* Operation Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <Select
              onValueChange={setOperation}
              value={operation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+">+</SelectItem>
                <SelectItem value="-">-</SelectItem>
                <SelectItem value="*">x</SelectItem>
                <SelectItem value="/">/</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Second Mixed Number Input */}
          <div className="space-y-2">
            <Label htmlFor="second-mixed-number">Second Mixed Number</Label>
            <Input
              id="second-mixed-number"
              value={secondMixedNumber}
              onChange={(e) => setSecondMixedNumber(e.target.value)}
              placeholder="e.g. -2 3/8"
            />
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculate}>Calculate</Button>

          {/* Display Result */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Result</div>
                <div className="text-xl font-semibold">{result}</div>
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
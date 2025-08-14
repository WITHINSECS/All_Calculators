"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";

const PercentageCalculator = () => {
  const [calcType, setCalcType] = useState("quick"); // Track which calculation to perform
  const [inputValues, setInputValues] = useState({
    value1: "",
    value2: "",
    result: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = () => {
    const { value1, value2 } = inputValues;
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    // Validation for input values
    if (isNaN(num1) || isNaN(num2) || num1 <= 0 || num2 <= 0) {
      setError("Enter values greater than 0");
      setInputValues((prev) => ({ ...prev, result: "" }));
      return;
    }

    setError(null);

    let result: number; // Declare 'result' with explicit type 'number'
    switch (calcType) {
      case "quick":
        result = (num1 / 100) * num2; // X% of Y
        break;
      case "reverse1":
        result = (num1 / num2) * 100; // X is what % of Y
        break;
      case "reverse2":
        result = (num1 * 100) / num2; // X is Y% of what
        break;
      default:
        break;
    }

    setInputValues((prev) => ({ ...prev, result: result.toFixed(2) }));
  };

  const handleCalcTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCalcType(e.target.value);
    setInputValues({
      value1: "",
      value2: "",
      result: "",
    });
    setError(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Percentage Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate percentages using different formulas.
          </p>
        </div>

        <div className="space-y-4">
          {/* Dropdown to select calculation type */}
          <div className="space-y-2">
            <Label>Select Calculation Type</Label>
            <select
              value={calcType}
              onChange={handleCalcTypeChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="quick">Quick Solutions</option>
              <option value="reverse1">X is what % of Y?</option>
              <option value="reverse2">X is Y% of what?</option>
            </select>
          </div>

          {/* First input field */}
          <div className="space-y-2">
            <Label>Value 1</Label>
            <Input
              className="mt-2 mb-3"
              name="value1"
              value={inputValues.value1}
              onChange={handleChange}
              type="number"
              inputMode="numeric"
              placeholder="Enter first value"
            />
          </div>

          {/* Second input field */}
          <div className="space-y-2">
            <Label>Value 2</Label>
            <Input
              className="mt-2 mb-3"
              name="value2"
              value={inputValues.value2}
              onChange={handleChange}
              type="number"
              inputMode="numeric"
              placeholder="Enter second value"
            />
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button className="w-full p-5" onClick={handleCalculate}>
              Calculate
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="mt-4 text-red-500">{error}</div>}

        {/* Result */}
        <div className="mt-4">
          {inputValues.result && (
            <>
              <h3 className="text-xl">Answer: {inputValues.result}</h3>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default PercentageCalculator;

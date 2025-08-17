"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GroceryCalculator() {
  const [householdType, setHouseholdType] = useState<string>("individual");
  const [taxableEarnings, setTaxableEarnings] = useState<number | string>(""); // Taxable earnings input
  const [groceryCost, setGroceryCost] = useState<number | string>(""); // Low-end grocery cost
  const [liberalBudget, setLiberalBudget] = useState<number | string>(""); // Liberal budget
  const [message, setMessage] = useState<string>("");

  const handleCalculate = () => {
    // Validate the taxable earnings input
    if (isNaN(Number(taxableEarnings)) || Number(taxableEarnings) <= 0) {
      alert("Please enter valid taxable earnings.");
      return;
    }

    const earnings = Number(taxableEarnings);
    let lowEndCost = 0;
    let liberalCost = 0;

    // Calculate the low-end grocery cost based on household type
    if (householdType === "individual") {
      lowEndCost = earnings * 0.15; // 15% of earnings for an individual
    } else if (householdType === "couple") {
      lowEndCost = earnings * 0.20; // 20% of earnings for a couple
    } else if (householdType === "family") {
      lowEndCost = earnings * 0.25; // 25% of earnings for a family
    }

    // Calculate the liberal budget (more comfortable margin)
    liberalCost = lowEndCost * 1.2; // 20% more than the low-end cost

    // Set the results
    setGroceryCost(lowEndCost.toFixed(2));
    setLiberalBudget(liberalCost.toFixed(2));

    // Suggest investing the difference wisely
    setMessage(
      `The grocery cost shown above is the low end of your budget.\n\n` +
      `If you prefer a more liberal budget, you can afford to spend up to $${liberalCost.toFixed(2)}, ` +
      `without fear of going under.\n\nHowever, it is best to invest the difference wisely to ensure ` +
      `a better quality of life later.`
    );
  };

  const handleClear = () => {
    setHouseholdType("individual");
    setTaxableEarnings("");
    setGroceryCost("");
    setLiberalBudget("");
    setMessage("");
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl text-center">Grocery Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Calculate how much you can afford to spend on groceries based on your household type and taxable earnings.
          </p>
        </div>

        <div className="space-y-4">
          {/* Household Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="householdType" className="font-bold">Choose Household Type</Label>
            <Select
              onValueChange={setHouseholdType}
              value={householdType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Household Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Taxable Earnings Input */}
          <div className="space-y-2">
            <Label htmlFor="taxableEarnings">Taxable Earnings ($)</Label>
            <Input
              id="taxableEarnings"
              type="number"
              value={taxableEarnings}
              onChange={(e) => setTaxableEarnings(e.target.value)}
              placeholder="Enter taxable earnings in dollars"
            />
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculate}>Calculate</Button>

          {/* Display Results */}
          {groceryCost && liberalBudget && (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg shadow-lg border p-6">
                <div className="text-xl font-semibold">Calculation Result</div>
                <div className="text-lg mt-4">
                  <p>The low-end grocery cost: ${groceryCost}</p>
                  <p>Your liberal grocery budget: ${liberalBudget}</p>
                </div>
              </div>

              {/* Display Message */}
              <div className="mt-4">
                <p>{message}</p>
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
"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define a type for the result of the calculation
interface AgeResult {
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  totalWeeks: number;
  totalDays: number;
}

// Helper function to calculate age difference
const calculateAge = (birthDate: string, asOfDate: string): AgeResult => {
  const birth = new Date(birthDate);
  const asOf = new Date(asOfDate);

  // Calculate the difference in years, months, and days
  let ageYears = asOf.getFullYear() - birth.getFullYear();
  let ageMonths = asOf.getMonth() - birth.getMonth();
  let ageDays = asOf.getDate() - birth.getDate();

  // If the month difference is negative, adjust the year and month
  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  // If the day difference is negative, adjust the month and day
  if (ageDays < 0) {
    ageMonths--;
    const lastMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    ageDays += lastMonth.getDate(); // get the last day of the previous month
  }

  // Calculate weeks
  const totalDays = Math.floor((asOf.getTime() - birth.getTime()) / (1000 * 3600 * 24)); // Total days between two dates
  const totalWeeks = Math.floor(totalDays / 7);

  return { ageYears, ageMonths, ageDays, totalWeeks, totalDays };
};

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>("");  // Empty default
  const [birthYear, setBirthYear] = useState<string>("");  // Empty default
  const [asOfDate, setAsOfDate] = useState<string>("");    // Empty default
  const [result, setResult] = useState<AgeResult | null>(null);  // Use AgeResult type here
  const [error, setError] = useState<string | null>(null);  // Error handling

  const onCalculate = () => {
    setError(null);
    setResult(null);

    if (birthDate === "" && birthYear === "") {
      setError("Please enter either birth date or birth year.");
      return;
    }

    // If birth year is used, calculate approximate birth date (January 1st)
    let finalBirthDate = "";
    if (birthYear !== "") {
      finalBirthDate = `${birthYear}-01-01`;
    } else {
      finalBirthDate = birthDate;  // If birth date is given
    }

    if (asOfDate === "") {
      setError("Please enter a valid 'as of' date.");
      return;
    }

    try {
      const ageResult = calculateAge(finalBirthDate, asOfDate);
      setResult(ageResult);
    } catch (error) {
      setError("There was an error calculating the age.");
    }
  };

  const onClear = () => {
    setBirthDate("");    // Set start time input to empty
    setBirthYear("");    // Set end time input to empty
    setAsOfDate("");     // Set break time input to empty
    setError(null);
    setResult(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Age Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate your exact or approximate age in years, months, weeks, and days.
          </p>
        </div>

        <div className="space-y-4">
          {/* Select Birth Date or Birth Year */}
          <div className="space-y-2">
            <Label htmlFor="birth-date">Select Birth Date</Label>
            <Input
              id="birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <Label htmlFor="birth-year">Or Enter Birth Year</Label>
            <Input
              id="birth-year"
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="e.g., 1990"
            />
          </div>

          {/* As of Date Input */}
          <div className="space-y-2">
            <Label htmlFor="as-of-date">Calculate Age As Of</Label>
            <Input
              id="as-of-date"
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
          </div>

          {/* Calculate Button */}
          <div className="flex gap-2">
            <Button onClick={onCalculate}>Calculate</Button>
            <Button variant="secondary" onClick={onClear}>Clear</Button>
          </div>

          {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

          {/* Result Display */}
          {result && (
            <div className="mt-8 space-y-4">
              {/* Age in Years, Months, Days */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Age</div>
                <div className="text-xl font-semibold">
                  {result.ageYears} years, {result.ageMonths} months, {result.ageDays} days
                </div>
              </div>

              {/* Total Weeks */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Weeks</div>
                <div className="text-xl font-semibold">
                  {result.totalWeeks} weeks
                </div>
              </div>

              {/* Total Days */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Days</div>
                <div className="text-xl font-semibold">
                  {result.totalDays} days
                </div>
              </div>

              {/* Steps */}
              <div className="rounded-md border p-4">
                <div className="mb-2 font-medium">Steps</div>
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {`Birth Date: ${birthDate || birthYear}\nAs Of Date: ${asOfDate}`}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button onClick={onClear} variant="secondary">Clear</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
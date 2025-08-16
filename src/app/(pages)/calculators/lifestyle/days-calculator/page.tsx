"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DaysCalculator() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [includeLastDay, setIncludeLastDay] = useState<boolean>(true);
  const [result, setResult] = useState<{
    daysBetween: number;
    timeBetween: string;
    weeksBetween: string;
    monthsBetween: string;
  } | null>(null);

  const handleCalculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate inputs
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Please enter valid dates.");
      return;
    }

    // If including the last day, add 1 to the end date
    const adjustedEnd = includeLastDay ? new Date(end.getTime() + 86400000) : end;

    // Calculate days between
    const daysBetween = Math.ceil((adjustedEnd.getTime() - start.getTime()) / (1000 * 3600 * 24));

    // Calculate years, months, and days
    const yearsBetween = Math.floor(daysBetween / 365);
    const remainingDaysAfterYears = daysBetween - yearsBetween * 365;
    const monthsBetween = Math.floor(remainingDaysAfterYears / 30);
    const daysLeft = remainingDaysAfterYears - monthsBetween * 30;

    // Calculate weeks between
    const weeksBetween = (daysBetween / 7).toFixed(2);

    // Time breakdown in months, years, and days
    const timeBetween = `${yearsBetween} years, ${monthsBetween} months, ${daysLeft} days`;
    const monthsBetweenResult = Math.floor(daysBetween / 30);

    setResult({
      daysBetween,
      timeBetween,
      weeksBetween: `${weeksBetween} weeks (${Math.floor(Number(weeksBetween))} weeks and ${daysBetween % 7} days)`,
      monthsBetween: `${monthsBetweenResult} full months`,
    });
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setIncludeLastDay(true);
    setResult(null); // Clear the result
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Days Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate the number of days, weeks, months, and years between two dates.
          </p>
        </div>

        <div className="space-y-4">
          {/* Start Date Input */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Enter start date"
            />
          </div>

          {/* End Date Input */}
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Enter end date"
            />
          </div>

          {/* Include Last Day Selection */}
          <div className="space-y-2">
            <Label htmlFor="include-last-day">Include Last Day</Label>
            <Select
              onValueChange={(value) => setIncludeLastDay(value === "yes")}
              value={includeLastDay ? "yes" : "no"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculateDays}>Calculate</Button>

          {/* Display Results */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Days between the dates</div>
                <div className="text-xl font-semibold">{result.daysBetween}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Time between the dates</div>
                <div className="text-xl font-semibold">{result.timeBetween}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Weeks between the dates</div>
                <div className="text-xl font-semibold">{result.weeksBetween}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Months between the dates</div>
                <div className="text-xl font-semibold">{result.monthsBetween}</div>
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
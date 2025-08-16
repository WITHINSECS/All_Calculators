"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Helper functions to calculate the difference in years, months, weeks, and days
const calculateDateDifference = (startDate: Date, endDate: Date) => {
  const msInADay = 1000 * 60 * 60 * 24;

  // Calculate the total days
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / msInADay);
  
  // Calculate business days, weekend days, and holidays (placeholder for now)
  let businessDays = 0;
  let weekendDays = 0;
  const holidays = 0; // Placeholder for future functionality to account for holidays

  for (let day = 0; day <= totalDays; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++; // Count weekends (Saturday and Sunday)
    } else {
      businessDays++; // Count business days (Monday to Friday)
    }
  }

  // Calculate years and months
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  const weeks = Math.floor(totalDays / 7);

  return {
    years,
    months,
    weeks,
    days: totalDays,
    businessDays,
    weekendDays,
    holidays,
  };
};

const addOrSubtractDate = (
  startDate: Date,
  years: number,
  months: number,
  weeks: number,
  days: number
) => {
  const newDate = new Date(startDate);
  newDate.setFullYear(newDate.getFullYear() + years);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setDate(newDate.getDate() + (weeks * 7) + days);
  return newDate;
};

export default function DateCalculator() {
  const [startDate, setStartDate] = useState<string>(""); // Default empty
  const [endDate, setEndDate] = useState<string>(""); // Default empty
  const [result, setResult] = useState<{
    years: number;
    months: number;
    weeks: number;
    days: number;
    businessDays: number;
    weekendDays: number;
    holidays: number;
  } | null>(null); // Explicitly typing the result state

  // Add/Subtract fields - default as empty string
  const [addSubtractYears, setAddSubtractYears] = useState<string>(""); // Changed to empty string
  const [addSubtractMonths, setAddSubtractMonths] = useState<string>(""); // Changed to empty string
  const [addSubtractWeeks, setAddSubtractWeeks] = useState<string>(""); // Changed to empty string
  const [addSubtractDays, setAddSubtractDays] = useState<string>(""); // Changed to empty string

  const handleCalculateDifference = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateDifference = calculateDateDifference(start, end);
      setResult(dateDifference);
    }
  };

  const handleAddSubtractDate = () => {
    if (startDate) {
      const updatedDate = addOrSubtractDate(
        new Date(startDate),
        Number(addSubtractYears || 0),  // Default to 0 if empty
        Number(addSubtractMonths || 0),  // Default to 0 if empty
        Number(addSubtractWeeks || 0),   // Default to 0 if empty
        Number(addSubtractDays || 0)     // Default to 0 if empty
      );
      setStartDate(updatedDate.toISOString().split("T")[0]); // Update the start date with the new value
    }
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Date Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate the difference between two dates, as well as adding or subtracting time to/from a date.
          </p>
        </div>

        <div className="space-y-4">
          {/* Date Difference Inputs */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)} // Keep it empty by default
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)} // Keep it empty by default
            />
          </div>

          {/* Calculate Difference Button */}
          <Button onClick={handleCalculateDifference}>Calculate Difference</Button>

          {result && (
            <div className="mt-4 space-y-2">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Difference</div>
                <div className="text-xl font-semibold">
                  {result.years} years, {result.months} months, {result.weeks} weeks, {result.days} days
                </div>
              </div>

              {/* Weekend, Business Days, and Holidays */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Within which, there are:</div>
                <div className="text-xl font-semibold">
                  Weekend Days*: {result.weekendDays}
                </div>
                <div className="text-xl font-semibold">
                  Holidays: {result.holidays}
                </div>
                <div className="text-xl font-semibold">
                  Business Days: {result.businessDays}
                </div>
              </div>
            </div>
          )}

          {/* Add/Subtract Date Inputs */}
          <div className="space-y-2">
            <Label htmlFor="add-subtract">Add/Subtract Time</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                min="0"
                value={addSubtractYears}
                onChange={(e) => setAddSubtractYears(e.target.value)}
                placeholder="Years"
              />
              <Input
                type="number"
                min="0"
                value={addSubtractMonths}
                onChange={(e) => setAddSubtractMonths(e.target.value)}
                placeholder="Months"
              />
              <Input
                type="number"
                min="0"
                value={addSubtractWeeks}
                onChange={(e) => setAddSubtractWeeks(e.target.value)}
                placeholder="Weeks"
              />
              <Input
                type="number"
                min="0"
                value={addSubtractDays}
                onChange={(e) => setAddSubtractDays(e.target.value)}
                placeholder="Days"
              />
            </div>
          </div>

          {/* Add/Subtract Button */}
          <Button onClick={handleAddSubtractDate}>Add/Subtract Time</Button>

          {/* Display Updated Start Date */}
          <div className="mt-4">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground mb-1">Updated Start Date</div>
              <div className="text-xl font-semibold">
                {startDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
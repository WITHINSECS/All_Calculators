"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Function to calculate time difference
const calculateTimeDifference = (
  startTime: string,
  endTime: string,
  breakTime: number
) => {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  // Calculate the difference in milliseconds
  let diff = end.getTime() - start.getTime();

  // Account for break time (convert minutes to milliseconds)
  diff -= breakTime * 60 * 1000;

  // Convert milliseconds to minutes and hours
  const totalMinutes = Math.floor(diff / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Decimal hours
  const decimalHours = totalMinutes / 60;

  return { totalHours, remainingMinutes, totalMinutes, decimalHours };
};

export default function HoursCalculator() {
  const [startTime, setStartTime] = useState<string>("");  // Empty default
  const [endTime, setEndTime] = useState<string>("");      // Empty default
  const [breakTime, setBreakTime] = useState<string>("");   // Default empty string for break time
  const [result, setResult] = useState<{ totalHours: number; remainingMinutes: number; totalMinutes: number; decimalHours: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onCalculate = () => {
    setError(null);
    setResult(null);

    // Validate the end time format
    if (endTime === "") {
      setError("Please enter a valid end time.");
      return;
    }

    // Convert breakTime to number if it's not empty
    const breakTimeNum = breakTime === "" ? 0 : Number(breakTime);

    try {
      const { totalHours, remainingMinutes, totalMinutes, decimalHours } = calculateTimeDifference(startTime, endTime, breakTimeNum);
      setResult({ totalHours, remainingMinutes, totalMinutes, decimalHours });
    } catch (error) {
      setError("There was an error calculating the time difference.");
    }
  };

  const onClear = () => {
    setStartTime("");    // Set start time input to empty
    setEndTime("");      // Set end time input to empty
    setBreakTime("");    // Set break time input to empty
    setError(null);
    setResult(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Hours Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate the difference between two times (start and end), including break time.
          </p>
        </div>

        <div className="space-y-4">
          {/* Start Time Input */}
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* End Time Input */}
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {/* Break Time Input */}
          <div className="space-y-2">
            <Label htmlFor="break-time">Break Time (minutes)</Label>
            <Input
              id="break-time"
              type="number"
              min="0"
              value={breakTime}
              onChange={(e) => setBreakTime(e.target.value)} // allow empty input
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
              {/* Time in hh:mm (minus breaks) */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Time In Between (hh:mm)</div>
                <div className="text-xl font-semibold">
                  {result.totalHours} hours {result.remainingMinutes} minutes
                </div>
              </div>

              {/* Time in Decimal Hours */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Time in Decimal Hours</div>
                <div className="text-xl font-semibold">
                  {result.decimalHours.toFixed(2)} hours
                </div>
              </div>

              {/* Time in Minutes */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Time in Minutes</div>
                <div className="text-xl font-semibold">
                  {result.totalMinutes} minutes
                </div>
              </div>

              {/* Full Hours */}
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Full Hours In Between</div>
                <div className="text-xl font-semibold">
                  {result.totalHours} hours
                </div>
              </div>

              {/* Steps */}
              <div className="rounded-md border p-4">
                <div className="mb-2 font-medium">Steps</div>
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {`Start Time: ${startTime}\nEnd Time: ${endTime}\nBreak Time: ${breakTime} minutes`}
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
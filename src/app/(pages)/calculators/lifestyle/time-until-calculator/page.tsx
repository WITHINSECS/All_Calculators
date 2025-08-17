"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdAccessTime } from "react-icons/md"; // Add a clock icon for visual flair

// Define the structure of timeRemaining state
interface TimeRemaining {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TimeUntilCalculator() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

  // Function to calculate the time difference
  const calculateTimeDifference = () => {
    if (!fromDate || !toDate) {
      alert("Please enter both start and end dates.");
      return;
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

    // If the end date is in the past, show an error
    if (differenceInMilliseconds < 0) {
      alert("The 'To' date cannot be earlier than the 'From' date.");
      return;
    }

    // Calculate the components of the time difference
    const years = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

    // Set the result as an object
    setTimeRemaining({
      years,
      days,
      hours,
      minutes,
      seconds,
    });
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setTimeRemaining(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl text-center">Time Until Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Calculate the time remaining until a given date and time.
          </p>
        </div>

        <div className="space-y-4">
          {/* From Date Input */}
          <div className="space-y-2">
            <Label htmlFor="from-date">From Date</Label>
            <Input
              id="from-date"
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="Enter starting date"
            />
          </div>

          {/* To Date Input */}
          <div className="space-y-2">
            <Label htmlFor="to-date">To Date</Label>
            <Input
              id="to-date"
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="Enter target date"
            />
          </div>

          {/* Calculate Button */}
          <Button onClick={calculateTimeDifference}>Calculate Time Until</Button>

          {/* Display Result as Table */}
          {timeRemaining && (
            <div className="mt-6">
              <div className="rounded-lg shadow-lg border p-6 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
                <div className="flex items-center mb-4">
                  <MdAccessTime className="text-3xl text-blue-700 mr-3" />
                  <div className="text-xl font-semibold text-blue-800">Time Remaining</div>
                </div>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-blue-700">Unit</th>
                      <th className="px-4 py-2 text-left font-medium text-blue-700">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 text-blue-600">Years</td>
                      <td className="px-4 py-2">{timeRemaining.years} year(s)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-blue-600">Days</td>
                      <td className="px-4 py-2">{timeRemaining.days} day(s)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-blue-600">Hours</td>
                      <td className="px-4 py-2">{timeRemaining.hours} hour(s)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-blue-600">Minutes</td>
                      <td className="px-4 py-2">{timeRemaining.minutes} minute(s)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-blue-600">Seconds</td>
                      <td className="px-4 py-2">{timeRemaining.seconds} second(s)</td>
                    </tr>
                  </tbody>
                </table>
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
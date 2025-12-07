"use client";

import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface SmokingCostInput {
  startDate: string;
  packetCost: number;
  cigarettesInPacket: number;
  cigarettesPerDay: number;
}

interface SmokingCostResult {
  totalCost: number;
  totalDays: number;
  chartData: { month: number; cost: number }[];
}

// Form state type – allows empty string so inputs can be blank
interface SmokingCostFormState {
  startDate: string;
  packetCost: number | "";
  cigarettesInPacket: number | "";
  cigarettesPerDay: number | "";
}

const calculateSmokingCost = (input: SmokingCostInput): SmokingCostResult => {
  const currentDate = new Date();
  const startDate = new Date(input.startDate);
  const daysSmoked = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );

  const costPerDay =
    (input.cigarettesPerDay / input.cigarettesInPacket) * input.packetCost;
  const totalCost = costPerDay * daysSmoked;

  const chartData: { month: number; cost: number }[] = [];
  let cumulativeCost = 0;
  for (let month = 1; month <= Math.floor(daysSmoked / 30); month++) {
    cumulativeCost += costPerDay * 30; // simple 30-day month assumption
    chartData.push({ month, cost: cumulativeCost });
  }

  return {
    totalCost,
    totalDays: daysSmoked,
    chartData,
  };
};

export default function SmokingCostCalculator() {
  const [input, setInput] = useState<SmokingCostFormState>({
    startDate: "",
    packetCost: "",
    cigarettesInPacket: "",
    cigarettesPerDay: "",
  });

  const [result, setResult] = useState<SmokingCostResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // allow empty + digits only
    if (!/^\d*$/.test(value)) return;

    setInput((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, startDate: e.target.value }));
  };

  const handleCalculate = () => {
    if (input.startDate === "") {
      setError("Please enter the start date.");
      return;
    }

    if (input.packetCost === "" || Number(input.packetCost) <= 0) {
      setError("Please enter a valid cost for the packet.");
      return;
    }

    if (input.cigarettesInPacket === "" || Number(input.cigarettesInPacket) <= 0) {
      setError("Please enter a valid number of cigarettes in the packet.");
      return;
    }

    if (input.cigarettesPerDay === "" || Number(input.cigarettesPerDay) <= 0) {
      setError("Please enter a valid number of cigarettes smoked per day.");
      return;
    }

    const numericInput: SmokingCostInput = {
      startDate: input.startDate,
      packetCost: Number(input.packetCost),
      cigarettesInPacket: Number(input.cigarettesInPacket),
      cigarettesPerDay: Number(input.cigarettesPerDay),
    };

    setError(null);
    const calcResult = calculateSmokingCost(numericInput);
    setResult(calcResult);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Cost of Smoking Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate how much you have spent on smoking over the years.
          </p>
        </div>

        <div className="space-y-4">
          {/* Start Date */}
          <div className="space-y-2">
            <Label>When did you start smoking?</Label>
            <Input
              className="mt-2 mb-3"
              name="startDate"
              value={input.startDate}
              onChange={handleDateChange}
              type="date"
              placeholder="Select start date"
            />
          </div>

          {/* Cost of Cigarettes */}
          <div className="space-y-2">
            <Label>Average cost of cigarettes per packet</Label>
            <Input
              className="mt-2 mb-3"
              name="packetCost"
              value={input.packetCost}
              onChange={handleNumberChange}
              type="number"
              inputMode="numeric"
              placeholder="Enter cost in Rupees"
            />
          </div>

          {/* Cigarettes in Packet */}
          <div className="space-y-2">
            <Label>How many cigarettes in the packet?</Label>
            <Input
              className="mt-2 mb-3"
              name="cigarettesInPacket"
              value={input.cigarettesInPacket}
              onChange={handleNumberChange}
              type="number"
              inputMode="numeric"
              placeholder="Enter number of cigarettes"
            />
          </div>

          {/* Cigarettes per Day */}
          <div className="space-y-2">
            <Label>How many cigarettes do you smoke a day?</Label>
            <Input
              className="mt-2 mb-3"
              name="cigarettesPerDay"
              value={input.cigarettesPerDay}
              onChange={handleNumberChange}
              type="number"
              inputMode="numeric"
              placeholder="Enter number of cigarettes per day"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button className="w-full p-5" onClick={handleCalculate}>
              Calculate Now
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && <div className="mt-4 text-red-500">{error}</div>}

        {/* Results */}
        <div className="mt-4">
          {result && (
            <>
              <h3 className="text-xl">
                Your smoking cost to date: Rs. {result.totalCost.toFixed(2)}
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Smoking Cost", value: result.totalCost },
                      {
                        name: "Potential Savings",
                        value: Math.max(0, 1000 - result.totalCost),
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    <Cell fill="#3498db" />
                    <Cell fill="#e74c3c" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
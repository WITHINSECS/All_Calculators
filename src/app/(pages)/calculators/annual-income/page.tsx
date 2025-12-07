"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Wrapper from "@/app/Wrapper";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define the type for Pie data
interface PieData {
  name: string;
  value: number;
}

const SalaryCalculator = () => {
  // Inputs as strings so they can be empty
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("");
  const [weeksPerYear, setWeeksPerYear] = useState<string>("");
  const [hourlyWage, setHourlyWage] = useState<string>("");
  const [tax, setTax] = useState<string>("");

  const [annualIncome, setAnnualIncome] = useState(0);
  const [netHourlyWage, setNetHourlyWage] = useState(0);
  const [netAnnualIncome, setNetAnnualIncome] = useState(0);

  const [pieData, setPieData] = useState<PieData[]>([]);

  // Helper: safe parse
  const parseOrZero = (val: string) => (val.trim() === "" ? 0 : Number(val));

  useEffect(() => {
    const hours = parseOrZero(hoursPerWeek);
    const weeks = parseOrZero(weeksPerYear);
    const wage = parseOrZero(hourlyWage);
    const taxRate = parseOrZero(tax);

    // If any required value is missing or invalid, clear results & chart
    if (hours <= 0 || weeks <= 0 || wage <= 0 || taxRate < 0) {
      setAnnualIncome(0);
      setNetHourlyWage(0);
      setNetAnnualIncome(0);
      setPieData([]);
      return;
    }

    const grossAnnual = hours * weeks * wage;
    const taxMultiplier = (100 - taxRate) / 100;
    const netHourly = wage * taxMultiplier;
    const netAnnual = grossAnnual * taxMultiplier;
    const taxAmount = grossAnnual - netAnnual;

    setAnnualIncome(grossAnnual);
    setNetHourlyWage(netHourly);
    setNetAnnualIncome(netAnnual);

    setPieData([
      { name: "Net Salary", value: netAnnual },
      { name: "Tax Deducted", value: taxAmount },
    ]);
  }, [hoursPerWeek, weeksPerYear, hourlyWage, tax]);

  const reset = () => {
    setHoursPerWeek("");
    setWeeksPerYear("");
    setHourlyWage("");
    setTax("");
    setAnnualIncome(0);
    setNetHourlyWage(0);
    setNetAnnualIncome(0);
    setPieData([]);
  };

  // Common input handler to allow empty string or numeric
  const handleNumericInput =
    (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || !isNaN(Number(value))) {
        setter(value);
      }
    };

  return (
    <Wrapper>
      <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Salary Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your gross and net salary, tax deductions, and other related metrics.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-6 border rounded-lg space-y-6">
          <div>
            <Label className="block mb-1.5">Working hours per week</Label>
            <Input
              type="text"
              value={hoursPerWeek}
              onChange={handleNumericInput(setHoursPerWeek)}
              placeholder="e.g. 40"
            />
          </div>

          <div>
            <Label className="block mb-1.5">Working weeks per year</Label>
            <Input
              type="text"
              value={weeksPerYear}
              onChange={handleNumericInput(setWeeksPerYear)}
              placeholder="e.g. 52"
            />
          </div>

          <div>
            <Label className="block mb-1.5">Hourly wage</Label>
            <Input
              type="text"
              value={hourlyWage}
              onChange={handleNumericInput(setHourlyWage)}
              placeholder="e.g. 25"
            />
          </div>

          <Separator />

          <div>
            <Label className="block mb-1.5">Tax (%)</Label>
            <Input
              type="text"
              value={tax}
              onChange={handleNumericInput(setTax)}
              placeholder="e.g. 12"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Results</h3>

            <div>
              <Label className="block mb-1.5">Annual Income (Gross)</Label>
              <Input
                type="text"
                value={annualIncome ? annualIncome.toLocaleString() : ""}
                readOnly
              />
            </div>

            <div>
              <Label className="block mb-1.5">Net Hourly Wage</Label>
              <Input
                type="text"
                value={netHourlyWage ? netHourlyWage.toFixed(2) : ""}
                readOnly
              />
            </div>

            <div>
              <Label className="block mb-1.5">Net Annual Income</Label>
              <Input
                type="text"
                value={netAnnualIncome ? netAnnualIncome.toLocaleString() : ""}
                readOnly
              />
            </div>
          </div>

          <Separator />

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#0D74FF" : "#FF5733"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={reset}>
              Reload calculator
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SalaryCalculator;

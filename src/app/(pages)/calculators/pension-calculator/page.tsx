"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import Wrapper from "@/app/Wrapper";

// Colors for Pie chart
const PIE_COLORS = ["#0D74FF", "#FF5733"];

export default function RetirementIncomeCalculator() {
  // States for user input
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [annualContribution, setAnnualContribution] = useState(20000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(68);
  const [inflation, setInflation] = useState(3.22);
  const [taxRate, setTaxRate] = useState(15); // Assume 15% tax rate
  const [increaseInflation, setIncreaseInflation] = useState(false);
  const [taxDeferred, setTaxDeferred] = useState(false);

  // Results and chart data
  const [resultIncome, setResultIncome] = useState(0);
  const [salaryData, setSalaryData] = useState<{ year: number, salary: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string, value: number }[]>([]);

  // Calculate monthly income
  const calculateRetirementIncome = () => {
    const yearsToRetire = retirementAge - currentAge;
    let totalSavings = currentSavings;
    let monthlyIncomeBeforeTax = 0;
    let monthlyIncomeAfterTax = 0;

    // Simulate growth in savings
    for (let i = 0; i < yearsToRetire; i++) {
      totalSavings += annualContribution;
      totalSavings *= 1 + inflation / 100; // Apply inflation to savings
    }

    // Monthly income before and after tax
    monthlyIncomeBeforeTax = totalSavings / (12 * (retirementAge - currentAge));
    monthlyIncomeAfterTax = monthlyIncomeBeforeTax * (1 - taxRate / 100);

    setResultIncome(monthlyIncomeAfterTax);

    // Bar chart data (Income before tax vs. after tax)
    setSalaryData([
      { year: retirementAge, salary: monthlyIncomeBeforeTax },
      { year: retirementAge, salary: monthlyIncomeAfterTax },
    ]);

    // Pie chart data (Before and after taxes)
    setPieData([
      { name: "Before taxes", value: monthlyIncomeBeforeTax },
      { name: "After taxes", value: monthlyIncomeAfterTax },
    ]);
  };

  // Handle calculations and prevent empty fields
  const handleCalculate = () => {
    if (!currentSavings || !annualContribution || !currentAge || !retirementAge) {
      alert("Please fill all the required fields");
      return;
    }

    calculateRetirementIncome();
  };

  // Handle reset
  const handleClear = () => {
    setCurrentSavings(10000);
    setAnnualContribution(20000);
    setCurrentAge(30);
    setRetirementAge(68);
    setInflation(3.22);
    setTaxRate(15);
    setIncreaseInflation(false);
    setTaxDeferred(false);
    setResultIncome(0);
    setSalaryData([]);
    setPieData([]);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Pension Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your projected retirement income based on your current savings and contributions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Inputs for user */}
          <div>
            <Label className="black mb-1.5" htmlFor="currentSavings">How much have you saved for retirement so far?</Label>
            <Input
              id="currentSavings"
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="annualContribution">Whats your annual savings contribution?</Label>
            <Input
              id="annualContribution"
              type="number"
              value={annualContribution}
              onChange={(e) => setAnnualContribution(Number(e.target.value))}
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="currentAge">Whats your current age?</Label>
            <Input
              id="currentAge"
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="retirementAge">What age do you plan to retire?</Label>
            <Input
              id="retirementAge"
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="inflation">Inflation rate (%):</Label>
            <Input
              id="inflation"
              type="number"
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
            />
          </div>

          <div>
            <Label className="black mb-1.5">Increase deposits with inflation</Label>
            <input
              type="checkbox"
              checked={increaseInflation}
              onChange={() => setIncreaseInflation(!increaseInflation)}
            />
          </div>

          <div>
            <Label className="black mb-1.5">Calculate savings to be tax-deferred</Label>
            <input
              type="checkbox"
              checked={taxDeferred}
              onChange={() => setTaxDeferred(!taxDeferred)}
            />
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>

          {/* Results */}
          {resultIncome > 0 && (
            <div className="mt-4 p-4 bg-gray-200 text-center rounded">
              <h2>Your Monthly Retirement Income</h2>
              <p className="mt-2 font-bold text-3xl">${resultIncome.toFixed(2)}</p>
            </div>
          )}

          {/* Bar Chart */}
          {salaryData.length > 0 && (
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="salary" stroke="#3498db" name="Salary" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <PieTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

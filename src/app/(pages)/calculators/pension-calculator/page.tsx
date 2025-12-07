"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  // Inputs as strings so they can be empty
  const [currentSavings, setCurrentSavings] = useState<string>("");
  const [annualContribution, setAnnualContribution] = useState<string>("");
  const [currentAge, setCurrentAge] = useState<string>("");
  const [retirementAge, setRetirementAge] = useState<string>("");
  const [inflation, setInflation] = useState<string>("");
  const [taxRate, setTaxRate] = useState<string>("");

  // Checkboxes
  const [increaseInflation, setIncreaseInflation] = useState(false);
  const [taxDeferred, setTaxDeferred] = useState(false);

  // Results and chart data
  const [resultIncome, setResultIncome] = useState(0);
  const [salaryData, setSalaryData] = useState<{ year: number; salary: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper to parse numbers safely
  const parseOrZero = (val: string) => (val.trim() === "" ? 0 : Number(val));

  // Calculate monthly retirement income
  const calculateRetirementIncome = () => {
    const currentSavingsNum = parseOrZero(currentSavings);
    const annualContributionNum = parseOrZero(annualContribution);
    const currentAgeNum = parseOrZero(currentAge);
    const retirementAgeNum = parseOrZero(retirementAge);
    const inflationNum = parseOrZero(inflation);
    const taxRateNum = parseOrZero(taxRate) || 0; // tax can be 0

    const yearsToRetire = retirementAgeNum - currentAgeNum;
    if (yearsToRetire <= 0) {
      setErrorMessage("Retirement age must be greater than current age.");
      return;
    }

    let totalSavings = currentSavingsNum;

    // Simulate growth in savings
    for (let i = 0; i < yearsToRetire; i++) {
      let contribution = annualContributionNum;
      if (increaseInflation && i > 0) {
        contribution *= Math.pow(1 + inflationNum / 100, i);
      }
      totalSavings += contribution;
      totalSavings *= 1 + inflationNum / 100;
    }

    // Monthly income before and after tax
    const monthlyIncomeBeforeTax = totalSavings / (12 * yearsToRetire);
    const effectiveTaxRate = taxDeferred ? 0 : taxRateNum; // simple toggle behaviour
    const monthlyIncomeAfterTax = monthlyIncomeBeforeTax * (1 - effectiveTaxRate / 100);

    setResultIncome(monthlyIncomeAfterTax);
    setErrorMessage("");

    // Line chart data (showing before & after tax as two points)
    setSalaryData([
      { year: retirementAgeNum, salary: monthlyIncomeBeforeTax },
      { year: retirementAgeNum, salary: monthlyIncomeAfterTax },
    ]);

    // Pie chart data
    setPieData([
      { name: "Before taxes", value: monthlyIncomeBeforeTax },
      { name: "After taxes", value: monthlyIncomeAfterTax },
    ]);
  };

  // Handle calculate with validation
  const handleCalculate = () => {
    const currentSavingsNum = parseOrZero(currentSavings);
    const annualContributionNum = parseOrZero(annualContribution);
    const currentAgeNum = parseOrZero(currentAge);
    const retirementAgeNum = parseOrZero(retirementAge);
    const inflationNum = parseOrZero(inflation);

    if (
      currentSavings.trim() === "" ||
      annualContribution.trim() === "" ||
      currentAge.trim() === "" ||
      retirementAge.trim() === "" ||
      inflation.trim() === ""
    ) {
      setErrorMessage("Please fill all the required fields.");
      return;
    }

    if (
      currentSavingsNum <= 0 ||
      annualContributionNum < 0 ||
      currentAgeNum <= 0 ||
      retirementAgeNum <= 0 ||
      inflationNum < 0
    ) {
      setErrorMessage("Please enter valid positive values.");
      return;
    }

    calculateRetirementIncome();
  };

  // Clear all
  const handleClear = () => {
    setCurrentSavings("");
    setAnnualContribution("");
    setCurrentAge("");
    setRetirementAge("");
    setInflation("");
    setTaxRate("");
    setIncreaseInflation(false);
    setTaxDeferred(false);
    setResultIncome(0);
    setSalaryData([]);
    setPieData([]);
    setErrorMessage("");
  };

  // Input handlers that allow empty string or numeric
  const handleNumericInput =
    (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || !isNaN(Number(value))) {
        setter(value);
      }
    };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Pension Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your projected retirement income based on your current savings and
            contributions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Inputs */}
          <div>
            <Label className="black mb-1.5" htmlFor="currentSavings">
              How much have you saved for retirement so far?
            </Label>
            <Input
              id="currentSavings"
              type="text"
              value={currentSavings}
              onChange={handleNumericInput(setCurrentSavings)}
              placeholder="$"
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="annualContribution">
              What&apos;s your annual savings contribution?
            </Label>
            <Input
              id="annualContribution"
              type="text"
              value={annualContribution}
              onChange={handleNumericInput(setAnnualContribution)}
              placeholder="$"
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="currentAge">
              What&apos;s your current age?
            </Label>
            <Input
              id="currentAge"
              type="text"
              value={currentAge}
              onChange={handleNumericInput(setCurrentAge)}
              placeholder="e.g. 30"
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="retirementAge">
              What age do you plan to retire?
            </Label>
            <Input
              id="retirementAge"
              type="text"
              value={retirementAge}
              onChange={handleNumericInput(setRetirementAge)}
              placeholder="e.g. 68"
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="inflation">
              Inflation rate (%):
            </Label>
            <Input
              id="inflation"
              type="text"
              value={inflation}
              onChange={handleNumericInput(setInflation)}
              placeholder="e.g. 3.22"
            />
          </div>

          <div>
            <Label className="black mb-1.5" htmlFor="taxRate">
              Tax rate on retirement income (%):
            </Label>
            <Input
              id="taxRate"
              type="text"
              value={taxRate}
              onChange={handleNumericInput(setTaxRate)}
              placeholder="e.g. 15"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="increaseInflation"
              type="checkbox"
              checked={increaseInflation}
              onChange={() => setIncreaseInflation((v) => !v)}
            />
            <Label className="black mb-1.5" htmlFor="increaseInflation">
              Increase deposits with inflation
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="taxDeferred"
              type="checkbox"
              checked={taxDeferred}
              onChange={() => setTaxDeferred((v) => !v)}
            />
            <Label className="black mb-1.5" htmlFor="taxDeferred">
              Calculate savings to be tax-deferred
            </Label>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-300 text-white rounded">{errorMessage}</div>
          )}

          {/* Results */}
          {resultIncome > 0 && !errorMessage && (
            <div className="mt-4 p-4 bg-gray-200 text-center rounded">
              <h2>Your Monthly Retirement Income</h2>
              <p className="mt-2 font-bold text-3xl">${resultIncome.toFixed(2)}</p>
            </div>
          )}

          {/* Line Chart */}
          {salaryData.length > 0 && (
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="salary" stroke="#3498db" name="Income" />
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
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
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

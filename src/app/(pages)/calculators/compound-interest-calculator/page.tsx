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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";

// Fix frequencies object to use "yearly" instead of "annual"
const frequencies = {
  monthly: 12,
  weekly: 52,
  daily: 365,
  yearly: 1, // Use yearly instead of annual
};

interface InvestmentInput {
  initialInvestment: number;
  interestRate: number;
  compoundFrequency: number;
  interestRatePeriod: "daily" | "weekly" | "monthly" | "yearly"; // Fixed to match valid keys
  years: number;
  months: number;
  depositAmount: number;
  depositPeriod: "beginning" | "end"; // When deposits are made
  additionalContributions: "none" | "deposits" | "withdrawals" | "both";
  annualDepositIncrease: number; // Added missing property
}

interface InvestmentResult {
  futureValue: number;
  totalInterest: number;
  yearlyBreakdown: { year: number; interest: number; accrued: number; balance: number }[]; 
}

// Function to calculate investment
const calculateInvestment = (input: InvestmentInput): InvestmentResult => {
  let balance = input.initialInvestment;
  const compoundPerYear = frequencies[input.interestRatePeriod]; // Fixed
  const totalMonths = input.years * 12 + input.months;
  const monthlyRate = input.interestRate / 100 / compoundPerYear;
  const yearlyBreakdown: { year: number; interest: number; accrued: number; balance: number }[] = [];

  const getCompoundRate = (period: string) => {
    if (period === "daily") return 1 + input.interestRate / 100 / 365;
    if (period === "weekly") return 1 + input.interestRate / 100 / 52;
    if (period === "monthly") return 1 + input.interestRate / 100 / 12;
    return 1 + input.interestRate / 100;
  };

  for (let month = 0; month <= totalMonths; month++) {
    if (month > 0 && month % 12 === 0) {
      const year = Math.floor(month / 12);
      const interest = balance * monthlyRate * compoundPerYear;
      const accrued: number = (yearlyBreakdown[year - 1]?.accrued || 0) + interest;
      balance += interest;

      // Handling Deposits
      if (input.additionalContributions === "deposits") {
        const deposit = input.depositAmount * (1 + input.annualDepositIncrease / 100) ** (year - 1);
        if (input.depositPeriod === "beginning") {
          balance += deposit;
        }
      }

      // Handling Withdrawals or Both Deposits & Withdrawals
      if (input.additionalContributions === "withdrawals" || input.additionalContributions === "both") {
        const withdrawalAmount = input.depositAmount * (1 + input.annualDepositIncrease / 100) ** (Math.floor(month / 12));
        if (input.depositPeriod === "beginning") {
          balance -= withdrawalAmount;
        } else {
          balance -= withdrawalAmount;
        }
      }

      yearlyBreakdown.push({ year, interest, accrued, balance });
    }
    balance *= Math.pow(getCompoundRate(input.interestRatePeriod), 1);
  }

  const futureValue = balance;
  const totalInterest = futureValue - input.initialInvestment;

  return {
    futureValue,
    totalInterest,
    yearlyBreakdown,
  };
};

export default function InvestmentCalculator() {
  const [input, setInput] = useState<InvestmentInput>({
    initialInvestment: 5000,
    interestRate: 5,
    compoundFrequency: 12,
    interestRatePeriod: "monthly", 
    years: 5,
    months: 0,
    depositAmount: 0,
    depositPeriod: "end",
    additionalContributions: "none",
    annualDepositIncrease: 0,
  });
  
  const [result, setResult] = useState<InvestmentResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = value === "" ? "" : Number(value); // Handle empty string case
    setInput((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleCompoundFrequencyChange = (value: string) => {
    setInput((prev) => ({
      ...prev,
      interestRatePeriod: value as "daily" | "weekly" | "monthly" | "yearly",
    }));
  };

  const handleContributionsChange = (value: "none" | "deposits" | "withdrawals" | "both") => {
    setInput((prev) => ({
      ...prev,
      additionalContributions: value,
    }));
  };

  const handleDepositPeriodChange = (value: "beginning" | "end") => {
    setInput((prev) => ({
      ...prev,
      depositPeriod: value,
    }));
  };

  const handleCalculate = () => {
    const calcResult = calculateInvestment(input);
    setResult(calcResult);
  };

  const handleReset = () => {
    setInput({
      initialInvestment: 5000,
      interestRate: 5,
      compoundFrequency: 12,
      interestRatePeriod: "monthly",
      years: 5,
      months: 0,
      depositAmount: 0,
      depositPeriod: "end",
      additionalContributions: "none",
      annualDepositIncrease: 0,
    });
    setResult(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Compound Interest Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Investment Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
                <div className="space-y-2">
                  <div>
                    <label>Initial investment</label>
                    <Input
                      className="mt-1 mb-3"
                      name="initialInvestment"
                      value={input.initialInvestment}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Interest rate</label>
                    <Input
                      className="mt-1 mb-3"
                      name="interestRate"
                      value={input.interestRate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block">Compound frequency</label>
                    <Select onValueChange={handleCompoundFrequencyChange} defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (365/yr)</SelectItem>
                        <SelectItem value="weekly">Weekly (52/yr)</SelectItem>
                        <SelectItem value="monthly">Monthly (12/yr)</SelectItem>
                        <SelectItem value="yearly">Yearly (1/yr)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <div>
                      <label>Years</label>
                      <Input
                        className="mt-1 mb-3"
                        name="years"
                        value={input.years}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label>Months</label>
                      <Input
                        className="mt-1 mb-3"
                        name="months"
                        value={input.months}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Contributions</h3>
                <div className="space-y-2">
                  <div>
                    <label className="mb-1 block">Additional contributions</label>
                    <Select onValueChange={handleContributionsChange} defaultValue="none">
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="deposits">Deposits</SelectItem>
                        <SelectItem value="withdrawals">Withdrawals</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {input.additionalContributions === "deposits" && (
                    <>
                      <div>
                        <label>Deposit amount</label>
                        <Input
                          className="mt-1 mb-3"
                          name="depositAmount"
                          value={input.depositAmount}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label>Annual deposit % increase</label>
                        <Input
                          className="mt-1 mb-3"
                          name="annualDepositIncrease"
                          value={input.annualDepositIncrease}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                  {input.additionalContributions !== "none" && (
                    <div>
                      <label className="mb-1 block">Deposit Period</label>
                      <Select onValueChange={handleDepositPeriodChange} defaultValue="end">
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginning">Beginning</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="p-5 w-full" onClick={handleCalculate}>
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-xl">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="mb-6">
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Future investment value</TableCell>
                  <TableCell className="text-right">${result?.futureValue.toFixed(2) ?? "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total interest earned</TableCell>
                  <TableCell className="text-right">${result?.totalInterest.toFixed(2) ?? "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={result?.yearlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#82ca9d" name="Balance" />
                <Line type="monotone" dataKey="accrued" stroke="#8884d8" name="Accrued Interest" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
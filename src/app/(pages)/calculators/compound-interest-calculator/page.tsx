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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Frequencies
const frequencies = {
  monthly: 12,
  weekly: 52,
  daily: 365,
  yearly: 1,
};

interface InvestmentInput {
  initialInvestment: number;
  interestRate: number;
  compoundFrequency: number;
  interestRatePeriod: "daily" | "weekly" | "monthly" | "yearly";
  years: number;
  months: number;
  depositAmount: number;
  depositPeriod: "beginning" | "end";
  additionalContributions: "none" | "deposits" | "withdrawals" | "both";
  annualDepositIncrease: number;
}

interface InvestmentResult {
  futureValue: number;
  totalInterest: number;
  yearlyBreakdown: {
    year: number;
    interest: number;
    accrued: number;
    balance: number;
  }[];
}

// UI state: strings for inputs so they can be empty
interface InvestmentFormState {
  initialInvestment: string;
  interestRate: string;
  years: string;
  months: string;
  depositAmount: string;
  annualDepositIncrease: string;
  interestRatePeriod: "daily" | "weekly" | "monthly" | "yearly";
  depositPeriod: "beginning" | "end";
  additionalContributions: "none" | "deposits" | "withdrawals" | "both";
}

// Calculation
const calculateInvestment = (input: InvestmentInput): InvestmentResult => {
  let balance = input.initialInvestment;
  const compoundPerYear = frequencies[input.interestRatePeriod];
  const totalMonths = input.years * 12 + input.months;
  const monthlyRate = input.interestRate / 100 / compoundPerYear;

  const yearlyBreakdown: {
    year: number;
    interest: number;
    accrued: number;
    balance: number;
  }[] = [];

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
      const accrued: number =
        (yearlyBreakdown[year - 1]?.accrued || 0) + interest;
      balance += interest;

      // Deposits
      if (input.additionalContributions === "deposits") {
        const deposit =
          input.depositAmount *
          (1 + input.annualDepositIncrease / 100) ** (year - 1);
        if (input.depositPeriod === "beginning") {
          balance += deposit;
        }
      }

      // Withdrawals / both
      if (
        input.additionalContributions === "withdrawals" ||
        input.additionalContributions === "both"
      ) {
        const withdrawalAmount =
          input.depositAmount *
          (1 + input.annualDepositIncrease / 100) ** Math.floor(month / 12);
        balance -= withdrawalAmount;
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
  // All numeric inputs start as empty strings
  const [input, setInput] = useState<InvestmentFormState>({
    initialInvestment: "",
    interestRate: "",
    years: "",
    months: "",
    depositAmount: "",
    annualDepositIncrease: "",
    interestRatePeriod: "monthly",
    depositPeriod: "end",
    additionalContributions: "none",
  });

  const [result, setResult] = useState<InvestmentResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value, // keep as string so it can be ""
    }));
  };

  const handleCompoundFrequencyChange = (
    value: "daily" | "weekly" | "monthly" | "yearly"
  ) => {
    setInput((prev) => ({
      ...prev,
      interestRatePeriod: value,
    }));
  };

  const handleContributionsChange = (
    value: "none" | "deposits" | "withdrawals" | "both"
  ) => {
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
    const numericInput: InvestmentInput = {
      initialInvestment: Number(input.initialInvestment) || 0,
      interestRate: Number(input.interestRate) || 0,
      compoundFrequency: frequencies[input.interestRatePeriod],
      interestRatePeriod: input.interestRatePeriod,
      years: Number(input.years) || 0,
      months: Number(input.months) || 0,
      depositAmount: Number(input.depositAmount) || 0,
      depositPeriod: input.depositPeriod,
      additionalContributions: input.additionalContributions,
      annualDepositIncrease: Number(input.annualDepositIncrease) || 0,
    };

    const calcResult = calculateInvestment(numericInput);
    setResult(calcResult);
  };

  const handleReset = () => {
    setInput({
      initialInvestment: "",
      interestRate: "",
      years: "",
      months: "",
      depositAmount: "",
      annualDepositIncrease: "",
      interestRatePeriod: "monthly",
      depositPeriod: "end",
      additionalContributions: "none",
    });
    setResult(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Compound Interest Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Explore our comprehensive range of calculators designed to assist
            you with various financial, health, lifestyle, and mathematical
            needs.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Investment Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left side */}
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
                      placeholder="$"
                    />
                  </div>
                  <div>
                    <label>Interest rate (%)</label>
                    <Input
                      className="mt-1 mb-3"
                      name="interestRate"
                      value={input.interestRate}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block">Compound frequency</label>
                    <Select
                      value={input.interestRatePeriod}
                      onValueChange={(val) =>
                        handleCompoundFrequencyChange(
                          val as "daily" | "weekly" | "monthly" | "yearly"
                        )
                      }
                    >
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
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div>
                      <label>Months</label>
                      <Input
                        className="mt-1 mb-3"
                        name="months"
                        value={input.months}
                        onChange={handleChange}
                        placeholder="e.g. 6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Additional Contributions
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="mb-1 block">Additional contributions</label>
                    <Select
                      value={input.additionalContributions}
                      onValueChange={(val) =>
                        handleContributionsChange(
                          val as "none" | "deposits" | "withdrawals" | "both"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="deposits">Deposits</SelectItem>
                        <SelectItem value="withdrawals">
                          Withdrawals
                        </SelectItem>
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
                          placeholder="$"
                        />
                      </div>
                      <div>
                        <label>Annual deposit % increase</label>
                        <Input
                          className="mt-1 mb-3"
                          name="annualDepositIncrease"
                          value={input.annualDepositIncrease}
                          onChange={handleChange}
                          placeholder="e.g. 3"
                        />
                      </div>
                    </>
                  )}

                  {input.additionalContributions !== "none" && (
                    <div>
                      <label className="mb-1 block">Deposit Period</label>
                      <Select
                        value={input.depositPeriod}
                        onValueChange={(val) =>
                          handleDepositPeriodChange(
                            val as "beginning" | "end"
                          )
                        }
                      >
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

            <div className="flex gap-2 items-center justify-center flex-col">
              <Button className="p-5 w-full" onClick={handleCalculate}>
                Calculate
              </Button>
              <Button variant="outline" className="w-full" onClick={handleReset}>
                Reset
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
                  <TableCell className="text-right">
                    {result
                      ? `$${result.futureValue.toFixed(2)}`
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total interest earned</TableCell>
                  <TableCell className="text-right">
                    {result
                      ? `$${result.totalInterest.toFixed(2)}`
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={result?.yearlyBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#82ca9d"
                  name="Balance"
                />
                <Line
                  type="monotone"
                  dataKey="accrued"
                  stroke="#8884d8"
                  name="Accrued Interest"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const frequencies = {
  monthly: 12,
  weekly: 52,
  daily: 365,
  yearly: 1
};

export default function InvestmentCalculator() {
  const [frequency, setFrequency] = useState<"monthly" | "weekly" | "daily" | "yearly">("monthly");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState<{ invested: number; returns: number; wealth: number } | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCalculate = () => {
    const P = parseFloat(amount); // Principal
    const R = parseFloat(rate) / 100; // Interest rate
    const T = parseFloat(tenure); // Tenure in years

    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R <= 0 || T <= 0) {
      setAlertMessage("Please fill all fields correctly. Ensure none of the values are zero or empty.");
      return;
    }

    const n = frequencies[frequency]; // Get frequency value
    const totalInstallments = n * T;
    const i = R / n;

    // Future Value Calculation (Compound Interest formula)
    const FV = P * (((Math.pow(1 + i, totalInstallments) - 1) / i) * (1 + i));
    const invested = P * totalInstallments;
    const returns = FV - invested;

    // Update result
    setAlertMessage(""); // Clear alert message
    setResult({
      invested: parseFloat(invested.toFixed(2)),
      returns: parseFloat(returns.toFixed(2)),
      wealth: parseFloat(FV.toFixed(2)),
    });
  };

  return (
    <Wrapper>
      <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            SIP Calculator
          </h1>
          <p className="text-muted-foreground mt-4 md:text-lg">
            Wish to invest periodically? Calculate the amount of wealth that you can generate using our SIP Calculator.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Input fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="mb-1.5 block font-semibold">Frequency of Investment:</label>
              <Select value={frequency} onValueChange={(val: "monthly" | "weekly" | "daily" | "yearly") => setFrequency(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="mb-1.5 block font-semibold">Investment Amount <span className="text-red-600">*</span></label>
              <Input
                placeholder="Ex: 1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
            </div>
            <div className="space-y-2">
              <label className="mb-1.5 block font-semibold">Expected rate of return (P.A) <span className="text-red-600">*</span></label>
              <Input
                placeholder="Ex: 12%"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                type="number"
              />
            </div>
            <div className="space-y-2">
              <label className="mb-1.5 block font-semibold">
                Tenure (in years) <span className="text-red-600">*</span> <span className="text-xs text-gray-600">(Up to 50 years)</span>
              </label>
              <Input
                placeholder="Ex: 10"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                type="number"
                max={50}
              />
            </div>
          </div>

          <Button onClick={handleCalculate}>Plan My Wealth</Button>

          {/* Display Alert */}
          {alertMessage && <div className="text-red-600 font-semibold mt-4">{alertMessage}</div>}

          {/* Display Results */}
          {result && (
            <div className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Total Invested</TableHead>
                    <TableHead>Total Returns</TableHead>
                    <TableHead>Total Wealth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>${result.invested.toLocaleString()}</TableCell>
                    <TableCell>${result.returns.toLocaleString()}</TableCell>
                    <TableCell>${result.wealth.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Pie Chart */}
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[ 
                        { name: "Invested", value: result.invested },
                        { name: "Returns", value: result.returns }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                    >
                      <Cell fill="#0D74FF" />
                      <Cell fill="#FF5733" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
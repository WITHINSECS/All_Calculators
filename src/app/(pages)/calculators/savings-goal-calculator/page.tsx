"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";

// Frequency options for investment
const frequencies = {
  monthly: 12,
  weekly: 52,
  daily: 365,
};

// Define the type for the chart data
interface ChartData {
  month: string;
  deposits: number;
  interest: number;
  balance: number;
}

export default function SavingsCalculator() {
  const [currency, setCurrency] = useState("$");
  const [balance, setBalance] = useState("");
  const [goal, setGoal] = useState("");
  const [deposit, setDeposit] = useState("");
  const [frequency, setFrequency] = useState<"monthly" | "weekly" | "daily">("monthly");
  const [interest, setInterest] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const [chartData, setChartData] = useState<ChartData[]>([]); // Use the defined ChartData type

  const [yearsToGoal, setYearsToGoal] = useState<number | null>(null);
  const [monthsToGoal, setMonthsToGoal] = useState<number | null>(null);

  const calculate = () => {
    const current = parseFloat(balance);
    const target = parseFloat(goal);
    const depositAmount = parseFloat(deposit);
    const annualRate = parseFloat(interest) / 100;
    const compounding = frequencies[frequency];

    if (isNaN(current) || isNaN(target) || isNaN(depositAmount) || isNaN(annualRate)) {
      setResult("Please fill in all fields correctly.");
      return;
    }

    if (current >= target) {
      setResult("You have already reached your goal!");
      return;
    }

    let months = 0;
    let total = current;
    const r = annualRate / compounding;
    let totalInterest = 0;
    let depositAccumulated = 0;

    const tempChartData: ChartData[] = []; // Use the defined ChartData type

    while (total < target && months < 1000 * compounding) {
      const interestEarned = total * r;
      totalInterest += interestEarned;
      total = total + interestEarned + depositAmount;
      depositAccumulated += depositAmount;
      months++;

      tempChartData.push({
        month: `Month ${months}`,
        deposits: depositAccumulated,
        interest: totalInterest,
        balance: total,
      });
    }

    const years = months / compounding;
    const yearsRounded = Math.floor(years);
    const monthsRounded = Math.round((years - yearsRounded) * 12);

    if (months >= 1000 * compounding) {
      setResult("Goal not reachable with the current plan.");
    } else {
      setResult(
        `You will reach your goal in about ${yearsRounded} years and ${monthsRounded} months.`
      );
      setYearsToGoal(yearsRounded);
      setMonthsToGoal(monthsRounded);
    }

    // Setting the chart data
    setChartData(tempChartData);

    // Updating the result table
    const totalDeposits = depositAccumulated;
    const totalInterestEarned = totalInterest;
    const totalSavings = totalDeposits + totalInterestEarned;
    
    setResult(
      `Deposits made: ${totalDeposits.toFixed(2)}\nInterest earned: ${totalInterestEarned.toFixed(2)}\nTotal savings: ${totalSavings.toFixed(2)}`
    );
  };

  return (
    <Wrapper>
      <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Savings Goal Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            This calculator helps you estimate how long it will take to reach your savings goal
            based on your current savings, deposits, interest rate, and frequency.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 p-6 border rounded-lg shadow">
          {/* Input Fields */}
          <div>
            <Label className="mb-2 block">Currency</Label>
            <ToggleGroup type="single" value={currency} onValueChange={(val) => val && setCurrency(val)}>
              {["$", "€", "£", "₹", "¥"].map((sym) => (
                <ToggleGroupItem key={sym} value={sym} aria-label={sym}>
                  {sym}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <Label className="mb-1.5">Current balance</Label>
            <div className="flex items-center gap-2">
              <span>{currency}</span>
              <Input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Enter current balance"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5">Your savings goal</Label>
            <div className="flex items-center gap-2">
              <span>{currency}</span>
              <Input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Enter goal amount"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5">Deposits being made</Label>
            <div className="flex items-center gap-2">
              <span>{currency}</span>
              <Input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="Enter deposit amount"
              />
              <Select value={frequency} onValueChange={(val) => setFrequency(val as "monthly" | "weekly" | "daily")}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-1.5">Annual interest rate (%)</Label>
            <Input
              type="number"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="Enter annual interest rate"
            />
          </div>

          <Button className="w-full mt-2" onClick={calculate}>
            Calculate
          </Button>

          {result && <p className="mt-4 font-medium text-center">{result}</p>}

          {/* Table showing result */}
          {yearsToGoal !== null && monthsToGoal !== null && (
            <div className="mt-6 bg-white p-4 rounded-md shadow-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Calculation</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Time to reach your goal</TableCell>
                    <TableCell>{yearsToGoal} years and {monthsToGoal} months</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Deposits made</TableCell>
                    <TableCell>{(parseFloat(deposit) * monthsToGoal).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Interest earned</TableCell>
                    <TableCell>{(parseFloat(deposit) * monthsToGoal * (parseFloat(interest) / 100)).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Savings</TableCell>
                    <TableCell>{(parseFloat(goal) - parseFloat(balance)).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Stacked Bar Chart for Savings Breakdown */}
          {chartData.length > 0 && (
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="balance" fill="#4caf50" stackId="a" />
                  <Bar dataKey="deposits" fill="#ff9800" stackId="a" />
                  <Bar dataKey="interest" fill="#2196f3" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
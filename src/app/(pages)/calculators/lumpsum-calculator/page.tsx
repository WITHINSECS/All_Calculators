"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";

export default function InvestmentCalculator() {
  // Form state as strings so inputs can be empty
  const [totalInvestment, setTotalInvestment] = useState<string>("");
  const [returnRate, setReturnRate] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");

  // Numeric results
  const [investedAmount, setInvestedAmount] = useState(0);
  const [estReturns, setEstReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Store the numeric rate & period used for the last calculation (for line chart)
  const [usedRate, setUsedRate] = useState(0);
  const [usedPeriod, setUsedPeriod] = useState(0);

  const [alertMessage, setAlertMessage] = useState("");

  const calculateInvestment = () => {
    const principal = Number(totalInvestment);
    const rateNum = Number(returnRate);
    const periodNum = Number(timePeriod);

    // validation: required & positive
    if (
      !totalInvestment.trim() ||
      !returnRate.trim() ||
      !timePeriod.trim() ||
      isNaN(principal) ||
      isNaN(rateNum) ||
      isNaN(periodNum) ||
      principal <= 0 ||
      rateNum <= 0 ||
      periodNum <= 0
    ) {
      setAlertMessage("Please fill in all fields correctly with values greater than 0.");
      setInvestedAmount(0);
      setEstReturns(0);
      setTotalValue(0);
      setUsedRate(0);
      setUsedPeriod(0);
      return;
    }

    const rate = rateNum / 100;
    const futureValue = principal * Math.pow(1 + rate, periodNum);

    const invested = principal;
    const returns = futureValue - principal;

    setInvestedAmount(invested);
    setEstReturns(parseFloat(returns.toFixed(2)));
    setTotalValue(parseFloat(futureValue.toFixed(2)));
    setUsedRate(rateNum);
    setUsedPeriod(periodNum);

    setAlertMessage("");
  };

  const handleCalculate = () => {
    calculateInvestment();
  };

  const handleClear = () => {
    setTotalInvestment("");
    setReturnRate("");
    setTimePeriod("");
    setInvestedAmount(0);
    setEstReturns(0);
    setTotalValue(0);
    setUsedRate(0);
    setUsedPeriod(0);
    setAlertMessage("");
  };

  // Pie chart data
  const pieData =
    totalValue > 0
      ? [
          { name: "Invested amount", value: investedAmount },
          { name: "Est. returns", value: estReturns },
        ]
      : [];

  // Line chart data (growth over time using last used rate/period)
  const lineData =
    totalValue > 0 && usedRate > 0 && usedPeriod > 0
      ? Array.from({ length: usedPeriod }, (_, i) => {
          const year = i + 1;
          const fv = investedAmount * Math.pow(1 + usedRate / 100, year);
          return { name: `Year ${year}`, value: fv };
        })
      : [];

  const COLORS = ["#000000", "#82ca9d"];

  // Common handler: allow empty string or numeric
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
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Lumpsum Investment Calculator
          </h1>
          <p className="text-muted-foreground mt-4 md:text-lg">
            Use this tool to calculate how much wealth you can generate from a lumpsum
            investment.
          </p>
        </div>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalInvestment">Total investment</Label>
              <Input
                id="totalInvestment"
                type="text"
                value={totalInvestment}
                onChange={handleNumericInput(setTotalInvestment)}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnRate">Expected return rate (p.a)</Label>
              <Input
                id="returnRate"
                type="text"
                value={returnRate}
                onChange={handleNumericInput(setReturnRate)}
                placeholder="e.g. 12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timePeriod">Time period (in years)</Label>
              <Input
                id="timePeriod"
                type="text"
                value={timePeriod}
                onChange={handleNumericInput(setTimePeriod)}
                placeholder="e.g. 10"
              />
            </div>

            <div className="mt-4 flex gap-4">
              <Button onClick={handleCalculate}>Calculate</Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>

            {alertMessage && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                {alertMessage}
              </div>
            )}
          </div>

          {totalValue > 0 && (
            <>
              {/* Results Table */}
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount ($)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Invested Amount</TableCell>
                      <TableCell className="text-right">
                        ${investedAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Est. Returns</TableCell>
                      <TableCell className="text-right">
                        ${estReturns.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Value</TableCell>
                      <TableCell className="text-right font-medium">
                        ${totalValue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

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
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Line Chart */}
              {lineData.length > 0 && (
                <div className="mt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

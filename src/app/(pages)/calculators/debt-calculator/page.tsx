"use client";
import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Wrapper from "@/app/Wrapper";

const COLORS = ["#0D74FF", "#FF5733", "#FFC300", "#28A745"];

const DebtCalculator = () => {
  const [debtType, setDebtType] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [balance, setBalance] = useState("");
  const [minPayment, setMinPayment] = useState("");
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    setCalculated(true);
  };

  const debtBreakdown = [
    { name: "Credit Cards", value: debtType === "credit" ? parseFloat(balance || "0") : 0 },
    { name: "Car Loans", value: debtType === "car" ? parseFloat(balance || "0") : 0 },
    { name: "Student Loans", value: debtType === "student" ? parseFloat(balance || "0") : 0 },
    { name: "Other Debt", value: debtType === "other" ? parseFloat(balance || "0") : 0 },
  ];

  const totalDebt = debtBreakdown.reduce((sum, d) => sum + d.value, 0);
  const monthlySteal = minPayment ? parseFloat(minPayment) : 0;

  return (
    <Wrapper>
      <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
        <h1 className="text-2xl font-semibold lg:text-4xl">
          Debt Calculator
        </h1>
        <p className="text-muted-foreground mt-4 text-xl">
          Enter your debt details below and calculate how much your debts are costing you.
        </p>
      </div>

      <div className="max-w-6xl lg:px-12 w-full mx-auto p-4">
        {/* Debt Input Form */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label>Debt Type</Label>
              <Select onValueChange={setDebtType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select debt type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car Loan</SelectItem>
                  <SelectItem value="student">Student Loan</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                placeholder="5.00"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div>
              <Label>Balance ($)</Label>
              <Input
                type="number"
                placeholder="100"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>

            <div>
              <Label>Minimum Payment ($)</Label>
              <Input
                type="number"
                placeholder="0"
                value={minPayment}
                onChange={(e) => setMinPayment(e.target.value)}
              />
            </div>

            <Button className="w-full mt-4" onClick={handleCalculate}>
              Calculate
            </Button>
          </div>

          {/* Pie Chart */}
          {calculated && (
            <div className="flex justify-center items-center">
              <PieChart width={280} height={280}>
                <Pie
                  data={debtBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {debtBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          )}
        </div>

        {/* Debt Breakdown Table */}
        {calculated && (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold mb-4">Your Debt Breakdown</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount ($)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debtBreakdown.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>${d.value.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">TOTAL DEBT</TableCell>
                    <TableCell className="font-bold">${totalDebt.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <p className="mt-4 text-lg font-medium text-red-600">
              Debt is stealing ${monthlySteal.toFixed(2)} of your income every month!
            </p>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default DebtCalculator;
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Wrapper from "@/app/Wrapper";

// Pie chart colors
const PIE_COLORS = ["#0D74FF", "#FF5733"];

type CalculateType =
  | "Future Value"
  | "Present Value"
  | "Interest Rate"
  | "Periods"
  | "Repeating Payment";

export default function TVMCalculator() {
  // Inputs as strings so they can be empty
  const [presentValue, setPresentValue] = useState<string>("");
  const [futureValue, setFutureValue] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [periods, setPeriods] = useState<string>("");

  const [payment, setPayment] = useState<number>(0); // result for repeating payment (not shown yet, but kept)
  const [calculateType, setCalculateType] = useState<CalculateType>("Future Value");

  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  // Handle calculations
  const handleCalculate = () => {
    const PV = Number(presentValue) || 0;
    const FV = Number(futureValue) || 0;
    const r = Number(interestRate) || 0;
    const n = Number(periods) || 0;

    let result = 0;
    let newPieData: { name: string; value: number }[] = [];

    switch (calculateType) {
      case "Future Value": {
        if (PV <= 0 || r <= 0 || n <= 0) break;
        result = PV * Math.pow(1 + r / 100, n);
        setFutureValue(result.toString());
        newPieData = [
          { name: "Present Value", value: PV },
          { name: "Future Value", value: result },
        ];
        break;
      }
      case "Present Value": {
        if (FV <= 0 || r <= 0 || n <= 0) break;
        result = FV / Math.pow(1 + r / 100, n);
        setPresentValue(result.toString());
        newPieData = [
          { name: "Future Value", value: FV },
          { name: "Present Value", value: result },
        ];
        break;
      }
      case "Interest Rate": {
        if (FV <= 0 || PV <= 0 || n <= 0) break;
        result = (Math.pow(FV / PV, 1 / n) - 1) * 100;
        setInterestRate(result.toString());
        break;
      }
      case "Periods": {
        if (FV <= 0 || PV <= 0 || r <= 0) break;
        result = Math.log(FV / PV) / Math.log(1 + r / 100);
        setPeriods(result.toString());
        break;
      }
      case "Repeating Payment": {
        if (r <= 0 || n <= 0) break;
        const factor = Math.pow(1 + r / 100, n);
        if (factor - 1 === 0) break;
        result = (FV - PV * factor) / (factor - 1);
        setPayment(result);
        break;
      }
      default:
        break;
    }

    setCalculatedValue(result || 0);
    setPieData(newPieData);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">TVM Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate the Time Value of Money (TVM) based on the selected parameters.
          </p>
        </div>

        <div className="p-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Select Calculation Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={calculateType}
                onValueChange={(value) => setCalculateType(value as CalculateType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Calculation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Future Value">Future Value</SelectItem>
                  <SelectItem value="Present Value">Present Value</SelectItem>
                  <SelectItem value="Interest Rate">Interest Rate</SelectItem>
                  <SelectItem value="Periods">Periods</SelectItem>
                  <SelectItem value="Repeating Payment">Repeating Payment</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="my-5">
            <CardHeader>
              <CardTitle>Enter Values</CardTitle>
            </CardHeader>
            <CardContent>
              {/* PV / rate / periods (for FV, PV, Repeating Payment) */}
              {(calculateType === "Future Value" ||
                calculateType === "Present Value" ||
                calculateType === "Repeating Payment") && (
                <div className="space-y-4">
                  <div>
                    <Label>Present Value (PV):</Label>
                    <Input
                      type="text"
                      value={presentValue}
                      onChange={(e) => setPresentValue(e.target.value)}
                      placeholder="$"
                    />
                  </div>

                  <div>
                    <Label>Interest Rate (%):</Label>
                    <Input
                      type="text"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="e.g. 5"
                    />
                  </div>

                  <div>
                    <Label>Number of Periods:</Label>
                    <Input
                      type="text"
                      value={periods}
                      onChange={(e) => setPeriods(e.target.value)}
                      placeholder="e.g. 5"
                    />
                  </div>

                  {calculateType === "Repeating Payment" && (
                    <div>
                      <Label>Future Value (FV):</Label>
                      <Input
                        type="text"
                        value={futureValue}
                        onChange={(e) => setFutureValue(e.target.value)}
                        placeholder="$"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* FV / PV (for Interest Rate or Periods) */}
              {(calculateType === "Interest Rate" ||
                calculateType === "Periods") && (
                <div className="space-y-4">
                  <div>
                    <Label>Future Value (FV):</Label>
                    <Input
                      type="text"
                      value={futureValue}
                      onChange={(e) => setFutureValue(e.target.value)}
                      placeholder="$"
                    />
                  </div>

                  <div>
                    <Label>Present Value (PV):</Label>
                    <Input
                      type="text"
                      value={presentValue}
                      onChange={(e) => setPresentValue(e.target.value)}
                      placeholder="$"
                    />
                  </div>

                  {calculateType === "Interest Rate" && (
                    <div>
                      <Label>Number of Periods:</Label>
                      <Input
                        type="text"
                        value={periods}
                        onChange={(e) => setPeriods(e.target.value)}
                        placeholder="e.g. 5"
                      />
                    </div>
                  )}

                  {calculateType === "Periods" && (
                    <div>
                      <Label>Interest Rate (%):</Label>
                      <Input
                        type="text"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="e.g. 5"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button className="w-full" onClick={handleCalculate}>
              Calculate
            </Button>
          </div>

          {/* Display the calculated value */}
          {calculatedValue > 0 && (
            <div className="mt-6 text-center p-6 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl text-white text-3xl font-semibold">
              <h2>Calculated Value:</h2>
              <p>${calculatedValue.toFixed(2)}</p>
            </div>
          )}

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
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
  
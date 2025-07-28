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

export default function TVMCalculator() {
  // States for user inputs
  const [presentValue, setPresentValue] = useState(10000);
  const [futureValue, setFutureValue] = useState(0);
  const [interestRate, setInterestRate] = useState(5);
  const [periods, setPeriods] = useState(5);
  const [payment, setPayment] = useState(0);
  const [calculateType, setCalculateType] = useState("Future Value");

  const [pieData, setPieData] = useState<{ name: string, value: number }[]>([]);
  const [calculatedValue, setCalculatedValue] = useState(0);

  // Handle calculations
  const handleCalculate = () => {
    let result = 0;
    switch (calculateType) {
      case "Future Value":
        result = presentValue * Math.pow(1 + interestRate / 100, periods);
        setFutureValue(result);
        setPieData([
          { name: "Present Value", value: presentValue },
          { name: "Future Value", value: result }
        ]);
        break;
      case "Present Value":
        result = futureValue / Math.pow(1 + interestRate / 100, periods);
        setPresentValue(result);
        setPieData([
          { name: "Future Value", value: futureValue },
          { name: "Present Value", value: result }
        ]);
        break;
      case "Interest Rate":
        result = (Math.pow(futureValue / presentValue, 1 / periods) - 1) * 100;
        setInterestRate(result);
        break;
      case "Periods":
        result = Math.log(futureValue / presentValue) / Math.log(1 + interestRate / 100);
        setPeriods(result);
        break;
      case "Repeating Payment":
        result = (futureValue - presentValue * Math.pow(1 + interestRate / 100, periods)) / 
                  ((Math.pow(1 + interestRate / 100, periods) - 1));
        setPayment(result);
        break;
      default:
        break;
    }
    setCalculatedValue(result);
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
              <Select onValueChange={(value) => setCalculateType(value)}>
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
              {/* Input fields based on calculation type */}
              {calculateType === "Future Value" || calculateType === "Present Value" || calculateType === "Repeating Payment" ? (
                <div className="space-y-4">
                  <div>
                    <Label>Present Value (PV):</Label>
                    <Input
                      type="number"
                      value={presentValue}
                      onChange={(e) => setPresentValue(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Interest Rate (%):</Label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Number of Periods:</Label>
                    <Input
                      type="number"
                      value={periods}
                      onChange={(e) => setPeriods(Number(e.target.value))}
                    />
                  </div>

                  {calculateType === "Repeating Payment" && (
                    <div>
                      <Label>Future Value (FV):</Label>
                      <Input
                        type="number"
                        value={futureValue}
                        onChange={(e) => setFutureValue(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              ) : null}

              {calculateType === "Interest Rate" || calculateType === "Periods" ? (
                <div className="space-y-4">
                  <div>
                    <Label>Future Value (FV):</Label>
                    <Input
                      type="number"
                      value={futureValue}
                      onChange={(e) => setFutureValue(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Present Value (PV):</Label>
                    <Input
                      type="number"
                      value={presentValue}
                      onChange={(e) => setPresentValue(Number(e.target.value))}
                    />
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button className="w-full" onClick={handleCalculate}>Calculate</Button>
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
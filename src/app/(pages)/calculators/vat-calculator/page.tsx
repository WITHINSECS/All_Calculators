"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function VATCalculator() {
  const [amount, setAmount] = useState(200);
  const [vatPercentage, setVatPercentage] = useState(20);
  const [operation, setOperation] = useState("exclude");
  const [vatExcluded, setVatExcluded] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [grossAmount, setGrossAmount] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  // Handle calculation for VAT excluding or adding
  const calculateVAT = () => {
    if (amount === 0 || vatPercentage === 0) {
      alert("Please fill out all fields with valid values!");
      return;
    }

    let tempChartData: any[] = [];
    if (operation === "exclude") {
      const vatAmount = (amount * vatPercentage) / 100;
      setVatExcluded(vatAmount);
      setNetAmount(amount - vatAmount);

      // Generate data for the line chart
      for (let i = 1; i <= 12; i++) {
        const monthlyAmount = amount - (vatAmount * i) / 12;
        tempChartData.push({
          month: `Month ${i}`,
          amount: monthlyAmount,
        });
      }
    } else {
      const totalAmount = amount * (1 + vatPercentage / 100);
      setVatExcluded(totalAmount - amount);
      setGrossAmount(totalAmount);

      // Generate data for the line chart
      for (let i = 1; i <= 12; i++) {
        const monthlyAmount = amount + (vatExcluded * i) / 12;
        tempChartData.push({
          month: `Month ${i}`,
          amount: monthlyAmount,
        });
      }
    }

    setChartData(tempChartData);
  };

  const handleCalculate = () => {
    calculateVAT();
  };

  const handleClear = () => {
    setAmount(200);
    setVatPercentage(20);
    setOperation("exclude");
    setVatExcluded(0);
    setNetAmount(0);
    setGrossAmount(0);
    setChartData([]); // Clear the chart data
  };

  return (
    <Wrapper>
      <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">VAT Calculator (Exclude or Add VAT)</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            This calculator helps you calculate the VAT added or excluded based on your amount and VAT percentage.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-t-lg grid md:grid-cols-2 grid-cols-1 gap-5 items-center space-x-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount:</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatPercentage">VAT, %:</Label>
              <Input
                id="vatPercentage"
                type="number"
                value={vatPercentage}
                onChange={(e) => setVatPercentage(Number(e.target.value))}
                placeholder="Enter VAT percentage"
              />
            </div>
            <RadioGroup value={operation} onValueChange={setOperation} className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclude" id="exclude" />
                <Label htmlFor="exclude">exclude VAT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add">add VAT</Label>
              </div>
            </RadioGroup>
            <Button onClick={handleCalculate}>Calculate</Button>
          </div>

          <div className="md:mt-4 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-5">Amount</TableHead>
                  <TableHead className="py-5">VAT, %</TableHead>
                  <TableHead className="py-5">Operation</TableHead>
                  <TableHead className="py-5">
                    {operation === "add" ? "VAT Added" : "VAT Excluded"}
                  </TableHead>
                  <TableHead className="py-5">
                    {operation === "add" ? "Gross Amount" : "Net Amount"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{amount.toFixed(2)}</TableCell>
                  <TableCell>{vatPercentage.toFixed(2)}</TableCell>
                  <TableCell>{operation}</TableCell>
                  <TableCell>{vatExcluded.toFixed(2)}</TableCell>
                  <TableCell>{operation === "add" ? grossAmount.toFixed(2) : netAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Line Chart for VAT changes */}
          {chartData.length > 0 && (
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#3498db" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4">
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
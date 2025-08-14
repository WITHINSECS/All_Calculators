"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Define the type for chart data
interface ChartData {
  name: string;
  value: number;
}

export default function VATCalculator() {
  const [amount, setAmount] = useState(""); // Empty string for input field
  const [vatPercentage, setVatPercentage] = useState(""); // Empty string for VAT input
  const [operation, setOperation] = useState("exclude");
  const [vatExcluded, setVatExcluded] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [grossAmount, setGrossAmount] = useState<number>(0);

  // Change chartData to a specific type
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Handle calculation for VAT excluding or adding
  const calculateVAT = () => {
    if (amount === "" || vatPercentage === "" || isNaN(Number(amount)) || isNaN(Number(vatPercentage))) {
      alert("Please fill out all fields with valid values!");
      return;
    }

    const numericAmount = Number(amount);
    const numericVatPercentage = Number(vatPercentage);
    const tempChartData: ChartData[] = [];
    
    if (operation === "exclude") {
      const vatAmount = (numericAmount * numericVatPercentage) / 100;
      setVatExcluded(vatAmount);
      setNetAmount(numericAmount - vatAmount);

      // Pie chart data
      tempChartData.push({
        name: "VAT Excluded",
        value: vatAmount,
      });
      tempChartData.push({
        name: "Net Amount",
        value: numericAmount - vatAmount,
      });
    } else {
      const totalAmount = numericAmount * (1 + numericVatPercentage / 100);
      setVatExcluded(totalAmount - numericAmount);
      setGrossAmount(totalAmount);

      // Pie chart data
      tempChartData.push({
        name: "VAT Added",
        value: totalAmount - numericAmount,
      });
      tempChartData.push({
        name: "Gross Amount",
        value: totalAmount,
      });
    }

    setChartData(tempChartData);
  };

  const handleCalculate = () => {
    calculateVAT();
  };

  const handleClear = () => {
    setAmount(""); // Empty the amount input
    setVatPercentage(""); // Empty the VAT percentage input
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
                onChange={(e) => setAmount(e.target.value)} // Set value to empty string
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatPercentage">VAT, %:</Label>
              <Input
                id="vatPercentage"
                type="number"
                value={vatPercentage}
                onChange={(e) => setVatPercentage(e.target.value)} // Set value to empty string
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
                  <TableCell>{amount !== "" ? Number(amount).toFixed(2) : "-"}</TableCell>
                  <TableCell>{vatPercentage !== "" ? Number(vatPercentage).toFixed(2) : "-"}</TableCell>
                  <TableCell>{operation}</TableCell>
                  <TableCell>{vatExcluded !== 0 ? vatExcluded.toFixed(2) : "-"}</TableCell>
                  <TableCell>{operation === "add" ? grossAmount !== 0 ? grossAmount.toFixed(2) : "-" : netAmount !== 0 ? netAmount.toFixed(2) : "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Pie Chart for VAT and Amount breakdown */}
          {chartData.length > 0 && (
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#3498db" : "#2ecc71"} />
                    ))}
                  </Pie>
                </PieChart>
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
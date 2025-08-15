"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import Wrapper from "@/app/Wrapper";

export default function HRAExemptionCalculator() {
  const [basicSalary, setBasicSalary] = useState<string>("0");
  const [dearnessAllowance, setDearnessAllowance] = useState<string>("0");
  const [hraReceived, setHraReceived] = useState<string>("0");
  const [totalRentPaid, setTotalRentPaid] = useState<string>("0");
  const [isMetro, setIsMetro] = useState(false);
  const [exemption, setExemption] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  const calculateHRAExemption = () => {
    // Convert input values to numbers
    const basicSalaryNum = parseFloat(basicSalary);
    const dearnessAllowanceNum = parseFloat(dearnessAllowance);
    const hraReceivedNum = parseFloat(hraReceived);
    const totalRentPaidNum = parseFloat(totalRentPaid);

    // Validation: If any field is empty or zero, display an alert
    if (basicSalaryNum <= 0 || dearnessAllowanceNum <= 0 || hraReceivedNum <= 0 || totalRentPaidNum <= 0) {
      setAlertMessage("Please fill in all fields correctly and ensure values are not zero or empty.");
      return;
    } else {
      setAlertMessage(""); // Clear the alert message
    }

    const annualBasicSalary = basicSalaryNum * 12;
    const annualHRAReceived = hraReceivedNum * 12;
    const annualRentPaid = totalRentPaidNum * 12;

    const metroFactor = isMetro ? 0.5 : 0.4;
    const expectedExemption1 = annualBasicSalary * metroFactor; // 50% of basic for metro, 40% for non-metro
    const expectedExemption2 = annualRentPaid - (annualBasicSalary * 0.1); // Rent paid minus 10% of basic
    const expectedExemption3 = annualHRAReceived; // Actual HRA received

    const hraExemption = Math.min(expectedExemption1, expectedExemption2, expectedExemption3);
    setExemption(hraExemption);
  };

  const handleCalculate = () => {
    calculateHRAExemption();
  };

  const handleClear = () => {
    setBasicSalary("0");
    setDearnessAllowance("0");
    setHraReceived("0");
    setTotalRentPaid("0");
    setIsMetro(false);
    setExemption(0);
    setAlertMessage(""); // Clear the alert message
  };

  // Pie chart data
  const pieData = [
    { name: "HRA Exemption", value: exemption },
    { name: "Other Deductions", value: 100000 - exemption }, // example additional deduction
  ];

  // Line chart data (showing how exemption evolves over the years)
  const lineData = [
    { year: 1, exemption: exemption },
    { year: 2, exemption: exemption + 5000 }, // Assuming a growth over years
    { year: 3, exemption: exemption + 10000 },
  ];

  return (
    <Wrapper>
      <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            HRA Exemption Calculator
          </h1>
          <p className="text-muted-foreground mt-4 md:text-lg">
            How much of my HRA is exempted from tax? Use this calculator to calculate the amount of House Rent Allowance that is non-taxable!
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary *</Label>
              <Input
                id="basicSalary"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dearnessAllowance">Dearness Allowance *</Label>
              <Input
                id="dearnessAllowance"
                type="number"
                value={dearnessAllowance}
                onChange={(e) => setDearnessAllowance(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hraReceived">HRA Received *</Label>
              <Input
                id="hraReceived"
                type="number"
                value={hraReceived}
                onChange={(e) => setHraReceived(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalRentPaid">Total Rent Paid *</Label>
              <Input
                id="totalRentPaid"
                type="number"
                value={totalRentPaid}
                onChange={(e) => setTotalRentPaid(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label>Do you live in Delhi, Mumbai, Kolkata, or Chennai? *</Label>
            <RadioGroup value={isMetro ? "yes" : "no"} onValueChange={(value) => setIsMetro(value === "yes")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
          {alertMessage && <div className="text-red-600 font-semibold mt-4">{alertMessage}</div>}
          <div className="mt-6">
            <Button className="p-5 w-full" onClick={handleCalculate}>
              Calculate Now
            </Button>
          </div>
          {exemption > 0 && (
            <div className="mt-4 p-4 bg-green-100 rounded">
              Your HRA exemption is: ₹{exemption.toFixed(2)}
            </div>
          )}
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
                  <Cell fill="#0D74FF" />
                  <Cell fill="#FF5733" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="exemption" stroke="#3498db" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import Wrapper from "@/app/Wrapper";

export default function HRAExemptionCalculator() {
  const [basicSalary, setBasicSalary] = useState<string>("");
  const [dearnessAllowance, setDearnessAllowance] = useState<string>("");
  const [hraReceived, setHraReceived] = useState<string>("");
  const [totalRentPaid, setTotalRentPaid] = useState<string>("");
  const [isMetro, setIsMetro] = useState(false);
  const [exemption, setExemption] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  const calculateHRAExemption = () => {
    const basicSalaryNum = Number(basicSalary);
    const dearnessAllowanceNum = Number(dearnessAllowance);
    const hraReceivedNum = Number(hraReceived);
    const totalRentPaidNum = Number(totalRentPaid);

    // Validation: empty / NaN / <= 0
    if (
      !basicSalary.trim() ||
      !dearnessAllowance.trim() ||
      !hraReceived.trim() ||
      !totalRentPaid.trim() ||
      isNaN(basicSalaryNum) ||
      isNaN(dearnessAllowanceNum) ||
      isNaN(hraReceivedNum) ||
      isNaN(totalRentPaidNum) ||
      basicSalaryNum <= 0 ||
      dearnessAllowanceNum <= 0 ||
      hraReceivedNum <= 0 ||
      totalRentPaidNum <= 0
    ) {
      setAlertMessage(
        "Please fill in all fields correctly and ensure values are not zero or empty."
      );
      setExemption(0);
      return;
    } else {
      setAlertMessage("");
    }

    const annualBasicSalary = basicSalaryNum * 12;
    const annualHRAReceived = hraReceivedNum * 12;
    const annualRentPaid = totalRentPaidNum * 12;

    const metroFactor = isMetro ? 0.5 : 0.4;

    const expectedExemption1 = annualBasicSalary * metroFactor; // 50% or 40% of basic
    const expectedExemption2 = annualRentPaid - annualBasicSalary * 0.1; // Rent paid - 10% of basic
    const expectedExemption3 = annualHRAReceived; // Actual HRA received

    const hraExemption = Math.min(expectedExemption1, expectedExemption2, expectedExemption3);

    setExemption(hraExemption > 0 ? hraExemption : 0);
  };

  const handleCalculate = () => {
    calculateHRAExemption();
  };

  const handleClear = () => {
    setBasicSalary("");
    setDearnessAllowance("");
    setHraReceived("");
    setTotalRentPaid("");
    setIsMetro(false);
    setExemption(0);
    setAlertMessage("");
  };

  // Pie chart data
  const pieData =
    exemption > 0
      ? [
          { name: "HRA Exemption", value: exemption },
          { name: "Other Deductions", value: 100000 - exemption }, // sample other deduction
        ]
      : [];

  // Line chart data (example growth over years)
  const lineData =
    exemption > 0
      ? [
          { year: 1, exemption: exemption },
          { year: 2, exemption: exemption + 5000 },
          { year: 3, exemption: exemption + 10000 },
        ]
      : [];

  // numeric-input handler that still allows empty string
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
            HRA Exemption Calculator
          </h1>
          <p className="text-muted-foreground mt-4 md:text-lg">
            How much of my HRA is exempted from tax? Use this calculator to calculate the amount
            of House Rent Allowance that is non-taxable!
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="basicSalary">Basic Salary *</Label>
              <Input
                id="basicSalary"
                type="text"
                value={basicSalary}
                onChange={handleNumericInput(setBasicSalary)}
                placeholder="e.g. 50000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dearnessAllowance">Dearness Allowance *</Label>
              <Input
                id="dearnessAllowance"
                type="text"
                value={dearnessAllowance}
                onChange={handleNumericInput(setDearnessAllowance)}
                placeholder="e.g. 5000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hraReceived">HRA Received *</Label>
              <Input
                id="hraReceived"
                type="text"
                value={hraReceived}
                onChange={handleNumericInput(setHraReceived)}
                placeholder="e.g. 20000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalRentPaid">Total Rent Paid *</Label>
              <Input
                id="totalRentPaid"
                type="text"
                value={totalRentPaid}
                onChange={handleNumericInput(setTotalRentPaid)}
                placeholder="e.g. 15000"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Do you live in Delhi, Mumbai, Kolkata, or Chennai? *</Label>
            <RadioGroup
              value={isMetro ? "yes" : "no"}
              onValueChange={(value) => setIsMetro(value === "yes")}
            >
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

          {alertMessage && (
            <div className="text-red-600 font-semibold mt-4">{alertMessage}</div>
          )}

          <div className="mt-6">
            <Button className="p-5 w-full" onClick={handleCalculate}>
              Calculate Now
            </Button>
          </div>

          {exemption > 0 && !alertMessage && (
            <div className="mt-4 p-4 bg-green-100 rounded">
              Your HRA exemption is: ₹{exemption.toFixed(2)}
            </div>
          )}

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
                    <Cell fill="#0D74FF" />
                    <Cell fill="#FF5733" />
                  </Pie>
                  <Tooltip />
                  <Legend />
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
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="exemption" stroke="#3498db" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

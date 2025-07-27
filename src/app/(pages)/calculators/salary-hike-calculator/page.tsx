"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Wrapper from "@/app/Wrapper";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";

// Colors for the Pie chart
const PIE_COLORS = ["#0D74FF", "#FF5733"]; // Blue for salary, Green for the hike or new salary

export default function SalaryCalculator() {
  const [currentSalary, setCurrentSalary] = useState(1000);
  const [hikePercentage, setHikePercentage] = useState(10);
  const [newSalary, setNewSalary] = useState("");
  const [result, setResult] = useState("");
  const [salaryData, setSalaryData] = useState<any[]>([]);

  // Pie chart data
  const [pieDataSalaryHike, setPieDataSalaryHike] = useState<{ name: string, value: number }[]>([]);
  const [pieDataHikePercentage, setPieDataHikePercentage] = useState<{ name: string, value: number }[]>([]);

  const calculateSalaryByHike = () => {
    const hikeAmount = (currentSalary * hikePercentage) / 100;
    setResult(`Your new salary after the hike is: ${Math.round(currentSalary + hikeAmount)}`);
    generateSalaryChart();
    generatePieChartSalaryHike(hikeAmount);
  };

  const calculateHikeBySalary = () => {
    const percentage = ((Number(newSalary) - currentSalary) / currentSalary) * 100;
    setResult(`Your hike percentage is: ${percentage.toFixed(2)}%`);
    generatePieChartHikePercentage();
  };

  const handleCalculate = () => {
    if (currentSalary && hikePercentage && !newSalary) {
      calculateSalaryByHike();
    } else if (currentSalary && newSalary) {
      calculateHikeBySalary();
    }
  };

  const handleClear = () => {
    setCurrentSalary(1000);
    setHikePercentage(10);
    setNewSalary("");
    setResult("");
    setSalaryData([]);
    setPieDataSalaryHike([]);
    setPieDataHikePercentage([]);
  };

  const generateSalaryChart = () => {
    let tempSalaryData = [];
    let tempSalary = currentSalary;
    for (let year = 1; year <= 10; year++) {
      const salaryWithHike = tempSalary + (tempSalary * hikePercentage) / 100;
      tempSalaryData.push({ year, salary: Math.round(salaryWithHike) });
      tempSalary = salaryWithHike;
    }
    setSalaryData(tempSalaryData);
  };

  const generatePieChartSalaryHike = (hikeAmount: number) => {
    const salaryBeforeHike = currentSalary;
    const salaryAfterHike = currentSalary + hikeAmount;

    setPieDataSalaryHike([
      { name: "Salary Before Hike", value: salaryBeforeHike },
      { name: "Salary Hike", value: hikeAmount },
    ]);
  };

  const generatePieChartHikePercentage = () => {
    const oldSalary = currentSalary;
    const newSalaryVal = Number(newSalary);
    const hikeAmount = newSalaryVal - oldSalary;

    setPieDataHikePercentage([
      { name: "Old Salary", value: oldSalary },
      { name: "Hike", value: hikeAmount },
    ]);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">Salary Hike Calculator</h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
          </p>
        </div>
        <div className="p-6 max-w-2xl mx-auto">
          <Tabs defaultValue="salaryByHike" className="w-full">
            <TabsList className="grid w-full md:grid-cols-2 grid-cols-1">
              <TabsTrigger value="salaryByHike">Find salary by hike percentage</TabsTrigger>
              <TabsTrigger value="hikeBySalary">Find hike percentage by salary</TabsTrigger>
            </TabsList>
            <TabsContent value="salaryByHike">
              <div className="space-y-4 md:mt-4 mt-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentSalary">Current Salary :</Label>
                    <Input
                      id="currentSalary"
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hikePercentage">Hike percentage :</Label>
                    <Input
                      id="hikePercentage"
                      type="number"
                      value={hikePercentage}
                      onChange={(e) => setHikePercentage(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleCalculate}>Calculate</Button>
                  <Button variant="outline" onClick={handleClear}>Clear</Button>
                </div>
                {result && <div className="mt-4 p-4 bg-gray-200 rounded">{result}</div>}

                {salaryData.length > 0 && (
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salaryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="salary" stroke="#0D74FF" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Pie Chart for Salary Hike */}
                {pieDataSalaryHike.length > 0 && (
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieDataSalaryHike}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                        >
                          {pieDataSalaryHike.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <PieTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="hikeBySalary">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentSalary2">Current Salary :</Label>
                    <Input
                      id="currentSalary2"
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newSalary">New Salary :</Label>
                    <Input
                      id="newSalary"
                      type="number"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleCalculate}>Calculate</Button>
                  <Button variant="outline" onClick={handleClear}>Clear</Button>
                </div>
                {result && <div className="mt-4 p-4 bg-gray-200 rounded">{result}</div>}

                {/* Pie Chart for Hike Percentage */}
                {pieDataHikePercentage.length > 0 && (
                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieDataHikePercentage}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                        >
                          {pieDataHikePercentage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <PieTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
}
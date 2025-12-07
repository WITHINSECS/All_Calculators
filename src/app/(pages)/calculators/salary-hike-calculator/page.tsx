"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wrapper from "@/app/Wrapper";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";

// Colors for the Pie chart
const PIE_COLORS = ["#0D74FF", "#FF5733"];

type TabType = "salaryByHike" | "hikeBySalary";

export default function SalaryCalculator() {
  // Inputs as strings so they can be empty
  const [currentSalary, setCurrentSalary] = useState<string>("");
  const [hikePercentage, setHikePercentage] = useState<string>("");
  const [newSalary, setNewSalary] = useState<string>("");

  const [result, setResult] = useState("");
  const [salaryData, setSalaryData] = useState<{ year: number; salary: number }[]>([]);

  const [pieDataSalaryHike, setPieDataSalaryHike] = useState<{ name: string; value: number }[]>(
    []
  );
  const [pieDataHikePercentage, setPieDataHikePercentage] = useState<
    { name: string; value: number }[]
  >([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("salaryByHike");

  const salaryNum = Number(currentSalary) || 0;
  const hikeNum = Number(hikePercentage) || 0;
  const newSalaryNum = newSalary === "" ? NaN : Number(newSalary);

  // Generate salary data for the chart (with yearly data)
  const generateSalaryChart = (salary: number, hike: number) => {
    const tempSalaryData: { year: number; salary: number }[] = [];
    let tempSalary = salary;
    for (let year = 1; year <= 10; year++) {
      const salaryWithHike = tempSalary + (tempSalary * hike) / 100;
      tempSalaryData.push({ year, salary: Math.round(salaryWithHike) });
      tempSalary = salaryWithHike; // Update salary for the next year
    }
    setSalaryData(tempSalaryData);
  };

  const generatePieChartSalaryHike = (salary: number, hikeAmount: number) => {
    const salaryBeforeHike = salary;

    setPieDataSalaryHike([
      { name: "Salary Before Hike", value: salaryBeforeHike },
      { name: "Salary Hike", value: hikeAmount },
    ]);
  };

  const generatePieChartHikePercentage = (salary: number, newSal: number) => {
    const hikeAmount = newSal - salary;

    setPieDataHikePercentage([
      { name: "Old Salary", value: salary },
      { name: "Hike", value: hikeAmount },
    ]);
  };

  // Calculate salary by hike %
  const calculateSalaryByHike = () => {
    const hikeAmount = (salaryNum * hikeNum) / 100;
    const newSal = Math.round(salaryNum + hikeAmount);
    setResult(`Your new salary after the hike is: ${newSal}`);
    generateSalaryChart(salaryNum, hikeNum);
    generatePieChartSalaryHike(salaryNum, hikeAmount);
    setPieDataHikePercentage([]);
  };

  // Calculate hike % by salary
  const calculateHikeBySalary = () => {
    const percentage = ((newSalaryNum - salaryNum) / salaryNum) * 100;
    setResult(`Your hike percentage is: ${percentage.toFixed(2)}%`);
    setSalaryData([]);
    setPieDataSalaryHike([]);
    generatePieChartHikePercentage(salaryNum, newSalaryNum);
  };

  const handleCalculate = () => {
    // Validation depending on active tab
    if (salaryNum < 1 || isNaN(salaryNum)) {
      setErrorMessage("Please enter a valid current salary.");
      return;
    }

    if (activeTab === "salaryByHike") {
      if (hikeNum < 1 || isNaN(hikeNum)) {
        setErrorMessage("Please enter a valid hike percentage.");
        return;
      }
      setErrorMessage("");
      calculateSalaryByHike();
    } else {
      // hikeBySalary
      if (isNaN(newSalaryNum) || newSalaryNum <= 0) {
        setErrorMessage("Please enter a valid new salary.");
        return;
      }
      setErrorMessage("");
      calculateHikeBySalary();
    }
  };

  const handleClear = () => {
    setCurrentSalary("");
    setHikePercentage("");
    setNewSalary("");
    setResult("");
    setSalaryData([]);
    setPieDataSalaryHike([]);
    setPieDataHikePercentage([]);
    setErrorMessage("");
  };

  // Input handlers that allow empty string or numeric
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setCurrentSalary(value);
    }
  };

  const handleHikePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setHikePercentage(value);
    }
  };

  const handleNewSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || !isNaN(Number(value))) {
      setNewSalary(value);
    }
  };

  // Disable button based on active tab + values
  let isCalculateDisabled = false;
  if (activeTab === "salaryByHike") {
    isCalculateDisabled = !(salaryNum >= 1 && hikeNum >= 1);
  } else {
    isCalculateDisabled = !(salaryNum >= 1 && newSalaryNum > 0);
  }

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
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as TabType)}
            className="w-full"
          >
            <TabsList className="grid w-full md:grid-cols-2 grid-cols-1">
              <TabsTrigger value="salaryByHike">Find salary by hike percentage</TabsTrigger>
              <TabsTrigger value="hikeBySalary">Find hike percentage by salary</TabsTrigger>
            </TabsList>

            {/* Tab 1: salary by hike percentage */}
            <TabsContent value="salaryByHike">
              <div className="space-y-4 md:mt-4 mt-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentSalary">Current Salary :</Label>
                    <Input
                      id="currentSalary"
                      type="text"
                      value={currentSalary}
                      onChange={handleSalaryChange}
                      placeholder="$"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hikePercentage">Hike percentage :</Label>
                    <Input
                      id="hikePercentage"
                      type="text"
                      value={hikePercentage}
                      onChange={handleHikePercentageChange}
                      placeholder="%"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleCalculate} disabled={isCalculateDisabled}>
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                </div>

                {errorMessage && (
                  <div className="mt-4 p-4 bg-red-300 text-white rounded">
                    {errorMessage}
                  </div>
                )}

                {result && (
                  <div className="mt-4 p-4 bg-gray-200 rounded">
                    {result}
                  </div>
                )}

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
            </TabsContent>

            {/* Tab 2: hike percentage by salary */}
            <TabsContent value="hikeBySalary">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentSalary2">Current Salary :</Label>
                    <Input
                      id="currentSalary2"
                      type="text"
                      value={currentSalary}
                      onChange={handleSalaryChange}
                      placeholder="$"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newSalary">New Salary :</Label>
                    <Input
                      id="newSalary"
                      type="text"
                      value={newSalary}
                      onChange={handleNewSalaryChange}
                      placeholder="$"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleCalculate} disabled={isCalculateDisabled}>
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                </div>

                {errorMessage && (
                  <div className="mt-4 p-4 bg-red-300 text-white rounded">
                    {errorMessage}
                  </div>
                )}

                {result && (
                  <div className="mt-4 p-4 bg-gray-200 rounded">
                    {result}
                  </div>
                )}

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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
}

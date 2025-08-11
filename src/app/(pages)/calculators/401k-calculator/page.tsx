"use client";

import Wrapper from "@/app/Wrapper";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer as PieResponsiveContainer } from "recharts";

// Define the colors for the lines and pie chart
const COLORS = ["#0D74FF", "#FF5733"]; // Blue for employee contribution, Green for employer contribution

const RetirementCalculator = () => {
  // States to hold user input and calculated values
  const [salary, setSalary] = useState<number>(40000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10); // Percentage of salary
  const [salaryIncrease, setSalaryIncrease] = useState<number>(0);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [rateOfReturn, setRateOfReturn] = useState<number>(7);
  const [current401k, setCurrent401k] = useState<number>(0);
  const [employerMatch, setEmployerMatch] = useState<number>(50);
  const [salaryLimit, setSalaryLimit] = useState<number>(6);

  const [estimatedRetirement, setEstimatedRetirement] = useState<number>(0);
  const [employeeContributions, setEmployeeContributions] = useState<number>(0);
  const [employerContributions, setEmployerContributions] = useState<number>(0);

  // Explicitly define the types of employeeData and employerData state
  const [employeeData, setEmployeeData] = useState<{ age: number; savings: number }[]>([]);
  const [employerData, setEmployerData] = useState<{ age: number; savings: number }[]>([]);

  // Function to calculate retirement value with and without employer match
  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    let employeeBalance = current401k;
    let employerBalance = current401k;
    let employeeContributionTotal = 0;
    let employerContributionTotal = 0;

    let salaryAtStart = salary;

    const employeeDataArray: { age: number; savings: number }[] = [];
    const employerDataArray: { age: number; savings: number }[] = [];

    for (let age = currentAge; age <= retirementAge; age++) {
      const employeeContribution = (salaryAtStart * (monthlyContribution / 100)) * 12; // Annual employee contribution
      const employerContribution = (salaryAtStart * (Math.min(salaryLimit, employerMatch) / 100)) * 12; // Annual employer contribution

      employeeBalance += employeeContribution + (employeeBalance * rateOfReturn / 100);
      employerBalance += employerContribution + (employerBalance * rateOfReturn / 100);

      // Accumulate total contributions
      employeeContributionTotal += employeeContribution;
      employerContributionTotal += employerContribution;

      employeeDataArray.push({ age, savings: employeeBalance });
      employerDataArray.push({ age, savings: employerBalance });

      salaryAtStart += salaryAtStart * (salaryIncrease / 100); // Increase salary each year
    }

    setEstimatedRetirement(employeeBalance);
    setEmployeeContributions(employeeContributionTotal);
    setEmployerContributions(employerContributionTotal);

    // Set the data for the graph
    setEmployeeData(employeeDataArray);
    setEmployerData(employerDataArray);
  };

  // Pie chart data for employee and employer contributions
  const pieData = [
    { name: "Employee Contribution", value: employeeContributions },
    { name: "Employer Contribution", value: employerContributions },
  ];

  // Handle input changes and strip any leading zeros or invalid characters
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Only allow numbers and decimal points
    if (value !== "") {
      setter(parseFloat(value));
    } else {
      setter(0); // Set to 0 when input is cleared
    }
  };

  return (
    <Wrapper>
      <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
        <h1 className="text-2xl font-semibold lg:text-4xl">401(k) Retirement Calculator</h1>
        <p className="text-muted-foreground mt-4 text-xl">
          Calculate your future 401(k) balance with and without employer contributions.
        </p>
      </div>

      <div className="md:mb-16 my-6 max-w-5xl mx-auto p-4">
        <div className="flex flex-col gap-6">
          {/* Left Panel for Inputs */}
          <div className="md:w-0%] space-y-6 w-full">
            <div>
              <Label className="black mb-2" htmlFor="salary">
                What is your annual salary?
              </Label>
              <Input
                type="number"
                id="salary"
                value={salary || ""}
                onChange={(e) => handleInputChange(e, setSalary)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="black mb-2" htmlFor="monthlyContribution">
                How much do you contribute each month?
              </Label>
              <div className="flex items-center">
                <Slider
                  value={[monthlyContribution]} // Use an array for Slider
                  onValueChange={(val) => setMonthlyContribution(val[0])} // Handle array value
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={monthlyContribution || ""}
                  onChange={(e) => handleInputChange(e, setMonthlyContribution)}
                  className="w-24 ml-4"
                />
              </div>
            </div>

            <div>
              <Label className="black mb-2" htmlFor="salaryIncrease">
                How much will your salary rise each year?
              </Label>
              <Input
                type="number"
                id="salaryIncrease"
                value={salaryIncrease || ""}
                onChange={(e) => handleInputChange(e, setSalaryIncrease)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="black mb-2" htmlFor="currentAge">
                How old are you?
              </Label>
              <Input
                type="number"
                id="currentAge"
                value={currentAge || ""}
                onChange={(e) => handleInputChange(e, setCurrentAge)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="black mb-2" htmlFor="retirementAge">
                What age do you want to retire at?
              </Label>
              <Input
                type="number"
                id="retirementAge"
                value={retirementAge || ""}
                onChange={(e) => handleInputChange(e, setRetirementAge)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="black mb-2" htmlFor="rateOfReturn">
                What is your expected rate of return?
              </Label>
              <Input
                type="number"
                id="rateOfReturn"
                value={rateOfReturn || ""}
                onChange={(e) => handleInputChange(e, setRateOfReturn)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="black mb-2" htmlFor="current401k">
                Current 401(k) balance
              </Label>
              <Input
                type="number"
                id="current401k"
                value={current401k || ""}
                onChange={(e) => handleInputChange(e, setCurrent401k)}
                className="w-full"
              />
            </div>

            <div>
              <Label className="black mb-2" htmlFor="employerMatch">
                Employer match
              </Label>
              <div className="flex items-center">
                <Slider
                  value={[employerMatch]} // Wrap the value in an array
                  onValueChange={(val) => setEmployerMatch(val[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={employerMatch || ""}
                  onChange={(e) => handleInputChange(e, setEmployerMatch)}
                  className="w-24 ml-4"
                />
              </div>
            </div>

            <div>
              <Label className="black mb-2" htmlFor="salaryLimit">
                Salary limit for employer match
              </Label>
              <div className="flex items-center">
                <Slider
                  value={[salaryLimit]} // Wrap the value in an array
                  onValueChange={(val) => setSalaryLimit(val[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  value={salaryLimit || ""}
                  onChange={(e) => handleInputChange(e, setSalaryLimit)}
                  className="w-24 ml-4"
                />
              </div>
            </div>

            <div className="text-xl">
              <Button className="w-full" onClick={calculateRetirement}>
                Calculate
              </Button>
            </div>
          </div>

          {/* Right Panel for Results and Graph */}
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="text-xl">
              <p>Your estimated retirement: ${estimatedRetirement.toFixed(2)}</p>
            </div>

            <div>
              <p>Total employee contributions: ${employeeContributions.toFixed(2)}</p>
              <p>Total employer contributions: ${employerContributions.toFixed(2)}</p>
            </div>

            {/* Line Chart showing retirement savings */}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={employeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="savings" stroke={COLORS[0]} />
                <Line type="monotone" dataKey="savings" stroke={COLORS[1]} />
              </LineChart>
            </ResponsiveContainer>

            {/* Pie Chart showing breakdown of contributions */}
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default RetirementCalculator;
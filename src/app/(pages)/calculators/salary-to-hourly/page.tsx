"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Wrapper from '@/app/Wrapper';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalaryToHourlyCalculator = () => {
  const [currency, setCurrency] = useState("$");
  const [annualSalary, setAnnualSalary] = useState(1664000);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [tax, setTax] = useState(12);

  const [grossHourlyWage, setGrossHourlyWage] = useState(0);
  const [netHourlyWage, setNetHourlyWage] = useState(0);
  const [grossMonthly, setGrossMonthly] = useState(0);
  const [netMonthly, setNetMonthly] = useState(0);

  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    const totalHours = weeksPerYear * hoursPerWeek;
    const grossHourly = totalHours > 0 ? annualSalary / totalHours : 0;
    const taxMultiplier = (100 - tax) / 100;
    const netHourly = grossHourly * taxMultiplier;

    setGrossHourlyWage(grossHourly);
    setNetHourlyWage(netHourly);
    setGrossMonthly(grossHourly * hoursPerWeek * 4); // Approx. 4 weeks per month
    setNetMonthly(netHourly * hoursPerWeek * 4);

    const taxAmount = annualSalary - annualSalary * taxMultiplier;

    // Pie chart data
    setPieData([
      { name: 'Net Salary', value: annualSalary * taxMultiplier },
      { name: 'Tax Deducted', value: taxAmount },
    ]);
  }, [annualSalary, weeksPerYear, hoursPerWeek, tax]);

  const reset = () => {
    setAnnualSalary(1664000);
    setWeeksPerYear(52);
    setHoursPerWeek(40);
    setTax(12);
  };

  return (
    <Wrapper>
      <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Salary to Hourly Calculator
          </h1>
          <p className="text-muted-foreground mt-4 md:text-lg">
            Calculate your hourly wage from your annual salary based on your work schedule and tax.
          </p>
        </div>
        <div className="max-w-4xl mx-auto p-6 border rounded-lg space-y-6">
          <div>
            <Label className="block mb-1.5">Currency</Label>
            <ToggleGroup type="single" value={currency} onValueChange={(val) => setCurrency(val)}>
              {["$", "€", "£", "₹", "¥"].map((sym) => (
                <ToggleGroupItem key={sym} value={sym} aria-label={sym}>
                  {sym}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <Label className="mb-2">Annual salary</Label>
            <Input
              type="number"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label className="mb-2">Working weeks per year</Label>
            <Input
              type="number"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label className="mb-2">Working hours per week</Label>
            <Input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label className="mb-2">Tax (%)</Label>
            <Input
              type="number"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value))}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Results</h3>
            <div>
              <Label className="mb-1.5">Gross hourly wage</Label>
              <Input type="text" value={`${currency} ${grossHourlyWage.toFixed(2)}`} readOnly />
            </div>

            <div>
              <Label className="mb-1.5">Net hourly wage</Label>
              <Input type="text" value={`${currency} ${netHourlyWage.toFixed(2)}`} readOnly />
            </div>

            <div>
              <Label className="mb-1.5">Gross monthly wage</Label>
              <Input type="text" value={`${currency} ${grossMonthly.toFixed(2)}`} readOnly />
            </div>

            <div>
              <Label className="mb-1.5">Net monthly wage</Label>
              <Input type="text" value={`${currency} ${netMonthly.toFixed(2)}`} readOnly />
            </div>
          </div>

          <Separator />

          {/* Pie Chart */}
          <div className="mt-4">
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#0D74FF" : "#FF5733"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Button variant="outline" onClick={reset}>
              Reload calculator
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SalaryToHourlyCalculator;

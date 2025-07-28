"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Wrapper from '@/app/Wrapper';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalaryCalculator = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [hourlyWage, setHourlyWage] = useState(800);
  const [tax, setTax] = useState(12);

  const [annualIncome, setAnnualIncome] = useState(0);
  const [netHourlyWage, setNetHourlyWage] = useState(0);
  const [netAnnualIncome, setNetAnnualIncome] = useState(0);

  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    const grossAnnual = hoursPerWeek * weeksPerYear * hourlyWage;
    const taxMultiplier = (100 - tax) / 100;
    const netHourly = hourlyWage * taxMultiplier;
    const netAnnual = grossAnnual * taxMultiplier;

    setAnnualIncome(grossAnnual);
    setNetHourlyWage(netHourly);
    setNetAnnualIncome(netAnnual);

    const taxAmount = grossAnnual - netAnnual;

    // Pie chart data
    setPieData([
      { name: 'Net Salary', value: netAnnual },
      { name: 'Tax Deducted', value: taxAmount },
    ]);
  }, [hoursPerWeek, weeksPerYear, hourlyWage, tax]);

  const reset = () => {
    setHoursPerWeek(40);
    setWeeksPerYear(52);
    setHourlyWage(800);
    setTax(12);
  };

  return (
    <Wrapper>
      <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Salary Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your gross and net salary, tax deductions, and other related metrics.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-6 border rounded-lg space-y-6">
          <div>
            <Label className="block mb-1.5">Working hours per week</Label>
            <Input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label className="block mb-1.5">Working weeks per year</Label>
            <Input
              type="number"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label className="block mb-1.5">Hourly wage</Label>
            <Input
              type="number"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(parseFloat(e.target.value))}
            />
          </div>

          <Separator />

          <div>
            <Label className="block mb-1.5">Tax (%)</Label>
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
              <Label className="block mb-1.5">Annual Income (Gross)</Label>
              <Input type="text" value={`${annualIncome.toLocaleString()}`} readOnly />
            </div>

            <div>
              <Label className="block mb-1.5">Net Hourly Wage</Label>
              <Input type="text" value={`${netHourlyWage.toFixed(2)}`} readOnly />
            </div>

            <div>
              <Label className="block mb-1.5">Net Annual Income</Label>
              <Input type="text" value={`${netAnnualIncome.toLocaleString()}`} readOnly />
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

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={reset}>
              Reload calculator
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SalaryCalculator;
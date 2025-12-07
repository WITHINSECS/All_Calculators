"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";
import { toast } from "react-toastify";
import { addDays, format } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Types
type Cycle = {
  periodStart: string;
  ovulationWindow: string;
  dueDate: string;
};

type OvulationResults = {
  ovulationWindow: string;
  mostProbableOvulationDate: string;
  intercourseWindow: string;
  pregnancyTestDate: string;
  nextPeriodStart: string;
  dueDateIfPregnant: string;
  cycleDates: Cycle[];
};

type ChartPoint = {
  cycle: number;
  periodStartDay: number;
  ovulationDay: number;
  dueDateDay: number;
};

export default function OvulationCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<string>("");
  const [results, setResults] = useState<OvulationResults | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const calculateOvulation = () => {
    if (!lastPeriodDate) {
      toast.error("Please enter the date when your last period started.");
      return;
    }

    if (!cycleLength.trim()) {
      toast.error("Please enter your average cycle length.");
      return;
    }

    const cycleNum = Number(cycleLength);
    if (!Number.isFinite(cycleNum) || cycleNum <= 0) {
      toast.error("Cycle length must be a number greater than 0.");
      return;
    }

    const lastPeriod = new Date(lastPeriodDate);
    if (isNaN(lastPeriod.getTime())) {
      toast.error("Please enter a valid date.");
      return;
    }

    // Most probable ovulation date = LMP + (cycleLength - 14)
    const ovulationDate = addDays(lastPeriod, cycleNum - 14);
    const ovulationStart = addDays(ovulationDate, -4);
    const ovulationEnd = addDays(ovulationDate, 1);

    const nextPeriodStart = addDays(lastPeriod, cycleNum);
    const pregnancyTestDate = addDays(ovulationEnd, 7);
    const dueDateIfPregnant = addDays(lastPeriod, 280);

    const formattedResults: OvulationResults = {
      ovulationWindow: `${format(ovulationStart, "MMM dd")} - ${format(
        ovulationEnd,
        "MMM dd"
      )}`,
      mostProbableOvulationDate: format(ovulationDate, "MMM dd, yyyy"),
      intercourseWindow: `${format(ovulationStart, "MMM dd")} - ${format(
        ovulationEnd,
        "MMM dd"
      )}`,
      pregnancyTestDate: format(pregnancyTestDate, "MMM dd, yyyy"),
      nextPeriodStart: format(nextPeriodStart, "MMM dd, yyyy"),
      dueDateIfPregnant: format(dueDateIfPregnant, "MMM dd, yyyy"),
      cycleDates: [],
    };

    const newChartData: ChartPoint[] = [];
    const baseMs = lastPeriod.getTime();
    const dayMs = 1000 * 60 * 60 * 24;

    // Next 6 cycles
    for (let i = 1; i <= 6; i++) {
      const cycleStart = addDays(lastPeriod, cycleNum * i);
      const ovulationThisCycle = addDays(cycleStart, cycleNum - 14);
      const ovulationEndCycle = addDays(ovulationThisCycle, 1);
      const dueDateCycle = addDays(cycleStart, 280);

      formattedResults.cycleDates.push({
        periodStart: format(cycleStart, "MMM dd, yyyy"),
        ovulationWindow: `${format(ovulationThisCycle, "MMM dd")} - ${format(
          ovulationEndCycle,
          "MMM dd"
        )}`,
        dueDate: format(dueDateCycle, "MMM dd, yyyy"),
      });

      newChartData.push({
        cycle: i,
        periodStartDay: Math.round(
          (cycleStart.getTime() - baseMs) / dayMs
        ),
        ovulationDay: Math.round(
          (ovulationThisCycle.getTime() - baseMs) / dayMs
        ),
        dueDateDay: Math.round(
          (dueDateCycle.getTime() - baseMs) / dayMs
        ),
      });
    }

    setResults(formattedResults);
    setChartData(newChartData);
  };

  const resetForm = () => {
    setLastPeriodDate("");
    setCycleLength("");
    setResults(null);
    setChartData([]);
  };

  // Pie chart (simple breakdown of fertile vs non-fertile days in a 28-day cycle as example)
  const pieData = [
    { name: "Fertile window (~6 days)", value: 6 },
    { name: "Other days", value: 22 },
  ];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Ovulation Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Estimate your ovulation window and key dates in your cycle.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="lastPeriodDate">
                  First day of your last period
                </Label>
                <Input
                  id="lastPeriodDate"
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <Label className="block mb-1.5" htmlFor="cycleLength">
                  Cycle length (days)
                </Label>
                <Input
                  id="cycleLength"
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  placeholder="e.g. 28"
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col justify-center mt-4 gap-3">
                <Button className="w-full" onClick={calculateOvulation}>
                  Calculate
                </Button>
                <Button className="w-full" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="mt-8 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Important dates for this cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Date / Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">Ovulation window</td>
                        <td className="border p-2">{results.ovulationWindow}</td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          Most probable ovulation date
                        </td>
                        <td className="border p-2">
                          {results.mostProbableOvulationDate}
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">Recommended intercourse window</td>
                        <td className="border p-2">{results.intercourseWindow}</td>
                      </tr>
                      <tr>
                        <td className="border p-2">Earliest pregnancy test date</td>
                        <td className="border p-2">{results.pregnancyTestDate}</td>
                      </tr>
                      <tr>
                        <td className="border p-2">Next period expected</td>
                        <td className="border p-2">{results.nextPeriodStart}</td>
                      </tr>
                      <tr>
                        <td className="border p-2">Due date if pregnant</td>
                        <td className="border p-2">{results.dueDateIfPregnant}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pie chart: fertile vs non-fertile days */}
            <Card>
              <CardHeader>
                <CardTitle>Cycle overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      <Cell fill="#82ca9d" />
                      <Cell fill="#ff7300" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Line chart: key days (relative) across next 6 cycles */}
            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Next 6 cycles (days since last period)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cycle" />
                      <YAxis
                        tickFormatter={(v: number) => `${v}d`}
                      />
                      <Tooltip
                        formatter={(v: number) => `${v} days`}
                        labelFormatter={(label) => `Cycle ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="periodStartDay"
                        name="Period start"
                        stroke="#8884d8"
                      />
                      <Line
                        type="monotone"
                        dataKey="ovulationDay"
                        name="Ovulation"
                        stroke="#82ca9d"
                      />
                      <Line
                        type="monotone"
                        dataKey="dueDateDay"
                        name="Due date (if pregnant)"
                        stroke="#ff7300"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

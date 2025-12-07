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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as LineTooltip,
  Legend as LineLegend,
  ResponsiveContainer as LineResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";

interface VO2MaxResult {
  vo2Max: number;
  performance: string;
}

type Gender = "Male" | "Female";

const calculateVO2Max = (
  weight: number,
  gender: Gender,
  age: number,
  time: number,
  heartRate: number
) => {
  // weight in lbs per original formula
  const genderValue = gender === "Male" ? 1 : 0;

  const vo2Max =
    (132.853 -
      0.0769 * weight -
      0.3877 * age +
      6.315 * genderValue -
      3.2649 * time -
      0.1565 * heartRate) /
    (weight * 0.453592); // divide by kg to get ml/kg/min

  return vo2Max;
};

const VO2MaxCalculator = () => {
  const [gender, setGender] = useState<Gender>("Male");
  // use strings so inputs can be truly empty
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [result, setResult] = useState<VO2MaxResult | null>(null);

  const handleCalculate = () => {
    if (!age.trim() || !weight.trim() || !time.trim() || !heartRate.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }

    const ageNum = Number(age);
    const weightNum = Number(weight);
    const timeNum = Number(time);
    const heartRateNum = Number(heartRate);

    if (!Number.isFinite(ageNum) || ageNum <= 0) {
      toast.error("Please enter a valid age.");
      return;
    }
    if (!Number.isFinite(weightNum) || weightNum <= 0) {
      toast.error("Please enter a valid weight.");
      return;
    }
    if (!Number.isFinite(timeNum) || timeNum <= 0) {
      toast.error("Please enter a valid time.");
      return;
    }
    if (!Number.isFinite(heartRateNum) || heartRateNum <= 0) {
      toast.error("Please enter a valid heart rate.");
      return;
    }

    const vo2Max = calculateVO2Max(weightNum, gender, ageNum, timeNum, heartRateNum);

    let performance = "";
    if (vo2Max > 50) performance = "Excellent";
    else if (vo2Max > 40) performance = "Good";
    else if (vo2Max > 30) performance = "Average";
    else if (vo2Max > 20) performance = "Below Average";
    else performance = "Poor";

    setResult({ vo2Max, performance });
  };

  // Only build chart data once we actually have a result
  const pieData =
    result !== null
      ? [
          { name: "Excellent", value: result.vo2Max > 50 ? 1 : 0 },
          { name: "Good", value: result.vo2Max > 40 && result.vo2Max <= 50 ? 1 : 0 },
          { name: "Average", value: result.vo2Max > 30 && result.vo2Max <= 40 ? 1 : 0 },
          { name: "Below Average", value: result.vo2Max > 20 && result.vo2Max <= 30 ? 1 : 0 },
          { name: "Poor", value: result.vo2Max <= 20 ? 1 : 0 },
        ]
      : [];

  const lineChartData =
    result !== null
      ? [
          { time: 0, vo2Max: result.vo2Max },
          { time: 1, vo2Max: result.vo2Max * 1.05 },
          { time: 2, vo2Max: result.vo2Max * 1.1 },
          { time: 3, vo2Max: result.vo2Max * 1.15 },
          { time: 4, vo2Max: result.vo2Max * 1.2 },
        ]
      : [];

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
        <div className="mx-auto max-w-3xl text-center mb-8">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            VO2 Max Calculator
          </h1>
          <p className="text-muted-foreground mt-4 text-xl">
            Calculate your VO2 Max based on your 1-mile walk performance.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:gap-10 md:grid-cols-2 gap-4">
              <div>
                <Label className="block mb-1.5" htmlFor="gender">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="age">
                  Age (years)
                </Label>
                <Input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full"
                  placeholder="e.g. 30"
                />
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="weight">
                  Weight (lbs)
                </Label>
                <Input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full"
                  placeholder="e.g. 155"
                />
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="time">
                  Duration of 1 Mile Walk (minutes)
                </Label>
                <Input
                  type="number"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                  placeholder="e.g. 15"
                />
              </div>

              <div>
                <Label className="block mb-1.5" htmlFor="heartRate">
                  Heart Rate (bpm)
                </Label>
                <Input
                  type="number"
                  id="heartRate"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full"
                  placeholder="e.g. 130"
                />
              </div>
            </div>

            <Button onClick={handleCalculate} className="mt-4 p-5 w-full">
              Calculate VO2 Max
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Your VO2 Max Result</h2>
            <div className="text-lg mb-4">
              <p>VO2 Max: {result.vo2Max.toFixed(2)} ml/kg/min</p>
              <p>Performance: {result.performance}</p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell key="cell1" fill="#82ca9d" />
                    <Cell key="cell2" fill="#ff8042" />
                    <Cell key="cell3" fill="#ffbf00" />
                    <Cell key="cell4" fill="#ff7f00" />
                    <Cell key="cell5" fill="#ff0000" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="h-72 mt-6">
              <LineResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="vo2Max" stroke="#8884d8" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <LineTooltip />
                  <LineLegend />
                </LineChart>
              </LineResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default VO2MaxCalculator;

"use client";
import Wrapper from "@/app/Wrapper";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#000", "#808080"];

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);

export default function Page() {
  // Raw input strings (can be empty) — so inputs can show "" and not auto-coerce
  const [loanAmountInput, setLoanAmountInput] = useState<string>("");
  const [interestRateInput, setInterestRateInput] = useState<string>("");
  const [loanTenureInput, setLoanTenureInput] = useState<string>("");

  // Slider numeric states (decoupled but kept in sync when user slides)
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [loanTenure, setLoanTenure] = useState<number>(0);

  // Computed results are only available after clicking Calculate
  const [results, setResults] = useState<
    | null
    | {
        monthlyEMI: number;
        totalInterest: number;
        totalAmountPayable: number;
      }
  >(null);

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLoanAmountInput(v);
    if (v === "") {
      setLoanAmount(0);
      return;
    }
    const parsed = Number(v);
    if (!Number.isNaN(parsed)) setLoanAmount(parsed);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInterestRateInput(v);
    if (v === "") {
      setInterestRate(0);
      return;
    }
    const parsed = Number(v);
    if (!Number.isNaN(parsed)) setInterestRate(parsed);
  };

  const handleLoanTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLoanTenureInput(v);
    if (v === "") {
      setLoanTenure(0);
      return;
    }
    const parsed = Number(v);
    if (!Number.isNaN(parsed)) setLoanTenure(parsed);
  };

  const onCalculate = () => {
    // Validate empties first (so default can truly be empty)
    if (loanAmountInput === "" || interestRateInput === "" || loanTenureInput === "") {
      toast.error("Please fill all fields before calculating.");
      return;
    }

    const P = Number(loanAmountInput);
    const r = Number(interestRateInput);
    const years = Number(loanTenureInput);

    if (!Number.isFinite(P) || P <= 0) {
      toast.error("Loan amount must be a number greater than 0.");
      return;
    }
    if (!Number.isFinite(r) || r < 0) {
      toast.error("Interest rate cannot be negative.");
      return;
    }
    if (!Number.isFinite(years) || years <= 0) {
      toast.error("Loan tenure (years) must be greater than 0.");
      return;
    }

    const n = Math.round(years * 12); // number of monthly payments
    const monthlyRate = r / 100 / 12;

    let monthlyEMI: number;
    if (monthlyRate === 0) {
      // Zero-interest loan
      monthlyEMI = P / n;
    } else {
      const pow = Math.pow(1 + monthlyRate, n);
      monthlyEMI = (P * monthlyRate * pow) / (pow - 1);
    }

    const totalAmountPayable = monthlyEMI * n;
    const totalInterest = totalAmountPayable - P;

    setResults({ monthlyEMI, totalInterest, totalAmountPayable });
  };

  const chartData = results
    ? [
        { name: "Principal amount", value: Number(loanAmountInput) || 0 },
        { name: "Interest amount", value: results.totalInterest || 0 },
      ]
    : [];

  return (
    <Wrapper>
      <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
        <h1 className="text-2xl font-semibold lg:text-4xl">Car Loan EMI Calculator</h1>
        <p className="text-muted-foreground mt-4 text-xl">
          Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
        </p>
      </div>

      <div className="lg:grid-cols-2 max-w-5xl md:mb-20 mb-10 mt-6 w-full mx-auto grid-cols-1 grid gap-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loan Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loan Amount */}
            <div className="space-y-2">
              <Label>Loan amount</Label>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold">
                  {loanAmountInput === "" ? "—" : formatINR(Number(loanAmountInput))}
                </p>
                <input
                  type="number"
                  inputMode="decimal"
                  value={loanAmountInput}
                  onChange={handleLoanAmountChange}
                  className="w-1/3 border p-2 rounded-md"
                  placeholder="e.g. 1000000"
                />
              </div>
              <Slider
                value={[loanAmount]}
                onValueChange={(value) => {
                  const num = value[0] ?? 0;
                  setLoanAmount(num);
                  setLoanAmountInput(String(num));
                }}
                max={2000000}
                step={1000}
                min={0} // allow 0 — won't auto-jump to 1
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <Label>Rate of interest (p.a)</Label>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold">
                  {interestRateInput === "" ? "—" : `${interestRateInput}%`}
                </p>
                <input
                  type="number"
                  inputMode="decimal"
                  value={interestRateInput}
                  onChange={handleInterestRateChange}
                  className="w-1/3 border p-2 rounded-md"
                  placeholder="e.g. 6.5"
                />
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => {
                  const num = value[0] ?? 0;
                  setInterestRate(num);
                  setInterestRateInput(String(num));
                }}
                max={15}
                step={0.1}
                min={0} // allow 0% without snapping to 1
              />
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
              <Label>Loan tenure (years)</Label>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold">
                  {loanTenureInput === "" ? "—" : `${loanTenureInput} Yr`}
                </p>
                <input
                  type="number"
                  inputMode="numeric"
                  value={loanTenureInput}
                  onChange={handleLoanTenureChange}
                  className="w-1/3 border p-2 rounded-md"
                  placeholder="e.g. 5"
                />
              </div>
              <Slider
                value={[loanTenure]}
                onValueChange={(value) => {
                  const num = value[0] ?? 0;
                  setLoanTenure(num);
                  setLoanTenureInput(String(num));
                }}
                max={10}
                step={1}
                min={0} // allow 0 on the control; validation happens on Calculate
              />
            </div>

            <p>
              You can view results after clicking <b>Calculate</b>. Inputs support empty values
              until you decide to compute. If something is missing or invalid, youll see an
              error via toast.
            </p>

            <div className="pt-2">
              <Button onClick={onCalculate} className="w-full md:w-auto">Calculate</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loan Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        labelLine={true}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4 grid grid-cols-2 gap-5 mt-10">
                  <div className="space-y-2">
                    <Label>Monthly EMI</Label>
                    <p className="text-lg font-semibold">{formatINR(results.monthlyEMI)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Principal amount</Label>
                    <p className="text-lg font-semibold">
                      {formatINR(Number(loanAmountInput) || 0)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Total interest</Label>
                    <p className="text-lg font-semibold">{formatINR(results.totalInterest)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Total amount</Label>
                    <p className="text-lg font-semibold">{formatINR(results.totalAmountPayable)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-16">
                Enter values and click <b>Calculate</b> to see the breakdown.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
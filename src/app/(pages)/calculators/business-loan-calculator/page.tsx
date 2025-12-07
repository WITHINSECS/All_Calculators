"use client";
import Wrapper from "@/app/Wrapper";
import { JSX, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

// ---------------- Types ----------------
type Currency = "USD" | "PKR" | "INR";

type Compound = "monthly" | "quarterly" | "annually";

type Payback = "monthly" | "biweekly" | "weekly";

// ---------------- Utils ----------------
const CURRENCY_SYMBOL: Record<Currency, string> = { USD: "$", PKR: "₨", INR: "₹" };

const fmt = (n: number, cur: Currency): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

const periodsPerYear = (p: Payback): number =>
  p === "weekly" ? 52 : p === "biweekly" ? 26 : 12;

const compPerYear = (c: Compound): number =>
  c === "monthly" ? 12 : c === "quarterly" ? 4 : 1;

// Convert nominal APR with a comp frequency -> effective per-payment rate
const perPaymentRate = (aprPct: number, compound: Compound, payback: Payback): number => {
  const m = compPerYear(compound);
  const k = periodsPerYear(payback);
  const apr = aprPct / 100;
  const effAnnual = Math.pow(1 + apr / m, m) - 1; // effective annual rate
  return Math.pow(1 + effAnnual, 1 / k) - 1; // per-payment effective rate
};

// Standard amortization payment
const pmt = (principal: number, r: number, n: number): number => {
  if (n <= 0) return NaN;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return (principal * r * pow) / (pow - 1);
};

// IRR per period via binary search (for effective APR with fees)
const irrPerPeriod = (netProceeds: number, payment: number, n: number): number | null => {
  if (payment <= 0 || netProceeds <= 0 || n <= 0) return null;
  let lo = 0,
    hi = 1; // 0%..100% per period
  for (let iter = 0; iter < 80; iter++) {
    const mid = (lo + hi) / 2;
    const pow = Math.pow(1 + mid, n);
    const pvPayments = (payment * (1 - 1 / pow)) / mid;
    if (!Number.isFinite(pvPayments)) return null;
    if (pvPayments > netProceeds) {
      // discount rate too low -> increase
      lo = mid;
    } else {
      hi = mid;
    }
    if (Math.abs(hi - lo) < 1e-12) break;
  }
  return (lo + hi) / 2;
};

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--destructive))",
];

// ---------------- Page -----------------
export default function BusinessLoanCalculator(): JSX.Element {
  // Currency
  const [currency, setCurrency] = useState<Currency>("USD");

  // Inputs (stored as strings so fields can be blank)
  const [amountInput, setAmountInput] = useState<string>("");
  const [rateInput, setRateInput] = useState<string>(""); // APR %
  const [compound, setCompound] = useState<Compound>("monthly");

  const [yearsInput, setYearsInput] = useState<string>("");
  const [monthsInput, setMonthsInput] = useState<string>("");
  const [payback, setPayback] = useState<Payback>("monthly");

  // Fees – now empty by default (no "0" showing)
  const [originationPct, setOriginationPct] = useState<string>("");
  const [docFeeInput, setDocFeeInput] = useState<string>("");
  const [otherFeeInput, setOtherFeeInput] = useState<string>("");

  const [results, setResults] = useState<
    | null
    | {
        paymentEach: number;
        totalPayments: number;
        interestOnly: number;
        upfrontFees: number;
        interestPlusFees: number;
        realAPR: number | null; // annualized %
        breakdown: Array<{ name: string; value: number }>;
      }
  >(null);

  const validate = () => {
    if (amountInput === "" || rateInput === "" || (yearsInput === "" && monthsInput === "")) {
      toast.error("Please enter loan amount, interest rate, and term.");
      return null;
    }
    const A = Number(amountInput);
    const rPct = Number(rateInput);
    const yrs = Number(yearsInput || 0);
    const mos = Number(monthsInput || 0);
    const org = Number(originationPct || 0);
    const doc = Number(docFeeInput || 0);
    const oth = Number(otherFeeInput || 0);

    if (!Number.isFinite(A) || A <= 0) {
      toast.error("Loan amount must be greater than 0.");
      return null;
    }
    if (!Number.isFinite(rPct) || rPct < 0) {
      toast.error("Interest rate cannot be negative.");
      return null;
    }
    if (!Number.isFinite(yrs) || !Number.isFinite(mos) || (yrs <= 0 && mos <= 0)) {
      toast.error("Loan term must be greater than 0.");
      return null;
    }
    if (org < 0 || doc < 0 || oth < 0) {
      toast.error("Fees cannot be negative.");
      return null;
    }

    return { A, rPct, yrs, mos, org, doc, oth } as const;
  };

  const onCalculate = (): void => {
    const v = validate();
    if (!v) return;
    const { A, rPct, yrs, mos, org, doc, oth } = v;

    const k = periodsPerYear(payback);
    const n = Math.round((yrs + mos / 12) * k);
    if (n <= 0) {
      toast.error("Loan term is too short for the selected payback.");
      return;
    }

    const rPer = perPaymentRate(rPct, compound, payback);
    const payment = pmt(A, rPer, n);
    if (!Number.isFinite(payment)) {
      toast.error("Payment computation failed. Check inputs.");
      return;
    }

    const totalPaid = payment * n;
    const interest = Math.max(0, totalPaid - A);
    const fees = (org / 100) * A + doc + oth;
    const interestPlusFees = interest + fees;

    // APR including fees: treat fees as deducted at origination (net proceeds smaller)
    const netProceeds = Math.max(1e-9, A - fees);
    const iPer = irrPerPeriod(netProceeds, payment, n);
    const realAPR = iPer != null ? (Math.pow(1 + iPer, k) - 1) * 100 : null;

    const breakdown = [
      { name: "Principal", value: A },
      { name: "Interest", value: interest },
      { name: "Fees", value: fees },
    ];

    setResults({
      paymentEach: payment,
      totalPayments: totalPaid,
      interestOnly: interest,
      upfrontFees: fees,
      interestPlusFees,
      realAPR,
      breakdown,
    });
  };

  const onClear = (): void => {
    setAmountInput("");
    setRateInput("");
    setYearsInput("");
    setMonthsInput("");
    setOriginationPct("");
    setDocFeeInput("");
    setOtherFeeInput("");
    setResults(null);
  };

  return (
    <Wrapper>
      <div className="mx-auto md:mt-16 p-5 mt-8 max-w-6xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">
            Business Loan Calculator
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Clean design with pie breakdown of principal, interest, and fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:mb-20 mb-10">
          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Currency + Amount */}
              <div className="space-y-2">
                <Label>Loan amount</Label>
                <div className="flex items-center gap-3">
                  <Select
                    value={currency}
                    onValueChange={(v: Currency) => setCurrency(v)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD $</SelectItem>
                      <SelectItem value="PKR">PKR ₨</SelectItem>
                      <SelectItem value="INR">INR ₹</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="e.g. 10000"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Rate + Compound */}
              <div className="space-y-2">
                <Label>Interest rate (APR)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                  />
                  <div className="px-3 py-2 rounded-md border text-sm">%</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Compound</Label>
                <Select
                  value={compound}
                  onValueChange={(v: Compound) => setCompound(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly (APR)</SelectItem>
                    <SelectItem value="quarterly">Quarterly (APR)</SelectItem>
                    <SelectItem value="annually">Annually (APR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Term */}
              <div className="space-y-2">
                <Label>Loan term</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="years"
                      value={yearsInput}
                      onChange={(e) => setYearsInput(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="months"
                      value={monthsInput}
                      onChange={(e) => setMonthsInput(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">months</span>
                  </div>
                </div>
              </div>

              {/* Payback */}
              <div className="space-y-2">
                <Label>Pay back</Label>
                <Select
                  value={payback}
                  onValueChange={(v: Payback) => setPayback(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Every Month</SelectItem>
                    <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                    <SelectItem value="weekly">Every Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fees */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Origination fee</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={originationPct}
                      onChange={(e) => setOriginationPct(e.target.value)}
                      placeholder="e.g. 2"
                    />
                    <div className="px-3 py-2 rounded-md border text-sm">%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Documentation fee</Label>
                  <Input
                    type="number"
                    value={docFeeInput}
                    onChange={(e) => setDocFeeInput(e.target.value)}
                    placeholder="e.g. 200"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Other fees</Label>
                  <Input
                    type="number"
                    value={otherFeeInput}
                    onChange={(e) => setOtherFeeInput(e.target.value)}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={onCalculate}>Calculate</Button>
                <Button variant="secondary" onClick={onClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {results ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <KPI
                      label={`Payback every ${
                        payback === "monthly"
                          ? "month"
                          : payback === "biweekly"
                          ? "2 weeks"
                          : "week"
                      }`}
                      value={fmt(results.paymentEach, currency)}
                    />
                    <KPI
                      label={`Total of ${Math.round(
                        (Number(yearsInput || 0) +
                          Number(monthsInput || 0) / 12) *
                          periodsPerYear(payback)
                      )} payments`}
                      value={fmt(results.totalPayments, currency)}
                    />
                    <KPI
                      label="Interest"
                      value={fmt(results.interestOnly, currency)}
                    />
                    <KPI
                      label="Interest + fees"
                      value={fmt(results.interestPlusFees, currency)}
                    />
                    <KPI
                      label="Real rate (APR)"
                      value={
                        results.realAPR != null
                          ? `${results.realAPR.toFixed(3)}%`
                          : "—"
                      }
                    />
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={results.breakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                        >
                          {results.breakdown.map((_, i) => (
                            <Cell
                              key={i}
                              fill={CHART_COLORS[i % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip
                          formatter={(v: number | string) =>
                            typeof v === "number"
                              ? fmt(v, currency)
                              : String(v)
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Upfront fees</TableCell>
                          <TableCell className="text-right">
                            {fmt(results.upfrontFees, currency)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total interest</TableCell>
                          <TableCell className="text-right">
                            {fmt(results.interestOnly, currency)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total paid</TableCell>
                          <TableCell className="text-right">
                            {fmt(results.totalPayments, currency)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-16">
                  Enter the loan details and click <b>Calculate</b> to see
                  payments and APR.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

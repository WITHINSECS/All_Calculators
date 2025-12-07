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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Label } from "@/components/ui/label";
import Wrapper from "@/app/Wrapper";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as PieTooltip,
    ResponsiveContainer as PieResponsiveContainer,
} from "recharts";

interface LoanInput {
    loanAmount: number;
    loanTerm: number; // months
    vehicleType: "new" | "used";
    interestRate: number;
}

interface LoanResult {
    monthlyPayment: number;
    totalPrincipal: number;
    totalInterest: number;
    amortizationSchedule: {
        month: number;
        interest: number;
        principal: number;
        balance: number;
    }[];
}

// UI state for the form so inputs can be empty
interface LoanFormState {
    loanAmount: string;
    interestRate: string;
    loanTerm: string; // months as string (for Select)
    vehicleType: "new" | "used";
}

const calculateLoan = (input: LoanInput): LoanResult => {
    const monthlyInterestRate = input.interestRate / 100 / 12;
    const totalMonths = input.loanTerm;

    const monthlyPayment =
        (input.loanAmount * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -totalMonths));

    let balance = input.loanAmount;
    const amortizationSchedule: LoanResult["amortizationSchedule"] = [];

    for (let month = 1; month <= totalMonths; month++) {
        const interest = balance * monthlyInterestRate;
        const principal = monthlyPayment - interest;
        balance -= principal;
        if (balance < 0) balance = 0;

        amortizationSchedule.push({ month, interest, principal, balance });
    }

    return {
        monthlyPayment,
        totalPrincipal: input.loanAmount,
        totalInterest: monthlyPayment * totalMonths - input.loanAmount,
        amortizationSchedule,
    };
};

export default function Page() {
    // Text inputs empty by default; selects have defaults
    const [form, setForm] = useState<LoanFormState>({
        loanAmount: "",
        interestRate: "",
        loanTerm: "60",
        vehicleType: "used",
    });

    const [result, setResult] = useState<LoanResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value, // keep as string so it can be ""
        }));
    };

    const handleSelectChange = <K extends keyof LoanFormState>(
        name: K,
        value: LoanFormState[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCalculate = () => {
        const loanAmount = Number(form.loanAmount) || 0;
        const interestRate = Number(form.interestRate) || 0;
        const loanTerm = Number(form.loanTerm) || 0;
        const vehicleType = form.vehicleType as "new" | "used";

        if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
            setResult(null);
            return;
        }

        const calcResult = calculateLoan({
            loanAmount,
            loanTerm,
            interestRate,
            vehicleType,
        });

        setResult(calcResult);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Auto Loan Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Loan Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Loan Amount</Label>
                                    <Input
                                        className="mt-2 mb-3"
                                        name="loanAmount"
                                        value={form.loanAmount}
                                        onChange={handleChange}
                                        placeholder="$"
                                    />
                                </div>
                                <div>
                                    <Label className="block mb-2">Loan Term</Label>
                                    <Select
                                        value={form.loanTerm}
                                        onValueChange={(value) =>
                                            handleSelectChange("loanTerm", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select term" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="60">60 Months</SelectItem>
                                            <SelectItem value="48">48 Months</SelectItem>
                                            <SelectItem value="36">36 Months</SelectItem>
                                            <SelectItem value="72">72 Months</SelectItem>
                                            <SelectItem value="84">84 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="block mb-2">
                                        Is your vehicle new or used?
                                    </Label>
                                    <Select
                                        value={form.vehicleType}
                                        onValueChange={(value) =>
                                            handleSelectChange("vehicleType", value as "new" | "used")
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="used">Used</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Interest rate (%)</Label>
                                    <Input
                                        className="mt-2 mb-3"
                                        name="interestRate"
                                        value={form.interestRate}
                                        onChange={handleChange}
                                        placeholder="e.g. 3"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button className="w-full p-5" onClick={handleCalculate}>
                                    Calculate
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p>Your estimated monthly payment</p>
                                <h2 className="text-4xl font-bold">
                                    {result
                                        ? `$${result.monthlyPayment.toFixed(2)}`
                                        : "-"}
                                </h2>
                            </div>
                            <div>
                                <p>Total Principal Paid</p>
                                <p>
                                    {result
                                        ? `$${result.totalPrincipal.toFixed(2)}`
                                        : "-"}
                                </p>
                                <p>Total Interest Paid</p>
                                <p>
                                    {result
                                        ? `$${result.totalInterest.toFixed(2)}`
                                        : "-"}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button variant="link">Compare Loan Rates</Button>
                            <Button variant="link">See amortization schedule</Button>
                        </div>

                        {/* Pie Chart for Principal vs Interest */}
                        <div className="mt-4 flex justify-center">
                            <PieResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={
                                            result
                                                ? [
                                                    {
                                                        name: "Principal",
                                                        value: result.totalPrincipal,
                                                    },
                                                    {
                                                        name: "Interest",
                                                        value: result.totalInterest,
                                                    },
                                                ]
                                                : []
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        <Cell fill="#3498db" />
                                        <Cell fill="#e74c3c" />
                                    </Pie>
                                    <PieTooltip />
                                </PieChart>
                            </PieResponsiveContainer>
                        </div>

                        {/* Line Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={result?.amortizationSchedule || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#3498db"
                                    name="Balance"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="interest"
                                    stroke="#2ecc71"
                                    name="Interest"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="principal"
                                    stroke="#e74c3c"
                                    name="Principal"
                                />
                            </LineChart>
                        </ResponsiveContainer>

                        {/* Amortization Schedule Table */}
                        <div className="mt-4">
                            <h4>Amortization Schedule</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Interest</TableHead>
                                        <TableHead>Principal</TableHead>
                                        <TableHead>Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result?.amortizationSchedule.map((item) => (
                                        <TableRow key={item.month}>
                                            <TableCell>{item.month}</TableCell>
                                            <TableCell>
                                                ${item.interest.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                ${item.principal.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                ${item.balance.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    )) || null}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}

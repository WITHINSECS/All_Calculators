'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
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
import Wrapper from '@/app/Wrapper';

interface LoanInput {
    loanAmount: number;
    loanTerm: number;
    vehicleType: 'new' | 'used';
    interestRate: number;
}

interface LoanResult {
    monthlyPayment: number;
    totalPrincipal: number;
    totalInterest: number;
    amortizationSchedule: { month: number; interest: number; principal: number; balance: number }[];
}

const calculateLoan = (input: LoanInput): LoanResult => {
    const monthlyInterestRate = input.interestRate / 100 / 12;
    const totalMonths = input.loanTerm;
    const monthlyPayment = (input.loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalMonths));
    let balance = input.loanAmount;
    const amortizationSchedule = [];

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
    const [input, setInput] = useState<LoanInput>({
        loanAmount: 15000,
        loanTerm: 60,
        vehicleType: 'used',
        interestRate: 3,
    });
    const [result, setResult] = useState<LoanResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleCalculate = () => {
        const calcResult = calculateLoan(input);
        setResult(calcResult);
    };

    return (
        <Wrapper>
            <div className="container  mx-auto p-5 lg:px-12 md:my-14 my-8">

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
                            <div>
                                <Label>How much are you looking to borrow?</Label>
                                <Input className='mt-2 mb-3' name="loanAmount" value={input.loanAmount} onChange={handleChange} />
                            </div>
                            <div>
                                <Label className='block mb-2'>For how long?</Label>
                                <Select onValueChange={(value) => handleSelectChange('loanTerm', value)} defaultValue="60">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="60">60 Months</SelectItem>
                                        <SelectItem value="48">48 Months</SelectItem>
                                        <SelectItem value="36">36 Months</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className='block mb-2'>Is your vehicle new or used?</Label>
                                <Select onValueChange={(value) => handleSelectChange('vehicleType', value)} defaultValue="used">
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
                                <Label>Interest rate</Label>
                                <div className="flex mt-2 mb-3 space-x-2">
                                    <Input className='' name="interestRate" value={input.interestRate} onChange={handleChange} />
                                    <Select onValueChange={() => { }} defaultValue="manual">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Find A Rate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="manual">Manual</SelectItem>
                                            <SelectItem value="find">Find A Rate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button className='w-full p-5' onClick={handleCalculate}>Calculate</Button>
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
                                <h2 className="text-4xl font-bold">${result?.monthlyPayment.toFixed(2)}</h2>
                            </div>
                            <div>
                                <p>Total Principal Paid</p>
                                <p>${result?.totalPrincipal.toFixed(2)}</p>
                                <p>Total Interest Paid</p>
                                <p>${result?.totalInterest.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button variant="link">Compare Loan Rates</Button>
                            <Button variant="link">See amortization schedule</Button>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={result?.amortizationSchedule}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="balance" stroke="#3498db" name="Balance" />
                                <Line type="monotone" dataKey="interest" stroke="#2ecc71" name="Interest" />
                                <Line type="monotone" dataKey="principal" stroke="#e74c3c" name="Principal" />
                            </LineChart>
                        </ResponsiveContainer>
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
                                            <TableCell>${item.interest.toFixed(2)}</TableCell>
                                            <TableCell>${item.principal.toFixed(2)}</TableCell>
                                            <TableCell>${item.balance.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </Wrapper>
    );
}
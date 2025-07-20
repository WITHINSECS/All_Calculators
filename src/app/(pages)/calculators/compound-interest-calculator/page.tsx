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
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import Wrapper from '@/app/Wrapper';

interface InvestmentInput {
    initialInvestment: number;
    interestRate: number;
    compoundFrequency: number;
    years: number;
    months: number;
    depositAmount: number;
    annualDepositIncrease: number;
    additionalContributions: 'none' | 'deposits' | 'withdrawals' | 'both';
}

interface InvestmentResult {
    futureValue: number;
    totalInterest: number;
    yearlyBreakdown: { year: number; interest: number; accrued: number; balance: number }[];
}

const calculateInvestment = (input: InvestmentInput): InvestmentResult => {
    let balance = input.initialInvestment;
    const compoundPerYear = input.compoundFrequency;
    const totalMonths = input.years * 12 + input.months;
    const monthlyRate = input.interestRate / 100 / compoundPerYear;
    const depositInterval = input.additionalContributions === 'deposits' ? 1 : 0;
    const yearlyBreakdown = [];

    for (let month = 0; month <= totalMonths; month++) {
        if (month > 0 && month % 12 === 0) {
            const year = Math.floor(month / 12);
            const interest = balance * monthlyRate * compoundPerYear;
            const accrued: number = (yearlyBreakdown[year - 1]?.accrued || 0) + interest;
            balance += interest;
            if (input.additionalContributions === 'deposits') {
                const deposit = input.depositAmount * (1 + input.annualDepositIncrease / 100) ** (year - 1);
                balance += deposit;
            }
            yearlyBreakdown.push({ year, interest, accrued, balance });
        }
        balance *= Math.pow(1 + monthlyRate, 1);
    }

    const futureValue = balance;
    const totalInterest = futureValue - input.initialInvestment;

    return {
        futureValue,
        totalInterest,
        yearlyBreakdown,
    };
};

export default function InvestmentCalculator() {
    const [input, setInput] = useState<InvestmentInput>({
        initialInvestment: 5000,
        interestRate: 5,
        compoundFrequency: 12,
        years: 5,
        months: 0,
        depositAmount: 0,
        annualDepositIncrease: 0,
        additionalContributions: 'none',
    });
    const [result, setResult] = useState<InvestmentResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: Number(value) }));
    };

    // Handle compound frequency change
    const handleCompoundFrequencyChange = (value: string) => {
        setInput((prev) => ({
            ...prev,
            compoundFrequency: value === 'monthly' ? 12 : 1,
        }));
    };

    // Handle additional contributions change
    const handleContributionsChange = (value: 'none' | 'deposits' | 'withdrawals' | 'both') => {
        setInput((prev) => ({
            ...prev,
            additionalContributions: value,
        }));
    };

    const handleCalculate = () => {
        const calcResult = calculateInvestment(input);
        setResult(calcResult);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Compound Interest Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Investment Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label>Initial investment</label>
                                        <Input className='mt-1 mb-3' name="initialInvestment" value={input.initialInvestment} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Interest rate</label>
                                        <Input className='mt-1 mb-3' name="interestRate" value={input.interestRate} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className='mb-1 block'>Compound frequency</label>
                                        <Select onValueChange={handleCompoundFrequencyChange} defaultValue="monthly">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select frequency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly (12/yr)</SelectItem>
                                                <SelectItem value="yearly">Yearly (1/yr)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div>
                                            <label>Years</label>
                                            <Input className='mt-1 mb-3' name="years" value={input.years} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label>Months</label>
                                            <Input className='mt-1 mb-3' name="months" value={input.months} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Additional Contributions</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label className='mb-1 block'>Additional contributions</label>
                                        <Select onValueChange={handleContributionsChange} defaultValue="none">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="deposits">Deposits</SelectItem>
                                                <SelectItem value="withdrawals">Withdrawals</SelectItem>
                                                <SelectItem value="both">Both</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {input.additionalContributions === 'deposits' && (
                                        <>
                                            <div>
                                                <label>Deposit amount</label>
                                                <Input className='mt-1 mb-3' name="depositAmount" value={input.depositAmount} onChange={handleChange} />
                                            </div>
                                            <div>
                                                <label>Annual deposit % increase</label>
                                                <Input className='mt-1 mb-3' name="annualDepositIncrease" value={input.annualDepositIncrease} onChange={handleChange} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button className='p-5 w-full' onClick={handleCalculate}>Calculate</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className='mt-5'>
                    <CardHeader>
                        <CardTitle className='text-xl'>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table className="mb-6">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Future investment value</TableCell>
                                    <TableCell className="text-right">
                                        ${result?.futureValue.toFixed(2) ?? '0.00'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total interest earned</TableCell>
                                    <TableCell className="text-right">
                                        ${result?.totalInterest.toFixed(2) ?? '0.00'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Initial balance</TableCell>
                                    <TableCell className="text-right">
                                        ${input.initialInvestment.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Yearly rate → Compounded rate</TableCell>
                                    <TableCell className="text-right">5% → 5.12%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>All-time rate of return (RoR)</TableCell>
                                    <TableCell className="text-right">28.34%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Time needed to double investment</TableCell>
                                    <TableCell className="text-right">13 years, 11 months</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={result?.yearlyBreakdown}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="balance" stroke="#82ca9d" name="Balance" />
                                <Line type="monotone" dataKey="accrued" stroke="#8884d8" name="Accrued Interest" />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Yearly Breakdown</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Year</TableHead>
                                        <TableHead className="text-right">Interest</TableHead>
                                        <TableHead className="text-right">Accrued Interest</TableHead>
                                        <TableHead className="text-right">Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result?.yearlyBreakdown.map((item) => (
                                        <TableRow key={item.year}>
                                            <TableCell>{item.year}</TableCell>
                                            <TableCell className="text-right">${item.interest.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">${item.accrued.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">${item.balance.toFixed(2)}</TableCell>
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
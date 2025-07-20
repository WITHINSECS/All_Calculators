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
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Wrapper from '@/app/Wrapper';

interface RetirementInput {
    currentAge: number;
    currentSalary: number;
    current401kBalance: number;
    contribution: number;
    employerMatch: number;
    employerMatchLimit: number;
    retirementAge: number;
    lifeExpectancy: number;
    salaryIncrease: number;
    annualReturn: number;
    inflationRate: number;
}

interface RetirementResult {
    balance: number;
    totalContributions: number;
    employeeContributions: number;
    employerMatch: number;
    investmentReturns: number;
    inflationAdjusted: number;
    chartData: { age: number; balance: number }[];
}

const calculateRetirement = (input: RetirementInput): RetirementResult => {
    const yearsToRetire = input.retirementAge - input.currentAge;
    let balance = input.current401kBalance;
    let totalContributions = 0;
    let employeeContributions = 0;
    let employerMatch = 0;

    for (let age = input.currentAge; age <= input.retirementAge; age++) {
        const salary = input.currentSalary * Math.pow(1 + input.salaryIncrease / 100, age - input.currentAge);
        const contribution = salary * (input.contribution / 100);
        const match = Math.min(contribution * (input.employerMatch / 100), salary * (input.employerMatchLimit / 100));
        balance += contribution + match;

        const yearsInvested = age - input.currentAge + 1;
        balance *= Math.pow(1 + input.annualReturn / 100, 1);
        totalContributions += contribution + match;
        employeeContributions += contribution;
        employerMatch += match;
    }

    const inflationAdjusted = balance / Math.pow(1 + input.inflationRate / 100, yearsToRetire);
    const data = [];
    let runningBalance = input.current401kBalance;
    for (let age = input.currentAge; age <= input.retirementAge; age++) {
        data.push({ age, balance: runningBalance });
        const salary = input.currentSalary * Math.pow(1 + input.salaryIncrease / 100, age - input.currentAge);
        const contribution = salary * (input.contribution / 100);
        const match = Math.min(contribution * (input.employerMatch / 100), salary * (input.employerMatchLimit / 100));
        runningBalance += contribution + match;
        runningBalance *= Math.pow(1 + input.annualReturn / 100, 1);
    }

    return {
        balance,
        totalContributions,
        employeeContributions,
        employerMatch,
        investmentReturns: balance - totalContributions,
        inflationAdjusted,
        chartData: data,
    };
};

export default function Page() {
    const [input, setInput] = useState<RetirementInput>({
        currentAge: 30,
        currentSalary: 75000,
        current401kBalance: 35000,
        contribution: 10,
        employerMatch: 50,
        employerMatchLimit: 3,
        retirementAge: 65,
        lifeExpectancy: 85,
        salaryIncrease: 3,
        annualReturn: 6,
        inflationRate: 3,
    });
    const [result, setResult] = useState<RetirementResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleCalculate = () => {
        const calcResult = calculateRetirement(input);
        setResult(calcResult);
    };

    return (
        <Wrapper>
            <div className="container  mx-auto p-5 lg:px-12 md:my-14 my-8">

                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        401(k) Retirement Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Retirement Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label>Current age</label>
                                        <Input className='mt-1 mb-3' name="currentAge" value={input.currentAge} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Current annual salary</label>
                                        <Input className='mt-1 mb-3' name="currentSalary" value={input.currentSalary} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Current 401(k) balance</label>
                                        <Input className='mt-1 mb-3' name="current401kBalance" value={input.current401kBalance} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Contribution (% of salary)</label>
                                        <Input className='mt-1 mb-3' name="contribution" value={input.contribution} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Employer match</label>
                                        <Input className='mt-1 mb-3' name="employerMatch" value={input.employerMatch} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Employer match limit</label>
                                        <Input className='mt-1 mb-3' name="employerMatchLimit" value={input.employerMatchLimit} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Projections</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label>Expected retirement age</label>
                                        <Input className='mt-1 mb-3' name="retirementAge" value={input.retirementAge} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Life expectancy</label>
                                        <Input className='mt-1 mb-3' name="lifeExpectancy" value={input.lifeExpectancy} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Expected salary increase</label>
                                        <Input className='mt-1 mb-3' name="salaryIncrease" value={input.salaryIncrease} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Expected annual return</label>
                                        <Input className='mt-1 mb-3' name="annualReturn" value={input.annualReturn} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Expected inflation rate</label>
                                        <Input className='mt-1 mb-3' name="inflationRate" value={input.inflationRate} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button className='w-full !p-5' onClick={handleCalculate}>Calculate</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className='mt-6'>
                    <CardHeader>
                        <CardTitle className='text-xl'>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>At the retirement age of {input.retirementAge}, the 401(k) balance will be ${result?.balance.toFixed(0)}, which is equivalent to ${result?.inflationAdjusted.toFixed(0)} in purchasing power today.</p>
                        <ResponsiveContainer className={"mt-5"} width="100%" height={300}>
                            <LineChart data={result?.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Balance at {input.retirementAge}</TableCell>
                                        <TableCell className="text-right">
                                            ${result?.balance.toFixed(0)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total contributions</TableCell>
                                        <TableCell className="text-right">
                                            ${result?.totalContributions.toFixed(0)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Employee contributions</TableCell>
                                        <TableCell className="text-right">
                                            ${result?.employeeContributions.toFixed(0)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Employer match</TableCell>
                                        <TableCell className="text-right">
                                            ${result?.employerMatch.toFixed(0)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Investment returns</TableCell>
                                        <TableCell className="text-right">
                                            ${result?.investmentReturns.toFixed(0)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}
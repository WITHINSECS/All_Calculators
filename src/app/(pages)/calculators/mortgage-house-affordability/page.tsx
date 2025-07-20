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
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import Wrapper from '@/app/Wrapper';

interface MortgageInput {
    annualIncome: number;
    monthlyDebts: number;
    downPayment: number;
    debtToIncome: number;
    interestRate: number;
    loanTerm: number;
    includePMI: boolean;
    includeTaxesInsurance: boolean;
    propertyTax: number;
    homeInsurance: number;
    hoaDues: number;
}

interface MortgageResult {
    maxHomePrice: number;
    monthlyPayment: number;
    paymentBreakdown: { name: string; value: number }[];
}

const calculateMortgage = (input: MortgageInput): MortgageResult => {
    const maxLoan = input.annualIncome * 0.28 / 12; // 28% of monthly income rule
    const totalDebts = input.monthlyDebts;
    const affordablePayment = maxLoan - totalDebts;
    const maxHomePrice = (affordablePayment * (input.loanTerm * 12) * (1 + input.interestRate / 100)) / (input.loanTerm * 12);

    const principalAndInterest = (maxHomePrice - input.downPayment) * (input.interestRate / 100) / 12 * (1 + input.interestRate / 100) ** input.loanTerm / ((1 + input.interestRate / 100) ** input.loanTerm - 1);
    let monthlyPayment = principalAndInterest;
    const breakdown: { name: string; value: number }[] = [{ name: "Principal & Interest", value: principalAndInterest }];

    if (input.includePMI && input.downPayment / maxHomePrice < 0.2) {
        const pmi = principalAndInterest * 0.01; // 1% PMI estimate
        monthlyPayment += pmi;
        breakdown.push({ name: "PMI", value: pmi });
    }

    if (input.includeTaxesInsurance) {
        const propertyTax = maxHomePrice * (input.propertyTax / 100) / 12;
        const insurance = input.homeInsurance / 12;
        monthlyPayment += propertyTax + insurance;
        breakdown.push({ name: "Taxes", value: propertyTax });
        breakdown.push({ name: "Insurance", value: insurance });
    }

    monthlyPayment += input.hoaDues;
    if (input.hoaDues > 0) {
        breakdown.push({ name: "HOA Dues", value: input.hoaDues });
    }

    return {
        maxHomePrice,
        monthlyPayment,
        paymentBreakdown: breakdown,
    };
};

export default function Page() {
    const [input, setInput] = useState<MortgageInput>({
        annualIncome: 70000,
        monthlyDebts: 250,
        downPayment: 20,
        debtToIncome: 36,
        interestRate: 7,
        loanTerm: 360,
        includePMI: true,
        includeTaxesInsurance: true,
        propertyTax: 1.2,
        homeInsurance: 945,
        hoaDues: 0,
    });
    const [result, setResult] = useState<MortgageResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setInput((prev) => ({ ...prev, [name]: checked }));
    };

    const handleCalculate = () => {
        const calcResult = calculateMortgage(input);
        setResult(calcResult);
    };

    return (
        <Wrapper>
            <div className="container  mx-auto p-5 lg:px-12 md:my-14 my-8">

                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Mortgage House Affordability Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl'>Mortgage Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label>Annual income</label>
                                        <Input className='mt-1 mb-3' name="annualIncome" value={input.annualIncome} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Monthly debts</label>
                                        <Input className='mt-1 mb-3' name="monthlyDebts" value={input.monthlyDebts} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Down payment</label>
                                        <Input className='mt-1 mb-3' name="downPayment" value={input.downPayment} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Debt-to-income</label>
                                        <Input className='mt-1 mb-3' name="debtToIncome" value={input.debtToIncome} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Interest rate</label>
                                        <Input className='mt-1 mb-3' name="interestRate" value={input.interestRate} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Loan term</label>
                                        <Input className='mt-1 mb-3' name="loanTerm" value={input.loanTerm} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Additional Info</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="includePMI"
                                                checked={input.includePMI}
                                                onChange={handleCheckbox}
                                            /> Include PMI
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="includeTaxesInsurance"
                                                checked={input.includeTaxesInsurance}
                                                onChange={handleCheckbox}
                                            /> Include taxes/insurance
                                        </label>
                                    </div>
                                    <div>
                                        <label>Property tax</label>
                                        <Input className='mt-1 mb-3' name="propertyTax" value={input.propertyTax} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Home insurance</label>
                                        <Input className='mt-1 mb-3' name="homeInsurance" value={input.homeInsurance} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>HOA dues</label>
                                        <Input className='mt-1 mb-3' name="hoaDues" value={input.hoaDues} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button className='w-full p-5' onClick={handleCalculate}>Calculate</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className='mt-5'>
                    <CardHeader>
                        <CardTitle className='text-xl'>Results</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-x-hidden'>
                        <p>You can afford a house up to ${result?.maxHomePrice.toFixed(0)} based on your income, a house at this price should fit comfortably within your budget.</p>
                        <p>Payment: ${result?.monthlyPayment.toFixed(0)}/mo</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={result?.paymentBreakdown}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {result?.paymentBreakdown.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#1f1f1f', '#2c2c2c', '#3a3a3a', '#4d4d4d', '#5a5a5a'][index % 5]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </Wrapper>

    );
}
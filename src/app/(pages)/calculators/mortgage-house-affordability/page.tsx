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
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import Wrapper from "@/app/Wrapper";

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
    const monthlyIncome = input.annualIncome / 12;
    const maxLoanAmount = (monthlyIncome * 0.28) - input.monthlyDebts; // 28% of monthly income minus debts

    // Using the mortgage formula to calculate monthly payment
    const loanAmount = maxLoanAmount - input.downPayment;
    const monthlyInterestRate = input.interestRate / 100 / 12;
    const numPayments = input.loanTerm * 12;

    // Monthly mortgage payment calculation (Principal & Interest)
    const principalAndInterest = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments)) /
        (Math.pow(1 + monthlyInterestRate, numPayments) - 1);

    let monthlyPayment = principalAndInterest;
    const paymentBreakdown: { name: string; value: number }[] = [
        { name: "Principal & Interest", value: principalAndInterest }
    ];

    // PMI calculation (only if down payment is less than 20%)
    if (input.includePMI && (input.downPayment / maxLoanAmount) < 0.2) {
        const pmi = loanAmount * 0.01 / 12; // PMI is generally 1% of the loan amount per year, divided by 12
        monthlyPayment += pmi;
        paymentBreakdown.push({ name: "PMI", value: pmi });
    }

    // Include property taxes and insurance
    if (input.includeTaxesInsurance) {
        const propertyTax = (maxLoanAmount * (input.propertyTax / 100)) / 12;
        const homeInsurance = input.homeInsurance / 12;
        monthlyPayment += propertyTax + homeInsurance;
        paymentBreakdown.push({ name: "Taxes", value: propertyTax });
        paymentBreakdown.push({ name: "Home Insurance", value: homeInsurance });
    }

    // HOA dues
    if (input.hoaDues > 0) {
        monthlyPayment += input.hoaDues;
        paymentBreakdown.push({ name: "HOA Dues", value: input.hoaDues });
    }

    return {
        maxHomePrice: maxLoanAmount,
        monthlyPayment,
        paymentBreakdown,
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
        includeTaxesInsurance: false,
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
                        <CardTitle className="text-xl">Mortgage Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
                                <div className="space-y-2">
                                    <div>
                                        <label>Annual income</label>
                                        <Input
                                            className="mt-1 mb-3"
                                            name="annualIncome"
                                            value={input.annualIncome}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Monthly debts</label>
                                        <Input
                                            className="mt-1 mb-3"
                                            name="monthlyDebts"
                                            value={input.monthlyDebts}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Down payment</label>
                                        <Input
                                            className="mt-1 mb-3"
                                            name="downPayment"
                                            value={input.downPayment}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Debt-to-income</label>
                                        <Input
                                            className="mt-1 mb-3"
                                            name="debtToIncome"
                                            value={input.debtToIncome}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Interest rate</label>
                                        <Input
                                            className="mt-1 mb-3"
                                            name="interestRate"
                                            value={input.interestRate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Loan term</label>
                                        <Input
                                            className="mt-1 mb-3"
                                            name="loanTerm"
                                            value={input.loanTerm}
                                            onChange={handleChange}
                                        />
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
                                            />{" "}
                                            Include PMI
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="includeTaxesInsurance"
                                                checked={input.includeTaxesInsurance}
                                                onChange={handleCheckbox}
                                            />{" "}
                                            Include taxes/insurance
                                        </label>
                                    </div>
                                    {input.includeTaxesInsurance && (
                                        <>
                                            <div>
                                                <label>Property tax</label>
                                                <Input
                                                    className="mt-1 mb-3"
                                                    name="propertyTax"
                                                    value={input.propertyTax}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Home insurance</label>
                                                <Input
                                                    className="mt-1 mb-3"
                                                    name="homeInsurance"
                                                    value={input.homeInsurance}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>HOA dues</label>
                                                <Input
                                                    className="mt-1 mb-3"
                                                    name="hoaDues"
                                                    value={input.hoaDues}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button className="w-full p-5" onClick={handleCalculate}>
                                Calculate
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Display Results in Table */}
                {result && (
                    <Card className="mt-5">
                        <CardHeader>
                            <CardTitle className="text-xl">Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">Description</th>
                                            <th className="px-4 py-2 text-left">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2">Max Home Price</td>
                                            <td className="px-4 py-2">${result.maxHomePrice.toFixed(0)}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2">Monthly Payment</td>
                                            <td className="px-4 py-2">${result.monthlyPayment.toFixed(0)}</td>
                                        </tr>
                                        {result.paymentBreakdown.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2">{item.name}</td>
                                                <td className="px-4 py-2">${item.value.toFixed(0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pie Chart */}
                {result && (
                    <Card className="mt-5">
                        <CardHeader>
                            <CardTitle className="text-xl">Payment Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={result.paymentBreakdown}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {result.paymentBreakdown.map((entry, index) => (
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
                )}
            </div>
        </Wrapper>
    );
}

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
import { Label } from "@/components/ui/label";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Wrapper from '@/app/Wrapper';

interface TVMInput {
    mode: 'end' | 'beginning';
    presentValue: number;
    payments: number;
    futureValue: number;
    annualRate: number;
    periods: number;
    compounding: number;
}

interface TVMResult {
    calculatedValue: number;
    type: 'PV' | 'PMT' | 'FV' | 'Rate' | 'Periods';
    chartData: { period: number; value: number }[];
}

const calculateTVM = (input: TVMInput): TVMResult | null => {
    if (input.presentValue < 0 || input.payments < 0 || input.futureValue < 0 || input.annualRate < 0 || input.periods < 0 || input.compounding <= 0) {
        return null;
    }
    let calculatedValue = 0;
    let type: 'PV' | 'PMT' | 'FV' | 'Rate' | 'Periods' = 'PV';
    const monthlyRate = input.annualRate / 100 / (input.compounding || 12);
    const totalPeriods = input.periods;

    if (totalPeriods === 0 && input.annualRate === 0) return null;
    if (monthlyRate <= 0 && input.periods > 0) return null;

    if (input.presentValue === 0) {
        calculatedValue = input.payments * (((1 + monthlyRate) ** totalPeriods - 1) / monthlyRate) * (input.mode === 'beginning' ? 1 + monthlyRate : 1);
        type = 'PV';
    } else if (input.payments === 0) {
        calculatedValue = input.presentValue * (1 + monthlyRate) ** totalPeriods - input.futureValue;
        type = 'PMT';
    } else if (input.futureValue === 0) {
        calculatedValue = input.presentValue * (1 + monthlyRate) ** totalPeriods - input.payments * (((1 + monthlyRate) ** totalPeriods - 1) / monthlyRate) * (input.mode === 'beginning' ? 1 + monthlyRate : 1);
        type = 'FV';
    } else if (input.annualRate === 0) {
        calculatedValue = Math.log(input.futureValue / input.presentValue + input.payments / (input.presentValue * monthlyRate)) / Math.log(1 + monthlyRate) / (input.compounding || 12);
        type = 'Rate';
    } else if (input.periods === 0) {
        calculatedValue = Math.log(input.futureValue / input.presentValue + input.payments / (input.presentValue * monthlyRate)) / Math.log(1 + monthlyRate);
        type = 'Periods';
    }

    const chartData = [];
    for (let period = 0; period <= totalPeriods; period++) {
        let value = input.presentValue || 0;
        if (input.payments !== 0) {
            value += input.payments * (((1 + monthlyRate) ** period - 1) / monthlyRate) * (input.mode === 'beginning' ? 1 + monthlyRate : 1);
        }
        value *= (1 + monthlyRate) ** period;
        chartData.push({ period, value });
    }

    return { calculatedValue, type, chartData };
};

export default function TVMCalculator() {
    const [input, setInput] = useState<TVMInput>({
        mode: 'end',
        presentValue: 0,
        payments: 0,
        futureValue: 0,
        annualRate: 0,
        periods: 0,
        compounding: 12,
    });
    const [result, setResult] = useState<TVMResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = value === '' ? 0 : Number(value);
        if (numValue < 0) {
            setError('All values must be non-negative.');
            return;
        }
        setInput((prev) => ({ ...prev, [name]: numValue }));
        setError(null);
    };

    const handleSelectChange = (name: string, value: string) => {
        setInput((prev) => ({ ...prev, [name]: value === 'monthly' ? 12 : value === 'quarterly' ? 4 : value === 'yearly' ? 1 : 12 }));
    };

    const handleRadioChange = (value: string) => {
        setInput((prev) => ({ ...prev, mode: value as 'end' | 'beginning' }));
    };

    const handleCalculate = () => {
        const calcResult = calculateTVM(input);
        if (!calcResult) {
            setError('Invalid input: Ensure at least one value is provided and all are non-negative. Rate or periods cannot be zero when others are set.');
            setResult(null);
        } else {
            setResult(calcResult);
            setError(null);
        }
    };

    const reset = () => {
        setInput({
            mode: 'end',
            presentValue: 0,
            payments: 0,
            futureValue: 0,
            annualRate: 0,
            periods: 0,
            compounding: 12,
        });
        setResult(null);
        setError(null);
    };

    return (
        <Wrapper>
            <div className="container  mx-auto p-5 lg:px-12 md:my-14 my-8">

                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        TVM Calculator
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>TVM Calculator</CardTitle>
                        <Button variant="outline" className="ml-auto">Advanced Version</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label className='mb-5 block'>Mode</Label>
                                <RadioGroup value={input.mode} onValueChange={handleRadioChange} className="flex space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="end" id="end" />
                                        <Label htmlFor="end">End</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="beginning" id="beginning" />
                                        <Label htmlFor="beginning">Beginning</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="grid items-center grid-cols-2 gap-4">
                                <div>
                                    <Label>Present Value</Label>
                                    <Input className='mt-1 mb-3' name="presentValue" value={input.presentValue} onChange={handleChange} />
                                </div>
                                <div>
                                    <Button variant="outline" disabled>PV</Button>
                                </div>
                                <div>
                                    <Label>Payments</Label>
                                    <Input className='mt-1 mb-3' name="payments" value={input.payments} onChange={handleChange} />
                                </div>
                                <div>
                                    <Button variant="outline" disabled>PMT</Button>
                                </div>
                                <div>
                                    <Label>Future Value</Label>
                                    <Input className='mt-1 mb-3' name="futureValue" value={input.futureValue} onChange={handleChange} />
                                </div>
                                <div>
                                    <Button variant="outline" disabled>FV</Button>
                                </div>
                                <div>
                                    <Label>Annual Rate (%)</Label>
                                    <Input className='mt-1 mb-3' name="annualRate" value={input.annualRate} onChange={handleChange} />
                                </div>
                                <div>
                                    <Button variant="outline" disabled>Rate</Button>
                                </div>
                                <div>
                                    <Label>Periods</Label>
                                    <Input className='mt-1 mb-3' name="periods" value={input.periods} onChange={handleChange} />
                                </div>
                                <div>
                                    <Button variant="outline" disabled>Periods</Button>
                                </div>
                                <div>
                                    <Label className='block mb-2'>Compounding</Label>
                                    <Select onValueChange={(value) => handleSelectChange('compounding', value)} defaultValue="monthly">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select compounding" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex justify-end space-x-2">
                                <Button onClick={handleCalculate}>Calculate</Button>
                                <Button variant="outline" onClick={reset}>Reset</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='mt-5'>
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Calculated {result?.type}: ${result?.calculatedValue.toFixed(2)}</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={result?.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Value" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </Wrapper>
    );
}
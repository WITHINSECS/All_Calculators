'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Wrapper from '@/app/Wrapper';

export default function SalaryCalculator() {
    const [hoursPerWeek, setHoursPerWeek] = useState(40);
    const [weeksPerYear, setWeeksPerYear] = useState(52);
    const [hourlyWage, setHourlyWage] = useState(800);
    const [tax, setTax] = useState(12);

    const [annualIncome, setAnnualIncome] = useState(0);
    const [netHourlyWage, setNetHourlyWage] = useState(0);
    const [netAnnualIncome, setNetAnnualIncome] = useState(0);

    useEffect(() => {
        const grossAnnual = hoursPerWeek * weeksPerYear * hourlyWage;
        const taxMultiplier = (100 - tax) / 100;
        const netHourly = hourlyWage * taxMultiplier;
        const netAnnual = grossAnnual * taxMultiplier;

        setAnnualIncome(grossAnnual);
        setNetHourlyWage(netHourly);
        setNetAnnualIncome(netAnnual);
    }, [hoursPerWeek, weeksPerYear, hourlyWage, tax]);

    const reset = () => {
        setHoursPerWeek(40);
        setWeeksPerYear(52);
        setHourlyWage(800);
        setTax(12);
    };

    return (
        <Wrapper>
            <div className="container max-w-7xl mx-auto p-5 lg:px-12 md:my-14 my-8">
                <div className="mx-auto max-w-3xl text-center mb-8">
                    <h1 className="text-2xl font-semibold lg:text-4xl">
                        Savings Goal Calculators
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto p-6 border rounded-lg space-y-6">
                    <h2 className="text-xl font-bold">Salary Calculator</h2>

                    <div className="space-y-4">
                        <div>
                            <Label className='block mb-1.5'>Working hours per week</Label>
                            <Input
                                type="number"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(parseFloat(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label className='block mb-1.5'>Working weeks per year</Label>
                            <Input
                                type="number"
                                value={weeksPerYear}
                                onChange={(e) => setWeeksPerYear(parseFloat(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label className='block mb-1.5'>Hourly wage</Label>
                            <Input
                                type="number"
                                value={hourlyWage}
                                onChange={(e) => setHourlyWage(parseFloat(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label className='block mb-1.5'>Annual income</Label>
                            <Input type="text" value={`${annualIncome.toLocaleString()}`} readOnly />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Net salary</h3>

                        <div>
                            <Label className='block mb-1.5'>Tax (%)</Label>
                            <Input
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(parseFloat(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label className='block mb-1.5'>Net hourly wage</Label>
                            <Input type="text" value={`${netHourlyWage.toFixed(2)}`} readOnly />
                        </div>

                        <div>
                            <Label className='block mb-1.5'>Net annual income</Label>
                            <Input type="text" value={`${netAnnualIncome.toLocaleString()}`} readOnly />
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                        <Button variant="outline" onClick={reset}>
                            Reload calculator
                        </Button>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Clear all changes
                        </Button>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

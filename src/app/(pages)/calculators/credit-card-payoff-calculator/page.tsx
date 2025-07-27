"use client";
import Wrapper from '@/app/Wrapper';
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Label as RechartsLabel } from "recharts";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Colors for the Pie chart
const COLORS = ["#0D74FF", "#FF5733"];

const DebtCalculator = () => {
    // States to hold user input
    const [balance, setBalance] = useState(2000);
    const [interestRate, setInterestRate] = useState(15);
    const [monthlyPayment, setMonthlyPayment] = useState(45);

    // Calculated states
    const [numPayments, setNumPayments] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [principalPaid, setPrincipalPaid] = useState(0);
    const [interestPaid, setInterestPaid] = useState(0);

    // Function to calculate debt repayment plan
    const calculateDebt = () => {
        let balanceRemaining = balance;
        let totalInterestPaid = 0;
        let totalPrincipalPaid = 0;
        let numPaymentsCount = 0;
        let adjustedMonthlyPayment = monthlyPayment;

        // While the balance is still above 0
        while (balanceRemaining > 0) {
            const interestForThisMonth = balanceRemaining * (interestRate / 100) / 12;
            let principalForThisMonth = adjustedMonthlyPayment - interestForThisMonth;

            if (principalForThisMonth > balanceRemaining) {
                principalForThisMonth = balanceRemaining;
                adjustedMonthlyPayment = principalForThisMonth + interestForThisMonth; // Adjust final payment
            }

            balanceRemaining -= principalForThisMonth;
            totalPrincipalPaid += principalForThisMonth;
            totalInterestPaid += interestForThisMonth;
            numPaymentsCount++;

            // Break if the payment period exceeds an unreasonable number of months
            if (numPaymentsCount > 1200) break; // Avoid infinite loops in edge cases
        }

        setNumPayments(numPaymentsCount);
        setTotalInterest(totalInterestPaid);
        setTotalPayment(totalPrincipalPaid + totalInterestPaid);
        setPrincipalPaid(totalPrincipalPaid);
        setInterestPaid(totalInterestPaid);
    };

    useEffect(() => {
        calculateDebt();
    }, [balance, interestRate, monthlyPayment]);

    // Calculate percentages for principal and interest
    const principalPercentage = (principalPaid / totalPayment) * 100;
    const interestPercentage = (interestPaid / totalPayment) * 100;

    // Pie chart data
    const pieData = [
        { name: "Principal Paid", value: principalPaid, percentage: principalPercentage },
        { name: "Interest Paid", value: interestPaid, percentage: interestPercentage },
    ];

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
                <h1 className="text-2xl font-semibold lg:text-4xl">
                    Debt Repayment Calculator
                </h1>
                <p className="text-muted-foreground mt-4 text-xl">
                    This tool helps you calculate the total time and amount it will take to pay off your debt based on your balance, interest rate, and monthly payments.
                </p>
            </div>

            <div className="max-w-6xl lg:px-12 w-full mx-auto p-4">
                {/* Inputs for user to change values */}
                <div className="flex items-center justify-center gap-6 md:flex-row flex-col w-full mb-6">
                    <div className="md:w-[60%] space-y-6 w-full">
                        <div>
                            <Label className='black mb-1.5' htmlFor="balance">Credit Card Balance</Label>
                            <Input
                                type="number"
                                id="balance"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label className='black mb-1.5' htmlFor="interest">Interest Rate (APR)</Label>
                            <Input
                                type="number"
                                id="interest"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label className='black mb-1.5' htmlFor="payment">Monthly Payment</Label>
                            <Input
                                type="number"
                                id="payment"
                                value={monthlyPayment}
                                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="md:w-[40%] flex justify-center items-center">
                        <PieChart width={200} height={200}>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            {/* Displaying percentages in the center of the pie chart */}
                            <RechartsLabel value={`${principalPercentage.toFixed(1)}%`} position="center" fontSize={16} fill="#0D74FF" />
                        </PieChart>
                    </div>
                </div>

                {/* Results - Table */}
                <div className="text-center mb-6 md:mt-20 mt-10">
                    <h3 className="font-semibold text-2xl mb-4">Repayment Details</h3>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left">Detail</TableHead>
                                    <TableHead className="">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='text-start'>
                                <TableRow>
                                    <TableCell className="font-medium">You will pay off your debt by</TableCell>
                                    <TableCell>January {new Date().getFullYear() + 6}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Number of payments</TableCell>
                                    <TableCell>{numPayments}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Estimated monthly payment</TableCell>
                                    <TableCell>${monthlyPayment.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Total interest paid</TableCell>
                                    <TableCell>${totalInterest.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Total payments</TableCell>
                                    <TableCell>${totalPayment.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Principal paid (%)</TableCell>
                                    <TableCell>{principalPercentage.toFixed(1)}%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Interest paid (%)</TableCell>
                                    <TableCell>{interestPercentage.toFixed(1)}%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default DebtCalculator;
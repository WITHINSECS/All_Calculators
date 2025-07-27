"use client";
import Wrapper from '@/app/Wrapper';
import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Colors for the Pie chart
const COLORS = ["#0D74FF", "#FF5733", "#2D94A0", "#FFB900"];

const Page = () => {
    // States to hold user input and calculated values
    const [homePrice, setHomePrice] = useState(400000);
    const [downPaymentPercent, setDownPaymentPercent] = useState(20); // Ensure this is a number
    const [loanTerm, setLoanTerm] = useState(30);
    const [interestRate, setInterestRate] = useState(6.732);
    const [startDate, setStartDate] = useState(new Date());
    const [propertyTaxes, setPropertyTaxes] = useState(1.2);
    const [homeInsurance, setHomeInsurance] = useState(1500);
    const [pmiInsurance, setPmiInsurance] = useState(0);
    const [hoaFee, setHoaFee] = useState(0);
    const [otherCosts, setOtherCosts] = useState(4000);

    // Calculated values as numbers (no toFixed here)
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalOutOfPocket, setTotalOutOfPocket] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [loanAmount, setLoanAmount] = useState(0);

    // Function to calculate mortgage details
    const calculateMortgage = () => {
        const loanAmount = homePrice * (1 - downPaymentPercent / 100);
        setLoanAmount(loanAmount);

        // Monthly Interest Rate
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        // Mortgage Payment Formula
        const mortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

        // Property Taxes & Home Insurance per month
        const propertyTaxPayment = (homePrice * propertyTaxes / 100) / 12;
        const homeInsurancePayment = homeInsurance / 12;
        const totalOtherCosts = (hoaFee + otherCosts + pmiInsurance) / 12;

        // Monthly payment breakdown
        const totalMonthlyPayment = mortgagePayment + propertyTaxPayment + homeInsurancePayment + totalOtherCosts;

        // Calculate total out of pocket
        const totalOutOfPocket = totalMonthlyPayment * numberOfPayments;
        const totalPayment = mortgagePayment * numberOfPayments + propertyTaxPayment * numberOfPayments + homeInsurancePayment * numberOfPayments + totalOtherCosts * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;

        // Set calculated values (no toFixed here, keep them as numbers)
        setMonthlyPayment(totalMonthlyPayment);
        setTotalOutOfPocket(totalOutOfPocket);
        setTotalPayment(totalPayment);
        setTotalInterest(totalInterest);
    };

    useEffect(() => {
        calculateMortgage();
    }, [homePrice, downPaymentPercent, loanTerm, interestRate, propertyTaxes, homeInsurance, pmiInsurance, hoaFee, otherCosts]);

    // Pie chart data
    const pieData = [
        { name: "Principal & Interest", value: loanAmount },
        { name: "Property Taxes", value: (homePrice * propertyTaxes / 100) },
        { name: "Home Insurance", value: homeInsurance },
        { name: "Other Costs", value: hoaFee + otherCosts + pmiInsurance },
    ];

    return (
        <Wrapper>
            <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
                <h1 className="text-2xl font-semibold lg:text-4xl">
                    Mortgage Calculator
                </h1>
                <p className="text-muted-foreground mt-4 text-xl">
                    This tool helps you calculate your monthly mortgage payments, total out-of-pocket expenses, and more.
                </p>
            </div>

            <div className="md:mb-16 my-6 max-w-5xl mx-auto p-4">
                <div className="flex flex-col gap-6">

                    {/* Left Panel for Inputs */}
                    <div className="space-y-6 w-full">
                        {/* Home Price */}
                        <div>
                            <Label className='block mb-1.5' htmlFor="homePrice">Home Price</Label>
                            <Input
                                type="number"
                                id="homePrice"
                                value={homePrice}
                                onChange={(e) => setHomePrice(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Down Payment */}
                        <div>
                            <Label className='block mb-1.5' htmlFor="downPayment">Down Payment (%)</Label>
                            <Slider
                                value={[downPaymentPercent]} // Wrap the value in an array
                                onValueChange={(val) => setDownPaymentPercent(val[0])} // Handle array value
                                min={0}
                                max={100}
                                step={1}
                            />
                        </div>

                        {/* Loan Term */}
                        <div>
                            <Label className='block mb-1.5' htmlFor="loanTerm">Loan Term (years)</Label>
                            <Input
                                type="number"
                                id="loanTerm"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Interest Rate */}
                        <div>
                            <Label className='block mb-1.5' htmlFor="interestRate">Interest Rate (%)</Label>
                            <Input
                                type="number"
                                id="interestRate"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <Label className='block mb-1.5' htmlFor="startDate">Start Date</Label>
                            <Input
                                type="date"
                                id="startDate"
                                value={format(startDate, 'yyyy-MM-dd')}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Taxes and Costs */}
                        <div>
                            <Label className='block mb-1.5' htmlFor="taxes">Property Taxes (%)</Label>
                            <Input
                                type="number"
                                id="taxes"
                                value={propertyTaxes}
                                onChange={(e) => setPropertyTaxes(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label className='block mb-1.5' htmlFor="insurance">Home Insurance</Label>
                            <Input
                                type="number"
                                id="insurance"
                                value={homeInsurance}
                                onChange={(e) => setHomeInsurance(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label className='block mb-1.5' htmlFor="otherCosts">Other Costs</Label>
                            <Input
                                type="number"
                                id="otherCosts"
                                value={otherCosts}
                                onChange={(e) => setOtherCosts(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Right Panel for Results and Pie Chart */}
                    <div className="flex flex-col justify-center items-center gap-4">
                        {/* Mortgage Payment */}
                        <div className="text-xl">
                            <p>Monthly Pay: ${monthlyPayment.toFixed(2)}</p>
                        </div>
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
                        </PieChart>
                    </div>
                </div>

                {/* Total Payment Breakdown */}
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4 text-center">Loan Summary</h3>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left">Detail</TableHead>
                                    <TableHead className="text-left">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Total Out-of-Pocket</TableCell>
                                    <TableCell>${totalOutOfPocket.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Total Payment</TableCell>
                                    <TableCell>${totalPayment.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Total Interest</TableCell>
                                    <TableCell>${totalInterest.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Loan Amount</TableCell>
                                    <TableCell>${loanAmount.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Mortgage Payoff Date</TableCell>
                                    <TableCell>{format(new Date(startDate), 'MMM yyyy')}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default Page;

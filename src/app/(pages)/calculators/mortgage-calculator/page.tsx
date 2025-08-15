"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Wrapper from "@/app/Wrapper";

const COLORS = ["#0D74FF", "#FF5733", "#2D94A0", "#FFB900"];

const Page = () => {
  const [homePrice, setHomePrice] = useState<string | number>("");
  const [downPaymentPercent, setDownPaymentPercent] = useState<string | number>(
    ""
  );
  const [loanTerm, setLoanTerm] = useState<string | number>("");
  const [interestRate, setInterestRate] = useState<string | number>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [propertyTaxes, setPropertyTaxes] = useState<string | number>("");
  const [homeInsurance, setHomeInsurance] = useState<string | number>("");
  const [pmiInsurance, setPmiInsurance] = useState<string | number>("");
  const [hoaFee, setHoaFee] = useState<string | number>("");
  const [otherCosts, setOtherCosts] = useState<string | number>("");

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalOutOfPocket, setTotalOutOfPocket] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);

  const calculateMortgage = () => {
    const loanAmount = homePrice
      ? Number(homePrice) * (1 - Number(downPaymentPercent) / 100)
      : 0;
    setLoanAmount(loanAmount);

    const monthlyInterestRate = interestRate
      ? Number(interestRate) / 100 / 12
      : 0;
    const numberOfPayments = loanTerm ? Number(loanTerm) * 12 : 0;

    const mortgagePayment =
      loanAmount > 0 && monthlyInterestRate > 0 && numberOfPayments > 0
        ? (loanAmount *
            (monthlyInterestRate *
              Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
        : 0;

    const propertyTaxPayment = homePrice
      ? (Number(homePrice) * Number(propertyTaxes)) / 100 / 12
      : 0;
    const homeInsurancePayment = homeInsurance ? Number(homeInsurance) / 12 : 0;
    const totalOtherCosts =
      hoaFee && otherCosts && pmiInsurance
        ? (Number(hoaFee) + Number(otherCosts) + Number(pmiInsurance)) / 12
        : 0;

    const totalMonthlyPayment =
      mortgagePayment +
      propertyTaxPayment +
      homeInsurancePayment +
      totalOtherCosts;

    const totalOutOfPocket = totalMonthlyPayment * numberOfPayments;
    const totalPayment =
      mortgagePayment * numberOfPayments +
      propertyTaxPayment * numberOfPayments +
      homeInsurancePayment * numberOfPayments +
      totalOtherCosts * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    setMonthlyPayment(totalMonthlyPayment);
    setTotalOutOfPocket(totalOutOfPocket);
    setTotalPayment(totalPayment);
    setTotalInterest(totalInterest);
  };

  useEffect(() => {
    calculateMortgage();
  }, [
    homePrice,
    downPaymentPercent,
    loanTerm,
    interestRate,
    propertyTaxes,
    homeInsurance,
    pmiInsurance,
    hoaFee,
    otherCosts,
  ]);

  const pieData = [
    { name: "Principal & Interest", value: loanAmount },
    {
      name: "Property Taxes",
      value: homePrice ? (Number(homePrice) * Number(propertyTaxes)) / 100 : 0,
    },
    {
      name: "Home Insurance",
      value: homeInsurance ? Number(homeInsurance) : 0,
    },
    {
      name: "Other Costs",
      value:
        (hoaFee ? Number(hoaFee) : 0) +
        (otherCosts ? Number(otherCosts) : 0) +
        (pmiInsurance ? Number(pmiInsurance) : 0),
    },
  ];

  // Handle Down Payment change to ensure 0 disappears
  const handleDownPaymentChange = (value: number | string) => {
    setDownPaymentPercent(typeof value === "string" ? Number(value) : value);
  };

  return (
    <Wrapper>
      <div className="mx-auto md:mt-16 p-5 mt-8 max-w-3xl text-center">
        <h1 className="text-2xl font-semibold lg:text-4xl">
          Mortgage Calculator
        </h1>
        <p className="text-muted-foreground mt-4 text-xl">
          This tool helps you calculate your monthly mortgage payments, total
          out-of-pocket expenses, and more.
        </p>
      </div>

      <div className="md:mb-16 my-6 max-w-5xl mx-auto p-4">
        <div className="flex flex-col gap-6">
          <div className="space-y-6 w-full">
            {/* Home Price */}
            <div>
              <Label className="block mb-1.5" htmlFor="homePrice">
                Home Price
              </Label>
              <Input
                type="number"
                id="homePrice"
                value={homePrice || ""}
                onChange={(e) => setHomePrice(e.target.value)}
                className="w-full"
                placeholder="Enter Home Price"
              />
            </div>

            {/* Down Payment */}
            <div>
              <Label className="block mb-1.5" htmlFor="downPayment">
                Down Payment (%)
              </Label>
              <div className="flex items-center">
                <Slider
                  value={[Number(downPaymentPercent) || 0]} // Always pass a number
                  onValueChange={(val) => handleDownPaymentChange(val[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <Input
                  type="number"
                  id="downPayment"
                  value={downPaymentPercent || ""}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                  className="w-20 ml-4"
                  placeholder="Enter %"
                />
                <span className="ml-2">%</span> {/* Add a percentage symbol */}
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <Label className="block mb-1.5" htmlFor="loanTerm">
                Loan Term (years)
              </Label>
              <Input
                type="number"
                id="loanTerm"
                value={loanTerm || ""}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full"
                placeholder="Enter Loan Term"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <Label className="block mb-1.5" htmlFor="interestRate">
                Interest Rate (%)
              </Label>
              <Input
                type="number"
                id="interestRate"
                value={interestRate || ""}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full"
                placeholder="Enter Interest Rate"
              />
            </div>

            {/* Start Date */}
            <div>
              <Label className="block mb-1.5" htmlFor="startDate">
                Start Date
              </Label>
              <Input
                type="date"
                id="startDate"
                value={format(startDate, "yyyy-MM-dd")}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Taxes and Costs */}
            <div>
              <Label className="block mb-1.5" htmlFor="taxes">
                Property Taxes (%)
              </Label>
              <Input
                type="number"
                id="taxes"
                value={propertyTaxes || ""}
                onChange={(e) => setPropertyTaxes(e.target.value)}
                className="w-full"
                placeholder="Enter Property Taxes"
              />
            </div>

            <div>
              <Label className="block mb-1.5" htmlFor="insurance">
                Home Insurance
              </Label>
              <Input
                type="number"
                id="insurance"
                value={homeInsurance || ""}
                onChange={(e) => setHomeInsurance(e.target.value)}
                className="w-full"
                placeholder="Enter Home Insurance"
              />
            </div>

            <div>
              <Label className="block mb-1.5" htmlFor="otherCosts">
                Other Costs
              </Label>
              <Input
                type="number"
                id="otherCosts"
                value={otherCosts || ""}
                onChange={(e) => setOtherCosts(e.target.value)}
                className="w-full"
                placeholder="Enter Other Costs"
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Total Payment Breakdown */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-4 text-center">
            Loan Summary
          </h3>
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
                  <TableCell className="font-medium">
                    Total Out-of-Pocket
                  </TableCell>
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
                  <TableCell className="font-medium">
                    Mortgage Payoff Date
                  </TableCell>
                  <TableCell>
                    {format(new Date(startDate), "MMM yyyy")}
                  </TableCell>
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
